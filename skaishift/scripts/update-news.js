/**
 * skAIshift Daily News Pipeline
 * Runs via GitHub Actions at 6AM ET every day
 *
 * Steps:
 *  1. Fetch articles from RSS feeds
 *  2. Summarize + categorize each with Claude Haiku
 *  3. Fetch a relevant photo from Unsplash for each article
 *  4. Save today's articles to Supabase (for weekly accumulation)
 *  5. Write public/news.json (site reads this on load)
 *  6. Broadcast daily email to all subscribers via Resend
 *  7. On Sundays: generate weekly brief + send weekly email
 */

const Parser    = require('rss-parser');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const fs        = require('fs');
const path      = require('path');

// ── ENV ────────────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY;
const UNSPLASH_KEY    = process.env.UNSPLASH_ACCESS_KEY;
const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_KEY;
const RESEND_KEY      = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE = process.env.RESEND_AUDIENCE_ID;
const FROM_EMAIL      = 'skAIshift <news@skaishift.com>';

const claude   = new Anthropic({ apiKey: ANTHROPIC_KEY });
const parser   = new Parser({ timeout: 12000 });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── RSS FEEDS ──────────────────────────────────────────────────────────────────
const FEEDS = [
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch' },
  { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', source: 'The Verge' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat' },
  { url: 'https://www.artificialintelligence-news.com/feed/', source: 'AI News' },
  { url: 'https://hnrss.org/frontpage?q=AI+LLM+OpenAI+Anthropic+Claude', source: 'Hacker News' },
];

// ── FALLBACK IMAGES (if Unsplash fails) ──────────────────────────────────────
const FALLBACK_IMGS = {
  Earn:     'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&h=500&fit=crop&auto=format',
  Tools:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&auto=format',
  Models:   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop&auto=format',
  Business: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=500&fit=crop&auto=format',
  Strategy: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&h=500&fit=crop&auto=format',
  Robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&h=500&fit=crop&auto=format',
};

// ── STEP 1: FETCH RSS — AbortController hard-kills hanging connections ────────
async function fetchFeed(feed) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; skAIshift/1.0)' }
    });
    const xml = await res.text();
    clearTimeout(timer);
    const p = new Parser();
    const result = await p.parseString(xml);
    return result.items.slice(0, 5).map(item => ({
      title:   item.title || '',
      summary: (item.contentSnippet || item.content || '').slice(0, 600),
      source:  feed.source,
      link:    item.link || '',
    }));
  } catch (e) {
    clearTimeout(timer);
    console.warn(`  ✗ ${feed.source}: ${e.message}`);
    return [];
  }
}

