# -*- coding: utf-8 -*-
# 生成 INFUCOCO 療癒宇宙 全部 HTML（Windows 本機版，圖片用本機素材）
import io, os
ROOT = r"D:\www\infucoco_healing"

HEAD_OPEN = '''<!DOCTYPE html>
<html lang="zh-Hant" data-palette="starlight" data-mode="day">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{desc}">
<title>{title}</title>
<link rel="stylesheet" href="./css/main.css">
</head>
<body data-page="{page}">
<div class="heal-bg" aria-hidden="true"><div class="heal-blob a"></div><div class="heal-blob b"></div><div class="heal-blob c"></div></div>
<div class="shooting-star" aria-hidden="true"></div>
<canvas id="particles" aria-hidden="true"></canvas>
<header class="site-header"><div class="header-inner">
<div class="logo"><div class="logo-mark"><img src="./assets/webp/infucoco_crescent_bench_stars.webp" alt="INFUCOCO 療癒宇宙吉祥物"></div><div class="logo-txt grad-text">INFUCOCO<small data-i18n="brand">療癒宇宙</small></div></div>
<nav class="nav-links">
<a href="index.html">首頁</a><a href="quotes.html">💬 心靈金句</a><a href="stories.html">📖 療癒寓言</a><a href="games.html">🎮 互動遊戲</a><a href="quiz.html">🔮 心理測驗</a><a href="gallery.html">🌿 四季畫廊</a><a href="stickers.html">🖼️ 貼圖下載</a><a href="shop.html">🛍️ 周邊商店</a><a href="member.html">👑 會員</a>
</nav>
<div class="header-tools">
<div class="quick-search"><span>🔍</span><input id="quick-search-input" type="text" placeholder="搜尋網站內容…"></div>
<div class="dropdown"><button class="icon-btn dropdown-btn" title="進階工具">⚙️</button><div class="popover-dropdown">
<div class="popover-dropdown__header"><h3 class="popover-dropdown__title">✨ 探索療癒宇宙</h3><a class="popover-dropdown__view-all" href="sitemap.html">網站地圖 →</a></div>
<div class="popover-dropdown__grid">
<a class="popover-dropdown__card" href="quotes.html"><span class="popover-dropdown__icon">💬</span><h4 class="popover-dropdown__card-title">心靈金句</h4><p class="popover-dropdown__card-desc">每日一句溫柔</p></a>
<a class="popover-dropdown__card" href="stories.html"><span class="popover-dropdown__icon">📖</span><h4 class="popover-dropdown__card-title">療癒寓言</h4><p class="popover-dropdown__card-desc">睡前小故事</p></a>
<a class="popover-dropdown__card" href="games.html"><span class="popover-dropdown__icon">🎮</span><h4 class="popover-dropdown__card-title">互動遊戲</h4><p class="popover-dropdown__card-desc">100 款療癒小遊戲</p></a>
<a class="popover-dropdown__card" href="quiz.html"><span class="popover-dropdown__icon">🔮</span><h4 class="popover-dropdown__card-title">心理測驗</h4><p class="popover-dropdown__card-desc">今天需要什麼療癒</p></a>
<a class="popover-dropdown__card" href="gallery.html"><span class="popover-dropdown__icon">🌿</span><h4 class="popover-dropdown__card-title">四季畫廊</h4><p class="popover-dropdown__card-desc">桌布下載</p></a>
<a class="popover-dropdown__card" href="stickers.html"><span class="popover-dropdown__icon">🖼️</span><h4 class="popover-dropdown__card-title">貼圖下載</h4><p class="popover-dropdown__card-desc">療癒貼圖</p></a>
<a class="popover-dropdown__card" href="shop.html"><span class="popover-dropdown__icon">🛍️</span><h4 class="popover-dropdown__card-title">周邊商店</h4><p class="popover-dropdown__card-desc">療癒周邊</p></a>
<a class="popover-dropdown__card" href="member.html"><span class="popover-dropdown__icon">👑</span><h4 class="popover-dropdown__card-title">會員方案</h4><p class="popover-dropdown__card-desc">三種訂閱</p></a>
<a class="popover-dropdown__card" href="about.html"><span class="popover-dropdown__icon">⭐</span><h4 class="popover-dropdown__card-title">關於</h4><p class="popover-dropdown__card-desc">療癒宇宙的故事</p></a>
</div>
<div class="popover-dropdown__footer">
<div class="dd-title">🎨 療癒配色</div><div class="dd-row"><button data-theme="starlight">星光紫</button><button data-theme="peach">蜜桃粉</button><button data-theme="mint">薄荷綠</button><button data-theme="lavender">薰衣草</button></div>
<div class="dd-row"><button data-random>🎲 隨機探索</button><button data-csv>⬇️ 匯出100遊戲CSV</button><button data-lang>🌐 繁中/EN</button></div>
</div>
</div></div>
<button class="icon-btn" data-mode-btn title="日夜模式">🌙</button>
</div></div></header>
<nav id="breadcrumb" class="breadcrumb" aria-label="麵包屑"></nav>
'''

