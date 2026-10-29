/* infucoco 全站互動：金句、心靈療癒、遊戲庫、獨立遊戲、翻卡與快捷元件 */
(function(){
  "use strict";

  function toast(msg){
    let el = document.getElementById("toast");
    if(!el){
      el = document.createElement("div");
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove("show"), 1600);
  }


  function initHeaderActions(){
    const inner = document.querySelector(".header-inner");
    const nav = document.querySelector(".nav-links");
    if(!inner || !nav || inner.querySelector(".nav-actions")) return;

    const actions = document.createElement("div");
    actions.className = "nav-actions";
    actions.innerHTML = `
      <div class="popover-wrap">
        <button class="icon-btn" id="tools-btn" type="button" title="選單 menu" aria-label="選單 menu">menu</button>
        <div class="popover-dropdown" id="tools-pop">
          <div class="popover-dropdown__head"><span class="popover-dropdown__title">快速跳轉</span><button class="icon-btn" id="pop-close" type="button" style="width:32px;height:32px" aria-label="關閉">×</button></div>
          <div class="popover-dropdown__grid">
            <a class="popover-dropdown__link" href="quotes.html">金句</a>
            <a class="popover-dropdown__link" href="stories.html">故事</a>
            <a class="popover-dropdown__link" href="games.html">遊戲</a>
            <a class="popover-dropdown__link" href="quiz.html">心靈療癒</a>
            <a class="popover-dropdown__link" href="gallery.html">infu世界</a>
            <a class="popover-dropdown__link" href="stickers.html">數位商品</a>
            <a class="popover-dropdown__link" href="shop.html">周邊</a>
            <a class="popover-dropdown__link" href="member.html">會員</a>
            <a class="popover-dropdown__link" href="about.html">關於</a>
            <div class="popover-dropdown__title" style="grid-column:1/-1;margin:10px 0 2px">工具百寶箱</div>
            <a class="popover-dropdown__link" href="infucoco-iconlib/index.html">特殊符號</a>
            <a class="popover-dropdown__link" href="infucoco-iconlib/emoji/index.html">Emoji</a>
            <a class="popover-dropdown__link" href="infucoco-iconlib/kaomoji/index.html">顏文字</a>
            <a class="popover-dropdown__link" href="infucoco-iconlib/blank/index.html">空白分隔</a>
            <a class="popover-dropdown__link" href="infucoco-iconlib/font/index.html">花式字體</a>
            <a class="popover-dropdown__link" href="infucoco-iconlib/text-tools/index.html">文字工具</a>
          </div>
        </div>
      </div>`;
    nav.insertAdjacentElement("afterend", actions);

    const toolsBtn = actions.querySelector("#tools-btn");
    const pop = actions.querySelector("#tools-pop");
    const close = actions.querySelector("#pop-close");

    toolsBtn.addEventListener("click", e => { e.stopPropagation(); pop.classList.toggle("open"); });
    close.addEventListener("click", () => pop.classList.remove("open"));
    document.addEventListener("click", e => { if(!pop.contains(e.target) && e.target !== toolsBtn) pop.classList.remove("open"); });
  }

  function copyText(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(() => toast("金句已複製")).catch(() => fallbackCopy(text));
    }else{
      fallbackCopy(text);
    }
  }
  function fallbackCopy(text){
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); toast("金句已複製"); }
    catch(e){ toast("金句已複製"); }
    ta.remove();
  }
  function shareQuote(text){
    const payload = { title: document.title, text: text, url: location.href };
    if(navigator.share){ navigator.share(payload).catch(() => {}); return; }
    copyText(text); toast("已複製，可貼上分享");
  }

  /* ===== 金句：換一句、複製 ===== */
  function initQuotes(){
    const today = document.getElementById("q-today");
    const list = document.getElementById("q-list");
    if(!today || !list) return;

    const cards = [...list.querySelectorAll(".card-b")];
    const texts = cards.map(card => {
      const p = card.querySelector("p");
      return p ? p.textContent.trim().replace(/^「|」$/g, "") : "";
    }).filter(Boolean);

    const main = document.getElementById("q-main");
    const row = document.createElement("div");
    row.className = "btn-row center";
    row.style.marginTop = "18px";
    row.innerHTML = `<button class="btn o" id="quote-share">分享</button>
      <button class="btn o" id="quote-next">換一句金句</button>
      <button class="btn dark" id="quote-copy">複製金句</button>`;
    main.insertAdjacentElement("afterend", row);

    let current = today.textContent.trim().replace(/^「|」$/g, "");
    if(!texts.includes(current)) texts.unshift(current);

    document.getElementById("quote-next").addEventListener("click", () => {
      let next = current;
      while(next === current && texts.length > 1){
        next = texts[Math.floor(Math.random() * texts.length)];
      }
      current = next;
      today.textContent = current;
      today.parentElement.classList.remove("quiz-fade");
      void today.parentElement.offsetWidth;
      today.parentElement.classList.add("quiz-fade");
      toast("換到一句新的");
    });
    document.getElementById("quote-copy").addEventListener("click", () => copyText("「" + current + "」"));
    document.getElementById("quote-share").addEventListener("click", () => shareQuote("「" + current + "」"));

    /* 金句卡片僅保留金句文字，不放數字、複製與分享按鈕 */

    /* ===== 金句分頁：每 10 句一頁 ===== */
    const PER_PAGE = 15;
    const totalPages = Math.max(1, Math.ceil(cards.length / PER_PAGE));
    let page = 1;
    let pager = document.getElementById("q-pager");
    if(!pager){
      pager = document.createElement("nav");
      pager.className = "quote-pager";
      pager.setAttribute("aria-label", "金句分頁");
      list.insertAdjacentElement("afterend", pager);
    }

    function renderCards(){
      const start = (page - 1) * PER_PAGE;
      const end = start + PER_PAGE;
      cards.forEach((card, i) => {
        card.style.display = (i >= start && i < end) ? "" : "none";
      });
    }
    function renderPager(){
      pager.innerHTML = "";
      const prev = document.createElement("button");
      prev.className = "btn dark qp-btn";
      prev.textContent = "上一頁";
      prev.disabled = page === 1;
      prev.addEventListener("click", () => goPage(page - 1));
      pager.appendChild(prev);

      for(let n = 1; n <= totalPages; n++){
        const b = document.createElement("button");
        b.className = "qp-num" + (n === page ? " active" : "");
        b.textContent = n;
        b.setAttribute("aria-label", `第 ${n} 頁`);
        b.addEventListener("click", () => goPage(n));
        pager.appendChild(b);
      }

      const next = document.createElement("button");
      next.className = "btn dark qp-btn";
      next.textContent = "下一頁";
      next.disabled = page === totalPages;
      next.addEventListener("click", () => goPage(page + 1));
      pager.appendChild(next);
    }
    function goPage(n){
      page = Math.min(totalPages, Math.max(1, n));
      renderCards();
      renderPager();
      list.scrollIntoView({behavior: "smooth", block: "start"});
    }
    renderCards();
    renderPager();
  }

  /* ===== 心靈療癒：單題流程、計分、結果與重測 ===== */
  const QUIZ = {
    questions: [
      {q:"此刻的你，最想待在哪裡？", options:[
        {label:"月光下的小草地", cat:"star"}, {label:"一間暖暖的咖啡館", cat:"tea"},
        {label:"一本打開的書裡", cat:"book"}, {label:"軟軟的雲朵上", cat:"season"}]},
      {q:"心裡悄悄期待什麼？", options:[
        {label:"被好好的擁抱", cat:"tea"}, {label:"一個人安靜一下", cat:"book"},
        {label:"來場小小的冒險", cat:"star"}, {label:"重新開始", cat:"season"}]},
      {q:"如果今天可以許一個願望？", options:[
        {label:"好好睡一覺", cat:"tea"}, {label:"讀一本好書", cat:"book"},
        {label:"看一場星星", cat:"star"}, {label:"去海邊走走", cat:"season"}]},
      {q:"你最想念哪一種感覺？", options:[
        {label:"被溫暖包圍", cat:"tea"}, {label:"專注的滿足", cat:"book"},
        {label:"浪漫的悸動", cat:"star"}, {label:"新鮮的開始", cat:"season"}]},
      {q:"周末你最想怎麼過？", options:[
        {label:"窩在家裡喝咖啡", cat:"tea"}, {label:"去圖書館待半天", cat:"book"},
        {label:"上山看夜景", cat:"star"}, {label:"去近郊踏青", cat:"season"}]}
    ],
    results: {
      star:{title:"星光療癒", name:"你需要一片星空", text:"你的心需要浪漫與靜謐。去看一場日落、數一晚星星，或寫一封給未來的信，讓自己沉進溫柔裡。", url:"quiz-star.html"},
      tea:{title:"暖茶療癒", name:"你需要一個暖暖的擁抱", text:"你渴望溫暖和被接住。泡一杯熱飲、裹條毯子，或賴在喜歡的人身邊，讓熱氣把疲憊沖淡。", url:"quiz-tea.html"},
      book:{title:"書本療癒", name:"你需要一段獨處的時光", text:"你的心需要安靜與對話。翻一本書、寫一段字，或只是發呆，都是給自己最好的禮物。", url:"quiz-book.html"},
      season:{title:"四季療癒", name:"你需要一個新的開始", text:"你正準備蛻變。去散個步、種一盆花，或整理房間，讓儀式感幫你迎接全新的自己。", url:"quiz-season.html"}
    }
  };

  function initQuiz(){
    const wrap = document.querySelector(".quiz-wrap");
    if(!wrap || document.body.dataset.page !== "quiz") return;
    const existing = wrap.querySelector(".quiz-card");
    existing.style.display = "none";
    const staticGrid = document.querySelector(".quiz-wrap + .grid.g2");
    if(staticGrid) staticGrid.style.display = "none";

    const mount = document.createElement("div");
    mount.id = "quiz-mount";
    mount.className = "quiz-wrap";
    wrap.insertAdjacentElement("afterend", mount);

    let qn = 0, scores = {star:0, tea:0, book:0, season:0};

    function startScreen(){
      mount.innerHTML = `<div class="quiz-card quiz-result">
        <img class="quiz-start-img" src="assets/webp/infucoco_quiz_start_healing.webp" alt="infucoco 坐在星光草原、熱茶杯、書本與春花之間，等待你選出此刻的療癒" loading="lazy" width="1024" height="768">
        <h3>今天你需要哪一種療癒？</h3>
        <p>跟著直覺看完五個場景，找到此刻最靠近你的選項，<br>之後可以問問<a href="https://10return.com" target="_blank" rel="noopener" class="quiz-nian">念十回</a>，如何解讀....</p>
        <button class="btn o" id="quiz-start">開始心靈療癒</button></div>`;
      document.getElementById("quiz-start").addEventListener("click", startQuiz);
    }

    function startQuiz(){
      qn = 0; scores = {star:0, tea:0, book:0, season:0};
      renderQuestion();
    }

    function renderQuestion(){
      const q = QUIZ.questions[qn];
      const pct = Math.round((qn / QUIZ.questions.length) * 100);
      mount.innerHTML = `<div class="quiz-progress"><div style="width:${pct}%"></div></div>
        <div class="quiz-card quiz-fade">
          <div class="quiz-q">Q${qn + 1}．${q.q}</div>
          ${q.options.map((o, i) => `<button class="quiz-opt" data-cat="${o.cat}">${o.label}</button>`).join("")}
        </div>`;
      mount.querySelectorAll(".quiz-opt").forEach(btn => {
        btn.addEventListener("click", () => {
          btn.classList.add("picked");
          mount.querySelectorAll(".quiz-opt").forEach(x => x.disabled = true);
          scores[btn.dataset.cat]++;
          setTimeout(() => { qn++; qn < QUIZ.questions.length ? renderQuestion() : renderResult(); }, 420);
        });
      });
    }

    function renderResult(){
      const order = ["star", "tea", "book", "season"];
      let winner = order[0];
      order.forEach(k => { if(scores[k] > scores[winner]) winner = k; });
      const r = QUIZ.results[winner];
      mount.innerHTML = `<div class="quiz-progress"><div style="width:100%"></div></div>
        <div class="quiz-card quiz-result quiz-fade">
          <span class="quiz-tag">${r.title}</span>
          <h3>${r.name}</h3><p>${r.text}</p>
          <div class="btn-row center">
            <a class="btn o" href="${r.url}">查看完整結果</a>
            <button class="btn dark" id="quiz-retry">再測一次</button>
          </div>
        </div>`;
      document.getElementById("quiz-retry").addEventListener("click", startScreen);
    }

    startScreen();
  }

  /* ===== 遊戲庫：7 款卡片與分類篩選 ===== */
  function initGamesList(){
    const grid = document.getElementById("game-grid");
    if(!grid || !window.INFU_GAMES) return;
    const title = document.querySelector(".section-title h2");
    if(title) title.innerHTML = "七款<span class=\"rl\">療癒小遊戲</span>";
    const lead = document.querySelector(".section-title .lead");
    if(lead) lead.textContent = "七款遊戲主題小詩，點卡片走進專屬場景。";

    const cats = [
      ["all", "全部"], ["react", "反應"], ["fable", "故事"],
      ["pet", "療癒"], ["arcade", "玩樂"]
    ];
    const toolbar = document.createElement("div");
    toolbar.className = "game-filter-row";
    toolbar.innerHTML = cats.map(([key, label], i) => `<button class="btn filter-chip ${i === 0 ? "on" : ""}" data-cat="${key}">${label}</button>`).join("");
    grid.insertAdjacentElement("beforebegin", toolbar);

    grid.innerHTML = window.INFU_GAMES.map(g => `
      <a class="game-card" data-cat="${g.cat}" href="play.html@g=${g.id}.html">
        <div class="game-thumb" style="background-image:url('${g.img}')"><span class="gcat">${g.catLabel}</span></div>
        <div class="game-info"><h4>${g.title}</h4><p><span>${g.poem[0]}</span><br><span>${g.poem[1]}</span></p></div>
      </a>`).join("");

    toolbar.addEventListener("click", e => {
      const btn = e.target.closest(".filter-chip"); if(!btn) return;
      toolbar.querySelectorAll(".filter-chip").forEach(x => x.classList.remove("on"));
      btn.classList.add("on");
      const cat = btn.dataset.cat;
      grid.querySelectorAll(".game-card").forEach(card => {
        card.style.display = (cat === "all" || card.dataset.cat === cat) ? "" : "none";
      });
    });
  }

  /* ===== 獨立遊戲頁：載入對應互動引擎 ===== */
  function initStandaloneGame(){
    const path = location.pathname;
    const match = path.match(/g=(g\d+)/i);
    if(!match) return;
    const game = (window.INFU_GAMES || []).find(g => g.id.toLowerCase() === match[1].toLowerCase());
    if(!game || !window.INFU_ENGINES) return;

    const stage = document.querySelector(".game-stage");
    if(!stage) return;
    const backRow = stage.querySelector(".btn-row.center");
    const cta = document.createElement("div");
    cta.className = "game-play-cta";
    cta.innerHTML = `<button class="btn o" id="game-start">開始遊戲</button>
      <button class="btn dark" id="game-about">查看小詩</button>`;
    const mount = document.createElement("div");
    mount.className = "game-arena-mount";
    const status = document.createElement("div");
    status.className = "game-status";
    if(backRow){ backRow.insertAdjacentElement("beforebegin", cta); backRow.insertAdjacentElement("beforebegin", mount); backRow.insertAdjacentElement("beforebegin", status); }
    else{ stage.append(cta, mount, status); }

    const poem = stage.querySelector(".game-scene-poem, .game-poem, .game-note");
    const stageImg = stage.querySelector(":scope > img");
    const oldToolbar = stage.querySelector(":scope > .g-toolbar");
    const aboutBtn = document.getElementById("game-about");
    aboutBtn.addEventListener("click", () => {
      if(poem) poem.scrollIntoView({behavior:"smooth", block:"center"});
    });

    let engine = null;
    document.getElementById("game-start").addEventListener("click", () => {
      if(engine && engine.stop) engine.stop();
      const factory = window.INFU_ENGINES[game.engine];
      if(!factory){ status.textContent = "這款遊戲引擎尚未載入。"; return; }
      if(stageImg) stageImg.style.display = "none";
      if(oldToolbar) oldToolbar.style.display = "none";
      engine = factory(game);
      status.textContent = "遊戲進行中…";
      engine.start(mount, score => { status.textContent = `目前得分：${score}`; }, score => { status.textContent = `本局結束，得分 ${score}。`; });
    });
  }

  /* ===== 故事卡片：觸控點擊翻轉 ===== */
  function initStoriesFlip(){
    document.querySelectorAll(".flip-wrap").forEach(wrap => {
      wrap.addEventListener("click", () => wrap.classList.toggle("turn"));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initHeaderActions();
    initQuotes();
    initQuiz();
    initGamesList();
    initStandaloneGame();
    initStoriesFlip();
  });
})();
(function(){var b=document.getElementById("nav-tool-btn"),f=document.getElementById("nav-tool-frame");if(!b||!f)return;b.addEventListener("click",function(e){e.stopPropagation();var o=f.classList.toggle("open");b.classList.toggle("open",o);b.setAttribute("aria-expanded",o?"true":"false");});document.addEventListener("click",function(e){if(!f.contains(e.target)&&e.target!==b){f.classList.remove("open");b.classList.remove("open");b.setAttribute("aria-expanded","false");}});document.addEventListener("keydown",function(e){if(e.key==="Escape"){f.classList.remove("open");b.classList.remove("open");b.setAttribute("aria-expanded","false");}});})();
/* 工具下拉：有嵌入框則框內載入並捲動；無框則路由到首頁嵌入框（全站統一進框） */
(function(){
  var links = document.querySelectorAll('.nav-tool-frame a');
  for (var i = 0; i < links.length; i++) {
    (function(a){
      a.addEventListener('click', function(e){
        var href = a.getAttribute('href');
        var ifr = document.getElementById('tool-embed-iframe');
        if (ifr) {
          e.preventDefault();
          ifr.setAttribute('src', href);
          var s = document.getElementById('tool-embed');
          if (s) { s.scrollIntoView({behavior:'smooth', block:'start'}); }
        } else {
          e.preventDefault();
          location.href = 'index.html?tool=' + encodeURIComponent(href) + '#tool-embed';
        }
      });
    })(links[i]);
  }
})();
/* 首頁：讀取 ?tool= 載入對應工具到嵌入框並捲動 */
(function(){
  var ifr = document.getElementById('tool-embed-iframe');
  if (!ifr) { return; }
  var m = location.search.match(/[?&]tool=([^&]+)/);
  if (m) {
    ifr.setAttribute('src', decodeURIComponent(m[1]));
    var s = document.getElementById('tool-embed');
    if (s) { setTimeout(function(){ s.scrollIntoView({behavior:'auto', block:'start'}); }, 80); }
  }
})();
/* 療癒 / 數位週邊 下拉開合（2026-10-29） */
(function () {
  function closeAll(except) {
    document.querySelectorAll('.nav-dd-panel.open').forEach(function (p) {
      var w = p.closest('.nav-dd');
      if (w !== except) {
        p.classList.remove('open');
        var b = w.querySelector('.nav-dd-btn');
        if (b) { b.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); }
      }
    });
    var tf = document.getElementById('nav-tool-frame'), tb = document.getElementById('nav-tool-btn');
    if (tf) tf.classList.remove('open');
    if (tb) { tb.classList.remove('open'); tb.setAttribute('aria-expanded', 'false'); }
    if (!document.querySelector('.nav-dd-panel.open')) {
      document.querySelectorAll('.nav-links').forEach(function (n) { n.classList.remove('dd-open'); });
    }
  }
  document.querySelectorAll('.nav-dd').forEach(function (w) {
    var b = w.querySelector('.nav-dd-btn'), p = w.querySelector('.nav-dd-panel');
    if (!b || !p) return;
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAll(w);
      var open = !p.classList.contains('open');
      p.classList.toggle('open', open);
      b.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var n = w.closest('.nav-links');
        if (n) n.classList.add('dd-open');
      }
    });
  });
  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(null); });
})();