# -*- coding: utf-8 -*-
import io, os, re
ROOT = r"D:\_WWW_325\www\infucoco_v6"

HEAD_OPEN = '''<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="{desc}">
<title>{title}</title>
<link rel="stylesheet" href="./css/main.css">
</head>
<body data-page="{page}">
<canvas id="particles" aria-hidden="true"></canvas>
<header class="site-header"><div class="header-inner">
<div class="logo">INFU<em>COCO</em><small>沉浸療癒宇宙</small></div>
<nav class="nav-links">
<a href="index.html">首頁</a><a href="quotes.html">💬 金句</a><a href="stories.html">📖 寓言</a><a href="games.html">🎮 遊戲</a><a href="quiz.html">🔮 測驗</a><a href="gallery.html">🌿 infu空間</a><a href="stickers.html">🖼 貼圖</a><a href="shop.html">🛍 商店</a><a href="member.html">👑 會員</a>
</nav>
<div class="nav-actions">
  <div class="search-box"><input id="site-search" placeholder="搜尋網站內容…"><button class="icon-btn" id="search-go">🔎</button></div>
  <div class="popover-wrap">
    <button class="icon-btn" id="tools-btn" title="進階工具">⚙️</button>
    <div class="popover-dropdown" id="tools-pop">
      <div class="popover-dropdown__head"><span class="popover-dropdown__title">✦ 進階工具</span><button class="icon-btn" style="width:32px;height:32px" id="pop-close">✕</button></div>
      <div class="popover-dropdown__grid">
        <a class="popover-dropdown__link" href="#" data-nav="random"><span class="popover-dropdown__icon">🎲</span>隨機網站</a>
        <a class="popover-dropdown__link" href="#" data-nav="jump"><span class="popover-dropdown__icon">⚡</span>快速跳轉</a>
        <a class="popover-dropdown__link" href="#" data-nav="fav"><span class="popover-dropdown__icon">⭐</span>我的最愛</a>
        <a class="popover-dropdown__link" href="#" data-nav="recent"><span class="popover-dropdown__icon">🕒</span>最近造訪</a>
        <a class="popover-dropdown__link" href="#" data-nav="cat"><span class="popover-dropdown__icon">🗂</span>分類統計</a>
        <a class="popover-dropdown__link" href="#" data-nav="csv"><span class="popover-dropdown__icon">📊</span>匯出CSV</a>
        <a class="popover-dropdown__link" href="#" data-nav="theme"><span class="popover-dropdown__icon">🎨</span>切換配色</a>
        <a class="popover-dropdown__link" href="#" data-nav="lang"><span class="popover-dropdown__icon">🌐</span>語言</a>
        <a class="popover-dropdown__link" href="sitemap.html"><span class="popover-dropdown__icon">🗺</span>網站地圖</a>
      </div>
      <div class="popover-dropdown__foot">
        <button class="popover-dropdown__chip" data-nav="random">🎲 隨機</button>
        <button class="popover-dropdown__chip" data-nav="csv">📊 CSV</button>
        <button class="popover-dropdown__chip" data-nav="theme">🎨 配色</button>
      </div>
    </div>
  </div>
</div>
</div></header>
<div class="breadcrumb"><a href="index.html">首頁</a></div>
'''

FOOT = '''
<footer class="site-footer"><div class="footer-inner">
<div class="footer-col"><h4 style="font-size:1.2rem">INFUCOCO 沉浸療癒宇宙</h4><p style="font-size:.9rem;color:rgba(255,255,255,.6)">給疲憊的你，一座沉浸式怪美宇宙：寓言 × 金句 × 遊戲 × 測驗 × 貼圖 × 周邊。</p><p style="margin-top:10px;color:rgba(255,255,255,.6)">✉️ hello@infucoco.studio</p></div>
<div class="footer-col"><h4>療癒</h4><ul><li><a href="quotes.html">💬 心靈金句</a></li><li><a href="stories.html">📖 療癒寓言</a></li><li><a href="quiz.html">🔮 心理測驗</a></li></ul></div>
<div class="footer-col"><h4>玩樂</h4><ul><li><a href="games.html">🎮 互動遊戲</a></li><li><a href="gallery.html">🌿 infu空間</a></li><li><a href="stickers.html">🖼 貼圖下載</a></li></ul></div>
<div class="footer-col"><h4>網站地圖</h4><ul><li><a href="shop.html">🛍 周邊商店</a></li><li><a href="member.html">👑 會員</a></li><li><a href="about.html">關於</a></li><li><a href="sitemap.html">完整地圖</a></li></ul></div>
</div><div class="footer-credit">規劃設計開發：張書欣　📞 <a href="tel:0968222201">0968-222201</a>　💬 <a href="https://line.me/ti/p/~331.today" target="_blank" rel="noopener">331.today</a></div><div class="footer-bottom">© 2026 INFUCOCO 沉浸療癒宇宙 · v6.0.0</div></footer>
<button id="scroll-top" title="回到頂部">↑</button>
<div id="toast"></div>
'''

