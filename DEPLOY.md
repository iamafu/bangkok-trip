# DEPLOY.md

曼谷手冊（bangkok-trip）部署說明。

## Runtime

- 網站本身是純靜態 HTML／CSS／原生 JavaScript（ES Modules），沒有建置步驟，也沒有後端。
- 本機預覽腳本 `scripts/serve.mjs` 只使用 Node.js 內建模組，建議 Node.js 20.x。

## Environment Variables

無。本專案不需要任何環境變數。

## Required Services

- GitHub Pages（透過 GitHub Actions 發布）。
- 外部資源（瀏覽器端直接載入，不需帳號）：
  - Google Fonts（字型）
  - `i.ytimg.com`（YouTube 縮圖，點擊前使用）
  - `youtube-nocookie.com`（影片嵌入，點擊後才載入）
  - Google 地圖搜尋連結（周邊候選）

## Build & Start

- 建置：不需要。
- 本機預覽（在專案根目錄執行）：

```bash
node scripts/serve.mjs
```

然後開啟 http://localhost:8765/

## Ports

- 8765：只用於本機預覽（綁定 127.0.0.1）。線上版本由 GitHub Pages 提供，不使用此埠。

## Deploy Steps

1. 修改 `site/` 或 `data/` 的內容後，commit 並推送到 `master`。
2. `.github/workflows/pages.yml` 會自動觸發，只把 `site/` 發布到 GitHub Pages。
3. 線上網址：https://iamafu.github.io/bangkok-trip/
4. 注意：`data/` 變動後要同步複製到 `site/data/attractions.json`，網站才會讀到新資料。

## 公開程度

- repo：https://github.com/iamafu/bangkok-trip（公開）。
- `research/`、`docs/` 與原始資料都會公開。
