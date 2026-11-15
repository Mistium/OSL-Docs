/* Renders one route to HTML for scripts/prerender.ts. */

import { renderToString } from "preact-render-to-string";
import type { PageData } from "./lib/types";
import { App, documentTitle, SPECIAL } from "./app";
import { primePage } from "./pages";
import index from "virtual:docs-index";

const pages = import.meta.glob<PageData>("/content/**/*.md", { query: "?page", import: "default", eager: true });

export function routes(): string[] {
  return ["/", "/playground", ...Object.values(pages).map((p) => `/${p.slug}`).filter((r) => r !== "/")];
}

export function render(path: string) {
  const slug = path.replace(/^\/+/, "");
  const page = slug in SPECIAL ? null : (Object.values(pages).find((p) => p.slug === slug) ?? null);
  if (page) primePage(slug, page);
  const html = renderToString(<App path={path} page={page} />);
  const description = slug === "" ? "OSL is a readable, typed language that compiles to Go and ships as one native binary. Learn it by example, in your browser." : page?.description || index.pages[slug]?.description || "";
  return { html, title: documentTitle(slug, page), description };
}
