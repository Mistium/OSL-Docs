/* What this reader has finished: lessons they marked complete and exercises
   they solved. Kept in this browser only. */

import { useEffect, useState } from "preact/hooks";

const KEY = "osl-docs:progress";
const EVENT = "osl-docs-progress";

type Progress = { pages: Record<string, number>; exercises: Record<string, number> };

function read(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "");
    return { pages: value.pages ?? {}, exercises: value.exercises ?? {} };
  } catch {
    return { pages: {}, exercises: {} };
  }
}

function write(progress: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    /* Private windows can refuse storage; progress just isn't kept. */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function markPage(slug: string, done = true) {
  const progress = read();
  if (done) progress.pages[slug] = Date.now();
  else delete progress.pages[slug];
  write(progress);
}

export function markExercise(id: string) {
  const progress = read();
  progress.exercises[id] = Date.now();
  write(progress);
}

export function resetProgress() {
  write({ pages: {}, exercises: {} });
}

export function useProgress(): Progress {
  const [progress, setProgress] = useState<Progress>({ pages: {}, exercises: {} });
  useEffect(() => {
    const update = () => setProgress(read());
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return progress;
}
