# fs

The `fs` package reads and writes files, manages directories, and works with path strings.

```osl
import "std:fs"
```

## Example

```osl
import "std:fs"

fs.mkdir("notes", {recursive: true})
fs.writeFile("notes/today.txt", "buy milk\n")
fs.appendFile("notes/today.txt", "call Sam\n")

log fs.readFile("notes/today.txt")

for entry in fs.entries("notes") (
  log entry.name ++ " " ++ entry.size ++ " bytes"
)
```

## Errors

Every function that touches the disk returns a `result`. Used as a plain value, a result unwraps
itself and throws on failure, so the example above stops at the first failed call. Handle a failure
when you expect one:

```osl
// Fallback value:
string notes = fs.readFile("notes.txt").unwrapOr("")

// Handle the error:
string config = fs.readFile("config.json") catch (err) (
  log "couldn't read config: " ++ err.message
  return
)

// Inspect the error kind:
auto text, err = fs.readFile("missing.txt")
if err != null and err.kind == "NotFoundError" (
  log "no file yet"
)
```

Failures use these error kinds:

| Kind | When |
| --- | --- |
| `NotFoundError` | The file, directory, or a parent directory doesn't exist |
| `PermissionError` | The OS denied access |
| `IOError` | Any other file failure, such as reading a directory as a file or a destination that already exists |
| `ParseError` | A malformed glob pattern or regular expression |
| `StateError` | A file handle was used after `close()`, or in the wrong mode (thrown) |
| `ValueError` | An invalid argument, such as a negative count (thrown) |

Path helpers such as `fs.base` only read the string and never fail.

## Reading and writing files

| Function | Returns | Notes |
| --- | --- | --- |
| `fs.readFile(path)` | `result<string, error>` | Reads the whole file as text. |
| `fs.readFileBytes(path)` | `result<byte[], error>` | Reads the whole file as bytes. |
| `fs.writeFile(path, text)` | `result<unit, error>` | Replaces the file's contents atomically, creating it if needed. |
| `fs.writeFileBytes(path, data)` | `result<unit, error>` | Like `writeFile`, for a `byte[]`, a string (its UTF-8 bytes), or an array of whole numbers from 0 to 255. Throws `ValueError` for a number outside that range. |
| `fs.appendFile(path, text)` | `result<unit, error>` | Adds text to the end of the file, creating it if needed. |
| `fs.appendFileBytes(path, data)` | `result<unit, error>` | Adds bytes to the end of the file. `data` is read like `writeFileBytes` data. |
| `fs.lines(path)` | `result<iter<string>, error>` | Iterates over the file's lines without line endings, reading as it goes. The file closes when the loop finishes. |
| `fs.head(path, count?)` | `result<string[], error>` | Up to the first `count` lines (default 10). |
| `fs.tail(path, count?)` | `result<string[], error>` | Up to the last `count` lines (default 10), read backwards from the end. |
| `fs.grep(path, pattern)` | `result<string[], error>` | Lines matching a regular expression. Fails with `ParseError` for an invalid pattern. |

`writeFile` and `writeFileBytes` write to a temporary file in the same directory and rename it over
the target once it is complete, so readers see the old or the new contents and never a mix. A failed
write leaves the existing file unchanged. An existing file keeps its permissions, and writing through
a symlink replaces the link's target. The write fails with `NotFoundError` when the parent directory
doesn't exist. `appendFile` is not atomic and does not flush to disk.

```osl
for line in fs.lines("big.log") (
  log line
)

log fs.tail("app.log", 20).join("\n")
log fs.grep("app.log", "^ERROR")
```

## Flushing to disk

| Function | Returns | Notes |
| --- | --- | --- |
| `fs.syncFile(path)` | `result<unit, error>` | Flushes a file's written data to disk. Fails with `NotFoundError` when the file doesn't exist; it never creates one. |
| `fs.syncLater(path)` | `result<unit, error>` | Queues a file to be flushed in the background. Repeated requests for one file merge, and a file removed before its flush is skipped. Throws `ValueError` for an empty path. |
| `fs.syncPending()` | `result<unit, error>` | Waits until every file queued with `syncLater` is flushed. Fails with the first flush error. |

Use `syncFile` after `appendFile` when the data must survive a crash. Use `syncLater` and one
`syncPending` call when you write many files and only need them durable at a checkpoint.

`writeFile` and `writeFileBytes` flush the new contents before the rename, but neither syncs the
parent directory afterwards, so a new or replaced directory entry is not guaranteed to survive power
loss.

### Shared flushes on macOS

On macOS, a full flush (`F_FULLFSYNC`) is slow, so concurrent `writeFile`, `writeFileBytes` and
`syncFile` calls on the same filesystem share one. The runtime groups pending flushes by device, up
to 64 at a time: it calls ordinary `fsync` on every file, then one full flush, and only then lets the
atomic writers rename their files. A single pending write uses a full flush directly. If the shared
flush fails, each file falls back to its own full flush, so an error stays with the file it belongs
to. No write returns before its flush completes. Other operating systems flush each file on its
own.

