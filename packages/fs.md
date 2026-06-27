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

## Files & directories

#### `fs.exists(path)` → `boolean`
Reports whether a file or directory exists at `path`.

#### `fs.isDir(path)` → `boolean`
Reports whether `path` is a directory.

#### `fs.remove(path)` → `boolean`
Deletes the file or directory at `path` (directories are removed recursively). Returns `true` on
success.

#### `fs.rename(oldPath, newPath)` → `boolean`
Renames or moves `oldPath` to `newPath`. Returns `true` on success.

#### `fs.mkdir(path)` → `boolean`
Creates a single directory. Fails if the parent directory doesn't exist.

#### `fs.mkdirAll(path)` → `boolean`
Creates `path` and any missing parent directories.

#### `fs.copyDir(srcPath, dstPath)` → `boolean`
Recursively copies the directory `srcPath` to `dstPath`.

#### `fs.readDir(path)` → `array`
Returns the names of the entries directly inside `path`.

```javascript
for i fs.readDir(".").len (
  log fs.readDir(".")[i]
)
```

#### `fs.readDirAll(path)` → `array`
Returns the entries inside `path` as objects with details (name, size, isDir, …).

#### `fs.walk(path)` → `array`
Recursively walks `path` and returns every file and directory beneath it.

#### `fs.getwd()` → `string`
Returns the current working directory.

#### `fs.chdir(path)` → `boolean`
Changes the current working directory to `path`.

## File metadata

#### `fs.getSize(path)` → `number`
Returns the file's size in bytes.

#### `fs.getModTime(path)` → `number`
Returns the file's last-modified time as a Unix timestamp.

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
Lists a directory, returning `ok(names)` or `err(message)`.

## Complete API reference

### `fs`

| Method | Returns | Description |
| --- | --- | --- |
| `fs.readFile(path: any)` | `string` | Reads file. |
| `fs.readFileBytes(path: any)` | `bytes` | Reads file bytes. |
| `fs.writeFile(path: any, data: any)` | `boolean` | Writes file. |
| `fs.writeFileBytes(path: any, data: any)` | `boolean` | Writes file bytes. |
| `fs.appendToFile(path: any, data: any)` | `boolean` | Runs the append to file operation. |
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

## Notes

- Standard-library imports accept both `import "osl/fs"` and `import "fs"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
