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
function Header({ onSubscribe }) {
  return (
    <header style={{
      background:"#0F0F0F",
      position:"sticky",top:0,zIndex:100,
      borderBottom:"1px solid #1A1A1A",
    }}>
      <div style={{
        maxWidth:1200,margin:"0 auto",
        padding:"10px 20px",
        display:"grid",
        gridTemplateColumns:"1fr auto 1fr",
        alignItems:"center",
        gap:12,
      }}>
        {/* Left: wordmark — white on black */}
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:"0.1em",lineHeight:1,whiteSpace:"nowrap"}}>
          <span style={{color:"#FFFFFF"}}>SK</span>
          <span style={{color:T.amber}}>AI</span>
          <span style={{color:"#FFFFFF"}}>SHIFT</span>
        </span>

        {/* Center: logo mark — invert(1) turns black strokes → white */}
        <img src={LOGO_SRC} alt="skAIshift"
          style={{height:52,width:"auto",display:"block",filter:"invert(1)"}}/>

        {/* Right: subscribe — white outline on black */}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <button onClick={onSubscribe}
            style={{background:"transparent",color:"#FFFFFF",border:"1px solid rgba(255,255,255,0.4)",borderRadius:20,padding:"8px 16px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,0.4)";}}>
            Subscribe
          </button>
        </div>
      </div>
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

function BriefStrip({ onNav }) {
  return (
    <div style={{background:"linear-gradient(180deg,#F0EEF8 0%,#F4F4F0 100%)",paddingBottom:16}}>
      <SectionHeader label="Weekly Brief" action="See all" onAction={()=>onNav("brief")}/>
      <div style={{display:"flex",overflowX:"auto",scrollSnapType:"x mandatory",scrollbarWidth:"none",gap:10,paddingLeft:INSET,paddingRight:INSET,scrollPaddingLeft:INSET,boxSizing:"content-box"}}>
        {BRIEF_CARDS.map(card=>(
          <div key={card.id} onClick={()=>onNav("brief")}
            style={{minWidth:196,flexShrink:0,scrollSnapAlign:"start",background:card.dark?"#0F0F0F":card.bg,borderRadius:14,padding:"14px",cursor:"pointer",display:"flex",flexDirection:"column",gap:8,border:card.dark?"none":`1px solid ${T.light}`,minHeight:172,boxShadow:"0 1px 6px rgba(0,0,0,0.07)"}}>
            <span style={{background:card.dark?T.red:card.color,color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:9,letterSpacing:"0.12em",padding:"2px 8px",borderRadius:3,alignSelf:"flex-start"}}>{card.label}</span>
            <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:13,color:card.dark?"#fff":T.ink,lineHeight:1.3,margin:0}}>{card.headline}</p>
            <div style={{display:"flex",flexDirection:"column",gap:5,flex:1}}>
              {card.items.map((item,j)=>(
                <div key={j} style={{display:"flex",gap:7,alignItems:"flex-start"}}>
                  <div style={{width:4,height:4,borderRadius:"50%",background:card.dark?T.amber:card.color,flexShrink:0,marginTop:5}}/>
                  <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:11,color:card.dark?"rgba(255,255,255,0.7)":"#3A3A3A",lineHeight:1.4}}>{item}</span>
                </div>
              ))}
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
      <div style={{position:"sticky",top:0,zIndex:50,background:"#0F0F0F",borderBottom:"1px solid #1A1A1A",padding:`12px ${INSET}px`}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"6px 14px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:"#fff",cursor:"pointer",fontWeight:500}}>← Back</button>
      </div>
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
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,color:"#2A2620",lineHeight:1.8,margin:"0 0 14px"}}>{story.body}</p>
          <div style={{background:"#FFFBF0",borderRadius:12,padding:"14px 16px",marginBottom:20,borderLeft:`3px solid ${T.amber}`}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:T.amber,letterSpacing:"0.14em",margin:"0 0 6px"}}>WHAT PEOPLE ARE BUILDING</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#3A3020",lineHeight:1.65,margin:0}}>{story.build}</p>
          </div>
          <div style={{background:T.red,borderRadius:12,padding:"16px",marginTop:24}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:"rgba(255,255,255,0.6)",letterSpacing:"0.14em",margin:"0 0 6px"}}>THE BOTTOM LINE</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#fff",lineHeight:1.6,margin:0,fontWeight:500}}>The window to build a niche AI income stream before saturation is narrowing. Act now, not after the next model drop.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HOME VIEW (responsive: mobile stacked, desktop 2-col) ─────────────────────
