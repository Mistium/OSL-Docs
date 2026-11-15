/* An OSL example. It reads like a code block until someone clicks into it,
   then it is an editor the compiler checks as they type. Run plays back the
   output recorded when the docs were built, or runs edited code on the run
   server when the site has one. */

import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Check, Copy, FileCode2, Play, RotateCcw, SquarePen, ExternalLink, AlignLeft } from "lucide-preact";
import { highlightCode } from "../lib/highlight";
import { check, format, transpile, warmCompiler, type FileMap } from "../lib/compiler";
import { canRun, run as runRemote } from "../lib/runner";
import type { Diagnostic, Recorded } from "../lib/types";
import type { Example } from "../lib/markdown";
import { Editor } from "./Editor";
import { playgroundHref } from "../lib/share";

type Output = { kind: "recorded" | "live" | "note" | "error"; text: string; exit?: number; diagnostics?: Diagnostic[]; note?: string };

export type ExampleProps = {
  example: Example;
  recorded?: Recorded;
  /* Called with the program's output whenever it runs, for exercises. */
  onOutput?: (output: string, edited: boolean, files: FileMap) => void;
  /* Called with each check's diagnostics, for exercises. */
  onCheck?: (diagnostics: Diagnostic[], files: FileMap) => void;
  runLabel?: string;
  startEditing?: boolean;
  compact?: boolean;
};

const filesOf = (example: Example): FileMap => Object.fromEntries(example.files.map((f) => [f.name, f.code]));

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      class="icon-btn"
      title={done ? "Copied" : label}
      aria-label={done ? "Copied" : label}
      onClick={async () => {
        await navigator.clipboard?.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
    </button>
  );
}

