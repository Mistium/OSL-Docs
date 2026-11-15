/* The docs' build plugin.

   - content/<slug>.md?page imports as the parsed page, with the recorded
     output of each of its examples (generated/examples.json) and, for a
     package page, that package's API (generated/api.json).
   - virtual:docs-index is every page's title, description and headings, for
     navigation.
   - /search.json is the full-text search index, fetched when someone opens
     search.
   - <page>.md is the page as plain Markdown, for language models and anyone
     who'd rather read the source, and /llms.txt lists them all. */

import { readFileSync } from "node:fs";
import { relative } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import { examplesOf, parsePage, plain, textOf, type Block } from "../src/lib/markdown.ts";
import type { Recorded } from "../src/lib/types.ts";
import { SAMPLES } from "../src/landing/samples.ts";
import { API, CONTENT, EXAMPLES, contentFiles, loadAPI, readJSON, slugOf } from "./content.ts";
import { markdownFiles } from "./llm.ts";

export { contentFiles, slugOf };

function headings(blocks: Block[]) {
  return blocks.filter((b): b is Extract<Block, { type: "heading" }> => b.type === "heading" && b.level === 2).map((b) => ({ id: b.id, text: plain(b.text) }));
}

export function pageModule(file: string) {
  const page = parsePage(readFileSync(file, "utf8"));
  const recorded = readJSON<Record<string, Recorded>>(EXAMPLES, {});
  const outputs: Record<string, Recorded> = {};
  for (const example of examplesOf(page.blocks)) if (recorded[example.id]) outputs[example.id] = recorded[example.id];
  const api = page.meta.package ? loadAPI().packages.find((p) => p.import === `std:${page.meta.package}`) ?? null : null;
  return { slug: slugOf(file), ...page, outputs, api };
}

function index() {
  const pages: Record<string, { title: string; description: string; headings: { id: string; text: string }[]; meta: Record<string, string>; file: string }> = {};
  for (const file of contentFiles()) {
    const page = parsePage(readFileSync(file, "utf8"));
    pages[slugOf(file)] = { title: page.title, description: page.description, headings: headings(page.blocks), meta: page.meta, file: relative(CONTENT, file) };
  }
  const api = loadAPI();
  return { pages, version: api.version, packages: api.packages.map((p) => ({ name: p.name, import: p.import, description: p.description })) };
}

export function searchIndex() {
  const entries: { slug: string; title: string; heading?: string; anchor?: string; text: string }[] = [];
  for (const file of contentFiles()) {
    const page = parsePage(readFileSync(file, "utf8"));
    const slug = slugOf(file);
    // One entry per h2 section, so results can jump to the right place.
    let current: { heading?: string; anchor?: string; blocks: Block[] } = { blocks: [] };
    const flush = () => {
      const text = textOf(current.blocks);
      if (text || current.heading) entries.push({ slug, title: plain(page.title), ...(current.heading ? { heading: current.heading, anchor: current.anchor } : {}), text: text.slice(0, 1200) });
    };
    for (const b of page.blocks) {
      if (b.type === "heading" && b.level === 2) {
        flush();
        current = { heading: plain(b.text), anchor: b.id, blocks: [] };
      } else current.blocks.push(b);
    }
    flush();
    if (page.meta.package) {
      const api = loadAPI().packages.find((p) => p.import === `std:${page.meta.package}`);
      if (api) {
        for (const fn of api.functions) entries.push({ slug, title: plain(page.title), heading: `${api.name}.${fn.name}`, anchor: `fn-${fn.name}`, text: (fn.doc ?? "").slice(0, 300) });
        for (const type of api.types)
          for (const m of type.methods) entries.push({ slug, title: plain(page.title), heading: `${type.name}.${m.name}`, anchor: `${type.name.replace(/\W/g, "-")}-${m.name}`, text: (m.doc ?? "").slice(0, 300) });
      }
    }
  }
  return entries;
}

export function docs(): Plugin {
  const INDEX = "virtual:docs-index";
  const LANDING = "virtual:landing-outputs";
  let server: ViteDevServer | undefined;
  return {
    name: "osl-docs",
    enforce: "pre",
    configureServer(dev) {
      server = dev;
      dev.watcher.add([CONTENT, EXAMPLES, API]);
      dev.middlewares.use("/search.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(JSON.stringify(searchIndex()));
      });
      dev.middlewares.use((req, res, next) => {
        const path = decodeURIComponent((req.url ?? "").split(/[?#]/)[0]).replace(/^\/+/, "");
        if (!/\.(md|txt)$/.test(path) || path === "robots.txt") return next();
        const file = markdownFiles().get(path);
        if (file === undefined) return next();
        res.setHeader("Content-Type", `${path.endsWith(".md") ? "text/markdown" : "text/plain"}; charset=utf-8`);
        res.end(file);
      });
    },
    resolveId(id) {
      if (id === INDEX) return "\0" + INDEX;
      if (id === LANDING) return "\0" + LANDING;
    },
    load(id) {
      if (id === "\0" + INDEX) {
        for (const file of contentFiles()) this.addWatchFile(file);
        return `export default ${JSON.stringify(index())}`;
      }
      if (id === "\0" + LANDING) {
        this.addWatchFile(EXAMPLES);
        const recorded = readJSON<Record<string, Recorded>>(EXAMPLES, {});
        const outputs: Record<string, Recorded> = {};
        for (const sample of Object.values(SAMPLES)) if (recorded[sample.example.id]) outputs[sample.example.id] = recorded[sample.example.id];
        return `export default ${JSON.stringify(outputs)}`;
      }
      const [path, query] = id.split("?");
      if (query === "page" && path.endsWith(".md")) {
        this.addWatchFile(path);
        this.addWatchFile(EXAMPLES);
        return `export default ${JSON.stringify(pageModule(path))}`;
      }
    },
    handleHotUpdate(ctx) {
      if (!server) return;
      if (ctx.file.startsWith(CONTENT) || ctx.file === EXAMPLES || ctx.file === API) {
        for (const id of ["\0" + INDEX, "\0" + LANDING]) {
          const mod = server.moduleGraph.getModuleById(id);
          if (mod) server.moduleGraph.invalidateModule(mod);
        }
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
    generateBundle() {
      if (this.environment?.name === "ssr") return;
      this.emitFile({ type: "asset", fileName: "search.json", source: JSON.stringify(searchIndex()) });
      for (const [fileName, source] of markdownFiles()) this.emitFile({ type: "asset", fileName, source });
    },
  };
}
