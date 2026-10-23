/* ============================================================
   INFUCOCO 療癒宇宙 — service 層（收藏/統計/最佳/每日/CSV）
   ============================================================ */
window.Svc = (function(){
  const P=CFG.storagePrefix;
  function read(k,d){try{return JSON.parse(localStorage.getItem(P+k))??d}catch(e){return d}}
  function write(k,v){localStorage.setItem(P+k,JSON.stringify(v))}

  const Theme={
    init(){
      const saved=localStorage.getItem(P+"theme"); let palette="starlight",mode="day";
      if(saved){try{const s=JSON.parse(saved);palette=s.p||"starlight";mode=s.m||"day"}catch(e){}}
      // 預設固定白天模式（除非用戶已明確儲存選擇）
      apply(palette,mode);
    },
    apply(p){const m=document.documentElement.dataset.mode||"day";apply(p,m)},
    toggleMode(){const el=document.documentElement;const m=el.dataset.mode==="night"?"day":"night";apply(el.dataset.palette,m)},
    cyclePalette(){const el=document.documentElement;const cur=CFG.palettes.indexOf(el.dataset.palette);const next=CFG.palettes[(cur+1)%CFG.palettes.length];apply(next,el.dataset.mode)},
    save(p,m){localStorage.setItem(P+"theme",JSON.stringify({p,m}))}
  };
  function apply(palette,mode){
    const el=document.documentElement;
    el.dataset.palette=palette; el.dataset.mode=mode;
    const btn=document.querySelector("[data-mode-btn]");
    if(btn) btn.textContent = mode==="night" ? "☀️":"🌙";
    Theme.save(palette,mode);
    document.querySelectorAll("[data-theme]").forEach(b=>{
      b.classList.toggle("active",b.dataset.theme===palette);
    });
  }
  window.__applyTheme=apply; // for inline handlers

  const FavSvc={ has(id){return read(P+"favs",[]).includes(id)}, toggle(id){let a=read(P+"favs",[]);if(a.includes(id))a=a.filter(x=>x!==id);else a.push(id);write(P+"favs",a);return a.includes(id)} };
  const RecentSvc={ push(id){let a=read(P+"recent",[]);a=a.filter(x=>x!==id);a.unshift(id);a=a.slice(0,12);write(P+"recent",a)}, list(){return read(P+"recent",[])} };
  const StatSvc={ inc(k){let s=read(P+"stat",{});s[k]=(s[k]||0)+1;write(P+"stat",s)}, get(k){return read(P+"stat",{})[k]||0} };
  const BestSvc={ get(id){return read(P+"best",{})[id]||0}, set(id,s){let b=read(P+"best",{});const cur=b[id]||0;if(s>cur){b[id]=s;write(P+"best",b);return true}return false} };
  const DailySvc={
    today(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")},
    isToday(id){return read(P+"daily",{}).id===id&&read(P+"daily",{}).day===DailySvc.today()},
    set(id){write(P+"daily",{id,day:DailySvc.today()})}
  };
  const CsvSvc={ export(){
    const rows=GAMES.map(g=>[g.id,g.t,g.c,CFG.categories[g.c],CFG.difficulty[g.lv||1],g.d]);
    rows.unshift(["ID","標題","分類","分類名","難度","描述"]);
    const csv="\uFEFF"+rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\r\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download="infucoco_100games.csv";a.click();
  }};

  return { Theme, FavSvc, RecentSvc, StatSvc, BestSvc, DailySvc, CsvSvc };
})();
