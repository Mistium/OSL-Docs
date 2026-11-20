/* Plain Markdown versions of every page, for language models and for anyone
   who would rather read text than a web page. Append .md to any page's path:
   /learn/variables is /learn/variables.md, the home page is /index.md.

   The docs' own Markdown has extensions (quizzes, exercises, widgets, fence
   flags), so this renders the parsed page back into ordinary Markdown: every
   example keeps the output the checker recorded, the package reference is
   written out in full, and links point at other pages' .md versions.

   /llms.txt lists every page (https://llmstxt.org), and /llms-full.txt is the
   whole site in one file. */

import { readFileSync } from "node:fs";
import { dirname, relative } from "node:path";
import { parsePage, plain, type Block, type Example, type Page } from "../src/lib/markdown.ts";
import type { PackageAPI, Recorded } from "../src/lib/types.ts";
import { ownerOf, signatureOf } from "../src/lib/signature.ts";
import { AREAS, INSTALL, PACKAGE_GROUPS, SOURCE, packageSlug } from "../src/nav.ts";
import { SAMPLES } from "../src/landing/samples.ts";
import { CONTENT, SITE, contentFiles, loadAPI, loadRecordings, slugOf } from "./content.ts";

type Entry = { slug: string; file: string; page: Page };
type Context = { entry: Entry; pages: Map<string, Entry>; api: { version: string; packages: PackageAPI[] }; recorded: Record<string, Recorded> };

/* The path of a page's Markdown version, from the site root. */
export const markdownPath = (slug: string) => (slug === "" ? "index.md" : `${slug}.md`);

const TAGLINE =
  "OSL is a programming language that keeps code readable as programs grow complex, " +
  "compiles to a fast native executable, and is easy to learn and use.";

