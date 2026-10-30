/* ============================================================
   infucoco電玩追追追追｜電玩無止境 — 全站 JS
   ============================================================ */

/* ===== MegaMenu Toggle ===== */
(function(){
  var mt = document.getElementById('megaToggle');
  var mp = document.getElementById('megaPanel');
  if(!mt || !mp) return;
  mt.addEventListener('click', function(){
    mp.classList.toggle('open');
    mt.classList.toggle('open');
  });
  // 手機：megamenu 內快速導覽點擊後自動關閉面板
  document.querySelectorAll('.mega-quick a').forEach(function(a){
    a.addEventListener('click', function(){
      mp.classList.remove('open');
      mt.classList.remove('open');
    });
  });
})();

/* ===== Industry Chain Data ===== */
var CHAIN = [
  {
    cls:'c-up', name:'上游硬體層', en:'Upstream Hardware',
    items:['晶片處理器','遊戲主機','周邊配備','顯示器／投影']
  },
  {
    cls:'c-mid', name:'中游內容層', en:'Midstream Content',
    items:['遊戲研發','遊戲發行','數位平台','行動遊戲']
  },
  {
    cls:'c-down', name:'下游通路層', en:'Downstream Distribution',
    items:['電競館／網咖','遊戲專賣店','主題樂園','二手／拍賣平台']
  },
  {
    cls:'c-eco', name:'生態支援層', en:'Ecosystem Support',
    items:['電競賽事','實況串流','支付／儲值','法規／教育']
  }
];

/* ===== 最新遊戲 ===== */
var WORKS = [
  {icon:'💥', cls:'ph1', title:'打磚塊（進階）', href:'games/esports-oriented-games/brick-breaker-advanced.html', tags:['街機','經典'], desc:'經典打磚塊進階版，全壘打連擊挑戰高分。'},
  {icon:'💣', cls:'ph2', title:'踩地雷（進階）', href:'games/esports-oriented-games/minesweeper-advanced-arcade.html', tags:['益智','經典'], desc:'經典踩地雷進階版，邏輯推理的層層考驗。'},
  {icon:'🏰', cls:'ph3', title:'塔防戰線', href:'games/subscription-game-service/tower-defense-line.html', tags:['策略','塔防'], desc:'TOWERLINES — 部署防線，抵禦一波波攻勢。'},
  {icon:'🐍', cls:'ph4', title:'貪吃蛇（進階）', href:'games/retail-boxed-games/snake-advanced-arena.html', tags:['街機','進階'], desc:'經典貪吃蛇進階版，節奏更快、變化更多。'},
  {icon:'🔢', cls:'ph5', title:'2048（進階）', href:'games/free-to-play/2048-advanced-mode.html', tags:['益智','進階'], desc:'數字合併經典，進階模式考驗你的策略。'},
  {icon:'🧱', cls:'ph6', title:'俄羅斯方塊（進階）', href:'games/free-to-play/tetris-advanced-blocks.html', tags:['益智','進階'], desc:'經典方塊進階版，挑戰更高消除分數。'},
  {icon:'🚀', cls:'ph7', title:'太空射擊（進階）', href:'games/retail-boxed-games/space-shooter-advanced.html', tags:['街機','進階'], desc:'太空戰機進階版，火力全開迎戰敵艦。'},
  {icon:'🏃', cls:'ph8', title:'跑酷跳躍（進階）', href:'games/retail-boxed-games/endless-runner-advanced.html', tags:['街機','進階'], desc:'無盡跑酷進階版，考驗反應與節奏。'},
  {icon:'🃏', cls:'ph9', title:'記憶配對（進階）', href:'games/indie-developed-games/memory-match-advanced.html', tags:['記憶','進階'], desc:'翻牌記憶進階版，鍛鍊你的短期記憶。'},
  {icon:'🔢', cls:'ph10', title:'數獨（進階）', href:'games/free-to-play/sudoku-advanced-puzzle.html', tags:['益智','進階'], desc:'數獨進階版，邏輯思維的終極考驗。'}
];

/* ===== Render Industry Chain ===== */
(function(){
  var el = document.getElementById('chainGrid');
  if(!el) return;
  el.innerHTML = CHAIN.map(function(c){
    return '<div class="chain-card reveal '+c.cls+'">'+
      '<h4>'+c.name+'</h4>'+
      '<div class="en">'+c.en+'</div>'+
      '<ul class="sub-list">'+
        c.items.map(function(it){return '<li>'+it+'</li>'}).join('')+
      '</ul></div>';
  }).join('');
})();

