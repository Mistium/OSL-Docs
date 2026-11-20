/* osl-lang.org: hello, what OSL is about, one live example, and where to
   start. The code sample is live: it is compiled when the site is built, and
   in the browser it can be edited, checked and run. Colours are rotur-ui
   swatches; the little drawings are flat CSS in the style of its motifs. */

import type { ComponentChildren } from "preact";
import { ArrowRight } from "lucide-preact";
import index from "virtual:docs-index";
import { CodeExample, CopyButton } from "../components/CodeExample";
import { INSTALL, LESSONS, PACKAGE_GROUPS, SOURCE } from "../nav";
import { SAMPLES } from "./samples";
import recordings from "virtual:landing-outputs";

/* rotur-ui's SWATCHES, by name. */
const LILAC = "#c299cf";
const SKY = "#56c6e8";
const MARIGOLD = "#ffc35a";
const MINT = "#74d48f";
const CORAL = "#ff8a80";
const PERIWINKLE = "#8aa2ff";

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

/* A hand-drawn wave under the name. */
function Wave() {
  return (
    <svg class="home-wave" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true">
      <path d="M3 13 C 25 3, 42 3, 60 11 S 98 19, 118 10 S 160 2, 197 9" pathLength="1" />
    </svg>
  );
}

/* One short line of code, typing itself. */
function SimpleDoodle() {
  return (
    <div class="doodle doodle--simple" aria-hidden="true">
      <i>
        <b />
        <b />
        <b />
      </i>
    </div>
  );
}

/* Small blocks stacking into something bigger. */
function PowerfulDoodle() {
  return (
    <div class="doodle doodle--powerful" aria-hidden="true">
      <i>
        {Array.from({ length: 6 }, (_, n) => (
          <b key={n} />
        ))}
      </i>
    </div>
  );
}

/* A dot that gets there first. */
function FastDoodle() {
  return (
    <div class="doodle doodle--fast" aria-hidden="true">
      <i>
        <b />
        <b />
        <b />
        <b />
      </i>
    </div>
  );
}

type Idea = {
  tag: string;
  colour: string;
  title: string;
  Doodle: () => ComponentChildren;
  text: ComponentChildren;
};

function ideas(packages: number): Idea[] {
  return [
    {
      tag: "simple",
      colour: LILAC,
      title: "Simple to write",
      Doodle: SimpleDoodle,
      text: (
        <>
          <code>log "Hello"</code> is a whole program. There's no main function, no build file and
          no boilerplate: you write what you mean, and <code>osl run</code> runs it.
        </>
      ),
    },
    {
      tag: "powerful",
      colour: SKY,
      title: "Powerful when you need it",
      Doodle: PowerfulDoodle,
      text: (
        <>
          Classes, generics, enums, threads and errors as values are all built in, with{" "}
          {packages} packages for servers, databases, games and desktop apps. You can call into any
          Go package too.
        </>
      ),
    },
    {
      tag: "fast",
      colour: MARIGOLD,
      title: "And still fast",
      Doodle: FastDoodle,
      text: (
        <>
          OSL compiles to Go, and Go builds a native executable. There's no virtual machine and no
          runtime to install, just one file you can hand to anyone.
        </>
      ),
    },
  ];
}

const STARTS = [
  {
    href: "/learn",
    colour: MINT,
    title: "Take the course",
    text: `${LESSONS.length} short lessons, from your first line to generics and threads.`,
    cta: "Start learning",
  },
  {
    href: "/build",
    colour: CORAL,
    title: "Build something",
    text: "A CLI tool, a web API, a desktop app, a game or a bot, one step at a time.",
    cta: "Pick a project",
  },
  {
    href: "/packages",
    colour: PERIWINKLE,
    title: "Explore the packages",
    text: "Everything in the standard library, with a walkthrough and its full API.",
    cta: "Browse packages",
  },
];

const tint = (colour: string) => ({ "--c": colour });

export function Landing() {
  const packages = PACKAGE_GROUPS.reduce((n, g) => n + g.packages.length, 0);
  const hero = SAMPLES.hero.example;
  return (
    <div class="home">
      <section class="home-hero">
        <div class="home-hero__copy">
          <h1 class="home-hero__title">
            Meet{" "}
            <span class="home-hero__name">
              OSL
              <Wave />
            </span>
          </h1>
          <p class="home-hero__lede">
            A small, simple language with a lot of power behind it. Write a one-line script or a
            whole web server, then run it as a fast native program.
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
            Read some JSON into a typed struct, handle the error, add it up. Press Run, or click the
            code and change it.
          </p>
        </div>
      </section>

      <section class="home-section" aria-labelledby="ideas">
        <h2 id="ideas" class="home-title">
          Simple, powerful, and still fast
        </h2>
        <div class="ideas">
          {ideas(packages).map(({ tag, colour, title, Doodle, text }) => (
            <article key={tag} class="idea" style={tint(colour)}>
              <Doodle />
              <span class="idea__tag">{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section class="home-section" aria-labelledby="start">
        <h2 id="start" class="home-title">
          Jump in
        </h2>
        <div class="starts">
          {STARTS.map((s) => (
            <a key={s.href} class="start" href={s.href} style={tint(s.colour)}>
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
