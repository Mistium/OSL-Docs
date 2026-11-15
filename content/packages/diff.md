---
description: Compare two texts by line, word or character and show what changed, as a unified diff, as data or as HTML.
package: diff
---

# diff

`diff` finds what changed between two texts. Use it to show a patch, preview a file edit before saving it, check that a generated file changed at all, or highlight edits in a review screen. You can compare line by line, word by word or character by character.

```osl fragment
import "std:diff"
```

## Compare lines

`diff.text(old, new)` returns a `Diff`. `hasChanges` says whether the texts differ, and `added` and `removed` list the lines that are only in one of them.

```osl
import "std:diff"

string before = "apple\nbanana\ncherry"
string after = "apple\nblueberry\ncherry\ndate"

auto d = diff.text(before, after)
log d.hasChanges()
log "removed:" d.removed()
log "added:" d.added()
log diff.text(before, before).hasChanges()
```

```output
true
removed: ["banana"]
added: ["blueberry","date"]
false
```

Try it: change `date` back to `cherry` only and see what `added()` gives.

## Unified format

`unified()` writes the familiar patch format: a header giving the line ranges, then every line prefixed with `-`, `+` or a space. It is an empty string when nothing changed.

```osl
import "std:diff"

auto d = diff.text("a\nb\nc\nd", "a\nB\nc\nd\ne")
log d.unified()
log "[" ++ diff.text("same", "same").unified() ++ "]"
```

```output
@@ -1,4 +1,5 @@
 a
-b
+B
 c
 d
+e

[]
```

## How much context

Only a few unchanged lines are kept around each change, three by default. Change that with `context`. With `0` you get only the changed lines, and distant changes become separate hunks.

```osl
import "std:diff"

string[] lines = []
for i in 1 to 12 ( lines.append("line " ++ i) )
string old = lines.join("\n")
lines[2] = "LINE 2"
lines[11] = "LINE 11"
string changed = lines.join("\n")

log diff.text(old, changed, {context: 0}).unified()
log diff.text(old, changed).hunks().len
```

```output
@@ -2,1 +2,1 @@
-line 2
+LINE 2
@@ -11,1 +11,1 @@
-line 11
+LINE 11

2
```

## Hunks as data

When you want to build your own display, `hunks()` returns records: where each hunk starts and how long it is in the old and new text, and a list of `changes`, each with a `kind` (`same`, `removed` or `added`) and the `text`.

```osl
import "std:diff"

for h in diff.text("one\ntwo\nthree", "one\n2\nthree").hunks() (
  log "old from line" h.oldStart "for" h.oldLines "lines"
  for c in h.changes (
    log c.kind ":" c.text
  )
)
```

```output
old from line 1 for 3 lines
same : one
removed : two
added : 2
same : three
```

## Words and characters

`diff.words` splits on whitespace, which suits prose. `diff.chars` compares single characters, which suits short strings such as names or version numbers.

```osl
import "std:diff"

auto w = diff.words("the quick brown fox", "the slow brown dog")
log w.removed() w.added()

auto c = diff.chars("kitten", "sitting")
log c.removed() c.added()
```

```output
["quick","fox"] ["slow","dog"]
["k","e"] ["s","i","g"]
```

Try it: compare two sentences of your own with `diff.words`.

## HTML output

`html()` writes a `div` with one child per item, marked `diff-same`, `diff-old` or `diff-new`. Text is escaped. Style those classes to colour a review page.

```osl
import "std:diff"

log diff.text("a < b\nsame", "a > b\nsame").html()
```

```output
<div class='diff'>
<div class='diff-old'>a &lt; b</div>
<div class='diff-new'>a &gt; b</div>
<div class='diff-same'>same</div>
</div>

```

## Real-world: only write when changed

A generator can compare the new output with the file on disk, and skip the write (and its timestamp change) when nothing differs.

```osl
import "std:diff"
import "std:fs"

fs.remove("out.txt", {force: true}).unwrap()

def save(string path, string text) (
  if !fs.exists(path) (
    fs.writeFile(path, text).unwrap()
    log path "created"
    return
  )
  string old = fs.readFile(path).unwrap()
  auto d = diff.text(old, text)
  if !d.hasChanges() (
    log path "unchanged"
    return
  )
  fs.writeFile(path, text).unwrap()
  log path "updated, +" ++ d.added().len ++ " -" ++ d.removed().len
)

save("out.txt", "a\nb")
save("out.txt", "a\nb")
save("out.txt", "a\nc\nd")
```

```output
out.txt created
out.txt unchanged
out.txt updated, +2 -1
```

:::quiz
How many unchanged lines does `diff.text` keep around each change by default?

- [ ] None.
- [x] Three.
- [ ] All of them.

Pass `{context: 0}` for only the changes, or a larger number for more around them.
:::

:::exercise title="What changed on the list?"
Print `- item` for each removed line, then `+ item` for each added one.

```osl
import "std:diff"

string before = "milk\neggs\nbread"
string after = "milk\nbread\ntea"
log diff.text(before, after).hasChanges()
```

```output
- eggs
+ tea
```

> [!hint]
> `removed()` and `added()` return arrays of lines.

```osl solution
import "std:diff"

string before = "milk\neggs\nbread"
string after = "milk\nbread\ntea"
auto d = diff.text(before, after)
for item in d.removed() ( log "- " ++ item )
for item in d.added() ( log "+ " ++ item )
```

```output
- eggs
+ tea
```
:::

## API reference

::api
