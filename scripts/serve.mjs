// 本機瀏覽用靜態伺服器：只服務 site/ 資料夾，不對外開放（綁定 127.0.0.1）。
// 用法（在專案根目錄）：node scripts/serve.mjs，然後開啟 http://localhost:8765/
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const port = Number(process.env.PORT) || 8765;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const target = path.normalize(path.join(root, urlPath === "/" ? "index.html" : urlPath));
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403);
      return res.end("forbidden");
    }
    fs.readFile(target, (err, body) => {
      if (err) {
        res.writeHead(404);
        return res.end("not found");
      }
      res.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
      res.end(body);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`本機預覽：http://localhost:${port}/（按 Ctrl+C 停止）`);
  });
