/* ============================================================
   INFUCOCO 療癒宇宙 — utils（粒子/流星/彩帶/揭示/麵包屑/工具/快捷鍵）
   ============================================================ */
window.onload=function(){
  try{ Svc.Theme.init(); }catch(e){}
  initParticles();
  initBreadcrumb();
  initToolbar();
  initQuickSearch();
  initShortcuts();
  initReveal();
  initScrollTop();
};

/* 粒子背景 */
function initParticles(){
  const c=document.getElementById("particles"); if(!c) return;
  const ctx=c.getContext("2d"); let W,H,pts=[];
  function resize(){W=c.width=c.offsetWidth||window.innerWidth;H=c.height=c.offsetHeight||window.innerHeight;c.style.width="100%";c.style.height="100%"}
  resize(); window.addEventListener("resize",resize);
  const N=Math.min(70,Math.floor(W/16));
  for(let i=0;i<N;i++)pts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2.4+0.6,sx:(Math.random()-0.5)*0.4,sy:(Math.random()-0.5)*0.4,a:Math.random()*Math.PI*2,v:Math.random()*0.004+0.002});
  (function tick(){
    ctx.clearRect(0,0,W,H);
    for(const p of pts){
      p.x+=p.sx;p.y+=p.sy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      const tw=0.5+0.5*Math.sin(Date.now()*p.v*10+p.a);
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fillStyle=`rgba(255,255,255,${0.28*tw})`;ctx.fill();
    }
    requestAnimationFrame(tick);
  })();
}

/* 麵包屑 */
function initBreadcrumb(){
  const el=document.getElementById("breadcrumb"); if(!el) return;
  const path=location.pathname.split("/").pop()||"index.html";
  const names={index:"首頁",quotes:"心靈金句",stories:"療癒寓言",games:"互動遊戲",play:"開玩",quiz:"心理測驗",gallery:"四季畫廊",stickers:"貼圖下載",shop:"周邊商店",member:"會員",about:"關於",sitemap:"網站地圖"};
  let key=path.replace(".html","");
  if(key.startsWith("fable-")){key="stories";}
  el.innerHTML=`<a href="index.html">首頁</a><span class="sep">›</span><span>${names[key]||"探索"}</span>`;
}

/* 工具列（隨機/統計/CSV/主題/語言） */
function initToolbar(){
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-random]"); if(b){ const g=GAMES?GAMES[Math.floor(Math.random()*GAMES.length)]:null; if(g)location.href="play.html?g="+g.id; return}
    const st=e.target.closest("[data-stats]"); if(st){ toast("🎯 你已玩 "+Svc.StatSvc.get("visit_play")+" 場遊戲"); return}
    const c=e.target.closest("[data-csv]"); if(c){ Svc.CsvSvc.export(); toast("⬇️ 已匯出 100 遊戲 CSV"); return}
    const th=e.target.closest("[data-theme]"); if(th){ Svc.Theme.apply(th.dataset.theme); return}
    const lg=e.target.closest("[data-lang]"); if(lg){ toggleLang(); return}
    const md=e.target.closest("[data-mode-btn]"); if(md){ Svc.Theme.toggleMode(); return}
  });
  // dropdown 開合
  document.querySelectorAll(".dropdown").forEach(dd=>{
    const btn=dd.querySelector(".dropdown-btn");
    if(!btn)return;
    btn.addEventListener("click",ev=>{ev.stopPropagation();dd.classList.toggle("open")});
  });
  document.addEventListener("click",()=>{document.querySelectorAll(".dropdown").forEach(d=>d.classList.remove("open"))});
}

/* 快速搜尋 */
function initQuickSearch(){
  const inp=document.getElementById("quick-search-input"); if(!inp) return;
  inp.addEventListener("keydown",e=>{
    if(e.key==="Enter"){
      const v=inp.value.trim(); if(!v) return;
      if(location.pathname.includes("games")){
        location.href="games.html?q="+encodeURIComponent(v);
      } else location.href="games.html?q="+encodeURIComponent(v);
    }
  });
}

/* 快捷鍵 / 搜尋 R Esc */
function initShortcuts(){
  document.addEventListener("keydown",e=>{
    if(e.key==="/"){e.preventDefault();const i=document.getElementById("quick-search-input");if(i){i.focus()}}
    else if(e.key.toLowerCase()==="r"&&!e.ctrlKey){const g=GAMES?GAMES[Math.floor(Math.random()*GAMES.length)]:null;if(g)location.href="play.html?g="+g.id}
    else if(e.key==="Escape"){const i=document.getElementById("quick-search-input");if(i)i.blur();document.querySelectorAll(".dropdown").forEach(d=>d.classList.remove("open"))}
  });
}

/* reveal on scroll */
function initReveal(){
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}

/* 回到頂部 */
function initScrollTop(){
  const b=document.getElementById("scroll-top"); if(!b)return;
  window.addEventListener("scroll",()=>{b.classList.toggle("show",window.scrollY>600)});
  b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

/* 語言切換（簡易） */
function toggleLang(){
  const cur=document.documentElement.lang;
  document.documentElement.lang=cur==="zh-Hant"?"en":"zh-Hant";
  toast(document.documentElement.lang==="en"?"🌐 English / 繁中 切換":"🌐 已切換語言");
}

/* Toast */
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),2400)}

/* 每日挑戰 */
function dailyChallenge(){
  const d=new Date(); const seed=d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
  return GAMES[seed%GAMES.length];
}

/* 彩帶 */
window.confetti=function(o){
  o=o||{}; const n=o.count||80; const c=document.createElement("canvas");
  c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:9999";
  document.body.appendChild(c); const ctx=c.getContext("2d");
  c.width=innerWidth;c.height=innerHeight;
  const cols=["#ff8fb1","#ffd23f","#7ad7ff","#b3f7b0","#c8b6ff","#ff9a8b"];
  const parts=[]; for(let i=0;i<n;i++)parts.push({x:Math.random()*c.width,y:-20-Math.random()*c.height*0.4,w:8+Math.random()*7,h:6+Math.random()*6,c:cols[Math.floor(Math.random()*cols.length)],vy:3+Math.random()*4,vx:(Math.random()-0.5)*2,r:Math.random()*Math.PI,rv:(Math.random()-0.5)*0.2});
  let f=0;
  (function loop(){
    ctx.clearRect(0,0,c.width,c.height);f++;
    for(const p of parts){p.y+=p.vy;p.x+=p.vx;p.r+=p.rv;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
      if(p.y>c.height+20){p.y=-10;p.x=Math.random()*c.width}}
    if(f<160)requestAnimationFrame(loop);else{ctx.clearRect(0,0,c.width,c.height);document.body.removeChild(c)}
  })();
};

/* 打字機 */
window.typewriter=function(el,text,speed){let i=0;el.textContent="";const t=setInterval(()=>{el.textContent+=text[i];i++;if(i>=text.length)clearInterval(t)},speed||28)};