FOOT = '''
<footer class="site-footer"><div class="footer-inner">
<div class="footer-col"><h4 class="grad-text">INFUCOCO 療癒宇宙</h4><p style="font-size:.9rem;color:var(--soft-txt)">給疲憊的你，一個小小的療癒宇宙：寓言 × 金句 × 遊戲 × 測驗 × 貼圖 × 周邊。</p><p style="margin-top:10px;color:var(--soft-txt)">✉️ hello@infucoco.studio</p></div>
<div class="footer-col"><h4>療癒</h4><ul><li><a href="quotes.html">💬 心靈金句</a></li><li><a href="stories.html">📖 療癒寓言</a></li><li><a href="quiz.html">🔮 心理測驗</a></li></ul></div>
<div class="footer-col"><h4>玩樂</h4><ul><li><a href="games.html">🎮 互動遊戲</a></li><li><a href="gallery.html">🌿 四季畫廊</a></li><li><a href="stickers.html">🖼️ 貼圖下載</a></li></ul></div>
<div class="footer-col"><h4>網站地圖</h4><ul><li><a href="shop.html">🛍️ 周邊商店</a></li><li><a href="member.html">👑 會員</a></li><li><a href="about.html">關於</a></li><li><a href="sitemap.html">完整地圖</a></li></ul></div>
</div><div class="footer-bottom">© 2026 INFUCOCO 療癒宇宙 版權所有 · v1.0.0</div></footer>
<button id="scroll-top" class="scroll-top" title="回到頂部">↑</button>
<div id="toast"></div>
'''

def page(title,desc,page_id,body,scripts):
    return (HEAD_OPEN.format(title=title,desc=desc,page=page_id)+body+FOOT+
            '<script src="./js/config.js"></script><script src="./js/quotes.js"></script><script src="./js/service.js"></script>'+
            scripts+
            '<script src="./js/utils.js"></script></body></html>')

def nav_active(active):
    # 在 nav 對應項目加 class="active"
    h=HEAD_OPEN
    m={'index':'<a href="index.html">','quotes':'<a href="quotes.html">','stories':'<a href="stories.html">','games':'<a href="games.html">','quiz':'<a href="quiz.html">','gallery':'<a href="gallery.html">','stickers':'<a href="stickers.html">','shop':'<a href="shop.html">','member':'<a href="member.html">'}
    if active in m:
        h=h.replace(m[active],m[active][:-2]+' class="active">',1)
    return h

def make(fn,title,desc,page_id,body,scripts,active=None):
    head = nav_active(active) if active else HEAD_OPEN
    html=(head.format(title=title,desc=desc,page=page_id)+body+FOOT+
          '<script src="./js/config.js"></script><script src="./js/quotes.js"></script><script src="./js/service.js"></script><script src="./js/utils.js"></script>'+
          scripts+'</body></html>')
    with io.open(os.path.join(ROOT,fn),"w",encoding="utf-8") as f:
        f.write(html)

# ---------- index ----------
index_body = '''
<section class="hero">
  <div class="hero-art"><img src="./assets/webp/infucoco_crescent_moon_stars.webp" alt="infucoco 坐在彎月上看星星"></div>
  <div class="hero-center">
    <div class="eyebrow">✨ 療癒小宇宙</div>
    <h1 class="grad-text">INFUCOCO<br>療癒宇宙</h1>
    <p class="sub">給疲憊的你，一個小小的療癒宇宙。跟雙丸子頭、紅白橫紋的 infucoco 一起，數星星、喝熱茶、玩遊戲、讀寓言。</p>
    <div class="hero-ctas">
      <a href="games.html" class="btn">🎮 玩一場療癒遊戲</a>
      <a href="quiz.html" class="btn btn-ghost">🔮 今天需要什麼療癒</a>
      <a href="quotes.html" class="btn btn-ghost">💬 讀一句金句</a>
    </div>
  </div>
  <div class="hero-art flip"><img src="./assets/webp/infucoco_book_flying_sky.webp" alt="infucoco 乘著書本飛向星雲"></div>
</section>

<div class="stat-strip reveal" style="display:none">
  <div class="stat-card"><b>100</b><span>療癒遊戲</span></div>
  <div class="stat-card"><b>35</b><span>心靈金句</span></div>
  <div class="stat-card"><b>6</b><span>睡前寓言</span></div>
  <div class="stat-card"><b>60</b><span>療癒桌布</span></div>
</div>

<section class="container">
  <div class="section-title"><div class="eyebrow">🎮 熱門遊戲</div><h2 class="grad-text">先玩這幾款</h2></div>
  <div class="grid g3">
    <a class="game-card tilt reveal" href="play.html?g=g03"><div class="game-thumb" style="background-image:url('./assets/webp/infucoco_glowing_star_fingertip.webp')"><span class="gcat">🎯 反應</span><span class="gdiff">⭐⭐⭐</span><span class="gnum">G03</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🌱 拯救飄落的種子</h4><p>接住種子，別讓雜草落地</p></div></a>
    <a class="game-card tilt reveal d2" href="play.html?g=g42"><div class="game-thumb" style="background-image:url('./assets/webp/infucoco_glowing_lantern_dark.webp')"><span class="gcat">📖 寓言</span><span class="gdiff">⭐</span><span class="gnum">G42</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🎆 寓言問答</h4><p>關於願望的小測驗</p></div></a>
    <a class="game-card tilt reveal d3" href="play.html?g=g07"><div class="game-thumb" style="background-image:url('./assets/webp/infucoco_firefly_jar_night.webp')"><span class="gcat">🎪 玩樂</span><span class="gdiff">⭐</span><span class="gnum">G07</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🫧 點泡泡大賽</h4><p>反應力大考驗</p></div></a>
  </div>
  <div style="text-align:center;margin:10px 0 30px"><a href="games.html" class="btn btn-ghost">🎮 玩全部 100 款 →</a></div>
</section>

<section class="container">
  <div class="section-title"><div class="eyebrow">📖 療癒寓言</div><h2 class="grad-text">睡前小故事</h2></div>
  <div class="grid g3">
    <a class="card tilt reveal" href="fable-star-seed.html"><img src="./assets/webp/infucoco_glowing_star_fingertip.webp" alt="種下星星的種子"><div class="card-body"><span class="card-tag">🌱 耐心</span><h4>種下星星的種子</h4><p>最珍貴的成長，都發生在耐心的等待裡。</p></div></a>
    <a class="card tilt reveal" href="fable-fireworks.html"><img src="./assets/webp/infucoco_firefly_jar_night.webp" alt="替別人的煙火鼓掌"><div class="card-body"><span class="card-tag">✨ 分享</span><h4>替別人的煙火鼓掌</h4><p>真心為別人喝采，就是為自己點燈。</p></div></a>
    <a class="card tilt reveal" href="fable-cosmic-cafe.html"><img src="./assets/webp/infucoco_afterwork_coffee_sidewalk.webp" alt="星塵咖啡館"><div class="card-body"><span class="card-tag">☕ 放鬆</span><h4>星塵咖啡館</h4><p>允許自己休息，是給未來充電。</p></div></a>
  </div>
  <div style="text-align:center;margin:10px 0 30px"><a href="stories.html" class="btn btn-ghost">📖 讀全部寓言 →</a></div>
</section>

<section class="container">
  <div class="section-title"><div class="eyebrow">🌿 四季畫廊</div><h2 class="grad-text">infucoco 的四季</h2></div>
  <div class="grid g4">
    <div class="card reveal"><img class="gal-img" src="./assets/webp/infucoco_cherry_picnic.webp" alt="春天的櫻花野餐"><div class="card-body"><h4>🌸 春 · 櫻花</h4></div></div>
    <div class="card reveal d2"><img class="gal-img" src="./assets/webp/infucoco_beach_dawn_waves.webp" alt="夏日的海邊"><div class="card-body"><h4>🌊 夏 · 海邊</h4></div></div>
    <div class="card reveal d3"><img class="gal-img" src="./assets/webp/infucoco_autumn_gold_walk.webp" alt="秋天的金色散步"><div class="card-body"><h4>🍁 秋 · 金葉</h4></div></div>
    <div class="card reveal d4"><img class="gal-img" src="./assets/webp/infucoco_first_snow_window.webp" alt="冬天的初雪"><div class="card-body"><h4>❄️ 冬 · 初雪</h4></div></div>
  </div>
  <div style="text-align:center;margin:10px 0 30px"><a href="gallery.html" class="btn btn-ghost">🌿 看全部四季 →</a></div>
</section>

<section class="container">
  <div class="section-title"><div class="eyebrow">💡 商業模式</div><h2 class="grad-text">療癒也能變現</h2></div>
  <div class="flow-steps reveal">
    <div class="flow-step">💬 金句分享<small>免費攬流量</small></div><span class="step-arrow">→</span>
    <div class="flow-step">👑 會員訂閱<small>NT$99 起/月</small></div><span class="step-arrow">→</span>
    <div class="flow-step">🛍️ 周邊商店<small>貼圖桌布</small></div><span class="step-arrow">→</span>
    <div class="flow-step">🐾 寵物聯名<small>zootecture 分潤</small></div>
  </div>
  <div style="text-align:center;margin:30px 0"><a href="member.html" class="btn">👑 看看會員方案</a></div>
</section>
'''
scripts_core = '<script src="./js/stories.js"></script><script src="./js/games/games-data.js"></script>'
index_scripts = scripts_core
make("index.html","INFUCOCO 療癒宇宙 - 給疲憊的你","INFUCOCO 療癒宇宙，100款療癒遊戲、35句心靈金句、6篇睡前寓言、四季桌布貼圖與周邊商店。","index",index_body,index_scripts,active="index")
print("index ok")