/* ===== Render Works Wall ===== */
(function(){
  var el = document.getElementById('worksGrid');
  if(!el) return;
  el.innerHTML = WORKS.map(function(w){
    return '<a class="work-card reveal" href="'+w.href+'">'+
      '<div class="work-inner">'+
        '<div class="work-face work-front">'+
          '<div class="ph '+w.cls+'"></div>'+
          '<div class="wc-label">'+
            '<h4>'+w.title+'</h4>'+
            '<div class="tags">'+w.tags.map(function(t,j){
              return '<span class="tag'+(j===1?' v':'')+'">'+t+'</span>';
            }).join('')+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="work-face work-back">'+
          '<h4>'+w.title+'</h4>'+
          '<p>'+w.desc+'</p>'+
          '<div class="tags">'+w.tags.map(function(t,j){
            return '<span class="tag'+(j===1?' v':'')+'">'+t+'</span>';
          }).join('')+'</div>'+
        '</div>'+
      '</div>'+
    '</a>';
  }).join('');
})();

/* ===== CountUp Animation ===== */
function countUp(el){
  var target = +el.dataset.count;
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches){
    el.textContent = target; return;
  }
  var t0=null, dur=1400;
  function step(ts){
    if(!t0) t0=ts;
    var p=Math.min((ts-t0)/dur,1);
    var e=1-Math.pow(1-p,3);
    el.textContent = Math.round(target*e);
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ===== Reveal on Scroll ===== */
(function(){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        if(e.target.hasAttribute('data-count')) countUp(e.target);
        io.unobserve(e.target);
      }
    });
  },{threshold:.15});
  // Observe after dynamic content rendered
  setTimeout(function(){
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  },50);
})();

/* Hero KPI immediate count */
window.addEventListener('load', function(){
  setTimeout(function(){
    document.querySelectorAll('.kpi-num[data-count]').forEach(countUp);
  },300);
});

