---
description: Pack files into ZIP and tar archives, unpack them safely, and gzip single files or strings.
package: zip
---

# zip

`zip` makes and reads archives. Use it to bundle a folder for sending, unpack a download, peek inside an archive without extracting it, or shrink a log file or a string.

```osl fragment
import "std:zip"
```

## Compress a folder

`zip.compress(path, output)` packs a file or a whole folder into a new ZIP archive. `zip.entries(path)` lists what is inside, with sizes in bytes.

```osl
import "std:zip"
import "std:fs"

fs.remove("docs", {force: true}).unwrap()
fs.mkdir("docs/img", {recursive: true}).unwrap()
fs.writeFile("docs/readme.txt", "hello hello hello hello").unwrap()
fs.writeFile("docs/img/note.txt", "tiny").unwrap()

zip.compress("docs", "docs.zip").unwrap()
for e in zip.entries("docs.zip").unwrap() (
  log e.name e.isDir e.size
)
```

```output
docs/ true 0
docs/img/ true 0
docs/img/note.txt false 4
docs/readme.txt false 23
```

Try it: add a third file to the folder and run it again. The archive keeps the folder's name as its top level.

## Extract

`zip.decompress(path, folder)` unpacks everything into a folder, creating it if needed. `zip.extractFile(path, name, output)` takes out one entry.

```osl
import "std:zip"
import "std:fs"

fs.remove("docs", {force: true}).unwrap()
fs.mkdir("docs", {recursive: true}).unwrap()
fs.writeFile("docs/readme.txt", "read me").unwrap()
zip.compress("docs", "docs.zip").unwrap()

zip.decompress("docs.zip", "unpacked").unwrap()
log fs.readFile("unpacked/docs/readme.txt").unwrap()

zip.extractFile("docs.zip", "docs/readme.txt", "just-one.txt").unwrap()
log fs.readFile("just-one.txt").unwrap()
```

```output
read me
read me
```

## When it goes wrong

Missing archives are `NotFoundError`. A file that is not an archive is a `ParseError`. Both come back as [results](../learn/errors.md), and a failed write leaves nothing half done.

```osl
import "std:zip"
import "std:fs"

fs.writeFile("plain.txt", "I am not a zip").unwrap()
log zip.decompress("missing.zip", "out").unwrapErr().kind
log zip.entries("plain.txt").unwrapErr().kind
```

```output
NotFoundError
ParseError
```

## Edit an archive

`create` makes an empty archive, `addFile` adds a file or folder (replacing entries with the same name), and `removeFile` deletes an entry. Removing a name the archive doesn't have does nothing.

```osl
import "std:zip"
import "std:fs"

fs.writeFile("a.txt", "A").unwrap()
fs.writeFile("b.txt", "B").unwrap()

zip.create("bundle.zip").unwrap()
zip.addFile("bundle.zip", "a.txt").unwrap()
zip.addFile("bundle.zip", "b.txt").unwrap()
zip.removeFile("bundle.zip", "a.txt").unwrap()
for e in zip.entries("bundle.zip").unwrap() ( log e.name )
```

```output
b.txt
```

## Safe extraction

Archives from strangers can be traps: entries that write outside the target folder, or a tiny file that expands to gigabytes. `decompress` checks every entry before it writes anything and refuses paths that escape the folder. Set limits too:

```osl
import "std:zip"
import "std:fs"

fs.mkdir("many", {recursive: true}).unwrap()
fs.writeFile("many/1.txt", "1").unwrap()
fs.writeFile("many/2.txt", "2").unwrap()
zip.compress("many", "many.zip").unwrap()

log zip.decompress("many.zip", "out", {maxFiles: 1}).unwrapErr().kind
log zip.decompress("many.zip", "out", {maxBytes: 1}).unwrapErr().kind
log zip.decompress("many.zip", "out", {maxFiles: 10, maxBytes: 1000}).isOk()
```

```output
ValueError
ValueError
true
```

> [!warning]
> Always set `maxBytes` and `maxFiles` when you unpack something you didn't make yourself.

## gzip a file

ZIP holds many files. gzip compresses one. `zip.gzip(path, output)` and `zip.gunzip(path, output)` are a pair, and they take size limits as well.

```osl
import "std:zip"
import "std:fs"

string text = "log line\n" * 100
fs.writeFile("app.log", text).unwrap()
zip.gzip("app.log", "app.log.gz").unwrap()
zip.gunzip("app.log.gz", "restored.log").unwrap()

log fs.size("app.log").unwrap()
log fs.size("app.log.gz").unwrap() < fs.size("app.log").unwrap()
log fs.readFile("restored.log").unwrap() == text
```

```output
900
true
true
```

## Compress a string

`compressString` gzips text and returns it as base64, a string you can store in JSON or send in a header. `decompressString` reverses it.

```osl
import "std:zip"

string packed = zip.compressString("abc" * 50)
log packed.len < 150
log zip.decompressString(packed).unwrap().len
log zip.decompressString("not base64!").unwrapErr().kind
```

```output
true
150
ParseError
```

## tar

`zip.tar(path, output)` and `zip.untar(path, output)` work like `compress` and `decompress` for tar archives, which store files and folders only. Combine with `gzip` for a `.tar.gz`.

```osl
import "std:zip"
import "std:fs"

fs.mkdir("proj", {recursive: true}).unwrap()
fs.writeFile("proj/main.osl", "log 1").unwrap()
zip.tar("proj", "proj.tar").unwrap()
zip.untar("proj.tar", "copy").unwrap()
log fs.readFile("copy/proj/main.osl").unwrap()
```

```output
log 1
```

:::quiz
You unpack a ZIP someone uploaded to your server. What should you do?

- [ ] Call `decompress` with no options.
- [x] Pass `maxBytes` and `maxFiles` so a malicious archive can't fill the disk.
- [ ] Use `extractFile` on every entry yourself.

`decompress` already refuses entries that escape the folder, and the limits stop archives that expand hugely.
:::

:::exercise title="Backup and check"
Compress the `notes` folder to `notes.zip`, then print how many files (not folders) are in the archive.

```osl
import "std:zip"
import "std:fs"

fs.remove("notes", {force: true}).unwrap()
fs.mkdir("notes/old", {recursive: true}).unwrap()
fs.writeFile("notes/a.txt", "a").unwrap()
fs.writeFile("notes/old/b.txt", "b").unwrap()
log fs.exists("notes")
```

```output
2
```

> [!hint]
> `zip.entries("notes.zip").unwrap()` gives records with an `isDir` flag.

```osl solution
import "std:zip"
import "std:fs"

fs.remove("notes", {force: true}).unwrap()
fs.mkdir("notes/old", {recursive: true}).unwrap()
fs.writeFile("notes/a.txt", "a").unwrap()
fs.writeFile("notes/old/b.txt", "b").unwrap()

zip.compress("notes", "notes.zip").unwrap()
int files = 0
for e in zip.entries("notes.zip").unwrap() (
  if !e.isDir ( files++ )
)
log files
```

```output
2
```
:::

## API reference

::api
