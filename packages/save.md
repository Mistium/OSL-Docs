# save

Use `save` to keep small named pieces of text between runs, without designing a database schema.
Each app gets its own directory under `~/.osl/apps`.

```osl
import "std:save"
```

## Example

```osl
import "std:save"

auto store = save.open("my-app")

store.set("theme", "dark")
log store.get("theme")

string sound = store.get("sound").unwrapOr("on")
log sound
```

## API reference

### `save`

| Function | Returns | Notes |
| --- | --- | --- |
| `save.open(appName)` | `result<*save.Store, error>` | The store for an app, creating `~/.osl/apps/<appName>` if needed. Throws `ValueError` when `appName` isn't a plain file name. Fails with `NotFoundError` when the home directory isn't known, `PermissionError` or `IOError`. |

### `*save.Store` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `store.set(name, text)` | `result<unit, error>` | Stores text under `name`, replacing any earlier value atomically. Fails with `PermissionError` or `IOError`. |
| `store.get(name)` | `result<string, error>` | The text stored under `name`. Fails with `NotFoundError` when there is no such item. |
| `store.has(name)` | `boolean` | Whether an item is stored under `name`. An invalid name has no item. |
| `store.remove(name)` | `result<unit, error>` | Deletes an item. Fails with `NotFoundError` when there is no such item. |
| `store.keys()` | `result<string[], error>` | The stored items' file names, such as `"theme.txt"`, sorted. Fails with `NotFoundError` when the store's directory has been deleted. |
| `store.path(name)` | `string` | The file an item is stored in. |
| `store.dir()` | `string` | The store's directory. |

Each item is one file in the store's directory. A name without an extension is stored as
`name.txt`, so `"theme"` and `"theme.txt"` are the same item. Names must be plain file names:
`set`, `get`, `remove` and `path` throw `ValueError` for a name with slashes or a trailing `.`.

To store structured data, convert it to text first, for example with
`json.stringify(value)` and `json.parse(text)` from [`json`](json.md).

## Changes from earlier versions

The shared store and `save.init` are gone: open a store with `save.open(appName)` and call its
methods. `setItem` and `getItem` are now `store.set` and `store.get`, `exists` is `store.has`, and
`all` is `store.keys`.

## Behavior and limits

The older `import "osl/save"` spelling still works, with a migration warning.

Stores opened for different apps are independent. `set` writes like `fs.writeFile`, so a reader
sees either the old or the new text, never a mix.
