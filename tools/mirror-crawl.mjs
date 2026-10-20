#!/usr/bin/env node
/**
 * Mirrors the deployed Socios redesign prototype into ./mirror so it can be
 * served fully offline by ../server.mjs.
 *
 * Captures:
 *  - Page HTML for every internal route (BFS from the seed list + discovered links)
 *  - RSC flight payloads per route (full + prefetch variants) for client-side navigation
 *  - Every /_next static chunk (js/css), fonts, and public assets referenced
 *
 * Usage: node tools/mirror-crawl.mjs [--origin https://socios-redesign-prototype.vercel.app]
 */

import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const argOrigin = process.argv.find((a, i) => process.argv[i - 1] === "--origin");
const ORIGIN = argOrigin || "https://socios-redesign-prototype.vercel.app";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "mirror");
const PAGES_DIR = join(ROOT, "pages");
const RSC_DIR = join(ROOT, "rsc");

const ASSET_EXT = /\.(?:js|mjs|css|woff2?|png|svg|jpg|jpeg|webp|gif|ico|webmanifest|txt|json)$/i;
const LINKABLE_EXT = /\.(?:png|svg|jpg|jpeg|webp|gif|ico|webmanifest|txt|css|js|woff2?)$/i;

const REWARD_ITEMS = [
  "milan-vip", "acm-jersey", "bar-boots", "milan-ticket", "inter-shirt", "city-boots",
  "afc-ticket", "juv-ball", "inter-ticket", "nap-shirt", "milan-boots", "city-ticket",
  "nap-shirt-raffle", "acm-shirt-auction", "nap-shirt-instant", "juv-shirt", "bol-boots",
  "inter-shirt-instant", "bar-boots-instant", "psg-parking", "spurs-parking", "psg-scarf",
  "roma-scarf", "roma-mug", "pack-acm", "pack-bar", "pack-juv", "pack-afc", "pack-asr",
  "pack-bol", "pack-inter", "ncaa-r1", "ncaa-r2", "ncaa-r3", "ncaa-r4", "ncaa-r5", "ncaa-r6",
];

const routeQueue = [
  "/",
  "/market",
  "/earn",
  "/rewards",
  "/reward-points",
  "/browser",
  "/design-system",
  "/fan-token-play",
  "/polls",
  "/pulse",
  "/search",
  "/wallet",
  "/wallet/activity",
  "/equity",
  "/equity/offering",
  "/market/CITY",
  "/market/INTER",
  "/market/ACM",
  "/market/AFC",
  "/market/ASR",
  "/market/ATM",
  "/market/BAR",
  "/market/GAL",
  "/market/JUV",
  "/market/PSG",
  "/market/SPURS",
  "/market/TRA",
  "/market/ARG",
  "/market/LEV",
  "/market/MENGO",
  "/market/NAP",
  "/market/POR",
  "/market/RSO",
  "/market/SEVILLA",
  "/market/VCF",
  "/market/DUKE",
  "/market/LSU",
  "/market/MICH",
  "/market/PUR",
  "/market/UCONN",
  "/market/USC",
  "/market/BELG",
  "/market/IOWA",
  "/market/ITA",
  "/market/ND",
  "/market/OG",
  "/market/PENN",
  "/market/SPAIN",
  "/market/TERPS",
  "/market/TEX",
  "/market/ALL",
  "/market/MIBR",
  "/market/NAVI",
  "/market/TH",
  "/market/VIT",
  "/market/afc",
  "/market/asr",
  "/market/atm",
  "/market/bar",
  "/market/city",
  "/market/gal",
  "/market/psg",
  "/market/arg",
  "/market/lev",
  "/market/mengo",
  "/market/nap",
  "/market/por",
  "/market/rso",
  "/market/sevilla",
  "/market/vcf",
  "/market/duke",
  "/market/lsu",
  "/market/mich",
  "/market/pur",
  "/market/uconn",
  "/market/usc",
  "/market/belg",
  "/market/iowa",
  "/market/ita",
  "/market/nd",
  "/market/og",
  "/market/penn",
  "/market/spain",
  "/market/terps",
  "/market/tex",
  "/market/all",
  "/market/mibr",
  "/market/navi",
  "/market/th",
  "/market/vit",
  ...REWARD_ITEMS.map((id) => `/rewards/item/${id}`),
];
const seenRoutes = new Set();
const seenAssets = new Set();
const stats = { pages: 0, rsc: 0, assets: 0, failed: [] };

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeRoute(raw) {
  try {
    const url = new URL(raw, "https://x.local");
    if (url.origin !== "https://x.local") return null;
    if (url.hash) return null;
    let p = url.pathname;
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  } catch {
    return null;
  }
}

function pageFileFor(route) {
  const rel = route === "/" ? "root" : route.slice(1).replace(/\/+$/, "");
  return join(PAGES_DIR, `${rel}.html`);
}

function rscFileFor(route, kind) {
  const rel = route === "/" ? "root" : route.slice(1).replace(/\/+$/, "");
  return join(RSC_DIR, `${rel}.rsc${kind === "prefetch" ? ".prefetch" : ""}`);
}

async function fetchLocal(url, headers = {}) {
  const res = await fetch(url, { headers: { "User-Agent": UA, ...headers }, redirect: "follow" });
  return res;
}

async function saveBuffer(file, buf) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
}

