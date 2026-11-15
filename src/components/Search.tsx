/* Full-text search over every page and every package member. The index is
   fetched the first time someone opens search. */

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { CornerDownLeft, FileText, Search as SearchIcon, Braces } from "lucide-preact";
import { navigate } from "../lib/router";

type Entry = { slug: string; title: string; heading?: string; anchor?: string; text: string };

let loaded: Promise<Entry[]> | null = null;
const loadIndex = () => (loaded ??= fetch("/search.json").then((r) => r.json() as Promise<Entry[]>).catch(() => ((loaded = null), [])));

function score(entry: Entry, words: string[]): number {
  const title = entry.title.toLowerCase();
  const heading = (entry.heading ?? "").toLowerCase();
  const text = entry.text.toLowerCase();
  let total = 0;
  for (const w of words) {
    let s = 0;
    if (heading === w || heading.endsWith(`.${w}`)) s += 14;
    if (title === w || title === `std:${w}`) s += 12;
    if (heading.includes(w)) s += 6;
    if (title.includes(w)) s += 5;
    if (text.includes(w)) s += 1 + Math.min(2, text.split(w).length - 2);
    if (!s) return 0;
    total += s;
  }
  if (!entry.heading) total += 1;
  return total;
}

function snippet(text: string, words: string[]): string {
  const lower = text.toLowerCase();
  const at = Math.max(0, Math.min(...words.map((w) => lower.indexOf(w)).filter((n) => n >= 0)));
  const start = Math.max(0, at - 50);
  return (start > 0 ? "…" : "") + text.slice(start, start + 150) + (start + 150 < text.length ? "…" : "");
}

export function Search({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadIndex().then(setEntries);
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
  }, []);

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = useMemo(() => {
    if (!entries || !words.length) return [];
    return entries
      .map((e) => ({ e, s: score(e, words) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30)
      .map((r) => r.e);
  }, [entries, query]);

  const open = (entry: Entry) => {
    onClose();
    navigate(`/${entry.slug}${entry.anchor ? `#${entry.anchor}` : ""}`);
  };

  return (
    <div class="search" role="dialog" aria-modal="true" aria-label="Search" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="search__panel">
        <label class="search__field">
          <SearchIcon aria-hidden="true" />
          <input
            ref={input}
            type="search"
            placeholder="Search lessons, packages and methods"
            value={query}
            onInput={(e) => {
              setQuery((e.currentTarget as HTMLInputElement).value);
              setSelected(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected(Math.min(selected + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected(Math.max(selected - 1, 0));
              } else if (e.key === "Enter" && results[selected]) open(results[selected]);
            }}
          />
          <kbd>Esc</kbd>
        </label>
        <div class="search__results" role="listbox">
          {!entries && <p class="search__empty">Loading the index…</p>}
          {entries && words.length > 0 && !results.length && <p class="search__empty">Nothing matches “{query}”.</p>}
          {entries && !words.length && <p class="search__empty">Try “for loop”, “json.parse”, “websocket” or “1-indexed”.</p>}
          {results.map((entry, n) => (
            <button
              key={`${entry.slug}#${entry.anchor ?? ""}${n}`}
              type="button"
              role="option"
              aria-selected={n === selected}
              class={`search__result${n === selected ? " is-selected" : ""}`}
              onMouseEnter={() => setSelected(n)}
              onClick={() => open(entry)}
            >
              {entry.heading && /\.\w+$/.test(entry.heading) && !entry.heading.includes(" ") ? <Braces aria-hidden="true" /> : <FileText aria-hidden="true" />}
              <span class="search__text">
                <span class="search__title">
                  {entry.heading ? (
                    <>
                      {entry.heading} <span class="search__in">in {entry.title}</span>
                    </>
                  ) : (
                    entry.title
                  )}
                </span>
                {entry.text && <span class="search__snippet">{snippet(entry.text, words)}</span>}
              </span>
              {n === selected && <CornerDownLeft class="search__enter" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
