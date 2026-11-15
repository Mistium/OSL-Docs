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
  if (replace) history.replaceState(null, "", url);
  else history.pushState(null, "", url);
  if (samePage) {
    scrollToHash(url.hash);
    return;
  }
  for (const listener of listeners) listener(normalize(url.pathname));
}

export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.slice(1));
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView({ block: "start" });
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

/* Sends clicks on same-site links through navigate(). */
export function interceptLinks() {
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.("a");
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("mailto:") || /^[a-z]+:/i.test(href) && !href.startsWith(location.origin)) return;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return;
    if (/\.(json|wasm|js|txt|xml|png|svg|osl)$/.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });
}
