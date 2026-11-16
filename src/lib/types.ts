/* Shapes shared by the build, the example checker and the browser. */

import type { Block } from "./markdown";

export type Diagnostic = {
  severity: "error" | "warning";
  code?: string;
  message: string;
  file?: string;
  line: number;
  column: number;
  length: number;
  notes?: string[];
  fix?: string;
  rendered?: string;
};

/* What an example did when the checker last compiled or ran it. */
export type Recorded = {
  /* stdout and stderr interleaved as the program wrote them. */
  output: string;
  exit: number;
  diagnostics?: Diagnostic[];
  /* The OSL version that produced it. */
  osl: string;
};

export type APIParam = { name: string; type: string; optional?: boolean; variadic?: boolean };
export type APIMethod = { name: string; signature: string; params: APIParam[]; returns?: string; doc: string; deprecated?: string };
export type APIConstant = { name: string; type: string; doc: string; deprecated?: string };
export type PackageAPI = {
  name: string;
  import: string;
  description: string;
  about?: string;
  functions: APIMethod[];
  constants: APIConstant[];
  types: { name: string; methods: APIMethod[] }[];
};

export type PageData = {
  slug: string;
  title: string;
  description: string;
  meta: Record<string, string>;
  blocks: Block[];
  outputs: Record<string, Recorded>;
  api: PackageAPI | null;
};

export type DocsIndex = {
  pages: Record<string, { title: string; description: string; headings: { id: string; text: string }[]; meta: Record<string, string>; file: string }>;
  version: string;
  packages: { name: string; import: string; description: string }[];
};
