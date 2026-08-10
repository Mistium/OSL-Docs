# Packages

OSL keeps the core language small and ships capabilities as a **standard library of packages**. You
pull in what you need with `import`:

```javascript
import "osl/fs"

log fs.readFile("notes.txt")
```

Each package exposes a single global value named after the package (`fs`, `crypto`, `serve`, …) whose
methods you call. The `osl/` prefix is optional for standard-library packages - `import "fs"` and
`import "osl/fs"` are equivalent.

## How imports work

| Form | Meaning |
| --- | --- |
| `import "osl/fs"` / `import "fs"` | A standard-library package (listed below). |
| `import "./helpers.osl"` | Another OSL file in your project (path relative to the current file). |
| `import "utils"` / `import "./utils"` | A **directory** — imports every `.osl` file inside it (path relative to the current file). |
| `import "go/net/http"` | A raw Go package, for advanced interop. |

Directory imports pull in all the `.osl` files in the named folder, so you can split a
module across several files and import the folder once. The `osl/` prefix is reserved for
standard-library packages: to import a local directory literally named `osl`, write
`import "./osl"` — a bare `import "osl"` always looks for a standard-library package.
Directory imports reuse the resolver's already-sorted file slice directly, and bare-package
resolution checks embedded file metadata without loading package source. Repeated core and package
imports reuse their first registration instead of rebuilding import state or reparsing package signatures.
Package and returned-object methods are registered from the same parsed Go method declarations.

Missing third-party Go dependencies are fetched automatically when you compile.

## Modules — `import(...)` as a value

The statement `import "./x.osl"` merges another file's globals and functions into the current
scope. Imported top-level variables share the entry file's global scope, so functions in either
file can use them. Top-level statements still run once, at the position of the first import.
The **expression** form `import("./x.osl")` instead returns that file as a **module object**
whose fields are its public functions:

```javascript
object math = import("./math.osl")

log math.add(2, 3)
log math.square(4)
```

Top-level names that start with `_` are **private**: they are not exposed on the module
object, but the module's own functions can still call them. Both `def` declarations and
function-valued assignments are exported through the same module-function path.

```javascript
// math.osl
def _double(number n) number (
  return n * 2
)

def square(number n) number (
  return n * n
)

def quadruple(number n) number (
  return _double(_double(n))
)
```

Here `math.square` and `math.quadruple` are callable from outside, but `math._double` is not
— it exists only for the module's internal use. `import(...)` works with local `.osl` files
whose path is a string literal.

## Returned objects

Some packages give you an **object** to keep working with. For example, `db.open()` returns a
database handle, and you call further methods on *that*:

```javascript
import "osl/db"

*db.DB handle = db.open("app.db")
handle.exec("CREATE TABLE users (id INTEGER, name TEXT)")
array rows = handle.query("SELECT * FROM users")
```

On each package page these are listed under **"Returned object"** headings. Pointer and value
receiver methods are merged by the same direct returned-object lookup.

## The standard library at a glance

### Web & networking
| Package | Description |
| --- | --- |
| [serve](serve.md) | HTTP server / web framework (routing, middleware, contexts). |
| [ws](ws.md) | WebSocket client and server. |
| [originchats](originchats.md) | Bot framework for OriginChats servers. |
| [requests](requests.md) | HTTP client (`get`/`post`/`put`/…). |
| [net](net.md) | Low-level TCP/UDP sockets and DNS lookups. |
| [url](url.md) | URL parsing, building and query-string handling. |
| [ftp](ftp.md) | FTP file transfers. |
| [ssh](ssh.md) | SSH connections, remote commands and SCP. |
| [s3](s3.md) | S3-compatible object storage client. |
| [webpush](webpush.md) | Web Push notifications (VAPID). |

### Data & serialization
| Package | Description |
| --- | --- |
| [json](json.md) | JSON parsing and encoding. |
| [yaml](yaml.md) | YAML parsing and encoding. |
| [schema](schema.md) | Composable validation and normalization schemas. |
| [csv](csv.md) | CSV parsing plus a small dataframe-style toolkit. |
| [xml](xml.md) | XML parsing and querying. |
| [template](template.md) | Lightweight `{{ }}` templating with HTML escaping. |
| [md](md.md) | Markdown to HTML (CommonMark + GFM via goldmark). |
| [mime](mime.md) | MIME-type lookup and parsing. |
| [diff](diff.md) | Text/line/word diffing. |

### Databases & storage
| Package | Description |
| --- | --- |
| [db](db.md) | Embedded SQLite - SQL plus a document/collection API. |
| [save](save.md) | Simple persistent key-value storage. |
| [cache](cache.md) | In-memory LRU cache with TTLs. |
| [env](env.md) | Environment variables and `.env` files. |

### Filesystem & system
| Package | Description |
| --- | --- |
| [fs](fs.md) | Files, directories and path utilities. |
| [mem](mem.md) | Runtime memory counters, heap snapshots, and live pprof diagnostics. |
| [sys](sys.md) | System info, environment, and running shell commands. |
| [process](process.md) | Spawn, manage and signal processes. |
| [zip](zip.md) | ZIP / TAR / GZIP compression. |

### Crypto & security
| Package | Description |
| --- | --- |
| [crypto](crypto.md) | Hashing, HMAC, AES, password hashing, file encryption, random. |
| [jwt](jwt.md) | JSON Web Token signing and verification. |

### Text, math & time
| Package | Description |
| --- | --- |
| [regex](regex.md) | Regular expressions plus validators and text helpers. |
| [semver](semver.md) | Semantic-version parsing and comparison. |
| [math](math.md) | Maths, statistics and number theory. |
| [random](random.md) | Seedable pseudo-random numbers. |
| [date](date.md) | Dates, durations and time zones. |
| [cron](cron.md) | Cron-style job scheduling. |

### Terminal & logging
| Package | Description |
| --- | --- |
| [tui](tui.md) | Terminal UI: colours, boxes, tables, prompts, menus, charts. |
| [log](log.md) | Levelled, colourful logging. |
| [notify](notify.md) | Desktop notifications. |

### Media & documents
| Package | Description |
| --- | --- |
| [img](img.md) | Load, transform and save images. |
| [qr](qr.md) | QR codes and barcodes. |
| [pdf](pdf.md) | Generate PDF documents. |
| [canvas](canvas.md) | In-memory pixel canvas. |
| [colors](colors.md) | Build colour values (used by image-producing packages). |
| [sound](sound.md) | Audio playback. |

### Graphics & windowing
| Package | Description |
| --- | --- |
| [window](window.md) | Open a window and draw to it (the originOS graphics model). |
| [win-buttons](win-buttons.md) | Install native window controls. |

### Scripting & concurrency
| Package | Description |
| --- | --- |
| [js](js.md) | Run sandboxed JavaScript with hard resource limits. |
| [lua](lua.md) | Embed and run Lua scripts. |
| [thread](thread.md) | Background threads. |
| [sync](sync.md) | Named locks for synchronisation. |

### Utilities & data structures
| Package | Description |
| --- | --- |
| [map](map.md) | An ordered key-value map type. |
| [set](set.md) | A set type. |
| [option](option.md) | Optional values (`some`/`none`). |
| [result](result.md) | Success/error result values. |
| [ptr](ptr.md) | Low-level pointer operations. |

### More
| Package | Description |
| --- | --- |
| [email](email.md) | Compose and send email (SMTP). |
| [torrent](torrent.md) | Create and parse `.torrent` files. |

---

To read a package's source directly from the CLI:

```bash
osl package fs       # print the fs package source
osl package          # list every available package
```
