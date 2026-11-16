/* Builds what the site takes from the OSL compiler, at the commit osl.json
   pins:

     .osl/bin/osl            the compiler, for scripts/examples.ts
     public/osl/osl.wasm     the compiler's front end for the browser
     public/osl/wasm_exec.js Go's loader for it
     generated/api.json      every std: package's API, for the reference

   It clones the compiler into .osl/src (from $OSL_SRC when that names a local
   checkout, which is faster) and adds the two commands in tools/ to the clone
   as cmd/osl-docs-wasm and cmd/osl-docs-api, since they use the compiler's
   internal packages. Needs Go and git. */

import { $ } from "bun";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

for (const [tool, dir] of [["osl-wasm", "osl-docs-wasm"], ["osl-api", "osl-docs-api"]]) {
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
console.log(`OSL ${pin.version} assets ready`);
