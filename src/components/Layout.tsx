import { useEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Menu, Search as SearchIcon, X, Pencil, FileText } from "lucide-preact";
import index from "virtual:docs-index";
import { AREAS, ORDER, areaOf, LESSONS, EDIT_BASE, SOURCE, DOCS_SOURCE } from "../nav";
import { plain } from "../lib/markdown";
import type { PageData } from "../lib/types";
import { Blocks, Text } from "./Blocks";
import { markPage, useProgress } from "../lib/progress";
import { Search } from "./Search";
import { Logo } from "./Logo";
import { Project } from "./Project";

export const titleOf = (slug: string) => plain(index.pages[slug]?.title ?? slug);

const NAV = [
  { href: "/learn", label: "Learn", area: "learn" },
  { href: "/build", label: "Build", area: "build" },
  { href: "/packages", label: "Packages", area: "packages" },
  { href: "/reference", label: "Reference", area: "reference" },
  { href: "/playground", label: "Playground", area: "playground" },
];

export function Header({ current }: { current: string }) {
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target as HTMLElement).closest?.("input, textarea, [contenteditable]"))) {
        e.preventDefault();
        setSearching(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => setOpen(false), [current]);
  return (
    <header class="topbar">
      <div class="topbar__inner">
        <a class="brand" href="/" aria-label="OSL home">
          <Logo />
          <span class="brand__name">OSL</span>
        </a>
        <nav
          class={`topnav${open ? " is-open" : ""}`}
          aria-label="Main"
          onClick={(e) => (e.target as Element).closest("a") && setOpen(false)}
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} class="topnav__link" aria-current={current === item.area ? "page" : undefined}>
              {item.label}
            </a>
          ))}
          <a href="/install" class="topnav__link topnav__install" aria-current={current === "install" ? "page" : undefined}>
            Install
          </a>
        </nav>
        <div class="topbar__tools">
          <button type="button" class="search-trigger" onClick={() => setSearching(true)} aria-label="Search the docs">
            <SearchIcon aria-hidden="true" />
            <span class="search-trigger__text">Search</span>
            <kbd class="search-trigger__kbd">Ctrl K</kbd>
          </button>
          <a class="btn btn--primary btn--sm topbar__cta" href="/install">
            Install
          </a>
          <button type="button" class="icon-btn topbar__menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {searching && <Search onClose={() => setSearching(false)} />}
    </header>
  );
}

