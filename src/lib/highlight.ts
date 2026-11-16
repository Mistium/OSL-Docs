import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import lua from "highlight.js/lib/languages/lua";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import sql from "highlight.js/lib/languages/sql";
import ini from "highlight.js/lib/languages/ini";
import osl from "./languages/osl.ts";

const aliases: Record<string, string> = {
  htm: "xml",
  html: "xml",
  svg: "xml",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  console: "bash",
  yml: "yaml",
  toml: "ini",
};

const languages = { bash, go, javascript, json, lua, osl, xml, yaml, sql, ini };
for (const [name, language] of Object.entries(languages)) hljs.registerLanguage(name, language);

export function canonicalLanguage(language: string) {
  const normalized = language.trim().toLowerCase();
  return aliases[normalized] ?? normalized;
}

/** Highlighted HTML for `code`, or null for plain text and languages we don't highlight. */
export function highlightCode(code: string, language: string): string | null {
  const canonical = canonicalLanguage(language);
  if (!canonical || !hljs.getLanguage(canonical)) return null;
  return hljs.highlight(code, { language: canonical, ignoreIllegals: true }).value;
}

export const escapeHTML = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Highlighted HTML for `code`, or the code escaped as plain text. */
export const highlightHTML = (code: string, language: string): string =>
  highlightCode(code, language) ?? escapeHTML(code);
