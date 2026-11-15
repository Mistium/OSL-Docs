import type { PageData } from "./lib/types";

/* Each page is its own chunk, loaded when someone opens it. */
const lazy = import.meta.glob<PageData>("/content/**/*.md", { query: "?page", import: "default" });

export function fileFor(slug: string): string | undefined {
  const candidates = slug ? [`/content/${slug}.md`, `/content/${slug}/index.md`] : ["/content/index.md"];
  return candidates.find((file) => file in lazy);
}

export const hasPage = (slug: string) => fileFor(slug) !== undefined;

const cache = new Map<string, PageData>();

export function cachedPage(slug: string): PageData | undefined {
  return cache.get(slug);
}

export async function loadPage(slug: string): Promise<PageData | null> {
  const hit = cache.get(slug);
  if (hit) return hit;
  const file = fileFor(slug);
  if (!file) return null;
  const page = await lazy[file]();
  cache.set(slug, page);
  return page;
}

export function primePage(slug: string, page: PageData) {
  cache.set(slug, page);
}
