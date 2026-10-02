# -*- coding: utf-8 -*-
# 生成 games-data.js：100 款 infucoco 療癒遊戲（含難度 lv、6分類、10玩法）
import io

CAT = ["react","puzzle","fable","pet","arcade","creative"]
CAT_N = [17,17,17,16,16,17]

REACT = ["接住彩虹氣球","星星收集器","拯救飄落的種子","捕捉發光的螢火蟲","接住流星糖","泡泡手指畫","點泡泡大賽","反應力挑戰","抓跳跳糖","踩到星星就得分","雲朵接物","花瓣收集","月亮鞦韆抓星","拯救小燈籠","彩虹泡泡接接樂","流星捕捉大師","影子捕捉師"]
REACT_TY = ["catch","catch","catch","catch","catch","whack","reaction","reaction","whack","whack","catch","catch","catch","catch","reaction","timing","reaction"]
REACT_I = ["🎈","⭐","🌱","✨","🌠","🫧","🫧","⚡","🍬","🌟","☁️","🌸","🌙","🏮","🌈","☄️","🌓"]

PUZZLE = ["配對·彩虹蛋","迷宮·星星之路","拼圖·月光碎片","數一數·螢火蟲","順序·四季列車","記憶·花園卡片","顏色·彩虹心情","天平·閃亮星星","找一找·藏起來的月亮","連連看·小宇宙","推理·星星密碼","時機·跳過雲洞","排列·星空拼圖","邏輯·螢火蟲排隊","算一算·星星糖果","記憶·動物夥伴","順序·銀河列車"]
PUZZLE_TY = ["memory","order","sequence","count","order","memory","match","count","order","match","quiz","timing","sequence","order","count","memory","sequence"]
PUZZLE_I = ["🥚","🛤️","🧩","🐛","🚂","🃏","🌈","⚖️","🌙","🔗","🔑","🕳️","🧩","🐝","🍬","🐾","🚆"]

FABLE = ["寓言問答·種子","寓言問答·螢火蟲","寓言問答·月亮","寓言問答·彩虹","寓言問答·煙火","寓言問答·書","寓言問答·咖啡","寓言問答·橋","寓言問答·雲朵","寓言問答·花園","寓言問答·海洋","寓言問答·星星","寓言問答·風箏","寓言問答·燈籠","寓言問答·雪人","寓言問答·向日葵","寓言問答·露珠"]
FABLE_TY = ["quiz"]*17
FABLE_I = ["🌱","✨","🌙","🌈","🎆","📖","☕","🌉","☁️","🌸","🌊","⭐","🪁","🏮","⛄","🌻","💧"]

PET = ["餵貓咪吃魚","幫小狗洗澡","給花澆水","療癒抱抱計時","貓咪散步節奏","數貓咪抓尾巴","水豚泡澡","小鳥飛舞抓食","摸兔兔耳朵","寵物美容順序","狗狗接飛盤","小貓追毛線球","療癒咕嚕聲記憶","餵金魚","幫小鳥梳羽毛","小刺蝟滾球"]
PET_TY = ["catch","timing","catch","timing","reaction","count","match","catch","whack","order","catch","reaction","memory","timing","order","match"]
PET_I = ["🐟","🛁","💧","🤗","🐈","🐱","🦫","🐦","🐰","✂️","🥏","🧶","😽","🐠","🪶","🦔"]

ARCADE = ["點泡泡大賽","打地鼠·小怪獸","按節奏·拍拍手","猜拳·贏過infucoco","彈跳·氣球保衛","轉盤·幸運星","抓娃娃·星星","賽跑·跨欄","釣魚·星之河","滾球·彈珠台","射擊·泡泡槍","平衡·疊疊樂","套圈·圈星星","反應·躲隕石","節奏·鼓點","彈跳·跳跳糖"]
ARCADE_TY = ["reaction","whack","timing","quiz","reaction","timing","whack","reaction","timing","reaction","reaction","order","match","reaction","timing","whack"]
ARCADE_I = ["🫧","🦔","👏","✌️","🎈","🎡","🧸","🏃","🎣","🪙","🔫","🧱","⭕","☄️","🥁","🍬"]

