import { useState, useEffect } from "react";

// ── LOGO (base64 embedded — loads instantly, no external request) ─────────────
const LOGO_B64 = "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";
const LOGO_SRC = `data:image/png;base64,${LOGO_B64}`;

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const T = {
  bg:"#FFFFFF", card:"#FFFFFF", ink:"#0F0F0F", mid:"#6B6B6B",
  light:"#E4E4E0", amber:"#F5A623", red:"#E8001C",
  border:"1px solid #E4E4E0",
};
const CATS = {
  Earn:"#16A34A", Tools:"#2563EB", Models:"#DC2626",
  Business:"#7C3AED", Strategy:"#D97706", Robotics:"#0891B2",
};
const ALL_CATS = ["All","Earn","Tools","Models","Business","Strategy","Robotics"];
const INSET = 20;

// ── STATIC FALLBACK (shown until daily JSON loads) ────────────────────────────
const FALLBACK = {
  date: "May 19, 2025",
  articles: [
    {id:"a1",cat:"Earn",   feat:true, img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&h=500&fit=crop&auto=format", headline:"OpenAI's Image API Now Renders Text Flawlessly. The Freelance Gold Rush Is On.",           body:"GPT-4o's updated image generation handles logos and branded mockups with near-zero text errors — the biggest AI image weakness until now.",                                   build:"Freelancers packaging AI Brand Kits at $500–$1,500 are closing in under 3 hours. One designer shared $11K in her first week.",           time:"28m",source:"The Verge"},
    {id:"a2",cat:"Models", feat:true, img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=500&fit=crop&auto=format", headline:"Claude 4 Sonnet: Faster, Cheaper, Longer Context. Switch Your Pipeline Today.",            body:"Anthropic's new Sonnet handles 100K+ tokens without losing coherence and costs less per token. Benchmarks show it ahead on multi-step tasks.",                              build:"Content agencies report 40% faster turnaround. One owner said it added $6K/month in capacity without adding staff.",                        time:"52m",source:"Anthropic"},
    {id:"a3",cat:"Tools",  feat:false,img:"https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=500&fit=crop&auto=format", headline:"Cursor's Background Agents Code While You Sleep",                                          body:"Cursor now runs coding tasks asynchronously. Assign a job before bed, wake up to a completed PR.",                                                                          build:"One dev documented 9 simultaneous client projects at $40K/month. Zero new hires.",                                                          time:"1h", source:"Ars Technica"},
    {id:"a4",cat:"Robotics",feat:false,img:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900&h=500&fit=crop&auto=format",headline:"Figure AI's Robots Ran 114 Hours Straight. Nobody Stopped Them.",                          body:"Figure AI planned an 8-hour demo. Humanoid robots sorted 142,649 packages across 114 consecutive hours with zero human help.",                                              build:"Logistics companies offered contracts in real time. Show this demo to every operations client.",                                             time:"2h", source:"Figure AI"},
    {id:"a5",cat:"Business",feat:false,img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=500&fit=crop&auto=format",headline:"Copilot Hit 100M Daily Users. Your Clients Are Already Using AI.",                          body:"Microsoft confirmed Copilot now has 100M daily active users — 3x in 12 months. Growth driven by Teams and Excel integrations.",                                            build:"You no longer sell the concept. Done-for-you implementation packages at $2K–$5K are closing.",                                            time:"2h", source:"Bloomberg"},
    {id:"a6",cat:"Earn",   feat:false,img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=500&fit=crop&auto=format", headline:"n8n + Claude Is Replacing $2K/Month VAs. Here's the Offer That Closes.",                 body:"Small businesses are replacing full-time VAs with n8n + Claude pipelines for inbox triage, lead follow-up, and invoicing.",                                                 build:"One person shared 14 closed clients in 60 days at $1,500 setup + $300/month retainer.",                                                   time:"3h", source:"X"},
    {id:"a7",cat:"Tools",  feat:false,img:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&h=500&fit=crop&auto=format", headline:"ElevenLabs Voice Cloning Is Finally Ready for Client Work",                                 body:"ElevenLabs' latest update fixes consistency across long-form audio. First-render quality checks now passing.",                                                              build:"One agency added $4,200 MRR in 30 days offering AI narration as a $300–$500/month add-on. Zero new headcount.",                          time:"4h", source:"TechCrunch"},
    {id:"a8",cat:"Strategy",feat:false,img:"https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=900&h=500&fit=crop&auto=format",headline:"Stanford: AI Makes Junior Workers 34% Better. The Real Implication Is Bigger.",            body:"Stanford HAI tracked 1,200 knowledge workers over 18 months. Under-3-year employees using AI saw 34% output quality gains.",                                                build:"People combining domain expertise with AI are commanding 40–60% rate premiums.",                                                             time:"5h", source:"Stanford HAI"},
  ],
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
function NewsImg({ src, style={} }) {
  const [err,setErr]=useState(false);
  if(err) return <div style={{...style,background:"#1a1a2e",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>SKAISHIFT</span></div>;
  return <img src={src} onError={()=>setErr(true)} style={{display:"block",...style}}/>;
}

function CatBadge({ cat }) {
  return <span style={{background:CATS[cat]||T.amber,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:9,letterSpacing:"0.12em",padding:"2px 8px",borderRadius:4,flexShrink:0}}>{cat}</span>;
}

function SectionHeader({ label, action, onAction }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`16px ${INSET}px 10px`}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:3,height:16,background:T.red,borderRadius:2}}/>
        <span style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:16,color:T.ink}}>{label}</span>
      </div>
      {action&&<button onClick={onAction} style={{background:"none",border:"none",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:CATS.Tools,cursor:"pointer",padding:0,fontWeight:600}}>{action}</button>}
    </div>
  );
}

// ── HEADER (mobile: name | LOGO | subscribe) ──────────────────────────────────
function Header({ onNav, onBack }) {
  const [open,setOpen]=useState(false);
  const NAV=[{l:"Home",v:"home"},{l:"Brief",v:"brief"},{l:"Learn",v:"learn"},{l:"Subscribe",v:"subscribe"}];
  return (
    <header style={{background:"#0F0F0F",position:"sticky",top:0,zIndex:200,borderBottom:"1px solid #1A1A1A"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"10px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>

        {/* Left: back arrow (article only) + logo + wordmark */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          {onBack&&(
            <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",cursor:"pointer",padding:"4px 8px 4px 0",fontSize:18,lineHeight:1}}>←</button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>onNav("home")}>
            <img src={LOGO_SRC} alt="skAIshift" style={{height:40,width:"auto",display:"block",filter:"invert(1) brightness(2)"}}/>
            <span style={{fontFamily:"'Barlow Semi Condensed',sans-serif",fontSize:22,letterSpacing:"0.15em",fontWeight:500,lineHeight:1,whiteSpace:"nowrap"}}>
              <span style={{color:"#FFFFFF"}}>SK</span>
              <span style={{color:T.amber}}>AI</span>
              <span style={{color:"#FFFFFF"}}>SHIFT</span>
            </span>
          </div>
        </div>

        {/* Center: desktop nav */}
        <nav className="desktop-nav" style={{display:"none",alignItems:"center",gap:4}}>
          {NAV.map(it=>(
            <button key={it.v} onClick={()=>onNav(it.v)}
              style={{background:"transparent",color:"rgba(255,255,255,0.7)",border:"none",padding:"8px 18px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,cursor:"pointer",fontWeight:500,borderRadius:20,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)";e.currentTarget.style.background="transparent";}}>
              {it.l}
            </button>
          ))}
        </nav>

        {/* Right: hamburger (mobile) */}
        <button className="mobile-hamburger" onClick={()=>setOpen(o=>!o)}
          style={{background:"transparent",border:"none",cursor:"pointer",padding:"6px",display:"flex",flexDirection:"column",gap:5,flexShrink:0}}>
          <span style={{display:"block",width:22,height:2,background:open?"transparent":"#fff",transition:"all 0.2s"}}/>
          <span style={{display:"block",width:22,height:2,background:"#fff",transform:open?"rotate(45deg) translate(5px,5px)":"none",transition:"all 0.2s"}}/>
          <span style={{display:"block",width:22,height:2,background:"#fff",transform:open?"rotate(-45deg) translate(5px,-5px)":"none",transition:"all 0.2s"}}/>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open&&(
        <div className="mobile-hamburger" style={{background:"#0F0F0F",borderTop:"1px solid #1A1A1A",padding:"8px 0 16px"}}>
          {NAV.map(it=>(
            <button key={it.v} onClick={()=>{onNav(it.v);setOpen(false);}}
              style={{display:"block",width:"100%",background:"transparent",border:"none",color:"#fff",padding:"14px 24px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:16,cursor:"pointer",textAlign:"left",fontWeight:500,borderBottom:"1px solid #1A1A1A"}}>
              {it.l}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ── HERO CAROUSEL ──────────────────────────────────────────────────────────────
function HeroCarousel({ articles, onSelect }) {
  const heroes = articles.filter(a=>a.feat).slice(0,6);
  if(!heroes.length) return null;
  return (
    <div style={{background:"linear-gradient(180deg,#EEECEA 0%,#F4F4F0 100%)",paddingBottom:16}}>
      <SectionHeader label="Top Stories Today"/>
      <div style={{display:"flex",overflowX:"auto",scrollSnapType:"x mandatory",scrollbarWidth:"none",gap:0}}>
        {heroes.map((s,i)=>(
          <div key={s.id} onClick={()=>onSelect(s)}
            style={{flex:"0 0 100%",scrollSnapAlign:"start",position:"relative",overflow:"hidden",cursor:"pointer",height:"clamp(190px,48vw,300px)"}}>
            <NewsImg src={s.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.08) 55%,transparent 100%)"}}/>
            <div style={{position:"absolute",top:10,right:10,background:"rgba(0,0,0,0.52)",backdropFilter:"blur(6px)",borderRadius:20,padding:"3px 10px"}}>
              <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:500}}>{i+1} of {heroes.length}</span>
            </div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
                <CatBadge cat={s.cat}/>
                <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:10,color:"rgba(255,255,255,0.6)"}}>{s.source} · {s.time} ago</span>
              </div>
              <h2 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:17,color:"#fff",lineHeight:1.25,margin:0}}>{s.headline}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BRIEF STRIP ───────────────────────────────────────────────────────────────
const BRIEF_CARDS = [
  {id:"overview",label:"THIS WEEK",    color:T.red,       bg:"#0F0F0F",dark:true, headline:"7 AI Shifts Defining the Next 90 Days",items:["OpenAI fixes text rendering","Claude 4 Sonnet live","Figure AI 114-hr demo","Copilot: 100M users"]},
  {id:"money",   label:"MONEY MOVES", color:CATS.Earn,   bg:"#F0FDF4",dark:false,headline:"What's Paying Right Now",              items:["AI Brand Kits $500–$1,500","VA replacement $1,500+$300/mo","ElevenLabs add-on $300/mo","Copilot impl. $2K–$5K"]},
  {id:"models",  label:"MODEL UPDATES",color:CATS.Models, bg:"#FEF2F2",dark:false,headline:"Pipeline Changes This Week",           items:["Claude 4 Sonnet — switch now","Gemini 2.5 Pro for long docs","o3 API live","Mistral runs locally"]},
  {id:"tools",   label:"TOOLS TO KNOW",color:CATS.Tools,  bg:"#EFF6FF",dark:false,headline:"Worth Testing This Week",              items:["Cursor background agents","Perplexity research mode","Luma AI to 3D","Make.com + Claude"]},
  {id:"watch",   label:"WATCH LIST",  color:CATS.Strategy,bg:"#FFFBEB",dark:false,headline:"On the Horizon",                      items:["Spot + Claude open-source","EU AI Act enforcement","AGI timeline pressure","Image-to-3D maturing"]},
];

function BriefStrip({ onNav, weeklyArticles }) {
  if (!weeklyArticles || weeklyArticles.length === 0) return null;
  return (
    <div style={{background:"linear-gradient(180deg,#F0EEF8 0%,#F4F4F0 100%)",paddingBottom:16}}>
      <SectionHeader label="Best of This Week" action="See all" onAction={()=>onNav("brief")}/>
      <div style={{display:"flex",overflowX:"auto",scrollSnapType:"x mandatory",scrollbarWidth:"none",gap:10,paddingLeft:INSET,paddingRight:INSET}}>
        {weeklyArticles.slice(0,8).map((story,i)=>(
          <div key={story.id||i} onClick={()=>onNav("brief")}
            style={{minWidth:200,maxWidth:220,flexShrink:0,scrollSnapAlign:"start",borderRadius:14,overflow:"hidden",cursor:"pointer",boxShadow:"0 1px 8px rgba(0,0,0,0.1)",background:"#fff",border:T.border}}>
            <div style={{position:"relative",height:110,overflow:"hidden"}}>
              <NewsImg src={story.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.5) 0%,transparent 60%)"}}/>
              <div style={{position:"absolute",top:7,left:7,background:i<3?T.red:"rgba(0,0,0,0.55)",borderRadius:20,padding:"2px 8px"}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"#fff",letterSpacing:"0.08em"}}>#{i+1}</span>
              </div>
            </div>
            <div style={{padding:"10px 12px"}}>
              <CatBadge cat={story.cat}/>
              <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:12,color:T.ink,lineHeight:1.35,margin:"7px 0 0",display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{story.headline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── STORY CARD ────────────────────────────────────────────────────────────────
function StoryCard({ story, onSelect }) {
  const [tap,setTap]=useState(false);
  return (
    <div onClick={()=>onSelect(story)} onTouchStart={()=>setTap(true)} onTouchEnd={()=>setTap(false)}
      onMouseEnter={()=>setTap(true)} onMouseLeave={()=>setTap(false)}
      style={{display:"flex",gap:12,padding:`14px ${INSET}px`,cursor:"pointer",background:tap?"#F5F5F3":"transparent",transition:"background 0.1s"}}>
      <div style={{width:90,height:90,flexShrink:0,borderRadius:10,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.1)"}}>
        <NewsImg src={story.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:5,minWidth:0}}>
        <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:CATS[story.cat]||T.amber,fontWeight:600}}>{story.cat}</span>
        <h3 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:14,color:T.ink,lineHeight:1.3,margin:0}}>{story.headline}</h3>
        <div style={{display:"flex",alignItems:"center",gap:5,marginTop:"auto"}}>
          <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{story.source}</span>
          <span style={{color:T.light}}>·</span>
          <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{story.time} ago</span>
        </div>
      </div>
    </div>
  );
}

function CategoryPills({ cat, setCat }) {
  return (
    <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",gap:8,padding:`4px ${INSET}px 8px`}}>
      {ALL_CATS.map(c=>(
        <button key={c} onClick={()=>setCat(c)} style={{background:cat===c?T.ink:T.card,color:cat===c?"#fff":T.mid,border:cat===c?"none":T.border,borderRadius:20,padding:"6px 14px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,fontWeight:500,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,transition:"all 0.15s"}}>{c}</button>
      ))}
    </div>
  );
}

// ── ARTICLE DETAIL ────────────────────────────────────────────────────────────
function ArticleDetail({ story, onBack }) {
  return (
    <div style={{background:T.bg,minHeight:"100vh"}}>

      <div style={{maxWidth:720,margin:"0 auto"}}>
        <div style={{borderRadius:20,overflow:"hidden",margin:`16px ${INSET}px 0`,boxShadow:"0 2px 12px rgba(0,0,0,0.1)"}}>
          <NewsImg src={story.img} style={{width:"100%",aspectRatio:"16/9",objectFit:"cover"}}/>
        </div>
        <div style={{padding:`20px ${INSET}px`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <CatBadge cat={story.cat}/>
            <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{story.source} · {story.time} ago</span>
          </div>
          <h1 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:"clamp(20px,4vw,28px)",color:T.ink,lineHeight:1.25,margin:"0 0 16px"}}>{story.headline}</h1>
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,color:"#2A2620",lineHeight:1.85,margin:"0 0 20px"}}>{story.body}</p>

          <div style={{background:"#FFFBF0",borderRadius:12,padding:"16px 18px",marginBottom:24,borderLeft:`3px solid ${T.amber}`}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:T.amber,letterSpacing:"0.14em",margin:"0 0 8px"}}>WHAT PEOPLE ARE BUILDING</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#3A3020",lineHeight:1.75,margin:0}}>{story.build}</p>
          </div>





        </div>
      </div>
    </div>
  );
}

// ── HOME VIEW (responsive: mobile stacked, desktop 2-col) ─────────────────────
function Marquee() {
  const ITEMS = [
    "AI News — Daily at 6AM ET",
    "Learn AI from scratch",
    "Free newsletter",
    "Weekly intelligence brief",
    "Model releases & updates",
    "How to make money with AI",
    "LLMs, Agents & Tools",
    "Covering OpenAI, Google, Anthropic & more",
    "AI business & strategy",
    "No fluff. Just shifts.",
  ];
  const repeated = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return (
    <div style={{
      background:"#0F0F0F",
      borderBottom:"1px solid #1A1A1A",
      overflow:"hidden",
      padding:"9px 0",
    }}>
      <div className="marquee-track">
        {repeated.map((item,i)=>(
          <span key={i} style={{
            fontFamily:"'IBM Plex Sans',sans-serif",
            fontSize:12,
            color:"rgba(255,255,255,0.7)",
            whiteSpace:"nowrap",
            padding:"0 32px",
            display:"flex",
            alignItems:"center",
            gap:8,
          }}>
            {item}
            <span style={{color:"#333",marginLeft:32}}>|</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function HomeView({ articles, date, cat, setCat, page, setPage, onSelect, onNav, weeklyArticles }) {
  const feed = (cat==="All" ? articles.filter(a=>!a.feat) : articles.filter(a=>a.cat===cat));
  const shown = feed.slice(0,(page+1)*6);
  const more = (page+1)*6 < feed.length;

  return (
    <div>
      <Marquee/>
      <HeroCarousel articles={articles} onSelect={onSelect}/>
      <BriefStrip onNav={onNav} weeklyArticles={weeklyArticles}/>
      <div style={{background:T.bg,maxWidth:1200,margin:"0 auto"}}>
        <div style={{height:1,background:T.light,margin:`0 ${INSET}px`}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:`16px ${INSET}px 6px`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:3,height:16,background:T.red,borderRadius:2}}/>
            <span style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:16,color:T.ink}}>Stories for you</span>
          </div>
          <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{date}</span>
        </div>
        <CategoryPills cat={cat} setCat={c=>{setCat(c);setPage(0);}}/>

        {/* Responsive grid: 1-col mobile, 2-col desktop */}
        <div className="story-grid">
          {shown.map((s,i)=>(
            <div key={s.id} style={{borderBottom:T.border}}>
              <StoryCard story={s} onSelect={onSelect}/>
            </div>
          ))}
        </div>

        <div style={{padding:`16px ${INSET}px`}}>
          {more
            ?<button onClick={()=>setPage(p=>p+1)} style={{width:"100%",background:T.card,border:T.border,borderRadius:24,padding:"12px 0",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:T.ink,cursor:"pointer",fontWeight:500}}>Load more stories</button>
            :<p style={{textAlign:"center",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:T.mid,margin:0}}>You're all caught up · Check back tomorrow</p>
          }
        </div>
      </div>
    </div>
  );
}

// ── BRIEF PAGE ────────────────────────────────────────────────────────────────
const BRIEF_FULL=[
  {id:"glance",label:"At a Glance",color:T.ink,items:[
    {h:"Claude 4 Sonnet launched",s:"Anthropic released Claude 4 Sonnet — the new default model in their API. It handles 100K+ token contexts without losing coherence, costs ~20% less per token than the previous version, and is measurably faster on multi-step tasks. If your pipeline uses Claude, switching model strings is the only change needed."},
    {h:"OpenAI image API fixes text rendering",s:"GPT-4o's image generation can now render logos, headlines, and branded text with near-zero errors — a problem that plagued every AI image tool for years. This opens the door to AI-generated marketing materials, branded mockups, and social content at scale."},
    {h:"Figure AI: 142,649 packages sorted in 114 hours, no humans",s:"Figure AI planned an 8-hour humanoid robot demo. The robots ran for 114 consecutive hours, sorting over 142,000 packages in a real warehouse. No human intervention. This is the first documented case of humanoid robots running an industrial operation end-to-end."},
    {h:"Copilot: 100M daily active users",s:"Microsoft confirmed GitHub Copilot now has 100 million daily active users — tripling in 12 months. The growth was driven by deep integration into Teams, Excel, and Word. This means your clients are already using AI whether they told you or not."},
    {h:"Gemini 2.5 Pro leads on long documents",s:"Google's Gemini 2.5 Pro now tops benchmarks for processing documents over 50 pages — outperforming GPT-4o and Claude on dense technical content, legal docs, and financial reports. Practically: use Gemini for anything that requires reading large files end-to-end."},
    {h:"Mistral runs fully on-device",s:"Mistral's latest model runs locally on consumer hardware with no internet connection required. This is significant for regulated industries (healthcare, legal, finance) where data can't leave the building — and for builders who want to offer offline-capable AI tools."},
    {h:"Sam Altman: AGI within a year",s:"OpenAI's CEO said publicly that artificial general intelligence — AI that can do most knowledge work at human level — could arrive within a year. Whether or not the timeline is accurate, it signals that frontier AI labs believe we're in the final phase of the transition. Build now."},
  ]},
  {id:"money",label:"Money Moves",color:CATS.Earn,items:[
    {h:"AI Brand Kits: $500–$1,500",s:"OpenAI's text-rendering fix made AI-generated logos and branded mockups viable for the first time. Designers and marketers are packaging this into fixed-price brand kit offers — logo variants, social templates, color palettes — and closing in under 3 hours. One designer reported $11K in her first week."},
    {h:"VA Replacement: $1,500 setup + $300/mo",s:"Small businesses are replacing full-time virtual assistants with n8n + Claude pipelines that handle inbox triage, lead follow-up, appointment scheduling, and invoice processing. The pitch: same output, lower cost, zero sick days. One operator closed 14 clients in 60 days at this price point."},
    {h:"ElevenLabs Voice Add-On: $300–$500/mo",s:"ElevenLabs' voice cloning now passes quality checks for client-facing audio — narration, training videos, podcast-style content. Agencies are adding it as a monthly retainer add-on on top of existing web or content packages. One agency added $4,200 MRR in 30 days with zero new hires."},
    {h:"Copilot Implementation: $2K–$5K",s:"With 100M daily Copilot users, clients are no longer skeptical — they want someone to set it up properly. Done-for-you Copilot implementation packages covering Teams, Excel, and Outlook are closing at $2K–$5K. The sell is easy because the product already has social proof at scale."},
    {h:"Prompt Engineering Courses: $397–$797",s:"Niche-specific prompt courses (for real estate agents, lawyers, e-commerce operators) are outperforming generic AI courses 10-to-1. The formula: build an audience in one vertical for 5 weeks, document real results, sell a course that solves one specific workflow. Price anchors at $397–$797."},
  ]},
  {id:"models",label:"Model Updates",color:CATS.Models,items:[
    {h:"Claude 4 Sonnet — switch now",s:"Claude 4 Sonnet is Anthropic's new mid-tier model — positioned between Haiku (fast/cheap) and Opus (most capable). It's now the best value in the Claude lineup: 20% cheaper than Claude 3 Sonnet, faster response times, and better performance on multi-step reasoning tasks. Update your API calls from claude-3-sonnet to claude-sonnet-4-6."},
    {h:"Gemini 2.5 Pro — use for long documents",s:"Google's Gemini 2.5 Pro has a 1M token context window and currently leads all benchmarks on long-document comprehension — legal contracts, technical manuals, financial filings. If you're building anything that needs to read and reason across large files, Gemini 2.5 Pro is the current best choice."},
    {h:"OpenAI o3 — API now live",s:"o3 is OpenAI's reasoning-specialized model. Unlike standard models that respond immediately, o3 'thinks' before answering — working through complex logic step by step. This makes it significantly better at math, code review, legal analysis, and any task where correctness matters more than speed. Available via API now."},
    {h:"Mistral — runs locally, no internet",s:"Mistral's latest model can run entirely on local hardware — a MacBook Pro or a small server — with no API calls, no data leaving the device. This is the first frontier-quality model that works in air-gapped environments. Opens up healthcare, government, and legal markets that were previously inaccessible."},
  ]},
  {id:"tools",label:"Tools to Know",color:CATS.Tools,items:[
    {h:"Cursor Background Agents",s:"Cursor is an AI-first code editor. Background Agents is a new feature that lets you assign coding tasks that run asynchronously while you're doing other work — you come back to a completed pull request. One developer documented running 9 simultaneous client projects at $40K/month using this workflow alone."},
    {h:"Perplexity Pro Research Mode",s:"Perplexity's Pro tier includes a research agent that autonomously searches, reads, and synthesizes information from multiple sources into a structured report — in about 10 minutes. It's not a replacement for expert analysis, but it's an excellent first draft. Consultants are using it to reduce research time by 80% and charging the same rate."},
    {h:"Luma AI + Blender",s:"Luma AI generates 3D scenes from photos or text prompts. Combined with Blender (free, industry-standard 3D software), it creates a pipeline for architectural visualization, product renders, and game assets. Freelancers are charging $500–$2K per scene for real estate and e-commerce clients."},
    {h:"Make.com + Claude",s:"Make.com (formerly Integromat) is a no-code automation platform similar to Zapier but with more flexibility. When connected to Claude via API, it enables complex multi-step AI workflows — intake forms that auto-respond, CRMs that write their own follow-ups, support tickets that self-triage. Average deal size for these buildouts: $4,800."},
  ]},
  {id:"watch",label:"Watch List",color:CATS.Strategy,items:[
    {h:"Spot + Claude open-source",s:"Boston Dynamics' Spot robot now has an open-source Claude integration — meaning anyone can program the robot using plain English commands. This is early, but it signals a coming wave of AI-controlled physical robots that non-engineers can deploy. A robotics consulting niche is forming around this."},
    {h:"EU AI Act enforcement begins",s:"The EU AI Act — the world's first comprehensive AI regulation — is moving into active enforcement. US companies selling to EU customers, or EU companies using AI tools, must now document their AI systems and demonstrate compliance. US consultants with AI expertise are already being hired by EU firms to help navigate this."},
    {h:"AGI timeline pressure",s:"Multiple frontier lab leaders have stated AGI could arrive within 1–2 years. Whether or not that's accurate, it's creating urgency: businesses that don't have AI workflows established now will face a much steeper learning curve when capabilities accelerate. The window to build expertise and systems is open now."},
    {h:"Image-to-3D maturing",s:"Tools that convert photos or 2D images into 3D models are improving rapidly. Current quality is approaching professional-grade for architectural visualization, product design, and game development. Real estate firms and e-commerce brands are the first buyers — watch for a freelance market to emerge in the next 60–90 days."},
  ]},
];
function BriefPage({ articles, onSelect }) {
  const items = articles || [];
  return (
    <div style={{background:T.bg,paddingBottom:40}}>
      <div style={{background:T.ink,padding:`28px ${INSET}px 24px`}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:T.amber,letterSpacing:"0.18em"}}>WEEKLY INTELLIGENCE BRIEF</span>
        <h1 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:22,color:"#fff",lineHeight:1.2,margin:"8px 0 6px"}}>Last Week's Most Important AI Stories</h1>
        <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",margin:0}}>Catch up on the top stories you may have missed</p>
      </div>

      {items.length === 0 ? (
        <div style={{padding:`40px ${INSET}px`,textAlign:"center"}}>
          <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:18,color:T.ink,margin:"0 0 8px"}}>Last week's brief is being compiled...</p>
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:T.mid,margin:0}}>Check back Monday — it updates each week.</p>
        </div>
      ) : (
        <div style={{maxWidth:800,margin:"0 auto"}}>
          {items.map((story,i)=>(
            <div key={story.id||i} onClick={()=>onSelect(story)}
              style={{cursor:"pointer",borderBottom:T.border}}>
              <div style={{position:"relative",height:"clamp(180px,45vw,260px)",overflow:"hidden"}}>
                <NewsImg src={story.img} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%)"}}/>
                <div style={{position:"absolute",top:12,left:12,background:i<3?T.red:"rgba(0,0,0,0.55)",backdropFilter:"blur(6px)",borderRadius:20,padding:"3px 10px"}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:11,color:"#fff",letterSpacing:"0.08em"}}>#{i+1} THIS WEEK</span>
                </div>
                <div style={{position:"absolute",bottom:10,left:12}}>
                  <CatBadge cat={story.cat}/>
                </div>
              </div>
              <div style={{padding:`14px ${INSET}px`}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{story.source}</span>
                  <span style={{color:T.light}}>·</span>
                  <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid}}>{story.time} ago</span>
                </div>
                <h2 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:17,color:T.ink,lineHeight:1.3,margin:"0 0 8px"}}>{story.headline}</h2>
                <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:"#4A4A4A",lineHeight:1.65,margin:0,WebkitLineClamp:3,display:"-webkit-box",WebkitBoxOrient:"vertical",overflow:"hidden"}}>{story.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── SUBSCRIBE PAGE (wired to Web3Forms → captures real emails) ─────────────────
function SubPage() {
  const [email,setEmail]=useState("");
  const [status,setStatus]=useState("idle"); // idle | sending | done | error

  const handleSubmit = async () => {
    if(!email || status==="sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data.success ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{padding:`32px ${INSET}px`,maxWidth:560,margin:"0 auto"}}>
      <div style={{background:T.ink,borderRadius:20,padding:"28px 20px",marginBottom:24}}>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:T.amber,letterSpacing:"0.18em",margin:"0 0 8px"}}>FREE · DAILY · 6AM ET</p>
        <h2 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:24,color:"#fff",lineHeight:1.15,margin:"0 0 12px"}}>The AI shift in your inbox before the market opens.</h2>
        <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.65,margin:0}}>What moved in AI, who's making money, and what you should do next. Every morning. Free.</p>
      </div>

      {status==="done" ? (
        <div style={{background:"#F0FDF4",border:"1px solid #16A34A",borderRadius:16,padding:"24px",textAlign:"center"}}>
          <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:20,color:T.ink,margin:"0 0 6px"}}>You're in.</p>
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:T.mid,margin:0}}>First issue hits your inbox tomorrow at 6AM ET.</p>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input type="email" placeholder="your@email.com" value={email}
            onChange={e=>setEmail(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
            style={{width:"100%",background:"#F8F8F6",border:T.border,borderRadius:24,color:T.ink,padding:"14px 18px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          <button onClick={handleSubmit} disabled={!email||status==="sending"}
            style={{width:"100%",background:email&&status!=="sending"?T.ink:T.light,border:"none",borderRadius:24,color:email&&status!=="sending"?"#fff":T.mid,padding:"14px 0",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,cursor:email&&status!=="sending"?"pointer":"not-allowed",fontWeight:600,transition:"all 0.2s"}}>
            {status==="sending" ? "Subscribing..." : "Get the daily shift"}
          </button>
          {status==="error"&&<p style={{textAlign:"center",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:T.red,margin:0}}>Something went wrong. Try again.</p>}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:24}}>
        {[{n:"6 AM",l:"Delivery ET"},{n:"Daily",l:"Updates"},{n:"Zero",l:"Fluff"},{n:"Free",l:"Forever"}].map(s=>(
          <div key={s.l} style={{background:"#F8F8F6",border:T.border,borderRadius:14,padding:"16px 14px"}}>
            <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:22,color:T.ink,margin:"0 0 2px"}}>{s.n}</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:T.mid,margin:0}}>{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── BOTTOM NAV (mobile only, hidden on desktop) ────────────────────────────────
// BottomNav removed — replaced by hamburger menu in Header


// ── LEARN PAGE ────────────────────────────────────────────────────────────────
const LEARN_SECTIONS = [
  {
    id:"what-is-ai",
    label:"What is AI?",
    color:CATS.Models,
    intro:"Artificial Intelligence (AI) is software that can perform tasks that normally require human intelligence — understanding language, recognizing images, writing, reasoning, and making decisions.",
    content:[
      {q:"The simple version",a:"AI is a program that learns from examples instead of following fixed rules. Instead of a programmer writing out every possible scenario, an AI system is trained on massive amounts of data and learns to find patterns on its own. Show it millions of photos of cats and dogs, and it learns to tell them apart. Show it billions of sentences, and it learns to write."},
      {q:"Where it came from",a:"AI research started in the 1950s, but for decades it was limited by computing power and data availability. The modern AI boom began around 2012 when deep learning — a technique inspired by the human brain — suddenly became dramatically more powerful. By 2022, AI had become capable enough that regular people could use it directly through tools like ChatGPT."},
      {q:"What AI can and can't do",a:"Today's AI is excellent at: generating text, images, audio, and video; summarizing and analyzing documents; writing and reviewing code; answering questions; and automating repetitive knowledge work. It still struggles with: consistent logical reasoning on novel problems, understanding physical reality, long-term planning, and tasks requiring true common sense. It has no consciousness, opinions, or desires — it's a very sophisticated pattern-matching system."},
      {q:"Why it matters right now",a:"The cost of AI capability has dropped 99%+ in the last three years. Tasks that required a team of specialists now cost pennies and take seconds. This is creating a massive economic shift — businesses that adopt AI gain enormous speed and cost advantages over those that don't. The window to get ahead of this curve is open now, and narrowing."},
    ]
  },
  {
    id:"what-is-llm",
    label:"What is an LLM?",
    color:CATS.Models,
    intro:"A Large Language Model (LLM) is the type of AI that powers ChatGPT, Claude, Gemini, and most AI writing and reasoning tools. It's trained to understand and generate human language at a very high level.",
    content:[
      {q:"How it works",a:"An LLM is trained by reading an enormous amount of text — websites, books, code, articles — and learning to predict what word comes next in a sentence. Done at massive scale (billions of examples, billions of parameters), this simple task produces a system that can write, reason, answer questions, summarize, translate, and hold conversations. The 'large' in LLM refers to both the size of the training data and the number of parameters (internal settings) the model uses."},
      {q:"What 'parameters' means",a:"Parameters are the numerical values inside the model that determine how it responds to any input. A model with 70 billion parameters has 70 billion internal dials that were tuned during training. More parameters generally means a more capable model, but also more computing power required to run it. GPT-4 is estimated to have around 1.8 trillion parameters."},
      {q:"Context window",a:"The context window is how much text an LLM can 'see' at once — its short-term memory. Early models had context windows of around 4,000 tokens (about 3,000 words). Today's best models handle 1 million tokens or more — equivalent to about 750,000 words, or several large novels. Larger context windows let you feed the model entire codebases, legal documents, or research papers."},
      {q:"The main LLMs and who makes them",a:"OpenAI makes GPT-4o and the o-series reasoning models. Anthropic makes Claude (Haiku, Sonnet, Opus). Google makes Gemini. Meta makes Llama (open-source). Mistral makes models that run locally. xAI (Elon Musk) makes Grok. DeepSeek (China) makes powerful open-source models. Each has different strengths — some are faster and cheaper, others are better at reasoning, coding, or handling long documents."},
      {q:"Tokens — what they are",a:"LLMs don't read word by word — they read in 'tokens,' which are chunks of text roughly 3-4 characters long. '1,000 tokens' is about 750 words. Token limits matter for pricing (you pay per token) and context length. When people say a model 'runs out of context,' it means it's processed too many tokens and can no longer see earlier parts of the conversation."},
    ]
  },
  {
    id:"what-is-ml",
    label:"Machine Learning & Neural Networks",
    color:CATS.Strategy,
    intro:"Machine learning is the broader field that includes LLMs. A neural network is the underlying architecture that makes modern AI work. Understanding these terms helps you read AI news intelligently.",
    content:[
      {q:"Machine learning vs. AI",a:"AI is the broad goal: build machines that can do intelligent things. Machine learning is the main method used to achieve that goal today. Instead of programming rules manually, machine learning systems learn from data. Deep learning is a subset of machine learning that uses neural networks with many layers — it's what powers image recognition, speech recognition, and LLMs."},
      {q:"What a neural network is",a:"A neural network is a system loosely inspired by the human brain. It consists of layers of 'neurons' (mathematical functions) connected to each other. Data flows through these layers, getting transformed at each step. During training, the network adjusts the strength of these connections based on whether it got the right answer. After enough training, it gets very good at the task. Modern AI uses networks with hundreds of layers — hence 'deep' learning."},
      {q:"Training vs. inference",a:"Training is when a model is learning — processing massive datasets and adjusting its parameters. This happens once (or periodically) and is extremely expensive computationally. Inference is when the trained model is actually used — generating a response when you ask it a question. Inference is much cheaper and faster than training. When you use ChatGPT, you're doing inference on a model that was trained months earlier."},
      {q:"Supervised vs. unsupervised learning",a:"In supervised learning, the AI is trained on labeled examples — 'this image is a cat, that one is a dog.' In unsupervised learning, the AI finds patterns in data without labels. LLMs primarily use self-supervised learning — the training data labels itself (predict the next word in a real sentence). This is why they can learn from so much data without humans needing to label everything."},
    ]
  },
  {
    id:"what-is-genai",
    label:"Generative AI",
    color:CATS.Tools,
    intro:"Generative AI refers to AI systems that create new content — text, images, audio, video, and code — rather than just analyzing or classifying existing content.",
    content:[
      {q:"What it generates",a:"Generative AI can produce: text (articles, emails, code, scripts), images (photos, illustrations, logos), audio (voices, music, sound effects), video (short clips, animations), and 3D models. Each modality has specialized models: GPT-4o and Claude for text, DALL-E and Midjourney for images, ElevenLabs and Suno for audio, Sora and Runway for video."},
      {q:"How image generation works",a:"Image generation models (like DALL-E, Midjourney, Stable Diffusion) work differently from LLMs. They're typically trained using a process called diffusion — starting with random noise and learning to gradually remove that noise to produce a coherent image that matches a text description. The result is a model that can generate an image matching almost any text prompt."},
      {q:"Multimodal AI",a:"Multimodal AI can handle multiple types of input and output simultaneously. GPT-4o can see images and hear audio as input, and respond with text or speech. This is a significant advancement — earlier AI was siloed into text-only or image-only. Multimodal models are better at tasks like describing photos, reading handwritten notes, analyzing charts, and having voice conversations."},
      {q:"Hallucination",a:"Hallucination is when an AI generates confident-sounding text that is factually wrong. It happens because LLMs are trained to produce plausible text, not necessarily true text. They don't have a fact-checker — they predict what a good response looks like based on patterns. Always verify specific facts, dates, names, and statistics that come from an AI. Newer models with web search access hallucinate less, but the problem isn't solved."},
    ]
  },
  {
    id:"prompting",
    label:"Prompts & Prompt Engineering",
    color:CATS.Earn,
    intro:"A prompt is the input you give an AI — your question, instruction, or request. Prompt engineering is the skill of writing prompts that get reliably good results.",
    content:[
      {q:"What makes a good prompt",a:"Good prompts are specific, give context, and tell the AI what format you want the answer in. Bad: 'Write me an email.' Good: 'Write a 3-paragraph follow-up email to a potential client who attended our product demo yesterday. Tone: professional but warm. Include a specific next step asking them to schedule a 30-minute call. Sign off as Sky from Ten18 Design.' The more context you give, the better the output."},
      {q:"System prompts",a:"A system prompt is an instruction given to an AI before the conversation starts — it sets the rules, persona, and context for the entire interaction. When you build an AI product, the system prompt is where you define the AI's role ('You are a customer service agent for Red Angel Detailing'), the rules it should follow, and the format of its responses. Users typically don't see system prompts."},
      {q:"Temperature and randomness",a:"Most AI APIs let you control 'temperature' — a setting that determines how random or predictable the AI's responses are. Low temperature (0–0.3): very consistent, predictable, good for factual tasks. High temperature (0.7–1.0): more creative and varied, good for brainstorming. Most production applications use moderate temperatures (0.3–0.7) to balance quality and variety."},
      {q:"Few-shot prompting",a:"Few-shot prompting means including examples of the output you want in your prompt. Instead of just describing what you want, you show the AI 2-3 examples. Example: 'Here are 3 product descriptions I've written: [examples]. Now write one for this product: [new product].' This dramatically improves output quality because the AI can match the exact style, format, and tone of your examples."},
      {q:"Chain of thought",a:"Chain-of-thought prompting asks the AI to reason through a problem step by step before giving an answer. Adding 'Let's think through this step by step' or 'Show your reasoning' to a prompt makes AI significantly better at complex problems — math, logic, legal analysis, debugging. The reasoning process itself improves the answer."},
    ]
  },
  {
    id:"rag-agents",
    label:"RAG, Agents & Fine-tuning",
    color:CATS.Business,
    intro:"These are more advanced AI concepts that come up constantly in product and business conversations. Understanding them helps you have informed discussions with developers and clients.",
    content:[
      {q:"What is RAG?",a:"RAG stands for Retrieval-Augmented Generation. It's a technique where an AI retrieves relevant information from a database or document collection before generating a response — instead of relying only on what it learned during training. Example: a customer service chatbot backed by your company's knowledge base. When a customer asks a question, the system first finds the relevant help articles, then feeds them to the LLM to generate an accurate answer. RAG is how you build AI that knows about your specific business."},
      {q:"What is an AI agent?",a:"An AI agent is a system where an AI doesn't just answer a single question — it takes a sequence of actions to accomplish a goal. Agents can use tools (search the web, run code, read files, send emails), make decisions, and loop until the task is done. Example: instead of asking an AI 'what's the weather in Paris,' an agent would check a weather API, compare it to the forecast, and automatically update your calendar if rain is expected. Most 'AI automation' products are agent systems."},
      {q:"What is fine-tuning?",a:"Fine-tuning is the process of taking a pre-trained model (like GPT-4) and training it further on your specific data to make it better at your specific task. A customer service model fine-tuned on your company's past support tickets will outperform a generic model on your use case. Fine-tuning is expensive and complex — most businesses get better results from good prompting and RAG before investing in fine-tuning."},
      {q:"What is an embedding?",a:"An embedding is a numerical representation of text (or images, audio) that captures its meaning. Similar things have similar embeddings. This is the technology behind semantic search — finding documents that mean the same thing even if they use different words. Embeddings are the foundation of RAG systems: you convert all your documents into embeddings, store them in a vector database, and when a question comes in, find the documents whose embeddings are closest to the question's embedding."},
      {q:"Vector databases",a:"A vector database stores embeddings and lets you search them by similarity rather than exact match. Examples: Pinecone, Weaviate, Supabase pgvector, Chroma. When someone asks your RAG-powered chatbot a question, the system converts the question into an embedding, searches the vector database for the most similar document embeddings, retrieves those documents, and passes them to the LLM to generate an answer grounded in your actual content."},
    ]
  },
  {
    id:"companies",
    label:"Key Companies & Their Models",
    color:CATS.Robotics,
    intro:"The AI landscape is dominated by a handful of companies whose model releases directly affect what's possible in any AI product. Knowing who makes what helps you follow the news intelligently.",
    content:[
      {q:"Anthropic — Claude",a:"Anthropic is an AI safety company founded by former OpenAI researchers including Dario and Daniela Amodei. They make the Claude family of models: Claude Haiku (fast, cheap, good for automation), Claude Sonnet (balanced performance and cost, best for most applications), and Claude Opus (most capable, premium pricing). Claude is known for being particularly good at nuanced writing, following complex instructions, and refusing genuinely harmful requests while staying helpful."},
      {q:"OpenAI — GPT & o-series",a:"OpenAI is the most prominent AI company, known for ChatGPT and the GPT model series. Their current lineup includes GPT-4o (their primary model, multimodal), the o-series reasoning models (o1, o3 — slower but much better at complex logic and math), and DALL-E for image generation. OpenAI also built Sora (video generation) and Whisper (speech recognition). They pioneered the current AI boom with ChatGPT in late 2022."},
      {q:"Google — Gemini",a:"Google DeepMind makes the Gemini model family: Gemini Flash (fast/cheap), Gemini Pro (balanced), and Gemini Ultra (most capable). Gemini 1.5 Pro has a 1-million-token context window, making it best-in-class for processing very long documents. Google also has unique advantages in search integration, YouTube data, and Android distribution. Their AI is embedded in Google Workspace (Docs, Gmail, Sheets) as 'Gemini' features."},
      {q:"Meta — Llama (open-source)",a:"Meta releases Llama models as open-source — meaning anyone can download, run, and modify them for free. This is significant because it enables private AI deployments with no API costs, and has spawned thousands of specialized models fine-tuned from Llama. Llama 3 70B runs on a single high-end GPU and performs competitively with commercial models. Meta's open-source strategy is intentional — they benefit from the AI ecosystem improving while giving the models away free."},
      {q:"Mistral — efficient & local",a:"Mistral is a French AI company making highly efficient models — particularly good at running on limited hardware. Their models can run on a laptop or small server with no internet connection, making them ideal for regulated industries where data can't leave the building. Mistral also makes Mixtral, a mixture-of-experts model that punches well above its size."},
      {q:"xAI — Grok",a:"xAI is Elon Musk's AI company, making the Grok model. Grok is integrated into X (Twitter) and has real-time access to posts on the platform. It's positioned as a less restricted alternative to ChatGPT. Grok 3 is competitive with top-tier models on benchmarks. xAI raised $6B in 2024 and is building massive GPU clusters in Memphis, Tennessee."},
      {q:"DeepSeek",a:"DeepSeek is a Chinese AI company that released highly capable open-source models — including DeepSeek-V3 and DeepSeek-R1 — that match or beat frontier US models at a fraction of the training cost. DeepSeek R1's release in January 2025 caused significant market disruption and drew comparisons to Sputnik. Their efficiency innovations are being adopted across the industry. The models are free and open-source, running on the same Llama infrastructure as Meta's models."},
    ]
  },
  {
    id:"agentic",
    label:"Agentic AI — What It Is & How to Build It",
    color:CATS.Earn,
    intro:"Agentic AI means giving an AI system the ability to take actions, make decisions, and complete multi-step tasks autonomously — rather than just answering a single question. It's the difference between asking an AI something and having an AI do something.",
    content:[
      {q:"What 'agentic' actually means",a:"A regular AI interaction is a single turn: you ask, it answers. An agentic AI system is a loop: the AI receives a goal, decides what steps to take, executes those steps (using tools, APIs, or other systems), evaluates the results, and continues until the task is done. The AI is acting as an agent — something that perceives its environment and takes actions to achieve a goal — rather than just a responder."},
      {q:"The core components of an agent",a:"Every agentic system has four parts: (1) A brain — an LLM that reasons and decides what to do next. (2) Tools — functions the AI can call to interact with the world: search the web, read/write files, call APIs, send emails, run code. (3) Memory — a way to store and retrieve information across steps, either in the context window or a database. (4) A loop — logic that keeps the agent running until the task is complete or a stopping condition is met. You don't need all four for every agent, but most useful agents have all of them."},
      {q:"Tools — how agents interact with the world",a:"Tools are what make agents powerful. Without tools, an AI can only generate text. With tools, it can do things. Common tools include: web search (Perplexity, Tavily, Google), code execution (running Python, JavaScript), file reading/writing, API calls (sending emails, creating calendar events, posting to social media), database queries, and browser control (filling forms, clicking buttons, scraping pages). You define the tools, describe what they do, and the AI decides when and how to use them."},
      {q:"How to build a simple agent with Claude",a:"The simplest agent loop: (1) Give Claude a system prompt that defines its role and the tools available. (2) Give it a task. (3) Claude responds with either an answer or a tool call. (4) If it's a tool call, your code executes it and returns the result to Claude. (5) Claude uses the result to take the next step. (6) Repeat until Claude returns a final answer. This is called a ReAct loop (Reason + Act). In code, it's a while loop that keeps calling the Claude API until the model stops requesting tools."},
      {q:"No-code agentic tools",a:"You don't need to write code to build agents. Make.com and n8n are visual workflow builders where you connect nodes — each node is a step the agent takes. Zapier has AI steps built in. Relevance AI, Cassidy, and Voiceflow let you build conversational agents with tools and memory. These platforms handle the loop logic for you — you just define the steps, the conditions, and the tools. Most AI service businesses are built on these platforms, not custom code."},
      {q:"Memory in agents — short-term vs long-term",a:"Short-term memory is the context window — everything in the current conversation. It's fast but limited and disappears when the session ends. Long-term memory requires storing information externally — in a database, a vector store, or a file — and retrieving it when relevant. A customer service agent with long-term memory can remember that a specific customer called last week and what their issue was. Implementing long-term memory usually means: after each session, summarize key facts and store them in a database, then retrieve relevant facts at the start of each new session."},
      {q:"Making a business task agentic — step by step",a:"Pick one repetitive task your business does: responding to lead inquiries, following up with clients, scheduling calls, generating reports, posting content. Map every step a human takes to complete it. For each step, identify which ones could be handled by an AI with the right tool (read email → draft response → send, or scrape competitor prices → compare → update spreadsheet). Build the simplest version first: one trigger, one action, one output. Test it on real data. Add steps only when the simple version works reliably. The goal is a system that runs without you touching it."},
      {q:"Real examples of agentic workflows",a:"Lead qualification: a form submission triggers an agent that reads the lead's info, researches their company, scores the lead, drafts a personalized outreach email, and adds them to a CRM — all without human involvement. Content pipeline: an agent monitors RSS feeds, identifies relevant stories, writes summaries in your brand voice, posts to social media, and logs everything to a spreadsheet. Client onboarding: when a contract is signed, an agent creates the project folder, sends a welcome email with a questionnaire, schedules the kickoff call, and creates tasks in your project management tool. Each of these is a real workflow operators are running today."},
      {q:"The difference between automation and agents",a:"Traditional automation is deterministic — if X happens, do Y. It follows fixed rules and breaks when something unexpected occurs. Agents are adaptive — they reason about what to do based on the situation. An automation sends the same follow-up email to every lead. An agent reads each lead's profile, decides what to say, and writes a unique message. The tradeoff: automations are more reliable and predictable; agents are more flexible and capable but can occasionally make unexpected decisions. For most business applications, a hybrid works best — use deterministic automation for the routine steps and bring in an AI agent for the steps that require judgment."},
      {q:"Mistakes to avoid when building agents",a:"Starting too complex — build the simplest version that solves the real problem first. No error handling — agents will fail on unexpected inputs; always add fallback logic and logging. Infinite loops — always set a maximum number of steps so a confused agent can't run forever and rack up API costs. No human review step — for high-stakes actions (sending emails, making purchases, posting publicly), add a human approval step until you trust the agent completely. Skipping testing — test with real-world messy inputs before running on actual clients or live data."},
    ]
  },
  {
    id:"glossary",
    label:"AI Glossary",
    color:CATS.Strategy,
    intro:"A quick-reference glossary of terms you'll encounter in AI news, product discussions, and client conversations.",
    content:[
      {q:"API (Application Programming Interface)",a:"The way developers connect to an AI model programmatically. When someone says 'the Claude API,' they mean the service that lets software directly send prompts to Claude and receive responses — as opposed to using the Claude.ai chat interface. Most AI products are built on top of these APIs."},
      {q:"Inference cost",a:"The cost of running a trained AI model to generate a response. Measured in cost per token (per 1,000 or 1,000,000 tokens). Inference costs have dropped 99%+ since 2020, making AI economically viable for consumer products. This is why AI tools are getting cheaper — the underlying model costs are falling rapidly."},
      {q:"Open-source vs. closed-source",a:"Closed-source models (GPT-4, Claude, Gemini) are proprietary — you access them via API and pay per use, but you can't see or modify the underlying model. Open-source models (Llama, Mistral, DeepSeek) are publicly available — you can download them, run them locally, modify them, and build on them without licensing fees or API costs."},
      {q:"Benchmark",a:"A standardized test used to compare AI model performance. Common benchmarks: MMLU (general knowledge), HumanEval (coding), MATH (mathematics), GPQA (graduate-level reasoning). When a company says their model 'tops the benchmark,' take it with some skepticism — companies often optimize for specific benchmarks and real-world performance may differ."},
      {q:"Foundation model",a:"A large AI model trained on broad data that can be adapted to many different tasks. GPT-4, Claude, and Gemini are foundation models. They're called 'foundation' because they serve as the base for building more specialized applications — fine-tuned versions, RAG systems, agents, etc."},
      {q:"Latency",a:"How long an AI takes to respond. For real-time applications (voice assistants, chat), latency matters enormously — users expect responses in under 1-2 seconds. For batch processing (summarizing 1,000 documents overnight), latency is less important than cost and accuracy. Different models are optimized for different latency/quality tradeoffs."},
      {q:"Multimodal",a:"An AI model that can process multiple types of input (text, images, audio, video) or produce multiple types of output. GPT-4o is multimodal — it can see images, hear audio, and respond with text or speech. Earlier models were unimodal — text only, or image only."},
      {q:"On-premise / on-device AI",a:"Running AI locally on your own hardware rather than sending data to a cloud API. Important for: privacy (data never leaves your server), regulated industries (healthcare, legal, finance), offline use cases, and cost reduction at scale. Mistral and Llama are commonly used for on-premise deployments."},
      {q:"Quantization",a:"A technique to reduce model size and memory requirements by using lower-precision numbers internally. A quantized model runs faster and uses less RAM, with minimal quality loss. This is what makes large models practical to run on consumer hardware — a 70B parameter model normally requires 140GB of RAM, but a 4-bit quantized version needs only about 40GB."},
      {q:"RLHF (Reinforcement Learning from Human Feedback)",a:"The technique used to make AI models behave helpfully and safely. After initial training, human raters compare pairs of AI responses and say which is better. The model is then further trained to produce responses like the ones humans preferred. This is a major reason why ChatGPT and Claude feel more natural and helpful than earlier AI systems."},
    ]
  },
];

function LearnPage({ onNav }) {
  const [openId,setOpenId]=useState(null);
  const [openQ,setOpenQ]=useState(null);

  return (
    <div style={{background:T.bg,paddingBottom:40,maxWidth:800,margin:"0 auto"}}>
      {/* Header */}
      <div style={{background:T.ink,padding:`28px ${INSET}px 24px`}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:T.amber,letterSpacing:"0.18em"}}>SKAISHIFT LEARN</span>
        <h1 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:26,color:"#fff",lineHeight:1.2,margin:"8px 0 10px"}}>Everything You Need to Know About AI</h1>
        <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.6,margin:0}}>Plain-English explanations of AI concepts — from the basics to what builders and entrepreneurs actually need to understand.</p>
      </div>

      {/* Section list */}
      <div style={{padding:`16px ${INSET}px 0`}}>
        {LEARN_SECTIONS.map(sec=>(
          <div key={sec.id} style={{marginBottom:12,borderRadius:14,overflow:"hidden",border:T.border,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
            {/* Section header */}
            <button onClick={()=>setOpenId(openId===sec.id?null:sec.id)}
              style={{width:"100%",background:openId===sec.id?"#0F0F0F":"#fff",border:"none",padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:sec.color,flexShrink:0}}/>
                <span style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:16,color:openId===sec.id?"#fff":T.ink}}>{sec.label}</span>
              </div>
              <span style={{color:openId===sec.id?"rgba(255,255,255,0.5)":T.mid,fontSize:18,flexShrink:0}}>{openId===sec.id?"↑":"↓"}</span>
            </button>

            {/* Section content */}
            {openId===sec.id&&(
              <div style={{background:"#FAFAFA",padding:"0 18px 16px"}}>
                <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#3A3A3A",lineHeight:1.75,margin:"16px 0",padding:"14px 16px",background:"#F0EEF8",borderRadius:10,borderLeft:`3px solid ${sec.color}`}}>{sec.intro}</p>
                {sec.content.map((item,i)=>(
                  <div key={i} style={{marginBottom:8,borderRadius:10,overflow:"hidden",border:T.border}}>
                    <button onClick={()=>setOpenQ(openQ===`${sec.id}-${i}`?null:`${sec.id}-${i}`)}
                      style={{width:"100%",background:openQ===`${sec.id}-${i}`?"#F8F8F6":"#fff",border:"none",padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",gap:8,textAlign:"left"}}>
                      <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:13,color:T.ink}}>{item.q}</span>
                      <span style={{color:T.mid,fontSize:14,flexShrink:0}}>{openQ===`${sec.id}-${i}`?"−":"+"}</span>
                    </button>
                    {openQ===`${sec.id}-${i}`&&(
                      <div style={{padding:"0 14px 14px",background:"#F8F8F6"}}>
                        <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:"#2A2620",lineHeight:1.8,margin:0}}>{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{margin:`24px ${INSET}px 0`,background:T.ink,borderRadius:16,padding:"24px 20px",textAlign:"center"}}>
        <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:T.amber,letterSpacing:"0.18em",margin:"0 0 8px"}}>STAY CURRENT</p>
        <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:18,color:"#fff",margin:"0 0 12px",lineHeight:1.3}}>Now that you know the concepts, track the daily shifts.</p>
        <button onClick={()=>onNav("home")} style={{background:T.red,color:"#fff",border:"none",borderRadius:24,padding:"10px 24px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>Read Today's News →</button>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView]=useState("home");
  const [cat,setCat]=useState("All");
  const [page,setPage]=useState(0);
  const [art,setArt]=useState(null);
  const [newsData,setNewsData]=useState(FALLBACK);
  const [briefData,setBriefData]=useState(null);
  const [weeklyArticles,setWeeklyArticles]=useState([]);
  const [lastWeekArticles,setLastWeekArticles]=useState([]);

  // Load fresh news.json + weekly-brief.json (updated daily by GitHub Actions)
  useEffect(()=>{
    fetch("/news.json")
      .then(r=>{ if(r.ok) return r.json(); throw new Error(); })
      .then(d=>{ if(d?.articles?.length) setNewsData(d); })
      .catch(()=>{});
    fetch("/weekly-brief.json")
      .then(r=>{ if(r.ok) return r.json(); throw new Error(); })
      .then(d=>{ if(d?.sections?.length) setBriefData(d); })
      .catch(()=>{});
    fetch("/weekly-articles.json")
      .then(r=>{ if(r.ok) return r.json(); throw new Error(); })
      .then(d=>{ if(d?.articles?.length) setWeeklyArticles(d.articles); })
      .catch(()=>{});
    fetch("/last-week-articles.json")
      .then(r=>{ if(r.ok) return r.json(); throw new Error(); })
      .then(d=>{ if(d?.articles?.length) setLastWeekArticles(d.articles); })
      .catch(()=>{});
  },[]);

  // Scroll to top whenever view changes
  useEffect(()=>{ window.scrollTo(0,0); },[view]);

  const onSelect=a=>{setArt(a);setView("article");};
  const onBack=()=>{setArt(null);setView("home");};
  const onNav=v=>setView(v);

  return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;500;600&family=Lora:ital,wght@0,600;0,700;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        img{display:block;} button{-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{display:none;}
        @keyframes marquee{
          0%{transform:translateX(0)}
          100%{transform:translateX(-50%)}
        }
        .marquee-track{
          display:flex;
          width:max-content;
          animation:marquee 30s linear infinite;
        }
        .marquee-track:hover{
          animation-play-state:paused;
        }

        /* Desktop layout */
        @media(min-width:768px){
          .story-grid{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:0;
          }
          .story-grid > div {
            border-right:1px solid #E4E4E0;
          }
          .story-grid > div:nth-child(2n){
            border-right:none;
          }
          .bottom-nav{
            display:none !important;
          }
          .desktop-nav{
            display:flex !important;
          }
          .mobile-hamburger{
            display:none !important;
          }

        }
        .desktop-nav{ display:none; }
      `}</style>

      <Header onNav={onNav} onBack={view==="article"?onBack:null}/>

      <main style={{flex:1}}>
        {view==="home"      &&<HomeView articles={newsData.articles} date={newsData.date} cat={cat} setCat={c=>{setCat(c);setPage(0);}} page={page} setPage={setPage} onSelect={onSelect} onNav={onNav} weeklyArticles={weeklyArticles}/>}
        {view==="article"   &&art&&<ArticleDetail story={art} onBack={onBack} onNav={onNav}/>}
        {view==="brief"     &&<BriefPage articles={lastWeekArticles} onBack={()=>setView('home')} onSelect={onSelect}/>}
        {view==="subscribe" &&<SubPage/>}
        {view==="learn"      &&<LearnPage onNav={onNav}/>}
      </main>


    </div>
  );
}
