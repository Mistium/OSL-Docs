# torrent

> BitTorrent file sharing utilities

```javascript
import "osl/torrent"
```

## Methods

- `torrent.create(name, files, pieceLength)` → `Torrent`
- `torrent.createFromDirectory(dirPath)` → `Torrent`
- `torrent.save(path)` → `boolean`
- `torrent.parse(torrentData)` → `Torrent`
- `torrent.addTracker(tracker)` → `boolean`
- `torrent.removeTracker(tracker)` → `boolean`
- `torrent.getTrackers()` → `array`
- `torrent.getInfo()` → `object`
- `torrent.addMetadata(key, value)`
- `torrent.getMetadata(key)` → `string`
- `torrent.getAllMetadata()` → `object`
- `torrent.getFileIndex(path)` → `number`
- `torrent.getPieceHashes()` → `array`
- `torrent.setPieceHash(index, hash)` → `boolean`
- `torrent.validate()` → `boolean`
- `torrent.download(torrentPath, outputPath)` → `boolean`
- `torrent.seed(torrentPath, port)` → `boolean`
- `torrent.getMagnetLink()` → `string`
- `torrent.getFiles()` → `array`
- `torrent.setFiles(files)`
- `torrent.getFileCount()` → `number`
- `torrent.getTotalSize()` → `number`
- `torrent.getPieceCount()` → `number`
- `torrent.getMagnetURI()` → `string`
- `torrent.exportInfo(path)` → `boolean`
- `torrent.clone()` → `Torrent`
- `torrent.merge(otherTorrent)` → `Torrent`
- `torrent.strip(metadata)` → `Torrent`
