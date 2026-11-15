import { hydrate, render } from "preact";
import "./rotur-ui/rotur-ui.css";
import "./styles/site.css";
import { App, SPECIAL } from "./app";
import { hasPage, loadPage, primePage } from "./pages";
import { interceptLinks, normalize, slugFromPath } from "./lib/router";

async function start() {
  const path = normalize(location.pathname);
  const slug = slugFromPath(path);
  const page = !(slug in SPECIAL) && hasPage(slug) ? await loadPage(slug) : null;
  if (page) primePage(slug, page);
  interceptLinks();
  const root = document.getElementById("app")!;
  // Prerendered pages hydrate; the dev server's empty shell renders.
  if (root.hasChildNodes()) hydrate(<App path={path} page={page} />, root);
  else render(<App path={path} page={page} />, root);
}

void start();