// ── STEP 2: SUMMARIZE WITH CLAUDE HAIKU ──────────────────────────────────────
async function summarize(raw, index) {
  try {
    const msg = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You write in-depth news articles for skAIshift — a daily AI news platform for entrepreneurs earning money with AI.

RAW ARTICLE:
Title: ${raw.title}
Content: ${raw.summary}
Source: ${raw.source}

Return ONLY valid JSON (no markdown, no extra text):
{
  "id": "a${index}",
  "cat": "<Earn|Tools|Models|Business|Strategy|Robotics>",
  "headline": "<punchy max-90-char headline, lead with the most surprising fact>",
  "body": "<Write as many sentences as needed — 5 minimum, no maximum. Cover everything relevant: exactly what was announced or released, who made it, what specific capability or improvement it brings, what numbers or benchmarks are involved, how it compares to what existed before, the real-world impact, and any important context or caveats. Be specific — name the model version, the feature, the company, the metric. The goal is for a reader to fully understand the story without needing to click the original source. More detail is always better than less.>",
  "build": "<Write 2-3 sentences. Describe specific, concrete ways people are making money from this RIGHT NOW. Include dollar amounts, client types, and timeframes. Name the exact service or offer being sold. Make it immediately actionable.>",
  "unsplash_query": "<3-4 specific words to find a relevant photo, e.g. 'artificial intelligence robot arm' or 'startup office funding'>",
  "significance": <integer 1-10. MUST be 9-10 for: ANY new model release or version (GPT, Claude, Gemini, Mistral, DeepSeek, Llama, etc), new AI capability (video editing, real-time voice, coding agents, multimodal), API launch, or benchmark record. 7-8 for funding over $100M or major product launches. 5-6 for business/strategy news. 1-4 for minor updates. When in doubt about a model release, rate it 9>,
  "time": "${Math.floor(Math.random()*10)+1}h",
  "source": "${raw.source}"
}`,
      }],
    });
    const raw = msg.content[0].text.trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'');
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`  ✗ summarize: ${e.message}`);
    return null;
  }
}

// ── STEP 3: FETCH UNSPLASH IMAGE ──────────────────────────────────────────────
async function getUnsplashImage(query, cat) {
  if (!UNSPLASH_KEY) return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const res  = await fetch(url);
    const data = await res.json();
    if (data?.urls?.regular) {
      return data.urls.regular + '&w=900&h=500&fit=crop';
    }
    return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  } catch {
    return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  }
}

// ── STEP 4: SAVE TO SUPABASE ──────────────────────────────────────────────────
async function saveToSupabase(articles, today) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('  ⚠ No Supabase credentials — skipping persistence');
    return;
  }
  const rows = articles.map(a => ({
    ...a,
    published_date: today,
    created_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('skaishift_articles').upsert(rows, { onConflict: 'id' });
  if (error) console.warn('  ✗ Supabase save error:', error.message);
  else console.log(`  ✓ ${articles.length} articles saved to Supabase`);
}

// ── STEP 5: GENERATE WEEKLY BRIEF (Sundays only) ──────────────────────────────
async function generateWeeklyBrief(today) {
  if (!SUPABASE_URL) return null;

  // Fetch last 7 days of articles from Supabase
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: articles, error } = await supabase
    .from('skaishift_articles')
    .select('*')
    .gte('published_date', weekAgo)
    .order('significance', { ascending: false });

  if (error || !articles?.length) {
    console.warn('  ✗ Weekly brief: could not fetch articles');
    return null;
  }

  console.log(`  → Summarizing ${articles.length} articles from the past week...`);

  const articleList = articles.slice(0, 20).map((a, i) =>
    `${i+1}. [${a.cat}] ${a.headline} — ${a.build}`
  ).join('\n');

  const msg = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `You write the weekly intelligence brief for skAIshift — a platform for entrepreneurs using AI to earn money.

Here are this week's top articles:
${articleList}

Write a weekly brief in this EXACT JSON format (no markdown):
{
  "week": "<e.g. May 12–18, 2025>",
  "headline": "<punchy 8-10 word headline summarizing the week's theme>",
  "sections": [
    {
      "id": "glance",
      "label": "At a Glance",
      "items": ["<7 bullet strings — the most important facts of the week>"]
    },
    {
      "id": "money",
      "label": "Money Moves",
      "items": [
        {"h": "<opportunity headline>", "s": "<1 sentence: why and how much>"},
        ... (5 items)
      ]
    },
    {
      "id": "models",
      "label": "Model Updates",
      "items": [
        {"h": "<model name or update>", "s": "<1 sentence: practical impact>"},
        ... (4 items)
      ]
    },
    {
      "id": "tools",
      "label": "Tools to Know",
      "items": [
        {"h": "<tool name>", "s": "<1 sentence: what it does and why it matters>"},
        ... (4 items)
      ]
    },
    {
      "id": "watch",
      "label": "Watch List",
      "items": ["<4 bullet strings — things to watch next week>"]
    }
  ]
}`,
    }],
  });

  try {
    const raw = msg.content[0].text.trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'');
    return JSON.parse(raw);
  } catch (e) {
    console.warn('  ✗ Weekly brief parse error:', e.message);
    return null;
  }
}

// ── STEP 6: SEND DAILY EMAIL ──────────────────────────────────────────────────
async function sendEmail(subject, html, label) {
  if (!RESEND_KEY || !RESEND_AUDIENCE) {
    console.log(`  ⚠ No Resend credentials — skipping ${label} email`);
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/broadcasts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audience_id: RESEND_AUDIENCE, from: FROM_EMAIL, subject, html }),
    });
    const bc = await res.json();
    if (bc.id) {
      await fetch(`https://api.resend.com/broadcasts/${bc.id}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      console.log(`  ✓ ${label} email sent (${bc.id})`);
    }
  } catch (e) {
    console.error(`  ✗ ${label} email error:`, e.message);
  }
}

