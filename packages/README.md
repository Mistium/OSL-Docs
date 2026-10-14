# Packages

OSL ships its standard library as importable packages:

```osl
import "std:fs"

log fs.readFile("notes.txt")
```

An import adds a package value with the same name. For example, `std:fs` adds `fs`. Use the `std:`
prefix in new code. The older `osl/` spelling still works, but the compiler reports a migration
warning.

## How imports work

| Form | Meaning |
| --- | --- |
| `import "std:fs"` | A standard-library package listed below |
| `import "./helpers.osl"` | A local OSL file, relative to the importing file |
| `import "utils"` or `import "./utils"` | Every `.osl` file directly inside a local directory |
| `import "git.rotur.dev/me/tools"` | A Git dependency installed by Opal |
| `import "go:net/http"` | A Go package |

Directory imports sort files by name and do not recurse. Import or re-export child directories
yourself.

Missing third-party Go dependencies are fetched automatically when you compile.

## Module objects

The statement form merges another file's declarations into the current scope. Its top-level
statements run once, where OSL first imports the file. The expression form returns its public API
as an object instead:

```osl
object math = import("./math.osl")

log math.add(2, 3)
log math.square(4)
```

Without an export statement, a file exposes all of its declarations. Adding an export statement
turns on an explicit public API for that file:

```osl
export {add, subtract as difference}
export {Vector} from "./geometry/vector.osl"
export * as geometry from "./geometry"
```

Consumers can import the full API, selected names, or a namespace:

```osl
import * from "./math.osl"
import {add, subtract as difference} from "./math.osl"
import * as math from "./math.osl"
```

Files in the same directory can share private declarations. Consumers in another directory see
only exported declarations. Missing, duplicate, and conflicting exports are compile errors.

```osl
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

Here `math.square` and `math.quadruple` are callable from outside. `import(...)` works with local `.osl` files
whose path is a string literal.

## Returned objects

Some packages give you an **object** to keep working with. For example, `db.open()` returns a
database handle, and you call further methods on *that*:

```osl
import "std:db"

*db.DB handle = db.open("app.db")
handle.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT)")
*db.Row[] rows = handle.query("SELECT * FROM users")
log rows.len
```

Each package page lists handle methods in a separate section.

## How packages fail

Every package reports failure the same way:

| Situation | Signal | Example |
| --- | --- | --- |
| Bad input data or a failure outside the program (a missing file, a network error, unparsable text) | Returns `result<T, error>` | `json.parse(text)`, `fs.readFile(path)` |
| The thing asked for doesn't exist, and that's a normal answer | Returns `T?` (`null`) | `xml.find(path)`, `mime.typeByExt(ext)` |
| The calling code is wrong (a bad argument, a closed handle) | Throws a typed error | `TypeError`, `ValueError`, `StateError` |

A result used as a plain value unwraps itself and throws its error on failure, so the simple case needs no extra code. Use `catch`, `try(...)`, or `auto` to handle the error yourself:

```osl
import "std:json"

object config = json.parse("{\"debug\": true}")
log config.debug

