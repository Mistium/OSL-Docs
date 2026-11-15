/* osl-lang.org: what OSL is, what it believes, and what you can build with
   it. Every code sample is live: it is compiled when the site is built, and
   in the browser it can be edited, checked and run. */

import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { ArrowRight, BookOpen, Boxes, Gamepad2, Globe, Hammer, LayoutPanelLeft, MessagesSquare, Cpu, ShieldCheck, Feather, TerminalSquare, Zap, Library } from "lucide-preact";
import index from "virtual:docs-index";
import { CodeExample, CopyButton } from "../components/CodeExample";
import { highlightCode } from "../lib/highlight";
import type { Recorded } from "../lib/types";
import { INSTALL, LESSONS, PACKAGE_GROUPS, SOURCE, packageSlug } from "../nav";
import { SAMPLES, type Sample } from "./samples";
import recordings from "virtual:landing-outputs";

const recorded = (sample: Sample): Recorded | undefined => recordings[sample.example.id];

function Live({ name, compact = false }: { name: string; compact?: boolean }) {
  const sample = SAMPLES[name];
  return <CodeExample example={sample.example} recorded={recorded(sample)} compact={compact} />;
}

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

const PILLARS = [
  {
    icon: <Feather aria-hidden="true" />,
    title: "Readable",
    text: "A file runs from top to bottom. Types come first, blocks are parentheses, and counting starts at one. You can read an OSL program aloud.",
  },
  {
    icon: <Zap aria-hidden="true" />,
    title: "Fast",
    text: "OSL compiles to Go, and Go builds a native executable. No virtual machine and no runtime to install: one file you copy to a server and run.",
  },
  {
    icon: <ShieldCheck aria-hidden="true" />,
    title: "Dependable",
    text: "Declare types where they matter and let the rest be inferred. Failure is a value in the signature, and the compiler follows your guards.",
  },
  {
    icon: <Library aria-hidden="true" />,
    title: "Complete",
    text: "Web servers, databases, desktop apps, games, threads and crypto ship with the compiler. Anything else is one Go import away.",
  },
];

type Belief = { title: string; text: ComponentChildren; sample: string };

const BELIEFS: Belief[] = [
  {
    title: "A program is just the code",
    text: (
      <>
        No <code>main</code>, no package line, no build file. A file that says <code>log "Hello, world"</code> is a complete program, and so is a web
        server. When a project grows, imports and Opal take over; the first line never needs them.
      </>
    ),
    sample: "script",
  },
  {
    title: "Types where they earn their keep",
    text: (
      <>
        Write the type at the edges, where functions meet, and let <code>auto</code> fill in the middle. The compiler checks every boundary and
        generates direct Go for what it knows, so the types you write make the program faster as well as safer.
      </>
    ),
    sample: "types",
  },
  {
    title: "Failure is a value you can see",
    text: (
      <>
        A call that can fail returns a <code>result</code>. Match on it, pass it up with <code>!</code>, or unwrap it on purpose. The compiler warns
        about failures nobody handles, and it reads your <code>if</code> guards so a call you've made safe stops warning.
      </>
    ),
    sample: "results",
  },
  {
    title: "The compiler explains itself",
    text: (
      <>
        An error says what went wrong, where, and how to fix it, often with the exact code to write. <code>osl fix</code> applies the fixes it is sure
        of, and the language server shows them as you type. Press <em>Compile</em> to see one.
      </>
    ),
    sample: "teach",
  },
  {
    title: "Counting starts at one",
    text: (
      <>
        The first item of an array is <code>[1]</code>, the last is <code>[-1]</code>, and a loop over five things counts to five. OSL is written for
        the way people count, and position <code>0</code> is a compile error rather than an off-by-one.
      </>
    ),
    sample: "ones",
  },
  {
    title: "Go is one import away",
    text: (
      <>
        Every Go package is an <code>import "go:…"</code> away, with no bindings to write. OSL values convert to Go types at the call, so the Go
        ecosystem is part of the standard library.
      </>
    ),
    sample: "go",
  },
];

