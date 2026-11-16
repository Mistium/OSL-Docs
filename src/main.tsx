import { hydrate, render } from "preact";
import "./rotur-ui/rotur-ui.css";
import "./styles/site.css";
import { App, SPECIAL } from "./app";
import { hasPage, loadPage, primePage } from "./pages";
import { interceptLinks, normalize, prefetchLinks, slugFromPath, trackScroll } from "./lib/router";

// Firefox fails imports still in flight when the page is left; that isn't
// worth reporting.
let leaving = false;
addEventListener("pagehide", () => (leaving = true));

async function start() {
  const path = normalize(location.pathname);
  const slug = slugFromPath(path);
  let page = null;
  try {
    page = !(slug in SPECIAL) && hasPage(slug) ? await loadPage(slug) : null;
  } catch (error) {
    // The prerendered page stays readable; it just won't be interactive.
    if (!leaving) console.error("couldn't load this page's code", error);
    return;
  }
  if (page) primePage(slug, page);
  interceptLinks();
  trackScroll();
  prefetchLinks((next) => {
    const nextSlug = slugFromPath(next);
    if (!(nextSlug in SPECIAL) && hasPage(nextSlug)) void loadPage(nextSlug).catch(() => {});
  });
  const root = document.getElementById("app")!;
  // Prerendered pages hydrate; the dev server's empty shell renders.
  if (root.hasChildNodes()) hydrate(<App path={path} page={page} />, root);
  else render(<App path={path} page={page} />, root);
}

void start();