# ---------- quotes ----------
quotes_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">💬 心靈金句</h1>
  <p style="color:var(--soft-txt);margin-top:10px">每天一句，撿一句溫柔送給自己。</p>
</section>
<div class="container" style="text-align:center;padding-bottom:40px">
  <div id="quote-of-day" class="reveal in" style="background:var(--grad);color:#fff;border-radius:26px;padding:40px 30px;max-width:680px;margin:20px auto;box-shadow:var(--shadow-lg)">
    <div style="font-size:2.6rem">🌙</div>
    <p id="qod-text" style="font-size:1.6rem;font-weight:900;line-height:1.6;margin:18px 0"></p>
    <p id="qod-date" style="opacity:.85;font-size:.9rem"></p>
    <div style="display:flex;gap:12px;justify-content:center;margin-top:22px;flex-wrap:wrap">
      <button class="btn" onclick="copyQuote()">📋 複製分享</button>
      <button class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.6)" onclick="nextQuote()">🔄 換一句</button>
    </div>
  </div>
  <div class="section-title"><div class="eyebrow">📚 金句日曆</div><h2 class="grad-text">翻一頁，撿一句溫柔</h2><p style="color:var(--soft-txt)">點一下就能複製，送給那個需要被抱抱的人。</p></div>
  <div class="grid g3" id="quote-grid"></div>
