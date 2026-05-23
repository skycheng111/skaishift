/**
 * skAIshift Daily News Pipeline
 * Runs via GitHub Actions at 6AM ET every day
 *
 * Resilience features:
 * - Feed pre-check: skips dead feeds before parsing
 * - Claude → GPT-4o-mini fallback if Anthropic times out
 * - Renamed 'rawArticle' parameter to avoid 'raw' variable conflict
 * - Failure alert email to owner if 0 articles produced
 */

const Parser    = require('rss-parser');
const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');
const fs        = require('fs');
const path      = require('path');

const nodeFetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

// ── ENV ────────────────────────────────────────────────────────────────────────
const ANTHROPIC_KEY   = process.env.ANTHROPIC_API_KEY;
const OPENAI_KEY      = process.env.OPENAI_API_KEY;
const UNSPLASH_KEY    = process.env.UNSPLASH_ACCESS_KEY;
const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_KEY    = process.env.SUPABASE_SERVICE_KEY;
const RESEND_KEY      = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE = process.env.RESEND_AUDIENCE_ID;
const ALERT_EMAIL     = 'skycheng11104@gmail.com';
const FROM_EMAIL      = 'skAIshift <news@skaishift.com>';

const claude   = new Anthropic({ apiKey: ANTHROPIC_KEY, timeout: 25000, maxRetries: 0 });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── RSS FEEDS ──────────────────────────────────────────────────────────────────
const FEEDS = [
  { url: 'https://openai.com/blog/rss.xml',                                        source: 'OpenAI' },
  { url: 'https://blog.google/technology/ai/rss/',                                 source: 'Google AI' },
  { url: 'https://huggingface.co/blog/feed.xml',                                  source: 'HuggingFace' },
  { url: 'https://engineering.fb.com/category/ml-applications/feed/',              source: 'Meta AI' },
  { url: 'https://elevenlabs.io/rss.xml',                                          source: 'ElevenLabs' },
  { url: 'https://venturebeat.com/category/ai/feed/',                              source: 'VentureBeat' },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/',          source: 'TechCrunch' },
  { url: 'https://www.technologyreview.com/feed/',                                 source: 'MIT Tech Review' },
  { url: 'https://aibusiness.com/rss.xml',                                         source: 'AI Business' },
  { url: 'https://towardsai.net/feed',                                             source: 'Towards AI' },
  { url: 'https://www.sequoiacap.com/feed/?category=artificial-intelligence',      source: 'Sequoia' },
  { url: 'https://importai.substack.com/feed',                                     source: 'Import AI' },
  { url: 'https://hnrss.org/frontpage?q=AI+LLM+OpenAI+Anthropic+Gemini+GPT+Claude+DeepSeek+Mistral', source: 'Hacker News' },
];

// ── FALLBACK IMAGES ───────────────────────────────────────────────────────────
const FALLBACK_IMGS = {
  Earn:     'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=900&h=500&fit=crop&auto=format',
  Tools:    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&auto=format',
  Models:   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop&auto=format',
  Business: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=500&fit=crop&auto=format',
  Strategy: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&h=500&fit=crop&auto=format',
  Robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&h=500&fit=crop&auto=format',
};

// ── STEP 1: PRE-CHECK + FETCH FEEDS ──────────────────────────────────────────
async function checkFeed(feed) {
  // Quick HEAD request to verify feed is alive before parsing
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const res = await nodeFetch(feed.url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(t);
    return res.ok; // only parse if 200-299
  } catch {
    return false;
  }
}

async function fetchFeed(feed) {
  const alive = await checkFeed(feed);
  if (!alive) {
    console.warn(`  ✗ ${feed.source}: dead (skipped)`);
    return [];
  }
  const p = new Parser({ timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; skAIshift/1.0)' } });
  try {
    const result = await Promise.race([
      p.parseURL(feed.url),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 9000))
    ]);
    return result.items.slice(0, 5).map(item => ({
      title:   item.title || '',
      summary: (item.contentSnippet || item.content || '').slice(0, 600),
      source:  feed.source,
      link:    item.link || '',
    }));
  } catch (e) {
    console.warn(`  ✗ ${feed.source}: ${e.message}`);
    return [];
  }
}

// ── STEP 2: BUILD PROMPT ──────────────────────────────────────────────────────
// NOTE: parameter named 'article' (not 'raw') to avoid conflict with local 'cleaned' var
function buildPrompt(article, index) {
  return `You write in-depth news articles for skAIshift — a daily AI news platform for entrepreneurs earning money with AI.

RAW ARTICLE:
Title: ${article.title}
Content: ${article.summary}
Source: ${article.source}

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
  "source": "${article.source}"
}`;
}

