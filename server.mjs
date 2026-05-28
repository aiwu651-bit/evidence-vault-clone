import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4177);
const pagesBase = "/evidence-vault-clone";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function cleanPath(urlPath) {
  let decoded = decodeURIComponent(urlPath.split("?")[0]);
  if (decoded === pagesBase) decoded = "/";
  if (decoded.startsWith(`${pagesBase}/`)) decoded = decoded.slice(pagesBase.length);
  return decoded === "/" ? "/index.html" : decoded;
}

const server = http.createServer(async (req, res) => {
  try {
    const requested = cleanPath(req.url || "/");
    const candidate = path.join(root, requested);
    const safeCandidate = candidate.startsWith(root) ? candidate : path.join(root, "index.html");
    const filePath = existsSync(safeCandidate) ? safeCandidate : path.join(root, "index.html");
    const ext = path.extname(filePath);
    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, () => {
  console.log(`Evidence clone running at http://localhost:${port}`);
});
