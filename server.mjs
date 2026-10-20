#!/usr/bin/env node
/**
 * Local server for the mirrored Socios redesign prototype build.
 *
 * Serves the snapshot in ./mirror:
 *  - page HTML from mirror/pages (RSC/flight payloads from mirror/rsc for client-side navigation)
 *  - static assets (/next chunks, fonts, images, public files)
 *  - RSC navigation + /api/concierge are proxied to the origin deploy when reachable,
 *    with stored/offline fallbacks
 *
 * Usage: node server.mjs  (PORT=3210 node server.mjs to change the port)
 */

import http from "node:http";
import { promises as fsp, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "mirror");
const OVERLAY = path.join(HERE, "mirror-overlay");
const ORIGIN = process.env.MIRROR_ORIGIN || "https://socios-redesign-prototype.vercel.app";
const OFFLINE = process.env.MIRROR_OFFLINE === "1";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const MIME = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
};

function decode(p) {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

function safeJoin(base, rel) {
  const full = path.resolve(base, "." + rel.replace(/\/+$/, "") || "/");
  if (full !== base && !full.startsWith(base + path.sep)) return null;
  return full;
}

async function isFile(p) {
  try {
    const st = await fsp.stat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

/**
 * Stream an async reader (fetch body) into the response. Aborts and network
 * errors are swallowed: once headers are committed the best we can do is end
 * the socket cleanly instead of crashing the server.
 */
async function pumpReader(res, reader) {
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (res.destroyed) return;
      res.write(Buffer.from(value));
    }
    res.end();
  } catch {
    try {
      res.destroy();
    } catch {}
  }
}

function sendFile(res, file, { status = 200, cache = "no-store" } = {}) {
  res.writeHead(status, {
    "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    "Cache-Control": cache,
  });
  if (res.req.method === "HEAD") return res.end();
  const stream = createReadStream(file);
  stream.on("error", () => {
    try {
      res.destroy();
    } catch {}
  });
  stream.pipe(res);
}

const DSE_SCRIPT = '<link rel="stylesheet" href="/__dse/premium-redesign.css"><script src="/__dse/apply.js" defer></script>';

function injectDse(html) {
  if (html.includes("/__dse/apply.js")) return html;
  const head = /<\/head>/i;
  if (head.test(html)) return html.replace(head, DSE_SCRIPT + "</head>");
  const htmlOpen = /<html[^>]*>/i;
  if (htmlOpen.test(html)) return html.replace(htmlOpen, (m) => m + DSE_SCRIPT);
  return DSE_SCRIPT + html;
}

async function sendPageHtml(res, file, { status = 200, cache = "no-store" } = {}) {
  let html;
  try {
    html = await fsp.readFile(file, "utf8");
  } catch {
    return sendFile(res, file, { status, cache });
  }
  const body = injectDse(html);
  res.writeHead(status, {
    "Content-Type": MIME[".html"],
    "Cache-Control": cache,
    "Content-Length": Buffer.byteLength(body),
  });
  if (res.req.method === "HEAD") return res.end();
  res.end(body);
}

async function dseFileFor(reqPath) {
  let rel = reqPath.replace(/^\/__dse\/?/, "");
  if (!rel || rel === "editor") rel = "editor.html";
  const file = safeJoin(OVERLAY, "/" + rel);
  if (!file) return null;
  return (await isFile(file)) ? file : null;
}

function pageFileFor(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const rel = clean === "/" ? "root" : clean.slice(1);
  return path.join(ROOT, "pages", `${rel}.html`);
}

function rscFileFor(pathname, prefetch) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const rel = clean === "/" ? "root" : clean.slice(1);
  return path.join(ROOT, "rsc", `${rel}.rsc${prefetch ? ".prefetch" : ""}`);
}

const FLIGHT_HEADERS = [
  "rsc",
  "next-router-prefetch",
  "next-router-segment-prefetch",
  "next-router-state-tree",
  "next-url",
  "next-instant-navigation-testing-prefetch",
  "next-hmr-refresh",
];

