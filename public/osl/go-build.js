/* Builds the Go that OSL generates into a WebAssembly program, in the
   browser: Go's own compile and link commands, built for js/wasm by
   scripts/osl-assets.ts, run here over an in-memory filesystem holding the
   program and the standard library archives it needs.

   Messages are {id, files, native}: the Go files osl.wasm's oslBuild gives
   (main.go and the runtime sources it needs) and the C source sets it asks
   for. Each gets status updates {id, status} and then one reply:
   {id, result: {wasm}} with the program as an ArrayBuffer,
   {id, result: {errors}} when Go won't build it, {id, result: {unsupported}}
   when it needs more than Go's standard library, or {id, error}. */

importScripts("memfs.js", "wasm_exec.js");

const GO = "go/";

/* Packages the compiler provides itself, with no archive. */
const BUILTIN = new Set(["unsafe"]);

/* Fetches a file, gunzipping it if it is still gzipped (a server may have
   decoded it already). */
async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`couldn't load ${url} (${response.status})`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return bytes;
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

const once = (load) => {
  let promise = null;
  return () => {
    promise ??= load().catch((error) => {
      promise = null;
      throw error;
    });
    return promise;
  };
};

const manifest = once(async () => (await fetch(`${GO}packages.json`)).json());
const compiler = once(async () => WebAssembly.compile(await fetchBytes(`${GO}compile.wasm.gz`)));
const linker = once(async () => WebAssembly.compile(await fetchBytes(`${GO}link.wasm.gz`)));

const archives = new Map();
function archive(path) {
  if (!archives.has(path)) {
    const loading = fetchBytes(`${GO}pkg/${path}.a.gz`);
    loading.catch(() => archives.delete(path));
    archives.set(path, loading);
  }
  return archives.get(path);
}

/* The packages a Go file imports. */
function imports(go) {
  const found = new Set();
  const header = go.slice(0, go.search(/^(?:func|type|var|const)\s/m) >>> 0);
  for (const block of header.matchAll(/^import\s*\(([\s\S]*?)^\)/gm)) {
    for (const m of block[1].matchAll(/"([^"]+)"/g)) found.add(m[1]);
  }
  for (const m of header.matchAll(/^import\s+(?:[\w.]+\s+)?"([^"]+)"/gm)) found.add(m[1]);
  return [...found];
}

/* Runs one of Go's commands to completion and returns its exit code and
   what it printed. */
async function tool(module, memfs, argv, output) {
  const go = new Go();
  go.argv = argv;
  go.env = { HOME: "/home", TMPDIR: "/tmp", GOROOT: "/goroot", PWD: "/work" };
  let code = 0;
  go.exit = (c) => {
    code = c;
  };
  memfs.install();
  const instance = await WebAssembly.instantiate(module, go.importObject);
  await go.run(instance);
  return { code, output: output.join("").replaceAll("/work/", "") };
}

/* The last few programs built, by their Go, so running again is instant. */
const built = new Map();

async function hash(text) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const RUN_IT = "Install OSL and run it with osl run main.osl.";

async function build(id, files, native) {
  const status = (text) => self.postMessage({ id, status: text });
  if (native?.length) {
    const sets = native.join(", ");
    return { unsupported: `This program uses C code (${sets}), so it can't be built in the browser. ${RUN_IT}` };
  }
  const names = Object.keys(files).sort();
  const key = await hash(JSON.stringify(names.map((name) => [name, files[name]])));
  if (built.has(key)) return { wasm: built.get(key).slice(0) };

  const available = await manifest();
  const wanted = [...new Set(names.flatMap((name) => imports(files[name])))].filter(
    (path) => !BUILTIN.has(path),
  );
  const missing = wanted.filter((path) => !available.packages[path]);
  if (missing.length) {
    const list = missing.map((p) => `"${p}"`).join(", ");
    const known = missing.every((path) => available.unavailable.includes(path));
    const why = known
      ? "which needs C code or a real operating system"
      : `which ${missing.length > 1 ? "aren't" : "isn't"} in Go's standard library or the ` +
        "modules OSL's packages use";
    return {
      unsupported: `This program needs ${list}, ${why}, so it can't be built in the browser. ${RUN_IT}`,
    };
  }
  const closure = new Set(["runtime", ...available.packages.runtime.deps]);
  for (const path of wanted) {
    closure.add(path);
    for (const dep of available.packages[path].deps) closure.add(dep);
  }
  for (const path of BUILTIN) closure.delete(path);

  const first = !archives.size;
  status(first ? "Downloading Go's compiler (13 MB, just once)…" : "Compiling…");
  const [compile, link, stdlib] = await Promise.all([
    compiler(),
    linker(),
    Promise.all([...closure].map(async (path) => [path, await archive(path)])),
  ]);

  const output = [];
  const decoder = new TextDecoder();
  const collect = (bytes) => output.push(decoder.decode(bytes, { stream: true }));
  const memfs = createMemFS({ stdout: collect, stderr: collect });
  memfs.mkdir("/tmp");
  memfs.mkdir("/home");
  memfs.mkdir("/goroot");
  let importcfg = "";
  for (const [path, bytes] of stdlib) {
    memfs.writeFile(`/pkg/${path}.a`, bytes);
    importcfg += `packagefile ${path}=/pkg/${path}.a\n`;
  }
  memfs.writeFile("/work/importcfg", new TextEncoder().encode(importcfg));
  for (const name of names) memfs.writeFile(`/work/${name}`, new TextEncoder().encode(files[name]));
  memfs.chdir("/work");

  status("Compiling…");
  const compiled = await tool(compile, memfs, [
    "compile", "-o", "/work/main.a", "-p", "main", "-complete", "-pack",
    "-trimpath", "/work", "-importcfg", "/work/importcfg", ...names.map((name) => `/work/${name}`),
  ], output);
  if (compiled.code !== 0) {
    return { errors: compiled.output.trim() || `Go's compiler exited with ${compiled.code}.` };
  }

  output.length = 0;
  status("Linking…");
  const linked = await tool(link, memfs, [
    "link", "-o", "/work/main.wasm", "-importcfg", "/work/importcfg", "-buildmode=exe", "-s", "-w",
    "/work/main.a",
  ], output);
  const wasm = memfs.readFile("/work/main.wasm");
  if (linked.code !== 0 || !wasm) {
    return { errors: linked.output.trim() || `Go's linker exited with ${linked.code}.` };
  }

  built.set(key, wasm.buffer);
  while (built.size > 6) built.delete(built.keys().next().value);
  return { wasm: wasm.buffer.slice(0) };
}

/* One build at a time: the tools share the fs, process and path globals. */
let queue = Promise.resolve();

self.onmessage = (event) => {
  const { id, files, native } = event.data;
  queue = queue.then(async () => {
    try {
      const result = await build(id, files, native);
      self.postMessage({ id, result }, result.wasm ? [result.wasm] : []);
    } catch (error) {
      self.postMessage({ id, error: String(error && error.message ? error.message : error) });
    }
  });
};