</div>
'''
quotes_scripts = '''<script>
(function(){
  const grid=document.getElementById("quote-grid");
  grid.innerHTML=QUOTES.map((q,i)=>`<div class="card reveal" style="cursor:pointer" onclick="copyThis('${q.replace(/'/g,"\\\\'")}')"><div class="card-body"><div style="font-size:2rem;margin-bottom:8px">💬</div><p style="font-size:1.05rem;font-weight:700;line-height:1.7">${q}</p><p style="color:var(--soft-txt);font-size:.78rem;margin-top:10px">${String(i+1).padStart(2,"0")} · 點一下複製</p></div></div>`).join("");
  function showDay(){
    const d=new Date();const q=QUOTES[d.getDate()%QUOTES.length];
    document.getElementById("qod-text").textContent=q;
    document.getElementById("qod-date").textContent=d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日 · 今日金句";
  }
  showDay();
  window.copyQuote=function(){const t=document.getElementById("qod-text").textContent;navigator.clipboard.writeText(t).then(()=>toast("📋 已複製：「"+t+"」"))};
  window.copyThis=function(t){navigator.clipboard.writeText(t).then(()=>toast("📋 已複製：「"+t+"」"))};
  window.nextQuote=function(){const d=new Date();document.getElementById("qod-text").textContent=QUOTES[Math.floor(Math.random()*QUOTES.length)]};
  Svc.StatSvc.inc("visit_quotes");
})();
</script>'''
make("quotes.html","心靈金句 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙心靈金句，每日一句療癒短語，一鍵複製分享。","quotes",quotes_body,quotes_scripts,active="quotes")
print("quotes ok")

# ---------- games ----------
games_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">🎮 100 款療癒遊戲</h1>
  <p style="color:var(--soft-txt);margin-top:10px;max-width:700px;margin-inline:auto">跟著 infucoco 玩到發光：反應、益智、寓言、療癒、玩樂、創作，天天有挑戰。</p>
</section>
<div class="container" style="padding-top:26px">
  <div class="daily-banner reveal" id="daily-banner">
    <div class="d-icon">🌟</div>
    <div style="flex:1"><h3>今日療癒挑戰</h3><p id="daily-desc">每天一顆星，玩出新紀錄！</p></div>
    <a href="#" id="daily-link" class="btn">🎯 挑戰</a>
  </div>
  <div class="filter-bar" id="filter-bar">
    <button class="filter-pill active" data-f="all">全部 (100)</button>
    <button class="filter-pill" data-f="react">🎯 反應</button>
    <button class="filter-pill" data-f="puzzle">🧠 益智</button>
    <button class="filter-pill" data-f="fable">📖 寓言</button>
    <button class="filter-pill" data-f="pet">🐾 療癒</button>
    <button class="filter-pill" data-f="arcade">🎪 玩樂</button>
    <button class="filter-pill" data-f="creative">🎨 創作</button>
  </div>
  <div style="text-align:center;margin-bottom:26px;color:var(--soft-txt);font-size:.9rem"><b id="count-label">共 100 款遊戲</b> · ⭐簡單 ⭐⭐中等 ⭐⭐⭐挑戰</div>
  <div class="game-grid" id="game-grid"></div>
  <div class="empty" id="empty" style="display:none">沒有找到符合的遊戲，換個分類試試</div>
</div>
'''
games_scripts = '''<script src="./js/games/games-data.js"></script><script src="./js/games/games.js"></script><script>
(function(){
  const thumbs=[
    "infucoco_crescent_moon_stars","infucoco_glowing_star_fingertip","infucoco_firefly_jar_night","infucoco_daisy_spring_walk",
    "infucoco_afterwork_coffee_sidewalk","infucoco_bridge_night_city","infucoco_book_flying_sky","infucoco_giant_flower_field",
    "infucoco_cherry_picnic","infucoco_beach_dawn_waves","infucoco_autumn_gold_walk","infucoco_first_snow_window",
    "infucoco_candle_darkness","infucoco_cloud_bed_lying","infucoco_firefly_jar_hold","infucoco_cat_on_snail",
    "infucoco_glowing_key_palm","infucoco_birthday_candles_cat","infucoco_book_staircase","infucoco_conch_shell_glow"
  ];
  const grid=document.getElementById("game-grid");
  let cur="all",search="";
  const params=new URLSearchParams(location.search);
  if(params.get("q")==="random"){const g=GAMES[Math.floor(Math.random()*GAMES.length)];location.href="play.html?g="+g.id;return}
  if(params.get("q")){search=params.get("q").toLowerCase()}
  const diffStar=d=>"⭐".repeat(d||1);
  function img(g){return "assets/webp/"+thumbs[parseInt(g.id.replace("g",""))%thumbs.length]+".webp"}
  function render(){
    const list=GAMES.filter(g=>(cur==="all"||g.c===cur)&&(!search||(g.t+g.d).toLowerCase().includes(search)));
    document.getElementById("count-label").textContent="共 "+list.length+" 款遊戲";
    document.getElementById("empty").style.display=list.length?"none":"block";
    grid.innerHTML=list.map(g=>`<a class="game-card reveal" href="play.html?g=${g.id}"><div class="game-thumb" style="background-image:url('${img(g)}')"><span class="gcat">${CFG.categories[g.c]}</span><span class="gdiff">${diffStar(g.lv)}</span><span class="gnum">${g.id.toUpperCase()}</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>${g.i} ${g.t}</h4><p>${g.d}</p></div></a>`).join("");
    grid.querySelectorAll(".reveal").forEach(x=>x.classList.add("in"));
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
    grid.querySelectorAll(".reveal").forEach(el=>io.observe(el));
  }
  document.getElementById("filter-bar").addEventListener("click",e=>{const b=e.target.closest(".filter-pill");if(!b)return;document.querySelectorAll(".filter-pill").forEach(x=>x.classList.remove("active"));b.classList.add("active");cur=b.dataset.f;render()});
  const dg=dailyChallenge();
  document.getElementById("daily-desc").textContent="今日遊戲：「"+dg.i+" "+dg.t+"」· "+CFG.categories[dg.c]+" · 難度 "+CFG.difficulty[dg.lv||1];
  document.getElementById("daily-link").href="play.html?g="+dg.id;
  document.getElementById("daily-link").textContent="🎯 挑戰「"+dg.t+"」";
  render(); Svc.StatSvc.inc("visit_games");
})();
</script>'''
make("games.html","100 款療癒遊戲 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙 100 款互動遊戲庫，含難度、分類與每日挑戰。","games",games_body,games_scripts,active="games")
print("games ok")