object fallback = json.parse("{broken") catch (err) (
  log err.kind ++ ": " ++ err.message
  return
)
log fallback
```

See [Errors and results](../guide/errors.md) for the error kinds and every way to consume a result.

Options always go in one trailing object, such as `json.stringify(value, {indent: 2})`. An unknown option key throws `ValueError` naming the accepted keys. Durations are in milliseconds and positions are 1-based.

## The standard library at a glance

### Web & networking
| Package | Description |
| --- | --- |
| [serve](serve.md) | HTTP servers with routes, middleware, templates, static files, and WebSocket endpoints. |
| [ws](ws.md) | WebSocket client and server. |
| [requests](requests.md) | HTTP client, with whole responses or streams of lines and server-sent events. |
| [net](net.md) | Low-level TCP, Unix, and UDP sockets and DNS lookups. |
| [url](url.md) | URL parsing, building, and query-string handling. |
| [ftp](ftp.md) | FTP file transfers. |
| [ssh](ssh.md) | SSH connections, remote commands, SFTP, port forwarding, and SSH keys. |
| [s3](s3.md) | S3-compatible object storage client. |
| [webpush](webpush.md) | Web Push notifications (VAPID). |
| [email](email.md) | Compose email with attachments and send it over SMTP. |
| [torrent](torrent.md) | A BitTorrent client: download and seed torrents, and create and read `.torrent` files and magnet links. |
| [originchats](originchats.md) | Bot framework for OriginChats servers. |
| [rotur](rotur.md) | Client for the rotur.dev API: accounts, posts, groups, economy, storage, and realtime presence. |

### Data & serialization
| Package | Description |
| --- | --- |
| [json](json.md) | JSON parsing, encoding, and streaming. |
| [yaml](yaml.md) | YAML parsing and encoding. |
| [schema](schema.md) | Composable validation and normalization schemas. |
| [csv](csv.md) | CSV parsing and writing as records or rows of cells. |
| [xml](xml.md) | XML parsing, querying, and editing. |
| [template](template.md) | `{{ }}` templates with `if`, `unless`, and `each` blocks and optional HTML escaping. |
| [md](md.md) | Markdown to HTML (CommonMark + GFM via goldmark) and HTML back to Markdown. |
| [mime](mime.md) | Media-type lookup by extension and `Content-Type` parsing. |
| [diff](diff.md) | Line, word, and character diffs as unified text or HTML. |

### Databases & storage
| Package | Description |
| --- | --- |
| [db](db.md) | Embedded SQLite: SQL plus JSON document collections. |
| [save](save.md) | Simple persistent key-value storage. |
| [cache](cache.md) | In-memory LRU cache with TTLs. |
| [env](env.md) | Environment variables and `.env` files. |

### Filesystem & system
| Package | Description |
| --- | --- |
| [fs](fs.md) | Files, directories, and path utilities. |
| [mem](mem.md) | Runtime memory counters, heap snapshots, and live pprof diagnostics. |
| [sys](sys.md) | The operating system, machine, and user, and opening URLs in the default app. |
| [process](process.md) | Run commands, manage child processes, and read the program's arguments and IDs. |
| [zip](zip.md) | ZIP and tar archives and gzip compression. |

### Crypto & security
| Package | Description |
| --- | --- |
| [crypto](crypto.md) | Hashing, HMAC, password hashing, encryption, signatures, and secure random values. |
| [jwt](jwt.md) | JSON Web Token signing and verification. |

### Text, math & time
| Package | Description |
| --- | --- |
| [emoji](emoji.md) | Emoji detection, extraction, replacement, flags, and skin tones. |
| [regex](regex.md) | Regular expressions, compiled patterns, validators, and text helpers. |
| [utf16](utf16.md) | JavaScript-compatible string lengths, positions, ordering, and case mapping in UTF-16 code units. |
| [semver](semver.md) | Semantic-version parsing and comparison. |
| [math](math.md) | Maths, statistics, and number theory. |
| [random](random.md) | Seedable pseudo-random numbers. |
| [date](date.md) | Dates, durations, and time zones. |
| [cron](cron.md) | Cron-style job scheduling. |

### Terminal & logging
| Package | Description |
| --- | --- |
| [tui](tui.md) | Terminal UI: colours, boxes, tables, prompts, menus, charts. |
| [log](log.md) | Levelled, timestamped console logging and progress output. |
| [notify](notify.md) | Desktop notifications. |

### Media & documents
| Package | Description |
| --- | --- |
| [img](img.md) | Create, draw on, filter, load, and save images. |
| [svg](svg.md) | Render SVG documents to images and read their size and viewBox. |
| [colors](colors.md) | Parse CSS colours, and convert, mix, lighten, and darken them. |
| [exif](exif.md) | Read the EXIF orientation of images and strip their EXIF metadata. |
| [qr](qr.md) | QR codes and barcodes. |
| [pdf](pdf.md) | Generate PDF documents. |
| [sound](sound.md) | Audio playback. |

### Graphics & windowing
| Package | Description |
| --- | --- |
| [raylib](raylib.md) | Native windows with 2D and 3D drawing, input, textures, and shaders. |
| [raygui](raygui.md) | Immediate-mode GUI controls drawn in a raylib window. |
| [layout](layout.md) | Immediate-mode interfaces on raylib and raygui with rows, columns, and flexbox-style sizing. |
| [shader](shader.md) | OSL-style shader code transpiled to GLSL for raylib. |

### Scripting & concurrency
| Package | Description |
| --- | --- |
| [testing](testing.md) | Assertions and the `osl test` workflow. |
| [js](js.md) | Run sandboxed JavaScript with hard resource limits. |
| [lua](lua.md) | Embed and run Lua scripts. |
| [thread](thread.md) | Background threads, parallel workers, racing, and message channels. |
| [sync](sync.md) | Named locks, scoped locking, one-time execution, and wait groups. |

### Utilities & data structures
| Package | Description |
| --- | --- |
| [box2d](box2d.md) | Box2D-compatible rigid-body worlds, bodies, and fixtures. |
| [events](events.md) | Named in-process events with thread-safe listeners. |
| [map](map.md) | The built-in hash map type. |
| [set](set.md) | The built-in set type. |
| [option](option.md) | Optional values (`some`/`none`). |
| [result](result.md) | Success/error result values. |
| [retry](retry.md) | Bounded retries with exponential backoff and jitter. |
| [ptr](ptr.md) | Shared mutable cells and low-level pointer operations. |

To read a package's source directly from the CLI:

```bash
osl package fs       # print the fs package source
osl package          # list every available package
```
