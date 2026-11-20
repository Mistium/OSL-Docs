/* Builds what the site takes from the OSL compiler, at the commit osl.json
   pins:

     .osl/bin/osl            the compiler, for scripts/examples.ts
     public/osl/osl.wasm     the compiler's front end for the browser
     public/osl/wasm_exec.js Go's loader for it
     generated/api.json      every std: package's API, for the reference
     public/osl/go/          Go's compiler and linker built to WebAssembly,
                             and Go's standard library and the modules OSL's
                             packages use built for js/wasm, so edited
                             programs build and run in the browser

   It clones the compiler into .osl/src (from $OSL_SRC when that names a local
   checkout, which is faster) and adds the two commands in tools/ to the clone
   as cmd/osl-docs-wasm and cmd/osl-docs-api, since they use the compiler's
   internal packages. Needs Go and git. */

import { $ } from "bun";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const pin = JSON.parse(readFileSync(join(root, "osl.json"), "utf8")) as { repository: string; commit: string; version: string };
const work = join(root, ".osl");
const src = join(work, "src");
const bin = join(work, "bin");

async function checkout() {
  if (existsSync(join(src, ".git"))) {
    const head = (await $`git -C ${src} rev-parse HEAD`.text()).trim();
    if (head === pin.commit) return;
    rmSync(src, { recursive: true, force: true });
  }
  mkdirSync(work, { recursive: true });
  const from = process.env.OSL_SRC ? resolve(process.env.OSL_SRC) : pin.repository;
  console.log(`cloning OSL ${pin.commit.slice(0, 8)} from ${from}`);
  await $`git clone --quiet --no-checkout ${from} ${src}`;
  // A local clone may not have the pinned commit yet; the remote does.
  const has = await $`git -C ${src} cat-file -e ${pin.commit}^{commit}`.nothrow();
  if (has.exitCode !== 0) await $`git -C ${src} fetch --quiet ${pin.repository} ${pin.commit}`;
  await $`git -C ${src} -c advice.detachedHead=false checkout --quiet ${pin.commit}`;
}

await checkout();
const release = readFileSync(join(src, "release.go"), "utf8").match(/releaseVersion = "([^"]+)"/)?.[1];
if (release !== pin.version) throw new Error(`osl.json says ${pin.version}, but release.go at ${pin.commit} says ${release}`);

const tools = [
  ["osl-wasm", "osl-docs-wasm"],
  ["osl-api", "osl-docs-api"],
  ["osl-goimports", "osl-docs-goimports"],
];
for (const [tool, dir] of tools) {
  const target = join(src, "cmd", dir);
  mkdirSync(target, { recursive: true });
  cpSync(join(root, "tools", tool, "main.go"), join(target, "main.go"));
}

mkdirSync(bin, { recursive: true });
const flags = `-s -w -X main.version=${pin.version}`;
console.log("building osl");
await $`go build -trimpath -o ${join(bin, "osl")} .`.cwd(src);
console.log("building osl.wasm");
mkdirSync(join(root, "public/osl"), { recursive: true });
await $`go build -trimpath -ldflags=${flags} -o ${join(root, "public/osl/osl.wasm")} ./cmd/osl-docs-wasm`.cwd(src).env({ ...process.env, GOOS: "js", GOARCH: "wasm" });
const goroot = (await $`go env GOROOT`.text()).trim();
cpSync(join(goroot, "lib/wasm/wasm_exec.js"), join(root, "public/osl/wasm_exec.js"));
console.log("dumping the package API");
const api = await $`go run -ldflags=${flags} ./cmd/osl-docs-api`.cwd(src).text();
mkdirSync(join(root, "generated"), { recursive: true });
writeFileSync(join(root, "generated/api.json"), api);
writeFileSync(join(root, "public/osl/version.json"), JSON.stringify({ version: pin.version, commit: pin.commit }) + "\n");

/* The Go toolchain for the browser. OSL compiles a program to Go that uses
   Go's standard library and the third-party modules OSL's own packages need.
   public/osl/go-build.js compiles and links it with Go's own compile and link
   commands, built here for js/wasm, against archives of those packages, built
   here for js/wasm too: the standard library, and the modules at the versions
   the compiler's go.mod pins. Packages that need cgo don't build for js/wasm;
   go/packages.json names them so the browser can say why. It builds into a
   new folder and swaps it in at the end, so a failed run leaves the old one.
   Everything is
   gzipped: the compiler is over Cloudflare Pages' 25 MiB file limit raw. The
   same Go builds osl.wasm, so one wasm_exec.js runs all of it. */
