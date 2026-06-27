# zip

> ZIP compression and archive utilities

```javascript
import "osl/zip"
```

## Methods

- `zip.compress(sourcePath, outputPath)` → `boolean`
- `zip.decompress(zipPath, outputPath)` → `boolean`
- `zip.list(zipPath)` → `any`
- `zip.tar(sourcePath, outputPath)` → `boolean`
- `zip.untar(tarPath, outputPath)` → `boolean`
- `zip.gzip(sourcePath, outputPath)` → `boolean`
- `zip.gunzip(sourcePath, outputPath)` → `boolean`
- `zip.compressString(data)` → `string`
- `zip.decompressString(data)` → `string`
- `zip.fileInfo(zipPath, filePath)` → `any`
- `zip.extractFile(zipPath, filePath, outputPath)` → `boolean`
- `zip.addFile(zipPath, filePath)` → `boolean`
- `zip.removeFile(zipPath, filePath)` → `boolean`
- `zip.create(path)` → `boolean`
- `zip.statistics(zipPath)` → `any`
