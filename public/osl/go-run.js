/* Runs one WebAssembly program that go-build.js built. The page starts a
   fresh worker for every run and ends it to stop the program, so a program
   that never finishes can't hold anything up.

   It takes one message, {wasm, stdin, args}, then posts {out} as the program
   prints (stdout and stderr together, in order) and {exit} when it ends. */

importScripts("memfs.js", "wasm_exec.js");

/* Files a program would find on a Linux machine: the time zone database and
   the MIME types table. The browser caches them; a missing one is skipped. */
const SYSTEM = [
  ["go/zoneinfo.zip", "/usr/share/zoneinfo.zip"],
  ["go/mime.types", "/etc/mime.types"],
];
const system = () =>
  Promise.all(
    SYSTEM.map(async ([url, path]) => {
      const response = await fetch(url).catch(() => null);
      return [path, response?.ok ? new Uint8Array(await response.arrayBuffer()) : null];
    }),
  );

self.onmessage = async (event) => {
  const { wasm, stdin = "", args = [] } = event.data;
  const decoder = new TextDecoder();
  // Output goes to the page in batches. A program busy in a loop never lets a
  // timer run, so a batch also goes whenever 50ms have passed since the last.
  let pending = "";
  let timer = 0;
  let sent = 0;
  const flush = () => {
    clearTimeout(timer);
    timer = 0;
    sent = performance.now();
    if (pending) self.postMessage({ out: pending });
    pending = "";
  };
  const print = (bytes) => {
    pending += decoder.decode(bytes, { stream: true });
    if (pending.length > 8192 || performance.now() - sent > 50) flush();
    else timer ||= setTimeout(flush, 30);
  };

  try {
    const input = new TextEncoder().encode(stdin);
    const memfs = createMemFS({ stdin: input, stdout: print, stderr: print });
    for (const [path, bytes] of await system()) if (bytes) memfs.writeFile(path, bytes);
    memfs.mkdir("/tmp");
    memfs.mkdir("/home/osl");
    memfs.chdir("/home/osl");
    memfs.install();

    const go = new Go();
    go.argv = ["main", ...args];
    go.env = {
      HOME: "/home/osl",
      TMPDIR: "/tmp",
      USER: "osl",
      PWD: "/home/osl",
      TERM: "dumb",
      // The output panel shows plain text, as the recorded output is.
      NO_COLOR: "1",
      ZONEINFO: "/usr/share/zoneinfo.zip",
    };
    let code = 0;
    go.exit = (c) => {
      code = c;
    };
    const { instance } = await WebAssembly.instantiate(wasm, go.importObject);
    await go.run(instance);
    flush();
    self.postMessage({ exit: code });
  } catch (error) {
    flush();
    self.postMessage({ failed: String(error && error.message ? error.message : error) });
  }
};
