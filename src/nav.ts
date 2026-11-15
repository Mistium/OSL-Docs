/* The site's sections and the order of their pages. Each slug is a file in
   content/ ("learn/basics" is content/learn/basics.md, "learn" is
   content/learn/index.md); titles come from each page's first heading.
   Package pages are listed by category in PACKAGE_GROUPS. */

export type NavSection = { title: string; pages: string[] };
export type Area = { slug: string; title: string; blurb: string; sections: NavSection[] };

export const PACKAGE_GROUPS: { title: string; slug: string; blurb: string; packages: string[] }[] = [
  {
    title: "Web and networking",
    slug: "web",
    blurb: "HTTP servers and clients, WebSockets, raw sockets and remote file systems.",
    packages: ["serve", "ws", "requests", "url", "net", "mime", "ftp", "ssh", "s3", "webpush", "email", "torrent"],
  },
  {
    title: "Apps and graphics",
    slug: "graphics",
    blurb: "Desktop interfaces, windows, games, 2D physics and GPU shaders.",
    packages: ["ui", "window", "layout", "raylib", "raygui", "box2d", "shader", "canvas", "svg"],
  },
  {
    title: "Data and formats",
    slug: "data",
    blurb: "Parse, validate, transform and write structured text.",
    packages: ["json", "schema", "yaml", "csv", "xml", "md", "template", "diff", "encodings/utf16"],
  },
  {
    title: "Storage",
    slug: "storage",
    blurb: "Databases, key-value saves, caches and configuration.",
    packages: ["db", "save", "cache", "env", "mem"],
  },
  {
    title: "Files and the system",
    slug: "system",
    blurb: "Files, processes, the terminal, logging and archives.",
    packages: ["fs", "process", "sys", "tui", "log", "notify", "zip"],
  },
  {
    title: "Concurrency",
    slug: "concurrency",
    blurb: "Threads, channels, locks, events, retries and schedules.",
    packages: ["thread", "sync", "events", "retry", "cron"],
  },
  {
    title: "Security",
    slug: "security",
    blurb: "Hashing, encryption, signatures and tokens.",
    packages: ["crypto", "jwt"],
  },
  {
    title: "Text, numbers and time",
    slug: "text",
    blurb: "Maths, randomness, dates, regular expressions, versions and emoji.",
    packages: ["math", "random", "date", "regex", "semver", "emoji", "colors"],
  },
  {
    title: "Media and documents",
    slug: "media",
    blurb: "Images, photos' metadata, QR codes, PDFs and sound.",
    packages: ["img", "exif", "qr", "pdf", "sound"],
  },
  {
    title: "Values and types",
    slug: "values",
    blurb: "Results, options, sets, maps and pointers.",
    packages: ["result", "option", "set", "map", "ptr"],
  },
  {
    title: "Embedding and testing",
    slug: "tools",
    blurb: "Run JavaScript and Lua inside OSL, and test your code.",
    packages: ["js", "lua", "testing"],
  },
  {
    title: "Accounts and chat bots",
    slug: "rotur",
    blurb: "Rotur accounts and originChats bots.",
    packages: ["rotur", "originchats"],
  },
];

export const packageSlug = (name: string) => `packages/${name.replace("/", "-")}`;

export const AREAS: Area[] = [
  {
    slug: "learn",
    title: "Learn",
    blurb: "A course that takes you from your first line to threads, generics and Go interop.",
    sections: [
      { title: "Start here", pages: ["learn", "install", "learn/first-program"] },
      { title: "The basics", pages: ["learn/variables", "learn/types", "learn/strings", "learn/arrays", "learn/objects", "learn/control-flow", "learn/match"] },
      { title: "Reusing code", pages: ["learn/functions", "learn/lambdas"] },
      { title: "Your own types", pages: ["learn/structs", "learn/enums", "learn/classes", "learn/interfaces", "learn/generics"] },
      { title: "Beyond the basics", pages: ["learn/errors", "learn/iterators", "learn/operators", "learn/modules", "learn/concurrency", "learn/testing", "learn/go", "learn/next"] },
    ],
  },
  {
    slug: "build",
    title: "Build",
    blurb: "Step-by-step projects: build a real program from an empty file.",
    sections: [
      { title: "Projects", pages: ["build", "build/cli-tool", "build/web-api", "build/realtime-chat", "build/desktop-app", "build/game", "build/terminal-dashboard", "build/chat-bot"] },
    ],
  },
  {
    slug: "packages",
    title: "Packages",
    blurb: "Every package in the standard library, each with a tutorial and its full API.",
    sections: [{ title: "Standard library", pages: ["packages"] }, ...PACKAGE_GROUPS.map((g) => ({ title: g.title, pages: g.packages.map(packageSlug) }))],
  },
  {
    slug: "reference",
    title: "Reference",
    blurb: "The language, its built-ins and its tools, laid out for looking things up.",
    sections: [
      { title: "Language", pages: ["reference", "reference/syntax", "reference/types", "reference/operators", "reference/builtins", "reference/strings", "reference/arrays", "reference/objects", "reference/numbers"] },
      { title: "Tools", pages: ["reference/cli", "reference/opal", "reference/testing", "reference/editor", "reference/diagnostics"] },
      { title: "History", pages: ["reference/legacy", "reference/legacy/debug-commands", "reference/legacy/prototype-helpers", "reference/legacy/types", "reference/legacy/local-scoping"] },
    ],
  },
];

/* The area a page belongs to. */
export function areaOf(slug: string): Area | undefined {
  return AREAS.find((area) => area.sections.some((section) => section.pages.includes(slug)));
}

/* Every page in reading order. */
export const ORDER: string[] = AREAS.flatMap((area) => area.sections.flatMap((section) => section.pages));

export const LESSONS: string[] = AREAS[0].sections.flatMap((s) => s.pages).filter((s) => s !== "learn");

export const SOURCE = "https://git.rotur.dev/osl/.go";
export const DOCS_SOURCE = "https://github.com/Mistium/OSL-Docs";
export const EDIT_BASE = "https://github.com/Mistium/OSL-Docs/edit/main/content";
export const INSTALL = "curl -fsSL https://gosl.mistium.com | sh";
