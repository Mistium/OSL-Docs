/* Widgets: parts of pages written as ::name lines in the Markdown. */

import { useMemo, useState } from "preact/hooks";
import type { FunctionComponent } from "preact";
import { Search, CheckCircle2, Circle } from "lucide-preact";
import index from "virtual:docs-index";
import { highlightHTML } from "../lib/highlight";
import type { APIMethod } from "../lib/types";
import { ownerOf, signatureOf } from "../lib/signature";
import { AREAS, LESSONS, PACKAGE_GROUPS, packageSlug, INSTALL } from "../nav";
import { useProgress } from "../lib/progress";
import { CopyButton } from "./CodeExample";
import { Text, type RenderContext } from "./Blocks";
import { plain } from "../lib/markdown";

type WidgetProps = { ctx: RenderContext; props: Record<string, string> };

/* A Go doc comment as paragraphs, with tab-indented lines as code. */
function DocText({ doc }: { doc: string }) {
  const parts: { code: boolean; text: string }[] = [];
  for (const line of doc.split("\n")) {
    const code = /^(\t| {2,})/.test(line);
    const text = code ? line.replace(/^(\t| {2})/, "") : line;
    const last = parts[parts.length - 1];
    if (!line.trim()) {
      if (last && !last.code) parts.push({ code: false, text: "" });
      else if (last?.code) last.text += "\n";
      continue;
    }
    if (last && last.code === code && (code || last.text)) last.text += code ? `\n${text}` : ` ${text}`;
    else parts.push({ code, text });
  }
  return (
    <>
      {parts
        .filter((p) => p.text.trim())
        .map((p, n) =>
          p.code ? (
            <pre key={n} class="hljs api__code">
              <code dangerouslySetInnerHTML={{ __html: highlightHTML(p.text.trimEnd(), "osl") }} />
            </pre>
          ) : (
            <p key={n}>{docInline(p.text)}</p>
          ),
        )}
    </>
  );
}

/* Doc comments name parameters and methods plainly; quote what looks like
   code so it reads as code. */
function docInline(text: string) {
  return <Text text={text.replace(/(?<![`\w])((?:[a-z]\w*\.)+[a-z]\w*\([^)]*\)|[a-z]\w*\([^)]*\))(?![`\w])/g, "`$1`")} />;
}

const anchor = (owner: string, name: string) => `${owner.replace(/\W/g, "-")}-${name}`;

function Member({ owner, m, id }: { owner: string; m: APIMethod; id: string }) {
  const sig = signatureOf(owner, m);
  return (
    <div class={`api__member${m.deprecated ? " is-deprecated" : ""}`} id={id}>
      <div class="api__sig">
        <a class="api__link" href={`#${id}`} aria-label={`Link to ${owner}.${m.name}`}>
          #
        </a>
        <code class="hljs" dangerouslySetInnerHTML={{ __html: highlightHTML(sig, "osl") }} />
      </div>
      {m.deprecated && (
        <p class="api__deprecated">
          <strong>Deprecated.</strong> {docInline(m.deprecated)}
        </p>
      )}
      {m.doc && (
        <div class="api__doc">
          <DocText doc={m.deprecated ? m.doc.replace(/\n*Deprecated:[\s\S]*$/, "") : m.doc} />
        </div>
      )}
    </div>
  );
}

