/* The OSL compiler, in the browser: osl.wasm in a web worker, started the
   first time someone edits or checks code. */

import type { Diagnostic } from "./types";

export type CheckResult = { diagnostics: Diagnostic[]; go?: string; error?: string };
/* The Go files a browser build of the program compiles, the packages they
   import, and the C source sets it would need (which can't build in a
   browser). */
export type BuildResult = CheckResult & {
  files?: FileMap;
  imports?: string[] | null;
  native?: string[] | null;
};
export type FileMap = Record<string, string>;

type Pending = { resolve: (value: any) => void; reject: (error: Error) => void };

let worker: Worker | null = null;
let nextId = 1;
const pending = new Map<number, Pending>();
const stateListeners = new Set<(state: CompilerState) => void>();

export type CompilerState = "idle" | "loading" | "ready" | "failed";
let state: CompilerState = "idle";
let version = "";

function setState(next: CompilerState) {
  state = next;
  for (const listener of stateListeners) listener(state);
}

export function compilerState() {
  return { state, version };
}

export function onCompilerState(listener: (state: CompilerState) => void) {
  stateListeners.add(listener);
  return () => stateListeners.delete(listener);
}

function start(): Worker {
  if (worker) return worker;
  setState("loading");
  worker = new Worker(`${import.meta.env.BASE_URL}osl/worker.js`);
  worker.onmessage = (event) => {
    const data = event.data;
    if (data.ready) {
      version = data.version;
      setState("ready");
      return;
    }
    if (data.failed) {
      // Calls still get their own error replies; this updates the status.
      setState("failed");
      return;
    }
    const waiting = pending.get(data.id);
    if (!waiting) return;
    pending.delete(data.id);
    if (data.error) waiting.reject(new Error(data.error));
    else waiting.resolve(data.result);
  };
  worker.onerror = () => {
    setState("failed");
    for (const waiting of pending.values()) waiting.reject(new Error("The in-browser compiler couldn't load."));
    pending.clear();
    worker = null;
  };
  return worker;
}

function call<T>(message: Record<string, unknown>): Promise<T> {
  const w = start();
  const id = nextId++;
  return new Promise<T>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ id, ...message });
  });
}

export const warmCompiler = () => void start();

export const check = (files: FileMap, entry = "main.osl") => call<CheckResult>({ op: "check", files, entry });
export const transpile = (files: FileMap, entry = "main.osl") => call<CheckResult>({ op: "transpile", files, entry });
export const build = (files: FileMap, entry = "main.osl") =>
  call<BuildResult>({ op: "build", files, entry });
export const format = (source: string) => call<{ source?: string; error?: string }>({ op: "format", source });
