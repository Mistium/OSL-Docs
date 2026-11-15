---
description: Create and read .torrent files and magnet links, and download or seed files as a BitTorrent client.
package: torrent
---

# torrent

BitTorrent shares files between many peers instead of one server. A `.torrent` file (or a magnet link) describes the files and fingerprints each piece, so a downloader can check what it gets. `std:torrent` can create and read these descriptions, and act as a client that downloads and seeds.

Making and reading metainfo works offline and runs below. Downloading needs peers on the internet, so those examples are `norun`.

## Describe a file

`torrent.fromPath(path, options)` reads a file (or a folder) and builds its metainfo: its size, the pieces and their hashes. Options set the `pieceLength` and `trackers`:

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("notes.txt", "hello torrent " * 1000).unwrap()

auto t = torrent.fromPath("notes.txt", {
  pieceLength: 16384,
  trackers: ["udp://tracker.example:80"]
}).unwrap()
log t.name() t.size()
log t.pieceLength() t.pieceCount()
log t.files()
log t.trackers()
```

```output
notes.txt 14000
16384 1
[{"length":14000,"path":"notes.txt"}]
["udp://tracker.example:80"]
```

Change the text to `* 5000` and run again: the file gets more pieces.

## The info hash

The info hash is the torrent's identity: 40 hex digits computed from the content and its description. The same file with the same settings always gets the same one, and any change gets a different one:

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("notes.txt", "hello torrent " * 1000).unwrap()
auto t = torrent.fromPath("notes.txt", {pieceLength: 16384}).unwrap()

log t.infoHash()
log t.infoHash().len

fs.writeFile("notes.txt", "hello torrent " * 1001).unwrap()
auto changed = torrent.fromPath("notes.txt", {pieceLength: 16384}).unwrap()
log changed.infoHash() == t.infoHash()
```

```output
163c09845057dc470e34cbf3375ff233c7fc18aa
40
false
```

## Magnet links

A magnet link carries the info hash, the name and the trackers in one line of text, which is easy to paste and share:

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("notes.txt", "hello torrent " * 1000).unwrap()
auto t = torrent.fromPath("notes.txt", {
  pieceLength: 16384,
  trackers: ["udp://tracker.example:80"]
}).unwrap()

string link = t.magnetURI()
log link.startsWith("magnet:?xt=urn:btih:" ++ t.infoHash())
log link.contains("dn=notes.txt")
```

```output
true
true
```

## Save and load a .torrent file

`save(path)` writes the `.torrent` file, `decodeFile(path)` reads one, and `encode()` and `decode(bytes)` do the same in memory. A bad file is a `ParseError`:

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("notes.txt", "hello torrent " * 1000).unwrap()
auto t = torrent.fromPath("notes.txt", {pieceLength: 16384}).unwrap()
t.save("notes.torrent").unwrap()

auto back = torrent.decodeFile("notes.torrent").unwrap()
log back.name() back.infoHash() == t.infoHash()

log torrent.decode("this is not bencode").unwrapErr().kind
log torrent.decodeFile("missing.torrent").unwrapErr().kind

fs.remove("notes.torrent", {force: true}).unwrap()
```

```output
notes.txt true
ParseError
NotFoundError
```

## Trackers

`addTracker` and `removeTracker` change the torrent in place and return whether anything changed. The info hash stays the same, since trackers aren't part of the content:

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("notes.txt", "hello torrent " * 1000).unwrap()
auto t = torrent.fromPath("notes.txt", {pieceLength: 16384}).unwrap()
string before = t.infoHash()

log t.addTracker("udp://one.example:80")
log t.addTracker("udp://one.example:80")
log t.trackers()
log t.removeTracker("udp://one.example:80")
log t.infoHash() == before
```

```output
true
false
["udp://one.example:80"]
true
true
```

:::quiz
You add a tracker to a torrent. What happens to its info hash?

- [ ] It changes, so it is a different torrent.
- [x] It stays the same.
- [ ] It becomes empty until the tracker answers.

The hash covers the files and pieces only. Trackers are just hints about where to find peers.
:::

## Download

`torrent.downloadMagnet(uri, dir)` fetches a torrent from its magnet link and waits for it. For a long download or several at once, make a client and watch progress:

```osl norun
import "std:torrent"
import "std:thread"

auto client = torrent.newClient({dir: "downloads"}).unwrap()
auto download = client.addMagnet("magnet:?xt=urn:btih:...").unwrap()

download.waitForInfo().unwrap()
log "downloading" download.name()

while !download.isComplete() (
  auto p = download.progress()
  log (p.fraction * 100) ++ "%" p.peers "peers"
  thread.sleep(1000)
)
download.wait().unwrap()
client.close()
```

## Seed

Seeding uploads data you already have. Give a torrent the folder that holds its files:

```osl norun
import "std:torrent"

auto t = torrent.decodeFile("notes.torrent").unwrap()
auto seeding = t.seedFrom(".").unwrap()
log "seeding on" seeding.client().port()
seeding.wait().unwrap()
```

Only download and share what you have the right to.

:::exercise title="Describe a file"
Create `data.txt` holding the text `abc` repeated 100 times, build a torrent with a `pieceLength` of 16384, and print its name, its size and its piece count.

```osl
import "std:torrent"
import "std:fs"

fs.writeFile("data.txt", "abc" * 100).unwrap()

log "?"
```

```output
data.txt 300 1
```

> [!hint]
> `torrent.fromPath("data.txt", {pieceLength: 16384}).unwrap()`.

> [!hint]
> `log t.name() t.size() t.pieceCount()`.

```osl solution
import "std:torrent"
import "std:fs"

fs.writeFile("data.txt", "abc" * 100).unwrap()

auto t = torrent.fromPath("data.txt", {pieceLength: 16384}).unwrap()
log t.name() t.size() t.pieceCount()
```

```output
data.txt 300 1
```
:::

## API reference

::api
