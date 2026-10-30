# infucoco遊戲追追追追｜電玩無止境 — 網站規格快照

> 最後更新：2026-10-23  
> 根目錄：`D:\_www_325_game\電玩百與產業鏈生態\`

---

## 1. 品牌資訊

| 項目 | 值 |
|---|---|
| 品牌名 | infucoco遊戲追追追追 |
| 副標 | 電玩無止境 |
| 英文 slogan | infucoco遊戲追追追追 — 電玩無止境 |
| 字源 | im-（without 無）+ sequ（chase 追尋），聽感彩蛋 I am Sek |
| 定位 | 電玩與數位創作平台，從晶片到玩家桌上的完整產業鏈 |

---

## 2. 目錄結構

```
電玩百與產業鏈生態/
├── index.html          ← 主入口（單頁站）
├── about.html          ← 關於 infucoco遊戲追追追追
├── SITE_SPEC.md        ← 本規格文件
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   │   └── style.css   ← 全站樣式
│   ├── js/
│   │   └── main.js     ← 全站互動邏輯
│   └── images/         ← webp 圖片素材
├── pages/
│   ├── ai-visual.html
│   ├── knowledge.html
│   ├── aesthetics.html
│   ├── zootecture.html
│   └── journal.html
└── games/              ← 87+ 款線上小遊戲
    ├── doubao10/
    ├── infucoco遊戲追追追追/
    └── 50-greatest/
