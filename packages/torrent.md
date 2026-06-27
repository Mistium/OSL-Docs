# torrent

> Create and parse `.torrent` files

Use `torrent` to create, inspect, edit, and serialise torrent metadata.

```javascript
import "osl/torrent"
```

## API reference

### `torrent`

| Method | Returns | Description |
| --- | --- | --- |
| `torrent.createFromDirectory(dirPath: any)` | `*Torrent` | Creates from directory. |
| `torrent.parse(torrentData: any)` | `*Torrent` | Parses input data. |

### `Torrent` values

Methods available on `Torrent` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.create(name: any, files: array, pieceLength: any)` | `*Torrent` | Creates a new value. |
| `value.save(path: any)` | `boolean` | Runs the save operation. |
| `value.addTracker(tracker: any)` | `boolean` | Adds tracker. |
| `value.removeTracker(tracker: any)` | `boolean` | Removes tracker. |
| `value.getTrackers()` | `array` | Returns trackers. |
| `value.getInfo()` | `object` | Returns info. |
| `value.addMetadata(key: any, value: any)` | `void` | Adds metadata. |
| `value.getMetadata(key: any)` | `string` | Returns metadata. |
| `value.getAllMetadata()` | `object` | Returns all metadata. |
| `value.getFileIndex(path: any)` | `number` | Returns file index. |
| `value.getPieceHashes()` | `array` | Returns piece hashes. |
| `value.setPieceHash(index: any, hash: any)` | `boolean` | Sets piece hash. |
| `value.validate()` | `boolean` | Validates the current value. |
| `value.download(torrentPath: any, outputPath: any)` | `boolean` | Runs the download operation. |
| `value.seed(torrentPath: any, port: any)` | `boolean` | Runs the seed operation. |
| `value.getMagnetLink()` | `string` | Returns magnet link. |
| `value.calculateInfoHash()` | `string` | Runs the calculate info hash operation. |
| `value.getFiles()` | `array` | Returns files. |
| `value.setFiles(files: array)` | `void` | Sets files. |
| `value.getFileCount()` | `number` | Returns file count. |
| `value.getTotalSize()` | `number` | Returns total size. |
| `value.getPieceCount()` | `number` | Returns piece count. |
| `value.generatePeerID()` | `string` | Runs the generate peer id operation. |
| `value.getMagnetURI()` | `string` | Returns magnet uri. |
| `value.exportInfo(path: any)` | `boolean` | Runs the export info operation. |
| `value.clone()` | `*Torrent` | Runs the clone operation. |
| `value.merge(otherTorrent: *Torrent)` | `*Torrent` | Runs the merge operation. |
| `value.strip(metadata: any)` | `*Torrent` | Runs the strip operation. |

## Notes

- Standard-library imports accept both `import "osl/torrent"` and `import "torrent"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
