/* Runs edited code on the run server, when the site was built with one
   (VITE_OSL_RUNNER). Unedited examples never need it: their output was
   recorded when the docs were built. */

import type { Diagnostic } from "./types";
import type { FileMap } from "./compiler";

export type RunResult = { output: string; exit: number; diagnostics?: Diagnostic[]; timedOut?: boolean; truncated?: boolean; error?: string };

export const RUNNER = (import.meta.env.VITE_OSL_RUNNER ?? "").replace(/\/+$/, "");
export const canRun = RUNNER !== "";

export async function run(files: FileMap, entry = "main.osl", stdin = ""): Promise<RunResult> {
  const response = await fetch(`${RUNNER}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files, entry, stdin }),
  });
  if (response.status === 429) return { output: "", exit: -1, error: "The run server is busy. Try again in a few seconds." };
  if (!response.ok) return { output: "", exit: -1, error: `The run server answered ${response.status}.` };
  const result = (await response.json()) as RunResult;
  // Compiler messages carry terminal colours and the job's folder.
  result.output = (result.output ?? "").replace(/\x1b\[[0-9;]*m/g, "").replace(/\/[^\s:]*\/[0-9a-f]{24}\//g, "");
  return result;
}
