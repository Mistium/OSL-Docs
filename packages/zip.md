# zip

> ZIP / TAR / GZIP compression

Use `zip` for ZIP, TAR, and GZIP archives, compressed strings, listing archive contents, and extracting individual files.

```javascript
import "std:zip"
```

## Example

```javascript
import "std:zip"

zip.compress("dist", "dist.zip")
log zip.list("dist.zip")
```

## API reference

### `zip`

| Method | Returns | Description |
| --- | --- | --- |
| `zip.compress(sourcePath: any, outputPath: any)` | `boolean` | Runs the compress operation. |
| `zip.decompress(zipPath: any, outputPath: any)` | `boolean` | Extracts through the shared scoped archive reader. Entries whose names would escape outputPath are skipped. |
| `zip.decompressLimited(zipPath: any, outputPath: any, maxBytes: number, maxFiles: number)` | `boolean` | Extracts an archive while enforcing total expanded-byte and entry-count limits. |
| `zip.list(zipPath: any)` | `any` | Lists entry metadata through the shared scoped archive reader. |
| `zip.tar(sourcePath: any, outputPath: any)` | `boolean` | Runs the tar operation. |
| `zip.untar(tarPath: any, outputPath: any)` | `boolean` | Extracts a tar archive into outputPath. Entries whose names would escape outputPath (path traversal) are skipped. |
| `zip.gzip(sourcePath: any, outputPath: any)` | `boolean` | Compresses through the shared checked file-copy path. |
| `zip.gzipLimited(sourcePath: any, outputPath: any, maxInputBytes: number, maxOutputBytes: number)` | `boolean` | Gzips a file while enforcing input and compressed-output limits. Removes an oversized output. |
| `zip.gunzip(sourcePath: any, outputPath: any)` | `boolean` | Decompresses through the shared checked file-copy path. |
| `zip.compressString(data: any)` | `string` | Runs the compress string operation. |
| `zip.decompressString(data: any)` | `string` | Runs the decompress string operation. |
| `zip.fileInfo(zipPath: any, filePath: any)` | `any` | Finds an entry through the shared archive lookup and returns its metadata. |
| `zip.extractFile(zipPath: any, filePath: any, outputPath: any)` | `boolean` | Finds and extracts one entry through the shared archive lookup. |
| `zip.addFile(zipPath: any, filePath: any)` | `boolean` | Atomically rewrites the archive and adds a file or directory tree using the same traversal as `compress`. |
| `zip.removeFile(zipPath: any, filePath: any)` | `boolean` | Atomically rewrites the archive without the named entry. |
| `zip.copyFile(sourcePath: string, outputPath: string)` | `boolean` | Copies a file without compression through the same checked stream path. |
| `zip.create(path: string)` | `boolean` | Creates a new value. |
| `zip.statistics(zipPath: any)` | `any` | Computes archive totals through the shared scoped archive reader. |
| `zip.gunzipLimited(sourcePath: any, outputPath: any, maxOutputBytes: any)` | `boolean` | Decompresses with an output-size limit and removes partial output on failure. |

## Notes

- Prefer `import "std:zip"`; the older `import "osl/zip"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

ZIP, limited ZIP, and TAR extraction share the same resolved-destination checks and reject traversal
and symlink escapes, including when extracting into the current directory. Extraction preflights
normalized entry paths and rejects duplicates or file/directory conflicts before creating the output.
Corrupt/truncated archives, oversized input/output, and write failures remove partial results. ZIP,
TAR, and archive addition share one source-tree traversal; add and remove share one temporary-archive rewrite. Limited GZIP output stops at the configured byte boundary. Empty
archives and statistics remain valid.
