# fs

The `fs` package reads and writes files, manages directories, and manipulates path strings.

```osl
import "std:fs"
```

## Results and errors

Functions that touch the disk return a [`result`](result.md) instead of a placeholder such as `""`,
`[]` or `false`. Writes and other operations with nothing to hand back return `result<unit, error>`;
reads return the value they read, such as `result<string, error>`. A failed call carries an `error`
whose `.kind` is almost always one of:

| Kind | When |
| --- | --- |
| `NotFoundError` | The path, or a parent directory it needs, doesn't exist. |
| `PermissionError` | The operating system refuses access. |
| `IOError` | Anything else: a directory where a file was expected, a destination that already exists, the end of a file in `file.readLine()`, or a disk error. |
| `ParseError` | A malformed glob pattern or an invalid regular expression. |

A few rare failures fall outside these, such as `RuntimeError` from `fs.evalSymlinks` on a symlink
loop.

The error's `.message` names the call and the path, for example
`fs.readFile: open notes.txt: no such file or directory`.

A result is unwrapped when you assign it to a typed variable, pass it to a typed parameter, call a
method of the success value on it, or use the call as a statement. If the call failed, the unwrap
throws its error. The compiler reports a `ThrowWarning` for an unwrap that can throw and that nothing
handles. Handle the failure where it matters instead:

```osl
import "std:fs"

string config = fs.readFile("config.json").unwrapOr("{}")
log config

if !fs.writeFile("out.txt", "hello") (
  log "couldn't write out.txt"
)

auto saved = fs.writeFile("out.txt", "hello")
if saved.isErr() (
  error problem = saved.unwrapErr()
  log problem.kind ++ ": " ++ problem.message
)

def loadNotes() string (
  string text = fs.readFile("notes.txt") catch (err) (
    log "starting with empty notes: " ++ err.message
    return ""
  )
  return text
)
log loadNotes()
```

