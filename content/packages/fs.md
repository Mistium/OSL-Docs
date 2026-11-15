---
description: Read, write and manage files and directories, and take paths apart and put them together.
package: fs
---

# fs

`std:fs` reads and writes files, lists and walks directories, copies and moves things, and builds paths. Most functions return a [result](result.md), because files go missing and disks fill up. Pure path functions such as `base` and `ext` only work on strings and never touch the disk.

```osl fragment
import "std:fs"
```

## Write and read text

`fs.writeFile(path, text)` replaces a file's contents, creating the file if needed. `fs.readFile(path)` returns the whole file as a string. Both return results.

```osl
import "std:fs"

fs.writeFile("hello.txt", "Hello, file!\nSecond line\n").unwrap()
string text = fs.readFile("hello.txt").unwrap()
log text.len
log text.trim()
```

```output
25
Hello, file!
Second line
```

Writing is atomic: another reader sees either the old contents or the new, never half a file, even if the program crashes mid-write. `appendFile` adds to the end instead of replacing:

```osl
import "std:fs"

fs.remove("log.txt", {force: true}).unwrap()
fs.appendFile("log.txt", "start\n").unwrap()
fs.appendFile("log.txt", "next\n").unwrap()
log fs.readFile("log.txt").unwrap().trim()
```

```output
start
next
```

## Files that are not there

A missing file is not a crash, it is an error value with a `kind`. Check for it and decide what to do.

```osl
import "std:fs"

switch fs.readFile("no-such-file.txt") (
  case ok(text)
    log "read" text.len
  case err(e)
    log e.kind
)

string config = fs.readFile("settings.txt").unwrapOr("default")
log config
```

```output
NotFoundError
default
```

Kinds you will meet are `NotFoundError`, `PermissionError` and `IOError` (everything else, such as reading a directory as a file). `fs.exists(path)` is true when something is there.

```osl
import "std:fs"

fs.mkdir("somedir", {recursive: true}).unwrap()
log fs.exists("somedir") fs.isDir("somedir") fs.isFile("somedir")
log fs.readFile("somedir").unwrapErr().kind
log fs.writeFile("no/such/dir/file.txt", "x").unwrapErr().kind
```

```output
true true false
IOError
NotFoundError
```

Writing needs the parent directory to exist. Create it first with `mkdir`.

Try it: write `settings.txt` first and watch the fallback disappear.

## Paths

Paths are strings, and `fs` has functions to build them and take them apart, so you never join with `"/"` by hand. These work on the text only, and the file doesn't need to exist.

```osl
import "std:fs"

string p = fs.joinPath("projects", "osl", "main.osl")
log p
log fs.base(p) fs.dir(p)
log fs.ext(p) fs.stem(p)
log fs.splitPath(p) fs.splitExt(p)
log fs.segments("/usr/local/bin")
```

```output
projects/osl/main.osl
main.osl projects/osl
.osl main
["projects/osl/","main.osl"] ["projects/osl/main",".osl"]
["usr","local","bin"]
```

`joinPath` accepts any number of parts and cleans the result. `cleanPath` resolves `.`, `..` and doubled separators. Changing parts of a path is common enough to have helpers:

```osl
import "std:fs"

log fs.withExt("notes/todo.txt", "md")
log fs.withExt("notes/todo.txt", "")
log fs.withName("notes/todo.txt", "done.txt")
log fs.cleanPath("a//b/./c/../d")
log fs.joinPath("a", "../b", "c.txt")
```

```output
notes/todo.md
notes/todo
notes/done.txt
a/b/d
b/c.txt
```

Relative and absolute paths:

```osl
import "std:fs"

log fs.isAbs("/etc/hosts") fs.isAbs("etc/hosts")
log fs.relPath("/a/b", "/a/b/c/d.txt")
log fs.relPath("/a/b", "/a/x")
log fs.pathStartsWith("/a/b/c", "/a/b") fs.pathStartsWith("/a/bc", "/a/b")
log fs.toPosix("a/b")
log fs.absPath("x.txt").unwrap().endsWith("/x.txt")
```

```output
true false
c/d.txt
../x
true false
a/b
true
```