Batching only helps writes that overlap. Sequential writes, where each waits for the last, still
pay for one full flush each.

To measure write latency, build the benchmark from the OSL repository and run it on the filesystem
you care about (not a memory-backed `/tmp`):

```sh
./osl compile examples/other/fs_write_bench.osl -o ./fs-write-bench
./fs-write-bench ./bench-data text 100 1
./fs-write-bench ./bench-data text 100 16
./fs-write-bench ./bench-data bytes 100 16
./fs-write-bench ./bench-data append 100 16
```

The arguments are the directory, the mode (`text`, `bytes`, or `append`, which calls `appendFile`
then `syncFile`), writes per worker, and workers. Each worker writes 1 KiB to its own file, and the
output reports throughput and mean, p50, p95 and p99 latency in milliseconds. To count flushes, trace
the executable: `strace -f -c -e trace=fsync,fdatasync,rename,renameat,renameat2` on Linux, or
`sudo dtruss -f` on macOS, where a full flush is `fcntl` command `51`.

## File handles

`fs.open` returns a buffered `*fs.File` handle for reading or writing a file piece by piece. Close it
when you're done.

| Function | Returns | Notes |
| --- | --- | --- |
| `fs.open(path, options?)` | `result<*fs.File, error>` | Opens a file. Option `mode`: `"r"` (default) reads, `"w"` creates or truncates the file and writes from the start, `"a"` appends, creating the file if needed. Throws `ValueError` for another mode. |
| `fs.openText(text)` | `*fs.File` | A read handle over a string, for reading text the way a file is read. |

```osl
auto out = fs.open("report.txt", {mode: "w"})
for i 1000 (
  out.write("row " ++ i ++ "\n")
)
out.close()

auto f = fs.open("report.txt")
while !f.eof() (
  log f.readLine()
)
f.close()
```

### `*fs.File` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `file.read(count?)` | `result<string, error>` | Everything left, or at most `count` bytes. Returns `""` at the end of the file. |
| `file.readBytes(count?)` | `result<byte[], error>` | Like `read`, as bytes. |
| `file.readLine()` | `result<string, error>` | The next line without its `\n` or `\r\n`. Fails with `IOError` at the end of the file, so check `eof()` first or use `lines()`. |
| `file.lines()` | `iter<string>` | Iterates over the remaining lines. A read error throws `IOError` from the loop. |
| `file.eof()` | `boolean` | Whether there is nothing left to read. Always `true` for a closed or write-only handle. |
| `file.head(count?)` | `result<string[], error>` | Up to `count` lines (default 10) from the current position. |
| `file.tail(count?)` | `result<string[], error>` | The last `count` lines (default 10) of the whole file, without moving the read position. |
| `file.grep(pattern)` | `result<string[], error>` | The remaining lines that match a regular expression. Fails with `ParseError` for an invalid pattern. |
| `file.write(data)` | `result<unit, error>` | Writes a string, a `byte[]`, or an array of whole numbers from 0 to 255. Other values are written as their string form. |
| `file.flush()` | `result<unit, error>` | Writes buffered data to the file. It does not sync to disk; use `fs.syncFile`. |
| `file.close()` | `result<unit, error>` | Flushes buffered writes and closes the file. Closing again does nothing. |

Read methods throw `StateError` on a closed or write-only handle, and write methods on a closed or
read-only handle. Methods that take a count throw `ValueError` for a negative one.

## Files and directories

