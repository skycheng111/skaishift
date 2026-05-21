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
function Header({ onSubscribe, onNav }) {
  return (
    <header style={{
      background:"#0F0F0F",
      position:"sticky",top:0,zIndex:100,
      borderBottom:"1px solid #1A1A1A",
    }}>
      <div style={{
        maxWidth:1200,margin:"0 auto",
        padding:"10px 20px",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        gap:12,
      }}>
        {/* Left: logo + wordmark — always visible */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <img src={LOGO_SRC} alt="skAIshift" style={{height:44,width:"auto",display:"block"}}/>
          <span style={{fontFamily:"'Barlow Semi Condensed',sans-serif",fontSize:22,letterSpacing:"0.15em",fontWeight:500,lineHeight:1,whiteSpace:"nowrap"}}>
            <span style={{color:"#FFFFFF"}}>SK</span>
            <span style={{color:T.amber}}>AI</span>
            <span style={{color:"#FFFFFF"}}>SHIFT</span>
          </span>
        </div>

        {/* Center: desktop nav only */}
        <nav className="desktop-nav" style={{display:"none",alignItems:"center",gap:4}}>
          {[{l:"Home",v:"home"},{l:"Brief",v:"brief"},{l:"Subscribe",v:"subscribe"}].map(it=>(
            <button key={it.v} onClick={()=>onNav(it.v)}
              style={{background:"transparent",color:"rgba(255,255,255,0.7)",border:"none",padding:"8px 18px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,cursor:"pointer",fontWeight:500,borderRadius:20,transition:"all 0.15s"}}
              onMouseEnter={e=>{e.currentTarget.style.color="#fff";e.currentTarget.style.background="rgba(255,255,255,0.08)";}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.7)";e.currentTarget.style.background="transparent";}}>
              {it.l}
            </button>
          ))}
        </nav>

        {/* Right: subscribe — always visible */}
        <button onClick={onSubscribe}
          style={{background:"transparent",color:"#FFFFFF",border:"1px solid rgba(255,255,255,0.4)",borderRadius:20,padding:"8px 16px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",transition:"all 0.15s",flexShrink:0}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.1)";e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor="rgba(255,255,255,0.4)";}}>
          Subscribe
        </button>
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
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,color:"#2A2620",lineHeight:1.85,margin:"0 0 20px"}}>{story.body}</p>

          <div style={{background:"#FFFBF0",borderRadius:12,padding:"16px 18px",marginBottom:24,borderLeft:`3px solid ${T.amber}`}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:T.amber,letterSpacing:"0.14em",margin:"0 0 8px"}}>WHAT PEOPLE ARE BUILDING</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#3A3020",lineHeight:1.75,margin:0}}>{story.build}</p>
          </div>

          <h2 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:18,color:T.ink,margin:"0 0 12px"}}>Why This Matters Now</h2>
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,color:"#2A2620",lineHeight:1.85,margin:"0 0 16px"}}>The pace of AI development means early movers capture disproportionate market share. When a new capability drops — whether it's video generation, voice cloning, or autonomous coding — the first people to package it into a service own that category in their local market and vertical for months before competition catches up.</p>
          <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:15,color:"#2A2620",lineHeight:1.85,margin:"0 0 24px"}}>Specialists consistently outperform generalists in AI services. The operators making the most money have narrowed to one niche, built a repeatable offer around it, and are iterating faster than anyone else in that space.</p>

          <h2 style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:18,color:T.ink,margin:"0 0 12px"}}>How to Act On This</h2>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
            {[
              "Identify which part of this story maps to your existing skills or client base.",
              "Research what others are already charging for this capability — price anchors exist even in new markets.",
              "Build a minimum viable offer this week. One deliverable, one price, one target client type.",
              "Document your process from the first client. That documentation becomes your scalable system."
            ].map((step,i)=>(
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                <div style={{width:26,height:26,borderRadius:"50%",background:T.ink,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:13,flexShrink:0,marginTop:1}}>{i+1}</div>
                <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:14,color:"#2A2620",lineHeight:1.75,margin:0}}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{background:"#F8F8F6",borderRadius:12,padding:"16px 18px",marginBottom:24,border:T.border}}>
            <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:9,color:T.mid,letterSpacing:"0.14em",margin:"0 0 8px"}}>CATEGORY</p>
            <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:13,color:T.ink,lineHeight:1.6,margin:0}}>Filed under <strong>{story.cat}</strong> — one of the fastest-moving income verticals in AI services right now.</p>
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
function BriefPage({ briefData, onBack }) {
  const sections = briefData?.sections || BRIEF_FULL;
  const headline  = briefData?.headline  || "7 Shifts That Will Define the Next 90 Days";
  const weekLabel = briefData?.week      || "May 12–18, 2025";
  return (
    <div style={{background:T.bg,paddingBottom:24}}>
      <div style={{position:"sticky",top:0,zIndex:50,background:"#0F0F0F",borderBottom:"1px solid #1A1A1A",padding:`12px ${INSET}px`}}>
        <button onClick={onBack} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.3)",borderRadius:20,padding:"6px 14px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:12,color:"#fff",cursor:"pointer",fontWeight:500}}>← Back</button>
      </div>
      <div style={{background:T.ink,padding:`28px ${INSET}px 24px`}}>
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@300;400;500;600&family=Lora:ital,wght@0,600;0,700;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        img{display:block;} button{-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{display:none;}

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

        }
      `}</style>

      {view!=="article"&&<Header onSubscribe={()=>setView("subscribe")} onNav={onNav}/>}

      <main style={{flex:1,paddingBottom:view!=="article"?64:0}}>
        {view==="home"      &&<HomeView articles={newsData.articles} date={newsData.date} cat={cat} setCat={c=>{setCat(c);setPage(0);}} page={page} setPage={setPage} onSelect={onSelect} onNav={onNav}/>}
        {view==="article"   &&art&&<ArticleDetail story={art} onBack={onBack}/>}
        {view==="brief"     &&<BriefPage briefData={briefData} onBack={()=>setView('home')}/>}
        {view==="subscribe" &&<SubPage/>}
      </main>

      {view!=="article"&&<BottomNav view={view} setView={setView}/>}
    </div>
  );
}
