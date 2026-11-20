/* public/osl/memfs.js: the in-memory filesystem Go's compiler, linker and the
   programs they build use in the browser. It has to behave as Node's fs does
   for the calls Go's syscall/fs_js.go makes. */

import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Callback = (error: (Error & { code?: string }) | null, value?: any) => void;
type MemFS = {
  fs: Record<string, any> & { constants: Record<string, number> };
  process: { cwd(): string; chdir(path: string): void };
  path: { resolve(...segments: string[]): string };
  writeFile(path: string, bytes: Uint8Array): void;
  readFile(path: string): Uint8Array | null;
  mkdir(path: string): void;
};

const g = globalThis as any;
g.self ??= globalThis;
new Function(readFileSync(join(import.meta.dir, "../public/osl/memfs.js"), "utf8"))();
const create = (options?: object): MemFS => g.self.createMemFS(options);

/* Calls a Node-style fs method and returns its result, or throws its error. */
function call(memfs: MemFS, name: string, ...args: unknown[]): any {
  let outcome: { error: Error | null; value?: unknown } | null = null;
  memfs.fs[name](...args, ((error, value) => (outcome = { error, value })) as Callback);
  if (!outcome) throw new Error(`${name} didn't call back`);
  const { error, value } = outcome as { error: Error | null; value?: unknown };
  if (error) throw error;
  return value;
}

const text = (s: string) => new TextEncoder().encode(s);
const codeOf = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return (error as { code?: string }).code;
  }
  return "no error";
};

describe("memfs", () => {
  test("files written through descriptors read back, by position or from the current one", () => {
    const m = create();
    const { O_CREAT, O_RDWR, O_TRUNC } = m.fs.constants;
    const fd = call(m, "open", "/a.txt", O_CREAT | O_RDWR | O_TRUNC, 0o644);
    expect(call(m, "write", fd, text("hello world"), 0, 11, null)).toBe(11);
    expect(call(m, "write", fd, text("W"), 0, 1, 6)).toBe(1);
    const buffer = new Uint8Array(5);
    expect(call(m, "read", fd, buffer, 0, 5, 0)).toBe(5);
    expect(new TextDecoder().decode(buffer)).toBe("hello");
    call(m, "close", fd);
    expect(new TextDecoder().decode(m.readFile("/a.txt")!)).toBe("hello World");

    const again = call(m, "open", "/a.txt", 0, 0);
    const chunk = new Uint8Array(6);
    expect(call(m, "read", again, chunk, 0, 6, null)).toBe(6);
    expect(call(m, "read", again, chunk, 0, 6, null)).toBe(5);
    expect(call(m, "read", again, chunk, 0, 6, null)).toBe(0);
  });

  test("append writes at the end and truncate empties", () => {
    const m = create();
    const { O_CREAT, O_WRONLY, O_APPEND, O_TRUNC } = m.fs.constants;
    m.writeFile("/log", text("one\n"));
    const fd = call(m, "open", "/log", O_WRONLY | O_APPEND, 0);
    call(m, "write", fd, text("two\n"), 0, 4, null);
    expect(new TextDecoder().decode(m.readFile("/log")!)).toBe("one\ntwo\n");
    call(m, "open", "/log", O_CREAT | O_WRONLY | O_TRUNC, 0o644);
    expect(m.readFile("/log")!.length).toBe(0);
  });

  test("directories list, rename with their contents, and refuse to go while full", () => {
    const m = create();
    call(m, "mkdir", "/d", 0o755);
    m.writeFile("/d/b.txt", text("b"));
    m.writeFile("/d/a.txt", text("a"));
    m.writeFile("/d/sub/c.txt", text("c"));
    expect(call(m, "readdir", "/d")).toEqual(["a.txt", "b.txt", "sub"]);
    expect(codeOf(() => call(m, "rmdir", "/d"))).toBe("ENOTEMPTY");
    call(m, "rename", "/d", "/e");
    expect(call(m, "readdir", "/e/sub")).toEqual(["c.txt"]);
    expect(codeOf(() => call(m, "stat", "/d"))).toBe("ENOENT");
    expect(call(m, "stat", "/e").isDirectory()).toBe(true);
    expect(call(m, "stat", "/e/a.txt").size).toBe(1);
  });

  test("errors carry the codes Go maps to its own", () => {
    const m = create();
    const { O_CREAT, O_EXCL, O_WRONLY } = m.fs.constants;
    m.writeFile("/f", text("x"));
    expect(codeOf(() => call(m, "open", "/missing", 0, 0))).toBe("ENOENT");
    expect(codeOf(() => call(m, "open", "/f", O_CREAT | O_EXCL | O_WRONLY, 0o644))).toBe("EEXIST");
    expect(codeOf(() => call(m, "open", "/nodir/f", O_CREAT | O_WRONLY, 0o644))).toBe("ENOENT");
    expect(codeOf(() => call(m, "mkdir", "/f", 0o755))).toBe("EEXIST");
    expect(codeOf(() => call(m, "readdir", "/f"))).toBe("ENOTDIR");
    expect(codeOf(() => call(m, "read", 99, new Uint8Array(1), 0, 1, null))).toBe("EBADF");
  });

  test("relative paths follow the working directory", () => {
    const m = create();
    m.mkdir("/home/osl");
    m.process.chdir("/home/osl");
    const { O_CREAT, O_WRONLY } = m.fs.constants;
    call(m, "open", "notes.txt", O_CREAT | O_WRONLY, 0o644);
    expect(m.readFile("/home/osl/notes.txt")).not.toBeNull();
    expect(m.path.resolve("../x/./y")).toBe("/home/x/y");
    expect(m.process.cwd()).toBe("/home/osl");
  });

  test("stdin reads in order and stdout and stderr go to their callbacks", () => {
    const out: string[] = [];
    const err: string[] = [];
    const decode = (b: Uint8Array) => new TextDecoder().decode(b);
    const m = create({
      stdin: text("abc"),
      stdout: (b: Uint8Array) => out.push(decode(b)),
      stderr: (b: Uint8Array) => err.push(decode(b)),
    });
    const buffer = new Uint8Array(2);
    expect(call(m, "read", 0, buffer, 0, 2, null)).toBe(2);
    expect(call(m, "read", 0, buffer, 0, 2, null)).toBe(1);
    expect(call(m, "read", 0, buffer, 0, 2, null)).toBe(0);
    call(m, "write", 1, text("to out"), 0, 6, null);
    m.fs.writeSync(2, text("panic"));
    expect(out).toEqual(["to out"]);
    expect(err).toEqual(["panic"]);
  });
});
