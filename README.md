# INFUCOCO V6 — 沉浸式場景 · 翻轉雜誌

**第 6 版「更特殊版型」**：擺脫 V5 霓虹暗黑，改走「**沉浸式場景 × 翻轉雜誌**」——全屏場景照片當主視覺、奶油紙感底、不對稱 Bento 網格、3D 翻轉卡、視差滾動、斜切分區、巨型錯位標題。素材改用 `D:\github.com_10returncom-boop_infucoco_v4\images\infucoco_media` 的照片（已轉 webp）。

- **版本**：v6.0.0
- **位置**：`D:\www\infucoco_v6`
- **IP 角色**：infucoco（sk333 v1.2）——黑髮雙丸子頭＋紅色髮圈、齊瀏海；圓黑眼、粉腮紅；紅白橫紋短袖＋藍色吊帶褲；可愛手繪插畫。畫面零文字。

## 特殊版型特點（與 V5 完全不同）
- **全屏沉浸式 Hero**：場景照片做全屏背景＋漸層遮罩＋巨型三行錯位標題（INFU / COCO ✦ / 怪美宇宙）＋印章戳章
- **Bento 不對稱網格**：`grid-column/row span` 混排（big / w2 / 1×1），讓照片卡錯落有致
- **3D 翻轉卡**：寓言/貼圖 hover 翻面（正面照片、背面文字＋讀全文）
- **斜切分區 + 巨型章節編號**：`clip-path` 斜切帶，`01/場景 02/寓言` 大型編號
- **紙感配色**：奶油底 `#FBF6EC`＋暖橘 `#E8843C`＋墨黑字，照片成為主角（對比 V5 深紫霓虹）

## 頁面（18）
index（沉浸 Hero＋Bento 場景＋翻轉寓言＋熱門遊戲）｜quotes（怪美金句 35）｜stories（寓言 6＋翻轉）｜fable-*（6 篇詳情）｜games（100 款＋分類）｜play（播放器，引擎已修）｜quiz（心理測驗）｜gallery（infu空間 16 桌布 Bento）｜stickers（貼圖 12）｜shop（周邊 8）｜member（會員 3）｜about（品牌＋開發者 credit）｜sitemap（地圖）

## 功能
- 全站站內導覽 explore（Bento 交叉圖卡，頁頁相連）
- Popover Dropdown 進階工具（⚙️：隨機/跳轉/最愛/最近/分類/CSV/配色/語言/地圖）
- 100 款互動遊戲（10 引擎，play 以 `GameEngines[g.ty](g)` 正確啟動）
- 粒子背景、回到頂部、toast、動態 reveal

## 素材提示詞（infucoco_media 照片轉 webp，4 組 SEO 關鍵字）
`assets/media/`（24 張，原 `image.png (67)~(90)`，已縮 1200px／webp q84）：
- `infucoco_door_glove_pet_welcome.webp`：門口戴手套迎貓/兔/狗，窗外圓月（首頁 Hero）
- `infucoco_blanket_pet_sit_night.webp`：夜晚裹毯坐地，貓狗兔相伴（測驗卡）
- `infucoco_window_dog_cuddle_moon.webp`：夜窗月＋小狗依偎
- `infucoco_hide_seek_cat_sofa.webp`：捉迷藏，貓從抱枕探頭
- `infucoco_entrance_squat_pet_mat.webp`：玄關蹲地墊
- `infucoco_folding_clothes_pet_moon.webp`：折衣＋窗外月
- `infucoco_kitchen_cat_bowl_morning.webp`：廚房早晨
- `infucoco_home_reading_pet_lamp`／`living_cat_sofa_warm`／`garden_rabbit_flower_sun`／`balcony_plant_cat_day`／`stair_cat_follow_sunlight`／`tea_table_pet_chat_warm`／`pillow_cat_cuddle_sleep`／`desk_sketch_pet_lamp`／`window_rain_pet_inside`／`bookshelf_cat_read_light`／`floor_puzzle_pet_play`／`kitchen_dinner_pet_wait`／`sofa_blanket_cat_snuggle`／`night_terrace_star_pet`／`mirror_dress_pet_watch`／`corridor_cat_welcome_home`

`assets/webp/`：沿用既有 68 張 IP 插畫（金句/寓言/遊戲/貼圖/桌布用）。

## Hero 影片（LV 高級感 × infucoco）
- `assets/video/hero.mp4`（8 秒，16:9，seedance_2.0_fast）
- 圖生影片：以 `infucoco_door_glove_pet_welcome.webp`（角色全身照）為參考，保持 IP 特徵（雙丸子頭＋紅髮圈、齊瀏海、紅白橫紋＋藍吊帶褲）
- 提示詞：參考 Louis Vuitton 精品廣告，暗色高質感背景＋金色絲綢光影＋柔光暈染，角色在金光下，鏡頭極緩慢向前推，微微轉頭、眼睫低垂、髮絲輕拂；純視覺氛圍、無字幕
- 首頁 Hero 以 `<video autoplay muted loop playsinline>` 全屏背景播放（照片作 poster／fallback）

## 生成腳本
- `_gen_pages.py`：統一 HEAD/nav/footer/popover/explore/cache-busting（`?v=20261003v6`）
- `_conv.py`：把 infucoco_media PNG 轉 webp 的批次腳本