/* ===== Treemap Playground ===== */
var GAME_CATS = [
  {t:"買斷製品", c:"#e6354a", bg:"arcade-action-arena.webp", g:[
    ["retail-boxed-games/snake-classic-arcade.html","🐍","貪吃蛇"],["retail-boxed-games/snake-advanced-arena.html","🐍","貪吃蛇(進)"],
    ["retail-boxed-games/space-war-arcade.html","🚀","太空大戰"],["retail-boxed-games/space-shooter-classic.html","🚀","太空射擊"],["retail-boxed-games/space-shooter-advanced.html","🚀","太空射擊(進)"],
    ["retail-boxed-games/interstellar-shooter-arcade.html","👾","星際射手"],["retail-boxed-games/dodge-meteor-arcade.html","☄️","躲隕石"],
    ["retail-boxed-games/extreme-jump-arcade.html","🦘","極限跳躍"],["retail-boxed-games/endless-runner-classic.html","🏃","無盡跑酷"],["retail-boxed-games/parkour-jump-runner.html","🏃","跑酷跳躍"],["retail-boxed-games/endless-runner-advanced.html","🏃","跑酷跳躍(進)"],
    ["retail-boxed-games/rocket-racer-speed.html","🏎️","火箭賽車"],["retail-boxed-games/pinball-table-classic.html","🔮","彈珠台"],
    ["retail-boxed-games/flappy-flight-classic.html","🐤","Flappy飛行"],["retail-boxed-games/flappy-bird-advanced.html","🐤","笨鳥先飛"],
    ["retail-boxed-games/stealth-master-arcade.html","🥷","潛行大師"],["retail-boxed-games/bounce-ball-arcade.html","🟡","跳跳彈"],
    ["retail-boxed-games/catch-coin-arcade.html","🪙","接金幣"],["retail-boxed-games/catch-water-drops.html","💧","接水滴"],["retail-boxed-games/catch-fruit-arcade.html","🍎","接水果"],["retail-boxed-games/catch-ball-juggle.html","🤹","接球雜耍"]
  ]},
  {t:"免費 F2P", c:"#f1c40f", bg:"puzzle-block-stack.webp", g:[
    ["free-to-play/2048-classic-puzzle.html","🔢","2048"],["free-to-play/2048-legacy-blocks.html","🔢","2048(舊)"],["free-to-play/2048-advanced-mode.html","🔢","2048(進)"],
    ["free-to-play/number-slide-puzzle.html","🧩","數字拼圖"],["free-to-play/sliding-puzzle-classic.html","🧩","滑動拼圖"],["free-to-play/sliding-tile-puzzle.html","🧩","拼圖滑塊"],
    ["free-to-play/block-stack-classic.html","🧱","方塊疊疊樂"],["free-to-play/tetris-classic-blocks.html","🧱","俄羅斯方塊"],["free-to-play/tetris-advanced-blocks.html","🧱","俄羅斯方塊(進)"],["free-to-play/block-stack-retro.html","🧱","疊疊樂"],
    ["free-to-play/sudoku-classic-puzzle.html","🔢","數獨"],["free-to-play/sudoku-advanced-puzzle.html","🔢","數獨(進)"],
    ["free-to-play/sokoban-box-puzzle.html","📦","倉庫番"],["free-to-play/klotski-slide-puzzle.html","🚗","華容道"]
  ]},
  {t:"訂閱制服務", c:"#3ddc84", bg:"chess-strategy-board.webp", g:[
    ["subscription-game-service/tic-tac-toe-ai.html","⭕","井字棋AI"],["subscription-game-service/tic-tac-toe-classic.html","⭕","井字棋"],
    ["subscription-game-service/gomoku-five-row.html","⚪","五子棋"],["subscription-game-service/gomoku-vs-ai.html","🤖","五子棋AI"],["subscription-game-service/connect-four-game.html","⚪","四子棋"],
    ["subscription-game-service/othello-reversi-board.html","⚫","黑白棋"],["subscription-game-service/tower-defense-line.html","🏰","塔防戰線"]
  ]},
  {t:"網路營運", c:"#ff8a5a", bg:"reaction-speed-limit.webp", g:[
    ["online-operated-games/reaction-test-classic.html","⚡","反應測試"],["online-operated-games/reaction-speed-challenge.html","⚡","極速反應"],["online-operated-games/traffic-light-game.html","🚦","紅綠燈"],
    ["online-operated-games/whack-mole-classic.html","🐹","打地鼠"],["online-operated-games/whack-mole-retro.html","🐹","打地鼠(舊)"],
    ["online-operated-games/swat-mosquito-game.html","🦟","拍蚊子"],["online-operated-games/target-practice-range.html","🎯","射靶練習"],["online-operated-games/archery-target-challenge.html","🏹","射箭"]
  ]},
  {t:"獨立開發", c:"#7c9bff", bg:"memory-match-cards.webp", g:[
    ["indie-developed-games/memory-match-classic.html","🃏","記憶翻牌"],["indie-developed-games/memory-match-advanced.html","🃏","記憶配對(進)"],
    ["indie-developed-games/memory-sequence-challenge.html","🧠","記憶序列"],
    ["indie-developed-games/simon-says-classic.html","🎹","西蒙記憶"],["indie-developed-games/simon-rhythm-arcade.html","🎹","Simon節奏"]
  ]},
  {t:"IP授權改編", c:"#b07cff", bg:"eliminate-link-chain.webp", g:[
    ["ip-licensed-games/match-three-classic.html","🍬","消消樂"],["ip-licensed-games/jewel-match-quest.html","🍬","三消消消樂"],["ip-licensed-games/bubble-shooter-arcade.html","🫧","泡泡射手"],
    ["ip-licensed-games/pair-link-arcade.html","🔗","連連看"],["ip-licensed-games/mahjong-link-match.html","🀄","麻將連連看"]
  ]},
  {t:"廣告變現", c:"#ffd76a", bg:"table-luck-roll.webp", g:[
    ["ad-monetized-games/dice-high-low.html","🎲","骰子比大小"],["ad-monetized-games/dice-combo-roll.html","🎲","骰子組合"],
    ["ad-monetized-games/blackjack-card-game.html","🃏","21點"],["ad-monetized-games/blackjack-alternate-play.html","🃏","廿一點"],
    ["ad-monetized-games/lucky-wheel-spin.html","🎡","幸運輪盤"],["ad-monetized-games/rock-paper-scissors.html","✊","猜拳對戰"]
  ]},
  {t:"電競導向", c:"#4fc3f7", bg:"classic-arcade-cabinet.webp", g:[
    ["esports-oriented-games/brick-breaker-classic.html","🧱","打磚塊"],["esports-oriented-games/brick-breaker-advanced.html","🧱","打磚塊(進)"],
    ["esports-oriented-games/minesweeper-classic-arcade.html","💣","踩地雷"],["esports-oriented-games/minesweeper-advanced-arcade.html","💣","踩地雷(進)"],["esports-oriented-games/minesweeper-retro-classic.html","💣","掃雷"],
    ["esports-oriented-games/fishing-catch-game.html","🎣","釣魚"],["esports-oriented-games/miner-dig-dash.html","⛏️","鑽礦工"]
  ]},
  {t:"實體周邊", c:"#3ddc84", bg:"puzzle-adventure-quest.webp", g:[
    ["physical-merch-games/maze-home-return.html","🏠","迷宮回家路"],["physical-merch-games/maze-escape-adventure.html","🏃","迷宮逃脫"],
    ["physical-merch-games/infucoco-open-wild.html","🏞️","Infucoco荒野3D"]
  ]},
  {t:"企業教育", c:"#ff6b9a", bg:"typing-math-speed.webp", g:[
    ["corporate-education-games/math-speed-dash.html","➕","計算衝刺"],["corporate-education-games/mental-math-master.html","🧮","心算大師"],["corporate-education-games/mental-arithmetic-challenge.html","🧮","心算挑戰"],
    ["corporate-education-games/typing-speed-race.html","⌨️","打字衝刺"],["corporate-education-games/typing-practice-train.html","⌨️","打字訓練"]
  ]}
];

