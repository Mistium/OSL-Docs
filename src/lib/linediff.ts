/* Which lines of a program are new since an earlier version of it, for a
   project step that highlights what it added. A longest-common-subsequence
   over whole lines, ignoring indentation changes; programs in the docs are
   short, so the quadratic table is fine. */

export function changedLines(before: string, after: string): Set<number> {
  const a = before.split("\n").map((l) => l.trim());
  const b = after.split("\n").map((l) => l.trim());
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--) table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  const changed = new Set<number>();
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      i++;
      j++;
    } else if (i < a.length && table[i + 1][j] >= table[i][j + 1]) i++;
    else {
      if (b[j] !== "") changed.add(j);
      j++;
    }
  }
  return changed;
}

/* A project step's program may end with the code that tries it out (calls
   the server it starts, feeds it input, prints what came back) after a line
   reading `// try it`. The page shows that part in its own tab, so the step
   reads as the program being built. */
export const HARNESS_MARK = "// try it";

export type Harness = { app: string; harness: string; /* blank lines cut from the app's end */ gap: number; mark: string; lead: number };

export function splitHarness(code: string): Harness | null {
  const lines = code.split("\n");
  const at = lines.findIndex((l) => l.trim().toLowerCase() === HARNESS_MARK);
  if (at < 0) return null;
  let end = at;
  while (end > 0 && lines[end - 1].trim() === "") end--;
  let start = at + 1;
  while (start < lines.length && lines[start].trim() === "") start++;
  return { app: lines.slice(0, end).join("\n"), harness: lines.slice(start).join("\n"), gap: at - end, mark: lines[at], lead: start - at - 1 };
}

/* The whole program again, laid out line for line as it was written, so
   recorded diagnostics still point at the right lines. */
export function joinHarness(h: Harness, app = h.app, harness = h.harness): string {
  return [app, ...new Array<string>(h.gap).fill(""), h.mark, ...new Array<string>(h.lead).fill(""), harness].join("\n");
}

/* The line the harness starts on in the joined program, counting from 1. */
export const harnessStart = (h: Harness, app = h.app) => app.split("\n").length + h.gap + h.lead + 2;
