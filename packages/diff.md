# diff

Use `diff` to compare two texts line by line, word by word, or character by character, and to format the differences as unified diff text or HTML.

```osl
import "std:diff"
```

## Example

```osl
import "std:diff"

*diff.Diff changes = diff.text("one\ntwo\nthree", "one\n2\nthree")
log changes.hasChanges() // true
log changes.removed()    // ["two"]
log changes.added()      // ["2"]
log changes.unified()
// @@ -1,3 +1,3 @@
//  one
// -two
// +2
//  three
```

## API reference

### `diff`

Each function returns a `*diff.Diff`. The `context` option sets how many unchanged items are kept around each change.

| Function | Returns | Notes |
| --- | --- | --- |
| `diff.text(oldText: string, newText: string, options?: object)` | `*diff.Diff` | Compares line by line. Default `context` is `3`. |
| `diff.words(oldText: string, newText: string, options?: object)` | `*diff.Diff` | Compares word by word, splitting on whitespace. Default `context` is `3`. |
| `diff.chars(oldText: string, newText: string, options?: object)` | `*diff.Diff` | Compares character by character. Default `context` is `0`. |

### `*diff.Diff` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `d.hasChanges()` | `boolean` | Whether the texts differ. |
| `d.removed()` | `string[]` | Lines, words, or characters only in the old text, in order. |
| `d.added()` | `string[]` | Lines, words, or characters only in the new text, in order. |
| `d.hunks()` | `diff.Hunk[]` | The changes grouped into hunks. `[]` when the texts are equal. |
| `d.unified()` | `string` | Unified format: an `@@ -oldStart,oldLines +newStart,newLines @@` header per hunk, then one item per line prefixed `-`, `+`, or a space. `""` when the texts are equal. |
| `d.html()` | `string` | A `<div class='diff'>` holding one escaped `<div>` per item with class `diff-same`, `diff-old`, or `diff-new`. The outer div is empty when the texts are equal. |

### Hunk records

| Key | Type | Meaning |
| --- | --- | --- |
| `oldStart`, `newStart` | `int` | 1-based position of the hunk in the old and new sequence. As in `diff -u`, an empty side's start is the item before it. |
| `oldLines`, `newLines` | `int` | How many old and new items the hunk covers (lines, words, or characters). |
| `changes` | `{kind, text}[]` | Each item, with `kind` `"same"`, `"removed"`, or `"added"`. |

```osl
import "std:diff"

for hunk in diff.chars("cat", "cut", {context: 1}).hunks() (
  for change in hunk.changes (
    log change.kind ++ " " ++ change.text
  )
)
```

## Changes from earlier versions

`diff.compareLines` and `diff.compareWords` became `diff.text` and `diff.words`, and the package-level `diff.unified(d)`, `diff.html(d)`, and `diff.json(d)` became the `d.unified()` and `d.html()` methods and `json.stringify(d.hunks())`. A diff no longer has `Hunks`, `OldText`, or `NewText` fields; read `d.hunks()` instead.

## Behavior and limits

- The older `import "osl/diff"` spelling still works with a migration warning.