(function(){
  var tm = document.getElementById('treemap');
  var menu = document.getElementById('gameMenu');
  var grid = document.getElementById('gameGrid');
  if(!tm || !menu) return;

  // Render game nav（自動版：Dropdown(桌面) + Tag列(手機)，由 GAME_CATS 單一來源生成）
  var links = GAME_CATS.map(function(c,i){
    return '<a onclick="showGameCat('+i+')">'+c.t+'</a>';
  }).join('');
  menu.innerHTML =
    '<div class="game-dropdown">'+
      '<button class="dropdown-trigger" type="button">遊戲分類 ▾</button>'+
      '<div class="dropdown-menu">'+links+'</div>'+
    '</div>'+
    '<div class="game-tag-list">'+links+'</div>';
  var gd = menu.querySelector('.game-dropdown');
  var trigger = menu.querySelector('.dropdown-trigger');
  trigger.addEventListener('click', function(e){
    e.stopPropagation();
    gd.classList.toggle('open');
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.game-dropdown')) gd.classList.remove('open');
  });

  // Squarify algorithm
  function squarify(items,x,y,w,h,out){
    if(!items.length) return;
    if(items.length===1){ out.push({it:items[0],x:x,y:y,w:w,h:h}); return; }
    var total=0; for(var k=0;k<items.length;k++) total+=items[k].v;
    var acc=0, idx=1;
    for(var i=0;i<items.length;i++){ acc+=items[i].v; if(acc/total>0.45){ idx=i+1; break; } }
    if(idx>=items.length) idx=items.length-1;
    var left=items.slice(0,idx), right=items.slice(idx);
    var lv=0; for(var j=0;j<left.length;j++) lv+=left[j].v;
    if(w>=h){
      var cw=w*lv/total;
      squarify(left,x,y,cw,h,out);
      squarify(right,x+cw,y,w-cw,h,out);
    } else {
      var ch=h*lv/total;
      squarify(left,x,y,w,ch,out);
      squarify(right,x,y+ch,w,h-ch,out);
    }
  }

  // Render treemap
  function renderTreemap(){
    tm.innerHTML='';
    var W=tm.clientWidth||1000, H=tm.clientHeight||420;
    var items=GAME_CATS.map(function(c,i){ return {i:i, v:c.g.length}; });
    var out=[];
    squarify(items,0,0,W,H,out);
    out.forEach(function(r){
      var c=GAME_CATS[r.it.i];
      var d=document.createElement('div');
      d.className='tile';
      d.style.left=r.x+'px'; d.style.top=r.y+'px';
      d.style.width=r.w+'px'; d.style.height=r.h+'px';
      d.style.background='linear-gradient(135deg,'+c.c+'22,'+c.c+'44)';
      d.innerHTML='<div class="t">'+c.t+'</div><div class="n">'+c.g.length+' 款</div>';
      if(c.bg){
        d.style.backgroundImage='url("assets/images/'+c.bg+'")';
        d.style.backgroundSize='cover';
        d.style.backgroundPosition='center';
      }
      d.onclick=function(){
        var tiles=tm.querySelectorAll('.tile');
        for(var i2=0;i2<tiles.length;i2++) tiles[i2].classList.remove('is-active');
        d.classList.add('is-active');
        showGameCat(r.it.i);
      };
      tm.appendChild(d);
    });
  }

  window.showGameCat = function(i, noScroll){
    var c=GAME_CATS[i];
    var html='<h2>'+c.t+' <small style="color:var(--text-mute);font-size:12px">'+c.g.length+' 款</small></h2><div class="grid">';
    c.g.forEach(function(g){
      html+='<a class="card" href="games/'+g[0]+'"><div class="inner">'+
        '<div class="face front"><span class="em">'+g[1]+'</span><span class="nm">'+g[2]+'</span></div>'+
        '<div class="face back"><span class="nm">'+g[2]+'</span><span class="go">▶ 開玩</span></div>'+
      '</div></a>';
    });
    html+='</div>';
    grid.innerHTML=html;
    if(!noScroll) grid.scrollIntoView({behavior:'smooth',block:'nearest'});
    var tr=menu.querySelector('.dropdown-trigger');
    if(tr) tr.textContent=c.t+' ▾';
    if(gd) gd.classList.remove('open');
  };

  // 進入頁面即載入第一個分類的遊戲
  showGameCat(0, true);

  window.addEventListener('load', renderTreemap);
  window.addEventListener('resize', renderTreemap);
  renderTreemap();
})();

