import { useEffect, useState } from "preact/hooks";
import { areaOf } from "./nav";
import { cachedPage, hasPage, loadPage } from "./pages";
import { scrollToHash, slugFromPath, usePath } from "./lib/router";
import type { PageData } from "./lib/types";
import { DocPage, NotFound, Shell, titleOf } from "./components/Layout";
import { Landing } from "./landing/Landing";
import { Playground } from "./components/Playground";

export const SPECIAL: Record<string, string> = { "": "home", playground: "playground" };

export function documentTitle(slug: string, page: PageData | null) {
  if (slug === "") return "OSL: a readable language that compiles to native code";
  if (slug === "playground") return "Playground · OSL";
  if (!page) return "Not found · OSL";
  const area = areaOf(slug);
  const title = titleOf(slug);
  return area && area.slug !== slug ? `${title} · ${area.title} · OSL` : `${title} · OSL`;
}

export function App({ path: initialPath, page: initialPage }: { path: string; page: PageData | null }) {
  const path = usePath(initialPath);
  const slug = slugFromPath(path);
  const [page, setPage] = useState<PageData | null>(initialPage);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slug in SPECIAL) {
      document.title = documentTitle(slug, null);
      return;
    }
    let cancelled = false;
    const hit = cachedPage(slug);
    if (hit) {
      setPage(hit);
      return;
    }
    if (!hasPage(slug)) {
      setPage(null);
      return;
    }
    setLoading(true);
    void loadPage(slug).then((next) => {
      if (cancelled) return;
      setPage(next);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Once the new page has rendered, set its title and scroll position.
  useEffect(() => {
    if (loading) return;
    document.title = documentTitle(slug, slug in SPECIAL ? null : page);
    if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash));
    else window.scrollTo({ top: 0 });
  }, [page?.slug, slug, loading]);

  if (slug === "") return <Shell area="home" wide><Landing /></Shell>;
  if (slug === "playground") return <Shell area="playground" wide><Playground /></Shell>;
  const area = areaOf(slug)?.slug ?? (slug === "install" ? "install" : "");
  const shown = page && page.slug === slug ? page : null;
  return (
    <Shell area={area}>
      {shown ? <DocPage page={shown} /> : loading ? <div class="docs-loading" aria-busy="true" /> : <NotFound />}
    </Shell>
  );
}