EXPLORE = '''
<section class="skew-sec" style="padding-top:110px">
<div class="container explore">
  <div class="section-title"><span class="sec-no">✦ 繼續探索</span><h2>怪美宇宙<span class="rl">大暴走</span></h2><p class="lead">翻轉卡片，走進每一座怪美場景。</p></div>
  <div class="grid g4">
    <a class="card-b reveal" href="quotes.html"><img src="./assets/webp/infucoco_glowing_lantern_dark.webp" alt="每日金句"><div class="ovl"><span class="tag">💬 每日一句</span><h3>心靈金句</h3></div></a>
    <a class="card-b reveal d2" href="stories.html"><img src="./assets/webp/infucoco_firefly_jar_night.webp" alt="睡前寓言"><div class="ovl"><span class="tag">📖 睡前故事</span><h3>療癒寓言</h3></div></a>
    <a class="card-b reveal d3" href="games.html"><img src="./assets/webp/infucoco_glowing_star_fingertip.webp" alt="100款互動遊戲"><div class="ovl"><span class="tag">🎮 100 款</span><h3>互動遊戲</h3></div></a>
    <a class="card-b reveal d4" href="quiz.html"><img src="./assets/media/infucoco_blanket_pet_sit_night.webp" alt="心理測驗"><div class="ovl"><span class="tag">🔮 測驗</span><h3>心理測驗</h3></div></a>
  </div>
</div>
</section>
'''

SCRIPTS = ('<script src="./js/config.js?v=20261003v6"></script><script src="./js/quotes.js?v=20261003v6"></script>'+
           '<script src="./js/service.js?v=20261003v6"></script><script src="./js/utils.js?v=20261003v6"></script>'+
           '<script src="./js/stories.js?v=20261003v6"></script>'+
           '<script src="./js/games/games-data.js?v=20261003v6"></script><script src="./js/games/games.js?v=20261003v6"></script>')

def nav_active(active):
    h = HEAD_OPEN
    m = {'index':'<a href="index.html">','quotes':'<a href="quotes.html">','stories':'<a href="stories.html">','games':'<a href="games.html">','quiz':'<a href="quiz.html">','gallery':'<a href="gallery.html">','stickers':'<a href="stickers.html">','shop':'<a href="shop.html">','member':'<a href="member.html">'}
    if active in m:
        h = h.replace(m[active], m[active].replace('>', ' class="active">'), 1)
    return h

def make(fn, title, desc, page_id, body, extra='', active=None):
    head = nav_active(active) if active else HEAD_OPEN
    html = (head.format(title=title, desc=desc, page=page_id) + body + EXPLORE + FOOT +
            SCRIPTS + extra + '</body></html>')
    with io.open(os.path.join(ROOT, fn), 'w', encoding='utf-8') as f:
        f.write(html)

