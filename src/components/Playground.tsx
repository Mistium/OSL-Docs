/* The playground: write OSL in the browser. The compiler runs here, in a web
   worker, so checking, formatting and the generated Go need no server; the
   run server, when the site has one, runs the program. Code lives in the
   URL, so a link shares it. */

import { useEffect, useRef, useState } from "preact/hooks";
import { FileCode2, Link2, Play, Plus, Wand2, X, Check, TerminalSquare, AlertTriangle } from "lucide-preact";
import { check, compilerState, format, onCompilerState, transpile, warmCompiler, type CompilerState, type FileMap } from "../lib/compiler";
import { canRun, run } from "../lib/runner";
import { decodeFiles, encodeFiles } from "../lib/share";
import { highlightCode } from "../lib/highlight";
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
    return onCompilerState(setState);
  }, []);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      try {
        const result = await check(files, names[0]);
        setDiagnostics(result.diagnostics);
      } catch {
        /* The compiler failed to load; the status line says so. */
      }
      history.replaceState(null, "", `#${encodeFiles(files)}`);
    }, 300);
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
    setBusy(true);
    setPane("output");
    try {
      const checked = await check(files, names[0]);
      setDiagnostics(checked.diagnostics);
      if (checked.diagnostics.some((d) => d.severity === "error")) {
        setPane("problems");
        setOutput(null);
        return;
      }
      if (!canRun) {
        setOutput({ text: "", note: "It compiles. This copy of the site has no run server, so programs can't run here yet. Install OSL and run it with osl run main.osl." });
        return;
      }
      const result = await run(files, names[0], stdin);
      setOutput({ text: result.error ?? result.output, exit: result.exit, note: result.timedOut ? "Stopped after the time limit." : result.truncated ? "Output was cut short." : undefined });
    } finally {
      setBusy(false);
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
            <Wand2 aria-hidden="true" /> Format
          </button>
          <button type="button" class="btn btn--ghost" onClick={share}>
            {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />} {copied ? "Link copied" : "Share"}
          </button>
          <button type="button" class="btn btn--run" onClick={go} disabled={busy}>
            <Play aria-hidden="true" /> {busy ? "Running…" : canRun ? "Run" : "Check"}
          </button>
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
                {output ? (
                  <>
                    {output.text && <pre class="output__text">{output.text}</pre>}
                    {output.exit !== undefined && output.exit !== 0 && <p class="output__exit">exit status {output.exit}</p>}
                    {output.note && <p class="output__note">{output.note}</p>}
                    {!output.text && !output.note && <p class="output__empty">The program printed nothing.</p>}
                  </>
                ) : (
                  <p class="output__empty">
                    {errors.length ? `${errors.length} error${errors.length > 1 ? "s" : ""} to fix first. See Problems.` : `Press ${canRun ? "Run" : "Check"}, or Ctrl+Enter in the editor.`}
                  </p>
                )}
                {canRun && (
                  <details class="playground__stdin">
                    <summary>Standard input</summary>
                    <textarea value={stdin} onInput={(e) => setStdin((e.currentTarget as HTMLTextAreaElement).value)} placeholder="Text the program reads with input()" />
                  </details>
                )}
              </>
            )}
            {pane === "problems" && (diagnostics.length ? <DiagnosticList diagnostics={[...errors, ...warnings]} onPick={pick} /> : <p class="output__empty">No problems. The compiler is happy.</p>)}
            {pane === "go" && (
              <pre class="hljs playground__go">
                <code dangerouslySetInnerHTML={{ __html: highlightCode(goSource || "// Compiling…", "go") ?? goSource }} />
              </pre>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
