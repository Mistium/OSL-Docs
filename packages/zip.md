# zip

Use `zip` for ZIP, TAR, and GZIP archives, compressed strings, listing archive contents, and extracting individual files.

```osl
import "std:zip"
```

## Example

```osl
import "std:zip"

zip.compress("dist", "dist.zip")
log zip.list("dist.zip")
```

## API reference

### `zip`

| Method | Returns | Notes |
| --- | --- | --- |
| `zip.compress(sourcePath: any, outputPath: any)` | `boolean` |  |
| `zip.decompress(zipPath: any, outputPath: any)` | `boolean` | Extracts a ZIP archive. Entries that escape `outputPath` are rejected. |
| `zip.decompressLimited(zipPath: any, outputPath: any, maxBytes: number, maxFiles: number)` | `boolean` | Extracts an archive while enforcing total expanded-byte and entry-count limits. |
| `zip.list(zipPath: any)` | `any` | Lists archive entry metadata. |
| `zip.tar(sourcePath: any, outputPath: any)` | `boolean` |  |
| `zip.untar(tarPath: any, outputPath: any)` | `boolean` | Extracts a tar archive into outputPath. Entries whose names would escape outputPath (path traversal) are skipped. |
| `zip.gzip(sourcePath: any, outputPath: any)` | `boolean` | Compresses a file with GZIP. |
| `zip.gzipLimited(sourcePath: any, outputPath: any, maxInputBytes: number, maxOutputBytes: number)` | `boolean` | Gzips a file while enforcing input and compressed-output limits. Removes an oversized output. |
| `zip.gunzip(sourcePath: any, outputPath: any)` | `boolean` | Decompresses a GZIP file. |
| `zip.compressString(data: any)` | `string` |  |
| `zip.decompressString(data: any)` | `string` |  |
| `zip.fileInfo(zipPath: any, filePath: any)` | `any` | Returns metadata for one archive entry. |
| `zip.extractFile(zipPath: any, filePath: any, outputPath: any)` | `boolean` | Extracts one archive entry. |
| `zip.addFile(zipPath: any, filePath: any)` | `boolean` | Atomically rewrites the archive and adds a file or directory tree using the same traversal as `compress`. |
| `zip.removeFile(zipPath: any, filePath: any)` | `boolean` | Atomically rewrites the archive without the named entry. |
| `zip.copyFile(sourcePath: string, outputPath: string)` | `boolean` | Copies a file without compression. |
| `zip.create(path: string)` | `boolean` |  |
| `zip.statistics(zipPath: any)` | `any` | Returns archive entry and size totals. |
| `zip.gunzipLimited(sourcePath: any, outputPath: any, maxOutputBytes: any)` | `boolean` | Decompresses with an output-size limit and removes partial output on failure. |

## Notes

- Prefer `import "std:zip"`; the older `import "osl/zip"` spelling remains supported.

## Behavior and limits

ZIP and TAR extraction reject path traversal and escapes through symbolic links, including when the
destination is the current directory. Before writing, extraction rejects duplicate paths and
file/directory conflicts. Corrupt or truncated archives, size-limit failures, and write errors
remove partial output. Limited GZIP extraction stops at the requested byte limit. Empty archives
remain valid.