CREATIVE = ["故事接龍·給infucoco","畫一道彩虹","幫角色挑衣服","寫一句療癒語","配色·心情調色盤","給小動物取名","編一支小舞步","設計一張貼圖","選一首歌給今天","幫花園種新花","寫一封信給未來","做一張療癒卡片","幫星星排隊形","發明一個新動物","幫infucoco找回家的路","編一首搖籃曲","設計一個小島"]
CREATIVE_TY = ["sequence","match","order","count","order","quiz","sequence","timing","quiz","sequence","order","timing","sequence","quiz","order","sequence","quiz"]
CREATIVE_I = ["📖","🌈","👗","💬","🎨","🐾","💃","🖼️","🎵","🌷","✉️","💌","⭐","🦄","🏡","🎶","🏝️"]

def build():
    out=["/* INFUCOCO 療癒宇宙 — 100 款療癒遊戲資料（含難度 lv） */","window.GAMES=["]
    idx=1
    for ci,cat in enumerate(CAT):
        pool={"react":(REACT,REACT_TY,REACT_I),"puzzle":(PUZZLE,None,PUZZLE_I),"fable":(FABLE,None,FABLE_I),
              "pet":(PET,None,PET_I),"arcade":(ARCADE,None,ARCADE_I),"creative":(CREATIVE,None,CREATIVE_I)}[cat]
        names,types,icons=pool[0],pool[1],pool[2]
        for j in range(CAT_N[ci]):
            gid="g"+str(idx).zfill(2)
            lv=3 if idx%3==0 else (2 if idx%3==1 else 1)
            ty=types[j] if types else names_to_ty(names[j])
            i=icons[j]
            t=names[j]
            # 描述
            d=describe(ty,t)
            comma="," if (ci<len(CAT)-1 or j<CAT_N[ci]-1) else ""
            out.append(f'{{id:"{gid}",lv:{lv},t:"{t}",c:"{cat}",ty:"{ty}",i:"{i}",d:"{d}",p:2}}{comma}')
            idx+=1
    out.append("];")
    out.append("window.GAME_MAP={};")
    out.append("GAMES.forEach(function(g){GAME_MAP[g.id]=g});")
    return "\n".join(out)

def names_to_ty(n):
    m={"配對":"memory","迷宮":"order","拼圖":"sequence","數一數":"count","順序":"order","記憶":"memory","顏色":"match","天平":"count","找一找":"order","連連看":"match","推理":"quiz","時機":"timing","排列":"sequence","邏輯":"order","算一算":"count","動物夥伴":"memory","銀河列車":"sequence"}
    for k,v in m.items():
        if k in n: return v
    return "quiz"

def describe(ty,t):
    d={
      "catch":"接住所有落下的療癒小物，別讓它們掉落。",
      "whack":"看到目標就點下去，考驗你的反應力。",
      "memory":"翻開兩張牌，找出相同的那一對。",
      "quiz":"回答療癒小問題，看看你多了解 infucoco。",
      "timing":"在對的時機按下去，節奏感大考驗。",
      "reaction":"快速反應，抓到就得分！",
      "count":"數一數有幾個，填上正確答案。",
      "order":"按正確順序排列，考驗邏輯。",
      "match":"把相同主題連在一起。",
      "sequence":"記住順序，跟著重現。"
    }
    return d.get(ty,"跟著 infucoco 一起玩的小遊戲。")

js=build()
with io.open(r"D:\www\infucoco_healing\js\games\games-data.js","w",encoding="utf-8") as f:
    f.write(js)
print("generated games:", js.count('id:"g'))
print("lines:", len(js.splitlines()))
