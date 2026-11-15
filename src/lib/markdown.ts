/* The docs' Markdown, parsed into blocks the pages render. Plain functions
   with no DOM, so the build, the example checker and the browser share them.

   Beyond ordinary Markdown (headings with optional {#id}, paragraphs, nested
   lists, tables, rules, quotes, fences) it understands:

   - ```osl fences: OSL examples. Flags after the language say what the
     example checker does with them:
       (none)      compile and run it, and record its output
       norun       compile it but don't run it (servers, windows, files)
       error       it must fail to compile; record the diagnostic
       fragment    neither: a piece of a program that can't stand alone
       file=x.osl  one file of a multi-file example; adjacent fences with
                   file= form one project, run from the first one
       stdin="…"   text fed to the program's standard input
       solution    an exercise's model answer (shown on request)
       varies      its output changes from run to run (random, time);
                   don't give it an output block
   - ```output: the output the example above must print. The checker fails
     when the program prints anything else.
   - > [!tip] / [!note] / [!warning] / [!important] / [!hint] quotes: callouts.
   - ::name key=value lines: widgets (the package reference, cards, …).
   - :::quiz, :::exercise title="…", :::details title="…", :::steps,
     :::cards containers, closed by a line of ':::'. */

export type Inline = string;

export type ExampleFile = { name: string; code: string };
export type ExampleMode = "run" | "norun" | "error" | "fragment";

export type Example = {
  id: string;
  files: ExampleFile[];
  mode: ExampleMode;
  stdin?: string;
  expect?: string;
  solution?: boolean;
  title?: string;
  /* The program is meant to exit with a failure, such as an uncaught throw. */
  fails?: boolean;
  /* Its output changes from run to run, so no output block can pin it. */
  varies?: boolean;
};

export type Block =
  | { type: "heading"; level: number; text: Inline; id: string }
  | { type: "paragraph"; text: Inline }
  | { type: "list"; ordered: boolean; start?: number; items: Block[][] }
  | { type: "table"; head: Inline[]; align: ("left" | "center" | "right" | "")[]; rows: Inline[][] }
  | { type: "callout"; tone: string; title?: string; blocks: Block[] }
  | { type: "rule" }
  | { type: "code"; lang: string; code: string; title?: string }
  | { type: "example"; example: Example }
  | { type: "widget"; name: string; props: Record<string, string> }
  | { type: "quiz"; question: Block[]; options: { text: Inline; correct: boolean }[]; explain: Block[] }
  | { type: "exercise"; title: string; blocks: Block[]; starter?: Example; solution?: Example; expect?: string; hints: Block[][] }
  | { type: "details"; title: string; blocks: Block[] }
  | { type: "steps"; steps: { title: Inline; blocks: Block[] }[] }
  | { type: "cards"; cards: { title: Inline; href: string; text: Inline; tag?: string }[] };

export type Page = {
  title: string;
  description: string;
  meta: Record<string, string>;
  blocks: Block[];
};