function HomeView({ articles, date, cat, setCat, page, setPage, onSelect, onNav }) {
  const feed = (cat==="All" ? articles.filter(a=>!a.feat) : articles.filter(a=>a.cat===cat));
  const shown = feed.slice(0,(page+1)*6);
  const more = (page+1)*6 < feed.length;

  return (
    <div>
      <HeroCarousel articles={articles} onSelect={onSelect}/>
      <BriefStrip onNav={onNav}/>
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
  {id:"glance",label:"At a Glance", color:T.ink,       items:["Claude 4 Sonnet — faster, longer context, 20% cheaper","OpenAI image API fixes text rendering","Figure AI: 142,649 packages, 114 hours, zero humans","Copilot: 100M daily users","Gemini 2.5 Pro leads on long-document processing","Mistral runs locally — regulated industries now accessible","Sam Altman: AGI within a year"]},
  {id:"money", label:"Money Moves", color:CATS.Earn,   items:[{h:"AI Brand Kits $500–$1,500",s:"OpenAI's text fix made this viable this week."},{h:"VA replacement $1,500 setup + $300/mo",s:"14 clients in 60 days."},{h:"ElevenLabs voice add-on $300–$500/mo",s:"$4,200 MRR in 30 days."},{h:"Copilot implementation $2K–$5K",s:"100M users means clients are already sold."},{h:"Prompt courses $397–$797",s:"Niche-specific. Build audience 5 weeks first."}]},
  {id:"models",label:"Model Updates",color:CATS.Models, items:[{h:"Claude 4 Sonnet",s:"Switch now. Same API, better output, lower cost."},{h:"Gemini 2.5 Pro",s:"Use for any doc over 50 pages."},{h:"OpenAI o3 (API live)",s:"Premium reasoning. Route high-stakes tasks here."},{h:"Mistral local",s:"On-device frontier capability."}]},
  {id:"tools", label:"Tools to Know",color:CATS.Tools,  items:[{h:"Cursor Background Agents",s:"Code overnight. Review in the morning."},{h:"Perplexity Pro Research",s:"10-min reports. Add analysis. Charge $2,500+."},{h:"Luma AI + Blender",s:"Photo to 3D. $500–$2K per scene."},{h:"Make.com + Claude",s:"No-code automation. Avg deal $4,800."}]},
  {id:"watch", label:"Watch List",   color:CATS.Strategy,items:["Spot + Claude open-source — robotics consulting niche forming","EU AI Act enforcement active","AGI timeline pressure","Image-to-3D maturing — game studio market opening"]},
];
function BriefPage({ briefData }) {
  const sections = briefData?.sections || BRIEF_FULL;
  const headline  = briefData?.headline  || "7 Shifts That Will Define the Next 90 Days";
  const weekLabel = briefData?.week      || "May 12–18, 2025";
  return (
    <div style={{background:T.bg,paddingBottom:24}}>
      <div style={{background:T.ink,padding:`28px ${INSET}px 24px`,borderRadius:"0 0 24px 24px"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:10,color:T.amber,letterSpacing:"0.18em"}}>WEEKLY INTELLIGENCE BRIEF · {weekLabel.toUpperCase()}</span>
        <h1 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:22,color:"#fff",lineHeight:1.2,margin:"8px 0 0"}}>{headline}</h1>
      </div>
      <div style={{maxWidth:800,margin:"0 auto"}}>
        {sections.map(sec=>(
          <div key={sec.id} style={{padding:`18px ${INSET}px`,borderBottom:T.border}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:10,height:10,borderRadius:2,background:sec.color}}/>
              <span style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:15,color:T.ink}}>{sec.label}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {sec.items.map((item,i)=>
                typeof item==="string"
                  ?<div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:5,height:5,borderRadius:"50%",background:sec.color,flexShrink:0,marginTop:7}}/><p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:"#2A2620",lineHeight:1.6,margin:0}}>{item}</p></div>
                  :<div key={i} style={{background:"#F8F8F6",borderRadius:10,padding:"12px 14px",border:T.border}}><p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontWeight:600,fontSize:13,color:T.ink,margin:"0 0 3px"}}>{item.h}</p><p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:T.mid,margin:0,lineHeight:1.5}}>{item.s}</p></div>
              )}
            </div>
          </div>
        ))}
      </div>
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
        {[{n:"10K+",l:"Subscribers"},{n:"Daily",l:"Issues"},{n:"6 AM",l:"Delivery"},{n:"Free",l:"Forever"}].map(s=>(
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
function BottomNav({ view, setView }) {
  return (
    <nav className="bottom-nav" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:200,background:"#0F0F0F",borderTop:"1px solid #1A1A1A",display:"flex",paddingBottom:"env(safe-area-inset-bottom)"}}>
      {[{id:"home",l:"Home"},{id:"brief",l:"Brief"},{id:"subscribe",l:"Subscribe"}].map(it=>(
        <button key={it.id} onClick={()=>setView(it.id)} style={{flex:1,background:"none",border:"none",padding:"12px 0 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:view===it.id?"#FFFFFF":"rgba(255,255,255,0.4)",fontWeight:view===it.id?600:400}}>{it.l}</span>
          {view===it.id&&<div style={{width:20,height:2,borderRadius:1,background:T.amber}}/>}
        </button>
      ))}
    </nav>
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
  },[]);

  const onSelect=a=>{setArt(a);setView("article");};
  const onBack=()=>{setArt(null);setView("home");};
  const onNav=v=>setView(v);

  return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,600;0,700;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        img{display:block;} button{-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{display:none;}

        /* Desktop: 2-column story grid */
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
        }

        /* Desktop nav in header */
        @media(min-width:768px){
          .desktop-nav{display:flex !important;}
        }
      `}</style>

      {view!=="article"&&<Header onSubscribe={()=>setView("subscribe")}/>}

      <main style={{flex:1,paddingBottom:view!=="article"?64:0}}>
        {view==="home"      &&<HomeView articles={newsData.articles} date={newsData.date} cat={cat} setCat={c=>{setCat(c);setPage(0);}} page={page} setPage={setPage} onSelect={onSelect} onNav={onNav}/>}
        {view==="article"   &&art&&<ArticleDetail story={art} onBack={onBack}/>}
        {view==="brief"     &&<BriefPage briefData={briefData}/>}
        {view==="subscribe" &&<SubPage/>}
      </main>

      {view!=="article"&&<BottomNav view={view} setView={setView}/>}
    </div>
  );
}
