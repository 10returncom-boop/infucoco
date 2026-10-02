# -*- coding: utf-8 -*-
# 全面檢查所有圖片引用（含 JS 動態陣列），確認 assets/webp 存在
import io, os, re
ROOT=r"D:\www\infucoco_healing"
webp_dir=os.path.join(ROOT,"assets","webp")
have=set(os.listdir(webp_dir))
bad=[]
found=set()

def scan_text(c, src):
    # 1) 完整路徑 assets/webp/xxx.webp
    for m in re.finditer(r'assets/webp/([a-z0-9_]+\.webp)', c):
        found.add(m.group(1))
    # 2) img:"xxx" (quotes/stories)
    for m in re.finditer(r'img:"(infucoco_[a-z0-9_]+)"', c):
        found.add(m.group(1)+".webp")
    # 3) JS 陣列內的 infucoco_xxx 名稱（thumbs/G/S/P 陣列元素）
    for m in re.finditer(r'"((?:infucoco_)?[a-z0-9_]+)"', c):
        nm=m.group(1)
        if nm.startswith("infucoco_") and ".webp" not in nm:
            found.add(nm+".webp")

for fn in os.listdir(ROOT):
    if fn.endswith(".html") or fn.endswith(".js"):
        p=os.path.join(ROOT,fn)
        c=io.open(p,encoding="utf-8").read()
        scan_text(c,fn)

for fn in os.listdir(os.path.join(ROOT,"js","games")):
    c=io.open(os.path.join(ROOT,"js","games",fn),encoding="utf-8").read()
    scan_text(c,fn)

for f in sorted(found):
    if f not in have:
        bad.append(f)

print("圖片引用點總數:", len(found))
print("缺失:", bad if bad else "無，全部存在")