// ── STEP 3: SUMMARIZE — Claude primary, GPT-4o-mini fallback ─────────────────
async function summarizeWithClaude(prompt) {
  const msg = await claude.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  });
  return msg.content[0].text.trim();
}

async function summarizeWithOpenAI(prompt) {
  if (!OPENAI_KEY) throw new Error('No OpenAI key');
  const res = await nodeFetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function summarize(article, index) {
  const prompt = buildPrompt(article, index);
  let raw_text = null;

  // Try Claude first
  try {
    raw_text = await summarizeWithClaude(prompt);
    process.stdout.write(' [claude]');
  } catch (e) {
    console.warn(`\n    Claude failed: ${e.message} — trying GPT-4o-mini...`);
    try {
      raw_text = await summarizeWithOpenAI(prompt);
      process.stdout.write(' [openai]');
    } catch (e2) {
      console.warn(`    GPT-4o-mini also failed: ${e2.message}`);
      return null;
    }
  }

  try {
    const cleaned = raw_text.replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'');
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn(`    JSON parse failed: ${e.message}`);
    return null;
  }
}

// ── STEP 4: UNSPLASH ──────────────────────────────────────────────────────────
async function getUnsplashImage(query, cat) {
  if (!UNSPLASH_KEY) return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  try {
    const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high&client_id=${UNSPLASH_KEY}`;
    const res = await nodeFetch(url);
    const data = await res.json();
    if (data?.urls?.regular) return data.urls.regular + '&w=900&h=500&fit=crop';
    return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  } catch {
    return FALLBACK_IMGS[cat] || FALLBACK_IMGS.Tools;
  }
}

// ── STEP 5: SUPABASE ──────────────────────────────────────────────────────────
async function saveToSupabase(articles, today) {
  if (!SUPABASE_URL || !SUPABASE_KEY) { console.log('  ⚠ No Supabase'); return; }
  const rows = articles.map(a => ({
    id: a.id, published_date: today, cat: a.cat, headline: a.headline,
    body: a.body, build: a.build, img: a.img, source: a.source,
    significance: a.significance, feat: a.feat, time: a.time,
    created_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from('skaishift_articles').upsert(rows, { onConflict: 'id' });
  if (error) console.warn('  ✗ Supabase:', error.message);
  else console.log(`  ✓ ${articles.length} articles saved to Supabase`);
}

// ── STEP 6: ALERT EMAIL ───────────────────────────────────────────────────────
async function sendAlertEmail(message) {
  if (!RESEND_KEY) return;
  try {
    await nodeFetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ALERT_EMAIL],
        subject: `⚠️ skAIshift pipeline alert — ${new Date().toLocaleDateString()}`,
        html: `<p>${message}</p><p>Check GitHub Actions for details.</p>`,
      }),
    });
    console.log('  ✓ Alert email sent');
  } catch (e) {
    console.warn('  ✗ Alert email failed:', e.message);
  }
}

// ── STEP 7: BROADCAST EMAIL ───────────────────────────────────────────────────
async function sendEmail(subject, html, label) {
  if (!RESEND_KEY || !RESEND_AUDIENCE) { console.log(`  ⚠ No Resend — skipping ${label}`); return; }
  try {
    const res = await nodeFetch('https://api.resend.com/broadcasts', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audience_id: RESEND_AUDIENCE, from: FROM_EMAIL, subject, html }),
    });
    const bc = await res.json();
    if (bc.id) {
      await nodeFetch(`https://api.resend.com/broadcasts/${bc.id}/send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: '{}',
      });
      console.log(`  ✓ ${label} email sent (${bc.id})`);
    } else {
      console.warn('  ✗ Broadcast failed:', JSON.stringify(bc));
    }
  } catch (e) { console.error(`  ✗ ${label} email error:`, e.message); }
}