# ---------- play ----------
play_body = '''
<section class="container" style="padding:26px 24px">
  <div class="section-title">
    <div class="eyebrow">現在開玩</div>
    <h2 class="grad-text" id="game-title">載入遊戲中…</h2>
    <p id="game-desc" style="color:var(--soft-txt)"></p>
  </div>
  <div class="game-arena">
    <div class="game-top">
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span class="grad-text" id="game-cat" style="font-weight:800"></span>
        <span id="game-diff" style="font-size:1rem;color:#ffd23f"></span>
        <span id="game-fav" class="collect-btn" style="margin-left:0;cursor:pointer" title="收藏">⭐</span>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        <span class="score" id="game-score">🏆 0</span>
        <a href="games.html" class="btn btn-ghost" style="padding:8px 16px;font-size:.85rem">⬅ 遊戲庫</a>
      </div>
    </div>
    <div class="game-stage" id="game-stage"></div>
  </div>
  <div style="text-align:center;margin-top:26px">
    <a href="games.html?q=random" class="btn btn-ghost">🎲 隨機下一款</a>
    <button id="replay" class="btn" style="margin-left:12px">🔁 重新開始</button>
  </div>
</section>
'''
play_scripts = '''<script src="./js/games/games-data.js"></script><script src="./js/games/games.js"></script><script>
(function(){
  const m=location.href.match(/[?&]g=([a-zA-Z0-9]+)/);
  const id=m?m[1]:"g01";
  const g=GAME_MAP[id];
  const stage=document.getElementById("game-stage");
  const title=document.getElementById("game-title");
  const desc=document.getElementById("game-desc");
  const cat=document.getElementById("game-cat");
  const diff=document.getElementById("game-diff");
  const score=document.getElementById("game-score");
  const fav=document.getElementById("game-fav");
  let currentBest=0;
  function load(){
    if(!g){stage.innerHTML="<div class='game-msg'><h3>找不到這款遊戲</h3><p>回遊戲庫重新選擇</p></div>";return}
    title.textContent=g.i+" "+g.t;
    desc.textContent=g.d;
    cat.textContent=CFG.categories[g.c]+" · "+g.t;
    diff.textContent="難度 "+CFG.difficulty[g.lv||1];
    currentBest=Svc.BestSvc.get(g.id);
    fav.classList.toggle("on",Svc.FavSvc.has(g.id));
    run();
  }
  function run(){
    score.textContent="🏆 0";
    stage.innerHTML="";
    const e=GameEngines[g.ty];
    const isDaily=Svc.DailySvc.isToday(g.id);
    const start=document.createElement("div");start.className="game-start";
    start.innerHTML=`<div style="font-size:3rem">${g.i}</div><h3>${g.t}</h3><p>${g.d}<br>難度 ${CFG.difficulty[g.lv||1]}${isDaily?"<br>🌟 這是今日療癒挑戰！":""}<br>最佳紀錄：${currentBest>0?currentBest+" 分":"尚未挑戰"}</p><button class="btn">▶ 開始遊戲</button>`;
    start.querySelector("button").onclick=()=>{stage.removeChild(start);e.start(stage,onScore,onEnd)};
    stage.appendChild(start);
    stage.__replay=run;
  }
  function onScore(s){score.textContent="🏆 "+s}
  function onEnd(s){if(Svc.BestSvc.set(g.id,s)){toast("🎉 新紀錄！ "+s+" 分");Svc.DailySvc.set(g.id);Svc.StatSvc.inc("daily_"+g.id)}}
  fav.addEventListener("click",()=>{Svc.FavSvc.toggle(g.id);fav.classList.toggle("on");toast(Svc.FavSvc.has(g.id)?"⭐ 已收藏":"移除收藏")});
  document.getElementById("replay").addEventListener("click",run);
  Svc.RecentSvc.push(id); Svc.StatSvc.inc("visit_play");
  load();
})();
</script>'''
make("play.html","開玩遊戲 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙互動小遊戲播放器，勝利彩帶慶祝。","play",play_body,play_scripts,active="games")
print("play ok")

# ---------- quiz ----------
quiz_body = '''
<section class="container" style="padding:34px 24px">
  <div id="quiz-root"></div>
</section>
'''
quiz_scripts = '''<script>
(function(){
  const root=document.getElementById("quiz-root");
  const quiz=QUIZ; let step=0, picks=[];
  function renderIntro(){
    root.innerHTML=`<div class="quiz-main reveal in"><h1>🔮 ${quiz.title}</h1><p style="color:var(--soft-txt);margin-top:10px">${quiz.intro}</p><div style="margin-top:26px"><button class="btn btn-lg" onclick="startQuiz()">✨ 開始測驗</button></div></div>`;
  }
  window.startQuiz=function(){step=0;picks=[];renderQ()};
  function renderQ(){
    const q=quiz.questions[step];
    const opts=q.o.map((o,ix)=>`<div class="q-opt" onclick="pickOpt(${ix})"><img src="./assets/webp/${o.img}.webp" alt="${o.t}"><span>${o.t}</span></div>`).join("");
    root.innerHTML=`<div class="quiz-main reveal in"><h1>${step+1} / ${quiz.questions.length}</h1><div class="quiz-q" style="font-size:1.25rem;font-weight:800;padding:18px 0">${q.q}</div><div class="q-opts">${opts}</div></div>`;
    confetti&&confetti({count:6});
  }
  window.pickOpt=function(ix){picks.push(ix); step++; if(step<quiz.questions.length)renderQ(); else renderResult()};
  function renderResult(){
    const idx=(picks[0]||0)+((picks[1]||0));
    const r=quiz.results[Math.min(3,Math.round(idx/1.75))];
    root.innerHTML=`<div class="quiz-result reveal in"><div class="rtag">${r.tag}</div><h2 style="font-size:1.5rem;font-weight:900;margin:16px 0 12px;background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">${r.title}</h2><img src="./assets/webp/${r.img}.webp" alt="${r.title}"><p style="font-size:1.02rem;color:var(--soft-txt)">${r.text}</p><div style="display:flex;gap:12px;justify-content:center;margin-top:24px;flex-wrap:wrap"><button class="btn" onclick="startQuiz()">🔄 再測一次</button><a class="btn btn-ghost" href="quotes.html">💬 送自己一句金句</a><a class="btn btn-ghost" href="games.html">🎮 玩一場放鬆遊戲</a></div></div>`;
    confetti({count:100}); Svc.StatSvc.inc("quiz_done");
  }
  renderIntro();
})();
</script>'''
make("quiz.html","心理測驗 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙心理測驗：今天你需要哪一種療癒？","quiz",quiz_body,quiz_scripts,active="quiz")
print("quiz ok")

