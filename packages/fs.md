# fs

The `fs` package reads and writes files, manages directories, and manipulates path strings.

```osl
import "std:fs"
```

## Reading & writing files

#### `fs.readFile(path)` → `string`
Returns the entire contents of the file at `path` as a string. Returns an empty string if the file
can't be read - use [`fs.tryReadFile`](#result-returning-variants) if you need to distinguish errors.

```osl
string text = fs.readFile("notes.txt")
```

#### `fs.readFileBytes(path)` → `byte[]`
Returns the file's raw bytes, for binary data. Returns empty bytes on failure.

```osl
byte[] body = fs.readFileBytes("image.png")
```

#### `fs.writeFile(path, data)` → `boolean`
Writes `data` (a string) to `path`, replacing any existing contents and creating the file if needed.
The replacement is atomic: data is written to a temporary file in the same directory and renamed
only after the complete file has been flushed and closed. A failed write leaves an existing file
unchanged and removes the temporary file. Returns `true` on success.

```osl
fs.writeFile("out.txt", "hello world")
```

#### `fs.writeFileBytes(path, data)` → `boolean`
Writes a `byte[]` or an array of byte numbers to `path` with the same atomic
replacement guarantees as `fs.writeFile`. Returns `true` on success.

#### `fs.appendToFile(path, data)` → `boolean`
Appends `data` to the end of `path`, creating the file if it doesn't exist. Returns `true` on success.

## Streaming

For large files, stream instead of loading everything into memory. `fs.open`, `fs.create` and
`fs.append` return a buffered file handle; on failure they return `null`, and every handle method is
null-safe (reads return `""`, writes return `false`), so a missing file can't crash a stream loop.

#### `fs.eachLine(path, fn)` → `void`
The simplest way to stream a file: calls `fn(line)` for every line (line endings stripped), reading
one buffered chunk at a time. Does nothing if the file can't be opened.

```osl
fs.eachLine("big.log", def(line) -> (
  log line
))
```

