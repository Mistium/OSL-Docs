# zip

> ZIP / TAR / GZIP compression

Use `zip` for ZIP, TAR, and GZIP archives, compressed strings, listing archive contents, and extracting individual files.

```javascript
import "osl/zip"
```

## Example

```javascript
import "osl/zip"

zip.compress("dist", "dist.zip")
log zip.list("dist.zip")
```

## API reference

### `zip`

| Method | Returns | Description |
| --- | --- | --- |
| `zip.compress(sourcePath: any, outputPath: any)` | `boolean` | Runs the compress operation. |
| `zip.decompress(zipPath: any, outputPath: any)` | `boolean` | Runs the decompress operation. |
| `zip.list(zipPath: any)` | `any` | Runs the list operation. |
| `zip.tar(sourcePath: any, outputPath: any)` | `boolean` | Runs the tar operation. |
| `zip.untar(tarPath: any, outputPath: any)` | `boolean` | Runs the untar operation. |
| `zip.gzip(sourcePath: any, outputPath: any)` | `boolean` | Runs the gzip operation. |
| `zip.gunzip(sourcePath: any, outputPath: any)` | `boolean` | Runs the gunzip operation. |
| `zip.compressString(data: any)` | `string` | Runs the compress string operation. |
| `zip.decompressString(data: any)` | `string` | Runs the decompress string operation. |
| `zip.fileInfo(zipPath: any, filePath: any)` | `any` | Runs the file info operation. |
| `zip.extractFile(zipPath: any, filePath: any, outputPath: any)` | `boolean` | Runs the extract file operation. |
| `zip.addFile(zipPath: any, filePath: any)` | `boolean` | Adds file. |
| `zip.removeFile(zipPath: any, filePath: any)` | `boolean` | Removes file. |
| `zip.create(path: string)` | `boolean` | Creates a new value. |
| `zip.statistics(zipPath: any)` | `any` | Runs the statistics operation. |

## Notes

- Standard-library imports accept both `import "osl/zip"` and `import "zip"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
