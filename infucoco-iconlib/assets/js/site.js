/* ============================================================
   Infucoco 特殊符號複製大全 — site.js（互動層）
   全站內容已靜態燒錄進每個 HTML；本檔只負責互動：
   一鍵複製、收藏、下拉篩選、全站搜尋、花式字體、遊戲暱稱、文字工具、收藏頁。
   不產出任何頁面結構或內容。
   ============================================================ */
(function () {
  "use strict";

  /* 站根相對前綴：由本檔被引用的相對路徑（../ 數量）推算站內深度，
     file://（Windows）下磁碟槽位不屬站內層，此法仍正確指向站根。 */
  var BASE = (function () {
    var ups = 0;
    var el = document.querySelector('script[src$="site.js"]');
    if (el) {
      var src = el.getAttribute("src") || "";
      var m = src.match(/^(?:\.\.\/)*/);
      if (m) ups = m[0].length / 3;
    }
    return new Array(ups + 1).join("../");
  })();

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* ---------- 複製（含 file:// fallback） ---------- */
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

  /* ---------- 收藏（localStorage） ---------- */
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

  /* ---------- 全域互動（事件委派，適用已燒錄靜態 DOM） ---------- */
  document.addEventListener("click", function (e) {
    var ft = e.target.closest("[data-fav-toggle]");
    if (ft) {
      e.preventDefault();
      copyText(ft.getAttribute("data-fav-char") || "");
      return;
    }
    var ff = e.target.closest("[data-fav-font]");
    if (ff) {
      e.preventDefault();
      copyText(ff.getAttribute("data-fav-font") || "");
      return;
    }
    var rm = e.target.closest("[data-rm-fav]");
    if (rm) {
      e.preventDefault();
      var l = getFavs();
      l.splice(parseInt(rm.getAttribute("data-rm-fav"), 10), 1);
      saveFavs(l);
      renderFavList();
      return;
    }
    var cb = e.target.closest("[data-copy-btn]");
    if (cb) {
      var crow = cb.closest("[data-copy]");
      if (crow) copyText(crow.getAttribute("data-copy"));
      return;
    }
    var c = e.target.closest("[data-copy]");
    if (c) {
      var txt = c.getAttribute("data-copy");
      if (txt && txt.length > 2000) txt = txt.slice(0, 2000);
      copyText(txt);
    }
  });

  /* ---------- Header 互動（選單開關、手機選單、站內搜尋） ---------- */
  function bindHeader() {
    var t = $("#navToggle"), mn = $("#mobileNav");
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
    $all(".mega-col-title").forEach(function (title) {
      title.addEventListener("click", function (e) {
        e.stopPropagation();
        var col = title.parentElement;
        var open = col.classList.toggle("open");
        title.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    var MEGA_ICON = {
      "箭頭符號":"→","愛心符號":"♥","星星符號":"★","對勾與叉":"✓","貨幣符號":"$",
      "數學符號":"∑","希臘字母":"α","鍵盤與標點":"⌨","星座符號":"♈","音樂符號":"♪",
      "天氣符號":"☀","框線符號":"▢","牌卡符號":"♠","遊戲符號":"🎲","遊戲暱稱":"🎮",
      "笑臉情緒":"😊","人物手勢":"👋","動物自然":"🐾","食物飲料":"🍜","活動旅行":"✈",
      "物品工具":"🧰","旗幟符號":"🚩","全部 Emoji":"😀","開心顏文字":"◠","難過顏文字":"◡",
      "生氣顏文字":"ง","害羞顏文字":"⁄","愛心顏文字":"♥","動作顏文字":"ノ","動物顏文字":"ʕ",
      "空白符號":"␣","分隔線":"─","花式裝飾":"✿","分隔線工具":"━","IG 花式字體":"𝓕",
      "字數統計":"字","大小寫轉換":"Aa","去除空白":"␣","密碼產生器":"🔒","隨機抽籤":"🎲",
      "QR Code":"▚","我的收藏":"♥","關於本站":"ℹ","網站地圖":"🗺","首頁":"⌂"
    };
    $all(".mega a.mega-link").forEach(function (a) {
      if (a.querySelector(".ic")) return;
      var b = a.querySelector(".lbl b");
      var t = b ? b.textContent.trim() : "";
      var ic = document.createElement("span");
      ic.className = "ic";
      ic.textContent = MEGA_ICON[t] || t.charAt(0) || "";
      a.insertBefore(ic, a.firstChild);
    });
    $all(".nav-item .mega").forEach(function (mega) {
      var li = mega.parentElement;
      var btn = li.querySelector(".nav-top");
      function setOpen(on) {
        li.classList.toggle("open", on);
        if (btn) btn.setAttribute("aria-expanded", on ? "true" : "false");
      }
      if (btn) btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var toOpen = !li.classList.contains("open");
        if (toOpen) {
          $all(".nav-item.open").forEach(function (o) { if (o !== li) { o.classList.remove("open"); var ob = o.querySelector(".nav-top"); if (ob) ob.setAttribute("aria-expanded", "false"); } });
        }
        setOpen(toOpen);
      });
      if (btn) btn.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
      mega.addEventListener("click", function (e) { e.stopPropagation(); });
      li.addEventListener("focusin", function () { if (btn) btn.setAttribute("aria-expanded", "true"); });
      li.addEventListener("mouseenter", function () {
        $all(".nav-item.open").forEach(function (o) { if (o !== li) { o.classList.remove("open"); var ob = o.querySelector(".nav-top"); if (ob) ob.setAttribute("aria-expanded", "false"); } });
      });
    });
    document.addEventListener("click", function () {
      $all(".nav-item.open").forEach(function (li) {
        li.classList.remove("open");
        var b = li.querySelector(".nav-top");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    });
    var hs = $("#hsearch");
    if (hs) hs.addEventListener("keydown", function (e) { if (e.key === "Enter") goSearch(hs.value); });
    var hbtn = $('[data-action="header-search"]');
    if (hbtn) hbtn.addEventListener("click", function () { goSearch($("#hsearch").value); });
  }
  function goSearch(q) {
    q = (q || "").trim();
    if (!q) { toast("請輸入關鍵字", ""); return; }
    window.location.href = BASE + "index.html?q=" + encodeURIComponent(q);
  }

  /* ---------- 分類篩選（操作已燒錄的 #glist，data-group 切換顯示） ---------- */
  function bindFilter() {
    var sel = $("#gfilter"), list = $("#glist"), count = $("#gcount");
    if (!sel || !list) return;
    var totalItems = list.querySelectorAll(".sym-item").length;
    var update = function () {
      var v = sel.value;
      var shownGroups = 0;
      list.querySelectorAll("[data-group]").forEach(function (el) {
        var on = (!v || el.getAttribute("data-group") === v);
        el.style.display = on ? "" : "none";
        if (on && el.classList.contains("group-head")) shownGroups++;
      });
      if (count) count.textContent = "顯示 " + shownGroups + " 組 / " + totalItems + " 項";
    };
    sel.addEventListener("change", update);
    update();
  }

  /* ---------- 首頁全站搜尋（讀取已燒錄的 #search-index JSON） ---------- */
  function buildIndexFromJSON() {
    var el = $("#search-index");
    if (!el) return [];
    try { return JSON.parse(el.textContent) || []; }
    catch (e) { return []; }
  }
  function renderHomeSearch() {
    var host = $("#search-results");
    if (!host) return;
    var q = (new URLSearchParams(location.search).get("q") || "").trim();
    if (!q) return;
    var input = $("#homeq");
    if (input) input.value = q;
    var idx = buildIndexFromJSON();
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
  }

  /* ---------- 花式字體 ---------- */
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
    { key: "boldsfraktur", label: "粗哥德體", lower: { base: 0x1D586 }, upper: { base: 0x1D56C } }
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
      if (style.digits.wrap) return String.fromCodePoint(style.digits.base + ((ch - "0" + 8) % 10));
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
      html += '<div class="font-row" data-copy="' + escapeHtml(out) + '">' +
        '<div style="flex:1;min-width:0"><div class="out">' + escapeHtml(out) + "</div>" +
        '<div class="meta">' + escapeHtml(f.label) + "</div></div>" +
        '<button class="copy-btn" data-copy-btn>複製</button>' +
        '<button class="fav-heart" data-fav-font="' + escapeHtml(out) + '" data-fav-fontname="' + escapeHtml(f.label) + '" title="收藏">♡</button></div>';
    });
    html += "</div>";
    host.innerHTML = html;
  }

  /* ---------- 遊戲暱稱 ---------- */
  var NICK = {
    maple: { label: "楓之谷", presets: ["楓", "星", "月", "夜", "風", "雲", "火", "水", "光", "暗", "雪", "幻"], suffixes: ["之心", "之翼", "之刃", "騎士", "法師", "盜賊", "弓手", "冒險家"] },
    aov: { label: "傳說對決", presets: ["神", "帝", "王", "聖", "影", "鬼", "狂", "寂", "孤", "絕", "噬", "滅"], suffixes: ["之影", "之魂", "無雙", "逆襲", "血手", "亡者"] },
    lol: { label: "英雄聯盟", presets: ["蒼", "赤", "玄", "白", "紫", "綠", "裂", "焚", "霜", "雷", "燼", "影"], suffixes: ["之握", "裂空", "孤行", "之怒", "之焰", "破曉"] },
    p5: { label: "第五人格", presets: ["灰", "默", "幽", "寧", "淺", "微", "晚", "薄", "殘", "眠", "惘", "怯"], suffixes: ["之間", "之下", "之約", "迷途", "歸來", "守望"] }
  };
  function renderNickname() {
    var host = $("#nick-output");
    if (!host) return;
    var gameSel = $("#nick-game"), styleSel = $("#nick-style"), baseInput = $("#nick-base");
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
    } else {
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
  }

  /* ---------- 文字工具 ---------- */
  function bindTool() {
    var tool = $("#tool");
    if (!tool) return;
    var kind = tool.getAttribute("data-tool");
    function stat(label, val) { return '<div class="stat-card"><b>' + val + "</b><span>" + label + "</span></div>"; }
    if (kind === "wordcount") {
      var ta = $("#wc-input"), out = $("#wc-out");
      function calc() {
        var v = ta.value;
        var chars = v.length, noSpace = v.replace(/\s/g, "").length;
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
        var v = ci.value, res = v;
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
        var v = cli.value, t = v.replace(/\r/g, "");
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
        var lower = "abcdefghijkmnopqrstuvwxyz", upper = "ABCDEFGHJKLMNPQRSTUVWXYZ", digits = "23456789", sym = "!@#$%^&*()-_=+[]{};:,.?";
        var pool = lower + upper + digits + sym, out = "";
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
          var picked = [], copy = arr.slice();
          for (var i = 0; i < n && copy.length; i++) { var j = Math.floor(Math.random() * copy.length); picked.push(copy.splice(j, 1)[0]); }
          rout.textContent = picked.join("、");
        } else {
          var min = parseInt($("#r-min").value, 10) || 1, max = parseInt($("#r-max").value, 10) || 6;
          var cnt = Math.min(parseInt(rn.value, 10) || 1, 20), nums = [];
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

  /* ---------- 我的收藏頁 ---------- */
  function renderFavList() {
    var host = $("#fav-list");
    if (!host) return;
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
        (byUrl[it.type] ? '<a class="sym-name" href="' + BASE + byUrl[it.type] + '" style="color:var(--brand)">' + escapeHtml(it.type) + " →</a>" : "") +
        '<span class="fav-heart on" data-rm-fav="' + idx + '" title="取消收藏">♥</span></div>';
    });
    html += "</div>";
    host.innerHTML = html;
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    bindHeader();
    bindFilter();
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
    if ($("#homeq")) {
      var hq = $("#homeq");
      var hb = $("#homeSearchBtn");
      function homeGo() { var v = hq.value.trim(); if (v) window.location.href = BASE + "index.html?q=" + encodeURIComponent(v); }
      if (hb) hb.addEventListener("click", homeGo);
      hq.addEventListener("keydown", function (e) { if (e.key === "Enter") homeGo(); });
    }
})();