#### `fs.head(path, n?)` / `fs.tail(path, n?)` / `fs.grep(path, pattern)` → `array`
One-shot conveniences that open the file, run the matching [file handle method](#file-handle-methods)
and close it. `n` defaults to 10.

```osl
log fs.tail("app.log", 20).join("\n")
for line in fs.grep("app.log", "^ERROR") ( log line )
```

#### `fs.open(path)` → `file`
Opens `path` for buffered reading. Returns `null` if the file can't be opened.

```osl
auto f = fs.open("big.log")
while !f.eof() (
  log f.readLine()
)
f.close()
```

#### `fs.create(path)` → `file`
Creates (or truncates) `path` and returns a buffered write handle. Returns `null` on failure.

```osl
auto out = fs.create("out.txt")
for i 1000 (
  out.write("row " + i + "\n")
)
out.close() // flushes automatically
```

#### `fs.append(path)` → `file`
Like `fs.create` but appends to the end of `path`, creating it if needed.

### File handle methods

#### `file.readLine()` → `string`
Returns the next line with its line ending stripped, or `""` at end of file. A blank line also
returns `""`, so loop on `file.eof()` rather than on the return value.

#### `file.read(n?)` → `string`
Returns the next `n` bytes, or everything remaining when called with no argument. Returns `""` at
end of file.

```osl
auto f = fs.open("data.bin")
while !f.eof() (
  chunk = f.read(65536)
  // process chunk
)
f.close()
```

#### `file.eof()` → `boolean`
Reports whether the read handle has reached the end of the file. `true` for write handles and failed
opens.

#### `file.head(n?)` → `array`
Returns the next `n` lines (default 10) from the current position, stopping early at end of file. On
a fresh handle that's the first `n` lines, read without touching the rest of the file.

#### `file.tail(n?)` → `array`
Returns the last `n` lines (default 10) of the file, reading backwards from the end in 64&nbsp;KB
chunks. A multi-gigabyte log costs the same as a tiny one. It does not move the read position, so you
can `tail` and then still read from the top.

#### `file.grep(pattern)` → `array`
Streams the rest of the file and returns lines matching `pattern`. Pass a regular expression or a
plain substring if the pattern doesn't compile as one. Only matching lines are held in memory.

```osl
auto f = fs.open("app.log")
errors = f.grep("^ERROR")
f.close()
```

#### `file.write(data)` → `boolean`
Buffers `data` as a string, `byte[]`, or array of byte numbers. Returns `true` on
success. Data is flushed when the buffer fills, on `flush()`, and on `close()`.

#### `file.flush()` → `boolean`
Forces buffered writes to disk without closing. Use it for long-lived logs.

#### `file.close()` → `boolean`
Flushes any buffered writes and closes the file. Always call this when done with a handle.

## Files & directories

#### `fs.exists(path)` → `boolean`
Reports whether a file or directory exists at `path`.

#### `fs.isDir(path)` → `boolean`
Reports whether `path` is a directory. Missing paths return `false`.

#### `fs.remove(path)` → `boolean`
Deletes the file or directory at `path` (directories are removed recursively). Returns `true` on
success.

#### `fs.rename(oldPath, newPath)` → `boolean`
Renames or moves `oldPath` to `newPath`. Returns `true` on success.

#### `fs.mkdir(path)` → `boolean`
Creates a single directory. Fails if the parent directory doesn't exist.

#### `fs.mkdirAll(path)` → `boolean`
Creates `path` and any missing parent directories.

#### `fs.copy(srcPath, dstPath)` → `boolean`
Copies the file `srcPath` to `dstPath`, streaming so large files aren't loaded into memory and
preserving the file's permissions. Fails if `dstPath` already exists.

#### `fs.copyDir(srcPath, dstPath)` → `boolean`
Recursively copies the directory `srcPath` to `dstPath`.

#### `fs.readDir(path)` → `array`
Returns the names of entries directly inside `path`.

```osl
for i fs.readDir(".").len (
  log fs.readDir(".")[i]
)
```

#### `fs.readDirAll(path)` → `array`
Returns entries inside `path` as objects with names, paths, extensions, and types.

#### `fs.glob(pattern)` → `array`
Returns the paths matching a shell glob pattern, e.g. `fs.glob("src/*.osl")`.

#### `fs.walk(path)` → `array`
Recursively walks `path` and returns every file and directory beneath it.

#### `fs.getwd()` → `string`
Returns the current working directory.

#### `fs.chdir(path)` → `boolean`
Changes the current working directory to `path`.

## File metadata

#### `fs.getSize(path)` → `number`
Returns the file's size in bytes, or `0` when it cannot be read.

#### `fs.getModTime(path)` → `number`
Returns the last-modified Unix timestamp, or `0` when it cannot be read.

#### `fs.getStat(path)` → `object`
Returns an object describing the file: size, modification time, whether it's a directory, and so on.

#### `fs.evalSymlinks(path)` → `string`
Resolves any symbolic links in `path` to a real path.

## Path utilities

These operate purely on path strings - they don't touch the filesystem.

#### `fs.joinPath(...path)` → `string`
Joins path segments with the OS separator: `fs.joinPath("a", "b", "c.txt")` → `a/b/c.txt`.

#### `fs.getBase(path)` → `string`
The final element of a path: `"/a/b/c.txt"` → `"c.txt"`.

#### `fs.getDir(path)` → `string`
Everything but the final element: `"/a/b/c.txt"` → `"/a/b"`.

#### `fs.getExt(path)` → `string`
The file extension, including the dot: `"c.txt"` → `".txt"`.

#### `fs.getStem(path)` → `string`
The base name without its extension: `"/a/b/c.txt"` → `"c"`.

#### `fs.getParts(path)` → `array`
Splits a path into its components.

#### `fs.cleanPath(path)` → `string`
Normalises a path, resolving `.` and `..` segments.

> **Note:** passing a path literal that contains `..` directly to a call (e.g.
> `fs.cleanPath("/x/../y")`) is currently mishandled by the compiler. Assign it to a variable first:
> `s = "/x/../y"` then `fs.cleanPath(s)`.

#### `fs.isAbs(path)` → `boolean`
Reports whether `path` is absolute.

#### `fs.splitPath(path)` → `array`
Splits a path into `[directory, file]`.

#### `fs.splitExt(path)` → `array`
Splits a path into `[nameWithoutExt, extension]`.

#### `fs.segments(path)` → `array`
Returns the non-empty path segments.

#### `fs.withExt(path, ext)` → `string`
Returns `path` with its extension replaced by `ext`.

#### `fs.withName(path, name)` → `string`
Returns `path` with its final element replaced by `name`.

#### `fs.toPosix(path)` → `string`
Converts OS-specific separators to forward slashes.

#### `fs.relPath(base, target)` → `string`
Returns the path of `target` relative to `base`.

#### `fs.pathStartsWith(path, prefix)` → `boolean`
Reports whether `path` begins with the path `prefix`.

## Result-returning variants

These mirror the methods above but return a [`result`](result.md) instead of a bare value, so you can
handle errors explicitly rather than checking for `""`/`false`.

#### `fs.tryReadFile(path)` → `result`
Reads a file, returning `ok(contents)` or `err(message)`.

```osl
auto r = fs.tryReadFile("config.json")
if r.isOk() (
  log r.unwrap()
) else (
  log "couldn't read config: " ++ r.unwrapErr()
)

// or with a fallback
string body = fs.tryReadFile("config.json").unwrapOr("{}")
```

#### `fs.tryWriteFile(path, data)` → `result`
Writes a string, returning `ok(true)` or `err(message)`.

#### `fs.tryAppendToFile(path, data)` → `result`
Appends to a file, returning `ok(true)` or `err(message)`.

#### `fs.tryRename(oldPath, newPath)` → `result`
Renames/moves a path, returning `ok(true)` or `err(message)`.

#### `fs.tryRemove(path)` → `result`
Deletes a path, returning `ok(true)` or `err(message)`.

#### `fs.tryMkdirAll(path)` → `result`
Creates directories, returning `ok(true)` or `err(message)`.

#### `fs.tryReadDir(path)` → `result`
Lists a directory, returning `ok(names)` or `err(message)`.

## Complete API reference

### `fs`

| Method | Returns | Notes |
| --- | --- | --- |
| `fs.readFile(path: any)` | `string` | Reads text, returning an empty string on failure. |
| `fs.readFileBytes(path: any)` | `byte[]` | Reads bytes, returning an empty byte array on failure. |
| `fs.writeFile(path: any, data: any)` | `boolean` | Writes file. |
| `fs.writeFileBytes(path: any, data: any)` | `boolean` | Writes file bytes. |
| `fs.appendToFile(path: any, data: any)` | `boolean` |  |
| `fs.open(path: any)` | `file` | Opens a buffered read stream, `null` on failure. |
| `fs.create(path: any)` | `file` | Opens a buffered write stream (truncates), `null` on failure. |
| `fs.append(path: any)` | `file` | Opens a buffered append stream, `null` on failure. |
| `fs.eachLine(path: any, fn: function)` | `void` | Calls `fn` for each line of the file. |
| `fs.head(path: any, n?: number)` | `array` | First `n` lines (default 10). |
| `fs.tail(path: any, n?: number)` | `array` | Last `n` lines (default 10), read from the end. |
| `fs.grep(path: any, pattern: any)` | `array` | Lines matching a regex (or substring). |
| `fs.copy(srcPath: any, dstPath: any)` | `boolean` | Streams a file copy; fails if dst exists. |
| `fs.glob(pattern: any)` | `array` | Paths matching a glob pattern. |
| `fs.rename(oldPath: any, newPath: any)` | `boolean` |  |
| `fs.exists(path: any)` | `boolean` |  |
| `fs.remove(path: any)` | `boolean` | Removes a value or resource. |
| `fs.mkdir(path: any)` | `boolean` |  |
| `fs.mkdirAll(path: any)` | `boolean` |  |
| `fs.copyDir(srcPath: any, dstPath: any)` | `boolean` |  |
| `fs.readDir(path: any)` | `array` | Reads dir. |
| `fs.readDirAll(path: any)` | `array` | Reads dir all. |
| `fs.walkDir(path: any, fn: function)` | `void` | Walks a directory tree and calls `fn` for each entry. |
| `fs.walk(path: any)` | `array` |  |
| `fs.isDir(path: any)` | `boolean` |  |
| `fs.getwd()` | `string` |  |
| `fs.chdir(path: any)` | `boolean` |  |
| `fs.joinPath(...path: any)` | `string` |  |
| `fs.getBase(path: any)` | `string` | Returns base. |
| `fs.getDir(path: any)` | `string` | Returns dir. |
| `fs.getExt(path: any)` | `string` | Returns ext. |
| `fs.getParts(path: any)` | `array` | Returns parts. |
| `fs.getStem(path: any)` | `string` | Returns stem. |
| `fs.cleanPath(path: any)` | `string` |  |
| `fs.isAbs(path: any)` | `boolean` |  |
| `fs.splitPath(path: any)` | `array` |  |
| `fs.splitExt(path: any)` | `array` |  |
| `fs.segments(path: any)` | `array` |  |
| `fs.withExt(path: any, ext: any)` | `string` |  |
| `fs.withName(path: any, name: any)` | `string` |  |
| `fs.toPosix(path: any)` | `string` | Converts to posix. |
| `fs.relPath(base: any, target: any)` | `string` |  |
| `fs.pathStartsWith(path: any, prefix: any)` | `boolean` |  |
| `fs.getSize(path: any)` | `number` | Returns size. |
| `fs.getModTime(path: any)` | `number` | Returns mod time. |
| `fs.getStat(path: any)` | `object` | Returns stat. |
| `fs.evalSymlinks(path: any)` | `string` |  |
| `fs.tryReadFile(path: any)` | `*Result` |  |
| `fs.tryWriteFile(path: any, data: any)` | `*Result` |  |
| `fs.tryAppendToFile(path: any, data: any)` | `*Result` |  |
| `fs.tryRename(oldPath: any, newPath: any)` | `*Result` |  |
| `fs.tryRemove(path: any)` | `*Result` |  |
| `fs.tryMkdirAll(path: any)` | `*Result` |  |
| `fs.tryReadDir(path: any)` | `*Result` |  |

### `file` (stream handle)

Returned by `fs.open`, `fs.create` and `fs.append`; `null` on failure, and all methods are safe to
call on a failed handle.

| Method | Returns | Notes |
| --- | --- | --- |
| `file.read(n?: number)` | `string` | Next `n` bytes, or everything remaining. |
| `file.readLine()` | `string` | Next line, ending stripped. |
| `file.eof()` | `boolean` | Whether the read side is exhausted. |
| `file.head(n?: number)` | `array` | Next `n` lines (default 10). |
| `file.tail(n?: number)` | `array` | Last `n` lines of the file, read from the end. |
| `file.grep(pattern: any)` | `array` | Remaining lines matching a regex (or substring). |
| `file.write(data: any)` | `boolean` | Buffered write of a string, bytes or byte array. |
| `file.flush()` | `boolean` | Forces buffered writes to disk. |
| `file.close()` | `boolean` | Flushes and closes the handle. |

## Notes

- Prefer `import "std:fs"`; the older `import "osl/fs"` spelling remains supported.

## Behavior and limits

`copyDir` rejects attempts to copy a directory into itself. Read helpers cap their allocations.
Methods on a closed file handle return failure values instead of panicking. Walk callbacks accept
OSL functions. Permission and symbolic-link errors are returned to the caller.