`pathStartsWith` compares whole elements, so `/a/bc` is not inside `/a/b`. That is the check to use before acting on a path someone gave you, instead of comparing strings with `startsWith`.

Try it: call `fs.ext` and `fs.stem` on a name like `archive.tar.gz`.

## Reading line by line

Reading a whole file is fine for small ones. For logs and data files, loop over the lines. `fs.lines` returns an iterator inside a result, reads as it goes and closes the file when the loop ends.

```osl
import "std:fs"

fs.writeFile("names.txt", "ada\ngrace\n\nalan\n").unwrap()

for line in fs.lines("names.txt").unwrap() (
  if line == "" continue
  log line.toUpper()
)
```

```output
ADA
GRACE
ALAN
```

`head` and `tail` give the first or last lines of a file as an array, and `tail` reads backwards from the end, so it is cheap on a huge log. `grep` returns the lines that match a regular expression.

```osl
import "std:fs"

string[] rows = []
for i in 1 to 20 ( rows.append("row " ++ i) )
fs.writeFile("rows.txt", rows.join("\n") ++ "\n").unwrap()

log fs.head("rows.txt", 3).unwrap()
log fs.tail("rows.txt", 2).unwrap()
log fs.head("rows.txt").unwrap().len
log fs.grep("rows.txt", "^row 1.$").unwrap()
log fs.grep("rows.txt", "(").unwrapErr().kind
```

```output
["row 1","row 2","row 3"]
["row 19","row 20"]
10
["row 10","row 11","row 12","row 13","row 14","row 15","row 16","row 17","row 18","row 19"]
ParseError
```

## Bytes

Text is not always text. Images, archives and binary formats are bytes. `readFileBytes` returns a `byte[]`, and `writeFileBytes` accepts a `byte[]`, a string (written as UTF-8) or an array of numbers from 0 to 255.

```osl
import "std:fs"

fs.writeFileBytes("data.bin", [0, 1, 2, 255]).unwrap()
byte[] data = fs.readFileBytes("data.bin").unwrap()
log data.len data[1] data[4]

fs.appendFileBytes("data.bin", [16, 32]).unwrap()
log fs.size("data.bin").unwrap()
```

```output
4 0 255
6
```

## Information about files

`size`, `modTime` and `stat` tell you about a file. `stat` returns a record with `name`, `path`, `ext`, `size` (bytes), `modTime` (unix milliseconds), `mode` (such as `-rw-r--r--`), `isDir` and `isSymlink`.

```osl
import "std:fs"

fs.writeFile("report.csv", "a,b\n1,2\n").unwrap()
auto info = fs.stat("report.csv").unwrap()
log info.name info.ext info.size info.isDir
log info.modTime > 0
log fs.size("report.csv").unwrap()
log fs.stat("nothing.here").unwrapErr().kind
```

```output
report.csv .csv 8 false
true
8
NotFoundError
```

## Directories

`mkdir` makes a directory. By default it fails if a parent is missing; with `{recursive: true}` it creates the whole chain and doesn't mind if it is already there. `readDir` lists names, and `entries` lists records (like `stat`) sorted by name.

```osl
import "std:fs"

fs.remove("proj", {force: true}).unwrap()
fs.mkdir("proj/src/util", {recursive: true}).unwrap()
fs.writeFile("proj/README.md", "# proj").unwrap()
fs.writeFile("proj/src/main.osl", "log 1").unwrap()

log fs.readDir("proj").unwrap()
for e in fs.entries("proj").unwrap() (
  log e.name e.isDir
)
log fs.mkdir("proj").unwrapErr().kind
```

```output
["README.md","src"]
README.md false
src true
IOError
```

## Walking a tree

`fs.walkTree(path)` visits everything below a directory, depth first and in name order, and the directory itself is not included. Each item is the same record that `entries` gives, so you can filter on `ext` or `isDir` as you go.