/* ===== 浮動式站內導覽（FAB 點擊展開，2026-10-24） ===== */
(function(){
  var nav=document.getElementById('floatNav'), fab=document.getElementById('fnFab');
  if(!nav||!fab) return;
  function close(){ nav.classList.remove('open'); fab.setAttribute('aria-expanded','false'); }
  fab.addEventListener('click', function(e){
    e.stopPropagation();
    var open=nav.classList.toggle('open');
    fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', function(e){ if(!nav.contains(e.target)) close(); });
  nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
})();

/* ===== News Feed ===== */
var NEWS_CATS = [
  {k:"market",t:"市場脈動",en:"MARKET",c:"#22d3ee"},
  {k:"dev",t:"開發與AI",en:"DEV & AI",c:"#2ee6a8"},
  {k:"platform",t:"平台發行",en:"PLATFORM",c:"#ffdf4d"},
  {k:"hardware",t:"硬體裝置",en:"HARDWARE",c:"#ff7a2f"},
  {k:"cloud",t:"雲端串流",en:"CLOUD",c:"#a78bfa"},
  {k:"esports",t:"電競賽事",en:"ESPORTS",c:"#ff4d6d"},
  {k:"taiwan",t:"台灣產業",en:"TAIWAN",c:"#4dd4c7"},
  {k:"finance",t:"資本財報",en:"FINANCE",c:"#8f9cb8"}
];
var catColor = function(k){ for(var i=0;i<NEWS_CATS.length;i++) if(NEWS_CATS[i].k===k) return NEWS_CATS[i].c; return '#22d3ee'; };
var catName = function(k){ for(var i=0;i<NEWS_CATS.length;i++) if(NEWS_CATS[i].k===k) return NEWS_CATS[i].t; return k; };

var NEWS_DATA = [
  {c:"market",f:1,t:"Newzoo：2026 全球遊戲市場上看 2,139 億美元，年增 6.1%",s:"Newzoo 預測 2026 年全球遊戲營收達 2,139 億美元、年增 6.1%；玩家成長與跨平台支出是主要推力。",src:"Newzoo",u:"https://newzoo.com/",d:"2026/09"},
  {c:"market",t:"全球遊戲營收 2025 首度突破 2,000 億美元",s:"Newzoo 統計，2025 年全球遊戲市場跨越 2,000 億美元門檻；2028 年上看 2,344 億美元。",src:"Newzoo",u:"https://newzoo.com/",d:"2026/06"},
  {c:"market",t:"GTA VI 延期，2025 年市場成長僅約 1%",s:"PwC 指出 GTA VI 從 2025 延至 2026，拖累 2025 全年成長率僅約 1%；2026 年預期回升至 2.2%。",src:"PwC",u:"https://www.pwc.com/",d:"2025/06"},
  {c:"market",t:"中國 2025 發放國產遊戲版號 1,676 款，年增 28.33%",s:"2025 年中國累計發放國產網路遊戲版號 1,676 款，較 2024 年成長 28.33%。",src:"經濟日報",u:"http://www.ce.cn/",d:"2025/12"},
  {c:"market",t:"中國自研遊戲出海，2025 海外收入上看 200 億美元",s:"中國自主研發遊戲海外收入突破 200 億美元，出海從產品輸出轉向生態建構。",src:"新華網",u:"http://www.news.cn/",d:"2025/08"},
  {c:"dev",f:1,t:"Ubisoft 展示生成式 AI 遊戲原型「Teammates」",s:"Ubisoft 展示首個可遊玩的生成式 AI 研究項目 Teammates，CEO 稱其等同當年轉向 3D 的革命。",src:"GameSpot",u:"https://www.gamespot.com/",d:"2025/11"},
  {c:"dev",t:"騰訊混元遊戲視覺生成平台，美術效率提升數十倍",s:"騰訊發布混元遊戲視覺生成平台，一句提示詞即可生成高品質素材與概念草案。",src:"中國高新技術產業導報",u:"http://paper.chinahightech.com/",d:"2025/07"},
  {c:"dev",t:"AWS 推出 Agentic Arcade，數分鐘打造可玩遊戲原型",s:"AWS re:Invent 2025 展示 Agentic Arcade，AI 數分鐘內組裝完整可玩瀏覽器遊戲。",src:"AWS",u:"https://aws.amazon.com/",d:"2025/11"},
  {c:"dev",t:"2025 獨立／AA 遊戲主導銷售榜，AAA 高成本承壓",s:"獨立與 AA 級遊戲表現亮眼，AAA 大廠在高成本與定價壓力下普遍承壓。",src:"Algoryte",u:"https://www.algoryte.com/",d:"2026/01"},
  {c:"platform",t:"遊戲版號多端並進，廠商跨行動、PC、主機申請",s:"愈來愈多中國遊戲廠商申請版號時同時申請客戶端／主機端，跨平台發行白熱化。",src:"經濟日報",u:"http://www.ce.cn/",d:"2025/12"},
  {c:"platform",t:"傳奇網路：風之國度全球版 2025/7 推出",s:"傳奇網路 2025 H2 法說會揭露 PC／手遊研發與 IP 授權布局。",src:"傳奇網路",u:"https://www.x-legend.tw/",d:"2025/11"},
  {c:"hardware",f:1,t:"Switch 2 上市 4 天賣出 350 萬台",s:"Nintendo Switch 2 於 2025 年 6 月 5 日上市，前四天全球賣出超過 350 萬台。",src:"SQ Magazine",u:"https://sqmagazine.co.uk/",d:"2025/06"},
  {c:"hardware",t:"Switch 2 累計出貨 2,368 萬台",s:"截至 2026 年 6 月 30 日，Switch 2 sell-in 累計達 2,368 萬台。",src:"coopboardgames",u:"https://coopboardgames.com/",d:"2026/09"},
  {c:"cloud",f:1,t:"PlayStation Portal 雲端串流正式上線",s:"2025/11/5 起，PS Plus Premium 用戶可於 Portal 直接串流數位版 PS5 遊戲。",src:"PlayStation.Blog",u:"https://blog.playstation.com/",d:"2025/11"},
  {c:"cloud",t:"Xbox Cloud Gaming 使用量 +45%，拓展至 29 國",s:"Xbox Cloud Gaming 搭配 Game Pass 使用量年增 45%，服務拓展至含印度在內的 29 國。",src:"Xbox Wire",u:"https://news.xbox.com/",d:"2025/11"},
  {c:"esports",f:1,t:"Riot 在台北大同區開設《英雄聯盟》LCP 電競館",s:"Riot Games 於台北大同區正式開設 LCP 太平洋冠軍聯賽電競場館。",src:"Esports News",u:"https://beritae-sports.com/",d:"2025/04"},
  {c:"esports",t:"台灣電競傳奇 Karsa 宣布退休，結束 11 年職業生涯",s:"台灣《英雄聯盟》電競傳奇 Karsa 宣布退休，曾是閃電狼王朝核心成員。",src:"TVBS",u:"https://t.media/",d:"2025/12"},
  {c:"taiwan",f:1,t:"台北電玩展 2025 四天近 37 萬人次創新高",s:"2025 台北國際電玩展四天吸引近 37 萬人次，B2B 展區來自 43 國 1,800 位商務人士。",src:"台北電玩展",u:"https://twg.tca.org.tw/",d:"2026/01"},
  {c:"taiwan",t:"智冠 2025 年報：營收 65.18 億、EPS 7.93 元創十年新高",s:"智冠科技全年合併營收 65.18 億元、淨利 11.88 億元，每股純益 7.93 元寫下十年新高。",src:"知新聞",u:"https://www.knews.com.tw/",d:"2026/03"},
  {c:"finance",f:1,t:"A股遊戲 2025：總營收 +22.12%、淨利 +115.45%",s:"2025 年 A 股遊戲上市公司總營收年增 22.12%、淨利潤大增 115.45%，迎來近年最好表現。",src:"南方都市報",u:"http://www.oeeee.com/",d:"2026/05"},
  {c:"finance",t:"世紀華通 2025 營收 379 億人民幣，年增 67.55%",s:"世紀華通全年營收 378.98 億元人民幣，歸母淨利潤 56.05 億元、年增 362%。",src:"新華網",u:"http://www.xinhuanet.com/",d:"2026/04"},
  {c:"finance",t:"巨人網路 2025 營收 50.47 億人民幣，年增 72.69%",s:"巨人網路全年營收 50.47 億元人民幣，為近年成長最亮眼的 A 股遊戲公司之一。",src:"21世紀經濟報導",u:"http://www.21jingji.com/",d:"2026/04"}
];

var activeNewsCat = 'all';
var newsPage = 1;
var PER_PAGE = 10;

/* Render news category pills */
(function(){
  var el = document.getElementById('newsCats');
  if(!el) return;
  var html = '<button class="cat-btn active" data-c="all">全部 ('+NEWS_DATA.length+')</button>';
  NEWS_CATS.forEach(function(c){
    var n = NEWS_DATA.filter(function(x){return x.c===c.k;}).length;
    html += '<button class="cat-btn" data-c="'+c.k+'">'+c.t+' ('+n+')</button>';
  });
  el.innerHTML = html;
  el.addEventListener('click', function(e){
    var b = e.target.closest('.cat-btn'); if(!b) return;
    activeNewsCat = b.getAttribute('data-c');
    newsPage = 1;
    el.querySelectorAll('.cat-btn').forEach(function(x){x.classList.remove('active')});
    b.classList.add('active');
    renderNews();
  });
})();

/* Render news feed with pagination */
function renderNews(){
  var feed = document.getElementById('newsFeed');
  var pag = document.getElementById('newsPagination');
  if(!feed) return;
  var q = (document.getElementById('newsSearch')||{}).value || '';
  q = q.trim().toLowerCase();
  var list = NEWS_DATA.filter(function(n){
    return (activeNewsCat==='all'||n.c===activeNewsCat) &&
      (!q || (n.t+' '+n.s+' '+n.src+' '+catName(n.c)).toLowerCase().indexOf(q)>-1);
  });
  var count = document.getElementById('newsCount');
  if(count) count.textContent = list.length+' 則新聞';
  if(!list.length){
    feed.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text-mute)">沒有符合的新聞</div>';
    if(pag) pag.innerHTML='';
    return;
  }
  var totalPages = Math.ceil(list.length / PER_PAGE);
  if(newsPage > totalPages) newsPage = totalPages;
  var start = (newsPage-1) * PER_PAGE;
  var pageList = list.slice(start, start+PER_PAGE);
  var html = '';
  pageList.forEach(function(n){
    var col = catColor(n.c);
    html += '<article class="news-card" style="--kc:'+col+'">'+
      '<div class="row1"><span class="ncat" style="background:'+col+'">'+catName(n.c)+'</span>'+
      '<span class="nsrc">'+n.src+'</span><span class="ndate">'+n.d+'</span></div>'+
      '<h4>'+n.t+'</h4><p>'+n.s+'</p>'+
      '<a class="more" target="_blank" rel="noopener" href="'+n.u+'">來源連結 →</a>'+
      '</article>';
  });
  feed.innerHTML = html;
  // Pagination
  if(pag && totalPages > 1){
    var ph = '<button '+(newsPage<=1?'disabled':'')+' data-p="'+(newsPage-1)+'">‹ 上一頁</button>';
    ph += '<span class="info">第 '+newsPage+' / '+totalPages+' 頁</span>';
    ph += '<button '+(newsPage>=totalPages?'disabled':'')+' data-p="'+(newsPage+1)+'">下一頁 ›</button>';
    pag.innerHTML = ph;
    pag.querySelectorAll('button[data-p]').forEach(function(b){
      b.addEventListener('click', function(){
        newsPage = +this.getAttribute('data-p');
        renderNews();
      });
    });
  } else if(pag){
    pag.innerHTML = '';
  }
}
document.addEventListener('DOMContentLoaded', function(){
  var s = document.getElementById('newsSearch');
  if(s) s.addEventListener('input', function(){ newsPage=1; renderNews(); });
  renderNews();
});

/* Render market dashboard */
(function(){
  var el = document.getElementById('dashGrid');
  if(!el) return;
  var kpis = [
    {t:"全球市場 2026",v:"2,139",u:"億美元",s:"Newzoo 預測，年增 6.1%",c:"#22d3ee"},
    {t:"2028 市場預測",v:"2,344",u:"億美元",s:"複合成長率 5.1%",c:"#2ee6a8"},
    {t:"A股 2025 淨利",v:"+115",u:"%",s:"年增，頭部三占五成",c:"#2ee6a8"},
    {t:"Switch 2 累計",v:"2,368",u:"萬台",s:"截至 2026/6/30",c:"#ff7a2f"},
    {t:"中國版號 2025",v:"1,676",u:"款",s:"年增 28.33%",c:"#ffdf4d"},
    {t:"智冠 EPS",v:"7.93",u:"元",s:"創十年新高",c:"#4dd4c7"},
    {t:"台北電玩展",v:"37",u:"萬人次",s:"四天到場",c:"#a78bfa"},
    {t:"雲端遊戲市場",v:"287",u:"億美元",s:"IDC，CAGR 31.4%",c:"#ff4d6d"}
  ];
  el.innerHTML = kpis.map(function(k){
    return '<div class="dash-kpi" style="--kc:'+k.c+'"><div class="t">'+k.t+'</div>'+
      '<div class="v">'+k.v+'<span class="u"> '+k.u+'</span></div>'+
      '<div class="s">'+k.s+'</div></div>';
  }).join('');
})();

/* Render ecosystem chain (accordion) */
(function(){
  var el = document.getElementById('ecoChain');
  if(!el) return;
  var stages = [
    {c:"#22d3ee",icon:"🔧",name:"內容與開發",en:"CONTENT & DEV",nodes:["遊戲開發商","獨立團隊／AA","遊戲引擎","生成式AI工具","美術與劇本"]},
    {c:"#2ee6a8",icon:"📦",name:"發行與通路",en:"PUBLISH & DIST",nodes:["發行商／代理","版號合規","金流支付","在地化行銷"]},
    {c:"#ffdf4d",icon:"🎮",name:"平台與硬體",en:"PLATFORM & HW",nodes:["數位商店","主機 N/S/X","PC／行動裝置","雲端串流"]},
    {c:"#ff7a2f",icon:"💰",name:"變現與生態",en:"MONETIZE",nodes:["電競賽事","遊戲直播","VTuber／創作者","廣告／IP授權"]},
    {c:"#a78bfa",icon:"👥",name:"玩家需求",en:"PLAYER DEMAND",nodes:["玩家社群","消費與課金","遊玩數據回饋","內容再創作"]}
  ];
  var html = '<div class="eco-accordion">';
  stages.forEach(function(s,i){
    html += '<div class="eco-item'+(i===0?' open':'')+'">'+
      '<div class="eco-head" data-idx="'+i+'">'+
        '<span class="ico" style="background:'+s.c+'22;color:'+s.c+';border:1px solid '+s.c+'">'+s.icon+'</span>'+
        '<div class="info"><div class="name">'+s.name+'</div><div class="en">'+s.en+'</div></div>'+
        '<span class="arrow">▾</span>'+
      '</div>'+
      '<div class="eco-body"><div class="eco-body-inner">'+
        '<div class="nodes">'+s.nodes.map(function(n){return '<span class="nd">'+n+'</span>';}).join('')+'</div>'+
      '</div></div>'+
    '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
  // Accordion click
  el.querySelectorAll('.eco-head').forEach(function(h){
    h.addEventListener('click', function(){
      this.parentElement.classList.toggle('open');
    });
  });
})();

/* ===== Hero Ripple Text ===== */
(function(){
  var el = document.getElementById('rippleBrand');
  if(!el) return;
  var text = el.textContent;
  el.textContent = '';
  for(var i=0;i<text.length;i++){
    var ch = document.createElement('span');
    ch.textContent = text[i];
    ch.style.animationDelay = (i*0.12)+'s';
    el.appendChild(ch);
  }
})();

/* ===== Render Eco Tree（八大分類，由 ECO_TAXONOMY 驅動） ===== */
(function(){
  var el = document.getElementById('ecoTree');
  if(!el || typeof ECO_TAXONOMY === 'undefined') return;

  el.innerHTML = ECO_TAXONOMY.map(function(l1, i){
    // Count total L3 nodes under this L1
    var l3count = 0;
    l1.children.forEach(function(l2){ l3count += l2.children.length; });

    var t2html = l1.children.map(function(l2){
      var t3 = l2.children.map(function(l3){
        return '<span class="eco-t3">'+l3.name+'</span>';
      }).join('');
      return '<div class="eco-t2">'+
        '<div class="eco-t2-title">'+
          l2.name + '<span class="en">'+l2.en+'</span>'+
        '</div>'+
        '<div class="eco-t3-list">'+t3+'</div>'+
      '</div>';
    }).join('');

    return '<div class="eco-t1" data-id="'+l1.id+'">'+
      '<div class="eco-t1-head">'+
        '<div class="info">'+
          '<div class="name">'+l1.name+'</div>'+
          '<div class="en">'+l1.en+'</div>'+
        '</div>'+
        '<span class="count">'+l1.children.length+' 子類 / '+l3count+' 項</span>'+
        '<span class="arrow">▾</span>'+
      '</div>'+
      '<div class="eco-t1-body">'+
        '<div class="eco-t2-grid">'+t2html+'</div>'+
      '</div>'+
    '</div>';
  }).join('');

  // Accordion toggle
  el.querySelectorAll('.eco-t1-head').forEach(function(h){
    h.addEventListener('click', function(){
      this.parentElement.classList.toggle('open');
    });
  });
})();

/* ===== Dynamic Linking: MegaMenu ↔ 生態地圖 Eco Tree ===== */
(function(){
  // Global: expand eco tree by L1 id and scroll to it
  window.expandEcoTree = function(ecoId){
    var ecoSection = document.getElementById('ecoTree');
    if(!ecoSection) return;
    var target = ecoSection.querySelector('.eco-t1[data-id="'+ecoId+'"]');
    if(!target) return;
    // Close all, then open target
    ecoSection.querySelectorAll('.eco-t1').forEach(function(t){ t.classList.remove('open'); });
    target.classList.add('open');
    setTimeout(function(){
      target.scrollIntoView({behavior:'smooth', block:'center'});
      target.classList.add('flash');
      setTimeout(function(){ target.classList.remove('flash'); }, 1300);
    }, 100);
  };

  function closeMega(){
    var mp = document.getElementById('megaPanel');
    var mt = document.getElementById('megaToggle');
    if(mp) mp.classList.remove('open');
    if(mt) mt.classList.remove('open');
  }

  // 1. MegaMenu / 內嵌導覽：欄標題 → 展開對應鏈節；內頁無生態樹 → 導回首頁並展開
  function depthBase(){
    var a = document.querySelector('.mega-col a[data-eco]');
    var href = a ? a.getAttribute('href') : 'index.html#chain';
    return href.replace(/\?[^#]*#.*$/, '').replace(/#.*$/, '');
  }
  document.querySelectorAll('.mega-col h4[data-eco]').forEach(function(h4){
    h4.style.cursor = 'pointer';
    h4.addEventListener('click', function(){
      var ecoId = this.getAttribute('data-eco');
      closeMega();
      if(document.getElementById('ecoTree')){ expandEcoTree(ecoId); return; }
      location.href = depthBase() + '?eco=' + encodeURIComponent(ecoId) + '#chain';
    });
  });

  // 2. MegaMenu / 內嵌導覽：子類連結 → 本頁展開；內頁 → 導回首頁生態地圖並展開
  document.querySelectorAll('.mega-col li a[data-eco]').forEach(function(a){
    a.addEventListener('click', function(e){
      var ecoId = this.getAttribute('data-eco');
      if(document.getElementById('ecoTree')){
        e.preventDefault();
        closeMega();
        expandEcoTree(ecoId);
        return;
      }
      e.preventDefault();
      closeMega();
      location.href = depthBase() + '?eco=' + encodeURIComponent(ecoId) + '#chain';
    });
  });

  // 3. 內頁經由 ?eco= 參數導回首頁 #chain → 自動展開對應鏈節
  function applyEcoParam(){
    if(!document.getElementById('ecoTree')) return;
    var eco = null;
    try{ eco = new URLSearchParams(location.search).get('eco'); }catch(err){}
    if(!eco && location.hash){
      var m = location.hash.match(/[?&]eco=([^&]+)/);
      if(m) eco = decodeURIComponent(m[1]);
    }
    if(eco && location.hash === '#chain'){
      setTimeout(function(){ expandEcoTree(eco); }, 150);
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applyEcoParam);
  } else {
    applyEcoParam();
  }
  window.addEventListener('load', applyEcoParam);
})();