export function slugify(text: string): string {
  return plain(text)
    .toLowerCase()
    .replace(/[`*[\]()'’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* FNV-1a, 52 bits, as hex: a stable id for an example that the build and the
   browser compute the same way without a crypto library. */
export function hash(text: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x5bd1e995) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + (h2 & 0xfffff).toString(16).padStart(5, "0"));
}

/* The id changes whenever anything the checker verifies changes, so an
   edited expectation is checked again. */
export function exampleKey(example: Pick<Example, "files" | "mode" | "stdin" | "expect" | "fails">): string {
  return hash(JSON.stringify([example.files.map((f) => [f.name, f.code]), example.mode, example.stdin ?? "", example.expect ?? null, example.fails ?? false]));
}

function frontmatter(source: string): [Record<string, string>, string] {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return [{}, source];
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return [meta, source.slice(match[0].length)];
}

export function attributes(rest: string): Record<string, string> {
  const props: Record<string, string> = {};
  for (const m of rest.matchAll(/([\w-]+)(?:=(?:"((?:[^"\\]|\\.)*)"|(\S+)))?/g)) {
    props[m[1]] = m[2] !== undefined ? m[2].replace(/\\(.)/g, (_, c) => (c === "n" ? "\n" : c)) : m[3] ?? "true";
  }
  return props;
}

const cells = (row: string) =>
  row
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

const LIST_ITEM = /^(\s*)([-*]|\d+\.) (.*)$/;

type Fence = { lang: string; info: Record<string, string>; code: string; start: number; end: number };

function readFence(lines: string[], i: number): Fence | null {
  const open = lines[i].match(/^(\s*)(`{3,}|~{3,})\s*([\w+-]*)\s*(.*)$/);
  if (!open) return null;
  const indent = open[1].length;
  const marker = open[2];
  const body: string[] = [];
  let j = i + 1;
  for (; j < lines.length; j++) {
    const line = lines[j];
    if (line.trim().startsWith(marker) && line.trim().replace(/[`~]/g, "") === "") break;
    body.push(indent ? line.replace(new RegExp(`^ {0,${indent}}`), "") : line);
  }
  return { lang: open[3].toLowerCase(), info: attributes(open[4] ?? ""), code: body.join("\n"), start: i, end: j + 1 };
}

function exampleFrom(fences: Fence[], expect?: string): Example {
  const first = fences[0].info;
  const mode: ExampleMode = first.fragment ? "fragment" : first.error ? "error" : first.norun ? "norun" : "run";
  const files = fences.map((f, n) => ({ name: f.info.file ?? (n === 0 ? "main.osl" : `file${n + 1}.osl`), code: f.code }));
  const example: Example = { id: "", files, mode };
  if (first.stdin !== undefined) example.stdin = first.stdin;
  if (expect !== undefined) example.expect = expect;
  if (first.solution) example.solution = true;
  if (first.title) example.title = first.title;
  if (first.fails) example.fails = true;
  if (first.varies) example.varies = true;
  example.id = exampleKey(example);
  return example;
}

function isBlank(line: string | undefined) {
  return line === undefined || !line.trim();
}

const STARTS = /^(#{1,6} |```|~~~|>|:::|::\w|\||---+\s*$|\*\*\*+\s*$)/;

export function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  const ids = new Map<string, number>();
  let i = 0;

  const id = (text: string, fixed?: string) => {
    const base = fixed ?? (slugify(text) || "section");
    const seen = ids.get(base) ?? 0;
    ids.set(base, seen + 1);
    return seen ? `${base}-${seen}` : base;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) {
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,6}) (.+?)(?: \{#([\w-]+)\})?\s*$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2], id: id(heading[2], heading[3]) });
      i++;
      continue;
    }

    if (/^(---+|\*\*\*+)\s*$/.test(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    const fence = readFence(lines, i);
    if (fence) {
      i = fence.end;
      if (fence.lang === "osl") {
        // Adjacent file= fences are one project.
        const group = [fence];
        if (fence.info.file) {
          let j = i;
          while (true) {
            while (isBlank(lines[j]) && j < lines.length) j++;
            const next = j < lines.length ? readFence(lines, j) : null;
            if (!next || next.lang !== "osl" || !next.info.file) break;
            group.push(next);
            j = next.end;
            i = j;
          }
        }
        // An ```output fence right after the example is what it must print.
        let j = i;
        while (isBlank(lines[j]) && j < lines.length) j++;
        const out = j < lines.length ? readFence(lines, j) : null;
        let expect: string | undefined;
        if (out && out.lang === "output") {
          expect = out.code;
          i = out.end;
        }
        blocks.push({ type: "example", example: exampleFrom(group, expect) });
      } else if (fence.lang === "output") {
        blocks.push({ type: "code", lang: "output", code: fence.code, title: fence.info.title });
      } else {
        blocks.push({ type: "code", lang: fence.lang, code: fence.code, title: fence.info.title });
      }
      continue;
    }

    const container = line.match(/^:::\s*(\w+)\s*(.*)$/);
    if (container) {
      const kind = container[1];
      const props = attributes(container[2]);
      const body: string[] = [];
      let depth = 1;
      for (i++; i < lines.length; i++) {
        const inner = lines[i];
        if (/^:::\s*\w/.test(inner)) depth++;
        else if (/^:::\s*$/.test(inner)) {
          depth--;
          if (depth === 0) break;
        }
        body.push(inner);
      }
      i++;
      blocks.push(containerBlock(kind, props, body));
      continue;
    }

    const widget = line.match(/^::([\w-]+)\s*(.*)$/);
    if (widget) {
      blocks.push({ type: "widget", name: widget[1], props: attributes(widget[2]) });
      i++;
      continue;
    }

    if (line.startsWith(">")) {
      const quoted: string[] = [];
      for (; i < lines.length && lines[i].startsWith(">"); i++) quoted.push(lines[i].replace(/^> ?/, ""));
      const tone = quoted[0]?.match(/^\[!(\w+)\](?:\s+(.*))?$/);
      if (tone) quoted.shift();
      blocks.push({ type: "callout", tone: tone ? tone[1].toLowerCase() : "quote", ...(tone?.[2] ? { title: tone[2] } : {}), blocks: parseBlocks(quoted) });
      continue;
    }

    if (line.startsWith("|") && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      const align = cells(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : "") as "left" | "center" | "right" | "");
      const rows: string[][] = [];
      for (i += 2; i < lines.length && lines[i].startsWith("|"); i++) rows.push(cells(lines[i]));
      blocks.push({ type: "table", head, align, rows });
      continue;
    }

    const item = line.match(LIST_ITEM);
    if (item && item[1].length === 0) {
      const ordered = /\d/.test(item[2]);
      const start = ordered ? parseInt(item[2], 10) : undefined;
      const items: string[][] = [];
      while (i < lines.length) {
        const current = lines[i];
        const m = current.match(LIST_ITEM);
        if (m && m[1].length === 0 && /\d/.test(m[2]) === ordered) {
          items.push([m[3]]);
          i++;
          continue;
        }
        if (isBlank(current)) {
          // A blank line continues the list only when indented content follows.
          const next = lines[i + 1];
          if (next !== undefined && /^ {2,}\S/.test(next) && items.length) {
            items[items.length - 1].push("");
            i++;
            continue;
          }
          if (next !== undefined && next.match(LIST_ITEM)?.[1] === "" && /\d/.test(next.match(LIST_ITEM)![2]) === ordered) {
            i++;
            continue;
          }
          break;
        }
        if (/^ {2,}/.test(current) && items.length) {
          items[items.length - 1].push(current.replace(/^ {2,4}/, ""));
          i++;
          continue;
        }
        if (!STARTS.test(current) && !m && items.length) {
          // Lazy continuation of the item's paragraph.
          items[items.length - 1].push(current);
          i++;
          continue;
        }
        break;
      }
      blocks.push({ type: "list", ordered, ...(start && start !== 1 ? { start } : {}), items: items.map((body) => parseBlocks(body)) });
      continue;
    }

    const text: string[] = [line];
    for (i++; i < lines.length && !isBlank(lines[i]) && !STARTS.test(lines[i]) && !lines[i].match(LIST_ITEM); i++) text.push(lines[i]);
    blocks.push({ type: "paragraph", text: text.join("\n") });
  }
  return blocks;
}

function containerBlock(kind: string, props: Record<string, string>, body: string[]): Block {
  const inner = parseBlocks(body);
  switch (kind) {
    case "quiz": {
      const at = inner.findIndex((b) => b.type === "list" && b.items.every((it) => it[0]?.type === "paragraph" && /^\[[ xX]\]\s/.test(it[0].text)));
      if (at < 0) throw new Error(`:::quiz needs a list of - [x] / - [ ] options: ${body.join("\n").slice(0, 80)}`);
      const list = inner[at] as Extract<Block, { type: "list" }>;
      const options = list.items.map((it) => {
        const text = (it[0] as Extract<Block, { type: "paragraph" }>).text;
        return { text: text.replace(/^\[[ xX]\]\s+/, ""), correct: /^\[[xX]\]/.test(text) };
      });
      if (!options.some((o) => o.correct)) throw new Error(`:::quiz has no correct option: ${body[0]}`);
      return { type: "quiz", question: inner.slice(0, at), options, explain: inner.slice(at + 1) };
    }
    case "exercise": {
      const blocks: Block[] = [];
      const hints: Block[][] = [];
      let starter: Example | undefined;
      let solution: Example | undefined;
      let expect: string | undefined;
      for (const b of inner) {
        if (b.type === "example" && b.example.solution) {
          solution = b.example;
          expect ??= b.example.expect;
        } else if (b.type === "example" && !starter) {
          starter = b.example;
          if (b.example.expect !== undefined) expect = b.example.expect;
        } else if (b.type === "callout" && b.tone === "hint") hints.push(b.blocks);
        else blocks.push(b);
      }
      // The expected output is what the solution must print; the starter
      // is unfinished and prints something else.
      if (starter && starter.expect !== undefined) {
        delete starter.expect;
        starter.id = exampleKey(starter);
      }
      if (solution && expect !== undefined) {
        solution.expect = expect;
        solution.id = exampleKey(solution);
      }
      return { type: "exercise", title: props.title ?? "Exercise", blocks, starter, solution, expect, hints };
    }
    case "details":
      return { type: "details", title: props.title ?? "Details", blocks: inner };
    case "steps": {
      // Each ### heading starts a step.
      const steps: { title: string; blocks: Block[] }[] = [];
      for (const b of inner) {
        if (b.type === "heading") steps.push({ title: b.text, blocks: [] });
        else if (steps.length) steps[steps.length - 1].blocks.push(b);
      }
      return { type: "steps", steps };
    }
    case "cards": {
      const cards: { title: string; href: string; text: string; tag?: string }[] = [];
      for (const b of inner) {
        if (b.type !== "list") continue;
        for (const it of b.items) {
          const text = it[0]?.type === "paragraph" ? it[0].text : "";
          const m = text.match(/^\[([^\]]+)\]\(([^)\s]+)\)(?:\s*`([^`]+)`)?\s*[:—-]?\s*([\s\S]*)$/);
          if (m) cards.push({ title: m[1], href: m[2], text: m[4], ...(m[3] ? { tag: m[3] } : {}) });
        }
      }
      return { type: "cards", cards };
    }
    default:
      return { type: "callout", tone: kind, ...(props.title ? { title: props.title } : {}), blocks: inner };
  }
}

export function parsePage(source: string): Page {
  const [meta, body] = frontmatter(source.replace(/\r\n/g, "\n"));
  const blocks = parseBlocks(body.split("\n"));
  const first = blocks[0];
  let title = meta.title ?? "";
  if (first?.type === "heading" && first.level === 1) {
    title ||= first.text;
    blocks.shift();
  }
  // The paragraph under the title is the page's lede unless the frontmatter
  // gives a description.
  return { title, description: meta.description ?? "", meta, blocks };
}

/* Every example a page holds, in order, including those inside containers. */
export function examplesOf(blocks: Block[]): Example[] {
  const out: Example[] = [];
  const walk = (list: Block[]) => {
    for (const b of list) {
      if (b.type === "example") out.push(b.example);
      else if (b.type === "list") b.items.forEach(walk);
      else if (b.type === "callout" || b.type === "details") walk(b.blocks);
      else if (b.type === "quiz") {
        walk(b.question);
        walk(b.explain);
      } else if (b.type === "exercise") {
        walk(b.blocks);
        if (b.starter) out.push(b.starter);
        if (b.solution) out.push(b.solution);
        b.hints.forEach(walk);
      } else if (b.type === "steps") b.steps.forEach((s) => walk(s.blocks));
    }
  };
  walk(blocks);
  return out;
}

/* Inline Markdown as tokens. */
export type Token =
  | { kind: "text" | "code" | "strong" | "em" | "break" | "kbd"; text: string }
  | { kind: "link"; text: string; href: string };

const INLINE = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(?<![\w*])\*([^*\s][^*]*?)\*(?![\w*])|(?<![\w_])_([^_\s][^_]*?)_(?![\w_])|<kbd>([^<]+)<\/kbd>|<br>|\n/g;

export function tokens(text: string): Token[] {
  const out: Token[] = [];
  let at = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > at) out.push({ kind: "text", text: text.slice(at, m.index) });
    if (m[1] !== undefined) out.push({ kind: "code", text: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "link", text: m[2], href: m[3] });
    else if (m[4] !== undefined) out.push({ kind: "strong", text: m[4] });
    else if (m[5] !== undefined) out.push({ kind: "em", text: m[5] });
    else if (m[6] !== undefined) out.push({ kind: "em", text: m[6] });
    else if (m[7] !== undefined) out.push({ kind: "kbd", text: m[7] });
    else if (m[0] === "\n") out.push({ kind: "text", text: " " });
    else out.push({ kind: "break", text: " " });
    at = m.index! + m[0].length;
  }
  if (at < text.length) out.push({ kind: "text", text: text.slice(at) });
  return out;
}

/* Plain text of inline Markdown, for titles and search. */
export const plain = (text: string): string =>
  tokens(text)
    .map((t) => (t.kind === "link" || t.kind === "strong" || t.kind === "em" ? plain(t.text) : t.text))
    .join("");

/* The text of a list of blocks, for the search index. */
export function textOf(blocks: Block[]): string {
  const parts: string[] = [];
  const walk = (list: Block[]) => {
    for (const b of list) {
      switch (b.type) {
        case "heading":
        case "paragraph":
          parts.push(plain(b.text));
          break;
        case "list":
          b.items.forEach(walk);
          break;
        case "table":
          parts.push(b.head.map(plain).join(" "), ...b.rows.map((r) => r.map(plain).join(" ")));
          break;
        case "callout":
        case "details":
          walk(b.blocks);
          break;
        case "quiz":
          walk(b.question);
          break;
        case "exercise":
          parts.push(b.title);
          walk(b.blocks);
          break;
        case "steps":
          b.steps.forEach((s) => {
            parts.push(plain(s.title));
            walk(s.blocks);
          });
          break;
        case "cards":
          b.cards.forEach((c) => parts.push(plain(c.title), plain(c.text)));
          break;
      }
    }
  };
  walk(blocks);
  return parts.join(" ").replace(/\s+/g, " ");
}
