/* Writes every route as its own HTML file, so pages load without waiting for
   JavaScript and search engines can read them. Runs after both Vite builds. */

import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dist = join(root, "dist");
const template = readFileSync(join(dist, "index.html"), "utf8");
const server = await import(join(root, "dist-ssr/entry-server.js"));

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const site = (process.env.VITE_SITE_URL ?? "https://osl-lang.org").replace(/\/+$/, "");

const routes: string[] = server.routes();
for (const route of routes) {
  const { html, title, description } = server.render(route);
  const page = template
    .replace(/<!--title-->OSL/g, escape(title))
    .replace(/<!--description-->/g, escape(description))
    .replace("</head>", `    <link rel="canonical" href="${site}${route === "/" ? "/" : route}" />\n  </head>`)
    .replace("<!--app-->", html);
  const file = route === "/" ? join(dist, "index.html") : join(dist, `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

// Pages that are both a page and a folder (learn.html, learn/...) also get
// learn/index.html, for hosts that serve folders.
for (const route of routes) {
  if (route === "/") continue;
  const folder = join(dist, route.slice(1));
  if (existsSync(folder)) writeFileSync(join(folder, "index.html"), readFileSync(`${folder}.html`));
}

const notFound = server.render("/this-page-does-not-exist");
writeFileSync(join(dist, "404.html"), template.replace(/<!--title-->OSL/g, "Not found · OSL").replace(/<!--description-->/g, "").replace("<!--app-->", notFound.html));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${site}${r}</loc></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap);
writeFileSync(join(dist, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
rmSync(join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length} pages`);