# ---------- stories ----------
stories_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">📖 療癒寓言</h1>
  <p style="color:var(--soft-txt);margin-top:10px">6 篇睡前小故事，讀完心就暖暖的。</p>
</section>
<div class="container" style="padding-bottom:40px">
  <div class="grid g3" id="story-grid"></div>
</div>
'''
stories_scripts = '''<script>
(function(){
  document.getElementById("story-grid").innerHTML=STORIES.map((s,i)=>`<a class="card tilt reveal" href="fable-${s.id}.html"><img src="./assets/webp/${s.img}.webp" alt="${s.title}"><div class="card-body"><span class="card-tag">${s.tag}</span><h4>${s.title}</h4><p>${s.moral}</p></div></a>`).join("");
  Svc.StatSvc.inc("visit_stories");
})();
</script>'''
make("stories.html","療癒寓言 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙 6 篇睡前寓言小故事，溫暖療癒。","stories",stories_body,stories_scripts,active="stories")
print("stories ok")

# ---------- fable 6 ----------
def fable_page(s):
    body=f'''
<section class="container" style="padding:30px 24px">
  <div class="fable-hero">
    <div class="eyebrow">{s['tag']} · 療癒寓言</div>
    <h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:900" class="grad-text">{s['title']}</h1>
    <img src="./assets/webp/{s['img']}.webp" alt="{s['title']}">
  </div>
  <div class="fable-body reveal in">
    <p style="text-indent:2em">{s['text']}</p>
    <div class="moral-box">💌 {s['moral']}</div>
    <div style="text-align:center;margin-top:26px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a href="stories.html" class="btn btn-ghost">📖 更多寓言</a>
      <a href="quotes.html" class="btn">💬 讀一句金句</a>
    </div>
  </div>
</section>
'''
    scripts='<script src="./js/stories.js"></script><script>Svc&&Svc.StatSvc.inc("visit_fable")</script>'
    make(f"fable-{s['id']}.html",f"{s['title']} - INFUCOCO 療癒宇宙",f"{s['title']}，{s['moral']}",f"fable-{s['id']}",body,scripts,active="stories")

FABLES=[
 {"id":"star-seed","title":"種下星星的種子","img":"infucoco_glowing_star_fingertip","tag":"🌱 耐心","moral":"慢慢來，比較快。","text":"infucoco 得到一顆會發光的種子，她沒有急著把它挖開，而是每天澆水、陪它說話。有一天，種子長成了一顆小月亮。原來，最珍貴的成長，都發生在耐心的等待裡。"},
 {"id":"rain-umbrella","title":"雨天也要撐起彩虹","img":"infucoco_daisy_spring_walk","tag":"🌈 溫柔","moral":"你給出去的溫柔，會以彩虹的形式回來。","text":"下著大雨那天，infucoco 把傘讓給了淋濕的小花。雨停後，天空掛起一道彩虹，正好照在她的傘上。她發現，溫柔從來不會白費，它總會用另一種方式，照亮回來。"},
 {"id":"fireworks","title":"替別人的煙火鼓掌","img":"infucoco_firefly_jar_night","tag":"✨ 分享","moral":"真心為別人喝采，就是為自己點燈。","text":"夜空裡，別人的煙火一朵朵盛開。infucoco 沒有羨慕，而是舉起手為每一朵鼓掌。她相信，當你真心為別人喝采，屬於你的星火，也會悄悄點亮。"},
 {"id":"library-stars","title":"會發光的書","img":"infucoco_edge_open_book_sky","tag":"📖 智慧","moral":"讀過的書，都會成為你發光的養分。","text":"infucoco 走進一座夜晚的圖書館，每一本書都散發著微光。她翻開一本，字句竟化作流星飛進心裡。她懂了，讀過的每一頁，都會變成照亮未來的星光。"},
 {"id":"cosmic-cafe","title":"星塵咖啡館","img":"infucoco_afterwork_coffee_sidewalk","tag":"☕ 放鬆","moral":"允許自己休息，是給未來充電。","text":"在一間開在銀河邊的咖啡館，infucoco 點了一杯熱的星塵拿鐵。她看著星星像奶泡一樣漂浮，終於明白：忙了一天，允許自己停下來，也是一種勇敢。"},
 {"id":"bridge-stars","title":"通往星星的橋","img":"infucoco_bridge_night_city","tag":"🌉 希望","moral":"害怕時，記得前面總有光在等你。","text":"迷路那晚，infucoco 看見一道由星光搭成的橋。她鼓起勇氣踏上，一步步走向天亮。她學會了，害怕的時候，只要相信前面有光，就能跨過黑夜。"}
]
for s in FABLES: fable_page(s)
print("fable x6 ok")

# ---------- gallery ----------
gallery_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">🌿 四季畫廊</h1>
  <p style="color:var(--soft-txt);margin-top:10px">收藏 infucoco 的四季與療癒瞬間，點圖可下載當桌布。</p>
</section>
<div class="container" style="padding-bottom:40px">
  <div class="grid g4" id="gal-grid"></div>
</div>
'''
gallery_scripts = '''<script>
(function(){
  const G=["infucoco_cherry_picnic","infucoco_daisy_spring_walk","infucoco_bench_cherry_petals","infucoco_giant_flower_field",
  "infucoco_beach_dawn_waves","infucoco_giant_seashell_beach","infucoco_firefly_jar_night","infucoco_cloud_bed_lying",
  "infucoco_autumn_gold_walk","infucoco_autumn_leaves_basket","infucoco_autumn_hot_cocoa","infucoco_autumn_bench_reading",
  "infucoco_first_snow_window","infucoco_cold_hands_warm_breath","infucoco_candle_darkness","infucoco_crescent_moon_stars"];
  const names=["春·櫻花野餐","春·雛菊散步","春·櫻花長椅","春·花田","夏·海邊晨光","夏·海貝","夏·螢火蟲夜","夏·雲朵午睡",
  "秋·金色散步","秋·落葉籃","秋·熱可可","秋·閱讀長椅","冬·初雪窗","冬·呵暖雙手","冬·燭光夜","冬·月光星星"];
  document.getElementById("gal-grid").innerHTML=G.map((g,i)=>`<div class="card reveal"><img class="gal-img" src="./assets/webp/${g}.webp" alt="${names[i]}"><div class="card-body"><h4>${names[i]}</h4><a class="dl-chip" href="./assets/webp/${g}.webp" download>⬇️ 下載</a></div></div>`).join("");
  Svc.StatSvc.inc("visit_gallery");
})();
</script>'''
make("gallery.html","四季畫廊 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙四季桌布下載，16 張療癒插畫。","gallery",gallery_body,gallery_scripts,active="gallery")
print("gallery ok")

