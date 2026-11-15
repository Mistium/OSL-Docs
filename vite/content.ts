/* Where the docs' sources live, and how to read them. Shared by the build
   plugin, the Markdown renderer and the scripts. */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import type { PackageAPI, Recorded } from "../src/lib/types.ts";

export const ROOT = join(import.meta.dirname, "..");
export const CONTENT = join(ROOT, "content");
export const EXAMPLES = join(ROOT, "generated/examples.json");
export const API = join(ROOT, "generated/api.json");

export function slugOf(file: string): string {
  return relative(CONTENT, file).replace(/\\/g, "/").replace(/\.md$/, "").replace(/(^|\/)index$/, "");
}

export function contentFiles(dir = CONTENT): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...contentFiles(path));
    else if (name.endsWith(".md")) out.push(path);
  }
  return out.sort();
}

export const readJSON = <T>(path: string, fallback: T): T => (existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as T) : fallback);

export function loadAPI(): { version: string; packages: PackageAPI[] } {
  return readJSON(API, { version: "", packages: [] });
}

export function loadRecordings(): Record<string, Recorded> {
  return readJSON<Record<string, Recorded>>(EXAMPLES, {});
}

export const SITE = (process.env.VITE_SITE_URL ?? "https://osl-lang.org").replace(/\/+$/, "");