```

---

## 3. 頁面區塊順序（index.html）

| # | 區塊 | 說明 |
|---|---|---|
| 1 | Header | 品牌 Logo + MegaMenu 按鈕 + 主題切換 |
| 2 | 跑馬燈 | 深藍→深咖漸層背景，白色文字 |
| 3 | Breadcrumb | 首頁 / infucoco遊戲追追追追｜電玩產業鏈生態 |
| 4 | Hero | 大標「infucoco遊戲追追追追｜電玩無止境」 |
| 5 | infucoco遊戲追追追追遊樂場 | Treemap 分類 + 遊戲卡 3D 翻牌 |
| 6 | 五大主題分類 | 5 張方形卡（AI視覺/圖解知識/美學藏品/Zootecture/創作日誌） |
| 7 | 市場數據看板 | 8 張 KPI 數據卡 |
| 8 | 電玩產業鏈生態地圖 | 5 層 accordion 摺疊式 |
| 9 | 產業新聞彙整 | 2 欄 Blog 格式 + 分類篩選 + 搜尋 + 分頁 |
| 10 | 最新作品 | 12 張 3D 翻牌作品牆（9:16） |
| 11 | Footer | 4 欄網站地圖 + 版權 |

---

## 4. 配色系統

### 深色主題（預備）
```
--bg:#0a0e15          深黑藍底色
--bg-panel:#121a29     面板深灰藍
--bg-panel2:#162032
--line:#1e2d44        線條
--cyan:#22d3ee        強色
--violet:#8b5cf6      強色
--text:#e2e8f0        主要文字
--text-dim:#94a3b8    次要文字
--text-mute:#64748b   弱化文字
--grad:linear-gradient(135deg,#22d3ee,#8b5cf6)
```

### 淺色主題（body.light，目前預設）
```
--bg:#f5f7fa          淺灰白底
--bg-panel:#ffffff    白色面板
--bg-panel2:#eef2f7
--line:#d8dee8        淺灰線條
--cyan:#0891b2        深青色
--violet:#7c3aed      深紫色
--text:#1e293b        深色文字
--text-dim:#64748b
--text-mute:#94a3b8
--grad:linear-gradient(135deg,#0891b2,#7c3aed)
```

### Header / Footer / 跑馬燈
```
背景：linear-gradient(135deg,#0f1b2d 0%,#2a1f14 100%)
     深藍 → 深咖漸層
文字：#e2e8f0（淺色）
強調：#22d3ee（cyan）
```

---

## 5. 字體

| 用途 | 字體 |
|---|---|
| 中文 | Noto Sans TC |
| 英文 | Inter |
|  fallback | -apple-system, Segoe UI, Microsoft JhengHei |

---

## 6. 互動元件

### 6.1 MegaMenu
- 5 欄分類：AI視覺 / 圖解知識 / 美學藏品 / Zootecture / 創作日誌
- 每欄 4 個子連結
- 點擊 MegaMenu 按鈕展開/收合

### 6.2 主題切換
- 右上角按鈕：☀️（淺色）/ ☾（深色）
- 切換 `body.light` class

### 6.3 Treemap 遊樂場
- Squarify 演算法排版
- 11 個分類（街機動作/益智方塊/棋藝策略/反應極限/記憶配對/消除連連/桌機運氣/經典街機/解謎冒險/打字心算）
- 點擊分類 → 下方顯示遊戲卡網格
- 遊戲卡 3D 翻牌：hover 時 rotateY(180deg)，背面為漸層背景+白字

### 6.4 五大主題分類
- 5 張方形卡（aspect-ratio: 1/1）
- 每張卡含 webp 背景圖（18% 透明度）+ emoji icon + 標題 + 描述
- hover 時上浮 + 陰影加深

### 6.5 產業鏈 Accordion
- 5 層：內容與開發 / 發行與通路 / 平台與硬體 / 變現與生態 / 玩家需求
- 預設展開第一層
- 點擊展開/收合，箭頭旋轉 180°
- 每層 header 含 webp 背景圖（10% 透明度）

### 6.6 產業新聞
- 8 分類：市場脈動 / 開發與AI / 平台發行 / 硬體裝置 / 雲端串流 / 電競賽事 / 台灣產業 / 資本財報
- Blog 格式：單欄底部分隔線，hover 左縮排
- 2 欄排版（700px 以上）
- 分頁：每頁 10 則，上一頁/下一頁按鈕
- 搜尋：即時篩選

### 6.7 最新作品牆
- 12 張 3D 翻牌卡
- 正面：webp 背景圖 + 底部標題+標籤
- 背面：漸層背景 + 標題 + 描述 + 標籤
- hover 翻轉 180°

---

## 7. 圖片素材

### 既有 webp（11 張）
- arcade_action.webp, chess_strategy.webp, classic_arcade.webp
- eliminate_link.webp, infucoco.webp, memory_match.webp
- puzzle_adventure.webp, puzzle_block.webp, reaction_limit.webp
- table_luck.webp, typing_math.webp

### 五大主題卡背景
- cat-ai → infucoco.webp
- cat-knowledge → puzzle_block.webp
- cat-aesthetics → puzzle_adventure.webp
- cat-zootecture → memory_match.webp
- cat-journal → typing_math.webp

### 產業鏈 accordion 背景
- 內容與開發 → arcade_action.webp
- 發行與通路 → table_luck.webp
- 平台與硬體 → classic_arcade.webp
- 變現與生態 → reaction_limit.webp
- 玩家需求 → eliminate_link.webp

---

## 8. 市場數據看板（8 項）

| 指標 | 數值 | 來源 |
|---|---|---|
| 全球市場 2026 | 2,139 億美元 | Newzoo |
| 2028 市場預測 | 2,344 億美元 | CAGR 5.1% |
| A股 2025 淨利 | +115% | 年增 |
| Switch 2 累計 | 2,368 萬台 | 截至 2026/6/30 |
| 中國版號 2025 | 1,676 款 | 年增 28.33% |
| 智冠 EPS | 7.93 元 | 創十年新高 |
| 台北電玩展 | 37 萬人次 | 四天到場 |
| 雲端遊戲市場 | 287 億美元 | IDC CAGR 31.4% |

---

## 9. 注意事項

- 預設主題為淺色（body.light）
- Header / Footer / 跑馬燈為深藍→深咖漸層
- 全站背景帶淡網格線 +  radial 光暈（極低透明度）
- 所有卡片均有 box-shadow
- 遊戲卡翻牌 CSS 已多次修正，目前使用 `.grid .card .inner` 結構
