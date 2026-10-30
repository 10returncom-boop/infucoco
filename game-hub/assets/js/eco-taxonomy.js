/* ============================================================
 * 電玩數位產業商業邏輯生態鏈 — 八層分類 × 兩層子類
 * 結構：L1（8大分類）→ L2（子類）→ L3（子子類）
 * 擴充方式：直接在對應節點的 children 陣列新增物件即可
 * ============================================================ */

const ECO_TAXONOMY = [
  {
    id: "content",
    name: "內容生產鏈",
    en: "Content Production",
    icon: "🎨",
    color: "#22d3ee",
    desc: "從IP概念到可玩成品的完整生產過程",
    children: [
      {
        id: "dev-studio",
        name: "遊戲研發",
        en: "Game Development",
        children: [
          { id: "studio-aaa", name: "3A工作室" },
          { id: "studio-indie", name: "獨立團隊／AA" },
          { id: "studio-outsource", name: "外包製作" },
          { id: "engine-tool", name: "引擎與中間件" },
          { id: "ai-dev", name: "AI輔助開發" }
        ]
      },
      {
        id: "ip-assets",
        name: "IP與素材",
        en: "IP & Assets",
        children: [
          { id: "ip-original", name: "原創IP" },
          { id: "ip-license", name: "授權改編" },
          { id: "ip-crossmedia", name: "跨媒體IP" },
          { id: "art-asset", name: "美術素材庫" },
          { id: "audio-asset", name: "音效配樂" }
        ]
      },
      {
        id: "design-process",
        name: "設計流程",
        en: "Design Process",
        children: [
          { id: "game-design", name: "遊戲企劃／GDD" },
          { id: "level-design", name: "關卡設計" },
          { id: "system-design", name: "系統／數值設計" },
          { id: "ux-design", name: "UX／介面設計" },
          { id: "playtest", name: "遊玩測試迭代" }
        ]
      }
    ]
  },
  {
    id: "publishing",
    name: "發行營運鏈",
    en: "Publishing & LiveOps",
    icon: "📢",
    color: "#22c55e",
    desc: "把遊戲送到玩家手上並持續經營的過程",
    children: [
      {
        id: "pub-model",
        name: "發行模式",
        en: "Publishing Models",
        children: [
          { id: "pub-self", name: "自營自發" },
          { id: "pub-third", name: "第三方發行" },
          { id: "pub-agent", name: "代理發行（區域）" },
          { id: "pub-co", name: "共同發行" },
          { id: "pub-white", name: "白牌／OEM" }
        ]
      },
      {
        id: "liveops",
        name: "營運維運",
        en: "Live Operations",
        children: [
          { id: "event-planning", name: "版本／活動企劃" },
          { id: "community-mgmt", name: "社群管理" },
          { id: "customer-service", name: "客服系統" },
          { id: "data-ops", name: "數據監控與最佳化" },
          { id: "bugfix", name: "除錯與更新" }
        ]
      },
      {
        id: "localization",
        name: "在地化",
        en: "Localization",
        children: [
          { id: "lang-translate", name: "語言翻譯" },
          { id: "cultural-adapt", name: "文化適配" },
          { id: "voiceover", name: "語音配音" },
          { id: "reg-adapt", name: "法規在地化" },
          { id: "market-adapt", name: "行銷素材在地化" }
        ]
      }
    ]
  },
  {
    id: "platform",
    name: "平台通路鏈",
    en: "Platform & Distribution",
    icon: "💿",
    color: "#facc15",
    desc: "遊戲銷售、下載與存取的載體與管道",
    children: [
      {
        id: "digital-store",
        name: "數位商店",
        en: "Digital Storefronts",
        children: [
          { id: "store-pc", name: "PC（Steam／Epic）" },
          { id: "store-mobile", name: "行動（App Store／Google Play）" },
          { id: "store-console", name: "主機（PS／Xbox／Switch）" },
          { id: "store-pc-launcher", name: "第三方啟動器" },
          { id: "store-web", name: "瀏覽器／Web遊戲" }
        ]
      },
      {
        id: "cloud-stream",
        name: "雲端串流",
        en: "Cloud Gaming",
        children: [
          { id: "cloud-xbox", name: "Xbox Cloud" },
          { id: "cloud-geforce", name: "GeForce Now" },
          { id: "cloud-ps", name: "PS Plus Premium" },
          { id: "cloud-stadia-like", name: "其他串流服務" },
          { id: "cloud-tech", name: "串流技術供應商" }
        ]
      },
      {
        id: "retail-physical",
        name: "實體通路",
        en: "Physical Retail",
        children: [
          { id: "retail-chain", name: "連鎖賣店" },
          { id: "retail-ecom", name: "電商平台" },
          { id: "retail-used", name: "二手市場" },
          { id: "retail-collector", name: "限定版／典藏版" },
          { id: "retail-import", name: "平行輸入／水貨" }
        ]
      }
    ]
  },
  {
    id: "infrastructure",
    name: "硬體基建鏈",
    en: "Hardware & Infrastructure",
    icon: "🔧",
    color: "#f97316",
    desc: "支撐遊戲開發與運行的技術基礎設施",
    children: [
      {
        id: "hardware-device",
        name: "遊戲硬體",
        en: "Gaming Hardware",
        children: [
          { id: "hw-console", name: "家用主機" },
          { id: "hw-pc", name: "電競PC／零組件" },
          { id: "hw-handheld", name: "掌機／手遊裝置" },
          { id: "hw-accessory", name: "周邊配件（搖桿／耳機）" },
          { id: "hw-arcade", name: "機台／營業用硬體" }
        ]
      },
      {
        id: "server-cloud",
        name: "伺服器與雲端",
        en: "Server & Cloud",
        children: [
          { id: "game-server", name: "遊戲專用伺服器" },
          { id: "cdn", name: "CDN／頻寬" },
          { id: "database", name: "資料庫與後端" },
          { id: "cloud-gpu", name: "GPU運算（AI訓練／轉譯）" },
          { id: "monitoring", name: "監控與除錯工具" }
        ]
      },
      {
        id: "payment-infra",
        name: "支付與金流",
        en: "Payment Infrastructure",
        children: [
          { id: "payment-gateway", name: "金流閘道" },
          { id: "payment-pointcard", name: "點卡／預付卡" },
          { id: "payment-wallet", name: "電子錢包" },
          { id: "payment-crypto", name: "加密貨幣區塊鏈" },
          { id: "payment-refund", name: "退款／爭議處理" }
        ]
      }
    ]
  },
  {
    id: "monetization",
    name: "商業變現鏈",
    en: "Monetization",
    icon: "💰",
    color: "#ef4444",
    desc: "從玩家獲取收入的各種商業模式組合",
    children: [
      {
        id: "business-model",
        name: "付費模式",
        en: "Business Models",
        children: [
          { id: "model-buyout", name: "買斷制" },
          { id: "model-f2p", name: "免費遊玩＋課金" },
          { id: "model-subscription", name: "訂閱制（Game Pass）" },
          { id: "model-ad", name: "廣告變現" },
          { id: "model-bundle", name: "組合包／綁定" }
        ]
      },
      {
        id: "in-game-economy",
        name: "遊戲內經濟",
        en: "In-Game Economy",
        children: [
          { id: "econ-skin", name: "虛寶／造型外觀" },
          { id: "econ-battlepass", name: "戰鬥通行證" },
          { id: "econ-gacha", name: "轉蛋／抽卡" },
          { id: "econ-trade", name: "玩家間交易市場" },
          { id: "econ-cosmetic", name: "付費DLC／資料片" }
        ]
      },
      {
        id: "merch-license",
        name: "周邊與授權",
        en: "Merchandise & Licensing",
        children: [
          { id: "merch-physical", name: "實體周邊（公仔／海報）" },
          { id: "merch-collab", name: "品牌聯名合作" },
          { id: "merch-theme", name: "主題樂園／餐廳" },
          { id: "merch-publishing", name: "實體出版（畫冊／小說）" },
          { id: "merch-ip-license", name: "IP授權金" }
        ]
      }
    ]
  },
  {
    id: "creator",
    name: "創作者生態鏈",
    en: "Creator Ecosystem",
    icon: "🎬",
    color: "#a78bfa",
    desc: "圍繞遊戲生長出的二次創作與內容經濟",
    children: [
      {
        id: "streamer",
        name: "直播與影音",
        en: "Streaming & Video",
        children: [
          { id: "stream-live", name: "實況主（Twitch／YT）" },
          { id: "stream-short", name: "短影音（抖音／TikTok）" },
          { id: "stream-editor", name: "剪輯／精華二次創作" },
          { id: "stream-vtuber", name: "VTuber／虛擬主播" },
          { id: "stream-network", name: "MCN／經紀網路" }
        ]
      },
      {
        id: "ugc-mod",
        name: "UGC與模組",
        en: "UGC & Modding",
        children: [
          { id: "mod-community", name: "模組社群（Steam Workshop）" },
          { id: "mod-map-editor", name: "地圖／關卡編輯器" },
          { id: "mod-game-maker", name: "遊戲創作工具（Roblox／Unity）" },
          { id: "mod-doujin", name: "同人創作／二次創作" },
          { id: "mod-tournament", name: "玩家自辦賽事" }
        ]
      },
      {
        id: "knowledge",
        name: "知識與評測",
        en: "Knowledge & Review",
        children: [
          { id: "rev-reviewer", name: "遊戲評測媒體" },
          { id: "rev-guide", name: "攻略／维基編輯" },
          { id: "rev-analyst", name: "產業分析師／研究報告" },
          { id: "rev-academia", name: "學術研究／遊戲學" },
          { id: "rev-education", name: "遊戲教學／課程" }
        ]
      }
    ]
  },
  {
    id: "regulation",
    name: "法規合規鏈",
    en: "Regulation & Compliance",
    icon: "⚖️",
    color: "#64748b",
    desc: "遊戲產業面對的法律、審查與道德邊界",
    children: [
      {
        id: "rating",
        name: "分級與審查",
        en: "Rating & Classification",
        children: [
          { id: "rating-tw", name: "台灣分級（遊戲分級辦法）" },
          { id: "rating-esrb", name: "ESRB（北美）" },
          { id: "rating-peer", name: "PEGI（歐洲）" },
          { id: "rating-cn", name: "中國版號審批" },
          { id: "rating-cero", name: "CERO（日本）" }
        ]
      },
      {
        id: "consumer-protect",
        name: "消費者保護",
        en: "Consumer Protection",
        children: [
          { id: "protect-minor", name: "未成年保護／防沉迷" },
          { id: "protect-gacha", name: "轉蛋機率揭露規範" },
          { id: "protect-refund", name: "退款爭議處理" },
          { id: "protect-ad", name: "廣告不實規範" },
          { id: "protect-data", name: "個資保護（個資法／GDPR）" }
        ]
      },
      {
        id: "ip-law",
        name: "智財與法律",
        en: "IP & Legal",
        children: [
          { id: "law-copyright", name: "著作權保護" },
          { id: "law-patent", name: "遊戲專利" },
          { id: "law-contract", name: "開發商／發行商合約" },
          { id: "law-labor", name: "勞動法／加班爭議" },
          { id: "law-esports", name: "電競選手契約" }
        ]
      }
    ]
  },
  {
    id: "player",
    name: "玩家需求鏈",
    en: "Players & Demand",
    icon: "👥",
    color: "#06b6d4",
    desc: "終端消費者的結構、行為與回饋機制",
    children: [
      {
        id: "segment",
        name: "玩家族群",
        en: "Player Segments",
        children: [
          { id: "seg-core", name: "核心玩家（Hardcore）" },
          { id: "seg-casual", name: "休閒玩家（Casual）" },
          { id: "seg-competitive", name: "競技型玩家" },
          { id: "seg-social", name: "社交型玩家" },
          { id: "seg-elderly", name: "高齡／新興族群" }
        ]
      },
      {
        id: "community",
        name: "社群與參與",
        en: "Community & Engagement",
        children: [
          { id: "comm-official", name: "官方社群（Discord／FB）" },
          { id: "comm-forum", name: "討論區／論壇（PTT／Reddit）" },
          { id: "comm-event", name: "實體見面會／粉絲活動" },
          { id: "comm-beta", name: "封測／玩家測試招募" },
          { id: "comm-feedback", name: "意見回饋機制" }
        ]
      },
      {
        id: "data-feedback",
        name: "數據與回饋",
        en: "Data & Feedback Loop",
        children: [
          { id: "data-playtime", name: "遊玩時長與留存" },
          { id: "data-spend", name: "付費轉換率" },
          { id: "data-sentiment", name: "情緒分析／聲量監測" },
          { id: "data-ux", name: "UX可用性測試" },
          { id: "data-retention", name: "流失原因分析" }
        ]
      }
    ]
  }
];

/* 擴充範例：若要新增第9大分類，直接在陣列尾端 push：
 * ECO_TAXONOMY.push({ id:"", name:"", en:"", icon:"", color:"", desc:"", children:[...] });
 */
