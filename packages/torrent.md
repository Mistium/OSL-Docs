# torrent

Use `torrent` to create, read and write BitTorrent metainfo (`.torrent`) files and magnet links,
and to download and seed torrents as a BitTorrent client.

```osl
import "std:torrent"
```

## Example

Make a `.torrent` file for a directory:

```osl
import "std:torrent"
import "std:fs"

fs.mkdir("site", {recursive: true})
fs.writeFile("site/index.html", "<h1>Hello</h1>")

*torrent.Torrent t = torrent.fromPath("site", {trackers: ["udp://tracker.opentrackr.org:1337/announce"]})
log t.name()
log t.infoHash()
for file in t.files() (
  log file.path ++ " " ++ file.length ++ " bytes"
)
log t.magnetURI()
t.save("site.torrent")
```

Download a torrent and wait for it to finish:

```osl
import "std:torrent"

*torrent.Torrent t = torrent.decodeFile("ubuntu.iso.torrent")
object done = t.downloadTo("downloads", {timeout: 3600000})
log "saved " ++ done.size ++ " bytes to " ++ done.path
```

Watch progress with a client:

```osl
import "std:torrent"

*torrent.Client client = torrent.newClient({dir: "downloads"})
*torrent.Download dl = client.addMagnet("magnet:?xt=urn:btih:...")
dl.waitForInfo({timeout: 60000})
while !dl.isComplete() (
  object p = dl.progress()
  log (p.fraction * 100).round() ++ "% from " ++ p.peers ++ " peers"
  wait 1
)
client.close()
```

## API reference

### `torrent`

| Method | Returns | Notes |
| --- | --- | --- |
| `torrent.fromPath(path: string, options?)` | `result<*torrent.Torrent, error>` | Builds metainfo for a file or directory, reading it all to hash its pieces. A directory becomes a multi-file torrent of its regular files, sorted by path; symlinks are skipped. Fails with `NotFoundError` or `PermissionError` when `path` can't be read and `ValueError` when it has no files. |
| `torrent.decode(data: byte[])` | `result<*torrent.Torrent, error>` | Reads the bytes of a `.torrent` file. The info hash comes from the bytes as given, so it matches other clients. |
| `torrent.decodeFile(path: string)` | `result<*torrent.Torrent, error>` | Reads a `.torrent` file. |
| `torrent.newClient(options?)` | `result<*torrent.Client, error>` | Starts a client that listens for peers. Fails with `NetworkError` when the port can't be used, and `PermissionError` or `IOError` when `dir` can't be created. |
| `torrent.downloadMagnet(uri: string, dir: string, options?)` | `result<Downloaded, error>` | Downloads what a magnet URI names into `dir` and returns once it's done and verified. Takes the `downloadTo` options; `timeout` covers fetching the metadata too. |

Options for `torrent.fromPath`:

| Key | Notes |
| --- | --- |
| `name` | Default: the base name of `path`. |
| `pieceLength` | Bytes, a power of two from 16384 to 67108864. Chosen from the total size by default. |
| `trackers` | Array of announce URLs. |
| `comment` | |
| `createdBy` | Default `"OSL"`. |
| `private` | Default `false`. |

`decode` and `decodeFile` fail with `ParseError` for malformed or non-canonical bencoding, missing or
invalid fields, piece hashes that don't match the file sizes, and file paths that would escape the
torrent's directory.

Options for `torrent.newClient`:

| Key | Notes |
| --- | --- |
| `dir` | Where downloads are stored. Default the current directory; created if missing. |
| `listenPort` | TCP and uTP port. Default 0 for a random free one (see `client.port()`). |
| `seed` | Default `false`. `true` keeps uploading torrents that are complete. |
| `dht` | Default `true`: find peers through the public DHT. |
| `upload` | Default `true`. `false` never sends data to peers. |
| `uploadRateLimit`, `downloadRateLimit` | Bytes per second. Default 0 for no limit. |
| `portForwarding` | Default `false`. `true` asks the router to forward `listenPort` over UPnP. |

### `*torrent.Torrent`