/* ::api — the full API of the page's package, from the compiler. */
const API: FunctionComponent<WidgetProps> = ({ ctx }) => {
  const api = ctx.page.api;
  const [filter, setFilter] = useState("");
  if (!api) return null;
  const match = (name: string, doc = "") => !filter || `${name} ${doc}`.toLowerCase().includes(filter.toLowerCase());
  const functions = api.functions.filter((f) => match(`${api.name}.${f.name}`, f.doc));
  const constants = api.constants.filter((c) => match(`${api.name}.${c.name}`, c.doc));
  const types = api.types.map((t) => ({ ...t, methods: t.methods.filter((m) => match(`${t.name}.${m.name}`, m.doc)) })).filter((t) => t.methods.length || match(t.name));
  const total = api.functions.length + api.constants.length + api.types.reduce((n, t) => n + t.methods.length, 0);
  return (
    <section class="api" aria-label={`${api.import} reference`}>
      <div class="api__head">
        <p class="api__count">
          {total} members, generated from the <code>{api.import}</code> source of OSL {index.version}.
        </p>
        <label class="search-field api__filter">
          <Search aria-hidden="true" />
          <input type="search" placeholder={`Filter ${api.name}`} value={filter} onInput={(e) => setFilter((e.currentTarget as HTMLInputElement).value)} />
        </label>
      </div>
      {functions.length > 0 && (
        <>
          <h3 class="api__group" id="api-functions">
            Functions
          </h3>
          {functions.map((f) => (
            <Member key={f.name} owner={api.name} m={f} id={`fn-${f.name}`} />
          ))}
        </>
      )}
      {constants.length > 0 && (
        <>
          <h3 class="api__group" id="api-constants">
            Constants
          </h3>
          {constants.map((c) => (
            <div key={c.name} class="api__member" id={`const-${c.name}`}>
              <div class="api__sig">
                <code class="hljs" dangerouslySetInnerHTML={{ __html: highlightHTML(`${c.type} ${api.name}.${c.name}`, "osl") }} />
              </div>
              {c.doc && (
                <div class="api__doc">
                  <DocText doc={c.doc} />
                </div>
              )}
            </div>
          ))}
        </>
      )}
      {types.map((t) => {
        const owner = ownerOf(t.name);
        return (
          <div key={t.name} class="api__type">
            <h3 class="api__group" id={`type-${t.name.replace(/\W/g, "-")}`}>
              <code>{t.name.includes(".") ? `*${t.name}` : t.name}</code>
            </h3>
            {t.methods.length === 0 && <p class="api__none">A handle with no methods of its own: pass it to the package's functions.</p>}
            {t.methods.map((m) => (
              <Member key={m.name} owner={owner} m={m} id={anchor(t.name, m.name)} />
            ))}
          </div>
        );
      })}
      {filter && !functions.length && !constants.length && !types.length && <p class="api__none">Nothing in {api.import} matches “{filter}”.</p>}
    </section>
  );
};

/* ::packages — every package, by group. */
const Packages: FunctionComponent<WidgetProps> = () => {
  const [filter, setFilter] = useState("");
  const describe = (name: string) => index.packages.find((p) => p.import === `std:${name}`)?.description ?? index.pages[packageSlug(name)]?.description ?? "";
  const groups = PACKAGE_GROUPS.map((g) => ({ ...g, packages: g.packages.filter((p) => !filter || `${p} ${describe(p)}`.toLowerCase().includes(filter.toLowerCase())) })).filter((g) => g.packages.length);
  return (
    <div class="pkgs">
      <label class="search-field pkgs__filter">
        <Search aria-hidden="true" />
        <input type="search" placeholder="Find a package: http, image, sqlite…" value={filter} onInput={(e) => setFilter((e.currentTarget as HTMLInputElement).value)} />
      </label>
      {groups.map((g) => (
        <section key={g.slug} class="pkgs__group" id={g.slug}>
          <h2 class="heading">{g.title}</h2>
          <p class="pkgs__blurb">{g.blurb}</p>
          <div class="pkgs__grid">
            {g.packages.map((name) => (
              <a key={name} class="pkg" href={`/${packageSlug(name)}`}>
                <code class="pkg__name">{name}</code>
                <span class="pkg__desc">
                  <Text text={describe(name)} />
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
      {!groups.length && <p>No package matches “{filter}”.</p>}
    </div>
  );
};

/* ::lessons — the course, with this reader's progress. */
const Lessons: FunctionComponent<WidgetProps> = () => {
  const progress = useProgress();
  const done = LESSONS.filter((s) => progress.pages[s]).length;
  return (
    <div class="lessons">
      <div class="lessons__progress" aria-label={`${done} of ${LESSONS.length} lessons complete`}>
        <div class="lessons__bar">
          <span style={{ width: `${(done / LESSONS.length) * 100}%` }} />
        </div>
        <span>
          {done} of {LESSONS.length} lessons complete
        </span>
      </div>
      {AREAS[0].sections.map((section) => {
        const pages = section.pages.filter((s) => s !== "learn");
        if (!pages.length) return null;
        return (
          <section key={section.title} class="lessons__section">
            <h2 class="heading">{section.title}</h2>
            <ol class="lessons__list">
              {pages.map((slug) => {
                const page = index.pages[slug];
                const finished = Boolean(progress.pages[slug]);
                return (
                  <li key={slug}>
                    <a class={`lesson${finished ? " is-done" : ""}`} href={`/${slug}`}>
                      <span class="lesson__mark" aria-hidden="true">
                        {finished ? <CheckCircle2 /> : <Circle />}
                      </span>
                      <span class="lesson__text">
                        <span class="lesson__title">{plain(page?.title ?? slug)}</span>
                        {page?.description && (
                          <span class="lesson__desc">
                            <Text text={page.description} />
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
};

/* ::install — the one-line installer. */
const Install: FunctionComponent<WidgetProps> = () => (
  <div class="install">
    <span class="install__prompt" aria-hidden="true">
      $
    </span>
    <code>{INSTALL}</code>
    <CopyButton text={INSTALL} />
  </div>
);

/* ::pages area=build — cards for an area's pages. */
const AreaPages: FunctionComponent<WidgetProps> = ({ props }) => {
  const area = props.area;
  const found = AREAS.find((a) => a.slug === area);
  const pages = useMemo(() => (found ? found.sections.flatMap((s) => s.pages).filter((s) => s !== found.slug) : []), [area]);
  return (
    <div class="cards">
      {pages.map((slug) => (
        <a key={slug} class="card" href={`/${slug}`}>
          <span class="card__title">{plain(index.pages[slug]?.title ?? slug)}</span>
          <span class="card__text">
            <Text text={index.pages[slug]?.description ?? ""} />
          </span>
        </a>
      ))}
    </div>
  );
};

export const WIDGETS: Record<string, FunctionComponent<WidgetProps>> = {
  api: API,
  packages: Packages,
  lessons: Lessons,
  install: Install,
  pages: AreaPages,
};
