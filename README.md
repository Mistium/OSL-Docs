# What is OSL?

**OSL** is a small, fast, compiled programming language. You write `.osl` source files in a clean,
readable syntax and the OSL compiler turns them into a **single self-contained native binary** — no
runtime, no interpreter, no dependencies to ship.

```javascript
import "osl/serve"

string port = "8080"
*serve.Router app = serve.new()

app.GET("/", def(*serve.Context c) -> (
  c.string(200, "Hello from OSL!")
))

log "Listening on http://localhost:" ++ port
app.serve(":" ++ port)
```

Compile it and run the binary:

```bash
osl compile server.osl   # produces ./server
./server
```

## What is it good for?

OSL is designed for writing **servers, command-line tools, scripts, and small applications** quickly,
with a batteries-included standard library. Out of the box you get HTTP servers and clients,
WebSockets, an embedded SQL database, JSON/YAML/CSV/XML, cryptography, file-system and process
utilities, a terminal-UI toolkit, image/PDF/QR generation, and much more — all documented in the
[Packages](packages/README.md) section.

Because programs compile to a native binary, they start instantly and run fast, while the language
itself stays approachable and dynamic-feeling.

## Key ideas

- **Readable, command-style syntax.** Code reads top-to-bottom. There is no `main()` to write — the
  file *is* the program (see [The Execution Model](getting-started/README.md#the-execution-model)).
- **Optional types.** Variables and function parameters can be untyped (`x = 5`) or typed
  (`int x = 5`). Types are checked at compile time when you use them.
- **A rich standard library.** Capabilities are grouped into [packages](packages/README.md) you pull in
  with `import "osl/<name>"`.
- **Methods and functions everywhere.** Values have methods (`"hi".toUpper()`, `[1,2,3].map(...)`),
  and there is a large set of built-in [functions](functions/math/README.md).

## Where to go next

| If you want to… | Read |
| --- | --- |
| Install OSL and write your first program | [Getting Started](getting-started/README.md) |
| Learn the language | [Types](basics/types.md) · [Syntax](language/syntax.md) · [Functions](custom-syntax/functions.md) · [Classes](custom-syntax/classes.md) |
| Browse the standard library | [Packages](packages/README.md) |
| Build a web server | [`osl/serve`](packages/serve.md) |
| See the old originOS graphical OSL | [Legacy OSL](legacy-osl/README.md) |

---

> **A note on history.** OSL began as the scripting language of **originOS**, a graphical desktop
> environment, where every program was a window. This documentation covers **OSL.go**, the modern
> compiler that brings the same syntax to standalone native programs. Most language features carry
> over; the windowing/graphics features now live in the [`osl/window`](packages/window.md) package, and
> originOS-only features are preserved for reference under [Legacy OSL](legacy-osl/README.md).