function fence(code: string, lang = "") {
  const longest = Math.max(2, ...[...code.matchAll(/`+/g)].map((m) => m[0].length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}${lang}\n${code.replace(/\n+$/, "")}\n${ticks}`;
}

/* Links inside a page point at other pages' Markdown, so a reader can follow
   them without leaving plain text. */
function rewriteLinks(text: string, ctx: Context): string {
  const base = `/${dirname(relative(CONTENT, ctx.entry.file)).replace(/\\/g, "/")}/`.replace(/^\/\.\//, "/");
  return text.replace(/\]\(([^)\s]+)\)/g, (whole, href: string) => {
    if (/^([a-z]+:|#)/i.test(href)) return whole;
    const [path, hash] = href.split("#");
    const absolute = new URL(path, `https://x${base}`).pathname;
    let slug: string | undefined;
    if (absolute.endsWith(".md")) slug = absolute.slice(1, -3).replace(/(^|\/)index$/, "");
    else if (ctx.pages.has(absolute.slice(1).replace(/\/$/, "")) || absolute === "/playground" || absolute === "/") slug = absolute.slice(1).replace(/\/$/, "");
    if (slug === undefined) return whole;
    return `](/${markdownPath(slug)}${hash ? `#${hash}` : ""})`;
  });
}

function exampleMarkdown(example: Example, ctx: Context): string {
  const out: string[] = [];
  const multi = example.files.length > 1;
  for (const f of example.files) {
    if (multi) out.push(`File \`${f.name}\`:`);
    out.push(fence(f.code, "osl"));
  }
  const recorded = ctx.recorded[example.id];
  if (example.mode === "error") {
    const text = recorded?.output?.trim();
    out.push(text ? `This doesn't compile. The compiler reports:\n\n${fence(text, "text")}` : "This example doesn't compile, on purpose.");
  } else if (example.mode === "run") {
    const output = recorded?.output ?? example.expect;
    if (example.varies) out.push("Its output changes from run to run.");
    else if (output !== undefined && output.trim() !== "") out.push(`Output:\n\n${fence(output, "text")}`);
    else if (output !== undefined) out.push("It prints nothing.");
  }
  return out.join("\n\n");
}

function apiMarkdown(api: PackageAPI): string {
  const out: string[] = [`## API reference`, `Every member of \`${api.import}\`, generated from the source of OSL.`];
  const member = (owner: string, m: PackageAPI["functions"][number]) => {
    const parts = [`### \`${signatureOf(owner, m)}\``];
    if (m.deprecated) parts.push(`**Deprecated.** ${m.deprecated}`);
    const doc = (m.deprecated ? m.doc?.replace(/\n*Deprecated:[\s\S]*$/, "") : m.doc)?.trim();
    if (doc) parts.push(docMarkdown(doc));
    return parts.join("\n\n");
  };
  if (api.functions.length) {
    out.push("### Functions");
    for (const f of api.functions) out.push(member(api.name, f).replace(/^### /, "#### "));
  }
  if (api.constants.length) {
    out.push("### Constants");
    for (const c of api.constants) out.push(`- \`${c.type} ${api.name}.${c.name}\`${c.doc ? `: ${c.doc.trim().replace(/\s*\n\s*/g, " ")}` : ""}`);
  }
  for (const t of api.types) {
    out.push(`### \`${t.name.includes(".") ? `*${t.name}` : t.name}\``);
    if (!t.methods.length) out.push("A handle with no methods of its own: pass it to the package's functions.");
    for (const m of t.methods) out.push(member(ownerOf(t.name), m).replace(/^### /, "#### "));
  }
  return out.join("\n\n");
}

/* Go doc comments mark code by indenting it. */
function docMarkdown(doc: string): string {
  const out: string[] = [];
  let code: string[] = [];
  const flush = () => {
    if (code.length) out.push(fence(code.join("\n").replace(/\n+$/, ""), "osl"));
    code = [];
  };
  for (const line of doc.split("\n")) {
    if (/^(\t| {2,})/.test(line)) code.push(line.replace(/^(\t| {2})/, ""));
    else if (!line.trim() && code.length) code.push("");
    else {
      flush();
      out.push(line);
    }
  }
  flush();
  return out.join("\n").replace(/\n{3,}/g, "\n\n");
}

const link = (slug: string, ctx: Context, description = true) => {
  const entry = ctx.pages.get(slug);
  const title = entry ? plain(entry.page.title) : slug;
  const text = description && entry?.page.description ? `: ${entry.page.description}` : "";
  return `- [${title}](/${markdownPath(slug)})${text}`;
};

function widgetMarkdown(name: string, props: Record<string, string>, ctx: Context): string {
  switch (name) {
    case "api": {
      const pkg = ctx.entry.page.meta.package;
      const api = ctx.api.packages.find((p) => p.import === `std:${pkg}`);
      return api ? apiMarkdown(api) : "";
    }
    case "install":
      return fence(INSTALL, "bash");
    case "lessons":
      return AREAS[0].sections
        .map((s) => ({ ...s, pages: s.pages.filter((p) => p !== "learn") }))
        .filter((s) => s.pages.length)
        .map((s) => `### ${s.title}\n\n${s.pages.map((p) => link(p, ctx)).join("\n")}`)
        .join("\n\n");
    case "packages":
      return PACKAGE_GROUPS.map((g) => {
        const rows = g.packages.map((p) => {
          const description = ctx.api.packages.find((a) => a.import === `std:${p}`)?.description ?? ctx.pages.get(packageSlug(p))?.page.description ?? "";
          return `- [${p}](/${markdownPath(packageSlug(p))})${description ? `: ${description}` : ""}`;
        });
        return `### ${g.title}\n\n${g.blurb}\n\n${rows.join("\n")}`;
      }).join("\n\n");
    case "pages": {
      const area = AREAS.find((a) => a.slug === props.area);
      return area ? area.sections.flatMap((s) => s.pages).filter((p) => p !== area.slug).map((p) => link(p, ctx)).join("\n") : "";
    }
    default:
      return "";
  }
}

const quote = (text: string) => text.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n");

const TONES: Record<string, string> = { tip: "Tip", note: "Note", warning: "Warning", important: "Important", hint: "Hint", go: "Coming from Go", js: "Coming from JavaScript", python: "Coming from Python" };

function blocksMarkdown(blocks: Block[], ctx: Context, depth = 0): string {
  return blocks.map((b) => blockMarkdown(b, ctx, depth)).filter((s) => s.trim()).join("\n\n");
}

function blockMarkdown(b: Block, ctx: Context, depth: number): string {
  const text = (t: string) => rewriteLinks(t, ctx);
  switch (b.type) {
    case "heading":
      return `${"#".repeat(Math.min(6, b.level + depth))} ${text(b.text)}`;
    case "paragraph":
      return text(b.text);
    case "list":
      return b.items
        .map((item, n) => {
          const marker = b.ordered ? `${(b.start ?? 1) + n}.` : "-";
          const body = blocksMarkdown(item, ctx, depth);
          return `${marker} ${body.replace(/\n/g, `\n${" ".repeat(marker.length + 1)}`)}`;
        })
        .join("\n");
    case "table": {
      const align = b.align.map((a) => (a === "center" ? ":---:" : a === "right" ? "---:" : a === "left" ? ":---" : "---"));
      const row = (cells: string[]) => `| ${cells.map((c) => text(c)).join(" | ")} |`;
      return [row(b.head), `| ${align.join(" | ")} |`, ...b.rows.map(row)].join("\n");
    }
    case "callout": {
      const label = TONES[b.tone] ?? b.tone;
      const head = `**${b.title ? `${label}: ${b.title}` : label}**`;
      return quote(`${head}\n\n${blocksMarkdown(b.blocks, ctx, depth)}`);
    }
    case "rule":
      return "---";
    case "code":
      return `${b.title ? `\`${b.title}\`:\n\n` : ""}${fence(b.code, b.lang)}`;
    case "example":
      return exampleMarkdown(b.example, ctx);
    case "widget":
      return widgetMarkdown(b.name, b.props, ctx);
    case "quiz": {
      const options = b.options.map((o) => `- [${o.correct ? "x" : " "}] ${text(o.text)}`).join("\n");
      const answer = blocksMarkdown(b.explain, ctx, depth);
      return `**Quiz.** ${blocksMarkdown(b.question, ctx, depth)}\n\n${options}\n\n${answer ? `Answer: ${answer}` : ""}`.trim();
    }
    case "exercise": {
      const parts = [`${"#".repeat(Math.min(6, 3 + depth))} Exercise: ${b.title}`, blocksMarkdown(b.blocks, ctx, depth)];
      if (b.starter) parts.push(`Starting code:\n\n${b.starter.files.map((f) => fence(f.code, "osl")).join("\n\n")}`);
      if (b.expect !== undefined) parts.push(`It should print:\n\n${fence(b.expect, "text")}`);
      b.hints.forEach((h, n) => parts.push(`Hint ${n + 1}: ${blocksMarkdown(h, ctx, depth)}`));
      if (b.solution) parts.push(`A solution:\n\n${b.solution.files.map((f) => fence(f.code, "osl")).join("\n\n")}`);
      return parts.filter((p) => p.trim()).join("\n\n");
    }
    case "details":
      return `**${text(b.title)}**\n\n${blocksMarkdown(b.blocks, ctx, depth)}`;
    case "steps":
      return b.steps.map((s, n) => `${"#".repeat(Math.min(6, 3 + depth))} ${n + 1}. ${text(s.title)}\n\n${blocksMarkdown(s.blocks, ctx, depth)}`).join("\n\n");
    case "cards":
      return b.cards.map((c) => `- ${text(`[${plain(c.title)}](${c.href})`)}${c.text ? `: ${text(c.text)}` : ""}`).join("\n");
  }
}

function header(title: string, description: string, slug: string) {
  const url = `${SITE}/${slug}`;
  return [`# ${plain(title)}`, description ? `> ${description}` : "", `This is the Markdown version of ${url}. Every page of the OSL docs has one: add .md to its path. ${SITE}/llms.txt lists them all.`]
    .filter(Boolean)
    .join("\n\n");
}

function pageMarkdown(entry: Entry, ctx: Omit<Context, "entry">): string {
  const c: Context = { ...ctx, entry };
  const { page, slug } = entry;
  const parts = [header(page.title, page.description, slug)];
  if (page.meta.package) parts.push(page.meta.builtin ? `\`${page.meta.package}\` is built into the language: no import needed.` : fence(`import "std:${page.meta.package}"`, "osl"));
  parts.push(blocksMarkdown(page.blocks, c));
  return `${parts.join("\n\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

function homeMarkdown(ctx: Omit<Context, "entry">): string {
  const hero = SAMPLES.hero;
  const recorded = ctx.recorded[hero.example.id];
  const parts = [
    header("OSL", TAGLINE, ""),
    [
      "OSL puts four things first:",
      "- **Readable:** a file runs from top to bottom, types come first, blocks are parentheses " +
        "and counting starts at one.",
      "- **Capable:** structs, classes, generics, enums, threads and errors as values are part of " +
        "the language, and the standard library ships with it.",
      "- **Fast:** OSL compiles to Go, which builds a native executable with no runtime to install.",
      "- **Easy:** `log \"Hello\"` is a whole program, one `osl` command runs, tests, formats and " +
        "fixes code, and its errors explain what went wrong, usually with the fix.",
    ].join("\n"),
    fence(hero.files["main.osl"], "osl"),
    recorded?.output ? `Output:\n\n${fence(recorded.output, "text")}` : "",
    "## Install",
    fence(INSTALL, "bash"),
    "You need a Go toolchain to compile. The programs you build don't need Go or OSL to run.",
    ...AREAS.map((area) => `## ${area.title}\n\n${area.blurb}\n\n${link(area.slug, { ...ctx, entry: ctx.pages.get(area.slug)! }, false)}`),
    "## Try it",
    `The playground at ${SITE}/playground compiles OSL in the browser. The compiler's source is at ${SOURCE}.`,
  ];
  return `${parts.filter(Boolean).join("\n\n")}\n`;
}

function llmsTxt(ctx: Omit<Context, "entry">): string {
  const out = [`# OSL`, `> ${TAGLINE}`, `Every page of these docs is available as Markdown by adding .md to its path. Examples are compiled and run when the site is built, and their output is shown under them.`];
  out.push(`- [Home](${SITE}/index.md): what OSL is, with a first example and the install command`);
  for (const area of AREAS) {
    out.push(`## ${area.title}`);
    out.push(
      area.sections
        .flatMap((s) => s.pages)
        .filter((slug) => ctx.pages.has(slug))
        .map((slug) => {
          const entry = ctx.pages.get(slug)!;
          return `- [${plain(entry.page.title)}](${SITE}/${markdownPath(slug)})${entry.page.description ? `: ${entry.page.description}` : ""}`;
        })
        .join("\n"),
    );
  }
  return `${out.join("\n\n")}\n`;
}

/* Every Markdown file the site serves, by its path from the root. */
export function markdownFiles(): Map<string, string> {
  const pages = new Map<string, Entry>();
  for (const file of contentFiles()) {
    const slug = slugOf(file);
    pages.set(slug, { slug, file, page: parsePage(readFileSync(file, "utf8")) });
  }
  const ctx = { pages, api: loadAPI(), recorded: loadRecordings() };
  const files = new Map<string, string>();
  files.set("index.md", homeMarkdown(ctx));
  files.set(
    "playground.md",
    `${header("Playground", "Write OSL in the browser.", "playground")}\n\nThe playground is an interactive editor: the OSL compiler runs in the page, so it checks, formats and shows the generated Go for whatever you type, and runs programs when the site has a run server. Code lives in the page's URL, so a link shares it. To run OSL on your own machine, see [Install OSL](/install.md).\n`,
  );
  // Read in the site's order, so llms-full.txt reads like the docs.
  const order = [...AREAS.flatMap((a) => a.sections.flatMap((s) => s.pages)), ...pages.keys()].filter((slug, n, all) => pages.has(slug) && all.indexOf(slug) === n);
  for (const slug of order) files.set(markdownPath(slug), pageMarkdown(pages.get(slug)!, ctx));
  files.set("llms.txt", llmsTxt(ctx));
  files.set("llms-full.txt", [files.get("index.md")!, ...order.map((slug) => files.get(markdownPath(slug))!)].join("\n\n---\n\n"));
  return files;
}
