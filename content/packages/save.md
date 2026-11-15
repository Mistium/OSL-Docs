---
description: Keep small named pieces of text, such as settings and scores, between runs of a program.
package: save
---

# save

`std:save` gives a program a folder of its own where it can keep named items between runs: settings, a high score, a token, the last thing the user opened. Each item is a file, written safely so a crash can't leave half of one. Use it for small per-user data. For anything you need to search or update in parts, use [db](db.md), and for files you choose the location of, use [fs](fs.md).

Items are text. To store a number, a list or a record, turn it into text with [json](json.md) on the way in and back on the way out.

## Open a store and keep an item

`save.open(appName)` returns the store for an app, creating its folder under `~/.osl/apps` when needed. `set` stores text under a name and `get` reads it back:

```osl
import "std:save"

auto store = save.open("docs-save-demo").unwrap()

// Start clean, because this example runs more than once.
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

store.set("name", "Ada").unwrap()
log store.get("name").unwrap()

store.set("name", "Grace").unwrap()
log store.get("name").unwrap()

log store.dir().endsWith("docs-save-demo")
```

```output
Ada
Grace
true
```

Run it twice with the cleanup loop deleted: the old value is still there on the second run, because it lives on disk.

Setting a name again replaces the old value. The write goes to a temporary file first and is renamed into place, so a reader sees the old text or the new text and never a mixture.

Pick an app name that is yours alone. Two programs that open the same name share a store.

## Names and files

A name without an extension is stored as `name.txt`, so `"score"` and `"score.txt"` are the same item. Give a name an extension when the content has one, such as `settings.json`. `keys()` lists what is stored, sorted, and `path(name)` tells you which file holds an item, so other tools can open it:

```osl
import "std:save"
import "std:fs"

auto store = save.open("docs-save-demo").unwrap()
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

store.set("note", "buy milk").unwrap()
store.set("theme.json", `{"dark": true}`).unwrap()

log store.keys().unwrap()
log store.has("note") store.has("missing")
log fs.readFile(store.path("note")).unwrap()
```

```output
["note.txt","theme.json"]
true false
buy milk
```

## Missing items

`get` and `remove` fail with a `NotFoundError` for an item that was never stored. That is a normal first-run situation, so give it a default with `unwrapOr`, or branch on `has`:

```osl
import "std:save"

auto store = save.open("docs-save-demo").unwrap()
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

string name = store.get("name").unwrapOr("stranger")
log "hello," name

log store.get("name").unwrapErr().kind

store.set("name", "Ada").unwrap()
store.remove("name").unwrap()
log store.has("name")
log store.remove("name").isErr()
```

```output
hello, stranger
NotFoundError
false
true
```

> [!warning]
> A name with a slash, or a trailing dot, is a programming error: `store.set("a/b", ...)` and `save.open("../x")` throw a `ValueError` and don't return a result. Names come from your code, so keep them plain.

## Saving structured data

Combine the store with `std:json` and a struct to keep a settings record. Parsing checks the stored text against the struct, so a hand-edited file with a wrong type is an error you can handle:

```osl
import "std:save"
import "std:json"

struct Settings (
  string theme = "light"
  int fontSize = 14
)

auto store = save.open("docs-save-demo").unwrap()
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

def load(*save.Store store) Settings (
  string text = store.get("settings.json").unwrapOr("{}")
  return json.parse<Settings>(text).unwrapOr(Settings())
)

Settings s = load(store)
log s.theme s.fontSize

s.theme = "dark"
s.fontSize = 16
store.set("settings.json", json.stringify(s)).unwrap()

Settings again = load(store)
log again.theme again.fontSize
log store.get("settings.json").unwrap()
```

```output
light 14
dark 16
{"theme":"dark","fontSize":16}
```

The loader falls back to a default `Settings()` in two cases: nothing is stored yet, or what is stored can't be parsed. A program that must not lose bad data should keep a copy before overwriting it.

:::quiz
You call `store.get("score")` on a first run, before anything was saved. What do you get?

- [ ] An empty string.
- [x] A failed result with a `NotFoundError`.
- [ ] The program stops.

Missing items are normal. Use `unwrapOr` to give a default.
:::

:::exercise title="Visit counter"
Count visits across runs. `visit()` reads `visits` (0 when missing), adds one, saves it and returns the new count. Call it three times.

```osl
import "std:save"

auto store = save.open("docs-save-demo").unwrap()
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

def visit() int (
  return 0
)

log visit() visit() visit()
```

```output
1 2 3
```

> [!hint]
> Items are text. `store.get("visits").unwrapOr("0")` then `.tryAs<int>`.

> [!hint]
> Save with `store.set("visits", "" ++ n).unwrap()`.

```osl solution
import "std:save"

auto store = save.open("docs-save-demo").unwrap()
for key in store.keys().unwrap() (
  store.remove(key).unwrap()
)

def visit() int (
  int n = store.get("visits").unwrapOr("0").tryAs<int>.unwrapOr(0) + 1
  store.set("visits", "" ++ n).unwrap()
  return n
)

log visit() visit() visit()
```

```output
1 2 3
```
:::

## API reference

::api