```osl
import "std:fs"

fs.remove("site", {force: true}).unwrap()
fs.mkdir("site/css", {recursive: true}).unwrap()
fs.mkdir("site/pages/deep", {recursive: true}).unwrap()
fs.writeFile("site/index.html", "<h1>hi</h1>").unwrap()
fs.writeFile("site/css/main.css", "body{}").unwrap()
fs.writeFile("site/pages/about.html", "about").unwrap()
fs.writeFile("site/pages/deep/team.html", "team").unwrap()

int bytes = 0
for e in fs.walkTree("site") (
  if e.isDir continue
  bytes += e.size
  if e.ext == ".html" (
    log fs.relPath("site", e.path)
  )
)
log "bytes:" bytes
```

```output
index.html
pages/about.html
pages/deep/team.html
bytes: 26
```

## Glob

`fs.glob` matches a shell-style pattern: `*` and `?` match within one path element, and `[a-z]` a range. It returns paths in name order, and no match is an empty array, not an error. `**` is not special, so use `walkTree` to search all depths.

```osl
import "std:fs"

fs.remove("site", {force: true}).unwrap()
fs.mkdir("site/pages", {recursive: true}).unwrap()
fs.writeFile("site/index.html", "").unwrap()
fs.writeFile("site/logo.svg", "").unwrap()
fs.writeFile("site/pages/about.html", "").unwrap()
fs.writeFile("site/pages/blog.html", "").unwrap()

log fs.glob("site/*.html").unwrap()
log fs.glob("site/*/*.html").unwrap()
log fs.glob("site/pages/[a-b]*").unwrap()
log fs.glob("site/*.png").unwrap()
log fs.glob("[").unwrapErr().kind
```

```output
["site/index.html"]
["site/pages/about.html","site/pages/blog.html"]
["site/pages/about.html","site/pages/blog.html"]
[]
ParseError
```

## Copy, rename, remove

`copy` copies a file, or a whole directory. It refuses to overwrite an existing destination file unless you pass `{overwrite: true}`. `rename` moves or renames, and replaces an existing file at the destination. `remove` deletes a file or a directory and everything in it.

```osl
import "std:fs"

fs.remove("work", {force: true}).unwrap()
fs.mkdir("work").unwrap()
fs.writeFile("work/a.txt", "A").unwrap()

fs.copy("work/a.txt", "work/b.txt").unwrap()
log fs.copy("work/a.txt", "work/b.txt").unwrapErr().kind
fs.copy("work/a.txt", "work/b.txt", {overwrite: true}).unwrap()
fs.rename("work/b.txt", "work/c.txt").unwrap()
log fs.readDir("work").unwrap()

fs.remove("backup", {force: true}).unwrap()
fs.copy("work", "backup").unwrap()
log fs.readDir("backup").unwrap()
fs.remove("work").unwrap()
log fs.exists("work")
log fs.remove("work").unwrapErr().kind
fs.remove("work", {force: true}).unwrap()
```

```output
IOError
["a.txt","c.txt"]
["a.txt","c.txt"]
false
NotFoundError
```

`remove` on something that isn't there is an error, which is useful when you want to know. `{force: true}` makes it quietly succeed, which is what you want for cleanup. This is why the examples on this page start by removing what they create.

## File handles

For more control, `fs.open` returns a handle. Open it with mode `"r"` (read, the default), `"w"` (write from the start, creating or emptying the file) or `"a"` (append), and always close it. Writes are buffered until you flush or close.

```osl
import "std:fs"

auto out = fs.open("handle.txt", {mode: "w"}).unwrap()
out.write("first\n").unwrap()
out.write("second\n").unwrap()
out.write([116, 104, 105, 114, 100, 10]).unwrap()
out.close().unwrap()

auto f = fs.open("handle.txt").unwrap()
log f.readLine().unwrap()
log f.eof()
log f.read(3).unwrap()
log f.seek(0).unwrap()
log f.head(2).unwrap()
log f.tail(1).unwrap()
f.close().unwrap()
```

```output
first
false
sec
0
["first","second"]
["third"]
```

`readLine` returns the next line, and reports an error at the end of the file, so loop with `for line in f.lines()` or check `eof()`. `seek(offset, from)` moves the cursor and takes `"start"`, `"current"` or `"end"`. Offsets are distances in bytes, so `0` is the start of the file.

`fs.openText(text)` gives you a handle over a string, so code that reads from a file handle can be tested without a file:

