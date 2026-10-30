#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
infucoco.com 自動建置 + SEO 推送腳本
功能：
  1. 全站 HTML 掃描 → 自動產生 sitemap.xml
  2. 百度資源平台 主動推送（data.zz.baidu.com）
  3. 百度快速收錄通道（type=batch）
  4. IndexNow 協議（Bing / Yandex / Seznam）
  5. 狀態追蹤（.seo_state.json），只推送新增/更新頁
用法：
  python build.py            # 完整建置 + 推送所有新頁
  python build.py --sitemap  # 只產生 sitemap，不推送
  python build.py --push     # 只推送上次以來的新頁
"""

import os
import re
import sys
import json
import hashlib
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timezone

# ============ 設定區（請填入你的金鑰） ============
SITE_ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_URL  = "https://infucoco.com"

# 百度資源平台 → 網站管理 → 鏈接提交 → 主動推送 → 複製 token
BAIDU_SITE  = "https://infucoco.com"
BAIDU_TOKEN = "YOUR_BAIDU_TOKEN_HERE"   # ← 換成你的 token

# IndexNow 金鑰（自己產一組隨機字串，需上傳 KEY.txt 到站台根目錄）
INDEXNOW_KEY       = "infucoco2026seo8f3a9b1c"
INDEXNOW_KEY_PATH  = f"{BASE_URL}/{INDEXNOW_KEY}.txt"
INDEXNOW_ENDPOINTS = [
    "https://api.indexnow.org/IndexNow",
    "https://www.bing.com/indexnow",
]

# 狀態檔
STATE_FILE = os.path.join(SITE_ROOT, ".seo_state.json")
SITEMAP_FILE = os.path.join(SITE_ROOT, "sitemap.xml")

# 排除規則（不進 sitemap / 不推送）
EXCLUDE_DIRS = {"_backup", "_shots", ".git", "__pycache__", "node_modules"}
EXCLUDE_FILES = {"404.html"}
EXCLUDE_PATTERNS = [r"play\.html@", r"backup", r"\.bak$"]
# ================================================


def log(msg):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def scan_html_files():
    """掃描全站 .html 檔，回傳 (相對路徑, 修改時間) 清單"""
    results = []
    for dirpath, dirnames, filenames in os.walk(SITE_ROOT):
        # 排除目錄
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS and not d.startswith(".")]
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            if fn in EXCLUDE_FILES:
                continue
            if any(re.search(p, fn) for p in EXCLUDE_PATTERNS):
                continue
            full = os.path.join(dirpath, fn)
            rel = os.path.relpath(full, SITE_ROOT).replace("\\", "/")
            mtime = os.path.getmtime(full)
            results.append((rel, mtime))
    return sorted(results)


def rel_to_url(rel_path):
    """相對路徑 → 完整 URL（自動 URL encode 非 ASCII）"""
    parts = rel_path.split("/")
    encoded_parts = [urllib.parse.quote(p, safe="") for p in parts]
    return f"{BASE_URL}/" + "/".join(encoded_parts)


def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"pushed": {}, "last_build": None}


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def generate_sitemap(files):
    """產生 sitemap.xml"""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for rel, mtime in files:
        url = rel_to_url(rel)
        lastmod = datetime.fromtimestamp(mtime, timezone.utc).strftime("%Y-%m-%d")
        priority = "1.0" if rel == "index.html" else "0.7"
        lines.append(
            f"  <url><loc>{url}</loc>"
            f"<lastmod>{lastmod}</lastmod>"
            f"<changefreq>weekly</changefreq>"
            f"<priority>{priority}</priority></url>"
        )
    lines.append("</urlset>")
    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    log(f"📄 sitemap.xml 已產生（{len(files)} URL）")


def push_baidu(urls, fast=False):
    """百度主動推送
    fast=False → 一般主動推送
    fast=True  → 快速收錄通道（type=batch）
    """
    if not urls:
        return
    if "YOUR_BAIDU_TOKEN" in BAIDU_TOKEN:
        log("⚠️  百度 token 未設定，跳過百度推送")
        return

    endpoint = (
        f"http://data.zz.baidu.com/urls?"
        f"site={urllib.parse.quote(BAIDU_SITE)}&token={BAIDU_TOKEN}"
    )
    if fast:
        endpoint += "&type=batch"

    body = "\n".join(urls).encode("utf-8")
    req = urllib.request.Request(endpoint, data=body, method="POST")
    req.add_header("Content-Type", "text/plain; charset=utf-8")
    req.add_header("User-Agent", "curl/7.68.0")

    label = "快速收錄" if fast else "主動推送"
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            log(f"🔍 百度{label}: 成功 {result.get('success',0)} 筆, "
                f"剩額度 {result.get('remain','?')}, "
                f"未驗證 {result.get('not_same_site',0)}, "
                f"無效 {result.get('not_valid',0)}")
    except urllib.error.HTTPError as e:
        log(f"❌ 百度{label} HTTP {e.code}: {e.read().decode('utf-8','replace')}")
    except Exception as e:
        log(f"❌ 百度{label} 錯誤: {e}")


def push_indexnow(urls):
    """IndexNow 推送（Bing / Yandex / Seznam 共用）"""
    if not urls:
        return
    payload = {
        "host": "infucoco.com",
        "key": INDEXNOW_KEY,
        "keyLocation": INDEXNOW_KEY_PATH,
        "urlList": urls,
    }
    body = json.dumps(payload).encode("utf-8")

    for endpoint in INDEXNOW_ENDPOINTS:
        req = urllib.request.Request(endpoint, data=body, method="POST")
        req.add_header("Content-Type", "application/json; charset=utf-8")
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                short = endpoint.split("//")[1].split("/")[0]
                log(f"✅ IndexNow ({short}): HTTP {resp.status}, {len(urls)} URL")
        except urllib.error.HTTPError as e:
            short = endpoint.split("//")[1].split("/")[0]
            log(f"⚠️  IndexNow ({short}): HTTP {e.code}")
        except Exception as e:
            log(f"⚠️  IndexNow ({endpoint}): {e}")


def ensure_indexnow_key_file():
    """在站台根目錄產生 INDEXNOW_KEY.txt（Bing 驗證用）"""
    key_file = os.path.join(SITE_ROOT, f"{INDEXNOW_KEY}.txt")
    if not os.path.exists(key_file):
        with open(key_file, "w", encoding="utf-8") as f:
            f.write(INDEXNOW_KEY)
        log(f"🔑 已產生 {INDEXNOW_KEY}.txt")


def main():
    do_sitemap = "--sitemap" in sys.argv
    do_push = "--push" in sys.argv
    if not do_sitemap and not do_push:
        do_sitemap = do_push = True

    log("🚀 開始建置 infucoco.com")

    # 1. 掃描檔案
    files = scan_html_files()
    log(f"📂 掃描到 {len(files)} 個 HTML 頁")

    # 2. 產生 sitemap
    if do_sitemap:
        generate_sitemap(files)
        ensure_indexnow_key_file()

    # 3. 比對狀態，找出新頁/更新頁
    if do_push:
        state = load_state()
        pushed = state["pushed"]
        new_urls = []
        for rel, mtime in files:
            url = rel_to_url(rel)
            old_mtime = pushed.get(url)
            if old_mtime is None or mtime > old_mtime:
                new_urls.append(url)
                pushed[url] = mtime

        log(f"📊 新增/更新 URL: {len(new_urls)} 筆")

        if new_urls:
            # 百度一般推送
            push_baidu(new_urls, fast=False)
            # 百度快速收錄（批次）
            push_baidu(new_urls, fast=True)
            # IndexNow
            push_indexnow(new_urls)
        else:
            log("✅ 無新頁面需要推送")

        state["last_build"] = datetime.now(timezone.utc).isoformat()
        save_state(state)

    log("🎉 完成")


if __name__ == "__main__":
    main()