# ---------- stickers ----------
stickers_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">🖼️ 療癒貼圖</h1>
  <p style="color:var(--soft-txt);margin-top:10px">把 infucoco 帶進你的聊天室，點圖即可下載。</p>
</section>
<div class="container" style="padding-bottom:40px">
  <div class="grid g6" style="grid-template-columns:repeat(auto-fill,minmax(140px,1fr))" id="stk-grid"></div>
</div>
'''
stickers_scripts = '''<script>
(function(){
  const S=["infucoco_glowing_star_fingertip","infucoco_cat_on_snail","infucoco_glowing_key_palm","infucoco_conch_shell_glow",
  "infucoco_candle_dark_room","infucoco_firefly_jar_hold","infucoco_cloud_reading_cat","infucoco_cozy_slippers_office",
  "infucoco_breakroom_pour_milk","infucoco_cave_glowing_entrance","infucoco_garden_watering_tomato","infucoco_flowers_wall_cracks"];
  document.getElementById("stk-grid").innerHTML=S.map(s=>`<div class="card reveal"><img class="sticker" src="./assets/webp/${s}.webp" alt="infucoco 貼圖"><div class="card-body"><a class="dl-chip" href="./assets/webp/${s}.webp" download>⬇️ 下載</a></div></div>`).join("");
  Svc.StatSvc.inc("visit_stickers");
})();
</script>'''
make("stickers.html","貼圖下載 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙貼圖下載，把 infucoco 帶進聊天室。","stickers",stickers_body,stickers_scripts,active="stickers")
print("stickers ok")

# ---------- shop ----------
shop_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">🛍️ 周邊商店</h1>
  <p style="color:var(--soft-txt);margin-top:10px">把療癒帶回家，讓 infucoco 陪著你。</p>
</section>
<div class="container" style="padding-bottom:40px">
  <div class="grid g4" id="shop-grid"></div>
</div>
'''
shop_scripts = '''<script>
(function(){
  const P=[
    ["infucoco_crescent_moon_stars","療癒月亮馬克杯","熱飲與月光的溫度。","390","490"],
    ["infucoco_cloud_bed_lying","雲朵抱枕","躺在雲上睡個好覺。","590","790"],
    ["infucoco_cat_on_snail","小蝸牛公仔","慢慢來，最療癒。","290","390"],
    ["infucoco_book_flying_sky","飛天書籤","讀過的頁都發光。","120","180"],
    ["infucoco_candle_dark_room","夜光小夜燈","睡前的一盞暖光。","450","550"],
    ["infucoco_afterwork_coffee_sidewalk","咖啡隨行杯","裝得下整天的辛苦。","420","520"],
    ["infucoco_firefly_jar_hold","螢火蟲玻璃罐","把小小的光帶回家。","350","450"],
    ["infucoco_breakroom_pour_milk","牛奶小熊杯","暖暖的一杯早安。","380","480"]
  ];
  document.getElementById("shop-grid").innerHTML=P.map(p=>`<div class="card shop-card reveal"><img src="./assets/webp/${p[0]}.webp" alt="${p[1]}"><div class="card-body"><span class="card-tag">🛍️ 周邊</span><h4>${p[1]}</h4><p style="color:var(--soft-txt);font-size:.82rem">${p[2]}</p><div class="price">NT$ ${p[3]}<small>NT$ ${p[4]}</small></div><button class="btn" style="margin-top:14px;width:100%;padding:11px" onclick="toast('🛒 已加入購物車（示意）')">加入購物車</button></div></div>`).join("");
  Svc.StatSvc.inc("visit_shop");
})();
</script>'''
make("shop.html","周邊商店 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙周邊商店，馬克杯、抱枕、公仔、夜燈等療癒小物。","shop",shop_body,shop_scripts,active="shop")
print("shop ok")

# ---------- member ----------
member_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">👑 會員方案</h1>
  <p style="color:var(--soft-txt);margin-top:10px">成為療癒宇宙的一員，每天都有小確幸。</p>