const SHOWCASE = [
  { key: "server", label: "Web servers", icon: <Globe aria-hidden="true" />, text: "Routes, JSON, middleware, WebSockets and TLS from std:serve and std:ws. One binary serves the API and the site.", href: "/build/web-api", cta: "Build a web API" },
  { key: "ui", label: "Desktop apps", icon: <LayoutPanelLeft aria-hidden="true" />, text: "Write a component once with std:ui's markup, and show it in a native window or as a live web page.", href: "/build/desktop-app", cta: "Build a desktop app" },
  { key: "game", label: "Games", icon: <Gamepad2 aria-hidden="true" />, text: "Windows, input, sprites, sound, 3D and physics, through raylib, raygui and box2d.", href: "/build/game", cta: "Build a game" },
  { key: "cli", label: "Command-line tools", icon: <TerminalSquare aria-hidden="true" />, text: "Read files and arguments, talk to processes and the terminal, and compile to a binary that starts instantly.", href: "/build/cli-tool", cta: "Build a CLI tool" },
  { key: "threads", label: "Concurrent programs", icon: <Cpu aria-hidden="true" />, text: "Threads, channels, locks and parallel maps, with collections that stay safe when threads share them.", href: "/learn/concurrency", cta: "Learn concurrency" },
  { key: "bot", label: "Chat bots", icon: <MessagesSquare aria-hidden="true" />, text: "Commands, slash commands, embeds and polls on originChats, with reconnection built in.", href: "/build/chat-bot", cta: "Build a chat bot" },
];

const TOOLS = [
  ["osl run main.osl", "compile and run, with a warm cache in milliseconds"],
  ["osl compile main.osl", "build a native executable"],
  ["osl test", "run the test blocks beside your code"],
  ["osl fmt src/", "format every file the one way"],
  ["osl fix src/", "apply the compiler's suggested fixes"],
  ["osl lsp", "diagnostics, completion and rename in your editor"],
  ["opal add owner/repo", "add a package from Git, pinned in opal.lock"],
];

