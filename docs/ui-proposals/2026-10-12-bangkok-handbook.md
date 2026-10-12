# 曼谷手冊 · 5 款風格樣板規格

查證日：2026-10-12｜狀態：樣板待選（未選定前不實作正式頁面）

## 共同規則

- 樣板只使用清單中的地點名稱。所有票價、營業時間、評分、熱度判定皆為占位，顯示「—」或【資料不足，無法確認】。
- 影片區為占位按鈕：點擊前不載入 YouTube 播放器，正式版才接入 `youtube-nocookie.com` 嵌入。
- 票選互動為三態（想去／考慮／不去），樣板僅示範本機切換，不寫入後端。
- 所有樣板皆包含：標題與說明、區域導覽、1 張完整景點卡、排行榜預覽。
- 所有互動元件具備 `:focus-visible`、`:active`、`:disabled` 樣式，並支援 `prefers-reduced-motion`。
- 版面需在 320／375／414／768 px 無水平捲動。

## 款式一覽

| 代號 | 款名 | Hallmark 類型 | 色調方向 | 字體（Google Fonts） | 版面概念 | 票選樣式 |
|---|---|---|---|---|---|---|
| A | 夜市票券 | atmospheric | 墨黑底、霓虹粉（≤5%）、芥末黃 | Noto Sans TC 900、Space Grotesk、JetBrains Mono | 票券卡，切口與票號 | 三態按鈕，形同攤位點餐券 |
| B | 寺廟金箔誌 | editorial | 象牙紙、泰藍墨、金箔細線、朱紅點綴 | Noto Serif TC、Cormorant Garamond、Noto Sans TC | 雜誌式依區域分章，單欄長文 | 印章式三選（列入／候補／略過） |
| C | 熱帶明信片 | playful | 海藍、珊瑚、沙色、椰綠 | Noto Sans TC、Fredoka | 明信片網格，卡片圓角與郵票框 | 圓形按鈕，選中後變色 |
| D | 瑞士極簡 | modern-minimal | 近黑、暖白、單一螢光橘（≤5%） | Archivo、Noto Sans TC、IBM Plex Mono | 12 欄網格，索引編號與規格表 | 分段控制（segmented control） |
| E | 手帳拼貼 | playful | 牛皮紙、墨綠、番茄紅、奶油白 | Noto Serif TC、Caveat（僅英文）、Noto Sans TC | 手帳頁，紙膠帶標示狀態 | 貼紙式勾選 |

## Hallmark 對應（五款互不重複）

- A：`11-catalogue`
- B：`02-long-document`
- C：`18-portfolio-grid`
- D：`13-index-first`
- E：`14-narrative-workflow`

## 下一步

選定一款（可混搭）後，才會開始建置正式手冊、接入資料與票選後端。
