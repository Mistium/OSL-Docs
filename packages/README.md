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
| `import "go/net/http"` | A raw Go package, for advanced interop. |

Missing third-party Go dependencies are fetched automatically when you compile.

## Returned objects

Some packages give you an **object** to keep working with. For example, `db.open()` returns a
database handle, and you call further methods on *that*:

```javascript
import "osl/db"

*db.DB handle = db.open("app.db")
handle.exec("CREATE TABLE users (id INTEGER, name TEXT)")
array rows = handle.query("SELECT * FROM users")
```

On each package page these are listed under **"Returned object"** headings.

## The standard library at a glance

### Web & networking
| Package | Description |
| --- | --- |
| [serve](serve.md) | HTTP server / web framework (routing, middleware, contexts). |
| [ws](ws.md) | WebSocket client and server. |
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
| [csv](csv.md) | CSV parsing plus a small dataframe-style toolkit. |
| [xml](xml.md) | XML parsing and querying. |
| [template](template.md) | Lightweight `{{ }}` templating with HTML escaping. |
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

### Scripting & concurrency
| Package | Description |
| --- | --- |
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
