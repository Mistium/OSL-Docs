import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Info, Lightbulb, Sparkles, XCircle, Trophy, KeyRound } from "lucide-preact";
import { tokens, type Block, type Example } from "../lib/markdown";
import { highlightCode } from "../lib/highlight";
import type { PageData } from "../lib/types";
import { CodeExample, CopyButton } from "./CodeExample";
import { markExercise, useProgress } from "../lib/progress";
import { canRun } from "../lib/runner";
import { WIDGETS } from "./widgets";

export type RenderContext = { page: PageData };

/* Links inside content: relative .md links become site routes. */
export function hrefOf(href: string): string {
  if (/^[a-z]+:/i.test(href) || href.startsWith("#")) return href;
  return href.replace(/(^|\/)index\.md(#|$)/, "$1$2").replace(/\.md(#|$)/, "$1");
}

export function Text({ text }: { text: string }) {
  return (
    <>
      {tokens(text).map((t, n) => {
        switch (t.kind) {
          case "code":
            return <code key={n}>{t.text}</code>;
          case "strong":
            return (
              <strong key={n}>
                <Text text={t.text} />
              </strong>
            );
          case "em":
            return (
              <em key={n}>
                <Text text={t.text} />
              </em>
            );
          case "kbd":
            return <kbd key={n}>{t.text}</kbd>;
          case "break":
            return <br key={n} />;
          case "link": {
            const href = hrefOf(t.href);
            const external = /^https?:/.test(href);
            return (
              <a key={n} href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
                <Text text={t.text} />
              </a>
            );
          }
          default:
            return t.text;
        }
      })}
    </>
  );
}

const TONES: Record<string, { label: string; icon: ComponentChildren }> = {
  note: { label: "Note", icon: <Info aria-hidden="true" /> },
  tip: { label: "Tip", icon: <Lightbulb aria-hidden="true" /> },
  warning: { label: "Watch out", icon: <AlertTriangle aria-hidden="true" /> },
  important: { label: "Important", icon: <Sparkles aria-hidden="true" /> },
  hint: { label: "Hint", icon: <KeyRound aria-hidden="true" /> },
  go: { label: "Coming from Go", icon: <Info aria-hidden="true" /> },
  js: { label: "Coming from JavaScript", icon: <Info aria-hidden="true" /> },
  python: { label: "Coming from Python", icon: <Info aria-hidden="true" /> },
};

function Code({ lang, code, title }: { lang: string; code: string; title?: string }) {
  const html = highlightCode(code, lang);
  const shell = lang === "bash" || lang === "sh" || lang === "shell" || lang === "console";
  return (
    <figure class={`codeblock codeblock--${lang || "text"}`}>
      {(title || lang === "output" || shell) && (
        <div class="codeblock__bar">
          <span class="example__name">{title ?? (lang === "output" ? "Output" : "Terminal")}</span>
          {lang !== "output" && <CopyButton text={code.replace(/^\$ /gm, "")} />}
        </div>
      )}
      <pre class="hljs">{html === null ? <code>{code}</code> : <code dangerouslySetInnerHTML={{ __html: html }} />}</pre>
      {!title && lang !== "output" && !shell && (
        <div class="codeblock__copy">
          <CopyButton text={code} />
        </div>
      )}
    </figure>
  );
}

function Quiz({ block, ctx }: { block: Extract<Block, { type: "quiz" }>; ctx: RenderContext }) {
  const [picked, setPicked] = useState<number[]>([]);
  const solved = picked.some((n) => block.options[n].correct);
  const wrong = picked.filter((n) => !block.options[n].correct).length;
  const [revealed, setRevealed] = useState(false);
  const done = solved || revealed;
  return (
    <section class={`quiz${solved ? " is-solved" : ""}`} aria-label="Quick check">
      <div class="quiz__label">
        <Sparkles aria-hidden="true" /> Quick check
      </div>
      <Blocks blocks={block.question} ctx={ctx} />
      <div class="quiz__options" role="group">
        {block.options.map((option, n) => {
          const chosen = picked.includes(n);
          const state = chosen ? (option.correct ? "right" : "wrong") : done && option.correct ? "right" : "";
          return (
            <button
              key={n}
              type="button"
              class={`quiz__option${state ? ` is-${state}` : ""}`}
              disabled={done || chosen}
              aria-pressed={chosen}
              onClick={() => setPicked([...picked, n])}
            >
              <span class="quiz__mark" aria-hidden="true">
                {state === "right" ? <CheckCircle2 /> : state === "wrong" ? <XCircle /> : String.fromCharCode(65 + n)}
              </span>
              <span>
                <Text text={option.text} />
              </span>
            </button>
          );
        })}
      </div>
      {!done && wrong > 0 && (
        <p class="quiz__retry">
          Not quite. Try again, or{" "}
          <button type="button" class="link-btn" onClick={() => setRevealed(true)}>
            show the answer
          </button>
          .
        </p>
      )}
      {done && block.explain.length > 0 && (
        <div class="quiz__explain">
          {solved && <strong class="quiz__yes">{wrong === 0 ? "Right first time." : "That's it."} </strong>}
          <Blocks blocks={block.explain} ctx={ctx} />
        </div>
      )}
    </section>
  );
}

const normalizeOutput = (text: string) => text.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();

function Exercise({ block, ctx }: { block: Extract<Block, { type: "exercise" }>; ctx: RenderContext }) {
  const progress = useProgress();
  const id = `${ctx.page.slug}#${block.starter?.id ?? block.title}`;
  const [result, setResult] = useState<"pass" | "fail" | "compiles" | null>(null);
  const [hints, setHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const solved = Boolean(progress.exercises[id]) || result === "pass";
  const expect = block.expect;

  const onOutput = (output: string, edited: boolean) => {
    if (expect === undefined || !edited) return;
    if (normalizeOutput(output) === normalizeOutput(expect)) {
      setResult("pass");
      markExercise(id);
    } else setResult("fail");
  };

  const onCheck = (diagnostics: { severity: string }[]) => {
    if (canRun) return;
    if (!diagnostics.some((d) => d.severity === "error")) setResult((r) => (r === "pass" ? r : "compiles"));
    else setResult(null);
  };

  return (
    <section class={`exercise${solved ? " is-solved" : ""}`} aria-label={block.title}>
      <header class="exercise__head">
        <span class="exercise__badge">{solved ? <Trophy aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}</span>
        <div>
          <div class="exercise__kind">Your turn{solved ? " · solved" : ""}</div>
          <h3 class="exercise__title">
            <Text text={block.title} />
          </h3>
        </div>
      </header>
      <Blocks blocks={block.blocks} ctx={ctx} />
      {block.starter && <CodeExample example={block.starter} recorded={ctx.page.outputs[block.starter.id]} onOutput={onOutput} onCheck={onCheck} runLabel={canRun ? "Run and check" : "Run"} startEditing />}
      {expect !== undefined && (
        <div class="exercise__expect">
          <div class="output__label">Expected output</div>
          <pre class="output__text">{expect}</pre>
        </div>
      )}
      {result === "pass" && (
        <p class="exercise__result is-pass">
          <CheckCircle2 aria-hidden="true" /> Solved. Your program prints exactly what was asked for.
        </p>
      )}
      {result === "fail" && (
        <p class="exercise__result is-fail">
          <XCircle aria-hidden="true" /> It runs, but the output doesn't match yet. Compare it with the expected output.
        </p>
      )}
      {result === "compiles" && !canRun && (
        <p class="exercise__result">
          <Info aria-hidden="true" /> It compiles. To see its output, run it with <code>osl run main.osl</code>, then compare it with the expected output or open the solution.
        </p>
      )}
      <div class="exercise__help">
        {block.hints.slice(0, hints).map((hint, n) => (
          <div key={n} class="exercise__hint">
            <div class="exercise__hint-label">Hint {n + 1}</div>
            <Blocks blocks={hint} ctx={ctx} />
          </div>
        ))}
        <div class="exercise__buttons">
          {hints < block.hints.length && (
            <button type="button" class="btn btn--ghost" onClick={() => setHints(hints + 1)}>
              <KeyRound aria-hidden="true" />
              {hints === 0 ? "Show a hint" : "Another hint"}
            </button>
          )}
          {block.solution && (
            <button type="button" class="btn btn--ghost" onClick={() => setShowSolution(!showSolution)} aria-expanded={showSolution}>
              <Lightbulb aria-hidden="true" />
              {showSolution ? "Hide the solution" : "Show a solution"}
            </button>
          )}
        </div>
        {showSolution && block.solution && <CodeExample example={{ ...block.solution, title: "Solution" } as Example} recorded={ctx.page.outputs[block.solution.id]} />}
      </div>
    </section>
  );
}

function Steps({ block, ctx }: { block: Extract<Block, { type: "steps" }>; ctx: RenderContext }) {
  return (
    <ol class="steps">
      {block.steps.map((step, n) => (
        <li key={n} class="step">
          <span class="step__number" aria-hidden="true">
            {n + 1}
          </span>
          <div class="step__body">
            <h3 class="step__title">
              <Text text={step.title} />
            </h3>
            <Blocks blocks={step.blocks} ctx={ctx} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Cards({ cards }: { cards: { title: string; href: string; text: string; tag?: string }[] }) {
  return (
    <div class="cards">
      {cards.map((card) => (
        <a key={card.href} class="card" href={hrefOf(card.href)}>
          <span class="card__title">
            <Text text={card.title} />
            {card.tag && <span class="card__tag">{card.tag}</span>}
          </span>
          {card.text && (
            <span class="card__text">
              <Text text={card.text} />
            </span>
          )}
          <ArrowRight class="card__arrow" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function Heading({ block }: { block: Extract<Block, { type: "heading" }> }) {
  const Tag = `h${Math.min(block.level, 6)}` as "h2";
  return (
    <Tag id={block.id} class="heading">
      <Text text={block.text} />
      <a class="heading__anchor" href={`#${block.id}`} aria-label="Link to this section">
        #
      </a>
    </Tag>
  );
}

export function Blocks({ blocks, ctx }: { blocks: Block[]; ctx: RenderContext }) {
  return (
    <>
      {blocks.map((block, n) => {
        switch (block.type) {
          case "heading":
            return <Heading key={n} block={block} />;
          case "paragraph":
            return (
              <p key={n}>
                <Text text={block.text} />
              </p>
            );
          case "list": {
            const items = block.items.map((item, i) => (
              <li key={i}>
                {item.length === 1 && item[0].type === "paragraph" ? <Text text={item[0].text} /> : <Blocks blocks={item} ctx={ctx} />}
              </li>
            ));
            return block.ordered ? (
              <ol key={n} start={block.start}>
                {items}
              </ol>
            ) : (
              <ul key={n}>{items}</ul>
            );
          }
          case "table":
            return (
              <div key={n} class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {block.head.map((h, i) => (
                        <th key={i} style={block.align[i] ? { textAlign: block.align[i] } : undefined}>
                          <Text text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, i) => (
                          <td key={i} style={block.align[i] ? { textAlign: block.align[i] } : undefined}>
                            <Text text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout": {
            if (block.tone === "quote")
              return (
                <blockquote key={n}>
                  <Blocks blocks={block.blocks} ctx={ctx} />
                </blockquote>
              );
            const tone = TONES[block.tone] ?? { label: block.tone, icon: <Info aria-hidden="true" /> };
            return (
              <aside key={n} class={`callout callout--${block.tone}`}>
                <div class="callout__title">
                  {tone.icon}
                  <Text text={block.title ?? tone.label} />
                </div>
                <Blocks blocks={block.blocks} ctx={ctx} />
              </aside>
            );
          }
          case "rule":
            return <hr key={n} />;
          case "code":
            return <Code key={n} lang={block.lang} code={block.code} title={block.title} />;
          case "example":
            return <CodeExample key={block.example.id} example={block.example} recorded={ctx.page.outputs[block.example.id]} />;
          case "widget": {
            const Widget = WIDGETS[block.name];
            return Widget ? <Widget key={n} props={block.props} ctx={ctx} /> : null;
          }
          case "quiz":
            return <Quiz key={n} block={block} ctx={ctx} />;
          case "exercise":
            return <Exercise key={n} block={block} ctx={ctx} />;
          case "details":
            return (
              <details key={n} class="details">
                <summary>
                  <Text text={block.title} />
                </summary>
                <Blocks blocks={block.blocks} ctx={ctx} />
              </details>
            );
          case "steps":
            return <Steps key={n} block={block} ctx={ctx} />;
          case "cards":
            return <Cards key={n} cards={block.cards} />;
        }
      })}
    </>
  );
}