</section>
<div class="container" style="padding-bottom:40px">
  <div class="member-grid">
    <div class="member-card reveal"><h3>🌙 月亮會員</h3><div class="mp">NT$99<span style="font-size:.8rem">/月</span></div><ul><li>每日專屬金句</li><li>療癒桌布全下載</li><li>遊戲最佳紀錄雲端</li></ul><button class="btn btn-ghost" onclick="toast('👑 訂閱示意')">立即訂閱</button></div>
    <div class="member-card hot reveal d2"><div class="badge">最受歡迎</div><h3>⭐ 星星會員</h3><div class="mp">NT$299<span style="font-size:.8rem">/月</span></div><ul><li>月亮會員全部</li><li>周邊 9 折</li><li>每月專屬新遊戲</li><li>生日療癒禮</li></ul><button class="btn" onclick="toast('👑 訂閱示意')">立即訂閱</button></div>
    <div class="member-card reveal d3"><h3>🌌 宇宙會員</h3><div class="mp">NT$699<span style="font-size:.8rem">/月</span></div><ul><li>星星會員全部</li><li>周邊 8 折＋免運</li><li>新寓言搶先讀</li><li>1 對 1 療癒小卡</li></ul><button class="btn btn-ghost" onclick="toast('👑 訂閱示意')">立即訂閱</button></div>
  </div>
  <div style="text-align:center;margin-top:40px;color:var(--soft-txt);font-size:.9rem">※ 示意價格，正式串接金流後生效</div>
</div>
'''
member_scripts='<script>Svc&&Svc.StatSvc.inc("visit_member")</script>'
make("member.html","會員方案 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙會員訂閱方案，月亮、星星、宇宙三種會員。","member",member_body,member_scripts,active="member")
print("member ok")

# ---------- about ----------
about_body = '''
<section class="container" style="padding:40px 24px">
  <div class="fable-hero">
    <div class="eyebrow">關於我們</div>
    <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">INFUCOCO 療癒宇宙</h1>
    <img src="./assets/webp/infucoco_crescent_moon_stars.webp" alt="INFUCOCO 療癒宇宙">
  </div>
  <div class="fable-body reveal in">
    <p style="text-indent:2em">INFUCOCO 是一顆想療癒世界的雙丸子頭小星星。我們相信，現代人的心太累了，需要一個可以發呆、可以停下來的地方。</p>
    <p style="text-indent:2em;margin-top:14px">這裡有 100 款小遊戲、35 句心靈金句、6 篇睡前寓言、四季桌布貼圖與周邊，讓你在忙碌的日子裡，偶爾把月光留給自己。</p>
    <div class="feature-list">
      <div class="feature"><div class="f-ico">🎮</div><h4>100 款遊戲</h4><p>反應、益智、寓言、療癒、玩樂、創作，天天有挑戰。</p></div>
      <div class="feature"><div class="f-ico">💬</div><h4>每日金句</h4><p>撿一句溫柔，送給需要被抱抱的人。</p></div>
      <div class="feature"><div class="f-ico">🖼️</div><h4>療癒素材</h4><p>四季桌布與貼圖，把療癒帶進日常。</p></div>
      <div class="feature"><div class="f-ico">🛍️</div><h4>變現管道</h4><p>會員、周邊、寵物聯名，讓療癒也能被支持。</p></div>
    </div>
  </div>
</section>
'''
about_scripts='<script>Svc&&Svc.StatSvc.inc("visit_about")</script>'
make("about.html","關於 - INFUCOCO 療癒宇宙","關於 INFUCOCO 療癒宇宙的介紹。","about",about_body,about_scripts,active="about")
print("about ok")

# ---------- sitemap ----------
sitemap_body = '''
<section class="page-head" style="text-align:center;padding:40px 24px 8px">
  <h1 style="font-size:clamp(2rem,4.5vw,3rem);font-weight:900" class="grad-text">🗺️ 網站地圖</h1>
  <p style="color:var(--soft-txt);margin-top:10px">整個療癒宇宙，一次看完。</p>
</section>
<div class="container" style="padding-bottom:40px;max-width:760px">
  <div class="feature-list" style="grid-template-columns:1fr 1fr">
    <a class="feature" href="index.html"><div class="f-ico">🏠</div><h4>首頁</h4><p>療癒小宇宙入口</p></a>
    <a class="feature" href="quotes.html"><div class="f-ico">💬</div><h4>心靈金句</h4><p>每日一句、35 句分享</p></a>
    <a class="feature" href="stories.html"><div class="f-ico">📖</div><h4>療癒寓言</h4><p>6 篇睡前小故事</p></a>
    <a class="feature" href="games.html"><div class="f-ico">🎮</div><h4>互動遊戲</h4><p>100 款療癒遊戲</p></a>
    <a class="feature" href="quiz.html"><div class="f-ico">🔮</div><h4>心理測驗</h4><p>今天需要什麼療癒</p></a>
    <a class="feature" href="gallery.html"><div class="f-ico">🌿</div><h4>四季畫廊</h4><p>桌布下載</p></a>
    <a class="feature" href="stickers.html"><div class="f-ico">🖼️</div><h4>貼圖下載</h4><p>療癒貼圖</p></a>
    <a class="feature" href="shop.html"><div class="f-ico">🛍️</div><h4>周邊商店</h4><p>療癒周邊</p></a>
    <a class="feature" href="member.html"><div class="f-ico">👑</div><h4>會員方案</h4><p>三種會員訂閱</p></a>
    <a class="feature" href="about.html"><div class="f-ico">⭐</div><h4>關於</h4><p>療癒宇宙的故事</p></a>
  </div>
</div>
'''
sitemap_scripts='<script>Svc&&Svc.StatSvc.inc("visit_sitemap")</script>'
make("sitemap.html","網站地圖 - INFUCOCO 療癒宇宙","INFUCOCO 療癒宇宙完整網站地圖。","sitemap",sitemap_body,sitemap_scripts,active=None)
print("sitemap ok")

print("ALL HTML GENERATED")
