/* Runs edited code in the browser, with no server. osl.wasm turns the program
   into Go (compiler.ts), Go's own compiler and linker, built to WebAssembly,
   turn that into a WebAssembly program (public/osl/go-build.js), and a fresh
   worker runs it (public/osl/go-run.js), so stopping it is ending that worker.
   Unedited examples never get here: their output was recorded when the docs
   were built. */

import type { Diagnostic } from "./types";
import { build as prepare, type FileMap } from "./compiler";

export type RunResult = {
  output: string;
  exit: number;
  diagnostics?: Diagnostic[];
  timedOut?: boolean;
  truncated?: boolean;
  stopped?: boolean;
  error?: string;
};

export type RunOptions = {
  stdin?: string;
  /* What it's doing: downloading, compiling, linking, running. */
  onStatus?: (status: string) => void;
  /* Everything the program has printed so far, as it prints. */
  onOutput?: (output: string) => void;
  /* Aborting stops the program. */
  signal?: AbortSignal;
  timeoutMs?: number;
};

const MAX_OUTPUT = 64 * 1024;
// Terminal colours and cursor codes: the output panel shows plain text, as the
// recorded output (scripts/examples.ts strips them too) does.
const ANSI = /\x1b\[[0-9;?]*[A-Za-z]/g;
const BASE = `${import.meta.env.BASE_URL}osl/`;

function unsupported(): string | null {
  const g = globalThis as Record<string, unknown>;
  for (const name of ["WebAssembly", "Worker", "DecompressionStream"]) {
    if (!g[name]) {
      const missing = `This browser can't run programs here: it has no ${name}.`;
      return `${missing} Install OSL and run it with osl run main.osl.`;
    }
  }
  return null;
}

type Built = { wasm?: ArrayBuffer; errors?: string; unsupported?: string };
type Waiting = {
  resolve: (built: Built | null) => void;
  reject: (error: Error) => void;
  onStatus?: (status: string) => void;
};

/* Long enough for a slow first download of the compiler; a build that takes
   longer is stuck, and ending the worker frees the builds queued behind it. */
const BUILD_TIMEOUT = 5 * 60_000;

let builder: Worker | null = null;
let nextId = 1;
const waiting = new Map<number, Waiting>();

/* Ends the build worker and fails what it was building. The next build
   starts a fresh one. */
function stopBuilder(error: Error) {
  builder?.terminate();
  builder = null;
  const calls = [...waiting.values()];
  waiting.clear();
  for (const call of calls) call.reject(error);
}

function startBuilder(): Worker {
  const worker = new Worker(`${BASE}go-build.js`);
  const broken = (message: string) => () => {
    if (builder === worker) stopBuilder(new Error(message));
  };
  worker.onmessage = (event) => {
    const { id, status, result, error } = event.data;
    const call = waiting.get(id);
    if (!call) return;
    if (status) return call.onStatus?.(status);
    waiting.delete(id);
    if (error) call.reject(new Error(error));
    else call.resolve(result);
  };
  worker.onerror = broken("Go's compiler couldn't start in this browser.");
  worker.onmessageerror = broken("Go's compiler sent something this page couldn't read.");
  return worker;
}

/* Builds the program, or gives null if the signal stopped it first. */
function goBuild(
  prepared: { files: FileMap; imports: string[]; native: string[] },
  signal: AbortSignal | undefined,
  onStatus?: Waiting["onStatus"],
): Promise<Built | null> {
  const worker = (builder ??= startBuilder());
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const settle = <T>(then: (value: T) => void) => (value: T) => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", stop);
      then(value);
    };
    const stop = () => {
      const call = waiting.get(id);
      if (!call) return;
      waiting.delete(id);
      // Nothing else is waiting on this build, so end it: if it was stuck,
      // the next build would wait behind it.
      if (!waiting.size && builder === worker) stopBuilder(new Error("stopped"));
      call.resolve(null);
    };
    const timer = setTimeout(() => {
      if (builder !== worker) return;
      stopBuilder(new Error("Go took too long to build the program, so it was stopped."));
    }, BUILD_TIMEOUT);
    waiting.set(id, { resolve: settle(resolve), reject: settle(reject), onStatus });
    signal?.addEventListener("abort", stop);
    worker.postMessage({ id, ...prepared });
  });
}

function execute(wasm: ArrayBuffer, options: RunOptions): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(`${BASE}go-run.js`);
    let output = "";
    let truncated = false;
    let done = false;
    // Messages the worker queued before it was ended can still arrive.
    const finish = (result: Partial<RunResult>) => {
      if (done) return;
      done = true;
      worker.terminate();
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", stop);
      resolve({ output: output.replace(ANSI, ""), exit: -1, truncated, ...result });
    };
    const stop = () => finish({ stopped: true });
    const timer = setTimeout(() => finish({ timedOut: true }), options.timeoutMs ?? 10_000);
    options.signal?.addEventListener("abort", stop);
    worker.onmessage = (event) => {
      if (done) return;
      const { out, exit, failed } = event.data;
      if (out !== undefined) {
        output += out;
        if (output.length > MAX_OUTPUT) {
          output = output.slice(0, MAX_OUTPUT);
          truncated = true;
          return finish({});
        }
        options.onOutput?.(output.replace(ANSI, ""));
      } else if (failed !== undefined) finish({ error: `The program couldn't run: ${failed}` });
      else finish({ exit });
    };
    worker.onerror = (event) => finish({ error: `The program couldn't run: ${event.message}` });
    worker.postMessage({ wasm, stdin: options.stdin ?? "" }, [wasm]);
  });
}

export async function run(
  files: FileMap,
  entry = "main.osl",
  options: RunOptions = {},
): Promise<RunResult> {
  const problem = unsupported();
  if (problem) return { output: "", exit: -1, error: problem };
  const stopped: RunResult = { output: "", exit: -1, stopped: true };
  options.onStatus?.("Compiling…");
  const prepared = await prepare(files, entry);
  if (options.signal?.aborted) return stopped;
  if (prepared.error) return { output: "", exit: -1, error: prepared.error };
  if (prepared.diagnostics.some((d) => d.severity === "error") || !prepared.files) {
    return { output: "", exit: 1, diagnostics: prepared.diagnostics };
  }
  const program = {
    files: prepared.files,
    imports: prepared.imports ?? [],
    native: prepared.native ?? [],
  };
  const built = await goBuild(program, options.signal, options.onStatus);
  if (!built || options.signal?.aborted) return stopped;
  if (built.unsupported) return { output: "", exit: -1, error: built.unsupported };
  if (built.errors || !built.wasm) {
    const error = `Go couldn't build the generated program:\n\n${built.errors ?? ""}`;
    return { output: "", exit: -1, error };
  }
  options.onStatus?.("Running…");
  return execute(built.wasm, options);
}