export function Footer() {
  return (
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__brand">
          <a class="brand" href="/" aria-label="OSL home">
            <Logo />
            <span class="brand__name">OSL</span>
          </a>
          <p>
            A simple, powerful language that compiles to fast native programs. MIT licensed.
          </p>
        </div>
        <div class="footer__cols">
          <div>
            <h3>Learn</h3>
            <a href="/learn">The course</a>
            <a href="/build">Projects</a>
            <a href="/playground">Playground</a>
          </div>
          <div>
            <h3>Docs</h3>
            <a href="/packages">Packages</a>
            <a href="/reference">Reference</a>
            <a href="/reference/cli">Command line</a>
          </div>
          <div>
            <h3>Source</h3>
            <a href={SOURCE} target="_blank" rel="noopener">
              Compiler
            </a>
            <a href={DOCS_SOURCE} target="_blank" rel="noopener">
              This site
            </a>
            <a href="https://rotur.dev" target="_blank" rel="noopener">
              Rotur
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Words a group of pages all start their titles with, which the sidebar
   leaves off: under Build, "Build a web API" is just "Web API". */
const SHARED_PREFIX: [string, RegExp][] = [
  ["build/", /^Build an? /],
  ["reference/legacy/", /^Legacy /],
];

/* What a page is called in its area's sidebar: shorter than its title,
   since the area heading already says where you are. */
function navLabel(page: string, area: string): string {
  if (page === area) return "Overview";
  const title = titleOf(page).replace(/^std:/, "");
  const prefix = SHARED_PREFIX.find(([parent]) => page.startsWith(parent))?.[1];
  const rest = prefix && title.replace(prefix, "");
  return rest && rest !== title ? rest.charAt(0).toUpperCase() + rest.slice(1) : title;
}

/* Keeps the current link in view inside the sidebar's own scroll box,
   without moving the page, and only when it has scrolled out of sight. */
function revealIn(box: HTMLElement | null, item: HTMLElement | null, jump: boolean) {
  if (!box || !item || box.scrollHeight <= box.clientHeight) return;
  if (jump) box.scrollTop = 0;
  const top = item.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
  const margin = 48;
  if (top < box.scrollTop + margin || top + item.offsetHeight > box.scrollTop + box.clientHeight - margin)
    box.scrollTop = top - box.clientHeight / 3;
}

function Sidebar({ slug }: { slug: string }) {
  const area = areaOf(slug);
  const progress = useProgress();
  const nav = useRef<HTMLElement>(null);
  const current = useRef<HTMLAnchorElement>(null);
  const shownArea = useRef<string | undefined>(undefined);
  useEffect(() => {
    const box = nav.current?.closest<HTMLElement>(".docs__side") ?? null;
    revealIn(box, current.current, shownArea.current !== area?.slug);
    shownArea.current = area?.slug;
  }, [slug]);
  if (!area) return null;
  const learning = area.slug === "learn";
  return (
    <nav ref={nav} class="sidenav" aria-label={area.title}>
      <a class="sidenav__area" href={`/${area.slug}`}>
        {area.title}
      </a>
      {area.sections.map((section) => (
        <div key={section.title} class="sidenav__section">
          <div class="sidenav__label">{section.title}</div>
          {section.pages.map((page) => {
            const here = page === slug;
            const done = learning && Boolean(progress.pages[page]);
            const time = index.pages[page]?.meta.time?.replace(/ minutes?$/, " min");
            return (
              <a
                key={page}
                ref={here ? current : undefined}
                href={`/${page}`}
                class={`sidenav__item${done ? " is-done" : ""}`}
                aria-current={here ? "page" : undefined}
              >
                <span>{navLabel(page, area.slug)}</span>
                {done && <Check class="sidenav__check" aria-label="complete" />}
                {time && <span class="sidenav__meta">{time}</span>}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Toc({ page }: { page: PageData }) {
  const headings = index.pages[page.slug]?.headings ?? [];
  const [active, setActive] = useState("");
  useEffect(() => {
    const targets = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [page.slug]);
  if (headings.length < 2) return null;
  return (
    <nav class="toc" aria-label="On this page">
      <div class="toc__label">On this page</div>
      {headings.map((h) => (
        <a key={h.id} href={`#${h.id}`} class={active === h.id ? "is-active" : undefined}>
          {h.text}
        </a>
      ))}
    </nav>
  );
}

function Pager({ slug }: { slug: string }) {
  const area = areaOf(slug);
  const order = area ? area.sections.flatMap((s) => s.pages) : ORDER;
  const at = order.indexOf(slug);
  if (at < 0) return null;
  const prev = order[at - 1];
  const next = order[at + 1];
  return (
    <nav class="pager" aria-label="Pages">
      {prev ? (
        <a href={`/${prev}`} class="pager__link">
          <span class="pager__dir">
            <ArrowLeft aria-hidden="true" /> Previous
          </span>
          <span class="pager__title">{titleOf(prev)}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={`/${next}`} class="pager__link pager__link--next">
          <span class="pager__dir">
            Next <ArrowRight aria-hidden="true" />
          </span>
          <span class="pager__title">{titleOf(next)}</span>
        </a>
      )}
    </nav>
  );
}

function Complete({ slug }: { slug: string }) {
  const progress = useProgress();
  const done = Boolean(progress.pages[slug]);
  const finished = LESSONS.filter((s) => progress.pages[s]).length;
  return (
    <div class={`complete${done ? " is-done" : ""}`}>
      <button type="button" class={done ? "btn btn--ghost" : "btn btn--primary"} onClick={() => markPage(slug, !done)} aria-pressed={done}>
        <CheckCircle2 aria-hidden="true" />
        {done ? "Lesson complete" : "Mark this lesson complete"}
      </button>
      <span class="complete__count">
        {finished} of {LESSONS.length} lessons done
      </span>
    </div>
  );
}

/* A docs page. slug is the address being shown, which runs ahead of page
   while the next page loads: the sidebar marks the new link at once. The
   frame keeps one shape for every kind of page, so moving between pages
   only swaps the article and the sidebar stays put, scroll and all. */
export function DocPage({ page, slug = page.slug }: { page: PageData; slug?: string }) {
  const area = areaOf(page.slug);
  const lesson = LESSONS.includes(page.slug);
  const project = page.meta.layout === "project";
  const packageName = page.meta.package;
  const file = index.pages[page.slug]?.file ?? "index.md";
  const links = (
    <div class="page-links">
      <a class="edit-link" href={`${EDIT_BASE}/${file}`} target="_blank" rel="noopener">
        <Pencil aria-hidden="true" /> Edit this page
      </a>
      <a class="edit-link" href={`/${page.slug}.md`} type="text/markdown">
        <FileText aria-hidden="true" /> View as Markdown
      </a>
    </div>
  );
  const modifier = project ? " docs--project" : area ? "" : " docs--single";
  const importLine = `<span class="hljs-keyword">import</span> <span class="hljs-string">"std:${packageName}"</span>`;
  return (
    <div class={`docs${modifier}`}>
      <aside class="docs__side">
        <Sidebar slug={slug} />
      </aside>
      <article key={page.slug} class="docs__article">
        {project ? (
          <Project page={page} />
        ) : (
          <>
            {area && page.slug !== area.slug && (
              <a class="crumb" href={`/${area.slug}`}>
                {area.title}
              </a>
            )}
            {lesson && page.meta.lesson && <div class="lesson-tag">Lesson {page.meta.lesson}</div>}
            <h1 class="docs__title">
              <Text text={page.title} />
            </h1>
            {page.description && (
              <p class="lede">
                <Text text={page.description} />
              </p>
            )}
            {packageName && (
              <div class="pkg-import">
                <code class="hljs" dangerouslySetInnerHTML={{ __html: importLine }} />
                {page.meta.builtin && <span class="pkg-import__note">built in, no import needed</span>}
              </div>
            )}
            <Blocks blocks={page.blocks} ctx={{ page }} />
            {lesson && <Complete slug={page.slug} />}
          </>
        )}
        <Pager slug={page.slug} />
        {links}
      </article>
      <aside class="docs__toc">{!project && <Toc key={page.slug} page={page} />}</aside>
    </div>
  );
}

export function Shell({
  area,
  children,
  wide = false,
  busy = false,
}: {
  area: string;
  children: ComponentChildren;
  wide?: boolean;
  busy?: boolean;
}) {
  return (
    <div class={`shell${wide ? " shell--wide" : ""}`}>
      <a class="skip" href="#main">
        Skip to content
      </a>
      <Header current={area} />
      <div class={`route-progress${busy ? " is-busy" : ""}`} aria-hidden="true" />
      <main id="main" aria-busy={busy || undefined}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function NotFound() {
  return (
    <div class="notfound">
      <h1 class="docs__title">No page here</h1>
      <p class="lede">The docs moved to a new home, and some pages have new addresses. Try the search, or start from one of these.</p>
      <div class="notfound__links">
        {AREAS.map((a) => (
          <a key={a.slug} class="btn btn--ghost" href={`/${a.slug}`}>
            {a.title}
          </a>
        ))}
      </div>
    </div>
  );
}
