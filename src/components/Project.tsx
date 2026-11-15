/* A project: a Build tutorial laid out as a code-along. Each ## section is a
   step. The first runnable example in a step is that step's program: it sits
   beside the step's text and stays in view while you read, the lines the
   step added are highlighted, and the code that tries it out (after a
   `// try it` line) waits in its own tab. Everything else in the step, its
   quiz and its challenge included, reads down the left. */

import { Check } from "lucide-preact";
import type { Block, Example } from "../lib/markdown";
import type { PageData } from "../lib/types";
import { markExercise, useProgress } from "../lib/progress";
import { Blocks, Text } from "./Blocks";
import { CodeExample } from "./CodeExample";
import { packageSlug } from "../nav";

type Step = { id: string; title: string; blocks: Block[]; code?: Example };

export function stepsOf(blocks: Block[]): { intro: Block[]; steps: Step[] } {
  const intro: Block[] = [];
  const steps: Step[] = [];
  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) steps.push({ id: block.id, title: block.text, blocks: [] });
    else if (!steps.length) intro.push(block);
    else {
      const step = steps[steps.length - 1];
      if (!step.code && block.type === "example" && (block.example.mode === "run" || block.example.mode === "norun")) step.code = block.example;
      else step.blocks.push(block);
    }
  }
  return { intro, steps };
}

export function Project({ page }: { page: PageData }) {
  const progress = useProgress();
  const { intro, steps } = stepsOf(page.blocks);
  const done = (n: number) => Boolean(progress.exercises[`${page.slug}#step-${n + 1}`]);
  const finished = steps.filter((_, n) => done(n)).length;
  const last = [...steps].reverse().find((s) => s.code && s.code.mode === "run")?.code;
  const result = last ? page.outputs[last.id]?.output : undefined;
  const uses = (page.meta.uses ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let previous: string | undefined;

  return (
    <div class="project">
      <header class="project__hero">
        <a class="crumb" href="/build">
          Build
        </a>
        <h1 class="docs__title">
          <Text text={page.title} />
        </h1>
        {page.description && <p class="lede"><Text text={page.description} /></p>}
        <p class="project__meta">
          {steps.length} steps
          {page.meta.time && <> · about {page.meta.time}</>}
          {uses.length > 0 && (
            <>
              {" · uses "}
              {uses.map((name, n) => (
                <span key={name}>
                  {n > 0 && ", "}
                  <a href={`/${packageSlug(name)}`}>
                    <code>{name}</code>
                  </a>
                </span>
              ))}
            </>
          )}
        </p>
        <div class="project__top">
          <div class="project__intro">
            <Blocks blocks={intro} ctx={{ page }} />
          </div>
          {(page.meta.preview || result) && (
            <figure class="project__result">
              <figcaption class="output__label">What you'll have at the end</figcaption>
              {page.meta.preview ? <img src={page.meta.preview} alt={page.meta.previewAlt ?? ""} loading="lazy" /> : <pre class="output__text">{result}</pre>}
            </figure>
          )}
        </div>
        <nav class="project__rail" aria-label="Steps">
          <div class="project__progress">
            <span style={{ width: `${steps.length ? (finished / steps.length) * 100 : 0}%` }} />
          </div>
          <ol>
            {steps.map((step, n) => (
              <li key={step.id} class={done(n) ? "is-done" : ""}>
                <a href={`#${step.id}`}>
                  <span class="project__dot" aria-hidden="true">
                    {done(n) ? <Check /> : n + 1}
                  </span>
                  <Text text={step.title} />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {steps.map((step, n) => {
        const before = previous;
        if (step.code) previous = step.code.files[0].code;
        return (
          <section key={step.id} id={step.id} class={`pstep${step.code ? "" : " pstep--text"}${done(n) ? " is-done" : ""}`}>
            <div class="pstep__text">
              <div class="pstep__number">
                Step {n + 1} of {steps.length}
                {done(n) && (
                  <span class="pstep__done">
                    <Check aria-hidden="true" /> ran
                  </span>
                )}
              </div>
              <h2 class="pstep__title">
                <Text text={step.title} />
              </h2>
              <Blocks blocks={step.blocks} ctx={{ page }} />
            </div>
            {step.code && (
              <div class="pstep__code">
                <CodeExample example={step.code} recorded={page.outputs[step.code.id]} previous={before} onOutput={() => markExercise(`${page.slug}#step-${n + 1}`)} />
                {before !== undefined && <p class="pstep__legend">Highlighted lines are new in this step.</p>}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
