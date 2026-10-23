/* infucoco 7 款療癒小遊戲：純前端互動引擎 */
(function(){
  "use strict";

  window.INFU_GAMES = [
    {id:"g01", title:"接住彩虹氣球", cat:"react", catLabel:"反應", level:"中等", engine:"fx_g01", img:"assets/webp/game_g01.webp", poem:["彩虹慢慢升起","伸手，接住一整團春天。"], desc:"氣球從下方升空，快點抓住！彩虹氣球高分、炸彈會扣分。"},
    {id:"g04", title:"捕捉發光的螢火蟲", cat:"react", catLabel:"反應", level:"中等", engine:"fx_g04", img:"assets/webp/game_g04.webp", poem:["夜色輕輕關燈","我把螢火蟲，捧在手心。"], desc:"夜色中螢火蟲一閃就消失，在牠熄滅前點到牠！"},
    {id:"g07", title:"點泡泡大賽", cat:"react", catLabel:"反應", level:"中等", engine:"reaction", img:"assets/webp/game_g07.webp", poem:["泡泡一顆一顆","碰一下，就笑出聲音。"], desc:"快速反應，抓到泡泡就得分！"},
    {id:"g13", title:"月亮鞦韆抓星", cat:"react", catLabel:"反應", level:"中等", engine:"fx_g13", img:"assets/webp/game_g13.webp", poem:["鞦韆蕩向月光","在星子經過的時候，伸手。"], desc:"游標掃過白色中央線時按下，正中星星得分。"},
    {id:"g42", title:"故事問答", cat:"fable", catLabel:"故事", level:"挑戰", engine:"quiz", img:"assets/webp/game_g42.webp", poem:["翻開一頁故事","答案，就從星光裡露出來。"], desc:"回答療癒小問題，看看你多了解 infucoco 的故事。"},
    {id:"g53", title:"幫小狗洗澡", cat:"pet", catLabel:"療癒", level:"簡單", engine:"fx_g53", img:"assets/webp/game_g53.webp", poem:["泡泡蓋住小狗","洗完牠，就香香地窩進懷裡。"], desc:"滿天泡泡快狂戳，把小狗洗得香香的。"},
    {id:"g69", title:"打地鼠·小怪獸", cat:"arcade", catLabel:"玩樂", level:"挑戰", engine:"fx_g69", img:"assets/webp/game_g69.webp", poem:["小怪物探出頭","嘿，先打聲招呼再玩。"], desc:"小怪獸從洞裡冒出來，快快用軟墊小槌招呼牠！"}
  ];

  function makeTimer(){
    const ids = new Set();
    return {
      loop(fn, ms){ const id = setInterval(fn, ms); ids.add(id); return id; },
      later(fn, ms){ const id = setTimeout(fn, ms); ids.add(id); return id; },
      stop(id){ clearInterval(id); clearTimeout(id); ids.delete(id); },
      clear(){ ids.forEach(id => { clearInterval(id); clearTimeout(id); }); ids.clear(); }
    };
  }
  function hostOf(stage){ return stage.closest(".game-stage") || stage; }
  function endHTML(score, g, msg){
    return `<div class="game-start"><h3>${msg}</h3>
      <p>你得了 <b style="color:var(--accent)">${score}</b> 分<br>休息一下，再挑戰一次吧！</p>
      <button class="btn o" data-replay>再玩一次</button></div>`;
  }
  function bindReplay(stage, run){
    hostOf(stage).__replay = run;
    const btn = stage.querySelector("[data-replay]");
    if(btn) btn.addEventListener("click", run);
  }
  function themeSet(g){
    return ["🌙", "🌸", "✨", "🌈", "🍬", "⭐", "☁️", "🦋", "🎈"]
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  const Engines = {};

  Engines.reaction = function(g){
    const t = makeTimer();
    return {
      stop(){ t.clear(); },
      start(stage, onScore, onEnd){
      onScore = onScore || function(){}; onEnd = onEnd || function(){};
      const set = themeSet(g);
      let score = 0, ticks = 0;
      function run(){
        t.clear(); score = 0; ticks = 0;
        stage.innerHTML = `<div class="g-toolbar"><span class="g-info">${g.title}</span>
          <span class="score">得分 <span class="sc">0</span>　時間 <span class="tl">20</span></span></div>
          <div class="g-arena"></div>`;
        const box = stage.querySelector(".g-arena");
        t.loop(() => {
          ticks++; box.innerHTML = "";
          if(ticks > 33){ t.clear(); onEnd(score); stage.innerHTML = endHTML(score, g, "反應超快！"); bindReplay(stage, run); return; }
          const el = document.createElement("div");
          el.style.cssText = "position:absolute;font-size:2rem;cursor:pointer;user-select:none";
          el.textContent = set[Math.floor(Math.random() * set.length)];
          el.style.left = (4 + Math.random() * 86) + "%"; el.style.top = (4 + Math.random() * 84) + "%";
          el.onclick = () => { score++; onScore(score); const sc = stage.querySelector(".sc"); if(sc) sc.textContent = score; el.remove(); };
          box.appendChild(el);
          const tl = stage.querySelector(".tl"); if(tl) tl.textContent = Math.max(0, 20 - Math.floor(ticks / 2));
        }, 600);
        bindReplay(stage, run);
      }
      run();
    }};
  };

  Engines.quiz = function(g){
    const BANK = [
      {q:"累了的時候，最該做什麼？", a:["好好休息","繼續硬撐","熬夜趕工"], r:0},
      {q:"infucoco 的招牌髮型是？", a:["雙丸子頭","大旁分光頭","爆炸頭"], r:0},
      {q:"下面哪個最療癒？", a:["泡一杯熱茶","盯著主管","開三小時會"], r:0},
      {q:"看到星星應該？", a:["許個願","踩扁它","裝沒看到"], r:0},
      {q:"心情不好時最適合？", a:["抱抱自己","罵路人","不講話冷戰"], r:0},
      {q:"infucoco 喜歡的天氣？", a:["星空夜","大豔陽","暴風雨"], r:0},
      {q:"週末最佳行程？", a:["耍廢放空","補交報告","加班兼差"], r:0},
      {q:"下列哪個是充電？", a:["睡飽飽","滑手機到三點","喝四杯美式"], r:0},
      {q:"療癒的顏色是？", a:["暖橘夕陽","死灰","螢光綠"], r:0},
      {q:"遇到挫折先？", a:["深呼吸三次","放棄","哭完再自責"], r:0}
    ];
    const t = makeTimer();
    return {
      stop(){ t.clear(); },
      start(stage, onScore, onEnd){
      onScore = onScore || function(){}; onEnd = onEnd || function(){};
      const Q = [...BANK].sort(() => Math.random() - .5).slice(0, 6);
      let qn = 0, score = 0;
      function run(){
        t.clear();
        if(qn >= Q.length){ onEnd(score); stage.innerHTML = endHTML(score, g, "療癒達人！"); bindReplay(stage, run); return; }
        const q = Q[qn];
        stage.innerHTML = `<div class="g-toolbar"><span class="g-info">${g.title}（${qn + 1}/${Q.length}）</span>
          <span class="score">得分 <span class="sc">${score}</span></span></div>
          <div style="text-align:center;max-width:500px;margin:0 auto">
          <div style="font-size:1.25rem;font-weight:800;margin-bottom:16px;line-height:1.5">${q.q}</div>
          <div class="g-opt">${q.a.map((x, i) => `<button ${i === q.r ? "data-r" : ""}>${x}</button>`).join("")}</div></div>`;
        stage.querySelector(".g-opt").onclick = e => {
          const b = e.target.closest("button"); if(!b || b.disabled) return;
          [...stage.querySelectorAll(".g-opt button")].forEach(x => x.disabled = true);
          const correct = b.hasAttribute("data-r");
          if(correct){ score++; onScore(score); b.classList.add("correct"); const sc = stage.querySelector(".sc"); if(sc) sc.textContent = score; }
          else { b.classList.add("wrong"); const cr = stage.querySelector("[data-r]"); if(cr) cr.classList.add("correct"); }
          t.later(() => { qn++; run(); }, 900);
        };
        bindReplay(stage, () => { qn = 0; score = 0; run(); });
      }
      run();
    }};
  };

  function burst(arena, x, y, color, n){
    n = n || 12;
    const glyphs = ["✨", "⭐", "💥", "●", "✦", "•"];
    for(let i = 0; i < n; i++){
      const p = document.createElement("div");
      p.textContent = glyphs[i % glyphs.length];
      p.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${10 + Math.random() * 12}px;pointer-events:none;z-index:6;color:${color || "#ffd34d"}`;
      arena.appendChild(p);
      const ang = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 70;
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
      const an = p.animate([{transform:"translate(0,0) scale(1)", opacity:1}, {transform:`translate(${dx}px,${dy}px) scale(.2)`, opacity:0}], {duration:650, easing:"cubic-bezier(.2,.8,.2,1)"});
      an.onfinish = () => p.remove();
    }
  }
  function floatText(arena, x, y, txt, color){
    const f = document.createElement("div");
    f.textContent = txt;
    f.style.cssText = `position:absolute;left:${x}px;top:${y}px;color:${color || "#E36B00"};font-weight:900;font-size:19px;pointer-events:none;z-index:7;text-shadow:0 1px 0 #fff,0 2px 6px rgba(0,0,0,.15)`;
    arena.appendChild(f);
    const an = f.animate([{transform:"translate(-50%,0)", opacity:1}, {transform:"translate(-50%,-46px)", opacity:0}], {duration:750, easing:"ease-out"});
    an.onfinish = () => f.remove();
  }
  function shake(arena){ arena.animate([{transform:"translate(0,0)"}, {transform:"translate(-7px,3px)"}, {transform:"translate(6px,-4px)"}, {transform:"translate(-4px,2px)"}, {transform:"translate(0,0)"}], {duration:260}); }
  function hud(stage, bg){
    stage.innerHTML = `<div style="text-align:center;font-size:.85rem;color:var(--soft);margin-bottom:6px">生命 <span class="hp">3</span>　得分 <span class="sc">0</span>　連擊 <span class="cb">x1</span></div>
      <div class="arena" style="background:${bg || "var(--paper2)"}"></div>`;
    return { arena: stage.querySelector(".arena"), hp: () => stage.querySelector(".hp"), sc: () => stage.querySelector(".sc"), cb: () => stage.querySelector(".cb") };
  }
  function gameOver(stage, score, msg){
    stage.insertAdjacentHTML("beforeend", `<div style="position:absolute;inset:0;background:rgba(255,255,255,.93);display:grid;place-items:center;z-index:20;border-radius:20px;text-align:center">
      <div><h3 style="margin:6px 0">${msg || "本局結束"}</h3>
      <p style="font-size:1.1rem">得分 <b style="color:var(--accent);font-size:1.6rem">${score}</b></p>
      <button class="btn o" data-replay>再玩一次</button></div></div>`);
    bindReplay(stage, () => hostOf(stage).__restart && hostOf(stage).__restart());
  }

  Engines.fx_g01 = function(){
    let raf = null, pending = [];
    return {
      stop(){ cancelAnimationFrame(raf); pending.forEach(clearTimeout); pending = []; },
      start(stage, onScore, onEnd){
    onScore = onScore || function(){}; onEnd = onEnd || function(){};
    const {arena, hp, sc} = hud(stage, "linear-gradient(#bfe0ff,#ffe9b8)");
    arena.innerHTML = `<div class="basket" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-size:2.6rem;z-index:4">🧺</div>`;
    const basket = arena.querySelector(".basket");
    let hearts = 3, score = 0, bx = 270, mx = 270, items = [], last = 0, elapsed = 0, spawnT = 0;
    function die(){ cancelAnimationFrame(raf); onEnd(score); gameOver(stage, score, "本局結束"); }
    arena.addEventListener("mousemove", e => { const r = arena.getBoundingClientRect(); mx = e.clientX - r.left; });
    arena.addEventListener("touchmove", e => { const r = arena.getBoundingClientRect(); mx = e.touches[0].clientX - r.left; e.preventDefault(); }, {passive:false});
    function spawn(){
      const r = Math.random(); let emo, val;
      if(r < .09){ emo = "🌈"; val = 4; } else if(r < .24){ emo = "⭐"; val = 2; } else if(r < .36){ emo = "💣"; val = -1; } else { emo = "🎈"; val = 1; }
      const x = 14 + Math.random() * (arena.clientWidth - 50);
      const el = document.createElement("div"); el.textContent = emo;
      el.style.cssText = `position:absolute;left:${x}px;top:-32px;font-size:1.9rem;will-change:transform`;
      arena.appendChild(el); items.push({el, x, sp:1.1 + Math.random() * 1.3 + elapsed * .002, val, emo});
    }
    function loop(t){
      if(!last) last = t; const dt = Math.min(3, (t - last) / 16); last = t; elapsed += dt;
      bx += (mx - bx) * .18 * dt; basket.style.left = bx + "px";
      spawnT += dt; if(spawnT > Math.max(16, 48 - elapsed * .02)){ spawnT = 0; spawn(); }
      const by = arena.clientHeight - 26;
      for(let i = items.length - 1; i >= 0; i--){
        const it = items[i]; it.y = (it.y || -30) + it.sp * dt;
        it.el.style.top = it.y + "px"; it.el.style.transform = `rotate(${Math.sin(it.y * .05) * 22}deg)`;
        if(it.y > by - 18 && it.y < by + 12 && Math.abs(it.x - bx) < 46){
          if(it.emo === "💣"){ hearts--; hp().textContent = hearts; shake(arena); burst(arena, it.x, by, "#ff5a5a"); floatText(arena, it.x, by, "爆炸!", "#c0392b"); }
          else { score += it.val; sc().textContent = score; onScore(score); burst(arena, it.x, by); floatText(arena, it.x, by, "+" + it.val, "#E36B00"); }
          it.el.remove(); items.splice(i, 1); if(hearts <= 0) return die(); continue;
        }
        if(it.y > arena.clientHeight){
          if(it.emo !== "💣"){ hearts--; hp().textContent = hearts; shake(arena); floatText(arena, it.x, arena.clientHeight - 40, "漏接!", "#c0392b"); if(hearts <= 0){ it.el.remove(); items.splice(i, 1); return die(); } }
          it.el.remove(); items.splice(i, 1);
        }
      }
      raf = requestAnimationFrame(loop);
    }
    hostOf(stage).__restart = () => Engines.fx_g01().start(stage, onScore, onEnd);
    raf = requestAnimationFrame(loop);
  }};
};

  Engines.fx_g04 = function(){
    let iv = null, endT = null, pending = [];
    return {
      stop(){ clearInterval(iv); clearTimeout(endT); pending.forEach(clearTimeout); pending = []; },
      start(stage, onScore, onEnd){
    onScore = onScore || function(){}; onEnd = onEnd || function(){};
    const {arena, sc} = hud(stage, "radial-gradient(circle at 50% 40%,#2a3a6b,#0d1330)");
    let score = 0, tries = 0;
    const t = setInterval(() => {
      const el = document.createElement("div"); el.textContent = "✨";
      const x = 10 + Math.random() * (arena.clientWidth - 50), y = 15 + Math.random() * (arena.clientHeight - 90);
      el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:1.8rem;cursor:pointer;transition:transform .1s`;
      arena.appendChild(el);
      requestAnimationFrame(() => el.style.textShadow = "0 0 24px #fff2a8,0 0 40px #ffd34d");
      el.onclick = () => { tries++; score += 2; sc().textContent = score; burst(arena, x, y, "#fff2a8"); floatText(arena, x, y, "+2", "#ffd34d"); onScore(score); el.remove(); };
      pending.push(setTimeout(() => el.remove(), 900));
    }, 420);
    iv = t;
    endT = setTimeout(() => { clearInterval(t); onEnd(score); gameOver(stage, score, "本局結束"); }, 18000);
    hostOf(stage).__restart = () => Engines.fx_g04().start(stage, onScore, onEnd);
    }
  };
};

  Engines.fx_g13 = function(){
    let rafId = null;
    return {
      stop(){ cancelAnimationFrame(rafId); },
      start(stage, onScore, onEnd){
    onScore = onScore || function(){}; onEnd = onEnd || function(){};
    const {arena, sc} = hud(stage, "linear-gradient(#1c2a5e,#3a2f66)");
    arena.innerHTML = `<div style="position:absolute;top:40px;left:10%;right:10%;height:44px;border-radius:22px;background:rgba(255,255,255,.12)">
      <div style="position:absolute;left:50%;width:4px;height:44px;background:#fff"></div>
      <div class="dot" style="position:absolute;top:0;left:0;width:32px;height:44px;border-radius:16px;background:#ffd34d"></div></div>
      <button class="btn o" style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%)">抓！</button>`;
    const dot = arena.querySelector(".dot"), btn = arena.querySelector(".btn"); let pos = 0, dir = 1, score = 0, tries = 0;
    const raf = () => { pos += dir * 2.0; if(pos > 88 || pos < 0) dir *= -1; dot.style.left = pos + "%"; rafId = requestAnimationFrame(raf); }; rafId = requestAnimationFrame(raf);
    btn.onclick = () => { tries++; const c = Math.abs(pos - 50);
      if(c < 10){ score++; sc().textContent = score; burst(arena, arena.clientWidth / 2, 60, "#fff2a8"); floatText(arena, arena.clientWidth / 2, 50, "命中!", "#ffd34d"); }
      onScore(score); if(tries >= 15){ cancelAnimationFrame(rafId); onEnd(score); gameOver(stage, score, "本局結束"); } };
    hostOf(stage).__restart = () => Engines.fx_g13().start(stage, onScore, onEnd);
    }
  };
};

  Engines.fx_g53 = function(){
    let iv = null, endT = null, pending = [];
    return {
      stop(){ clearInterval(iv); clearTimeout(endT); pending.forEach(clearTimeout); pending = []; },
      start(stage, onScore, onEnd){
    onScore = onScore || function(){}; onEnd = onEnd || function(){};
    const {arena, sc, cb} = hud(stage, "linear-gradient(#d8f0ff,#e9fbff)");
    arena.innerHTML = '<div style="position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:190px;height:86px;border-radius:46px;background:rgba(255,255,255,.35);border:2px solid rgba(255,255,255,.55)"></div>';
    let score = 0, combo = 0, elapsed = 0;
    const t = setInterval(() => {
      const el = document.createElement("div"); el.textContent = "🫧";
      const x = 10 + Math.random() * (arena.clientWidth - 40), y = 10 + Math.random() * (arena.clientHeight - 120);
      el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${1.3 + Math.random() * 1.2}rem;cursor:pointer;z-index:3`;
      arena.appendChild(el);
      el.onclick = () => { combo++; score += 1 + Math.floor(combo / 5); sc().textContent = score; cb().textContent = "x" + combo;
        burst(arena, x, y, "#7ec8ff"); floatText(arena, x, y, "+" + (1 + Math.floor(combo / 5)), "#2a7ab8"); onScore(score);
        el.textContent = "💦"; pending.push(setTimeout(() => el.remove(), 120)); };
      pending.push(setTimeout(() => el.remove(), 1600));
    }, Math.max(120, 300 - elapsed * .1));
    iv = t;
    endT = setTimeout(() => { clearInterval(t); onEnd(score); gameOver(stage, score, "本局結束"); }, 20000);
    hostOf(stage).__restart = () => Engines.fx_g53().start(stage, onScore, onEnd);
    }
  };
};

  Engines.fx_g69 = function(){
    let t = null;
    return {
      stop(){ clearTimeout(t); },
      start(stage, onScore, onEnd){
    onScore = onScore || function(){}; onEnd = onEnd || function(){};
    const {arena, sc, cb} = hud(stage, "radial-gradient(circle at 50% 30%,#7a5cc8,#3a2f66)");
    arena.innerHTML = '<div class="holes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:20px;height:100%;align-content:center"></div>';
    const holes = arena.querySelector(".holes"), cells = [];
    for(let i = 0; i < 9; i++){ const c = document.createElement("div");
      c.style.cssText = "border-radius:16px;background:rgba(0,0,0,.28);display:grid;place-items:center;font-size:1.9rem;cursor:pointer;transition:background .15s";
      holes.appendChild(c); cells.push(c); }
    let score = 0, combo = 0, cur = -1, tries = 0;
    function popMole(){ if(cur >= 0 && cells[cur]){ cells[cur].textContent = ""; cells[cur].style.background = "rgba(0,0,0,.28)"; }
      cur = Math.floor(Math.random() * 9); cells[cur].textContent = "👾"; cells[cur].style.background = "rgba(227,107,0,.5)";
      t = setTimeout(() => { if(cur >= 0){ cells[cur].textContent = ""; cells[cur].style.background = "rgba(0,0,0,.28)"; cur = -1; popMole(); } }, Math.max(450, 1100 - tries * 8));
    }
    cells.forEach((c, i) => c.onclick = () => {
      if(i !== cur || c.textContent !== "👾"){ combo = 0; cb().textContent = "x1"; return; }
      tries++; combo++; const gain = 1 + Math.floor(combo / 3); score += gain; sc().textContent = score; cb().textContent = "x" + combo;
      const r = c.getBoundingClientRect(), ar = arena.getBoundingClientRect();
      burst(arena, r.left - ar.left + 40, r.top - ar.top + 30); floatText(arena, r.left - ar.left + 30, r.top - ar.top + 20, "+" + gain, "#ffd34d");
      c.textContent = "💫"; c.style.background = "#3E9B6F";
      onScore(score); cur = -1; clearTimeout(t);
      if(tries >= 25){ clearTimeout(t); t = setTimeout(() => { onEnd(score); gameOver(stage, score, "本局結束"); }, 300); } else popMole();
    });
    popMole();
    hostOf(stage).__restart = () => Engines.fx_g69().start(stage, onScore, onEnd);
    }
  };
};

  window.INFU_ENGINES = Engines;
})();