# ---------- index ----------
index_body = '''
<section class="hero">
  <div class="hero-bg" style="background-image:url('./assets/media/infucoco_door_glove_pet_welcome.webp')"></div>
  <video class="hero-video" src="./assets/video/hero.mp4" autoplay muted loop playsinline preload="auto" poster="./assets/media/infucoco_door_glove_pet_welcome.webp"></video>
  <div class="hero-content">
    <span class="hero-stamp">✦ 沉浸療癒 · V6 特殊版型 ✦</span>
    <h1 class="hero-title">INFU<br>COCO<span class="rl">✦</span><br><span class="hl">怪美宇宙</span></h1>
    <p class="hero-sub">走進一座沉浸式場景。跟雙丸子頭、紅白橫紋的 infucoco 一起，翻轉卡片、墜入寓言、玩怪遊戲。</p>
    <div class="hero-ctas">
      <a href="games.html" class="btn o">🎮 開玩怪遊戲</a>
      <a href="quiz.html" class="btn ghost">🔮 需要啥療癒</a>
      <a href="quotes.html" class="btn w">💬 撿一句金句</a>
    </div>
  </div>
  <div class="scroll-hint">▼ SCROLL</div>
</section>

<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">01 / 場景</span><h2>走進 <span class="sl">怪美</span><span class="rl">房間</span></h2><p class="lead">每一張，都是一個可以躲進去的角落。</p></div>
  <div class="bento">
    <div class="card-b big"><img src="./assets/media/infucoco_blanket_pet_sit_night.webp" alt="夜晚裹毯坐地，貓狗兔相伴"><div class="ovl"><span class="tag">夜晚 · 裹毯</span><h3>裹著毯子，數星星</h3><p>橘貓、小狗與兔子都窩在身邊</p></div></div>
    <div class="card-b"><img src="./assets/media/infucoco_window_dog_cuddle_moon.webp" alt="夜窗月與小狗依偎"><div class="ovl"><span class="tag">夜窗</span><h3>小狗依偎</h3></div></div>
    <div class="card-b"><img src="./assets/media/infucoco_hide_seek_cat_sofa.webp" alt="捉迷藏，貓從抱枕探頭"><div class="ovl"><span class="tag">遊戲</span><h3>捉迷藏</h3></div></div>
    <div class="card-b w2"><img src="./assets/media/infucoco_entrance_squat_pet_mat.webp" alt="玄關蹲地墊，白兔橘貓小狗"><div class="ovl"><span class="tag">玄關</span><h3>回家的第一句話</h3><p>蹲下來，把一天的疲憊交出去</p></div></div>
    <div class="card-b"><img src="./assets/media/infucoco_folding_clothes_pet_moon.webp" alt="折衣時貓狗兔相伴、窗外月"><div class="ovl"><span class="tag">日常</span><h3>折一件衣服</h3></div></div>
    <div class="card-b"><img src="./assets/media/infucoco_kitchen_cat_bowl_morning.webp" alt="廚房早晨，貓等飯碗"><div class="ovl"><span class="tag">廚房</span><h3>早安，一碗暖</h3></div></div>
  </div>
</div>
</section>

<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">02 / 寓言</span><h2>翻轉卡<span class="rl">睡前故事</span></h2><p class="lead">滑鼠點一下，卡片會翻面。</p></div>
  <div class="grid g3">
    <div class="flip-wrap"><div class="flip"><div class="face front"><img src="./assets/webp/infucoco_glowing_star_fingertip.webp" alt="種下星星的種子"><div class="fcap">🌱 種下星星的種子</div></div><div class="face back"><h3>種下星星的種子</h3><p>最珍貴的成長，都發生在耐心的等待裡。</p><a class="btn o" style="margin-top:16px;padding:10px 18px;font-size:.85rem" href="fable-star-seed.html">讀全文</a></div></div></div>
    <div class="flip-wrap"><div class="flip"><div class="face front"><img src="./assets/webp/infucoco_firefly_jar_night.webp" alt="替別人的煙火鼓掌"><div class="fcap">✨ 替別人的煙火鼓掌</div></div><div class="face back"><h3>替別人的煙火鼓掌</h3><p>真心為別人喝采，就是為自己點燈。</p><a class="btn o" style="margin-top:16px;padding:10px 18px;font-size:.85rem" href="fable-fireworks.html">讀全文</a></div></div></div>
    <div class="flip-wrap"><div class="flip"><div class="face front"><img src="./assets/webp/infucoco_afterwork_coffee_sidewalk.webp" alt="星塵咖啡館"><div class="fcap">☕ 星塵咖啡館</div></div><div class="face back"><h3>星塵咖啡館</h3><p>允許自己休息，是給未來充電。</p><a class="btn o" style="margin-top:16px;padding:10px 18px;font-size:.85rem" href="fable-cosmic-cafe.html">讀全文</a></div></div></div>
  </div>
</div>
</section>

<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">03 / 遊戲</span><h2>先玩<span class="rl">這幾款</span></h2></div>
  <div class="grid g3">
    <a class="game-card reveal" href="play.html?g=g03"><div class="game-thumb" style="background-image:url('./assets/media/infucoco_blanket_pet_sit_night.webp')"><span class="gcat">🎯 反應</span><span class="gnum">G03</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🌱 拯救飄落的種子</h4><p>接住種子，別讓雜草落地</p></div></a>
    <a class="game-card reveal d2" href="play.html?g=g42"><div class="game-thumb" style="background-image:url('./assets/media/infucoco_hide_seek_cat_sofa.webp')"><span class="gcat">📖 寓言</span><span class="gnum">G42</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🎆 寓言問答</h4><p>關於願望的小測驗</p></div></a>
    <a class="game-card reveal d3" href="play.html?g=g07"><div class="game-thumb" style="background-image:url('./assets/media/infucoco_folding_clothes_pet_moon.webp')"><span class="gcat">🎪 玩樂</span><span class="gnum">G07</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>🫧 點泡泡大賽</h4><p>反應力大考驗</p></div></a>
  </div>
  <div class="center mt"><a href="games.html" class="btn dark">🎮 玩全部 100 款 →</a></div>
</div>
</section>
'''
make("index.html", "INFUCOCO 沉浸療癒宇宙 · V6", "INFUCOCO 沉浸式特殊版型網站：寓言 × 金句 × 遊戲 × 測驗。", "index", index_body, active="index")