type GoPackage = { ImportPath: string; Export?: string; Deps?: string[]; Error?: { Err: string } };

const finalDir = join(root, "public/osl/go");
const goDir = `${finalDir}.new`;
rmSync(goDir, { recursive: true, force: true });
mkdirSync(join(goDir, "pkg"), { recursive: true });
const wasmEnv = { ...process.env, GOOS: "js", GOARCH: "wasm" };
const goVersion = (await $`go env GOVERSION`.text()).trim();
const gzip = (data: Buffer) => Bun.gzipSync(new Uint8Array(data), { level: 9 });

const scratch = mkdtempSync(join(tmpdir(), "osl-docs-go-"));
try {
  for (const tool of ["compile", "link"]) {
    console.log(`building Go's ${tool} for the browser`);
    const out = join(scratch, `${tool}.wasm`);
    await $`go build -trimpath -ldflags=${"-s -w"} -o ${out} cmd/${tool}`.env(wasmEnv);
    writeFileSync(join(goDir, `${tool}.wasm.gz`), gzip(readFileSync(out)));
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

const packages: Record<string, { deps: string[] }> = {};
// Packages go list found but couldn't build for js/wasm.
const failed = new Set<string>();
// How a package that is fine elsewhere fails for js/wasm: no files for it, or
// files that don't compile without cgo or another OS. Anything else (a module
// that didn't download, a broken toolchain) is a real failure.
const wontBuild = (err: string) => /^build constraints exclude all Go files|^# /.test(err);
async function archive(what: string, args: string[], cwd: string) {
  console.log(`building ${what} for js/wasm`);
  const fields = "-json=ImportPath,Export,Deps,Error";
  // -e lists packages that fail with their errors instead of stopping.
  const listed = await $`go list -e -export -deps ${fields} ${args}`.cwd(cwd).env(wasmEnv).text();
  for (const chunk of listed.split(/\n(?=\{)/)) {
    if (!chunk.trim()) continue;
    const pkg = JSON.parse(chunk) as GoPackage;
    if (pkg.Error && !wontBuild(pkg.Error.Err)) {
      throw new Error(`go list couldn't load ${pkg.ImportPath}: ${pkg.Error.Err}`);
    }
    if (!pkg.Export) {
      if (pkg.ImportPath !== "unsafe") failed.add(pkg.ImportPath);
      continue;
    }
    if (packages[pkg.ImportPath]) continue;
    const file = join(goDir, "pkg", `${pkg.ImportPath}.a.gz`);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, gzip(readFileSync(pkg.Export)));
    packages[pkg.ImportPath] = { deps: pkg.Deps ?? [] };
  }
}
await archive("Go's standard library", ["std"], root);
const goImports = (await $`go run ./cmd/osl-docs-goimports`.cwd(src).text())
  .split("\n")
  .filter(Boolean);
await archive("the modules OSL's packages use", goImports, src);
for (const path of ["runtime", "fmt"]) {
  if (!packages[path]) throw new Error(`${path} didn't build for js/wasm`);
}
// The ones that need cgo or another OS, which programs can't use here.
const unavailable = [...failed].filter((path) => !packages[path]).sort();
const manifest = { go: goVersion, packages, unavailable };
writeFileSync(join(goDir, "packages.json"), JSON.stringify(manifest) + "\n");
// What programs find on a Linux machine and not in a browser: the time zone
// database (Go's own copy) and the MIME types table, for std:date and
// std:mime. public/osl/go-run.js gives each program a copy. The MIME table is
// this machine's, as it is for the output scripts/examples.ts records here;
// without one, Go uses its built-in table in the browser too.
cpSync(join(goroot, "lib/time/zoneinfo.zip"), join(goDir, "zoneinfo.zip"));
if (existsSync("/etc/mime.types")) cpSync("/etc/mime.types", join(goDir, "mime.types"));
else console.warn("no /etc/mime.types here, so std:mime will use Go's built-in table");
rmSync(finalDir, { recursive: true, force: true });
renameSync(goDir, finalDir);
const count = Object.keys(packages).length;
const external = unavailable.filter((path) => goImports.includes(path));
console.log(`${count} packages for ${goVersion}; ${external.join(", ")} don't build for js/wasm`);
console.log(`OSL ${pin.version} assets ready`);