async function proxyRSC(req, res, pathname) {
  const headers = {};
  for (const name of FLIGHT_HEADERS) {
    if (req.headers[name] !== undefined) headers[name] = req.headers[name];
  }
  const search = new URL(req.url, "http://localhost").search;
  const upstream = await fetch(ORIGIN + pathname + search, {
    headers: { ...headers, "User-Agent": UA, Accept: "*/*" },
    redirect: "manual",
    signal: AbortSignal.timeout(Number(process.env.MIRROR_RSC_TIMEOUT) || 2000),
  });
  if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
  const ct = upstream.headers.get("content-type") || "";
  if (!ct.includes("text/x-component")) throw new Error("not flight");
  // Forward the flight-relevant headers: the Next.js client validates
  // x-nextjs-deployment-id against the page build id and reads stale-time/vary
  // from these headers when reconciling navigations.
  const resHeaders = {
    "Content-Type": "text/x-component; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Mirror-RSC": "proxied",
  };
  for (const name of ["x-nextjs-deployment-id", "x-nextjs-stale-time", "x-nextjs-postponed", "vary"]) {
    const value = upstream.headers.get(name);
    if (value) resHeaders[name] = value;
  }
  res.writeHead(200, resHeaders);
  if (req.method === "HEAD") return res.end();
  await pumpReader(res, upstream.body.getReader());
}

async function serveRSC(req, res, pathname) {
  const prefetch = req.headers["next-router-prefetch"] === "1";
  let file = rscFileFor(pathname, prefetch);
  if (!(await isFile(file))) file = rscFileFor(pathname, false);

  // Snapshots are served first: instant, consistent with the page snapshot,
  // and verified to reconcile in a real browser. The origin is only consulted
  // for routes that were never captured.
  if (await isFile(file)) {
    // The build id lets the client accept this stored payload (it compares
    // x-nextjs-deployment-id against the page's data-dpl-id).
    const resHeaders = {
      "Content-Type": "text/x-component; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Mirror-RSC": prefetch ? "prefetch" : "full",
    };
    if (BUILD_ID) resHeaders["x-nextjs-deployment-id"] = BUILD_ID;
    res.writeHead(200, resHeaders);
    if (req.method === "HEAD") return res.end();
    const stream = createReadStream(file);
    stream.on("error", () => {
      try {
        res.destroy();
      } catch {}
    });
    stream.pipe(res);
    return;
  }

  if (!OFFLINE) {
    try {
      return await proxyRSC(req, res, pathname);
    } catch {
      if (res.headersSent) return;
    }
  }

  // A clean non-200 makes the Next client fall back to browser navigation,
  // which then loads the local HTML (or the local 404 page).
  res.writeHead(503, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("No stored flight payload for this route");
}

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "host",
  "content-length",
  "content-encoding",
]);

async function proxyPassthrough(req, res, targetUrl) {
  const headers = {};
  for (const [name, value] of Object.entries(req.headers)) {
    if (HOP_BY_HOP.has(name)) continue;
    if (name === "accept-encoding") continue;
    headers[name] = Array.isArray(value) ? value.join(", ") : value;
  }
  headers["user-agent"] = UA;

  let body;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    body = Buffer.concat(chunks);
  }

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
    signal: AbortSignal.timeout(Number(process.env.MIRROR_FALLBACK_TIMEOUT) || 8000),
  });

  const resHeaders = {};
  upstream.headers.forEach((value, name) => {
    if (HOP_BY_HOP.has(name)) return;
    if (name === "content-encoding") return;
    resHeaders[name] = value;
  });
  resHeaders["x-mirror-fallback"] = "origin";
  const ct = (resHeaders["content-type"] || "").toLowerCase();
  if (req.method !== "HEAD" && upstream.body && ct.includes("text/html")) {
    let html = "";
    try {
      for await (const chunk of upstream.body) html += Buffer.from(chunk).toString("utf8");
    } catch {
      try {
        res.destroy();
      } catch {}
      return;
    }
    delete resHeaders["content-length"];
    const out = injectDse(html);
    resHeaders["content-length"] = Buffer.byteLength(out);
    res.writeHead(upstream.status, resHeaders);
    return res.end(out);
  }
  res.writeHead(upstream.status, resHeaders);
  if (req.method === "HEAD" || !upstream.body) return res.end();
  await pumpReader(res, upstream.body.getReader());
}