export function DiagnosticList({ diagnostics, onPick }: { diagnostics: Diagnostic[]; onPick?: (d: Diagnostic) => void }) {
  if (!diagnostics.length) return null;
  return (
    <ul class="diagnostics">
      {diagnostics.map((d, n) => (
        <li key={n} class={`diagnostic diagnostic--${d.severity}`}>
          <button type="button" class="diagnostic__where" onClick={() => onPick?.(d)} disabled={!onPick || !d.line}>
            {d.file && d.file !== "main.osl" ? `${d.file}:` : ""}
            {d.line ? `${d.line}:${(d.column ?? 0) + 1}` : d.severity}
          </button>
          <div class="diagnostic__body">
            <span class="diagnostic__message">{d.message}</span>
            {d.code && <span class="diagnostic__code">{d.code}</span>}
            {d.notes?.map((note, i) => (
              <p key={i} class="diagnostic__note">
                {note}
              </p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

function OutputPanel({ output, onPick }: { output: Output; onPick?: (d: Diagnostic) => void }) {
  const errors = output.diagnostics?.filter((d) => d.severity === "error") ?? [];
  const warnings = output.diagnostics?.filter((d) => d.severity !== "error") ?? [];
  return (
    <div class={`output output--${output.kind}`} role="status" aria-live="polite">
      {errors.length > 0 && (
        <>
          <div class="output__label">Compiler</div>
          <DiagnosticList diagnostics={errors} onPick={onPick} />
        </>
      )}
      {output.text !== "" && (
        <>
          <div class="output__label">
            Output
            {output.exit !== undefined && output.exit !== 0 && <span class="output__exit">exit status {output.exit}</span>}
          </div>
          <pre class="output__text">{output.text}</pre>
        </>
      )}
      {output.text === "" && !errors.length && output.kind !== "note" && <div class="output__empty">The program printed nothing.</div>}
      {output.note && <p class="output__note">{output.note}</p>}
      {warnings.length > 0 && (
        <details class="output__warnings">
          <summary>
            {warnings.length} warning{warnings.length === 1 ? "" : "s"}
          </summary>
          <DiagnosticList diagnostics={warnings} onPick={onPick} />
        </details>
      )}
    </div>
  );
}

export function CodeExample({ example, recorded, onOutput, onCheck, runLabel, startEditing = false, compact = false }: ExampleProps) {
  const original = useMemo(() => filesOf(example), [example.id]);
  const names = example.files.map((f) => f.name);
  const [files, setFiles] = useState<FileMap>(original);
  const [active, setActive] = useState(names[0]);
  const [editing, setEditing] = useState(startEditing);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[] | null>(null);
  const [checking, setChecking] = useState(false);
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState(false);
  const [goSource, setGoSource] = useState<string | null>(null);
  const [focusLine, setFocusLine] = useState<{ line: number; at: number } | null>(null);
  const timer = useRef<number>(0);

  const edited = names.some((n) => files[n] !== original[n]);
  const fragment = example.mode === "fragment";
  const code = files[active] ?? "";
  const html = useMemo(() => highlightCode(code, "osl"), [code]);

  // Check as they type, a moment after they stop.
  useEffect(() => {
    if (!editing || fragment) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      setChecking(true);
      try {
        const result = await check(files, names[0]);
        setDiagnostics(result.diagnostics);
        onCheck?.(result.diagnostics, files);
      } catch {
        setDiagnostics(null);
      } finally {
        setChecking(false);
      }
    }, 350);
    return () => window.clearTimeout(timer.current);
  }, [files, editing]);

  useEffect(() => {
    if (goSource !== null) void showGo(true);
  }, [files]);

  const startEdit = () => {
    if (fragment || editing) return;
    warmCompiler();
    setEditing(true);
  };

  const run = async () => {
    setGoSource(null);
    if (!edited && recorded && example.mode !== "norun") {
      setBusy(true);
      // A short pause, so a re-run visibly happens.
      await new Promise((r) => setTimeout(r, 180));
      setOutput({ kind: "recorded", text: recorded.output, exit: recorded.exit, diagnostics: recorded.diagnostics });
      setBusy(false);
      onOutput?.(recorded.output, false, files);
      return;
    }
    setBusy(true);
    try {
      const checked = await check(files, names[0]);
      setDiagnostics(checked.diagnostics);
      const errors = checked.diagnostics.filter((d) => d.severity === "error");
      if (errors.length) {
        setOutput({ kind: "error", text: "", diagnostics: checked.diagnostics });
        return;
      }
      if (example.mode === "norun") {
        setOutput({
          kind: "note",
          text: "",
          diagnostics: checked.diagnostics,
          note: "It compiles. This example keeps running (a server, a window or a loop), so it isn't run here: copy it into main.osl and run osl run main.osl.",
        });
        return;
      }
      if (!canRun) {
        setOutput({
          kind: "note",
          text: "",
          diagnostics: checked.diagnostics,
          note: "Your change compiles. Running edited code needs OSL itself: copy it into main.osl and run osl run main.osl, or reset to see the recorded output.",
        });
        return;
      }
      const result = await runRemote(files, names[0], example.stdin ?? "");
      if (result.error) setOutput({ kind: "error", text: result.error });
      else {
        setOutput({ kind: "live", text: result.output, exit: result.exit, diagnostics: result.diagnostics ?? checked.diagnostics, note: result.timedOut ? "Stopped after the time limit." : result.truncated ? "Output was cut short." : undefined });
        onOutput?.(result.output, true, files);
      }
    } catch (error) {
      setOutput({ kind: "error", text: String((error as Error).message ?? error) });
    } finally {
      setBusy(false);
    }
  };

  const showGo = async (refresh = false) => {
    if (goSource !== null && !refresh) {
      setGoSource(null);
      return;
    }
    warmCompiler();
    setGoSource("// Compiling…");
    try {
      const result = await transpile(files, names[0]);
      const errors = result.diagnostics.filter((d) => d.severity === "error");
      setGoSource(errors.length ? `// The program doesn't compile yet:\n${errors.map((e) => `// ${e.line}: ${e.message}`).join("\n")}` : (result.go ?? result.error ?? ""));
    } catch (error) {
      setGoSource(`// ${(error as Error).message}`);
    }
  };

  const tidy = async () => {
    const result = await format(code);
    if (result.source !== undefined) setFiles({ ...files, [active]: result.source.replace(/\n$/, "") });
  };

  const reset = () => {
    setFiles(original);
    setOutput(null);
    setDiagnostics(null);
    setGoSource(null);
  };

  const mine = (diagnostics ?? []).filter((d) => (d.file ?? names[0]) === active);
  const counts = diagnostics ? { errors: diagnostics.filter((d) => d.severity === "error").length, warnings: diagnostics.filter((d) => d.severity !== "error").length } : null;
  const pick = (d: Diagnostic) => {
    if (d.file && names.includes(d.file)) setActive(d.file);
    setEditing(true);
    setFocusLine({ line: d.line, at: Date.now() });
  };

  return (
    <figure class={`example${editing ? " is-editing" : ""}${compact ? " example--compact" : ""}`} data-mode={example.mode}>
      <div class="example__bar">
        {names.length > 1 ? (
          <div class="tabs" role="tablist" aria-label="Files">
            {names.map((n) => (
              <button key={n} type="button" role="tab" aria-selected={n === active} class="tab" onClick={() => setActive(n)}>
                {n}
              </button>
            ))}
          </div>
        ) : (
          <span class="example__name">{example.title ?? (fragment ? "osl" : names[0])}</span>
        )}
        <div class="example__tools">
          {editing && counts && (
            <span class={`example__status${counts.errors ? " is-error" : ""}`} aria-live="polite">
              {checking ? "Checking…" : counts.errors ? `${counts.errors} error${counts.errors > 1 ? "s" : ""}` : counts.warnings ? `Compiles · ${counts.warnings} warning${counts.warnings > 1 ? "s" : ""}` : "Compiles"}
            </span>
          )}
          {editing && (
            <button type="button" class="icon-btn" title="Format (Ctrl+Shift+F)" aria-label="Format" onClick={tidy}>
              <AlignLeft aria-hidden="true" />
            </button>
          )}
          {edited && (
            <button type="button" class="icon-btn" title="Reset to the original" aria-label="Reset" onClick={reset}>
              <RotateCcw aria-hidden="true" />
            </button>
          )}
          {!fragment && !editing && (
            <button type="button" class="icon-btn" title="Edit" aria-label="Edit this example" onClick={startEdit}>
              <SquarePen aria-hidden="true" />
            </button>
          )}
          {!fragment && (
            <a class="icon-btn" href={playgroundHref(files)} title="Open in the playground" aria-label="Open in the playground">
              <ExternalLink aria-hidden="true" />
            </a>
          )}
          <CopyButton text={code} />
        </div>
      </div>
      {editing ? (
        <Editor value={code} onChange={(next) => setFiles({ ...files, [active]: next })} diagnostics={mine} onRun={run} onFormat={tidy} label={`${active}, editable`} focusLine={focusLine} autoFocus={!startEditing} />
      ) : (
        <pre
          class="example__code hljs"
          tabIndex={fragment ? undefined : 0}
          onClick={startEdit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || (e.key.length === 1 && !e.metaKey && !e.ctrlKey)) startEdit();
          }}
          title={fragment ? undefined : "Click to edit"}
        >
          {html === null ? <code>{code}</code> : <code dangerouslySetInnerHTML={{ __html: html }} />}
        </pre>
      )}
      {editing && diagnostics && diagnostics.some((d) => d.severity === "error") && !output && <DiagnosticList diagnostics={diagnostics.filter((d) => d.severity === "error")} onPick={pick} />}
      {!fragment && (
        <div class="example__actions">
          <button type="button" class="btn btn--run" onClick={run} disabled={busy}>
            <Play aria-hidden="true" />
            {busy ? "Running…" : runLabel ?? (example.mode === "norun" ? "Check" : example.mode === "error" ? "Compile" : "Run")}
          </button>
          <button type="button" class={`btn btn--ghost${goSource !== null ? " is-on" : ""}`} onClick={() => showGo()} aria-pressed={goSource !== null}>
            <FileCode2 aria-hidden="true" />
            Go
          </button>
          {!editing && <span class="example__hint">Click the code to edit it</span>}
          {editing && <span class="example__hint"><kbd>Ctrl</kbd> <kbd>Enter</kbd> runs</span>}
        </div>
      )}
      {output && <OutputPanel output={output} onPick={pick} />}
      {goSource !== null && (
        <div class="go-view">
          <div class="output__label">
            Generated Go <span class="output__hint">what osl compiles this to</span>
          </div>
          <pre class="hljs">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(goSource, "go") ?? goSource }} />
          </pre>
        </div>
      )}
    </figure>
  );
}