| Function | Returns | Notes |
| --- | --- | --- |
| `fs.exists(path)` | `boolean` | Whether anything exists at `path`. A broken symlink counts as missing. |
| `fs.isFile(path)` | `boolean` | Whether `path` is a regular file, following symlinks. |
| `fs.isDir(path)` | `boolean` | Whether `path` is a directory, following symlinks. |
| `fs.mkdir(path, options?)` | `result<unit, error>` | Creates a directory. Option `recursive` (default `false`) also creates missing parents and succeeds when the directory already exists. Without it, a missing parent fails with `NotFoundError` and an existing path with `IOError`. |
| `fs.remove(path, options?)` | `result<unit, error>` | Deletes a file, or a directory and everything in it. A symlink is removed, not its target. Fails with `NotFoundError` when nothing is there. Option `force` (default `false`) succeeds without doing anything instead, like `rm -rf`. |
| `fs.rename(from, to)` | `result<unit, error>` | Moves or renames a file or directory, replacing an existing file at `to`. Fails with `IOError` across devices. |
| `fs.copy(from, to, options?)` | `result<unit, error>` | Copies a file, or a directory and everything in it, keeping permissions. An existing destination file fails with `IOError` unless option `overwrite` is `true`. Throws `ValueError` when copying a directory into itself. |
| `fs.readDir(path)` | `result<string[], error>` | The names in a directory, sorted. |
| `fs.entries(path)` | `result<object[], error>` | The entries in a directory, sorted by name, as [entry records](#entry-records). |
| `fs.walkTree(path)` | `iter<object>` | Every entry below a directory as an entry record, depth first in lexical order, without following symlinks. The root itself is not included. A missing or unreadable directory throws from the loop. |
| `fs.glob(pattern)` | `result<string[], error>` | Paths matching a shell pattern such as `"src/*.osl"`, in lexical order. `*` and `?` match within one path element and `[a-z]` matches a range; `**` is not special. |

Used as a condition, a `result<unit, error>` means "did it succeed", so `if fs.remove(path)` is true
only when something was removed.

```osl
for entry in fs.walkTree("src") (
  if !entry.isDir and entry.ext == ".osl" ( log entry.path )
)

fs.remove("build", {force: true})
fs.copy("assets", "build/assets")
```

## File metadata

| Function | Returns | Notes |
| --- | --- | --- |
| `fs.stat(path)` | `result<object, error>` | An [entry record](#entry-records). A symlink describes its target, with `isSymlink` set to `true`. |
| `fs.size(path)` | `result<int, error>` | The size in bytes, following symlinks. |
| `fs.modTime(path)` | `result<int, error>` | The last modification time in unix milliseconds, following symlinks. |
| `fs.evalSymlinks(path)` | `result<string, error>` | The path with every symlink resolved. Fails with `NotFoundError` when the path or a link target doesn't exist. |

### Entry records

`fs.stat`, `fs.entries` and `fs.walkTree` describe a path with this record:

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | The last path element |
| `path` | `string` | The path, joined from the listed directory and `name` |
| `ext` | `string` | The extension with its dot, or `""` |
| `isDir` | `boolean` | Whether it is a directory |
| `isSymlink` | `boolean` | Whether it is a symlink |
| `size` | `int` | Size in bytes |
| `modTime` | `int` | Last modification time in unix milliseconds |
| `mode` | `string` | Permissions, such as `"-rw-r--r--"` |

## Path utilities

These only read the path string and never touch the filesystem, except `absPath`, which reads the
working directory.

| Function | Returns | Example |
| --- | --- | --- |
| `fs.joinPath(...path)` | `string` | `fs.joinPath("a", "b", "c.txt")` is `"a/b/c.txt"` |
| `fs.base(path)` | `string` | `fs.base("a/b/c.txt")` is `"c.txt"` |
| `fs.dir(path)` | `string` | `fs.dir("a/b/c.txt")` is `"a/b"` |
| `fs.ext(path)` | `string` | `fs.ext("a/b/c.txt")` is `".txt"`, `""` when there is none |
| `fs.stem(path)` | `string` | `fs.stem("a/b/c.txt")` is `"c"` |
| `fs.withExt(path, ext)` | `string` | `fs.withExt("a/b.txt", "md")` is `"a/b.md"`; the dot is optional and `""` removes the extension |
| `fs.withName(path, name)` | `string` | `fs.withName("a/b/c.txt", "d.md")` is `"a/b/d.md"` |
| `fs.splitPath(path)` | `string[]` | `fs.splitPath("a/b/c.txt")` is `["a/b/", "c.txt"]` |
| `fs.splitExt(path)` | `string[]` | `fs.splitExt("a/b.txt")` is `["a/b", ".txt"]` |
| `fs.segments(path)` | `string[]` | `fs.segments("/usr/local/bin")` is `["usr", "local", "bin"]` |
| `fs.cleanPath(path)` | `string` | `fs.cleanPath("/a//b/./c")` is `"/a/b/c"`; resolves `.` and `..` |
| `fs.isAbs(path)` | `boolean` | Whether the path is absolute |
| `fs.absPath(path)` | `result<string, error>` | The absolute, cleaned path, resolved against the working directory |
| `fs.relPath(base, target)` | `string` | `fs.relPath("/a/b", "/a/b/c")` is `"c"`, with forward slashes. Throws `ValueError` when one path is absolute and the other isn't. |
| `fs.pathStartsWith(path, prefix)` | `boolean` | Compares whole elements, so `"/a/bc"` does not start with `"/a/b"` |
| `fs.toPosix(path)` | `string` | Converts OS separators to forward slashes |

## Changes from earlier versions

The old `try*` and `get*` functions are gone: `fs.tryReadFile` is now `fs.readFile`,
`fs.getSize` is `fs.size`, and `fs.getBase` is `fs.base`. `fs.mkdirAll(path)` is
`fs.mkdir(path, {recursive: true})`, `fs.walk` and `fs.walkDir` are `fs.walkTree`, `fs.eachLine`
is `fs.lines`, and `fs.create` and `fs.append` are `fs.open` with mode `"w"` or `"a"`. For the
working directory, use `process.cwd()` and `process.chdir(path)`.

## Behavior and limits

The older `import "osl/fs"` spelling still works, with a migration warning.

`fs.copy` streams files, so large files aren't loaded into memory. `fs.remove` without `force`
fails for a missing path, so a cleanup of something that may already be gone should pass
`{force: true}`. `fs.grep` and `file.grep` take a regular expression only; a pattern that doesn't
compile fails with `ParseError` rather than being matched as plain text.
