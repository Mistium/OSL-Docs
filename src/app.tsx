import { useEffect, useRef, useState } from "preact/hooks";
import { areaOf } from "./nav";
import { cachedPage, hasPage, loadPage } from "./pages";
import { restoreScroll, slugFromPath, usePath } from "./lib/router";
import type { PageData } from "./lib/types";
import { DocPage, NotFound, Shell, titleOf } from "./components/Layout";
import { Landing } from "./landing/Landing";
import { Playground } from "./components/Playground";

export const SPECIAL: Record<string, string> = { "": "home", playground: "playground" };

export function documentTitle(slug: string, page: PageData | null) {
  if (slug === "") return "OSL: readable code for complex programs";
  if (slug === "playground") return "Playground · OSL";
  if (!page) return "Not found · OSL";
  const area = areaOf(slug);
  const title = titleOf(slug);
  return area && area.slug !== slug ? `${title} · ${area.title} · OSL` : `${title} · OSL`;
}

export function App({ path: initialPath, page: initialPage }: { path: string; page: PageData | null }) {
  const path = usePath(initialPath);
  const slug = slugFromPath(path);
  // The last docs page shown, kept on screen while the next one loads.
  const [page, setPage] = useState<PageData | null>(initialPage);
  // Only a slow load shows the progress bar, so a fast one never flickers.
  const [slow, setSlow] = useState(false);

  // All worked out during render, so the frame for a new address never
  // shows a stale state for a moment while effects catch up.
  const special = slug in SPECIAL;
  const ready = special ? null : page?.slug === slug ? page : (cachedPage(slug) ?? null);
  const waiting = !special && !ready && hasPage(slug);
  // What the address settled on: changes once per navigation, when the new
  // page is on screen.
  const settled = special ? slug : waiting ? null : (ready?.slug ?? `404:${slug}`);

  useEffect(() => {
    if (special) return setPage(null);
    const hit = cachedPage(slug);
    if (hit || !hasPage(slug)) return setPage(hit ?? null);
    let cancelled = false;
    const timer = setTimeout(() => setSlow(true), 120);
    loadPage(slug).then(
      (next) => {
        clearTimeout(timer);
        if (cancelled) return;
        setSlow(false);
        setPage(next);
      },
      // A chunk that won't load (usually a tab left open across a deploy)
      // gets the page from the server instead. reload(), not assign(): the
      // address is already the new one, and assigning it with a #hash would
      // only scroll.
      () => {
        if (!cancelled) location.reload();
      },
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
      setSlow(false);
    };
  }, [slug]);

  // Once the new page has rendered, set its title, scroll position and, after
  // a navigation (not the first load), focus.
  const firstSettle = useRef(true);
  useEffect(() => {
    if (settled === null) return;
    document.title = documentTitle(slug, ready);
    restoreScroll(!firstSettle.current);
    firstSettle.current = false;
  }, [settled]);

  if (slug === "")
    return (
      <Shell area="home" wide>
        <Landing />
      </Shell>
    );
  if (slug === "playground")
    return (
      <Shell area="playground" wide>
        <Playground />
      </Shell>
    );
  const area = areaOf(slug)?.slug ?? (slug === "install" ? "install" : "");
  // While the next page loads, the one on screen stays up, its sidebar
  // already marking the link that was clicked.
  const shown = ready ?? (waiting ? page : null);
  return (
    <Shell area={area} busy={slow}>
      {shown ? (
        <DocPage page={shown} slug={slug} />
      ) : waiting ? (
        <div class="docs-loading" aria-busy="true" />
      ) : (
        <NotFound />
      )}
    </Shell>
  );
}
