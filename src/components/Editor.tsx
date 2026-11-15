/* An editable code area: a highlighted copy of the text sits under a
   transparent textarea, and a third layer underlines the ranges the compiler
   reported. All three share one font and one layout, so they line up. */

import { useEffect, useMemo, useRef } from "preact/hooks";
import { escapeHTML, highlightCode } from "../lib/highlight";
import type { Diagnostic } from "../lib/types";

type Props = {
  value: string;
  onChange: (value: string) => void;
  diagnostics?: Diagnostic[];
  onRun?: () => void;
  onFormat?: () => void;
  label?: string;
  focusLine?: { line: number; at: number } | null;
  autoFocus?: boolean;
};

const INDENT = "  ";

function underline(code: string, diagnostics: Diagnostic[]): string {
  const lines = code.split("\n");
  const marks = new Map<number, { start: number; end: number; severity: string }[]>();
  for (const d of diagnostics) {
    if (!d.line || d.line > lines.length) continue;
    const text = lines[d.line - 1];
    let start = Math.max(0, d.column ?? 0);
    let end = start + Math.max(d.length ?? 0, 0);
    if (end <= start || start >= text.length) {
      // No useful range: underline the line's code.
      start = text.length - text.trimStart().length;
      end = text.length;
    }
    const list = marks.get(d.line) ?? [];
    list.push({ start, end: Math.min(end, text.length), severity: d.severity });
    marks.set(d.line, list);
  }
  return lines
    .map((text, n) => {
      const list = (marks.get(n + 1) ?? []).sort((a, b) => a.start - b.start);
      if (!list.length) return escapeHTML(text);
      let out = "";
      let at = 0;
      for (const m of list) {
        if (m.start < at) continue;
        out += escapeHTML(text.slice(at, m.start));
        out += `<span class="squiggle squiggle--${m.severity}">${escapeHTML(text.slice(m.start, m.end)) || " "}</span>`;
        at = m.end;
      }
      return out + escapeHTML(text.slice(at));
    })
    .join("\n");
}

export function Editor({ value, onChange, diagnostics = [], onRun, onFormat, label = "Code", focusLine, autoFocus }: Props) {
  const area = useRef<HTMLTextAreaElement>(null);
  const highlighted = useMemo(() => highlightCode(value, "osl") ?? escapeHTML(value), [value]);
  const marks = useMemo(() => underline(value, diagnostics), [value, diagnostics]);
  const lineCount = value.split("\n").length;
  const flagged = useMemo(() => {
    const map = new Map<number, string>();
    for (const d of diagnostics) if (d.line && (map.get(d.line) !== "error")) map.set(d.line, d.severity);
    return map;
  }, [diagnostics]);

  useEffect(() => {
    if (autoFocus) area.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!focusLine || !area.current) return;
    const lines = value.split("\n");
    const offset = lines.slice(0, focusLine.line - 1).reduce((sum, l) => sum + l.length + 1, 0);
    area.current.focus();
    area.current.setSelectionRange(offset, offset + (lines[focusLine.line - 1]?.length ?? 0));
  }, [focusLine?.at]);

  const replace = (start: number, end: number, text: string, caret: number, caretEnd = caret) => {
    const el = area.current!;
    const next = value.slice(0, start) + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => el.setSelectionRange(caret, caretEnd));
  };

  // Tab indents, so Escape then Tab is the way out of the editor by keyboard.
  const leaving = useRef(false);

  const onKeyDown = (event: KeyboardEvent) => {
    const el = area.current!;
    const { selectionStart: start, selectionEnd: end } = el;
    // Typing with an input method sends Enter and Tab for its own use.
    if (event.isComposing) return;
    if (event.key === "Tab" && leaving.current) {
      leaving.current = false;
      return;
    }
    leaving.current = event.key === "Escape";
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      onRun?.();
      return;
    }
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && (event.key === "f" || event.key === "F")) {
      event.preventDefault();
      onFormat?.();
      return;
    }
    if (event.key === "Escape") return;
    if (event.key === "Tab") {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      if (start === end && !event.shiftKey) {
        replace(start, end, INDENT, start + INDENT.length);
        return;
      }
      // Indent or dedent every selected line.
      const blockEnd = end > start && value[end - 1] === "\n" ? end - 1 : end;
      const lines = value.slice(lineStart, blockEnd).split("\n");
      const changed = lines.map((l) => (event.shiftKey ? l.replace(/^ {1,2}/, "") : INDENT + l));
      const text = changed.join("\n");
      const delta = changed[0].length - lines[0].length;
      replace(lineStart, blockEnd, text, Math.max(lineStart, start + delta), lineStart + text.length);
      return;
    }
    if (event.key === "Enter" && !event.shiftKey && start === end) {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = line.match(/^\s*/)![0];
      const opens = /\(\s*$/.test(line);
      const closesNext = value[start] === ")";
      if (opens && closesNext) {
        const text = `\n${indent}${INDENT}\n${indent}`;
        replace(start, end, text, start + indent.length + INDENT.length + 1);
      } else {
        const text = `\n${indent}${opens ? INDENT : ""}`;
        replace(start, end, text, start + text.length);
      }
      return;
    }
    if (event.key === ")" && start === end) {
      // Typing ) on a line of only spaces lines it up with its opener.
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      if (/^\s+$/.test(line) && line.length >= INDENT.length) {
        event.preventDefault();
        const dedented = line.slice(INDENT.length);
        replace(lineStart, start, dedented + ")", lineStart + dedented.length + 1);
      }
    }
  };

  return (
    <div class="editor" style={{ "--lines": String(lineCount) }}>
      <div class="editor__gutter" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, n) => (
          <span key={n} class={flagged.has(n + 1) ? `editor__ln editor__ln--${flagged.get(n + 1)}` : "editor__ln"}>
            {n + 1}
          </span>
        ))}
      </div>
      <div class="editor__body">
        <pre class="editor__layer editor__highlight hljs" aria-hidden="true">
          <code dangerouslySetInnerHTML={{ __html: highlighted + "\n" }} />
        </pre>
        <pre class="editor__layer editor__marks" aria-hidden="true">
          <code dangerouslySetInnerHTML={{ __html: marks + "\n" }} />
        </pre>
        <textarea
          ref={area}
          class="editor__input"
          value={value}
          spellcheck={false}
          autocapitalize="off"
          autocomplete="off"
          aria-label={label}
          aria-description="Tab indents. Press Escape, then Tab, to move on."
          wrap="off"
          onInput={(e) => onChange((e.currentTarget as HTMLTextAreaElement).value)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
