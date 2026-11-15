/* Compiles and runs every OSL example in the docs with the compiler osl.json
   pins, and records what each one printed in generated/examples.json. The
   site plays these recordings back when someone presses Run.

     bun scripts/examples.ts            record new and changed examples
     bun scripts/examples.ts --force    record every example again
     bun scripts/examples.ts --check    record nothing; fail if any example
                                        has no recording for this OSL version
     bun scripts/examples.ts learn/     only pages whose path starts so

   An example fails when it doesn't compile (unless marked error), when an
   error example compiles, when it exits with a failure (unless marked fails),
   or when it prints something other than its ```output block. Warnings are
   listed but don't fail. Needs `bun osl:assets` first. */

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { examplesOf, parsePage, type Example } from "../src/lib/markdown.ts";
import type { Diagnostic, Recorded } from "../src/lib/types.ts";
import { contentFiles } from "../vite/docs.ts";
import { SAMPLES } from "../src/landing/samples.ts";

const root = resolve(import.meta.dir, "..");
const pin = JSON.parse(readFileSync(join(root, "osl.json"), "utf8")) as { version: string };
const OSL = join(root, ".osl/bin/osl");
const OUT = join(root, "generated/examples.json");
const args = process.argv.slice(2);
const force = args.includes("--force");
const checkOnly = args.includes("--check");
const filters = args.filter((a) => !a.startsWith("--"));
const jobs = Math.max(1, Math.min(8, navigator.hardwareConcurrency ?? 4));

type Job = { example: Example; where: string[] };

// Every example, once, with the pages it appears on.
const found = new Map<string, Job>();
const add = (example: Example, where: string) => {
  if (example.mode === "fragment") return;
  const job = found.get(example.id);
  if (job) job.where.push(where);
  else found.set(example.id, { example, where: [where] });
};
for (const file of contentFiles()) {
  const rel = relative(join(root, "content"), file);
  if (filters.length && !filters.some((f) => rel.startsWith(f))) continue;
  let page;
  try {
    page = parsePage(readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`✗ ${rel}: ${(error as Error).message}`);
    process.exitCode = 1;
    continue;
  }
  for (const example of examplesOf(page.blocks)) add(example, rel);
}
if (!filters.length || filters.some((f) => "landing".startsWith(f))) for (const [key, sample] of Object.entries(SAMPLES)) add(sample.example, `landing:${key}`);

const recorded: Record<string, Recorded> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const ansi = /\x1b\[[0-9;]*[A-Za-z]/g;
const strip = (text: string, dir: string) => text.replace(ansi, "").split(`${dir}/`).join("").split(dir).join(".");

if (checkOnly) {
  const missing = [...found.values()].filter((j) => recorded[j.example.id]?.osl !== pin.version);
  for (const j of missing) console.error(`✗ not recorded for OSL ${pin.version}: ${j.where[0]} (${j.example.files[0].code.split("\n")[0].slice(0, 60)})`);
  console.log(`${found.size - missing.length} of ${found.size} examples recorded for OSL ${pin.version}`);
  process.exit(missing.length ? 1 : 0);
}

if (!existsSync(OSL)) throw new Error("No compiler at .osl/bin/osl: run bun osl:assets first.");

// The browser's compiler, for diagnostics in the same shape the site shows.
const g = globalThis as any;
const savedFs = g.fs;
await import(join(root, "public/osl/wasm_exec.js"));
const go = new g.Go();
const wasm = await WebAssembly.instantiate(readFileSync(join(root, "public/osl/osl.wasm")), go.importObject);
void go.run(wasm.instance);
while (!g.oslReady) await new Promise((r) => setTimeout(r, 10));
g.fs = savedFs;
const diagnose = (example: Example): Diagnostic[] =>
  JSON.parse(g.oslCheck(JSON.stringify({ files: Object.fromEntries(example.files.map((f) => [f.name, f.code])), entry: example.files[0].name }))).diagnostics;

const scratch = join(tmpdir(), `osl-docs-examples-${process.pid}`);
mkdirSync(scratch, { recursive: true });

async function exec(cmd: string[], cwd: string, timeoutMs: number, stdin = ""): Promise<{ out: string; code: number; timedOut: boolean }> {
  const proc = Bun.spawn(["sh", "-c", 'exec "$@" 2>&1', "sh", ...cmd], { cwd, stdin: new TextEncoder().encode(stdin), stdout: "pipe", env: { ...process.env, NO_COLOR: "1", OSL_NO_PROGRESS: "1", TERM: "dumb" } });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    proc.kill(9);
  }, timeoutMs);
  const out = await new Response(proc.stdout).text();
  const code = await proc.exited;
  clearTimeout(timer);
  return { out, code, timedOut };
}