function buildDailyEmail(articles, date) {
  const CAT_COLORS = { Earn:'#16A34A',Tools:'#2563EB',Models:'#DC2626',Business:'#7C3AED',Strategy:'#D97706',Robotics:'#0891B2' };
  const cards = articles.slice(0,5).map(a=>`
    <div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E4E4E0;margin-bottom:16px;">
      <img src="${a.img}" width="100%" height="180" style="display:block;object-fit:cover;" alt=""/>
      <div style="padding:16px;">
        <span style="background:${CAT_COLORS[a.cat]||'#666'};color:#fff;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:2px 8px;border-radius:4px;">${a.cat}</span>
        <p style="font-size:16px;font-weight:700;color:#0F0F0F;margin:10px 0 8px;line-height:1.3;">${a.headline}</p>
        <p style="font-size:13px;color:#4A4A4A;line-height:1.7;margin:0 0 12px;">${a.body}</p>
        <div style="background:#FFFBF0;border-left:3px solid #F5A623;padding:10px 14px;border-radius:0 8px 8px 0;">
          <p style="font-size:9px;color:#F5A623;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px;">WHAT PEOPLE ARE BUILDING</p>
          <p style="font-size:12px;color:#3A3020;line-height:1.6;margin:0;">${a.build}</p>
        </div>
      </div>
    </div>`).join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F4F4F0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px 16px;">
  <div style="background:#0F0F0F;border-radius:16px 16px 0 0;padding:24px 28px 20px;text-align:center;">
    <p style="font-size:30px;font-weight:900;letter-spacing:0.1em;color:#fff;margin:0 0 4px;">SK<span style="color:#F5A623;">AI</span>SHIFT</p>
    <p style="color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 12px;">AI Intelligence Daily</p>
    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;background:rgba(255,255,255,0.08);padding:8px 16px;border-radius:8px;"><strong style="color:#fff;">${date}</strong> — Today's most important AI shifts</p>
  </div>
  <div style="background:#E8001C;height:4px;"></div>
  <div style="background:#F4F4F0;padding:16px 0;">${cards}</div>
  <div style="background:#0F0F0F;border-radius:0 0 16px 16px;padding:24px 28px;text-align:center;">
    <a href="https://skaishift.netlify.app" style="display:inline-block;background:#E8001C;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:13px;font-weight:700;letter-spacing:0.06em;">READ TODAY'S FULL BRIEF →</a>
    <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:16px 0 0;">You subscribed to skAIshift · <a href="{{unsubscribe_url}}" style="color:rgba(255,255,255,0.3);">Unsubscribe</a></p>
  </div>
</div></body></html>`;
}

function buildWeeklyEmail(brief) {
  const sectionHTML = brief.sections.map(sec => {
    const itemsHTML = sec.items.map(item =>
      typeof item === 'string'
        ? `<li style="font-size:13px;color:#2A2620;line-height:1.7;margin-bottom:6px;">${item}</li>`
        : `<div style="background:#F8F8F6;border-radius:8px;padding:10px 14px;margin-bottom:8px;"><p style="font-weight:700;font-size:13px;color:#0F0F0F;margin:0 0 3px;">${item.h}</p><p style="font-size:12px;color:#6B6B6B;margin:0;line-height:1.5;">${item.s}</p></div>`
    ).join('');
    const isList = sec.items.every(i => typeof i === 'string');
    return `<div style="padding:16px 0;border-bottom:1px solid #E4E4E0;">
      <p style="font-size:14px;font-weight:700;color:#0F0F0F;margin:0 0 12px;">${sec.label}</p>
      ${isList ? `<ul style="padding-left:16px;margin:0;">${itemsHTML}</ul>` : itemsHTML}
    </div>`;
  }).join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F4F4F0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px 16px;">
  <div style="background:#0F0F0F;border-radius:16px 16px 0 0;padding:28px;">
    <p style="font-size:10px;color:#F5A623;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 8px;">WEEKLY INTELLIGENCE BRIEF</p>
    <p style="font-size:26px;font-weight:900;letter-spacing:0.08em;color:#fff;margin:0 0 6px;">SK<span style="color:#F5A623;">AI</span>SHIFT</p>
    <p style="font-size:18px;font-weight:700;color:#fff;line-height:1.3;margin:0 0 6px;">${brief.headline}</p>
    <p style="color:rgba(255,255,255,0.5);font-size:12px;margin:0;">${brief.week}</p>
  </div>
  <div style="background:#E8001C;height:4px;"></div>
  <div style="background:#fff;padding:0 20px;">${sectionHTML}</div>
  <div style="background:#0F0F0F;border-radius:0 0 16px 16px;padding:20px 28px;text-align:center;">
    <a href="https://skaishift.netlify.app/brief" style="display:inline-block;background:#E8001C;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:13px;font-weight:700;">READ FULL BRIEF →</a>
    <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:12px 0 0;">skAIshift Weekly · <a href="{{unsubscribe_url}}" style="color:rgba(255,255,255,0.3);">Unsubscribe</a></p>
  </div>
</div></body></html>`;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const now      = new Date();
  const today    = now.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const todayISO = now.toISOString().split('T')[0];
  const isSunday = now.getDay() === 0;

  console.log(`\nskAIshift pipeline — ${today}${isSunday ? ' (SUNDAY: weekly brief)' : ''}`);

  // 1. Fetch feeds
  console.log('\n[1] Fetching RSS feeds...');
  const raw = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  const seen = new Set();
  const unique = raw.filter(a => {
    const k = a.title.slice(0,40).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).slice(0, 16);
  console.log(`    ${unique.length} unique articles`);

  // 2. Summarize
  console.log('\n[2] Summarizing with Claude Haiku...');
  const summaries = [];
  for (let i = 0; i < unique.length; i++) {
    process.stdout.write(`    [${i+1}/${unique.length}] ...`);
    const s = await summarize(unique[i], i+1);
    if (s) { summaries.push(s); process.stdout.write(` ✓ ${s.cat}\n`); }
    else process.stdout.write(' ✗\n');
    await new Promise(r => setTimeout(r, 350));
  }

  // 3. Fetch Unsplash images
  console.log('\n[3] Fetching article images from Unsplash...');
  for (const a of summaries) {
    process.stdout.write(`    "${a.unsplash_query}" → `);
    a.img = await getUnsplashImage(a.unsplash_query, a.cat);
    process.stdout.write('✓\n');
    await new Promise(r => setTimeout(r, 200)); // respect Unsplash rate limit
  }

  // 4. Sort by significance, mark top 2 as featured
  summaries.sort((a,b) => (b.significance||0) - (a.significance||0));
  summaries.forEach((a,i) => { a.feat = i < 2; a.published_date = todayISO; });

  // 5. Save to Supabase
  console.log('\n[4] Saving to Supabase...');
  await saveToSupabase(summaries, todayISO);

  // 6. Write public/news.json
  console.log('\n[5] Writing news.json...');
  const newsData = { updated: now.toISOString(), date: today, articles: summaries };
  fs.writeFileSync(path.join(__dirname, '../public/news.json'), JSON.stringify(newsData, null, 2));
  console.log(`    ✓ ${summaries.length} articles`);

  // 7. Send daily email
  console.log('\n[6] Broadcasting daily email...');
  const breaking = summaries.filter(a => (a.significance||0) >= 9).length;
  const subject = breaking > 0
    ? `${breaking} major AI shift${breaking>1?'s':''} today — ${today}`
    : `Today in AI — ${today}`;
  await sendEmail(subject, buildDailyEmail(summaries, today), 'daily');

  // 8. Weekly brief (Sundays only)
  if (isSunday) {
    console.log('\n[7] Generating weekly brief...');
    const brief = await generateWeeklyBrief(today);
    if (brief) {
      // Save weekly brief to its own file
      fs.writeFileSync(path.join(__dirname,'../public/weekly-brief.json'), JSON.stringify(brief, null, 2));
      console.log('    ✓ weekly-brief.json written');
      // Send weekly email
      await sendEmail(`The skAIshift Weekly — ${brief.week}`, buildWeeklyEmail(brief), 'weekly');
    }
  }

  console.log('\n✓ Pipeline complete.\n');
}

main().catch(e => { console.error(e); process.exit(1); });
