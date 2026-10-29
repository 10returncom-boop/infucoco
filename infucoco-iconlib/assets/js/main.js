/* ============================================================
   Icon符號 — 主程式 main.js
   共用：Header(MegaMenu)、Footer、麵包屑渲染
   互動：一鍵複製、下拉篩選、全站搜尋、收藏夾、各工具邏輯
   ============================================================ */
(function () {
  "use strict";

  var PAGE = window.PAGE || {};

  /* 頁面深度前綴：由本頁引用 main.js 的相對路徑（../ 數量）推算站內深度，
     讓 header/footer/搜尋的根相對連結在深層子類頁也能正確解析；
     file://（Windows）下磁碟槽位不屬於站內層，此法亦能正確指向站根。 */
  var BASE = (function () {
    var ups = 0;
    var el = document.querySelector('script[src$="main.js"]');
    if (el) {
      var src = el.getAttribute("src") || "";
      var m = src.match(/^(?:\.\.\/)*/);
      if (m) ups = m[0].length / 3;
    }
    return new Array(ups + 1).join("../");
  })();

  /* ---------- 小工具 ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- 複製到剪貼簿（含 file:// 環境 fallback） ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () { toast("已複製：", text); },
        function () { legacyCopy(text); }
      );
    }
    legacyCopy(text);
    return Promise.resolve();
  }
  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try { document.execCommand("copy"); toast("已複製：", text); }
    catch (e) { toast("複製失敗，請手動選取", ""); }
    document.body.removeChild(ta);
  }

  var toastTimer = null;
  function toast(prefix, text) {
    var el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    var shown = (text && text.length > 60) ? text.slice(0, 60) + "…" : text;
    el.textContent = prefix + (shown || "");
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1500);
  }

  /* ---------- 收藏夾 ---------- */
  var FAV_KEY = "iconsymbol.favs.v1";
  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveFavs(list) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(list)); }
    catch (e) { toast("本機儲存不可用", ""); }
  }
  function favKey(item) { return item.type + "|" + item.char; }
  function isFav(item) {
    return getFavs().some(function (f) { return favKey(f) === favKey(item); });
  }
  function toggleFav(item) {
    var list = getFavs();
    var k = favKey(item);
    var found = list.some(function (f) { return favKey(f) === k; });
    if (found) {
      list = list.filter(function (f) { return favKey(f) !== k; });
      toast("已取消收藏", "");
    } else {
      list.push(item);
      toast("已收藏：", item.char);
    }
    saveFavs(list);
    return !found;
  }

  /* ============================================================
     Header（多層巢狀 MegaMenu）+ Footer + 麵包屑
     ============================================================ */
  function renderHeader() {
    var host = $("#site-header");
    if (!host) return;
    var active = PAGE.active || "";

    var desktop = '<div class="nav" aria-label="主要導覽"><ul class="nav-list">';
    MENU.forEach(function (item) {
      var isActive = item.key === active;
      if (item.url && !item.groups) {
        desktop += '<li class="nav-item' + (isActive ? " active" : "") + '"><a class="nav-top" href="' + BASE + item.url + '">' +
          '<span>' + escapeHtml(item.label) + "</span></a></li>";
      } else {
        desktop += '<li class="nav-item' + (isActive ? " active" : "") + '">' +
          '<button class="nav-top" aria-haspopup="true" aria-expanded="false">' +
          '<span>' + escapeHtml(item.label) + '</span><span class="chev">▾</span></button>';
        desktop += '<div class="mega" role="menu"><div class="mega-columns">';
        item.groups.forEach(function (g) {
          desktop += '<div class="mega-col"><div class="mega-col-title">' + escapeHtml(g.label) + "</div>";
          g.links.forEach(function (l) {
            desktop += '<a class="mega-link" href="' + BASE + l.url + '"><span class="ic">' + escapeHtml(l.icon) + "</span>" +
              '<span class="lbl"><b>' + escapeHtml(l.label) + "</b><span>" + escapeHtml(l.desc) + "</span></span></a>";
          });
          desktop += "</div>";
        });
        desktop += "</div>" +
          '<div class="mega-foot">Icon符號 · 符號、表情、顏文字與工具，打開就能複製</div></div></li>';
      }
    });
    desktop += "</ul></div>";

    var search = '<div class="header-search"><input id="hsearch" type="search" placeholder="找符號 / 工具…" aria-label="站內搜尋">' +
      '<button type="button" data-action="header-search">搜尋</button></div>';

    var toggle = '<button class="nav-toggle" id="navToggle" aria-label="開啟選單" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>';

    var mobile = '<div class="mobile-nav" id="mobileNav">';
    MENU.forEach(function (item) {
      if (item.url && !item.groups) {
        mobile += '<a class="m-link" href="' + BASE + item.url + '" style="margin-top:6px"><span class="ic">' + escapeHtml(item.icon) +
          "</span>" + escapeHtml(item.label) + "</a>";
      } else {
        mobile += '<div class="m-acc"><button class="m-acc-head" aria-expanded="false"><span class="ic">' + escapeHtml(item.icon) +
          "</span>" + escapeHtml(item.label) + '<span class="chev">▾</span></button><div class="m-acc-body">';
        item.groups.forEach(function (g) {
          mobile += '<div class="m-group-label">' + escapeHtml(g.label) + "</div>";
          g.links.forEach(function (l) {
            mobile += '<a class="m-link" href="' + BASE + l.url + '"><span class="ic">' + escapeHtml(l.icon) + "</span>" + escapeHtml(l.label) + "</a>";
          });
        });
        mobile += "</div></div>";
      }
    });
    mobile += '<div style="margin-top:14px"><a class="m-link" href="' + BASE + 'index.html"><span class="ic">⌂</span>回到首頁</a></div></div>';

    host.innerHTML =
      '<div class="header-bar">' +
      '<a class="brand" href="' + BASE + 'index.html" aria-label="Infucoco 特殊符號複製大全 首頁">' +
      '<span class="brand-mark">符</span>' +
      '<span><span class="brand-name">Infucoco</span><br><span class="brand-sub">特殊符號複製大全</span></span></a>' +
      desktop + search + toggle + "</div>" + mobile;

    // 手機選單
    var t = $("#navToggle");
    var mn = $("#mobileNav");
    if (t && mn) {
      t.addEventListener("click", function () {
        var open = mn.classList.toggle("open");
        t.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    $all(".m-acc-head").forEach(function (b) {
      b.addEventListener("click", function () {
        var acc = b.parentElement;
        var open = acc.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    // 桌上型鍵盤展開 + 點擊開關
    $all(".nav-item .mega").forEach(function (mega) {
      var li = mega.parentElement;
      var btn = li.querySelector(".nav-top");
      function setOpen(on) {
        li.classList.toggle("open", on);
        if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
      }
      if (btn) btn.addEventListener("click", function (e) {
        e.stopPropagation();
        setOpen(!li.classList.contains("open"));
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setOpen(false);
      });
      mega.addEventListener("click", function (e) { e.stopPropagation(); });
      li.addEventListener("focusin", function () { if (btn) btn.setAttribute("aria-expanded", "true"); });
    });
    document.addEventListener("click", function () {
      $all(".nav-item.open").forEach(function (li) {
        li.classList.remove("open");
        var b = li.querySelector(".nav-top");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    });

    var hs = $("#hsearch");
    if (hs) {
      hs.addEventListener("keydown", function (e) { if (e.key === "Enter") goSearch(hs.value); });
    }
    var hbtn = $('[data-action="header-search"]');
    if (hbtn) hbtn.addEventListener("click", function () { goSearch($("#hsearch").value); });
  }

  function goSearch(q) {
    q = (q || "").trim();
    if (!q) { toast("請輸入關鍵字", ""); return; }
    window.location.href = BASE + "index.html?q=" + encodeURIComponent(q);
  }

  function renderCrumb() {
    var host = $("#breadcrumb");
    if (!host || !PAGE.crumb || !PAGE.crumb.length) { if (host) host.style.display = "none"; return; }
    var html = '<nav aria-label="麵包屑"><ol>';
    PAGE.crumb.forEach(function (c, i) {
      var last = i === PAGE.crumb.length - 1;
      if (last) html += "<li><span aria-current=\"page\">" + escapeHtml(c.label) + "</span></li>";
      else html += "<li><a href=\"" + c.url + "\">" + escapeHtml(c.label) + "</a></li>";
    });
    html += "</ol></nav>";
    host.innerHTML = html;
  }

  function renderFooter() {
    var host = $("#site-footer");
    if (!host) return;
    var html = '<div class="wrap"><div class="foot-grid">' +
      '<div><h4>Icon符號</h4><p style="font-size:.85rem;color:var(--ink-soft)">以符號複製為核心的多功能工具箱。所有運算與複製都在你的瀏覽器本地完成，內容不會上傳伺服器。</p></div>' +
      '<div><h4>符號分類</h4>';
    MENU.slice(1, 5).forEach(function (m) {
      html += '<a href="' + BASE + m.url + '">' + escapeHtml(m.label) + "</a>";
    });
    html += '</div><div><h4>工具與資訊</h4>';
    html += '<a href="' + BASE + 'font/index.html">花式字體</a>';
    html += '<a href="' + BASE + 'nickname/index.html">遊戲暱稱</a>';
    html += '<a href="' + BASE + 'text-tools/index.html">文字工具</a>';
    html += '<a href="' + BASE + 'collection/index.html">我的收藏</a>';
    html += '<a href="' + BASE + 'about/index.html">關於本站</a>';
    
    html += '<a href="' + BASE + 'sitemap/index.html">網站地圖</a>';
    html += '</div></div>' +
      '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + " " + SITE.owner + " · " + SITE.name + "</span>" +
      "<span>純靜態 HTML / CSS / JS · 繁中（台灣）</span></div></div>";
    host.innerHTML = html;
  }

  /* ============================================================
     符號收集檢視（symbols / emoji / kaomoji / blank 共用）
     ============================================================ */
  function normalizeItems(items) {
    return items.map(function (it) {
      if (typeof it === "string") return { char: it, name: "", desc: "" };
      return { char: it[0], name: it[1] || "", desc: it[2] || "" };
    });
  }

  function renderCollection() {
    var host = $("#collection");
    if (!host) return;
    var dsName = host.getAttribute("data-dataset");
    var ds = window[dsName];
    if (!ds) return;

    var keys = Object.keys(ds);
    var all = [];
    var groups = [];
    keys.forEach(function (k) {
      var g = ds[k];
      var items = normalizeItems(g.items);
      groups.push({ key: k, label: g.label, desc: g.desc, items: items });
      all = all.concat(items.map(function (it) { return { char: it.char, name: it.name, g: k }; }));
    });
    var total = all.length;

    // 單一子類模式：獨立內頁使用，不顯示下拉篩選，只渲染該子類
    var singleKey = host.getAttribute("data-single") || "";
    if (singleKey) {
      var sg = null;
      groups.forEach(function (g) { if (g.key === singleKey) sg = g; });
      if (!sg) { host.innerHTML = '<div class="sym-empty">找不到此分類。</div>'; return; }
      var sh = '<div class="group-head" style="margin:4px 0 4px"><h2 style="font-size:1.15rem;display:inline-flex;gap:8px;align-items:center"><span class="badge">' + escapeHtml(sg.label) + '</span> ' + sg.items.length + ' 項</h2></div>';
      if (sg.desc) sh += '<p style="font-size:.85rem;color:var(--ink-soft);margin:.1em 0 .6em">' + escapeHtml(sg.desc) + '</p>';
      sh += '<div class="sym-grid">';
      sg.items.forEach(function (it) {
        var isF = isFav({ type: dsName.toLowerCase(), char: it.char, name: it.name });
        sh += `<div class="sym-item" role="button" tabindex="0" data-copy="${escapeHtml(it.char)}" data-fav-type="${dsName.toLowerCase()}" data-fav-char="${escapeHtml(it.char)}" data-fav-name="${escapeHtml(it.name)}" aria-label="複製${escapeHtml(it.char)}"><span class="sym-char">${escapeHtml(it.char)}</span><span class="sym-name">${it.name ? escapeHtml(it.name) : '點我複製'}</span><span class="fav-heart${isF ? ' on' : ''}" data-fav-toggle title="收藏">${isF ? '♥' : '♡'}</span></div>`;
      });
      sh += '</div>';
      host.innerHTML = sh;
      bindItemEvents(host);
      return;
    }

    var orderAttr = host.getAttribute("data-order");
    var order = orderAttr ? orderAttr.split(",").map(function (s) { return s.trim(); }) : null;

    // 工具列：下拉式篩選
    var toolbar = '<div class="toolbar"><label for="gfilter">分類篩選</label>' +
      '<select id="gfilter" aria-label="分類篩選">' +
      '<option value="">全部（' + total + " 項）</option>";
    groups.forEach(function (g) {
      toolbar += '<option value="' + g.key + '">' + escapeHtml(g.label) + "（" + g.items.length + "）</option>";
    });
    toolbar += "</select><span class=\"count\" id=\"gcount\"></span></div>";

    var holder = document.createElement("div");
    holder.innerHTML = toolbar + '<div id="glist" style="margin-top:2px"></div>';
    host.appendChild(holder);

    var sel = $("#gfilter", host);
    var listEl = $("#glist", host);
    var countEl = $("#gcount", host);

    function render(activeKey) {
      var shown = 0;
      var html = "";
      var list = (activeKey ? groups.filter(function (g) { return g.key === activeKey; }) : groups);
      // 依 data-order 排序（若有）
      if (order && !activeKey) {
        var map = {};
        groups.forEach(function (g) { map[g.key] = g; });
        list = order.map(function (k) { return map[k]; }).filter(Boolean);
      }
      list.forEach(function (g) {
        html += '<div class="group-head" style="margin:22px 0 4px" id="' + g.key + '">' +
          '<h2 style="font-size:1.15rem;display:inline-flex;gap:8px;align-items:center"><span class="badge">' + escapeHtml(g.label) + "</span> " + g.items.length + " 項</h2></div>";
        if (g.desc) html += '<p style="font-size:.85rem;color:var(--ink-soft);margin:.1em 0 .6em">' + escapeHtml(g.desc) + "</p>";
        html += '<div class="sym-grid">';
        g.items.forEach(function (it) {
          shown++;
          var isF = isFav({ type: dsName.toLowerCase(), char: it.char, name: it.name });
          html += `<div class="sym-item" role="button" tabindex="0" data-copy="${escapeHtml(it.char)}" data-fav-type="${dsName.toLowerCase()}" data-fav-char="${escapeHtml(it.char)}" data-fav-name="${escapeHtml(it.name)}" aria-label="複製${escapeHtml(it.char)}"><span class="sym-char">${escapeHtml(it.char)}</span><span class="sym-name">${it.name ? escapeHtml(it.name) : '點我複製'}</span><span class="fav-heart${isF ? ' on' : ''}" data-fav-toggle title="收藏">${isF ? '♥' : '♡'}</span></div>`;
        });
        html += "</div>";
      });
      if (shown === 0) html = '<div class="sym-empty">此分類暫時沒有項目</div>';
      listEl.innerHTML = html;
      countEl.textContent = "顯示 " + shown + " / " + total;
      bindItemEvents(listEl);
    }

    sel.addEventListener("change", function () { render(sel.value); });

    // 深層連結 #group
    var deep = location.hash.slice(1);
    if (deep && ds[deep]) { sel.value = deep; }
    render(sel.value);
    if (deep && ds[deep]) {
      setTimeout(function () {
        var el = document.getElementById(deep);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }

  function bindItemEvents(scope) {
    $all(".sym-item", scope).forEach(function (el) {
      var copyTarget = el.getAttribute("data-copy");
      var favChar = el.getAttribute("data-fav-char");
      var favName = el.getAttribute("data-fav-name");
      var favType = el.getAttribute("data-fav-type");

      function doCopy() { copyText(copyTarget); }
      el.addEventListener("click", function (e) {
        if (e.target.closest(".fav-heart")) return;
        doCopy();
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); doCopy(); }
      });

      var heart = el.querySelector(".fav-heart");
      if (heart) {
        heart.addEventListener("click", function (e) {
          e.stopPropagation();
          var on = toggleFav({ type: favType, char: favChar, name: favName });
          heart.classList.toggle("on", on);
          heart.textContent = on ? "♥" : "♡";
        });
      }
    });
  }

  /* ============================================================
     首頁全站搜尋
     ============================================================ */
  function buildSearchIndex() {
    var idx = [];
    var map = { SYMBOLS: { type: "symbol", folder: "symbols" }, EMOJI: { type: "emoji", folder: "emoji" },
      KAO: { type: "kaomoji", folder: "kaomoji" }, BLANK: { type: "blank", folder: "blank" } };
    Object.keys(map).forEach(function (dsName) {
      var ds = window[dsName];
      var base = map[dsName].base;
      Object.keys(ds).forEach(function (k) {
        normalizeItems(ds[k].items).forEach(function (it) {
          idx.push({ char: it.char, name: it.name, group: ds[k].label, type: map[dsName].type, url: map[dsName].folder + "/" + k + "/index.html" });
        });
      });
    });
    return idx;
  }

  function renderHomeSearch() {
    var host = $("#search-results");
    if (!host) return;
    var q = (new URLSearchParams(location.search).get("q") || "").trim();
    if (!q) return;
    var input = $("#homeq");
    if (input) input.value = q;

    var idx = buildSearchIndex();
    var kw = q.toLowerCase();
    var hits = idx.filter(function (it) {
      return (it.char && it.char.toLowerCase().indexOf(kw) >= 0) || (it.name && it.name.toLowerCase().indexOf(kw) >= 0) ||
        (it.group && it.group.toLowerCase().indexOf(kw) >= 0);
    }).slice(0, 120);

    var html = '<div class="toolbar"><span class="count">找到 ' + hits.length + " 筆，關鍵字：「" + escapeHtml(q) + "」</span></div>";
    if (!hits.length) {
      html += '<div class="sym-empty">沒有符合「' + escapeHtml(q) + '」的符號，試試「愛心」「星星」「空白」等關鍵字。</div>';
    } else {
      html += '<div class="sym-grid">';
      hits.forEach(function (it) {
        html += '<div class="sym-item" role="button" tabindex="0" data-copy="' + escapeHtml(it.char) + '" aria-label="複製 ' + escapeHtml(it.char) + '">' +
          '<span class="sym-char">' + escapeHtml(it.char) + "</span>" +
          (it.name ? '<span class="sym-name">' + escapeHtml(it.name) + "</span>" : "") +
          '<a class="sym-name" href="' + it.url + '" style="color:var(--brand)">' + escapeHtml(it.group) + " →</a></div>";
      });
      html += "</div>";
    }
    host.innerHTML = html;
    bindItemEvents(host);
  }

  /* ============================================================
     工具邏輯
     ============================================================ */
  // ---- 花式字體 ----
  var FONTS = [
    { key: "none", label: "原始文字", lower: null, upper: null, digits: null },
    { key: "fullwidth", label: "全形", lower: { base: 0xFF41 }, upper: { base: 0xFF21 }, digits: { base: 0xFF10 } },
    { key: "bold", label: "數學粗體", lower: { base: 0x1D41A }, upper: { base: 0x1D400 }, digits: { base: 0x1D7CE } },
    { key: "italic", label: "數學斜體", lower: { base: 0x1D44E }, upper: { base: 0x1D434 } },
    { key: "bolditalic", label: "粗斜體", lower: { base: 0x1D482 }, upper: { base: 0x1D468 } },
    { key: "sans", label: "無襯線", lower: { base: 0x1D5BA }, upper: { base: 0x1D5A0 }, digits: { base: 0x1D7E2 } },
    { key: "sansbold", label: "無襯線粗體", lower: { base: 0x1D5EE }, upper: { base: 0x1D5D4 }, digits: { base: 0x1D7EC } },
    { key: "sansitalic", label: "無襯線斜體", lower: { base: 0x1D622 }, upper: { base: 0x1D608 } },
    { key: "sansbolditalic", label: "無襯線粗斜", lower: { base: 0x1D656 }, upper: { base: 0x1D63C } },
    { key: "mono", label: "等寬", lower: { base: 0x1D68A }, upper: { base: 0x1D670 }, digits: { base: 0x1D7F6 } },
    { key: "circled", label: "圓圈", lower: { base: 0x24D0 }, upper: { base: 0x24B6 }, digits: { base: 0x2460, wrap: true } },
    { key: "paren", label: "括號", lower: { base: 0x249C }, upper: null },
    { key: "dbl", label: "雙線體", lower: { base: 0x1D552 }, upper: { map: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ" } },
    { key: "fraktur", label: "哥德體", lower: { base: 0x1D51E }, upper: { map: "𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ" } },
    { key: "script", label: "手寫體（小寫）", lower: { base: 0x1D4B6 } },
    { key: "boldsfraktur", label: "粗哥德體", lower: { base: 0x1D586 }, upper: { base: 0x1D56C } },
  ];
  function fontMap(style, ch) {
    if (!style) return ch;
    if (ch >= "a" && ch <= "z") {
      if (style.lower) {
        if (style.lower.map) return style.lower.map[ch.charCodeAt(0) - 97];
        return String.fromCodePoint(style.lower.base + (ch.charCodeAt(0) - 97));
      }
      return ch;
    }
    if (ch >= "A" && ch <= "Z") {
      if (style.upper) {
        if (style.upper.map) return style.upper.map[ch.charCodeAt(0) - 65];
        return String.fromCodePoint(style.upper.base + (ch.charCodeAt(0) - 65));
      }
      return ch;
    }
    if (ch >= "0" && ch <= "9" && style.digits) {
      if (style.digits.wrap) { return String.fromCodePoint(style.digits.base + ((ch - "0" + 8) % 10)); }
      return String.fromCodePoint(style.digits.base + (ch.charCodeAt(0) - 48));
    }
    return ch;
  }
  function renderFonts(text) {
    var host = $("#font-output");
    if (!host) return;
    if (!text.trim()) { host.innerHTML = '<div class="sym-empty">請先輸入一段英文文字。</div>'; return; }
    var html = '<div class="font-list">';
    FONTS.forEach(function (f) {
      var out = text.split("").map(function (c) { return fontMap(f, c); }).join("");
      var isF = isFav({ type: "font", char: out, name: f.label });
      html += '<div class="font-row" data-copy="' + escapeHtml(out) + '">' +
        '<div style="flex:1;min-width:0"><div class="out">' + escapeHtml(out) + "</div>" +
        '<div class="meta">' + escapeHtml(f.label) + "</div></div>" +
        '<button class="copy-btn" data-copy-btn>複製</button>' +
        '<button class="fav-heart' + (isF ? " on" : "") + '" data-fav-font="' + escapeHtml(out) + '" data-fav-fontname="' + escapeHtml(f.label) + '" title="收藏">' + (isF ? "♥" : "♡") + "</button></div>";
    });
    html += "</div>";
    host.innerHTML = html;
    $all(".font-row", host).forEach(function (row) {
      var out = row.getAttribute("data-copy");
      var copyBtn = row.querySelector("[data-copy-btn]");
      copyBtn.addEventListener("click", function () { copyText(out); });
      row.addEventListener("click", function (e) { if (e.target.closest("button")) return; copyText(out); });
      var heart = row.querySelector("[data-fav-font]");
      if (heart) heart.addEventListener("click", function (e) {
        e.stopPropagation();
        var on = toggleFav({ type: "font", char: out, name: heart.getAttribute("data-fav-fontname") });
        heart.classList.toggle("on", on); heart.textContent = on ? "♥" : "♡";
      });
    });
  }

  // ---- 遊戲暱稱 ----
  var NICK = {
    maple: { label: "楓之谷", presets: ["楓", "星", "月", "夜", "風", "雲", "火", "水", "光", "暗", "雪", "幻"], suffixes: ["之心", "之翼", "之刃", "騎士", "法師", "盜賊", "弓手", "冒險家"] },
    aov: { label: "傳說對決", presets: ["神", "帝", "王", "聖", "影", "鬼", "狂", "寂", "孤", "絕", "噬", "滅"], suffixes: ["之影", "之魂", "無雙", "逆襲", "血手", "亡者"] },
    lol: { label: "英雄聯盟", presets: ["蒼", "赤", "玄", "白", "紫", "綠", "裂", "焚", "霜", "雷", "燼", "影"], suffixes: ["之握", "裂空", "孤行", "之怒", "之焰", "破曉"] },
    p5: { label: "第五人格", presets: ["灰", "默", "幽", "寧", "淺", "微", "晚", "薄", "殘", "眠", "惘", "怯"], suffixes: ["之間", "之下", "之約", "迷途", "歸來", "守望"] },
  };
  function renderNickname() {
    var host = $("#nick-output");
    if (!host) return;
    var gameSel = $("#nick-game");
    var styleSel = $("#nick-style");
    var baseInput = $("#nick-base");
    if (!gameSel || !styleSel) return;
    var cfg = NICK[gameSel.value];
    if (!cfg) return;

    var base = (baseInput.value || "").trim().slice(0, 8);
    var style = styleSel.value;
    var cands = [];
    var preset = cfg.presets[Math.floor(Math.random() * cfg.presets.length)];
    var suffix = cfg.suffixes[Math.floor(Math.random() * cfg.suffixes.length)];

    if (style === "random") {
      cands.push(preset + (base || "玩家") + suffix);
      cands.push((base || preset) + suffix + Math.floor(Math.random() * 90 + 10));
      cands.push(preset + suffix);
      cands.push((base || preset) + Math.floor(Math.random() * 99 + 1));
    } else if (style === "prefix") {
      cands.push(preset + (base || "玩家"));
      cands.push(preset + suffix);
      cands.push(preset + "の" + (base || "玩家"));
    } else if (style === "suffix") {
      cands.push((base || "玩家") + suffix);
      cands.push((base || "玩家") + suffix + Math.floor(Math.random() * 90 + 10));
    } else { // symbol 裝飾
      var decor = ["✧", "♛", "✦", "۞", "♕", "❋", "⭒", "ϟ", "♞", "☯"];
      var d1 = decor[Math.floor(Math.random() * decor.length)];
      var d2 = decor[Math.floor(Math.random() * decor.length)];
      cands.push(d1 + " " + (base || "玩家") + " " + d2);
      cands.push((base || "玩家") + " " + d1);
      cands.push(d1 + " " + (base || "玩家"));
    }
    cands = cands.filter(function (v, i) { return cands.indexOf(v) === i; }).slice(0, 6);

    var html = '<div class="nick-stage"><div class="cur">' + escapeHtml(cands[0]) + "<small>建議名稱（可再抽一組）</small></div></div>" +
      '<div class="nick-cands">';
    cands.forEach(function (c) {
      html += '<div class="nick-cand"><span>' + escapeHtml(c) + '</span><button class="copy-btn" data-copy="' + escapeHtml(c) + '">複製</button></div>';
    });
    html += "</div>";
    host.innerHTML = html;
    $all("[data-copy]", host).forEach(function (b) {
      b.addEventListener("click", function () { copyText(b.getAttribute("data-copy")); });
    });
  }

  // ---- 文字工具 ----
  function bindTool() {
    var tool = $("#tool");
    if (!tool) return;
    var kind = tool.getAttribute("data-tool");

    if (kind === "wordcount") {
      var ta = $("#wc-input"), out = $("#wc-out");
      function calc() {
        var v = ta.value;
        var chars = v.length;
        var noSpace = v.replace(/\s/g, "").length;
        var words = (v.match(/[A-Za-z0-9]+/g) || []).length;
        var lines = v ? v.split(/\n/).length : 0;
        var paras = v ? v.split(/\n{2,}/).filter(function (s) { return s.trim(); }).length : 0;
        out.innerHTML = '<div class="stat-grid" style="grid-template-columns:repeat(2,1fr)">' +
          stat("總字元", chars) + stat("不含空白", noSpace) + stat("英文單字", words) + stat("行數", lines) +
          stat("段落", paras) + stat("含空白字元", chars - noSpace) + "</div>";
      }
      ta.addEventListener("input", calc);
      $("#wc-count").addEventListener("click", calc);
      $("#wc-clear").addEventListener("click", function () { ta.value = ""; out.innerHTML = ""; });
    }

    if (kind === "case") {
      var ci = $("#case-input"), co = $("#case-out");
      function run() {
        var v = ci.value;
        var res = v;
        var mode = document.querySelector('input[name="case-mode"]:checked');
        if (mode) {
          if (mode.value === "upper") res = v.toUpperCase();
          else if (mode.value === "lower") res = v.toLowerCase();
          else if (mode.value === "title") res = v.toLowerCase().replace(/(^|[\s.。!！?？])[a-z]/g, function (m) { return m.toUpperCase(); });
          else if (mode.value === "sentence") res = v.toLowerCase().replace(/^[a-z]/, function (m) { return m.toUpperCase(); });
        }
        co.textContent = res;
      }
      ci.addEventListener("input", run);
      $all('input[name="case-mode"]').forEach(function (r) { r.addEventListener("change", run); });
      $("#case-run").addEventListener("click", run);
      $("#case-copy").addEventListener("click", function () { copyText(co.textContent); });
    }

    if (kind === "clean") {
      var cli = $("#clean-input"), clo = $("#clean-out");
      function run() {
        var v = cli.value;
        var t = v.replace(/\r/g, "");
        var m1 = $("#clean-space"), m2 = $("#clean-newline"), m3 = $("#clean-repeat");
        if (m1.checked) t = t.replace(/[ \t\u3000\u00A0]+/g, " ");
        if (m3.checked) t = t.replace(/[ ]{2,}/g, " ");
        if (m2.checked) t = t.replace(/\n{2,}/g, "\n");
        t = t.replace(/^[\s]+/, "").replace(/[\s]+$/, "");
        clo.textContent = t;
      }
      cli.addEventListener("input", run);
      ["clean-space", "clean-newline", "clean-repeat"].forEach(function (id) { $("#" + id).addEventListener("change", run); });
      $("#clean-run").addEventListener("click", run);
      $("#clean-copy").addEventListener("click", function () { copyText(clo.textContent); });
    }

    if (kind === "password") {
      var plen = $("#pw-len"), ppw = $("#pw-out");
      function gen() {
        var len = Math.max(6, Math.min(64, parseInt(plen.value, 10) || 16));
        var lower = "abcdefghijkmnopqrstuvwxyz";
        var upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        var digits = "23456789";
        var sym = "!@#$%^&*()-_=+[]{};:,.?";
        var pool = lower + upper + digits + sym;
        var out = "";
        // 保證每類至少一個
        out += lower[Math.floor(Math.random() * lower.length)];
        out += upper[Math.floor(Math.random() * upper.length)];
        out += digits[Math.floor(Math.random() * digits.length)];
        out += sym[Math.floor(Math.random() * sym.length)];
        for (var i = out.length; i < len; i++) out += pool[Math.floor(Math.random() * pool.length)];
        out = out.split("").sort(function () { return 0.5 - Math.random(); }).join("");
        ppw.textContent = out.slice(0, len);
      }
      $("#pw-gen").addEventListener("click", gen);
      $("#pw-copy").addEventListener("click", function () { copyText(ppw.textContent); });
      gen();
    }

    if (kind === "random") {
      var rmode = $("#r-mode"), rlist = $("#r-list"), rn = $("#r-n"), rout = $("#r-out");
      function run() {
        var mode = rmode.value;
        if (mode === "list") {
          var arr = rlist.value.split(/\n|,|、/).map(function (s) { return s.trim(); }).filter(Boolean);
          var n = Math.min(parseInt(rn.value, 10) || 1, arr.length);
          var picked = [];
          var copy = arr.slice();
          for (var i = 0; i < n && copy.length; i++) {
            var j = Math.floor(Math.random() * copy.length);
            picked.push(copy.splice(j, 1)[0]);
          }
          rout.textContent = picked.join("、");
        } else {
          var min = parseInt($("#r-min").value, 10) || 1;
          var max = parseInt($("#r-max").value, 10) || 6;
          var cnt = Math.min(parseInt(rn.value, 10) || 1, 20);
          var nums = [];
          for (var k = 0; k < cnt; k++) nums.push(Math.floor(Math.random() * (max - min + 1)) + min);
          rout.textContent = nums.join("、");
        }
      }
      rmode.addEventListener("change", function () {
        var isList = rmode.value === "list";
        $("#r-list-wrap").style.display = isList ? "" : "none";
        $("#r-range-wrap").style.display = isList ? "none" : "";
      });
      $("#r-run").addEventListener("click", run);
      $("#r-copy").addEventListener("click", function () { copyText(rout.textContent); });
    }
  }

  function stat(label, val) {
    return '<div class="stat-card"><b>' + val + "</b><span>" + label + "</span></div>";
  }

  /* ============================================================
     Init
     ============================================================ */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderCrumb();
    renderFooter();

    if ($("#collection")) renderCollection();
    if ($("#search-results")) renderHomeSearch();
    if ($("#tool")) bindTool();
    if ($("#font-input") && $("#font-output")) {
      $("#font-input").addEventListener("input", function () { renderFonts(this.value); });
      var fb = $("#font-run");
      if (fb) fb.addEventListener("click", function () { renderFonts($("#font-input").value); });
    }
    if ($("#nick-output")) {
      var ng = $("#nick-game");
      if (ng) ng.addEventListener("change", renderNickname);
      var ns = $("#nick-style");
      if (ns) ns.addEventListener("change", renderNickname);
      var nb = $("#nick-base");
      if (nb) nb.addEventListener("input", renderNickname);
      var nrun = $("#nick-run");
      if (nrun) nrun.addEventListener("click", renderNickname);
      renderNickname();
    }
    if ($("#fav-list")) renderFavList();
  });

  function renderFavList() {
    var host = $("#fav-list");
    var list = getFavs();
    if (!list.length) {
      host.innerHTML = '<div class="fav-empty">還沒有收藏。到分類頁點符號上的 ♡，就會收藏到這裡。</div>';
      return;
    }
    var byUrl = { symbol: "symbols/index.html", emoji: "emoji/index.html", kaomoji: "kaomoji/index.html", blank: "blank/index.html", font: "font/index.html" };
    var html = '<div class="sym-grid">';
    list.forEach(function (it, idx) {
      html += '<div class="sym-item" role="button" tabindex="0" data-copy="' + escapeHtml(it.char) + '">' +
        '<span class="sym-char">' + escapeHtml(it.char) + "</span>" +
        (it.name ? '<span class="sym-name">' + escapeHtml(it.name) + "</span>" : "") +
        (byUrl[it.type] ? '<a class="sym-name" href="' + byUrl[it.type] + '" style="color:var(--brand)">' + escapeHtml(it.type) + " →</a>" : "") +
        '<span class="fav-heart on" data-rm-fav="' + idx + '" title="取消收藏">♥</span></div>';
    });
    html += "</div>";
    host.innerHTML = html;
    $all("[data-rm-fav]", host).forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.stopPropagation();
        var list2 = getFavs();
        list2.splice(parseInt(el.getAttribute("data-rm-fav"), 10), 1);
        saveFavs(list2);
        renderFavList();
      });
    });
    bindItemEvents(host);
  }

  // 全站複製代理（含首頁搜尋結果、收藏頁）
  document.addEventListener("click", function (e) {
    var target = e.target.closest("[data-copy]");
    if (target) {
      var txt = target.getAttribute("data-copy");
      if (txt && txt.length > 2000) txt = txt.slice(0, 2000);
      copyText(txt);
    }
  });
})();