type Outcome = { id: string; ok: boolean; message?: string; warnings: Diagnostic[]; record?: Recorded };

async function runOne(job: Job): Promise<Outcome> {
  const { example } = job;
  const dir = join(scratch, example.id);
  rmSync(dir, { recursive: true, force: true });
  for (const f of example.files) {
    mkdirSync(dirname(join(dir, f.name)), { recursive: true });
    writeFileSync(join(dir, f.name), f.code.endsWith("\n") ? f.code : `${f.code}\n`);
  }
  try {
    const diagnostics = diagnose(example);
    const warnings = diagnostics.filter((d) => d.severity !== "error");
    const entry = example.files[0].name;
    const built = await exec([OSL, "compile", entry, "-o", "app"], dir, 180_000);
    const compiled = built.code === 0 && existsSync(join(dir, "app"));
    const compilerText = strip(built.out, dir).replace(/^Built .*\n?/gm, "").trim();
    if (example.mode === "error") {
      if (compiled) return { id: example.id, ok: false, message: "should fail to compile, but it compiled", warnings };
      return { id: example.id, ok: true, warnings: [], record: { output: compilerText, exit: built.code, diagnostics, osl: pin.version } };
    }
    if (!compiled) return { id: example.id, ok: false, message: `doesn't compile:\n${compilerText}`, warnings };
    if (example.mode === "norun") return { id: example.id, ok: true, warnings, record: { output: "", exit: 0, diagnostics, osl: pin.version } };
    const ran = await exec(["./app"], dir, 20_000, example.stdin ?? "");
    const output = strip(ran.out, dir);
    if (ran.timedOut) return { id: example.id, ok: false, message: "didn't finish within 20 seconds: mark it norun?", warnings };
    if (ran.code !== 0 && !example.fails) return { id: example.id, ok: false, message: `exited with status ${ran.code}:\n${output}`, warnings };
    if (example.expect !== undefined && output.trimEnd() !== example.expect.trimEnd()) {
      return { id: example.id, ok: false, message: `printed something other than its output block.\n--- expected\n${example.expect}\n--- got\n${output}`, warnings };
    }
    return { id: example.id, ok: true, warnings, record: { output, exit: ran.code, diagnostics, osl: pin.version } };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const todo = [...found.values()].filter((j) => force || recorded[j.example.id]?.osl !== pin.version);
console.log(`${found.size} examples, ${todo.length} to record with OSL ${pin.version}, ${jobs} at a time`);
let failed = 0;
let warned = 0;
let done = 0;
const queue = [...todo];
try {
  await Promise.all(
    Array.from({ length: jobs }, async () => {
      while (queue.length) {
        const job = queue.shift()!;
        const result = await runOne(job);
        done++;
        const where = job.where[0];
        if (!result.ok) {
          failed++;
          console.error(`\n✗ ${where}: ${job.example.files[0].code.split("\n")[0].slice(0, 70)}\n  ${result.message?.replace(/\n/g, "\n  ")}`);
        } else if (result.record) recorded[job.example.id] = result.record;
        if (result.ok && result.warnings.length) {
          warned++;
          console.warn(`\n! ${where}: ${result.warnings.map((w) => `${w.line}: ${w.message}`).join("\n  ")}`);
        }
        if (done % 25 === 0) console.log(`  ${done}/${todo.length}`);
      }
    }),
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

// Keep only recordings some example still uses.
const kept: Record<string, Recorded> = {};
const live = filters.length ? new Set([...Object.keys(recorded)]) : new Set(found.keys());
for (const id of Object.keys(recorded).sort()) if (live.has(id)) kept[id] = recorded[id];
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(kept, null, 1) + "\n");
console.log(`\n${todo.length - failed} recorded, ${failed} failed, ${warned} with warnings`);
process.exit(failed ? 1 : 0);