```osl
import "std:fs"

def countWords(*fs.File source) int (
  int n = 0
  for line in source.lines() ( n += line.split(" ").len )
  return n
)

log countWords(fs.openText("one two\nthree four five"))
```

```output
5
```

## Update with a backup

Because `writeFile` is atomic, a program can update a settings file and keep the old one as a backup:

```osl
import "std:fs"
import "std:json"

fs.remove("settings.json", {force: true}).unwrap()
fs.remove("settings.json.bak", {force: true}).unwrap()
fs.writeFile("settings.json", json.stringify({volume: 5})).unwrap()

def update(string path, int volume) result<unit, error> (
  fs.copy(path, path ++ ".bak", {overwrite: true})!
  return fs.writeFile(path, json.stringify({volume: volume}))
)

update("settings.json", 9).unwrap()
log fs.readFile("settings.json").unwrap()
log fs.readFile("settings.json.bak").unwrap()
fs.remove("settings.json").unwrap()
fs.remove("settings.json.bak").unwrap()
```

```output
{"volume":9}
{"volume":5}
```

:::exercise title="Count lines of code"
Write a function `countLines(dir)` that returns how many lines there are in all `.osl` files below `dir`, skipping directories and other files. The starter creates a small project.

```osl
import "std:fs"

fs.remove("code", {force: true}).unwrap()
fs.mkdir("code/lib", {recursive: true}).unwrap()
fs.writeFile("code/main.osl", "a\nb\nc\n").unwrap()
fs.writeFile("code/lib/util.osl", "x\ny\n").unwrap()
fs.writeFile("code/notes.txt", "not code\n").unwrap()

log fs.readDir("code").unwrap().len
```

```output
5
```

> [!hint]
> Loop over `fs.walkTree(dir)`, skip entries where `isDir` is true or `ext` is not `.osl`.

> [!hint]
> `fs.lines(path).unwrap()` is an iterator, so a nested `for` loop can count its lines.

```osl solution
import "std:fs"

fs.remove("code", {force: true}).unwrap()
fs.mkdir("code/lib", {recursive: true}).unwrap()
fs.writeFile("code/main.osl", "a\nb\nc\n").unwrap()
fs.writeFile("code/lib/util.osl", "x\ny\n").unwrap()
fs.writeFile("code/notes.txt", "not code\n").unwrap()

def countLines(string dir) int (
  int total = 0
  for e in fs.walkTree(dir) (
    if e.isDir or e.ext != ".osl" continue
    for _ in fs.lines(e.path).unwrap() ( total++ )
  )
  return total
)

log countLines("code")
```

```output
5
```
:::

:::quiz
What does `fs.remove("gone.txt")` do when the file doesn't exist?

- [ ] Nothing, quietly.
- [x] Returns a `NotFoundError`.
- [ ] Creates the file.

Pass `{force: true}` to make it quietly succeed, which is what cleanup wants.
:::

:::exercise title="Rename .txt to .md"
Rename every `.txt` file in `notes` to `.md`, then print the folder's names.

```osl
import "std:fs"

fs.remove("notes", {force: true}).unwrap()
fs.mkdir("notes").unwrap()
fs.writeFile("notes/a.txt", "a").unwrap()
fs.writeFile("notes/b.txt", "b").unwrap()
fs.writeFile("notes/keep.csv", "c").unwrap()
log fs.readDir("notes").unwrap()
```

```output
["a.md","b.md","keep.csv"]
```

> [!hint]
> `fs.withExt(path, "md")` builds the new name.

> [!hint]
> `fs.joinPath("notes", name)` builds the path for each file.

```osl solution
import "std:fs"

fs.remove("notes", {force: true}).unwrap()
fs.mkdir("notes").unwrap()
fs.writeFile("notes/a.txt", "a").unwrap()
fs.writeFile("notes/b.txt", "b").unwrap()
fs.writeFile("notes/keep.csv", "c").unwrap()

for name in fs.readDir("notes").unwrap() (
  string path = fs.joinPath("notes", name)
  if fs.ext(path) == ".txt" (
    fs.rename(path, fs.withExt(path, "md")).unwrap()
  )
)
log fs.readDir("notes").unwrap()
```

```output
["a.md","b.md","keep.csv"]
```
:::

## API reference

::api