async function crawlRoute(route) {
  if (seenRoutes.has(route)) return;
  seenRoutes.add(route);

  let res;
  try {
    res = await fetchLocal(ORIGIN + route);
  } catch (err) {
    stats.failed.push(`HTML ${route}: ${err.message}`);
    return;
  }
  if (!res.ok) {
    stats.failed.push(`HTML ${route}: HTTP ${res.status}`);
    if (res.status === 404 && route !== "/__mirror_404_probe__") return;
    return;
  }
  const html = Buffer.from(await res.arrayBuffer());
  await saveBuffer(pageFileFor(route), html);
  stats.pages++;
  await delay(120);

  // Discover links + assets
  const text = html.toString("utf8");
  const hrefRe = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = hrefRe.exec(text)) !== null) {
    const raw = m[1]
      .replace(/&amp;/g, "&")
      .replace(/&#x2F;/g, "/")
      .split("?")[0];
    if (!raw.startsWith("/")) continue;
    if (LINKABLE_EXT.test(raw) || raw.startsWith("/_next/")) {
      await queueAsset(raw);
    } else {
      const norm = normalizeRoute(raw);
      if (norm && norm !== route) {
        if (!seenRoutes.has(norm)) routeQueue.push(norm);
      }
    }
  }

  // RSC payloads (full + prefetch)
  for (const kind of ["full", "prefetch"]) {
    const headers = kind === "prefetch" ? { RSC: "1", "Next-Router-Prefetch": "1" } : { RSC: "1" };
    try {
      const rres = await fetchLocal(ORIGIN + route, headers);
      if (rres.ok) {
        const ct = rres.headers.get("content-type") || "";
        if (ct.includes("text/x-component")) {
          const buf = Buffer.from(await rres.arrayBuffer());
          await saveBuffer(rscFileFor(route, kind), buf);
          stats.rsc++;
        }
      } else {
        stats.failed.push(`RSC(${kind}) ${route}: HTTP ${rres.status}`);
      }
    } catch (err) {
      stats.failed.push(`RSC(${kind}) ${route}: ${err.message}`);
    }
    await delay(120);
  }
}

const assetQueue = [];
async function queueAsset(path) {
  const clean = path.split("?")[0];
  if (seenAssets.has(clean)) return;
  seenAssets.add(clean);
  assetQueue.push(clean);
}

async function downloadAssets() {
  while (assetQueue.length > 0) {
    const path = assetQueue.shift();
    let res;
    try {
      res = await fetchLocal(ORIGIN + path);
    } catch (err) {
      stats.failed.push(`ASSET ${path}: ${err.message}`);
      continue;
    }
    if (!res.ok) {
      stats.failed.push(`ASSET ${path}: HTTP ${res.status}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await saveBuffer(join(ROOT, path.slice(1)), buf);
    stats.assets++;

    // Parse CSS for additional font/image references (absolute + relative to /_next/static/chunks)
    if (path.endsWith(".css")) {
      const css = buf.toString("utf8");
      const urlRe = /url\((['"]?)([^)'"]+)\1\)/g;
      let um;
      while ((um = urlRe.exec(css)) !== null) {
        let u = um[2].split("?")[0];
        if (u.startsWith("/")) {
          await queueAsset(u);
        } else if (u.startsWith("../")) {
          await queueAsset("/_next/static/chunks/" + u.replace(/^(\.\.\/)+/, ""));
        }
      }
    }
    await delay(80);
  }
}

async function main() {
  // Capture the 404 page once (used as the local not-found response)
  try {
    const r404 = await fetchLocal(ORIGIN + "/__mirror_404_probe__");
    if (r404.status === 404) {
      await saveBuffer(join(PAGES_DIR, "__not-found__.html"), Buffer.from(await r404.arrayBuffer()));
      stats.pages++;
    } else {
      stats.failed.push(`404 page: unexpected HTTP ${r404.status}`);
    }
  } catch (err) {
    stats.failed.push(`404 page: ${err.message}`);
  }
  await delay(120);

  while (routeQueue.length > 0) {
    const route = routeQueue.shift();
    await crawlRoute(route);
  }

  await downloadAssets();

  // Second pass: links discovered inside later-crawled pages
  while (routeQueue.length > 0) {
    const route = routeQueue.shift();
    await crawlRoute(route);
  }
  await downloadAssets();

  // Assets referenced only from JS chunks (not from HTML), including lazy
  // Turbopack chunks ("static/chunks/xxx.js" references), until closure.
  const jsRefs = new Set();
  const chunksDir = join(ROOT, "_next", "static", "chunks");
  for (let pass = 0; pass < 4; pass++) {
    jsRefs.clear();
    let names = [];
    try {
      names = (await fs.promises.readdir(chunksDir)).filter((n) => n.endsWith(".js") || n.endsWith(".css"));
    } catch {}
    for (const name of names) {
      const src = await readFile(join(chunksDir, name), "utf8");
      for (const m of src.matchAll(/[`"](?:\/_next\/)?static\/chunks\/([a-z0-9_.-]+\.js)[`"]/g)) {
        jsRefs.add(`/_next/static/chunks/${m[1]}`);
      }
      for (const m of src.matchAll(/[`"]((?:\/[a-z0-9_.-]+\/)*[a-z0-9_-]+\.(?:png|jpe?g|svg|webp|ico|woff2?))[`"]/gi)) {
        jsRefs.add(m[1]);
      }
      for (const m of src.matchAll(/url\((['"]?)([^)'"]+)\1\)/g)) {
        let u = m[2].split("?")[0];
        if (u.startsWith("/")) jsRefs.add(u);
        else if (u.startsWith("../")) jsRefs.add("/_next/static/chunks/" + u.replace(/^(\.\.\/)+/, ""));
      }
    }
    for (const ref of jsRefs) await queueAsset(ref);
    await downloadAssets();
    if (pass > 0 && assetQueue.length === 0) break;
  }

  console.log(`pages: ${stats.pages}, rsc payloads: ${stats.rsc}, assets: ${stats.assets}`);
  if (stats.failed.length) {
    console.log("failures:");
    for (const f of [...new Set(stats.failed)]) console.log("  -", f);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
