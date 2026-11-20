/* The playground: write OSL in the browser. Everything runs here, with no
   server: the compiler checks, formats and transpiles in a web worker, and
   Run builds the program with Go's compiler and runs it (lib/runner.ts).
   Code lives in the URL, so a link shares it. */

import { useEffect, useRef, useState } from "preact/hooks";
import {
  AlertTriangle,
  AlignLeft,
  Check,
  FileCode2,
  Link2,
  Play,
  Plus,
  Square,
  TerminalSquare,
  X,
} from "lucide-preact";
import { check, compilerState, format, onCompilerState, transpile, warmCompiler, type CompilerState, type FileMap } from "../lib/compiler";
import { run } from "../lib/runner";
import { decodeFiles, encodeFiles } from "../lib/share";
import { normalize } from "../lib/router";
import { highlightHTML } from "../lib/highlight";
import type { Diagnostic } from "../lib/types";
import { Editor } from "./Editor";
import { DiagnosticList } from "./CodeExample";
import { SAMPLES } from "../landing/samples";

const START: FileMap = { "main.osl": SAMPLES.playground.files["main.osl"] };

type Pane = "output" | "go" | "problems";

export function Playground() {
  const [files, setFiles] = useState<FileMap>(START);
  const [active, setActive] = useState("main.osl");
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [pane, setPane] = useState<Pane>("output");
  const [output, setOutput] = useState<{ text: string; exit?: number; note?: string } | null>(null);
  const [goSource, setGoSource] = useState("");
  const [busy, setBusy] = useState(false);
  // What Run is doing (downloading Go, compiling, running), and how to stop it.
  const [status, setStatus] = useState("");
  const stopper = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const [copied, setCopied] = useState(false);
  const [state, setState] = useState<CompilerState>(compilerState().state);
  const [focusLine, setFocusLine] = useState<{ line: number; at: number } | null>(null);
  const [stdin, setStdin] = useState("");
  const timer = useRef(0);
  const names = Object.keys(files);

  useEffect(() => {
    const fromHash = decodeFiles(location.hash);
    if (fromHash && Object.keys(fromHash).length) {
      setFiles(fromHash);
      setActive(Object.keys(fromHash)[0]);
    }
    warmCompiler();
    const unsubscribe = onCompilerState(setState);
    return () => {
      unsubscribe();
      // Leaving the playground stops a program still running, and a run
      // still being checked goes no further.
      mounted.current = false;
      stopper.current?.abort();
    };
  }, []);

  useEffect(() => {
    // Leaving the playground cancels this, so a check that finishes late
    // can't write #code= onto the next page's address.
    let alive = true;
    timer.current = window.setTimeout(async () => {
      try {
        const result = await check(files, names[0]);
        if (alive) setDiagnostics(result.diagnostics);
      } catch {
        /* The compiler failed to load; the status line says so. */
      }
      if (alive && normalize(location.pathname) === "/playground") {
        history.replaceState(history.state, "", `#${encodeFiles(files)}`);
      }
    }, 300);
    return () => {
      alive = false;
      window.clearTimeout(timer.current);
    };
  }, [files]);

  useEffect(() => {
    if (pane === "go") void refreshGo();
  }, [pane, files]);

  const refreshGo = async () => {
    try {
      const result = await transpile(files, names[0]);
      const errors = result.diagnostics.filter((d) => d.severity === "error");
      setGoSource(errors.length ? `// Fix the errors to see the generated Go.\n${errors.map((e) => `// ${e.file}:${e.line}: ${e.message}`).join("\n")}` : (result.go ?? ""));
    } catch (error) {
      setGoSource(`// ${(error as Error).message}`);
    }
  };

  const go = async () => {
    if (busy) return;
    setBusy(true);
    setPane("output");
    try {
      const checked = await check(files, names[0]);
      if (!mounted.current) return;
      setDiagnostics(checked.diagnostics);
      if (checked.diagnostics.some((d) => d.severity === "error")) {
        setPane("problems");
        setOutput(null);
        return;
      }
      setOutput(null);
      const controller = new AbortController();
      stopper.current = controller;
      const result = await run(files, names[0], {
        stdin,
        signal: controller.signal,
        timeoutMs: 60_000,
        onStatus: setStatus,
        onOutput: (text) => setOutput({ text }),
      });
      if (result.diagnostics) {
        setDiagnostics(result.diagnostics);
        setPane("problems");
      }
      const note = result.stopped
        ? "Stopped."
        : result.timedOut
          ? "Stopped after a minute."
          : result.truncated
            ? "Output was cut short."
            : undefined;
      const ended = !result.error && !result.stopped && !result.timedOut;
      const exit = ended ? result.exit : undefined;
      setOutput({ text: result.error ?? result.output, exit, note });
    } catch (error) {
      setOutput({ text: String((error as Error).message ?? error) });
    } finally {
      setBusy(false);
      setStatus("");
      stopper.current = null;
    }
  };

  const tidy = async () => {
    const result = await format(files[active]);
    if (result.source !== undefined) setFiles({ ...files, [active]: result.source.replace(/\n$/, "") });
  };

  const addFile = () => {
    let n = names.length + 1;
    while (files[`file${n}.osl`] !== undefined) n++;
    const name = prompt("File name", `helpers${n === 2 ? "" : n}.osl`)?.trim();
    if (!name || files[name] !== undefined) return;
    const fixed = name.endsWith(".osl") ? name : `${name}.osl`;
    setFiles({ ...files, [fixed]: `def helper() string -> "from ${fixed}"\n` });
    setActive(fixed);
  };

  const removeFile = (name: string) => {
    if (name === names[0]) return;
    const next = { ...files };
    delete next[name];
    setFiles(next);
    setActive(names[0]);
  };

  const share = async () => {
    await navigator.clipboard?.writeText(`${location.origin}/playground#${encodeFiles(files)}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const load = (key: string) => {
    const sample = SAMPLES[key];
    if (!sample) return;
    setFiles({ ...sample.files });
    setActive(Object.keys(sample.files)[0]);
    setOutput(null);
  };

  const errors = diagnostics.filter((d) => d.severity === "error");
  const warnings = diagnostics.filter((d) => d.severity !== "error");
  const pick = (d: Diagnostic) => {
    if (d.file && files[d.file] !== undefined) setActive(d.file);
    setFocusLine({ line: d.line, at: Date.now() });
  };

  return (
    <div class="playground">
      <div class="playground__bar">
        <h1 class="playground__title">Playground</h1>
        <select class="select" onChange={(e) => load((e.currentTarget as HTMLSelectElement).value)} aria-label="Load an example" value="">
          <option value="" disabled>
            Load an example…
          </option>
          {Object.entries(SAMPLES).map(([key, s]) => (
            <option key={key} value={key}>
              {s.title}
            </option>
          ))}
        </select>
        <span class={`playground__state is-${state}`}>
          {state === "ready" ? `OSL ${compilerState().version} in your browser` : state === "loading" ? "Loading the compiler…" : state === "failed" ? "The compiler couldn't load" : "Compiler idle"}
        </span>
        <div class="playground__actions">
          <button type="button" class="btn btn--ghost" onClick={tidy}>
            <AlignLeft aria-hidden="true" /> Format
          </button>
          <button type="button" class="btn btn--ghost" onClick={share}>
            {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />} {copied ? "Link copied" : "Share"}
          </button>
          {status ? (
            <button type="button" class="btn btn--run" onClick={() => stopper.current?.abort()}>
              <Square aria-hidden="true" /> Stop
            </button>
          ) : (
            <button type="button" class="btn btn--run" onClick={go} disabled={busy}>
              <Play aria-hidden="true" /> {busy ? "Building…" : "Run"}
            </button>
          )}
        </div>
      </div>
      <div class="playground__main">
        <section class="playground__editor" aria-label="Editor">
          <div class="tabs tabs--files" role="tablist">
            {names.map((name, n) => (
              <span key={name} class="tab-wrap">
                <button type="button" role="tab" class="tab" aria-selected={name === active} onClick={() => setActive(name)}>
                  {name}
                  {diagnostics.some((d) => d.severity === "error" && (d.file ?? names[0]) === name) && <span class="tab__dot" aria-label="has errors" />}
                </button>
                {n > 0 && (
                  <button type="button" class="tab__close" aria-label={`Remove ${name}`} onClick={() => removeFile(name)}>
                    <X aria-hidden="true" />
                  </button>
                )}
              </span>
            ))}
            <button type="button" class="tab tab--add" onClick={addFile} aria-label="Add a file">
              <Plus aria-hidden="true" />
            </button>
          </div>
          <Editor value={files[active] ?? ""} onChange={(v) => setFiles({ ...files, [active]: v })} diagnostics={diagnostics.filter((d) => (d.file ?? names[0]) === active)} onRun={go} onFormat={tidy} label={`${active}, editable`} focusLine={focusLine} autoFocus />
        </section>
        <section class="playground__side" aria-label="Results">
          <div class="tabs" role="tablist">
            <button type="button" role="tab" class="tab" aria-selected={pane === "output"} onClick={() => setPane("output")}>
              <TerminalSquare aria-hidden="true" /> Output
            </button>
            <button type="button" role="tab" class="tab" aria-selected={pane === "problems"} onClick={() => setPane("problems")}>
              <AlertTriangle aria-hidden="true" /> Problems{diagnostics.length ? ` (${diagnostics.length})` : ""}
            </button>
            <button type="button" role="tab" class="tab" aria-selected={pane === "go"} onClick={() => setPane("go")}>
              <FileCode2 aria-hidden="true" /> Go
            </button>
          </div>
          <div class="playground__pane">
            {pane === "output" && (
              <>
                {status && status !== "Running…" && (
                  <p class="output__note" role="status">
                    {status}
                  </p>
                )}
                {output ? (
                  <>
                    {output.text && <pre class="output__text">{output.text}</pre>}
                    {output.exit !== undefined && output.exit !== 0 && <p class="output__exit">exit status {output.exit}</p>}
                    {output.note && <p class="output__note">{output.note}</p>}
                    {!output.text && !output.note && <p class="output__empty">The program printed nothing.</p>}
                  </>
                ) : status === "Running…" ? (
                  <p class="output__empty">Running. Nothing printed yet.</p>
                ) : status ? null : (
                  // While it builds, the status above says what it's doing.
                  <p class="output__empty">
                    {errors.length
                      ? `${errors.length} error${errors.length > 1 ? "s" : ""} to fix first. ` +
                        "See Problems."
                      : "Press Run, or Ctrl+Enter in the editor."}
                  </p>
                )}
                <details class="playground__stdin">
                  <summary>Standard input</summary>
                  <textarea
                    value={stdin}
                    onInput={(e) => setStdin((e.currentTarget as HTMLTextAreaElement).value)}
                    placeholder="Text the program reads with ask()"
                  />
                </details>
              </>
            )}
            {pane === "problems" && (diagnostics.length ? <DiagnosticList diagnostics={[...errors, ...warnings]} onPick={pick} /> : <p class="output__empty">No problems. The compiler is happy.</p>)}
            {pane === "go" && (
              <pre class="hljs playground__go">
                <code dangerouslySetInnerHTML={{ __html: highlightHTML(goSource || "// Compiling…", "go") }} />
              </pre>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
