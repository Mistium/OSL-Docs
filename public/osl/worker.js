/* Runs the OSL compiler's front end (osl.wasm) off the main thread. Messages
   are {id, op: "check" | "transpile" | "format", files, entry} and each gets
   one reply {id, result} or {id, error}. */

importScripts("wasm_exec.js");

const ready = (async () => {
  const go = new Go();
  const response = fetch("osl.wasm");
  const { instance } = WebAssembly.instantiateStreaming
    ? await WebAssembly.instantiateStreaming(response, go.importObject).catch(async () => WebAssembly.instantiate(await (await fetch("osl.wasm")).arrayBuffer(), go.importObject))
    : await WebAssembly.instantiate(await (await response).arrayBuffer(), go.importObject);
  go.run(instance);
  for (let i = 0; i < 200 && !self.oslReady; i++) await new Promise((r) => setTimeout(r, 10));
  if (!self.oslReady) throw new Error("the compiler didn't start");
  self.postMessage({ ready: true, version: self.oslVersion });
})();

self.onmessage = async (event) => {
  const { id, op, files, entry, source } = event.data;
  try {
    await ready;
    let reply;
    if (op === "format") reply = self.oslFormat(source);
    else if (op === "transpile") reply = self.oslTranspile(JSON.stringify({ files, entry }));
    else reply = self.oslCheck(JSON.stringify({ files, entry }));
    self.postMessage({ id, result: JSON.parse(reply) });
  } catch (error) {
    self.postMessage({ id, error: String(error && error.message ? error.message : error) });
  }
};
