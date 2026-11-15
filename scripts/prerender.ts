/* Writes every route as its own HTML file, so pages load without waiting for
   JavaScript and search engines can read them. Runs after both Vite builds. */

import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");

// The in-browser compiler is built by `bun osl:assets`, not committed. A site
// without it would deploy fine and then fail in every editor.
const wasm = join(dist, "osl/osl.wasm");
if (!existsSync(wasm) || !existsSync(join(dist, "osl/wasm_exec.js"))) {
  throw new Error("dist/osl/osl.wasm is missing: run `bun osl:assets` before building");
}
// Cloudflare Pages serves files up to 25 MiB.
const wasmSize = statSync(wasm).size;
if (wasmSize > 25 * 1024 * 1024) {
  throw new Error(`osl.wasm is ${(wasmSize / 1048576).toFixed(1)} MiB, over the 25 MiB file limit`);
}
const server = await import(join(root, "dist-ssr/entry-server.js"));

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const site = (process.env.VITE_SITE_URL ?? "https://osl-lang.org").replace(/\/+$/, "");

// Every replacement is a function: a string replacement would read $& and $'
// in page text (regex docs, Go code) as patterns.
function fill(title: string, description: string, html: string, head = "") {
  return template
    .replace(/<!--title-->OSL/g, () => escape(title))
    .replace(/<!--description-->/g, () => escape(description))
    .replace("</head>", () => `${head}  </head>`)
    .replace("<!--app-->", () => html);
}

const routes: string[] = server.routes();
for (const route of routes) {
  const { html, title, description } = server.render(route);
  const markdown = route === "/" ? "/index.md" : `${route}.md`;
  const head =
    `    <link rel="canonical" href="${site}${route === "/" ? "/" : route}" />\n` +
    `    <link rel="alternate" type="text/markdown" href="${markdown}" />\n`;
  const file = route === "/" ? join(dist, "index.html") : join(dist, `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, fill(title, description, html, head));
}

// Pages that are both a page and a folder (learn.html, learn/...) also get
// learn/index.html, for hosts that serve folders.
for (const route of routes) {
  if (route === "/") continue;
  const folder = join(dist, route.slice(1));
  if (existsSync(folder)) writeFileSync(join(folder, "index.html"), readFileSync(`${folder}.html`));
}

const notFound = server.render("/this-page-does-not-exist");
writeFileSync(join(dist, "404.html"), fill("Not found · OSL", "", notFound.html));

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes.map((r) => `  <url><loc>${site}${r}</loc></url>\n`).join("") +
  `</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length} pages`);
