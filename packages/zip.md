# zip

Use `zip` to create, inspect and extract ZIP and tar archives, and to gzip files and strings.

```osl
import "std:zip"
```

## Example

```osl
import "std:zip"

zip.compress("dist", "dist.zip")

for entry in zip.entries("dist.zip") (
  log entry.name ++ " " ++ entry.size ++ " bytes"
)

zip.decompress("upload.zip", "unpacked", {maxBytes: 100000000, maxFiles: 1000})
```

Every function that reads or writes a file returns a result. Used as a plain statement, a failed
call throws; use `catch` or `try(...)` to handle the error instead:

```osl
zip.decompress("upload.zip", "unpacked", {maxFiles: 1000}) catch (err) (
  log "rejected upload: " ++ err.message
)
```

## ZIP archives

| Function | Returns | Notes |
| --- | --- | --- |
| `zip.compress(path, output)` | `result<unit, error>` | Writes the file or directory at `path` to a new ZIP archive at `output`, named after `path`'s last element. Replaces any file at `output`. |
| `zip.create(path)` | `result<unit, error>` | Writes an empty ZIP archive, replacing any file there, for `addFile` to fill. |
| `zip.entries(path)` | `result<object[], error>` | The archive's members as [entry records](#entry-records). Fails with `ParseError` when `path` isn't a ZIP archive. |
| `zip.decompress(path, output, options?)` | `result<unit, error>` | Extracts the archive into the directory `output`, creating it if needed. Options `maxBytes` (total bytes written) and `maxFiles` (entries), both unlimited by default. |
| `zip.extractFile(path, name, output, options?)` | `result<unit, error>` | Writes the entry `name` to the file `output`, replacing any file there. Option `maxBytes`. Fails with `NotFoundError` when the entry doesn't exist and `ValueError` when it is a directory or larger than `maxBytes`. |
| `zip.addFile(path, file)` | `result<unit, error>` | Adds the file or directory `file` to an existing archive, replacing entries with the same names. |
| `zip.removeFile(path, name)` | `result<unit, error>` | Removes the entry `name`. Removing an entry the archive doesn't have does nothing. |

### Entry records

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | The entry's path in the archive; directories end in `/` |
| `isDir` | `boolean` | Whether it is a directory |
| `size` | `int` | Uncompressed size in bytes |
| `compressedSize` | `int` | Compressed size in bytes |
| `modified` | `int` | Modification time in unix milliseconds |
| `comment` | `string` | The entry's comment, or `""` |

## Tar archives

| Function | Returns | Notes |
| --- | --- | --- |
| `zip.tar(path, output)` | `result<unit, error>` | Writes the file or directory at `path` to a new tar archive at `output`, like `zip.compress`. Only regular files and directories are stored. |
| `zip.untar(path, output, options?)` | `result<unit, error>` | Extracts a tar archive like `zip.decompress`, with the same `maxBytes` and `maxFiles` options. Other entry types, such as links, fail with `UnsupportedError` before anything is written. |

## gzip

| Function | Returns | Notes |
| --- | --- | --- |
| `zip.gzip(path, output, options?)` | `result<unit, error>` | Compresses the file at `path` into a gzip file at `output`. Options `maxInputBytes` (bytes read) and `maxBytes` (bytes written), both unlimited by default. |
| `zip.gunzip(path, output, options?)` | `result<unit, error>` | Decompresses a gzip file into the file `output`. Option `maxBytes` (bytes written). Fails with `ParseError` for data that isn't gzip. |
| `zip.compressString(text)` | `string` | Gzips text and returns it as standard base64, for storing or sending compressed text as a string. |
| `zip.decompressString(text, options?)` | `result<string, error>` | Reverses `compressString`. Option `maxBytes` (size of the result). Fails with `ParseError` when `text` isn't base64 or the bytes aren't gzip data. |

```osl
string packed = zip.compressString("hello hello hello")
log zip.decompressString(packed)
```

## Errors

| Kind | When |
| --- | --- |
| `NotFoundError` | The archive, source file, or entry doesn't exist |
| `ParseError` | Corrupt or non-archive data, or an archive entry that would land outside the output directory |
| `UnsupportedError` | A symbolic link entry, a tar entry that isn't a file or directory, or an unknown compression method |
| `ValueError` | The data passes `maxBytes`, `maxInputBytes` or `maxFiles`. A limit below 1 throws `ValueError`. |
| `PermissionError` | Access denied, or a symbolic link already in the output directory would redirect an entry |
| `IOError` | Any other read or write failure |

## Changes from earlier versions

The `*Limited` functions are gone; pass the limits as options instead, as in
`zip.decompress(path, output, {maxBytes, maxFiles})`,
`zip.gzip(path, output, {maxInputBytes, maxBytes})` and `zip.gunzip(path, output, {maxBytes})`.
`zip.list`, `zip.fileInfo` and `zip.statistics` are replaced by `zip.entries`, and `zip.copyFile` by
`fs.copy`.

## Behavior and limits

The older `import "osl/zip"` spelling still works, with a migration warning.

`decompress` and `untar` check every entry before writing anything. An entry whose path would escape
the output directory, duplicate paths, and file and directory conflicts fail the whole extraction,
rather than being skipped. Extraction never follows a symbolic link out of the output directory,
including when the output is the current directory. If a file fails part way, it is removed, but
files written before it stay.

`compress`, `tar`, `gzip`, `gunzip`, `extractFile`, `addFile` and `removeFile` write to a temporary
file first, so a failed call leaves no partial output and an existing archive unchanged.
