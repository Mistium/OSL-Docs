# fs

> Files, directories and path utilities

The `fs` package reads and writes files, manages directories, and manipulates path strings.

```javascript
import "osl/fs"
```

## Reading & writing files

#### `fs.readFile(path)` → `string`
Returns the entire contents of the file at `path` as a string. Returns an empty string if the file
can't be read - use [`fs.tryReadFile`](#result-returning-variants) if you need to distinguish errors.

```javascript
string text = fs.readFile("notes.txt")
```

#### `fs.readFileBytes(path)` → `bytes`
Returns the file's raw bytes, for binary data. Returns empty bytes on failure.

#### `fs.writeFile(path, data)` → `boolean`
Writes `data` (a string) to `path`, replacing any existing contents and creating the file if needed.
Returns `true` on success.

```javascript
fs.writeFile("out.txt", "hello world")
```

#### `fs.writeFileBytes(path, data)` → `boolean`
Writes raw bytes (a `bytes` value or an array of byte numbers) to `path`. Returns `true` on success.

#### `fs.appendToFile(path, data)` → `boolean`
Appends `data` to the end of `path`, creating the file if it doesn't exist. Returns `true` on success.

## Streaming

For large files, stream instead of loading everything into memory. `fs.open`, `fs.create` and
`fs.append` return a buffered file handle; on failure they return `null`, and every handle method is
null-safe (reads return `""`, writes return `false`), so a missing file can't crash a stream loop.

#### `fs.eachLine(path, fn)` → `void`
The simplest way to stream a file: calls `fn(line)` for every line (line endings stripped), reading
one buffered chunk at a time. Does nothing if the file can't be opened.

```javascript
fs.eachLine("big.log", def(line) -> (
  log line
))
```

