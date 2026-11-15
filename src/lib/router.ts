/* A small history router: links inside the site change the page without a
   reload, and every page also exists as a prerendered file. */

import { useEffect, useState } from "preact/hooks";

type Listener = (path: string) => void;
const listeners = new Set<Listener>();

export const normalize = (path: string) => {
  const clean = path.replace(/[?#].*$/, "").replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  return clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
};

export const slugFromPath = (path: string) => normalize(path).replace(/^\/+/, "");

export function navigate(href: string, replace = false) {
  if (typeof window === "undefined") return;
  const url = new URL(href, location.href);
  const samePage = normalize(url.pathname) === normalize(location.pathname);
  saveScroll();
  restoreTo = undefined;
  shownPath = normalize(url.pathname);
  if (replace) history.replaceState(null, "", url);
  else history.pushState(null, "", url);
  if (samePage) {
    scrollToHash(url.hash);
    return;
  }
  document.documentElement.dataset.navigated = "";
  for (const listener of listeners) listener(normalize(url.pathname));
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView({ block: "start" });
  else window.scrollTo({ top: 0 });
}

/* Each history entry remembers how far down its page was scrolled, so Back
   and Forward land where you left off and a fresh link starts at the top.
   The site does this itself because the browser would restore the position
   before the page it belongs to has loaded. */
type Saved = { scroll?: number };

// Where the entry being shown wants the page: set from history on Back and
// Forward and on the first load, cleared by a fresh link.
let restoreTo: number | undefined;
let pending = 0;
// The page on screen, to tell Back between two spots on one page (which
// only scrolls) from Back to another page (which renders it first).
let shownPath = "";

function saveScroll() {
  clearTimeout(pending);
  const state = (history.state ?? {}) as Saved;
  if (state.scroll === window.scrollY) return;
  history.replaceState({ ...state, scroll: window.scrollY }, "");
}

export function trackScroll() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(pending);
      pending = window.setTimeout(saveScroll, 150);
    },
    { passive: true },
  );
  window.addEventListener("pagehide", saveScroll);
  window.addEventListener("popstate", () => {
    clearTimeout(pending);
    restoreTo = (history.state as Saved | null)?.scroll;
    const path = normalize(location.pathname);
    if (path === shownPath) restoreScroll();
    else document.documentElement.dataset.navigated = "";
    shownPath = path;
  });
  restoreTo = (history.state as Saved | null)?.scroll;
  shownPath = normalize(location.pathname);
}

/* Puts the page where this history entry left it, or at its #hash, or at
   the top. */
export function restoreScroll() {
  const saved = restoreTo;
  restoreTo = undefined;
  if (typeof saved === "number") window.scrollTo({ top: saved });
  else if (location.hash) scrollToHash(location.hash);
  else window.scrollTo({ top: 0 });
}

export function usePath(initial: string): string {
  const [path, setPath] = useState(initial);
  useEffect(() => {
    const listener: Listener = (next) => setPath(next);
    listeners.add(listener);
    const pop = () => setPath(normalize(location.pathname));
    window.addEventListener("popstate", pop);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("popstate", pop);
    };
  }, []);
  return path;
}

/* The address a link leads to inside the site, or null for a link the
   browser should follow itself: another site, a new tab, a download, or a
   file such as a page's Markdown. */
function internalLink(anchor: HTMLAnchorElement | null): URL | null {
  if (!anchor || anchor.target || anchor.hasAttribute("download")) return null;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("mailto:") || (/^[a-z]+:/i.test(href) && !href.startsWith(location.origin))) return null;
  const url = new URL(href, location.href);
  if (url.origin !== location.origin) return null;
  if (/\.(json|wasm|js|txt|xml|png|svg|osl|md)$/.test(url.pathname)) return null;
  return url;
}

const linkAt = (event: Event) => (event.target as Element | null)?.closest?.("a") ?? null;

/* Sends clicks on same-site links through navigate(). */
export function interceptLinks() {
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = internalLink(linkAt(event));
    if (!url) return;
    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });
}

/* Calls load with a link's path as soon as someone points at, touches or
   tabs to it, so the page is usually in by the time they click. */
export function prefetchLinks(load: (path: string) => void) {
  const seen = new Set<string>();
  const intent = (event: Event) => {
    const url = internalLink(linkAt(event));
    if (!url) return;
    const path = normalize(url.pathname);
    if (seen.has(path) || path === normalize(location.pathname)) return;
    seen.add(path);
    load(path);
  };
  for (const type of ["pointerover", "focusin", "touchstart"]) document.addEventListener(type, intent, { passive: true });
}
