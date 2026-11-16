# osl-lang.org

The source of [osl-lang.org](https://osl-lang.org), the OSL documentation site:
an interactive course, code-along projects, a page for every standard package
and a reference for the language and its tools.

Pages are Markdown in `content/`. Every OSL example on them is compiled and run
by the real compiler at build time, and the site plays back what it printed.
Editing an example checks it in the browser with the compiler's front end built
to WebAssembly, and running edited code goes to an optional sandboxed run
server.

## Working on it

Needs [bun](https://bun.sh), Go and git.

```bash
bun install
bun osl:assets      # build the compiler osl.json pins, osl.wasm and the package API
bun examples        # compile and run new or changed examples, record their output
bun dev             # serves on port 5180
```

Before sending a change:

```bash
bun typecheck
bun test
bun examples:check  # fails if an example has no recording for the pinned OSL
bun run build       # static site in dist/, every route prerendered
```

## Layout

| Path | What's there |
| --- | --- |
| `content/learn/` | The course, one lesson per page |
| `content/build/` | Code-along projects (`layout: project`, one step per `##`) |
| `content/packages/` | A page per `std:` package; the API tables come from `generated/api.json` |
| `content/reference/` | Language and tool reference, and the legacy OSL pages |
| `src/` | The Preact app: pages, editor, quizzes, exercises, navigation |
| `src/nav.ts` | Sidebar order and labels |
| `vite/` | Content loading, the `.md` copy of every page, `llms.txt` |
| `scripts/` | `osl-assets`, `examples` and the prerender step |
| `tools/` | The wasm and API-dump commands, built inside the pinned compiler |
| `runner/main.osl` | The run server for edited code |
| `tests/` | `bun test`: the Markdown parser, share links and the router |
| `osl.json` | The OSL commit and version the site documents |

## Writing pages

A page is Markdown with frontmatter (`title`, `description`, and `layout` for
projects). Fenced `osl` blocks are examples:

- an `output` fence straight after one is what it must print;
- `osl norun` is compiled but not run (servers, windows, files);
- `osl error` must fail to compile, `osl fails` must exit with a failure;
- `osl fragment` is shown but not compiled;
- `osl varies` runs but its output isn't pinned (random numbers, time).

The full list of flags is at the top of `src/lib/markdown.ts`. Quizzes and
exercises are `:::quiz` and `:::exercise` containers closed by a `:::` line;
see any lesson in `content/learn/` for the shape. After editing examples, run
`bun examples` and commit `generated/examples.json` with the page.

Every page is also served as Markdown at its path plus `.md`, and the whole
site as `/llms.txt` and `/llms-full.txt`.

## Updating OSL

Point `osl.json` at the new commit and version, then:

```bash
bun osl:assets
bun examples --force
```

## Run server

Running edited code needs the run server, which compiles and runs each job in a
bubblewrap sandbox with no network:

```bash
osl run runner/main.osl              # PORT=8095 by default
VITE_OSL_RUNNER=https://run.example bun run build
```

Without `VITE_OSL_RUNNER` the site still checks edited code but can't run it.
