# torrent

Use `torrent` to create, inspect, edit, and serialise torrent metadata.

```osl
import "std:torrent"
```

## API reference

### `torrent`

| Method | Returns | Notes |
| --- | --- | --- |
| `torrent.createFromDirectory(dirPath: any)` | `*Torrent` | Creates from directory. |
| `torrent.parse(torrentData: any)` | `*Torrent` | Parses input data. |

### `Torrent` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.create(name: any, files: array, pieceLength: any)` | `*Torrent` |  |
| `value.save(path: any)` | `boolean` |  |
| `value.addTracker(tracker: any)` | `boolean` | Adds a tracker unless it is already present. |
| `value.removeTracker(tracker: any)` | `boolean` | Removes a tracker. |
| `value.getTrackers()` | `array` | Returns trackers. |
| `value.getInfo()` | `object` | Returns info. |
| `value.addMetadata(key: any, value: any)` | `void` | Adds metadata. |
| `value.getMetadata(key: any)` | `string` | Returns metadata. |
| `value.getAllMetadata()` | `object` | Returns all metadata. |
| `value.getFileIndex(path: any)` | `number` | Returns file index. |
| `value.getPieceHashes()` | `array` | Returns piece hashes. |
| `value.setPieceHash(index: any, hash: any)` | `boolean` | Sets piece hash. |
| `value.validate()` | `boolean` | Validates the current value. |
| `value.download(torrentPath: any, outputPath: any)` | `boolean` | Compatibility method that reports whether the current torrent validates; it does not transfer data. |
| `value.seed(torrentPath: any, port: any)` | `boolean` | Compatibility no-op that returns `true`; it does not transfer data. |
| `value.getMagnetLink()` | `string` | Returns magnet link. |
| `value.calculateInfoHash()` | `string` |  |
| `value.getFiles()` | `array` | Returns files. |
| `value.setFiles(files: array)` | `void` | Sets files. |
| `value.getFileCount()` | `number` | Returns file count. |
| `value.getTotalSize()` | `number` | Returns total size. |
| `value.getPieceCount()` | `number` | Returns piece count. |
| `value.generatePeerID()` | `string` |  |
| `value.getMagnetURI()` | `string` | Returns magnet uri. |
| `value.exportInfo(path: any)` | `boolean` |  |
| `value.clone()` | `*Torrent` | Returns an independent copy of the metadata and file list. |
| `value.merge(otherTorrent: *Torrent)` | `*Torrent` | Returns a copy containing files from both torrents. |
| `value.strip(metadata: any)` | `*Torrent` |  |
| `value.buildTorrent()` | `string` | Builds the bencoded torrent after validating its file and piece metadata. |

## Notes

- Prefer `import "std:torrent"`; the older `import "osl/torrent"` spelling remains supported.

## Behavior and limits

Directory scans avoid symbolic-link loops and tolerate files that disappear during the scan.
`validate` checks the piece length, piece count, total size, and binary piece hashes. Parsing uses
the package's bencode decoder.