In a condition, or assigned to a `boolean`, a result is `true` on success and `false` on failure.
Prefix a call with `void` to ignore its failure on purpose. `call() catch (err) (...)` handles a
failure with the error named `err` (the [catch expression](../guide/errors.md) names it `_` when you
don't), and `try(expr)` turns anything `expr` throws into a failed result.

The compiler doesn't warn about an unwrap it can see is guarded: `fs.readFile(path)` inside
`if fs.isFile(path) (...)`, `fs.readDir(path)` inside `if fs.isDir(path) (...)` and `fs.stat(path)`
inside `if fs.exists(path) (...)` unwrap without a `ThrowWarning`. The same goes for `readFileBytes`,
`size`, `syncFile` and `lines` under `fs.isFile`, `entries` under `fs.isDir`, and `modTime` and
`evalSymlinks` under `fs.exists`. `fs.isFile` and `fs.isDir` also count as `fs.exists`.

Some mistakes throw straight away instead of returning a failed result, because they are bugs in
the calling code rather than conditions on disk: an unknown option name (`ValueError`, with a
suggestion), an option of the wrong type (`TypeError`), a byte outside 0 to 255, an empty path for
`fs.syncLater`, copying a directory into itself, and using a closed or wrong-mode file handle
(`StateError`). Wrap the call in `try(...)` if you need these as a result too.

Options go in a trailing object, such as `fs.mkdir(path, {recursive: true})`.

## Reading and writing files

#### `fs.readFile(path)` → `result<string, error>`
Reads the whole file as text. Fails with `NotFoundError` when the file doesn't exist,
`PermissionError` when it can't be read, and `IOError` for anything else, such as `path` being a
directory.

```osl
string text = fs.readFile("notes.txt").unwrapOr("")
log text
```

#### `fs.readFileBytes(path)` → `result<byte[], error>`
Reads the whole file as raw bytes, for binary data. Fails like `fs.readFile`.

```osl
byte[] body = fs.readFileBytes("image.png") catch (err) (
  log "no image: " ++ err.message
  exit 1
)
log body.len
```

#### `fs.writeFile(path, text, {durable}?)` → `result<unit, error>`
Replaces the file's contents with `text`, creating the file if needed. The replacement is atomic:
data is written to a temporary file in the same directory and renamed over `path` only after the
complete file has been flushed and closed, so readers see the old contents or the new ones, never a
mix. A failed write leaves an existing file unchanged and removes the temporary file. Writing
through a symlink replaces the file the link points to. An existing file keeps its permissions; a
new one gets `0644`.

Fails with `NotFoundError` when the parent directory doesn't exist, `PermissionError`, or `IOError`
(for example when `path` is a directory). An error from creating the temporary file names `path`;
one from writing, flushing or renaming it can name the temporary file.

Options:

| Option | Default | Meaning |
| --- | --- | --- |
| `durable` | `true` | Flush the new contents to the drive before the rename and return only after that. `false` keeps the write atomic but lets it return before the data reaches the drive. Neither setting syncs the parent directory, so with either one a power cut right after can leave the old contents (see below). |

On macOS, `durable: false` replaces the full disk flush with a much cheaper write barrier (see
[batching](#automatic-durable-write-batching-on-macos)). On other operating systems both settings
currently perform the same `File.Sync`.

```osl
if !fs.writeFile("out.txt", "hello world") (
  log "write failed"
)

void fs.writeFile("cache.json", "{}", {durable: false})
```

#### `fs.writeFileBytes(path, data, {durable}?)` → `result<unit, error>`
Replaces the file's contents with bytes, with the same atomic replacement, options and failures as
`fs.writeFile`. `data` is a `byte[]`; a string writes its UTF-8 bytes, and an array of whole numbers
from 0 to 255 writes those bytes. A number outside that range throws `ValueError`. Passing a result
such as `fs.readFileBytes(other)` straight in unwraps it, throwing its error.

```osl
if !fs.writeFileBytes("header.bin", [0, 255, 65]) (
  log "write failed"
)
```

#### `fs.appendFile(path, text)` → `result<unit, error>`
Adds `text` to the end of the file, creating it if needed. Fails with `NotFoundError` when the parent
directory doesn't exist, `PermissionError`, or `IOError`. It neither replaces the file atomically
nor flushes it to the drive; follow it with `fs.syncFile` or `fs.syncLater` when that matters.

#### `fs.appendFileBytes(path, data)` → `result<unit, error>`
Adds bytes to the end of the file. `data` is read like `fs.writeFileBytes` data. Fails like
`fs.appendFile`.

#### `fs.syncFile(path)` → `result<unit, error>`
Flushes an existing file's written data to the drive and returns once that has finished. Fails with
`NotFoundError` when the file doesn't exist; it never creates one. It opens the file for writing, so
a read-only file fails with `PermissionError`, and a directory fails with `IOError`. Use it after `fs.appendFile` when
a commit has to be durable before you carry on.

#### `fs.syncLater(path)` → `result<unit, error>`
Queues a durability flush of the file at `path` and returns immediately, without waiting for the
drive. Data written before the call with `fs.writeFile` or `fs.appendFile` is already in the
operating system's cache (a `file` handle's buffer must be flushed first), so a process crash
loses nothing; only a power cut before the flush finishes can lose it. An empty path throws
`ValueError`. Otherwise the call only fails when `path` can't be made absolute because the working
directory can't be read, usually with `NotFoundError` because it was deleted. A flush that fails
later is reported by `fs.syncPending` only if it is still queued or running when that is called
(see below); this call never reports it.

The flush opens the file by path when it runs, so it covers everything written before the call.
Relative paths resolve against the working directory at the time of the call. A file removed or
renamed before its flush is skipped. The flush opens the file for reading, so a file the program
can't read fails with `PermissionError`.

```osl
string line = "joined"
if !fs.appendFile("messages.log", line ++ "\n") or !fs.syncLater("messages.log") (
  log "couldn't record the message"
)
```

Flushes start as soon as one is queued, with no added delay. Requests that arrive while a flush is
running wait for the next one, which covers every file queued in the meantime, and repeated
requests for the same file in that time become one flush. On macOS that group shares a single full
disk flush (see [batching](#automatic-durable-write-batching-on-macos)).

#### `fs.syncPending()` → `result<unit, error>`
Blocks until every flush queued by `fs.syncLater` before the call has completed. Fails with the
first error among those flushes, usually an `IOError` or `PermissionError`. Only flushes that are
still queued or running when `fs.syncPending()` is called are reported: a flush that already
finished and failed is not reported anywhere.

The runtime does not drain pending flushes when the program ends, whether by finishing, `exit`,
`process.exit`, a panic, or a signal. Call `fs.syncPending()` before a planned shutdown when the
last writes must reach the drive.

```osl
fs.syncPending() catch (err) (
  log "last writes may not be on disk: " ++ err.message
  exit 1
)
exit 0
```

### Automatic durable write batching on macOS

Durable `writeFile` and `writeFileBytes` calls, the deprecated `tryWriteFile`, `syncFile`, and
`syncLater` flushes automatically share full disk flushes when they reach the runtime concurrently on
the same filesystem. No options, settings, or application changes are required. Every one of those
calls except `syncLater` keeps its file-sync guarantee: it returns only after its durability barrier
completes.

A single pending write uses Go's `File.Sync` directly. For a group, the runtime first calls ordinary
`fsync` on every file, then calls `File.Sync` on one file to perform the shared full disk flush.
Only after that barrier completes can the atomic writers close and rename their temporary files.
[Apple documents `F_FULLFSYNC`](https://developer.apple.com/library/archive/documentation/System/Conceptual/ManPages_iPhoneOS/man2/fcntl.2.html)
as syncing the file and asking the drive to flush all buffered data to permanent storage.
[Go's macOS implementation](https://go.dev/src/internal/poll/fd_fsync_darwin.go) uses this operation,
with an ordinary `fsync` fallback on `ENOTSUP`.

The runtime groups by filesystem device ID, processes up to 64 requests per group, and yields once
to collect already-concurrent requests. It does not add a timer or return early. Different devices
have independent workers. If a per-file preparation fails, that file falls back to its original
`File.Sync`. If the shared full flush fails, every prepared file falls back to its own `File.Sync`,
so failures remain attached to the affected file. Other operating systems keep the original
per-file sync behavior.

A `writeFile` or `writeFileBytes` call with `durable: false` takes no part in this batching. On macOS
it issues `F_BARRIERFSYNC` on its temporary file before the rename, which orders the write without
waiting for the drive to empty its cache, and falls back to `File.Sync` if the barrier fails. On
other operating systems it calls `File.Sync` like a durable write.

Atomicity and durability remain different guarantees. Every write flushes or barriers the file
contents before rename; none syncs the parent directory after rename. The API therefore does not
guarantee that a new directory entry or replacement survives power loss. Failed writes leave
existing contents unchanged and clean up their temporary files. Readers that already opened a
replaced file can continue reading the old file.

Batching helps overlapping writes. It cannot combine sequential writes whose caller waits for one
to finish before starting the next. Application-wide locks such as OriginChats' `unreads` and
`shard-buffers` locks still serialize their operations, and the runtime cannot safely infer which
files are rebuildable caches or change those locks. No write is made non-durable unless it asks for
`durable: false`.

### Measuring the generated executable

Build the benchmark in the OSL repository and run the executable on the application's filesystem.
`-o` is resolved against the source file's directory, so give it an absolute path:

```sh
go build -o osl .
./osl compile examples/other/fs_write_bench.osl -o "$PWD/fs-write-bench"
./fs-write-bench ./bench-data text 100 1
./fs-write-bench ./bench-data text 100 16
./fs-write-bench ./bench-data cache 100 16
./fs-write-bench ./bench-data bytes 100 16
./fs-write-bench ./bench-data append 100 16
```

Arguments are the directory, API mode, writes per worker, and number of workers. `text` calls
`fs.writeFile`, `cache` calls `fs.writeFile` with `{durable: false}`, `bytes` calls
`fs.writeFileBytes`, and `append` calls `fs.appendFile` followed by `fs.syncFile`. Every mode except
`cache` waits for durability. Each worker repeatedly writes 1 KiB to its own file. Output includes
throughput and mean, p50, p95, and p99 latency in milliseconds. The executable creates
process-specific files and removes them on exit; use a dedicated directory. Compilation time is
excluded. Repeat untraced runs and compare one worker with concurrent workers. Avoid a
memory-backed directory such as Linux `/tmp` when measuring disk latency.

Separately trace the generated executable to count flushes and successful renames. On Linux:

```sh
strace -f -c -e trace=fsync,fdatasync,rename,renameat,renameat2 ./fs-write-bench ./bench-data text 100 1
strace -f -c -e trace=fsync,fdatasync,rename,renameat,renameat2 ./fs-write-bench ./bench-data text 100 16
```

On macOS, where DTrace is permitted, use `sudo dtruss -f ./fs-write-bench ./bench-data text 100 16`.
Count `fcntl` calls with command `51` (`0x33`,
[Apple's `F_FULLFSYNC`](https://github.com/apple-oss-distributions/xnu/blob/main/bsd/sys/fcntl.h)),
command `85` (`0x55`, `F_BARRIERFSYNC`, used by `cache` mode), ordinary `fsync` calls, and renames.
Inspect return values. A successful group uses ordinary per-file syncs and one full flush; isolated
writes use one full flush each. Failed grouping can produce extra calls while falling back. Tracing
adds overhead, so measure latency in separate untraced runs. If system policy prevents DTrace, use
Instruments to profile the generated executable.

The implementation was developed on Linux. Cross-compilation for macOS verifies the platform
code builds; coordinator tests verify barrier ordering, flush counts, device isolation, and failure
fallbacks. These checks do not measure macOS latency or simulate actual power loss. A slow write is
consistent with a durability barrier and does not, by itself, establish a transpilation defect.

## Streaming

For large files, stream instead of loading everything into memory. `fs.lines` iterates over a file
by path. `fs.open` returns a buffered file handle for finer control.

#### `fs.lines(path)` → `result<iter<string>, error>`
Iterates over the file's lines, with line endings (`\n` or `\r\n`) stripped, reading one buffered
chunk at a time. Fails with `NotFoundError` when the file doesn't exist. A read error part way
through throws `IOError` from the loop. The file closes when the loop finishes or stops early.

```osl
if fs.isFile("big.log") (
  for line in fs.lines("big.log") (
    log line
  )
)
```

#### `fs.head(path, count?)` / `fs.tail(path, count?)` → `result<string[], error>`
Return up to the first or last `count` lines of a file (default 10). `fs.tail` reads backwards from
the end, so a large log costs the same as a small one. Fail with `NotFoundError` when the file
doesn't exist; a negative `count` throws `ValueError`.

#### `fs.grep(path, pattern)` → `result<string[], error>`
Returns the lines of a file that match the regular expression `pattern`. Fails with `NotFoundError`
when the file doesn't exist and `ParseError` for an invalid pattern.

```osl
string[] recent = fs.tail("app.log", 20).unwrapOr([])
log recent.join("\n")

string[] errors = fs.grep("app.log", "^ERROR").unwrapOr([])
for line in errors ( log line )
```

#### `fs.open(path, {mode}?)` → `result<*fs.File, error>`
Opens a file and returns a buffered handle. Close it when you're done.

| Option | Default | Meaning |
| --- | --- | --- |
| `mode` | `"r"` | `"r"` reads. `"w"` writes from the start, creating or truncating the file. `"a"` appends, creating the file if needed. |

Fails with `NotFoundError` when a file opened for reading, or the parent directory of a file opened
for writing, doesn't exist, `PermissionError`, or `IOError`. Any other mode throws `ValueError`.

```osl
*fs.File f = fs.open("big.log") catch (err) (
  log "can't open big.log: " ++ err.message
  exit 1
)
for line in f.lines() (
  log line
)
void f.close()
```

```osl
*fs.File out = fs.open("out.txt", {mode: "w"}).unwrap()
for i 1000 (
  void out.write("row " ++ i ++ "\n")
)
if !out.close() (
  log "couldn't finish out.txt"
)
```

#### `fs.openText(text)` → `*fs.File`
Returns a read-only handle over a string, so text you already hold can be read with the same
methods as a file. Writing to it throws `StateError`.

### File handle methods

A handle opened with mode `"r"`, or made by `fs.openText`, only reads; one opened with `"w"` or
`"a"` only writes. Calling a read method on a write handle, a write method on a read handle, or any
method except `eof` and `close` on a closed handle throws `StateError`.

#### `file.read(count?)` → `result<string, error>`
Reads at most `count` bytes from the current position, or everything that is left when called with
no argument. Returns `""` at the end of the file. A negative `count` throws `ValueError`; a read
failure fails with `IOError`.

```osl
*fs.File f = fs.open("data.bin").unwrap()
while !f.eof() (
  string chunk = f.read(65536).unwrap()
  log chunk.len
)
void f.close()
```

#### `file.readBytes(count?)` → `result<byte[], error>`
Like `file.read`, but returns bytes.

#### `file.readLine()` → `result<string, error>`
Reads the next line with its line ending stripped. A blank line returns `""`. At the end of the
file it fails with `IOError`, so check `file.eof()` first or loop with `file.lines()`.

#### `file.lines()` → `iter<string>`
Iterates over the remaining lines, without line endings. A read error throws `IOError` from the
loop.

#### `file.eof()` → `boolean`
Reports whether there is nothing left to read. A closed or write-only handle has nothing to read,
so it returns `true`.

#### `file.head(count?)` → `result<string[], error>`
Reads up to the next `count` lines (default 10) from the current position. On a fresh handle that's
the first `count` lines, read without touching the rest of the file.

#### `file.tail(count?)` → `result<string[], error>`
Returns the last `count` lines (default 10) of the whole file, reading backwards from the end in
64&nbsp;KB chunks. A multi-gigabyte log costs the same as a tiny one. It does not move the read
position, so you can `tail` and then still read from the top.

#### `file.grep(pattern)` → `result<string[], error>`
Reads the rest of the file and returns the lines matching the regular expression `pattern`. Only
matching lines are held in memory. Fails with `ParseError` for an invalid pattern.

```osl
*fs.File f = fs.open("app.log").unwrap()
string[] errors = f.grep("^ERROR").unwrapOr([])
void f.close()
log errors.len
```

#### `file.write(data)` → `result<unit, error>`
Buffers `data` at the current position: a string, a `byte[]`, or an array of whole numbers from 0
to 255; numbers and other plain values are written as their string form, and `null` throws
`TypeError`. Data reaches the file when the buffer fills,
on `flush()`, and on `close()`, so a write error can surface on a later call. A number outside 0 to
255 throws `ValueError`.

#### `file.flush()` → `result<unit, error>`
Drains the userspace write buffer to the operating system without closing. It does not call
`File.Sync` or provide a durability barrier; use `fs.syncFile(path)` after closing for that.

#### `file.close()` → `result<unit, error>`
Flushes any buffered writes and closes the file. Fails with `IOError` when the final flush fails.
Closing an already closed handle does nothing and succeeds. Always close a handle when you're done.

## Files and directories

#### `fs.exists(path)` → `boolean`
Reports whether something exists at `path`, following symlinks. A broken symlink counts as missing.

#### `fs.isFile(path)` → `boolean`
Reports whether `path` is a regular file, following symlinks.

#### `fs.isDir(path)` → `boolean`
Reports whether `path` is a directory, following symlinks. Missing paths return `false`.

#### `fs.remove(path, {force}?)` → `result<unit, error>`
Deletes a file, or a directory and everything in it. A symlink is removed, not its target. Fails
with `NotFoundError` when nothing exists at `path`, so used as a boolean it is `true` only when
something was removed, and with `PermissionError` or `IOError` when something can't be deleted.

| Option | Default | Meaning |
| --- | --- | --- |
| `force` | `false` | Succeed without doing anything when `path` doesn't exist, like `rm -rf`. |

```osl
void fs.remove("build", {force: true})

if fs.remove("stale.lock") (
  log "removed the stale lock"
)
```

#### `fs.rename(from, to)` → `result<unit, error>`
Moves or renames a file or directory, replacing an existing file at `to`. Fails with
`NotFoundError` when `from` doesn't exist, `PermissionError`, or `IOError`, for example when `to` is
on another device.

#### `fs.mkdir(path, {recursive}?)` → `result<unit, error>`
Creates a directory. Fails with `NotFoundError` when a parent is missing, `IOError` when `path`
already exists, or `PermissionError`.

| Option | Default | Meaning |
| --- | --- | --- |
| `recursive` | `false` | Also create missing parents, and succeed when the directory already exists. |

```osl
if !fs.mkdir("out/logs", {recursive: true}) (
  log "couldn't create out/logs"
)
```

#### `fs.copy(from, to, {overwrite}?)` → `result<unit, error>`
Copies a file, or a directory and everything in it, to `to`, streaming so large files aren't
loaded into memory. Copied files keep their permissions; directories are created with their source
permissions plus owner access, subject to the umask. Symlinks are followed, so a link is copied as
the contents it points to, a broken link stops the copy with `NotFoundError`, and a link back up the
tree recurses until it fails. Copying a directory onto an existing directory merges
into it. Fails with `NotFoundError` when `from` doesn't exist, and with `IOError` when a destination
file already exists. Copying a directory into itself throws `ValueError`. A copy that fails part way
through leaves what it already copied.

| Option | Default | Meaning |
| --- | --- | --- |
| `overwrite` | `false` | Replace files that already exist at the destination. |

```osl
if !fs.copy("assets", "dist/assets", {overwrite: true}) (
  log "copy failed"
)
```

#### `fs.readDir(path)` → `result<string[], error>`
Lists the names of the entries directly inside `path`, sorted by name. Fails with `NotFoundError`
when the directory doesn't exist, `PermissionError`, or `IOError` when `path` isn't a directory.

```osl
if fs.isDir(".") (
  for name in fs.readDir(".") (
    log name
  )
)
```

#### `fs.entries(path)` → `result<entry[], error>`
Lists the entries directly inside `path` as [entry records](#entry-records), sorted by name. Each
`path` is the directory joined with the entry's name. Fails like `fs.readDir`. An entry removed
while the list is being built is left out.

```osl
auto listing = fs.entries("src")
if listing.isOk() (
  for entry in listing.unwrap() (
    if !entry.isDir ( log entry.name ++ " " ++ entry.size ++ " bytes" )
  )
)
```

#### `fs.glob(pattern)` → `result<string[], error>`
Lists the paths matching a shell pattern such as `"src/*.osl"`, in lexical order, or `[]` when
nothing matches. `*` and `?` match within one path element and `[a-z]` matches a range; `**` is not
special. Fails with `ParseError` for a malformed pattern.

#### `fs.walkTree(path)` → `iter<entry>`
Visits everything below a directory, depth first in lexical order, yielding
[entry records](#entry-records). The root itself is not included. It does not follow symlinks: a
symlink to a directory is yielded with `isSymlink` and `isDir` both `true`, but its contents are not
visited. A missing or unreadable root or subdirectory throws `NotFoundError`, `PermissionError` or
`IOError` from the loop that is iterating. Guard the root with `fs.isDir`, or collect it as a
result with `try(fs.walkTree(path).toArray())`. A root that is a file, or a symlink to a directory,
yields nothing; `fs.isDir` follows symlinks, so it doesn't catch the second case. Like any iterator it can be chained, for example
`fs.walkTree("src").filter(e -> e.ext == ".osl").toArray()`.

```osl
if fs.isDir("src") (
  for entry in fs.walkTree("src") (
    if entry.ext == ".osl" ( log entry.path )
  )
)
```

### Entry records

`fs.stat`, `fs.entries` and `fs.walkTree` describe each file, directory or symlink with the same
record. It is a record shape, not a named type, so hold one in an `auto` or `object` variable.

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | The last element of the path. |
| `path` | `string` | The path the entry was found at. |
| `ext` | `string` | The extension of `name`, with its dot, or `""`. |
| `isDir` | `boolean` | Whether it is a directory, following symlinks. |
| `isSymlink` | `boolean` | Whether the path itself is a symlink. |
| `size` | `int` | Size in bytes, following symlinks. |
| `modTime` | `int` | Last modification time in Unix milliseconds, following symlinks. |
| `mode` | `string` | Permission bits and type, such as `"-rw-r--r--"`. |

A symlink reports its target's type, size and times, with `isSymlink` `true`. A broken symlink
reports the link itself.

## File metadata

#### `fs.stat(path)` → `result<entry, error>`
Describes the file, directory or symlink at `path` as an [entry record](#entry-records). Fails with
`NotFoundError` when nothing exists at `path`. A broken symlink still succeeds and describes the
link.

```osl
if fs.exists("notes.txt") (
  object info = fs.stat("notes.txt")
  log info.size
)
```

#### `fs.size(path)` → `result<int, error>`
Returns the file's size in bytes, following symlinks. Fails with `NotFoundError` when the file
doesn't exist.

#### `fs.modTime(path)` → `result<int, error>`
Returns when the file was last modified, in Unix milliseconds, following symlinks. Fails with
`NotFoundError` when the file doesn't exist.

#### `fs.evalSymlinks(path)` → `result<string, error>`
Resolves every symlink in `path` to a real path. Fails with `NotFoundError` when the path or a link
target doesn't exist.

## Path utilities

Apart from `fs.absPath`, these operate purely on path strings and don't touch the filesystem.

#### `fs.joinPath(...path)` → `string`
Joins path segments with the OS separator and cleans the result:
`fs.joinPath("a", "b", "c.txt")` → `"a/b/c.txt"`.

#### `fs.absPath(path)` → `result<string, error>`
Returns `path` as an absolute, cleaned path, resolved against the working directory. Fails when the
working directory can't be read, usually with `NotFoundError` because it was deleted.

#### `fs.base(path)` → `string`
The last element of a path: `"/a/b/c.txt"` → `"c.txt"`.

#### `fs.dir(path)` → `string`
Everything but the last element: `"/a/b/c.txt"` → `"/a/b"`.

#### `fs.ext(path)` → `string`
The extension of the last element, including the dot: `"c.txt"` → `".txt"`, and `""` when there is
none.

#### `fs.stem(path)` → `string`
The last element without its extension: `"/a/b/c.txt"` → `"c"`.

#### `fs.cleanPath(path)` → `string`
Returns the shortest equivalent path, resolving `.` and `..` and repeated separators:
`fs.cleanPath("/a//b/./c/..")` → `"/a/b"`.

#### `fs.isAbs(path)` → `boolean`
Reports whether `path` is absolute.

#### `fs.splitPath(path)` → `string[]`
Splits a path after its last separator into `[directory, name]`:
`fs.splitPath("a/b/c.txt")` → `["a/b/", "c.txt"]`.

#### `fs.splitExt(path)` → `string[]`
Splits a path into `[path without extension, extension]`: `fs.splitExt("a/b.txt")` →
`["a/b", ".txt"]`.

#### `fs.segments(path)` → `string[]`
Lists a cleaned path's elements without separators: `fs.segments("/usr/local/bin")` →
`["usr", "local", "bin"]`, and `[]` for `"/"`.

#### `fs.withExt(path, ext)` → `string`
Replaces the extension. The dot is optional and `""` removes it: `fs.withExt("a/b.txt", "md")` →
`"a/b.md"`.

#### `fs.withName(path, name)` → `string`
Replaces the last element: `fs.withName("a/b/c.txt", "d.md")` → `"a/b/d.md"`.

#### `fs.toPosix(path)` → `string`
Converts the OS separators in a path to forward slashes.

#### `fs.relPath(base, target)` → `string`
Returns `target` relative to `base`, with forward slashes: `fs.relPath("/a/b", "/a/b/c")` → `"c"`.
Throws `ValueError` when one path is absolute and the other isn't.

#### `fs.pathStartsWith(path, prefix)` → `boolean`
Reports whether `path` is `prefix` or lies below it, comparing whole elements: `"/a/bc"` does not
start with `"/a/b"`.

```osl
string source = "src/pages/index.osl"
log fs.withExt(fs.joinPath("build", fs.relPath("src", source)), "html")
```

## Deprecated functions

These older functions still work and keep their old behaviour, including returning `""`, `0`,
`false`, `[]` or `null` when something goes wrong instead of a typed error. The compiler reports a
`DeprecationWarning` for each call. Use the replacement in new code.

| Deprecated | Old behaviour | Use instead |
| --- | --- | --- |
| `fs.appendToFile(path, data)` | `boolean` | `fs.appendFile(path, text)` |
| `fs.mkdirAll(path)` | `boolean` | `fs.mkdir(path, {recursive: true})` |
| `fs.copyDir(src, dst)` | `boolean`, overwrites existing files, `false` when `dst` is inside `src` | `fs.copy(from, to)` |
| `fs.readDirAll(path)` | Array of `{name, ext, path, isDir, type}`, `[]` on failure | `fs.entries(path)` |
| `fs.walk(path)` | Array shaped like `readDirAll`, skipping unreadable entries, `[]` on failure | `for entry in fs.walkTree(path)` |
| `fs.walkDir(path, fn)` | Calls `fn(path, file, control)` for `path` and everything below it; setting `control.skip` skips a directory | `for entry in fs.walkTree(path)` |
| `fs.eachLine(path, fn)` | Calls `fn(line)` for each line; does nothing when the file can't be opened | `for line in fs.lines(path)` |
| `fs.getSize(path)` | `number`, `0` on failure | `fs.size(path)` |
| `fs.getModTime(path)` | `number` in Unix milliseconds, `0` on failure | `fs.modTime(path)` |
| `fs.getStat(path)` | `object` with a `success` flag and `modTime` in Unix microseconds | `fs.stat(path)` |
| `fs.getwd()` | `string`, `""` on failure | `process.cwd()` in [process](process.md) |
| `fs.chdir(path)` | `boolean` | `process.chdir(path)` in [process](process.md) |
| `fs.getBase(path)` | `string` | `fs.base(path)` |
| `fs.getDir(path)` | `string` | `fs.dir(path)` |
| `fs.getExt(path)` | `string` | `fs.ext(path)` |
| `fs.getStem(path)` | `string` | `fs.stem(path)` |
| `fs.getParts(path)` | `[base, dir, ext]` | `fs.base(path)`, `fs.dir(path)` and `fs.ext(path)` |
| `fs.tryReadFile(path)` | `result` with a string error | `fs.readFile(path)` |
| `fs.tryWriteFile(path, data)` | `result` holding `true` or a string error; always durable | `fs.writeFile(path, text)` |
| `fs.tryAppendToFile(path, data)` | `result` holding `true` or a string error | `fs.appendFile(path, text)` |
| `fs.tryRename(oldPath, newPath)` | `result` holding `true` or a string error | `fs.rename(from, to)` |
| `fs.tryRemove(path)` | `result` holding `true` or a string error; succeeds for a missing path | `fs.remove(path, {force: true})` |
| `fs.tryMkdirAll(path)` | `result` holding `true` or a string error | `fs.mkdir(path, {recursive: true})` |
| `fs.tryReadDir(path)` | `result` holding names or a string error | `fs.readDir(path)` |
| `fs.create(path)` | Write handle, or `null` on failure | `fs.open(path, {mode: "w"})` |
| `fs.append(path)` | Append handle, or `null` on failure | `fs.open(path, {mode: "a"})` |

## Complete API reference

### `fs`

| Method | Returns | Notes |
| --- | --- | --- |
| `fs.readFile(path: string)` | `result<string, error>` | Reads text. |
| `fs.readFileBytes(path: string)` | `result<byte[], error>` | Reads bytes. |
| `fs.writeFile(path: string, text: string, options?: {durable})` | `result<unit, error>` | Atomic replace; durable by default. |
| `fs.writeFileBytes(path: string, data: any, options?: {durable})` | `result<unit, error>` | Atomic replace with bytes. |
| `fs.appendFile(path: string, text: string)` | `result<unit, error>` | Appends without syncing. |
| `fs.appendFileBytes(path: string, data: any)` | `result<unit, error>` | Appends bytes without syncing. |
| `fs.syncFile(path: string)` | `result<unit, error>` | Flushes an existing file and waits. |
| `fs.syncLater(path: string)` | `result<unit, error>` | Queues a background flush; throws `ValueError` for an empty path. |
| `fs.syncPending()` | `result<unit, error>` | Waits for queued flushes; fails with the first flush error. |
| `fs.lines(path: string)` | `result<iter<string>, error>` | Iterates over lines. |
| `fs.head(path: string, count?: number)` | `result<string[], error>` | First `count` lines (default 10). |
| `fs.tail(path: string, count?: number)` | `result<string[], error>` | Last `count` lines (default 10), read from the end. |
| `fs.grep(path: string, pattern: string)` | `result<string[], error>` | Lines matching a regular expression. |
| `fs.open(path: string, options?: {mode})` | `result<*fs.File, error>` | Opens a buffered handle; `mode` is `"r"`, `"w"` or `"a"`. |
| `fs.openText(text: string)` | `*fs.File` | Read-only handle over a string. |
| `fs.exists(path: string)` | `boolean` |  |
| `fs.isFile(path: string)` | `boolean` |  |
| `fs.isDir(path: string)` | `boolean` |  |
| `fs.remove(path: string, options?: {force})` | `result<unit, error>` | Removes recursively; `NotFoundError` unless `force`. |
| `fs.rename(from: string, to: string)` | `result<unit, error>` |  |
| `fs.mkdir(path: string, options?: {recursive})` | `result<unit, error>` |  |
| `fs.copy(from: string, to: string, options?: {overwrite})` | `result<unit, error>` | Copies files and directory trees. |
| `fs.readDir(path: string)` | `result<string[], error>` | Sorted names. |
| `fs.entries(path: string)` | `result<entry[], error>` | Sorted entry records. |
| `fs.glob(pattern: string)` | `result<string[], error>` | Paths matching a shell pattern. |
| `fs.walkTree(path: string)` | `iter<entry>` | Every entry below a directory; errors throw from the loop. |
| `fs.stat(path: string)` | `result<entry, error>` |  |
| `fs.size(path: string)` | `result<int, error>` | Bytes. |
| `fs.modTime(path: string)` | `result<int, error>` | Unix milliseconds. |
| `fs.evalSymlinks(path: string)` | `result<string, error>` |  |
| `fs.joinPath(...path: any)` | `string` |  |
| `fs.absPath(path: string)` | `result<string, error>` |  |
| `fs.base(path: string)` | `string` |  |
| `fs.dir(path: string)` | `string` |  |
| `fs.ext(path: string)` | `string` |  |
| `fs.stem(path: string)` | `string` |  |
| `fs.cleanPath(path: string)` | `string` |  |
| `fs.isAbs(path: string)` | `boolean` |  |
| `fs.splitPath(path: string)` | `string[]` |  |
| `fs.splitExt(path: string)` | `string[]` |  |
| `fs.segments(path: string)` | `string[]` |  |
| `fs.withExt(path: string, ext: string)` | `string` |  |
| `fs.withName(path: string, name: string)` | `string` |  |
| `fs.toPosix(path: string)` | `string` |  |
| `fs.relPath(base: string, target: string)` | `string` | Throws `ValueError` when only one path is absolute. |
| `fs.pathStartsWith(path: string, prefix: string)` | `boolean` |  |

The [deprecated functions](#deprecated-functions) are listed separately.

### `*fs.File` values

Returned by `fs.open` and `fs.openText`. Methods throw `StateError` on a closed handle or one open
in the other mode.

| Method | Returns | Notes |
| --- | --- | --- |
| `file.read(count?: number)` | `result<string, error>` | Next `count` bytes, or everything remaining. |
| `file.readBytes(count?: number)` | `result<byte[], error>` | Like `read`, as bytes. |
| `file.readLine()` | `result<string, error>` | Next line, ending stripped; `IOError` at the end of the file. |
| `file.lines()` | `iter<string>` | Remaining lines. |
| `file.eof()` | `boolean` | Whether there is nothing left to read. |
| `file.head(count?: number)` | `result<string[], error>` | Next `count` lines (default 10). |
| `file.tail(count?: number)` | `result<string[], error>` | Last `count` lines of the file, read from the end. |
| `file.grep(pattern: string)` | `result<string[], error>` | Remaining lines matching a regular expression. |
| `file.write(data: any)` | `result<unit, error>` | Buffered write of a string, bytes or byte array. |
| `file.flush()` | `result<unit, error>` | Drains buffered writes to the OS; does not sync. |
| `file.close()` | `result<unit, error>` | Flushes and closes the handle; closing twice succeeds. |

## Notes

- Prefer `import "std:fs"`; the older `import "osl/fs"` spelling remains supported.

## Behavior and limits

`fs.copy` rejects copying a directory into itself. Methods on a closed file handle throw
`StateError` instead of crashing on a null value. Permission and symbolic-link errors are returned
to the caller as typed errors.