async function handleConcierge(req, res) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Method not allowed");
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);
  try {
    const upstream = await fetch(ORIGIN + "/api/concierge", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": UA },
      body,
      signal: AbortSignal.timeout(15000),
    });
    if (upstream.ok && upstream.body) {
      res.writeHead(200, {
        "Content-Type": upstream.headers.get("content-type") || "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Concierge-Source": upstream.headers.get("X-Concierge-Source") || "fallback",
      });
      return await pumpReader(res, upstream.body.getReader());
    }
    throw new Error(`upstream ${upstream.status}`);
  } catch {
    if (res.headersSent) return;
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Concierge-Source": "fallback",
    });
    const msg =
      "You're on the local mirror right now, so I can't reach my live brain — but everything else in the prototype is right here with you. What shall we look at?";
    let i = 0;
    const timer = setInterval(() => {
      try {
        res.write(msg.slice(i, i + 8));
      } catch {
        clearInterval(timer);
        return;
      }
      i += 8;
      if (i >= msg.length) {
        clearInterval(timer);
        res.end();
      }
    }, 40);
  }
}

const FONTS_DIR = path.join(OVERLAY, "fonts");
const FONT_MANIFEST = path.join(FONTS_DIR, "fonts.json");
const FONT_MAX_BYTES = 12 * 1024 * 1024;

function readBody(req, cap = FONT_MAX_BYTES) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > cap) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sanitizeFontFile(name) {
  const base = String(name || "").split(/[\\/]/).pop().trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9 ._()-]{0,120}\.(woff2|woff|ttf|otf)$/i.test(base)) return null;
  return base;
}

