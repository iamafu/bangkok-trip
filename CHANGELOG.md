# CHANGELOG

## 2026-10-12

- 部署到 GitHub Pages：https://iamafu.github.io/bangkok-trip/（repo：bangkok-trip，公開）
- 交叉驗證（qa-verifier）通過；低嚴重度修正：meta 描述、Jeh O Chula 票價標記、象神寺影片說明欄位、遺留 class 名稱
- 建立專案骨架：`README.md`、`CHANGELOG.md`、`data/attractions.json`（21 項清單，17 景點待查證，4 項附錄）
- 產出 5 款風格樣板與規格（`docs/ui-proposals/2026-10-12-bangkok-handbook/`），選定方案 C
- 本機 `git init`，尚無 commit
- 移除暱稱與投票功能，刪除 `site/votes.js`、`site/firebase-config.js`，以及本機的 `firebase.json`、`firestore.rules`。網站不再需要 Firebase。
- 雲端 Firebase 專案 `cranberry-bangkok-2027` 未變動（Firestore 與規則仍在），需另行決定是否刪除。
