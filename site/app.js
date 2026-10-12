// 手冊渲染：讀取 data/attractions.json，以 DOM API 建立內容（不使用 innerHTML 填入資料）。
const UNVERIFIED = "【資料不足，無法確認】";
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const SECTIONS = [
  { id: "sec-food", title: "餐飲", match: /餐|麵/ },
  { id: "sec-sights", title: "寺廟與景點", match: /寺廟|景點|公園/ },
  { id: "sec-malls", title: "商場", match: /商場/ },
  { id: "sec-markets", title: "夜市與咖啡", match: /夜市|街市|咖啡/ },
];

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) continue;
    if (key === "className") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined) continue;
    node.append(child);
  }
  return node;
}

function orUnverified(value) {
  return value === null || value === undefined || value === "" ? UNVERIFIED : value;
}

function listOrUnverified(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return el("p", { className: "unverified", text: UNVERIFIED });
  }
  return el("ul", { className: "section-list" }, items.map((t) => el("li", { text: t })));
}

function infoRow(label, value) {
  return el("li", {}, [el("b", { text: label }), el("span", { text: orUnverified(value) })]);
}

function sourceLinks(sources) {
  if (!Array.isArray(sources) || sources.length === 0) return null;
  return el("p", { className: "sources" }, sources.flatMap((s, i) => {
    const link = el("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.title || s.url });
    const tail = el("span", { text: `（${s.date || "日期不明"}）` });
    return i === 0 ? [link, tail] : [el("span", { text: "、" }), link, tail];
  }));
}

function videoSlot(videos) {
  const main = Array.isArray(videos) ? videos.find((v) => v.role === "main" && v.embeddable && VIDEO_ID.test(v.video_id || "")) : null;
  const backup = Array.isArray(videos) ? videos.find((v) => v.role === "backup" && v.embeddable && VIDEO_ID.test(v.video_id || "")) : null;
  const pick = main || backup;

  if (!pick) {
    return el("div", { className: "video-missing", text: "目前找不到合適影片" });
  }

  const label = pick.title || "影片";
  // 縮圖來自 YouTube 公開的 i.ytimg.com 圖片網址，只是靜態圖片，不會載入播放器。
  const thumb = el("img", {
    src: `https://i.ytimg.com/vi/${pick.video_id}/hqdefault.jpg`,
    alt: "",
    loading: "lazy",
    decoding: "async",
    referrerpolicy: "no-referrer",
  });
  // 縮圖載入失敗時移除圖片，保留漸層底色與播放鈕。
  thumb.addEventListener("error", () => thumb.remove());
  const facade = el("button", {
    className: "facade",
    type: "button",
    "aria-label": `播放影片：${label}（點擊後才會載入 YouTube）`,
  }, [thumb, el("span", { className: "play-badge", "aria-hidden": "true" })]);

  const note = el("p", {
    className: "video-note",
    text: `${pick.channel ? "頻道：" + pick.channel : "頻道待確認"}${pick.published ? "・上傳 " + pick.published : ""}${pick.views_at_check ? "・觀看 " + pick.views_at_check.toLocaleString("zh-Hant") : ""}`,
  });

  facade.addEventListener("click", () => {
    const frame = el("iframe", {
      className: "video-frame",
      src: `https://www.youtube-nocookie.com/embed/${pick.video_id}?rel=0`,
      title: label,
      loading: "lazy",
      allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      allowfullscreen: "",
      referrerpolicy: "strict-origin-when-cross-origin",
    });
    facade.replaceWith(frame);
  });

  return el("div", { className: "video-slot" }, [facade, note]);
}

// 候選地點沒有座標，改以「名稱 + Thailand」開啟 Google 地圖搜尋；
// 括號內的補充說明不放進搜尋字串，避免干擾搜尋結果。
function mapsSearchUrl(name) {
  const core = (name || "").split(/[（(]/)[0].trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${core} Thailand`)}`;
}

function nearbyBlock(nearby) {
  if (!Array.isArray(nearby) || nearby.length === 0) {
    return el("p", { className: "unverified", text: "周邊候選：" + UNVERIFIED });
  }
  return el("div", {}, [
    el("p", { className: "section-title", text: "周邊候選" }),
    el("ul", { className: "nearby" }, nearby.map((n) =>
      el("li", {}, [
        el("a", {
          className: "nearby-name",
          href: n.maps_url || mapsSearchUrl(n.name),
          target: "_blank",
          rel: "noopener noreferrer",
          text: n.name || UNVERIFIED,
        }),
        el("p", { className: "why", text: n.why || "" }),
        el("p", { className: "why", text: `距離：${orUnverified(n.distance)}　狀態：${orUnverified(n.status)}` }),
      ])
    )),
    el("p", { className: "note-text", text: "點擊地點名稱會開啟 Google 地圖搜尋，請確認第一筆結果是否為該地點。" }),
  ]);
}

function card(a) {
  const pop = a.popularity || {};
  const tags = el("div", { className: "tags" }, [
    el("span", { className: "tag", text: `熱度：${pop.level || "待查證"}` }),
    el("span", { className: "tag is-muted", text: `營運：${a.status || "待查證"}` }),
  ]);

  const nameBlock = el("div", {}, [
    el("h3", { text: a.name_zh || UNVERIFIED }),
    a.name_en ? el("p", { className: "name-sub", text: a.name_en }) : null,
    a.name_th ? el("p", { className: "name-sub", text: a.name_th }) : null,
    a.colloquial_zh ? el("p", { className: "name-sub", text: `台灣口語：${a.colloquial_zh}` }) : null,
  ]);

  const facts = el("ul", { className: "info" }, [
    infoRow("票價", a.tickets),
    infoRow("營業", a.hours),
    infoRow("交通", a.transport),
    infoRow("著裝", a.dress_code),
    infoRow("最佳", a.best_time),
  ]);

  const body = el("div", { className: "body" }, [
    el("p", { className: "section-title", text: "特色" }), listOrUnverified(a.features),
    el("p", { className: "section-title", text: "優點" }), listOrUnverified(a.pros),
    el("p", { className: "section-title", text: "缺點" }), listOrUnverified(a.cons),
    el("p", { className: "section-title", text: "熱度依據" }),
    el("p", { className: "note-text", text: pop.reason || UNVERIFIED }),
    sourceLinks(pop.sources),
  ]);

  const mapLink = a.maps_url
    ? el("p", {}, [el("a", { href: a.maps_url, target: "_blank", rel: "noopener noreferrer", text: "在 Google 地圖開啟" })])
    : null;

  return el("article", { className: "postcard", "aria-labelledby": `t-${a.id}` }, [
    nameBlock,
    tags,
    videoSlot(a.videos),
    facts,
    mapLink,
    body,
    nearbyBlock(a.nearby),
  ].filter(Boolean));
}

function renderSection(title, id, items) {
  const section = el("section", { id, "aria-labelledby": `h-${id}` });
  section.append(el("h2", { id: `h-${id}`, text: `${title}（${items.length}）` }));
  section.append(el("div", { className: "grid" }, items.map(card)));
  return section;
}

function renderAppendix(items) {
  const section = el("section", { id: "sec-appendix", "aria-labelledby": "h-sec-appendix" });
  section.append(el("h2", { id: "h-sec-appendix", text: "附錄（不分析）" }));
  section.append(el("ul", { className: "appendix-list" }, items.map((x) =>
    el("li", {}, [
      el("strong", { text: x.name_zh }),
      el("span", { text: `　${x.type || ""}　清單評分 ${x.list_rating ?? "—"}　${x.note || ""}` }),
    ])
  )));
  return section;
}

async function main() {
  const status = document.getElementById("data-status");
  const app = document.getElementById("app");

  let data;
  try {
    const res = await fetch("data/attractions.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(String(res.status));
    data = await res.json();
  } catch (err) {
    status.textContent = "資料載入失敗，請重新整理頁面。";
    status.classList.add("is-error");
    return;
  }

  const list = Array.isArray(data.attractions) ? data.attractions : [];
  const placed = new Set();
  for (const sec of SECTIONS) {
    const items = list.filter((a) => sec.match.test(a.type || ""));
    items.forEach((a) => placed.add(a.id));
    if (items.length) app.append(renderSection(sec.title, sec.id, items));
  }
  const rest = list.filter((a) => !placed.has(a.id));
  if (rest.length) app.append(renderSection("其他", "sec-other", rest));
  app.append(renderAppendix(Array.isArray(data.appendix) ? data.appendix : []));

  status.textContent = `共 ${list.length} 個景點，附錄 ${(data.appendix || []).length} 項。查證日 ${data.meta?.checked_on || "未知"}。`;
}

main();
