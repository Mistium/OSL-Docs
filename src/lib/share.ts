/* Playground links carry their code in the URL's fragment, so sharing one
   needs no server. */

import type { FileMap } from "./compiler";

const toBase64 = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64 = (text: string) => {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
};

export function encodeFiles(files: FileMap): string {
  const names = Object.keys(files);
  if (names.length === 1 && names[0] === "main.osl") return `code=${toBase64(files["main.osl"])}`;
  return `files=${toBase64(JSON.stringify(files))}`;
}

export function decodeFiles(hash: string): FileMap | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  try {
    const code = params.get("code");
    if (code !== null) return { "main.osl": fromBase64(code) };
    const files = params.get("files");
    if (files !== null) {
      const parsed: unknown = JSON.parse(fromBase64(files));
      // A garbled or hand-made link must not reach the editor as non-text.
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      const entries = Object.entries(parsed);
      if (!entries.length || entries.some(([, code]) => typeof code !== "string")) return null;
      return Object.fromEntries(entries) as FileMap;
    }
  } catch {
    return null;
  }
  return null;
}

export const playgroundHref = (files: FileMap) => `/playground#${encodeFiles(files)}`;