| Method | Returns | Notes |
| --- | --- | --- |
| `t.name()` | `string` | The file name of a single-file torrent, or the directory name of a multi-file one. |
| `t.infoHash()` | `string` | BitTorrent v1 info hash, 40 lowercase hex digits. |
| `t.pieceLength()` | `int` | Piece size in bytes; the last piece may be shorter. |
| `t.pieceCount()` | `int` | |
| `t.pieces()` | `string[]` | SHA-1 hash of each piece, 40 hex digits each. |
| `t.files()` | `{path, length}[]` | `path` is relative to the torrent's directory with `/` separators (the name for a single file); `length` is bytes. |
| `t.size()` | `int` | Total size in bytes. |
| `t.isPrivate()` | `boolean` | Whether clients should find peers only through its trackers. |
| `t.trackers()` | `string[]` | Announce URLs, the primary first. |
| `t.addTracker(url: string)` | `boolean` | Adds a tracker, changing the torrent; `false` when it's already there. The info hash doesn't change. |
| `t.removeTracker(url: string)` | `boolean` | `false` when it wasn't there. |
| `t.magnetURI()` | `string` | Magnet link with the info hash, name (`dn`) and trackers (`tr`), URL-encoded. |
| `t.encode()` | `byte[]` | The `.torrent` file's bytes. |
| `t.save(path: string)` | `result<unit, error>` | Writes the `.torrent` file. |
| `t.clone()` | `*torrent.Torrent` | An independent copy. |
| `t.downloadTo(dir: string, options?)` | `result<Downloaded, error>` | Downloads into `dir` and returns once done and verified. Data already in `dir` is verified and kept, so an interrupted download resumes. Options: `timeout` (ms, 0 for none), `peers` (`"host:port"` addresses), and the `newClient` options `listenPort`, `dht`, `upload`, `uploadRateLimit`, `downloadRateLimit`, `portForwarding`. |
| `t.seedFrom(dir: string, options?)` | `result<*torrent.Download, error>` | Verifies the data in `dir` (the file or directory under the torrent's name) and seeds it in the background until the returned download is closed. Options: the `newClient` options other than `dir` and `seed`. Fails with `NotFoundError` for a missing file and `ValueError` when the data doesn't match. |

`Downloaded` is `{name, infoHash, path, size, files}`: `path` is the downloaded file, or directory
for a multi-file torrent, and `files` are `{path, length}` records.

### `*torrent.Client`

| Method | Returns | Notes |
| --- | --- | --- |
| `client.addTorrent(t: *torrent.Torrent, options?)` | `result<*torrent.Download, error>` | Starts downloading in the background, verifying any data already there. Options: `dir`, `peers`. Adding a torrent the client already has returns its existing download. |
| `client.addMagnet(uri: string, options?)` | `result<*torrent.Download, error>` | Fetches the metadata from peers, then the data. Options: `dir`, `peers`. Fails with `ParseError` for an invalid URI. |
| `client.downloads()` | `*torrent.Download[]` | Open downloads, in the order added. |
| `client.port()` | `int` | The port peers connect to. |
| `client.dir()` | `string` | Absolute path of the default download directory. |
| `client.close()` | `void` | Stops every download and stops listening. Files stay on disk. Closing twice is a no-op. |

### `*torrent.Download`

| Method | Returns | Notes |
| --- | --- | --- |
| `dl.name()` | `string` | For a magnet without metadata yet, the URI's `dn` (or `""`). |
| `dl.infoHash()` | `string` | |
| `dl.path()` | `string` | Absolute path of the file or directory the data goes to. |
| `dl.metainfo()` | `*torrent.Torrent` | The torrent's metainfo. |
| `dl.waitForInfo(options?)` | `result<unit, error>` | Blocks until a magnet download has its metadata. Option: `timeout` (ms). |
| `dl.wait(options?)` | `result<unit, error>` | Blocks until everything is downloaded and verified. Option: `timeout` (ms). Fails with `IOError` or `PermissionError` when the data can't be written, which also stops the download. |
| `dl.isComplete()` | `boolean` | Whether all data is downloaded and verified. |
| `dl.progress()` | `{bytesCompleted, bytesTotal, fraction, peers, seeders, downloadRate, uploadRate}` | `bytesTotal` is `int?`, `null` until a magnet's metadata arrives. `fraction` is 0 to 1. Rates are bytes per second. |
| `dl.files()` | `{path, length, bytesCompleted}[]` | Per-file progress. |
| `dl.addPeers(addresses: string[])` | `result<unit, error>` | Connects to more `"host:port"` peers. |
| `dl.pause()`, `dl.resume()` | `void` | Stop and restart transfer, keeping peers and data. |
| `dl.client()` | `*torrent.Client` | The client it belongs to; for `seedFrom`, its `port()` is where peers connect. |
| `dl.close()` | `void` | Stops the download (or seeding) and removes it from its client. Files stay on disk. Closing twice is a no-op. |

`path()`, `files()` and `metainfo()` throw `StateError` while a magnet download's metadata hasn't
arrived. Using a closed client or download throws `StateError`.

### Errors

| Kind | When |
| --- | --- |
| `ParseError` | A malformed `.torrent`, magnet URI or peer address. |
| `NotFoundError`, `PermissionError` | A path can't be read, or a seeded file is missing. |
| `IOError` | Data can't be written. |
| `NetworkError` | The client can't listen, or a peer's host can't be resolved. |
| `TimeoutError` | A `timeout` passed. |
| `StateError` | The download or client was closed while waiting. |
| `ValueError` | `fromPath` found no files, or seeded data doesn't match. Thrown for invalid options. |

## Changes from earlier versions

`torrent.create`, `torrent.createFromDirectory` and `torrent.parse` are gone; use `torrent.fromPath`
and `torrent.decode`. So are the package functions that worked on one shared empty torrent, the
`get`-prefixed methods (`getTrackers` is now `trackers()`, `getMagnetLink` is `magnetURI()`, and so
on), and `t.download`/`t.seed`, which never transferred anything; use `t.downloadTo` and
`t.seedFrom`. No torrent is written with per-file `md5sum` keys any more; only the removed
`torrent.create` added them.