function sanitizeFamily(family) {
  return String(family || "")
    .replace(/["\\]/g, "")
    .trim()
    .slice(0, 80);
}

function defaultFamilyFromName(name) {
  return name.replace(/\.(woff2?|ttf|otf)$/i, "").replace(/[-_]+/g, " ").trim();
}

function weightFromName(name) {
  const n = name.toLowerCase();
  if (/thin/.test(n)) return 100;
  if (/extralight|extra-light/.test(n)) return 200;
  if (/light(?!ning)/.test(n)) return 300;
  if (/medium/.test(n)) return 500;
  if (/semibold|semi-bold|demibold|demi-bold/.test(n)) return 600;
  if (/extrabold|extra-bold/.test(n)) return 800;
  if (/black|heavy/.test(n)) return 900;
  if (/bold/.test(n)) return 700;
  if (/regular|normal|book/.test(n)) return 400;
  return null;
}

async function readFontsManifest() {
  try {
    const list = JSON.parse(await fsp.readFile(FONT_MANIFEST, "utf8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function writeFontsManifest(list) {
  await fsp.mkdir(FONTS_DIR, { recursive: true });
  await fsp.writeFile(FONT_MANIFEST, JSON.stringify(list, null, 2) + "\n");
}

async function handleFonts(req, res, pathname) {
  const send = (status, body, type = "application/json; charset=utf-8") => {
    res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(body);
  };
  if (pathname === "/__dse/fonts") {
    if (req.method === "GET") return send(200, JSON.stringify(await readFontsManifest()));
    if (req.method === "POST") {
      const url = new URL(req.url, "http://localhost");
      const name = sanitizeFontFile(url.searchParams.get("name"));
      if (!name) return send(400, JSON.stringify({ error: "Invalid font file name (expected .woff2/.woff/.ttf/.otf)" }));
      const ext = path.extname(name).toLowerCase();
      if (!MIME[ext]) return send(400, JSON.stringify({ error: "Unsupported font format" }));
      let body;
      try {
        body = await readBody(req);
      } catch (err) {
        return send(413, JSON.stringify({ error: err.message || "Upload failed" }));
      }
      if (!body.length) return send(400, JSON.stringify({ error: "Empty upload" }));
      await fsp.mkdir(FONTS_DIR, { recursive: true });
      await fsp.writeFile(path.join(FONTS_DIR, name), body);
      const list = await readFontsManifest();
      const family = sanitizeFamily(url.searchParams.get("family")) || defaultFamilyFromName(name);
      const entry = {
        file: name,
        family,
        weight: weightFromName(name),
        size: body.length,
        uploadedAt: Date.now(),
      };
      const idx = list.findIndex((f) => f.file === name);
      if (idx >= 0) list[idx] = entry;
      else list.push(entry);
      await writeFontsManifest(list);
      return send(201, JSON.stringify(entry));
    }
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Method not allowed");
  }
  if (req.method === "DELETE") {
    const name = sanitizeFontFile(decode(pathname.replace(/^\/__dse\/fonts\//, "")));
    if (!name) return send(400, JSON.stringify({ error: "Invalid font file name" }));
    const file = safeJoin(FONTS_DIR, "/" + name);
    if (!file || !(await isFile(file))) return send(404, JSON.stringify({ error: "Not found" }));
    await fsp.unlink(file);
    const list = (await readFontsManifest()).filter((f) => f.file !== name);
    await writeFontsManifest(list);
    return send(200, JSON.stringify({ ok: true }));
  }
  return false;
}

function patchedSwSource(src) {
  if (src.includes('url.pathname.startsWith("/__dse/")')) return src;
  let out = src.replace(
    /const url = new URL\(request\.url\);/,
    'const url = new URL(request.url);\n  if (url.pathname.startsWith("/__dse/")) return; // DSE: never intercept design-editor traffic'
  );
  out = out.replace(/const CACHE = "([^"]*)";/, (_m, name) => {
    const bumped = /v\d+$/.test(name)
      ? name.replace(/v\d+$/, (d) => "v" + (parseInt(d.slice(1), 10) + 1))
      : name + "-dse";
    return `const CACHE = "${bumped}";`;
  });
  return out;
}

const server = http.createServer(async (req, res) => {
  // Never let an aborted client connection bubble up as an uncaught error.
  res.on("error", () => {});
  req.on("error", () => {});
  try {
    const pathname = decode(new URL(req.url, "http://localhost").pathname);

    if (pathname === "/api/concierge") return await handleConcierge(req, res);

    if (pathname === "/__dse/fonts" || pathname.startsWith("/__dse/fonts/")) {
      const handled = await handleFonts(req, res, pathname);
      if (handled) return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Method not allowed");
    }

    if (req.headers["rsc"] === "1") return await serveRSC(req, res, pathname);

    if (pathname === "/__dse" || pathname.startsWith("/__dse/")) {
      const file = await dseFileFor(pathname);
      if (file) return sendFile(res, file, { cache: "no-store" });
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Design System Editor: not found");
    }

    if (pathname === "/sw.js") {
      const swPath = path.join(ROOT, "sw.js");
      if (await isFile(swPath)) {
        const src = await fsp.readFile(swPath, "utf8");
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
        return res.end(patchedSwSource(src));
      }
    }

    const staticPath = safeJoin(ROOT, pathname);
    if (staticPath && (await isFile(staticPath))) {
      const ext = path.extname(staticPath).toLowerCase();
      const isChunk = staticPath.includes(`${path.sep}_next${path.sep}static${path.sep}`);
      return sendFile(res, staticPath, {
        cache: isChunk || ext === ".woff2" ? "public, max-age=31536000, immutable" : "public, max-age=3600",
      });
    }

    const pagePath = pageFileFor(pathname);
    if (await isFile(pagePath)) return sendPageHtml(res, pagePath, { cache: "no-store" });

    if (!OFFLINE) {
      try {
        return await proxyPassthrough(req, res, ORIGIN + req.url);
      } catch {
        if (res.headersSent) return;
        // fall through to the stored 404 page
      }
    }

    const notFound = path.join(ROOT, "pages", "__not-found__.html");
    if (await isFile(notFound)) return sendPageHtml(res, notFound, { status: 404, cache: "no-store" });
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  } catch (err) {
    try {
      if (res.headersSent) {
        res.end();
      } else {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Mirror server error: " + (err && err.message ? err.message : String(err)));
      }
    } catch {}
  }
});

// Belt and braces: a malformed request or an edge-case abort must not kill the process.
server.on("clientError", (err, socket) => {
  try {
    socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
  } catch {}
});

function listen(port, attempts = 0) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && attempts < 10) {
      listen(port + 1, attempts + 1);
    } else {
      console.error(err.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log(`Socios mirror running on http://localhost:${port}`);
    console.log(`Origin: ${ORIGIN}`);
  });
}

// Read the deployment id from the mirrored root page once, so stored RSC
// fallback payloads pass the client's build-id check.
const BUILD_ID = await (async () => {
  try {
    const html = await fsp.readFile(path.join(ROOT, "pages", "root.html"), "utf8");
    const m = html.match(/data-dpl-id="([^"]+)"/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
})();

listen(Number(process.env.PORT) || 3210);