# ---------- quotes ----------
quotes_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">💬 每日一句</span><h2>怪美<span class="rl">心靈金句</span></h2><p class="lead">點一下複製，把溫柔帶走。</p></div>
  <div class="quote-main" id="q-main"><span class="mark">「</span><span id="q-today">今天，也要好好對待自己。</span><span class="mark">」</span></div>
  <div class="center mt"><button class="btn o" onclick="nextQ()">🎲 換一句</button><button class="btn dark" onclick="copyQ()">📋 複製金句</button></div>
  <div class="grid g3 mt" id="q-list"></div>
</div>
</section>
'''
quotes_script = '''
<script>
(function(){const L=window.QUOTES||[];
document.getElementById("q-list").innerHTML=L.slice(0,9).map((q,i)=>`<div class="card-b reveal d${(i%3)+2}" style="padding:22px;display:block"><span class="card-tag"># ${i+1}</span><p style="font-size:1.05rem;font-weight:700">${q}</p><button class="card-tag" style="margin-top:12px;cursor:pointer" onclick="navigator.clipboard&&navigator.clipboard.writeText('${q}')">📋 複製</button></div>`).join("");
const el=document.getElementById("q-today");
function pick(){el.textContent=L[Math.floor(Math.random()*L.length)];}
window.nextQ=pick;window.copyQ=()=>{const s=el.textContent;navigator.clipboard&&navigator.clipboard.writeText(s);toast("已複製金句 ✨");};
})();
</script>'''
make("quotes.html", "心靈金句 - INFUCOCO V6", "INFUCOCO 怪美心靈金句，每日一句療癒。", "quotes", quotes_body, quotes_script, active="quotes")

# ---------- stories ----------
stories_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">📖 睡前故事</span><h2>療癒<span class="rl">寓言</span></h2><p class="lead">六篇短寓言，讀完再睡。</p></div>
  <div class="grid g3" id="st-story-grid"></div>
</div>
</section>
'''
stories_script = '''
<script>
(function(){const S=window.STORIES||[];
document.getElementById("st-story-grid").innerHTML=S.map((s,i)=>`<div class="flip-wrap reveal d${(i%3)+2}"><div class="flip"><div class="face front"><img src="./assets/webp/${s.img}.webp" alt="${s.title}"><div class="fcap">${s.tag} · ${s.title}</div></div><div class="face back"><h3>${s.title}</h3><p>${s.moral}</p><a class="btn o" style="margin-top:16px;padding:10px 18px;font-size:.85rem" href="fable-${s.id}.html">讀全文 →</a></div></div></div>`).join("");
})();
</script>'''
make("stories.html", "療癒寓言 - INFUCOCO V6", "INFUCOCO 療癒寓言睡前故事六篇。", "stories", stories_body, stories_script, active="stories")

# ---------- games ----------
games_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🎮 遊戲庫</span><h2>100 款<span class="rl">怪美遊戲</span></h2><p class="lead">反應 / 益智 / 寓言 / 寵物 / 玩樂 / 創作，通通玩得到。</p></div>
  <div class="toolbar-row" id="filters"></div>
  <div class="grid g4" id="game-grid"></div>
