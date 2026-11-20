/* osl-lang.org: what OSL puts first, one live example, and where to start.
   The code sample is live: it is compiled when the site is built, and in the
   browser it can be edited, checked and run. */

import type { ComponentChildren } from "preact";
import { ArrowRight } from "lucide-preact";
import index from "virtual:docs-index";
import { CodeExample, CopyButton } from "../components/CodeExample";
import { INSTALL, LESSONS, PACKAGE_GROUPS, SOURCE } from "../nav";
import { SAMPLES } from "./samples";
import recordings from "virtual:landing-outputs";

function Install() {
  return (
    <div class="install">
      <span class="install__prompt" aria-hidden="true">
        $
      </span>
      <code>{INSTALL}</code>
      <CopyButton text={INSTALL} label="Copy the install command" />
    </div>
  );
}

type Priority = { tag: string; title: string; text: ComponentChildren };

function priorities(packages: number): Priority[] {
  return [
    {
      tag: "readable",
      title: "Code you can read aloud",
      text: (
        <>
          A file runs from top to bottom. Types come first, blocks are parentheses and
          counting starts at one, so someone new to the code can follow it line by line.
        </>
      ),
    },
    {
      tag: "capable",
      title: "Room for complex programs",
      text: (
        <>
          Structs, classes, generics, enums, threads and errors as values are part of the
          language, and {packages} packages ship with it. Programs grow without turning hard to
          read.
        </>
      ),
    },
    {
      tag: "fast",
      title: "Fast, native executables",
      text: (
        <>
          OSL compiles to Go, and Go builds a native executable. There's no virtual machine
          and no runtime to install: you ship one file.
        </>
      ),
    },
    {
      tag: "easy",
      title: "Easy to start, easy to use",
      text: (
        <>
          <code>log "Hello"</code> is a whole program. One <code>osl</code> command runs,
          tests, formats and fixes your code, and its errors explain what went wrong, usually
          with the fix.
        </>
      ),
    },
  ];
}

const STARTS = [
  {
    href: "/learn",
    title: "Take the course",
    text: `${LESSONS.length} short lessons, from your first line to generics and threads.`,
    cta: "Start learning",
  },
  {
    href: "/build",
    title: "Build a project",
    text: "A CLI tool, a web API, a desktop app, a game or a bot, one step at a time.",
    cta: "Pick a project",
  },
  {
    href: "/packages",
    title: "Explore the packages",
    text: "Every package in the standard library, with a walkthrough and its full API.",
    cta: "Browse packages",
  },
];

export function Landing() {
  const packages = PACKAGE_GROUPS.reduce((n, g) => n + g.packages.length, 0);
  const hero = SAMPLES.hero.example;
  return (
    <div class="home">
      <section class="home-hero">
        <div class="home-hero__copy">
          <h1 class="home-hero__title">Readable code for complex programs.</h1>
          <p class="home-hero__lede">
            OSL is a programming language that stays easy to read as your program grows. It
            compiles to a fast native executable, and it's easy to install, learn and use.
          </p>
          <div class="home-actions">
            <a class="btn btn--primary btn--lg" href="/learn">
              Get started
            </a>
            <a class="btn btn--secondary btn--lg" href="/playground">
              Try it in your browser
            </a>
          </div>
          <div class="home-install">
            <Install />
            <p class="home-meta">
              OSL {index.version} · MIT licence ·{" "}
              <a href={SOURCE} target="_blank" rel="noopener">
                Source
              </a>{" "}
              · <a href="/install">Other ways to install</a>
            </p>
          </div>
        </div>
        <div class="home-hero__code">
          <CodeExample example={hero} recorded={recordings[hero.id]} />
          <p class="home-note">
            Typed JSON, with the error handled. This is the real compiler, running in your browser.
          </p>
        </div>
      </section>

      <section class="home-section" aria-labelledby="priorities">
        <h2 id="priorities" class="home-title">
          What OSL puts first
        </h2>
        <div class="priorities">
          {priorities(packages).map((p) => (
            <article key={p.tag} class="priority">
              <span class="priority__tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="home-section" aria-labelledby="start">
        <h2 id="start" class="home-title">
          Get started
        </h2>
        <div class="starts">
          {STARTS.map((s) => (
            <a key={s.href} class="start" href={s.href}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <span class="arrow-link">
                {s.cta} <ArrowRight aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