function buildDailyEmail(articles, date) {
  const CAT_COLORS = { Earn:'#16A34A',Tools:'#2563EB',Models:'#DC2626',Business:'#7C3AED',Strategy:'#D97706',Robotics:'#0891B2' };
  const cards = articles.slice(0,5).map(a=>`
    <div style="background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E4E4E0;margin-bottom:16px;">
      <img src="${a.img}" width="100%" height="180" style="display:block;object-fit:cover;" alt=""/>
      <div style="padding:16px;">
        <span style="background:${CAT_COLORS[a.cat]||'#666'};color:#fff;font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:2px 8px;border-radius:4px;">${a.cat}</span>
        <p style="font-size:16px;font-weight:700;color:#0F0F0F;margin:10px 0 8px;line-height:1.3;">${a.headline}</p>
        <p style="font-size:13px;color:#4A4A4A;line-height:1.7;margin:0 0 12px;">${a.body?.slice(0,300)}...</p>
        <div style="background:#FFFBF0;border-left:3px solid #F5A623;padding:10px 14px;border-radius:0 8px 8px 0;">
          <p style="font-size:9px;color:#F5A623;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 4px;">WHAT PEOPLE ARE BUILDING</p>
          <p style="font-size:12px;color:#3A3020;line-height:1.6;margin:0;">${a.build}</p>
        </div>
      </div>
    </div>`).join('');
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F4F4F0;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px 16px;">
  <div style="background:#0F0F0F;border-radius:16px 16px 0 0;padding:24px 28px 20px;text-align:center;">
    <img src="https://skaishift.com/logo.png" width="48" height="48" style="display:inline-block;border-radius:10px;margin-bottom:10px;" alt="skAIshift"/>
    <p style="font-size:30px;font-weight:900;letter-spacing:0.1em;color:#fff;margin:0 0 4px;">SK<span style="color:#F5A623;">AI</span>SHIFT</p>
    <p style="color:rgba(255,255,255,0.45);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 12px;">AI Intelligence Daily</p>
    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;background:rgba(255,255,255,0.08);padding:8px 16px;border-radius:8px;"><strong style="color:#fff;">${date}</strong> — Today's most important AI shifts</p>
  </div>
  <div style="background:#E8001C;height:4px;"></div>
  <div style="background:#F4F4F0;padding:16px 0;">${cards}</div>
  <div style="background:#0F0F0F;border-radius:0 0 16px 16px;padding:24px 28px;text-align:center;">
    <a href="https://skaishift.com" style="display:inline-block;background:#E8001C;color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:13px;font-weight:700;">READ TODAY'S FULL BRIEF →</a>
    <p style="color:rgba(255,255,255,0.3);font-size:10px;margin:16px 0 0;">You subscribed to skAIshift · <a href="{{unsubscribe_url}}" style="color:rgba(255,255,255,0.3);">Unsubscribe</a></p>
  </div>
</div></body></html>`;
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const now      = new Date();
  const etNow    = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const today    = etNow.toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' });
  const yyyy     = etNow.getFullYear();
  const mm       = String(etNow.getMonth()+1).padStart(2,'0');
  const dd       = String(etNow.getDate()).padStart(2,'0');
  const todayISO = `${yyyy}-${mm}-${dd}`;
  const isSunday = etNow.getDay() === 0;
  const isMonday = etNow.getDay() === 1;

  console.log(`\nskAIshift pipeline — ${today}`);
  console.log(`Claude: ${ANTHROPIC_KEY ? '✓' : '✗ missing'} | OpenAI fallback: ${OPENAI_KEY ? '✓' : '✗ missing'} | Unsplash: ${UNSPLASH_KEY ? '✓' : '✗ missing'}`);

  // 1. Fetch feeds (with pre-check)
  console.log('\n[1] Fetching RSS feeds...');
  const rawItems = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  const seen = new Set();
  const unique = rawItems.filter(a => {
    const k = a.title.slice(0,40).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k); return true;
  }).slice(0, 16);
  console.log(`    ${unique.length} unique articles`);

  // 2. Summarize with fallback
  console.log('\n[2] Summarizing...');
  const summaries = [];
  for (let i = 0; i < unique.length; i++) {
    process.stdout.write(`    [${i+1}/${unique.length}]`);
    const s = await summarize(unique[i], i+1);
    if (s) { s.link = unique[i].link || ''; summaries.push(s); process.stdout.write(` ✓ ${s.cat}\n`); }
    else process.stdout.write(' ✗\n');
    await new Promise(r => setTimeout(r, 350));
  }

  // Alert if 0 articles
  if (summaries.length === 0) {
    const msg = `Pipeline ran but produced 0 articles on ${today}. All summarize calls failed.`;
    console.error('\n⚠', msg);
    await sendAlertEmail(msg);
    process.exit(1);
  }

  // 3. Unsplash images
  console.log('\n[3] Fetching images...');
  for (const a of summaries) {
    process.stdout.write(`    "${a.unsplash_query}" → `);
    a.img = await getUnsplashImage(a.unsplash_query, a.cat);
    process.stdout.write('✓\n');
    await new Promise(r => setTimeout(r, 200));
  }

  // 4. Sort + feature
  summaries.sort((a,b) => (b.significance||0)-(a.significance||0));
  summaries.forEach((a,i) => { a.feat = i < 2; a.published_date = todayISO; });

  // 5. Supabase
  console.log('\n[4] Saving to Supabase...');
  await saveToSupabase(summaries, todayISO);

  // 6. Write news.json
  console.log('\n[5] Writing news.json...');
  const newsData = { updated: now.toISOString(), date: today, articles: summaries };
  fs.writeFileSync(path.join(__dirname,'../public/news.json'), JSON.stringify(newsData, null, 2));
  console.log(`    ✓ ${summaries.length} articles`);

  // 7. Weekly articles accumulation
  console.log('\n[5b] Updating weekly articles...');
  const weeklyPath   = path.join(__dirname,'../public/weekly-articles.json');
  const lastWeekPath = path.join(__dirname,'../public/last-week-articles.json');
  let weeklyArticles = [];
  try {
    if (fs.existsSync(weeklyPath)) {
      const existing = JSON.parse(fs.readFileSync(weeklyPath,'utf8'));
      if (isMonday) {
        if ((existing.articles||[]).length > 0) {
          fs.writeFileSync(lastWeekPath, JSON.stringify({ updated: now.toISOString(), articles: existing.articles }, null, 2));
          console.log(`    Archived ${existing.articles.length} articles → last-week-articles.json`);
        }
        weeklyArticles = [];
        console.log('    Monday reset');
      } else {
        weeklyArticles = existing.articles || [];
      }
    }
  } catch(e) { weeklyArticles = []; }

  const wCombined = [...summaries, ...weeklyArticles];
  const wSeenUrls = new Set();
  const wSeenKeys = new Set();

  // Extract 3-4 distinctive keywords from a headline for fuzzy matching
  const headlineKey = (h='') => h.toLowerCase()
    .replace(/[^a-z0-9 ]/g,'')
    .split(' ')
    .filter(w => w.length > 4 && !['about','after','could','would','their','there','where','which','while'].includes(w))
    .slice(0,4)
    .sort()
    .join('|');

  const wDeduped = wCombined.filter(a => {
    // Primary: deduplicate by source URL
    if (a.link && wSeenUrls.has(a.link)) return false;
    // Secondary: deduplicate by distinctive headline keywords
    const hk = headlineKey(a.headline);
    if (hk && wSeenKeys.has(hk)) return false;
    if (a.link) wSeenUrls.add(a.link);
    if (hk) wSeenKeys.add(hk);
    return true;
  });
  wDeduped.sort((a,b) => (b.significance||0)-(a.significance||0));
  // 2 top articles per day x 7 days = 14 max
  const topWeekly = wDeduped.slice(0,14);
  fs.writeFileSync(weeklyPath, JSON.stringify({ updated: now.toISOString(), articles: topWeekly }, null, 2));
  console.log(`    ✓ ${topWeekly.length} weekly articles`);

  // 8. Daily email
  console.log('\n[6] Broadcasting daily email...');
  const breaking = summaries.filter(a => (a.significance||0) >= 9).length;
  const subject = breaking > 0
    ? `${breaking} major AI shift${breaking>1?'s':''} today — ${today}`
    : `Today in AI — ${today}`;
  await sendEmail(subject, buildDailyEmail(summaries, today), 'daily');

  // 9. Weekly brief on Sundays
  if (isSunday) {
    console.log('\n[7] Sunday: generating weekly brief email...');
    // Just send last week's top articles as the email
    try {
      const lw = JSON.parse(fs.readFileSync(lastWeekPath,'utf8'));
      if (lw.articles?.length) {
        await sendEmail(`This week in AI — ${today}`, buildDailyEmail(lw.articles, today), 'weekly');
      }
    } catch(e) { console.warn('  ✗ Weekly email:', e.message); }
  }

  console.log('\n✓ Pipeline complete.\n');
  process.exit(0); // Force exit — Supabase realtime client keeps process alive otherwise
}

main().catch(async e => {
  console.error('Pipeline fatal error:', e);
  await sendAlertEmail(`Pipeline crashed on ${new Date().toLocaleDateString()}: ${e.message}`);
  process.exit(1);
});