</div>
</section>
'''
games_script = '''
<script>
(function(){const G=window.GAMES||[];const MAP=window.GAME_MAP||{};
const cats=[["all","全部"],["react","反應"],["puzzle","益智"],["fable","寓言"],["pet","寵物"],["arcade","玩樂"],["creative","創作"]];
const TH=["infucoco_blanket_pet_sit_night","infucoco_window_dog_cuddle_moon","infucoco_hide_seek_cat_sofa","infucoco_entrance_squat_pet_mat","infucoco_folding_clothes_pet_moon","infucoco_kitchen_cat_bowl_morning","infucoco_home_reading_pet_lamp","infucoco_door_glove_pet_welcome"];
const FIL=document.getElementById("filters");const GRID=document.getElementById("game-grid");
FIL.innerHTML=cats.map(c=>`<button class="filter-chip ${c[0]==='all'?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join("");
function render(c){let list=G;if(c!=="all")list=G.filter(g=>g.c===c);
GRID.innerHTML=list.slice(0,60).map((g,i)=>`<a class="game-card reveal d${(i%4)+1}" href="play.html?g=${g.id}"><div class="game-thumb" style="background-image:url('./assets/media/${TH[(g.id.charCodeAt(1)%8)]}.webp')"><span class="gcat">${g.c}</span><span class="gnum">${g.id.toUpperCase()}</span><div class="play-badge"><span>▶</span></div></div><div class="game-info"><h4>${g.i} ${g.t}</h4><p>${g.d}</p></div></a>`).join("");
}
FIL.addEventListener("click",e=>{const b=e.target.closest(".filter-chip");if(!b)return;FIL.querySelectorAll(".filter-chip").forEach(x=>x.classList.remove("on"));b.classList.add("on");render(b.dataset.c);});
render("all");
})();
</script>'''
make("games.html", "怪美遊戲庫 - INFUCOCO V6", "INFUCOCO 100 款互動遊戲，反應益智寓言寵物玩樂創作。", "games", games_body, games_script, active="games")

# ---------- play ----------
play_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🎮 播放器</span><h2>開玩<span class="rl">怪遊戲</span></h2></div>
  <div class="game-stage" id="game-stage">
    <div class="g-toolbar"><span class="g-info" id="g-title">載入中…</span><span class="score">🏆 <span id="g-best">0</span></span></div>
    <div id="g-arena"><div class="game-start"><h3>✨ 準備好了嗎？</h3><p id="g-desc">選一款遊戲，開始沉浸。</p><button class="btn o" onclick="startGame()">▶ 開始遊戲</button></div></div>
  </div>
</div>
</section>
'''
play_script = '''
<script>
(function(){
const G=window.GAMES||[];const MAP=window.GAME_MAP||{};
const url=new URLSearchParams(location.search);const id=url.get("g")||"g01";
const g=G.find(x=>x.id===id)||G[0];const m=MAP[g.id]||{};
document.getElementById("g-title").textContent=g.i+" "+g.t;
document.getElementById("g-desc").textContent=g.d;
document.getElementById("g-best").textContent="尚未挑戰";
let engine=null,score=0;
window.startGame=function(){const A=document.getElementById("g-arena");const E=window.GameEngines;
if(!E||typeof E[g.ty]!=="function"){A.innerHTML="<div class='game-start'><h3>😅 引擎尚未就緒</h3><p>請重新整理。</p></div>";return;}
engine=E[g.ty](g);engine.start(A);};
document.getElementById("g-best").textContent=(localStorage.getItem("infu_best_"+id)||"尚未挑戰");
})();
</script>'''
make("play.html", "遊戲播放器 - INFUCOCO V6", "INFUCOCO 互動遊戲播放器，100 款任玩。", "games", play_body, play_script, active="games")

# ---------- quiz ----------
quiz_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🔮 心理測驗</span><h2>今天需要<span class="rl">哪種療癒</span></h2><p class="lead">答完 5 題，看看怪美宇宙想送你什麼。</p></div>
  <div class="game-stage" id="q-arena"><div class="game-start"><button class="btn o" onclick="quizStart()">🔮 開始測驗</button></div></div>
</div>
</section>
'''
quiz_script = '''
<script>
(function(){const Q=window.QUIZ||[];const AR=document.getElementById("q-arena");
let i=0,r=0;
window.quizStart=function(){i=0;r=0;quizNext();};
function quizNext(){const q=Q[i];if(!q){const t=["🌿 你需要一座安靜的花園","✨ 你需要一點星星的勇氣","💛 你需要一張軟軟的毯子","🌈 你需要一場七彩的夢"];AR.innerHTML=`<div class="game-start"><h3 style="font-size:2.2rem">${t[r%t.length]}</h3><p>你的療癒劑量已開好。</p><button class="btn o" onclick="quizStart()">🔁 再測一次</button></div>`;return;}
AR.innerHTML=`<div class="game-start"><h3>Q${i+1} · ${q.q}</h3><div class="opt-row">${q.a.map(a=>`<button onclick="quizPick(this,'${a}')">${a}</button>`).join("")}</div></div>`;
}
window.quizPick=function(btn,a){if(btn.dataset.done)return;btn.dataset.done=1;i++;r+=a.length%2;quizNext();};
})();
</script>'''
make("quiz.html", "心理測驗 - INFUCOCO V6", "INFUCOCO 心理測驗，找到今天的療癒。", "quiz", quiz_body, quiz_script, active="quiz")

# ---------- gallery ----------
gallery_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🌿 infu空間</span><h2>怪美<span class="rl">四季桌布</span></h2><p class="lead">把一整座場景，帶回你的桌面。</p></div>
  <div class="bento" id="gal-bento"></div>
</div>
</section>
'''
gallery_script = '''
<script>
(function(){const G=["infucoco_cherry_picnic","infucoco_daisy_spring_walk","infucoco_bench_cherry_petals","infucoco_giant_flower_field","infucoco_beach_dawn_waves","infucoco_autumn_gold_walk","infucoco_first_snow_window","infucoco_crescent_bench_stars","infucoco_edge_open_book_sky","infucoco_crescent_moon_stars","infucoco_bridge_night_city","infucoco_afterwork_coffee_sidewalk","infucoco_glowing_lantern_dark","infucoco_firefly_jar_night","infucoco_glowing_star_fingertip","infucoco_night_door_pet_look"];
const names=["春·櫻花野餐","春·雛菊散步","春·櫻花長椅","春·花田","夏·海邊晨光","秋·金葉散步","冬·初雪窗","月·長椅數星","書·翻開星空","月·月牙坐","夜·城市橋","咖啡·街角","燈·暖燈籠","螢·瓶中螢火","星·指尖星光","夜·推門暖光"];
const sizes=[["big",0],["",1],["",2],["",3],["w2",4],["",5],["",6],["",7],["",8],["",9],["",10],["",11],["",12],["",13],["",14],["",15]];
document.getElementById("gal-bento").innerHTML=sizes.map(s=>`<div class="card-b ${s[0]}" title="${names[s[1]]}"><img src="./assets/webp/${G[s[1]]}.webp" alt="${names[s[1]]}"><div class="ovl"><span class="tag">⬇ 下載</span><h3>${names[s[1]]}</h3></div></div>`).join("");
})();
</script>'''
make("gallery.html", "infu空間 - INFUCOCO V6", "INFUCOCO 怪美四季桌布，16 張沉浸場景下載。", "gallery", gallery_body, gallery_script, active="gallery")

# ---------- stickers ----------
stickers_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🖼 免費貼圖</span><h2>怪美<span class="rl">貼圖包</span></h2><p class="lead">點一下下載，把怪美療癒帶進聊天室。</p></div>
  <div class="grid g4" id="st-grid"></div>
</div>
</section>
'''
stickers_script = '''
<script>
(function(){const S=["infucoco_crescent_moon_stars","infucoco_glowing_star_fingertip","infucoco_glowing_lantern_dark","infucoco_firefly_jar_night","infucoco_cherry_picnic","infucoco_daisy_spring_walk","infucoco_afterwork_coffee_sidewalk","infucoco_night_door_pet_look","infucoco_door_glove_pet_welcome","infucoco_bridge_night_city","infucoco_edge_open_book_sky","infucoco_first_snow_window"];
const names=["數星星","指尖星光","暖燈籠","瓶中螢火","櫻花野餐","雛菊散步","街角咖啡","夜推門","門口歡迎","夜橋","翻書","初雪"];
document.getElementById("st-grid").innerHTML=S.map((s,i)=>`<div class="card-b reveal d${(i%4)+1}" title="貼圖 ${names[i]}"><img src="./assets/webp/${s}.webp" alt="貼圖 ${names[i]}"><div class="ovl"><span class="tag">⬇ 下載</span><h3>${names[i]}</h3></div></div>`).join("");
})();
</script>'''
make("stickers.html", "貼圖下載 - INFUCOCO V6", "INFUCOCO 怪美療癒貼圖包免費下載。", "stickers", stickers_body, stickers_script, active="stickers")

# ---------- shop ----------
shop_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🛍 周邊商店</span><h2>怪美<span class="rl">周邊</span></h2><p class="lead">把 infucoco 帶回家。</p></div>
  <div class="grid g4" id="sh-grid"></div>
</div>
</section>
'''
shop_script = '''
<script>
(function(){const P=[["抱枕","infucoco_blanket_pet_sit_night","✦ 想窩進去的柔軟",380],["帆布袋","infucoco_night_door_pet_look","✦ 裝得下溫柔",420],["馬克杯","infucoco_afterwork_coffee_sidewalk","✦ 早晨的一杯暖",320],["夜燈","infucoco_glowing_lantern_dark","✦ 陪你入眠的光",520],["筆記本","infucoco_edge_open_book_sky","✦ 寫下心事",260],["鑰匙圈","infucoco_firefly_jar_night","✦ 隨身的小星星",180],["杯墊","infucoco_bench_cherry_petals","✦ 桌上的春天",150],["明信片","infucoco_beach_dawn_waves","✦ 寄給未來的你",120]];
document.getElementById("sh-grid").innerHTML=P.map((p,i)=>`<div class="card-b reveal d${(i%4)+1}"><img src="./assets/webp/${p[1]}.webp" alt="${p[0]}"><div class="ovl"><span class="tag">✦ 周邊</span><h3>${p[0]}</h3><p>${p[2]} · NT$${p[3]}</p></div></div>`).join("");
})();
</script>'''
make("shop.html", "周邊商店 - INFUCOCO V6", "INFUCOCO 怪美療癒周邊，抱枕帆布袋夜燈馬克杯。", "shop", shop_body, shop_script, active="shop")

# ---------- member ----------
member_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">👑 會員</span><h2>成為<span class="rl">怪美居民</span></h2><p class="lead">解鎖更多沉浸場景與專屬貼圖。</p></div>
  <div class="grid g3">
    <div class="card-b reveal" style="display:block;padding:26px"><span class="card-tag">免費</span><h3>旅人</h3><p style="color:var(--soft);margin:10px 0">100 款遊戲 · 每日金句</p><a href="#" class="btn dark" style="width:100%;justify-content:center">免費加入</a></div>
    <div class="card-b reveal d2" style="display:block;padding:26px"><span class="card-tag" style="background:var(--accent);color:#fff">✨ 熱門</span><h3>居民</h3><p style="color:var(--soft);margin:10px 0">NT$99/月 · 全部貼圖下載＋專屬寓言</p><a href="#" class="btn o" style="width:100%;justify-content:center">升級居民</a></div>
    <div class="card-b reveal d3" style="display:block;padding:26px"><span class="card-tag">👑</span><h3>守護者</h3><p style="color:var(--soft);margin:10px 0">NT$299/月 · 限量周邊＋隱藏遊戲</p><a href="#" class="btn dark" style="width:100%;justify-content:center">成為守護者</a></div>
  </div>
</div>
</section>
'''
make("member.html", "會員 - INFUCOCO V6", "INFUCOCO 會員三方案，解鎖沉浸療癒。", "member", member_body, active="member")

# ---------- about ----------
about_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">✦ 關於</span><h2>INFU<span class="sl">COCO</span><span class="rl">是誰</span></h2></div>
  <div class="game-stage" style="padding:34px">
    <div class="grid g2" style="align-items:center">
      <div><img src="./assets/media/infucoco_door_glove_pet_welcome.webp" alt="infucoco 角色" style="border-radius:var(--radius);height:340px;object-fit:cover"></div>
      <div>
        <p style="font-size:1.15rem;margin-bottom:14px"><b style="color:var(--accent)">infucoco</b> 是黑髮雙丸子頭＋紅白橫紋短袖＋藍色吊帶褲的可愛插畫角色。</p>
        <p style="color:var(--soft)">這座「沉浸療癒宇宙」想給疲憊的你一座躲進去的房間：寓言 × 金句 × 100 款遊戲 × 測驗 × 貼圖 × 周邊。每一張場景照片，都是一個可以靜下來的角落。</p>
        <p style="color:var(--soft);margin-top:12px">規劃設計開發：張書欣　📞 0968-222201　💬 LINE 331.today</p>
        <div class="btn-row"><a href="games.html" class="btn o">🎮 開玩</a><a href="quotes.html" class="btn dark">💬 撿金句</a></div>
      </div>
    </div>
  </div>
</div>
</section>
'''
make("about.html", "關於 - INFUCOCO V6", "關於 INFUCOCO 沉浸療癒宇宙與角色。", "index", about_body, active="index")

# ---------- sitemap ----------
sitemap_body = '''
<section class="skew-sec">
<div class="container">
  <div class="section-title"><span class="sec-no">🗺 導覽</span><h2>怪美<span class="rl">網站地圖</span></h2></div>
  <div class="grid g3">
    <div class="card-b reveal" style="display:block;padding:22px"><span class="card-tag">療癒</span><a href="quotes.html" style="display:block;margin:8px 0;font-weight:700">💬 心靈金句</a><a href="stories.html" style="display:block;margin:8px 0;font-weight:700">📖 療癒寓言</a><a href="quiz.html" style="display:block;margin:8px 0;font-weight:700">🔮 心理測驗</a></div>
    <div class="card-b reveal d2" style="display:block;padding:22px"><span class="card-tag">玩樂</span><a href="games.html" style="display:block;margin:8px 0;font-weight:700">🎮 100 款遊戲</a><a href="gallery.html" style="display:block;margin:8px 0;font-weight:700">🌿 infu空間</a><a href="stickers.html" style="display:block;margin:8px 0;font-weight:700">🖼 貼圖下載</a></div>
    <div class="card-b reveal d3" style="display:block;padding:22px"><span class="card-tag">站點</span><a href="shop.html" style="display:block;margin:8px 0;font-weight:700">🛍 周邊商店</a><a href="member.html" style="display:block;margin:8px 0;font-weight:700">👑 會員</a><a href="about.html" style="display:block;margin:8px 0;font-weight:700">✦ 關於</a></div>
  </div>
</div>
</section>
'''
make("sitemap.html", "網站地圖 - INFUCOCO V6", "INFUCOCO 沉浸療癒宇宙網站地圖。", "sitemap", sitemap_body, active="sitemap")

# ---------- fables ----------
def build_fables():
    try:
        sc = io.open(os.path.join(ROOT, "js", "stories.js"), encoding="utf-8").read()
        objs = re.findall(r'\{[^{}]*\}', sc)
        stories = []
        for o in objs:
            def gf(k):
                m = re.search(k + r':"([^"]*)"', o)
                return m.group(1) if m else ""
            if gf("id"):
                stories.append({"id": gf("id"), "title": gf("title"), "img": gf("img"),
                                "tag": gf("tag"), "text": gf("text"), "moral": gf("moral")})
        for s in stories:
            t = s["title"]; im = s["img"]; tg = s["tag"]; tx = s["text"]; mo = s["moral"]
            body = (
'<section class="skew-sec"><div class="container">'
  '<div class="section-title"><span class="sec-no">📖 療癒寓言</span><h2>' + t + '</h2></div>'
  '<div class="game-stage" style="padding:30px;overflow:hidden">'
    '<img src="./assets/webp/' + im + '.webp" alt="' + t + '" style="height:280px;width:100%;object-fit:cover;border-radius:var(--radius)">'
    '<span class="card-tag" style="margin-top:18px">' + tg + '</span>'
    '<p style="line-height:2;margin-top:14px">' + tx + '</p>'
    '<div class="quote-main mt" style="font-size:1.3rem;padding:24px"><span class="mark">💛 </span>' + mo + '</div>'
    '<div class="btn-row center"><a class="btn dark" href="stories.html">📖 全部寓言</a><a class="btn o" href="games.html">🎮 玩一場</a></div>'
  '</div>'
'</div></section>'
)
            make("fable-" + s["id"] + ".html", t + " - INFUCOCO V6", t + "：療癒寓言。", "stories", body, active="stories")
        print("FABLES", len(stories))
    except Exception as e:
        print("fables 錯誤:", e)

build_fables()
print("V6 READY")