function Showcase() {
  const [active, setActive] = useState(SHOWCASE[0].key);
  const current = SHOWCASE.find((s) => s.key === active)!;
  return (
    <div class="showcase">
      <div class="showcase__tabs" role="tablist" aria-label="Things to build">
        {SHOWCASE.map((s) => (
          <button key={s.key} type="button" role="tab" aria-selected={s.key === active} class="showcase__tab" onClick={() => setActive(s.key)}>
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
      <div class="showcase__panel" role="tabpanel">
        <div class="showcase__copy">
          <h3>{current.label}</h3>
          <p>{current.text}</p>
          <a class="arrow-link" href={current.href}>
            {current.cta} <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div class="showcase__code">
          <Live key={current.key} name={current.key} compact />
        </div>
      </div>
    </div>
  );
}

export function Landing() {
  const total = PACKAGE_GROUPS.reduce((n, g) => n + g.packages.length, 0);
  return (
    <div class="landing">
      <section class="hero">
        <div class="hero__stars" aria-hidden="true" />
        <div class="hero__inner">
          <div class="hero__copy">
            <a class="hero__version" href="/install">
              OSL {index.version} <ArrowRight aria-hidden="true" />
            </a>
            <h1 class="hero__title">
              Write less.
              <br />
              <span class="hero__accent">Mean more.</span>
            </h1>
            <p class="hero__lede">
              OSL is a readable, typed language that compiles to native code. Write it top to bottom like a script, check it like a compiled language, and
              ship it as one executable.
            </p>
            <div class="hero__actions">
              <a class="btn btn--primary btn--lg" href="/learn">
                Get started
              </a>
              <a class="btn btn--secondary btn--lg" href="/playground">
                Try it in your browser
              </a>
            </div>
            <Install />
          </div>
          <div class="hero__code">
            <Live name="hero" />
            <p class="hero__note">This is the real compiler, running in your browser. Click the code to change it.</p>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="why">
        <h2 id="why" class="section__title">
          Why OSL?
        </h2>
        <div class="pillars">
          {PILLARS.map((p) => (
            <article key={p.title} class="pillar">
              <span class="pillar__icon">{p.icon}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="section" aria-labelledby="beliefs">
        <h2 id="beliefs" class="section__title">
          What OSL believes
        </h2>
        <p class="section__lede">Six ideas shape the language. Each example below is live: run it, change it, break it.</p>
        <div class="beliefs">
          {BELIEFS.map((b, n) => (
            <article key={b.title} class={`belief${n % 2 ? " belief--flip" : ""}`}>
              <div class="belief__copy">
                <span class="belief__number">{String(n + 1).padStart(2, "0")}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
              <div class="belief__code">
                <Live name={b.sample} compact />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section class="section" aria-labelledby="build">
        <h2 id="build" class="section__title">
          Build it in OSL
        </h2>
        <p class="section__lede">One language from the server to the window. Every project here has a step-by-step tutorial.</p>
        <Showcase />
      </section>

      <section class="section section--split" aria-labelledby="tools">
        <div>
          <h2 id="tools" class="section__title">
            One command for the whole loop
          </h2>
          <p class="section__lede">
            The compiler is also the formatter, the test runner, the fixer and the language server. Opal, the package manager, ships with it.
          </p>
          <a class="arrow-link" href="/reference/cli">
            The command line <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div class="terminal" role="img" aria-label="OSL commands">
          <div class="terminal__bar">
            <span />
            <span />
            <span />
          </div>
          <div class="terminal__body">
            {TOOLS.map(([cmd, what]) => (
              <div key={cmd} class="terminal__line">
                <code class="hljs" dangerouslySetInnerHTML={{ __html: `<span class="terminal__prompt">$</span> ${highlightCode(cmd, "bash") ?? cmd}` }} />
                <span class="terminal__what"># {what}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="stdlib">
        <h2 id="stdlib" class="section__title">
          Everything in the box
        </h2>
        <p class="section__lede">{total} packages ship with the compiler. Each one has a tutorial and a complete reference generated from its source.</p>
        <div class="stdlib">
          {PACKAGE_GROUPS.map((g) => (
            <div key={g.slug} class="stdlib__group">
              <h3>{g.title}</h3>
              <div class="stdlib__names">
                {g.packages.map((p) => (
                  <a key={p} href={`/${packageSlug(p)}`}>
                    {p}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section class="section" aria-labelledby="start">
        <h2 id="start" class="section__title">
          Get started
        </h2>
        <div class="starts">
          <a class="start" href="/learn">
            <BookOpen aria-hidden="true" />
            <h3>Take the course</h3>
            <p>{LESSONS.length} short lessons, from your first line to generics and threads, with quizzes and exercises along the way.</p>
            <span class="arrow-link">
              Start learning <ArrowRight aria-hidden="true" />
            </span>
          </a>
          <a class="start" href="/build">
            <Hammer aria-hidden="true" />
            <h3>Build a project</h3>
            <p>Make a CLI tool, a web API, a chat server, a desktop app, a game or a bot, one step at a time.</p>
            <span class="arrow-link">
              Pick a project <ArrowRight aria-hidden="true" />
            </span>
          </a>
          <a class="start" href="/packages">
            <Boxes aria-hidden="true" />
            <h3>Explore the packages</h3>
            <p>Every package in the standard library, with a walkthrough and every function it offers.</p>
            <span class="arrow-link">
              Browse packages <ArrowRight aria-hidden="true" />
            </span>
          </a>
        </div>
        <p class="starts__source">
          OSL is open source under the MIT licence. The compiler lives at{" "}
          <a href={SOURCE} target="_blank" rel="noopener">
            git.rotur.dev/osl
          </a>
          .
        </p>
      </section>
    </div>
  );
}
