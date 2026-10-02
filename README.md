# INFUCOCO 療癒宇宙（Windows 本機版）

> 版本：**v1.0.0** · 路徑：`D:\www\infucoco_healing`
> 說明：此為「療癒宇宙」網站的 **Windows 本機完整版**，解決先前雲端單檔快照連結破圖的問題——所有 CSS/JS/圖片皆在本機，直接雙擊 `index.html` 即可完整開啟。

## 這是什麼
以固定 IP 角色 **infucoco（sk333 v1.2）** 為主題、專為網路流量設計的療癒內容平台。金句 × 寓言 × 100 款遊戲 × 心理測驗 × 桌布貼圖 × 周邊電商 × 會員。

## 內容
- 💬 心靈金句 `quotes.html`：35 句，每日一句、一鍵複製
- 📖 療癒寓言 `stories.html` + `fable-*.html`：6 篇睡前短篇
- 🎮 100 款互動遊戲 `games.html` + `play.html`：10 玩法、難度、每日挑戰、彩帶
- 🔮 心理測驗 `quiz.html`：今天需要哪一種療癒
- 🌿🖼️ 四季畫廊 / 貼圖：桌布貼圖下載
- 🛍️👑 周邊商店 / 會員方案：變現管道

## 商業模式
💬 金句免費分享(攬流量) → 👑 會員訂閱(NT$99/299/699) → 🛍️ 周邊電商 → 🐾 zootecture 寵物聯名分潤

## 素材
全部使用本機 `D:\_SK333` 既有 infucoco 插畫（月亮、螢火蟲、四季、寵物、咖啡、書等療癒主題），複製至 `assets/webp/`（54 張 webp）。角色定版不變（雙丸子頭＋紅髮圈、紅白橫紋短袖＋藍吊帶、零文字）。

## 技術架構
```
D:\www\infucoco_healing\
├── index/quotes/stories/fable-*6/games/play/quiz
├── gallery/stickers/shop/member/about/sitemap.html   (共 18)
├── css/main.css        # 療癒系 4配色×日夜=8主題
├── js/config.js        # 主題/I18N
├── js/quotes.js        # 35金句 + 心理測驗
├── js/stories.js       # 6 寓言
├── js/service.js       # 收藏/統計/最佳/每日/CSV
├── js/utils.js         # 粒子/流星/彩帶/麵包屑/工具
├── js/games/games-data.js  # 100 款(含難度 lv)
├── js/games/games.js       # 10 引擎
├── assets/webp/*.webp      # 54 張本機素材
└── _gen_pages.py / _gen_games.py  # 生成腳本
```

## 開啟方式
直接雙擊 `index.html`（或拖入瀏覽器）即可。支援 8 主題切換、快捷鍵（/ 搜尋、R 隨機、Esc）、側欄、麵包屑、防複製、RWD。

© 2026 INFUCOCO 療癒宇宙