#### `fs.head(path, n?)` / `fs.tail(path, n?)` / `fs.grep(path, pattern)` → `array`
One-shot conveniences that open the file, run the matching [file handle method](#file-handle-methods)
and close it. `n` defaults to 10.

```javascript
log fs.tail("app.log", 20).join("\n")
for line fs.grep("app.log", "^ERROR") ( log line )
```

#### `fs.open(path)` → `file`
Opens `path` for buffered reading. Returns `null` if the file can't be opened.

```javascript
auto f = fs.open("big.log")
while !f.eof() (
  log f.readLine()
)
f.close()
```

#### `fs.create(path)` → `file`
Creates (or truncates) `path` and returns a buffered write handle. Returns `null` on failure.

```javascript
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

```javascript
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
chunks — a multi-gigabyte log costs the same as a tiny one. Doesn't move the read position, so you
can `tail` and then still read from the top.

#### `file.grep(pattern)` → `array`
Streams the rest of the file and returns the lines matching `pattern` — a regular expression, or a
plain substring if the pattern doesn't compile as one. Only matching lines are held in memory.

```javascript
auto f = fs.open("app.log")
errors = f.grep("^ERROR")
f.close()
```

#### `file.write(data)` → `boolean`
Buffers `data` (a string, `bytes` value, or array of byte numbers) for writing. Returns `true` on
success. Data is flushed when the buffer fills, on `flush()`, and on `close()`.

#### `file.flush()` → `boolean`
Forces buffered writes to disk without closing — useful for long-lived logs.

#### `file.close()` → `boolean`
Flushes any buffered writes and closes the file. Always call this when done with a handle.

## Files & directories

#### `fs.exists(path)` → `boolean`
Reports whether a file or directory exists at `path`.

#### `fs.isDir(path)` → `boolean`
Reports whether `path` is a directory through the shared stat-or-default path.

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
Returns the names of the entries directly inside `path` through the shared directory-entry mapper.

```javascript
for i fs.readDir(".").len (
  log fs.readDir(".")[i]
)
```

#### `fs.readDirAll(path)` → `array`
Returns the entries inside `path` as objects with details through the same directory-entry mapper.

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
Returns the file's size in bytes through the shared stat-or-default path.

#### `fs.getModTime(path)` → `number`
Returns the file's last-modified time as a Unix timestamp through the shared stat-or-default path.

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

```javascript
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
Lists a directory through the shared entry mapper, returning `ok(names)` or `err(message)`.

## Complete API reference

### `fs`

| Method | Returns | Description |
| --- | --- | --- |
| `fs.readFile(path: any)` | `string` | Reads text, returning an empty string on failure. |
| `fs.readFileBytes(path: any)` | `bytes` | Reads bytes, returning empty bytes on failure. |
| `fs.writeFile(path: any, data: any)` | `boolean` | Writes file. |
| `fs.writeFileBytes(path: any, data: any)` | `boolean` | Writes file bytes. |
| `fs.appendToFile(path: any, data: any)` | `boolean` | Runs the append to file operation. |
| `fs.open(path: any)` | `file` | Opens a buffered read stream, `null` on failure. |
| `fs.create(path: any)` | `file` | Opens a buffered write stream (truncates), `null` on failure. |
| `fs.append(path: any)` | `file` | Opens a buffered append stream, `null` on failure. |
| `fs.eachLine(path: any, fn: function)` | `void` | Calls `fn` for each line of the file. |
| `fs.head(path: any, n?: number)` | `array` | First `n` lines (default 10). |
| `fs.tail(path: any, n?: number)` | `array` | Last `n` lines (default 10), read from the end. |
| `fs.grep(path: any, pattern: any)` | `array` | Lines matching a regex (or substring). |
| `fs.copy(srcPath: any, dstPath: any)` | `boolean` | Streams a file copy; fails if dst exists. |
| `fs.glob(pattern: any)` | `array` | Paths matching a glob pattern. |
| `fs.rename(oldPath: any, newPath: any)` | `boolean` | Runs the rename operation. |
| `fs.exists(path: any)` | `boolean` | Reports whether the value or resource exists. |
| `fs.remove(path: any)` | `boolean` | Removes a value or resource. |
| `fs.mkdir(path: any)` | `boolean` | Runs the mkdir operation. |
| `fs.mkdirAll(path: any)` | `boolean` | Runs the mkdir all operation. |
| `fs.copyDir(srcPath: any, dstPath: any)` | `boolean` | Runs the copy dir operation. |
| `fs.readDir(path: any)` | `array` | Reads dir. |
| `fs.readDirAll(path: any)` | `array` | Reads dir all. |
| `fs.walkDir(path: any, fn: function)` | `void` | Walks a directory tree and calls `fn` for each entry. |
| `fs.walk(path: any)` | `array` | Runs the walk operation. |
| `fs.isDir(path: any)` | `boolean` | Reports whether dir. |
| `fs.getwd()` | `string` | Runs the getwd operation. |
| `fs.chdir(path: any)` | `boolean` | Runs the chdir operation. |
| `fs.joinPath(...path: any)` | `string` | Runs the join path operation. |
| `fs.getBase(path: any)` | `string` | Returns base. |
| `fs.getDir(path: any)` | `string` | Returns dir. |
| `fs.getExt(path: any)` | `string` | Returns ext. |
| `fs.getParts(path: any)` | `array` | Returns parts. |
| `fs.getStem(path: any)` | `string` | Returns stem. |
| `fs.cleanPath(path: any)` | `string` | Runs the clean path operation. |
| `fs.isAbs(path: any)` | `boolean` | Reports whether abs. |
| `fs.splitPath(path: any)` | `array` | Runs the split path operation. |
| `fs.splitExt(path: any)` | `array` | Runs the split ext operation. |
| `fs.segments(path: any)` | `array` | Runs the segments operation. |
| `fs.withExt(path: any, ext: any)` | `string` | Runs the with ext operation. |
| `fs.withName(path: any, name: any)` | `string` | Runs the with name operation. |
| `fs.toPosix(path: any)` | `string` | Converts to posix. |
| `fs.relPath(base: any, target: any)` | `string` | Runs the rel path operation. |
| `fs.pathStartsWith(path: any, prefix: any)` | `boolean` | Runs the path starts with operation. |
| `fs.getSize(path: any)` | `number` | Returns size. |
| `fs.getModTime(path: any)` | `number` | Returns mod time. |
| `fs.getStat(path: any)` | `object` | Returns stat. |
| `fs.evalSymlinks(path: any)` | `string` | Runs the eval symlinks operation. |
| `fs.tryReadFile(path: any)` | `*Result` | Runs the try read file operation. |
| `fs.tryWriteFile(path: any, data: any)` | `*Result` | Runs the try write file operation. |
| `fs.tryAppendToFile(path: any, data: any)` | `*Result` | Runs the try append to file operation. |
| `fs.tryRename(oldPath: any, newPath: any)` | `*Result` | Runs the try rename operation. |
| `fs.tryRemove(path: any)` | `*Result` | Runs the try remove operation. |
| `fs.tryMkdirAll(path: any)` | `*Result` | Runs the try mkdir all operation. |
| `fs.tryReadDir(path: any)` | `*Result` | Runs the try read dir operation. |

### `file` (stream handle)

Returned by `fs.open`, `fs.create` and `fs.append`; `null` on failure, and all methods are safe to
call on a failed handle.

| Method | Returns | Description |
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

- Standard-library imports accept both `import "osl/fs"` and `import "fs"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Recursive copies reject copying a directory into itself. Reads are bounded,
append variants share one file-opening path, buffered handles share one
constructor, walk callbacks accept OSL functions, closed handles are null-safe,
and symlink and permission failures return controlled results.
