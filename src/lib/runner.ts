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
const BASE = `${import.meta.env.BASE_URL}osl/`;

function unsupported(): string | null {
  const g = globalThis as Record<string, unknown>;
  for (const name of ["WebAssembly", "Worker", "DecompressionStream"]) {
    if (!g[name]) {
      return `This browser can't run programs here: it has no ${name}. Install OSL and run it with osl run main.osl.`;
    }
  }
  return null;
}

type Built = { wasm?: ArrayBuffer; errors?: string; unsupported?: string };
type Waiting = {
  resolve: (built: Built) => void;
  reject: (error: Error) => void;
  onStatus?: (status: string) => void;
};

let builder: Worker | null = null;
let nextId = 1;
const waiting = new Map<number, Waiting>();

function goBuild(files: FileMap, native: string[], onStatus?: Waiting["onStatus"]): Promise<Built> {
  if (!builder) {
    const worker = new Worker(`${BASE}go-build.js`);
    worker.onmessage = (event) => {
      const { id, status, result, error } = event.data;
      const call = waiting.get(id);
      if (!call) return;
      if (status) return call.onStatus?.(status);
      waiting.delete(id);
      if (error) call.reject(new Error(error));
      else call.resolve(result);
    };
    worker.onerror = () => {
      const error = new Error("Go's compiler couldn't start in this browser.");
      for (const call of waiting.values()) call.reject(error);
      waiting.clear();
      builder = null;
    };
    builder = worker;
  }
  const id = nextId++;
  return new Promise((resolve, reject) => {
    waiting.set(id, { resolve, reject, onStatus });
    builder!.postMessage({ id, files, native });
  });
}

function execute(wasm: ArrayBuffer, options: RunOptions): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(`${BASE}go-run.js`);
    let output = "";
    let truncated = false;
    const finish = (result: Partial<RunResult>) => {
      worker.terminate();
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", stop);
      resolve({ output, exit: -1, truncated, ...result });
    };
    const stop = () => finish({ stopped: true });
    const timer = setTimeout(() => finish({ timedOut: true }), options.timeoutMs ?? 10_000);
    options.signal?.addEventListener("abort", stop);
    worker.onmessage = (event) => {
      const { out, exit, failed } = event.data;
      if (out !== undefined) {
        output += out;
        if (output.length > MAX_OUTPUT) {
          output = output.slice(0, MAX_OUTPUT);
          truncated = true;
          return finish({});
        }
        options.onOutput?.(output);
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
  options.onStatus?.("Compiling…");
  const prepared = await prepare(files, entry);
  if (prepared.error) return { output: "", exit: -1, error: prepared.error };
  if (prepared.diagnostics.some((d) => d.severity === "error") || !prepared.files) {
    return { output: "", exit: 1, diagnostics: prepared.diagnostics };
  }
  const built = await goBuild(prepared.files, prepared.native ?? [], options.onStatus);
  if (built.unsupported) return { output: "", exit: -1, error: built.unsupported };
  if (built.errors || !built.wasm) {
    const error = `Go couldn't build the generated program:\n\n${built.errors ?? ""}`;
    return { output: "", exit: -1, error };
  }
  if (options.signal?.aborted) return { output: "", exit: -1, stopped: true };
  options.onStatus?.("Running…");
  return execute(built.wasm, options);
}
