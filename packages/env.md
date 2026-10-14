# env

Use `env` to read and set environment variables, and to load, edit and save `.env` files.

```osl
import "std:env"
```

## Example

```osl
import "std:env"

env.load()

int port = env.int("PORT", 3000)
boolean debug = env.bool("DEBUG", false)
string name = env.get("NAME", "app")
string apiKey = env.require("API_KEY")

log name ++ " on port " ++ port
if debug ( log "API key has " ++ apiKey.len ++ " characters" )
```

`env.load()` reads `.env` and fails with `NotFoundError` when it doesn't exist. `env.int` falls back
to 3000 when `PORT` is unset, but fails with `ParseError` when it is set to something like `abc`.
`env.require` fails with `NotFoundError` when `API_KEY` is unset or empty. Used as plain values, these
results throw on failure. Use `.unwrapOr(...)`, `catch`, or `try(...)` to handle one instead:

```osl
env.load() catch (err) (
  log "no .env file, using the environment as is"
)
```

## Environment variables

| Function | Returns | Notes |
| --- | --- | --- |
| `env.get(key, fallback?)` | `string` | The value, or `fallback` (`""` without one) when it is unset or empty. |
| `env.has(key)` | `boolean` | Whether the variable is set, even to `""`. |
| `env.int(key, fallback)` | `result<int, error>` | The value as a whole number, or `fallback` when unset or blank. Fails with `ParseError` for anything else. |
| `env.number(key, fallback)` | `result<number, error>` | The value as a number, like `env.int`. |
| `env.bool(key, fallback)` | `result<boolean, error>` | `1`, `true`, `t`, `yes`, `y` and `on` are true; `0`, `false`, `f`, `no`, `n` and `off` are false, in any case. `fallback` when unset or blank; `ParseError` for anything else. |
| `env.require(key)` | `result<string, error>` | The value. Fails with `NotFoundError` when it is unset or empty. |
| `env.required(...keys)` | `result<unit, error>` | Fails with `NotFoundError` naming every listed variable that is unset or empty. |
| `env.missing(...keys)` | `string[]` | The listed variables that are unset or empty, in the order given. |
| `env.set(key, value)` | `result<unit, error>` | Sets a variable for this program and the processes it starts. Throws `ValueError` for an empty name or one containing `=`. |
| `env.unset(key)` | `result<unit, error>` | Removes a variable. Removing one that isn't set does nothing. Throws `ValueError` like `set`. |
| `env.all()` | `object` | Every variable, as an object of strings. |
| `env.keys()` | `string[]` | Every variable name, sorted. |
| `env.expand(text)` | `string` | Replaces `$NAME` and `${NAME}` with variables; unset ones become `""`. |
| `env.mode()` | `string` | The first of `APP_ENV`, `OSL_ENV` and `NODE_ENV` that is set, lowercased, or `"development"`. |
| `env.isDev()` | `boolean` | Whether `env.mode()` is `"dev"` or `"development"`. |
| `env.isProd()` | `boolean` | Whether `env.mode()` is `"prod"` or `"production"`. |
| `env.isTest()` | `boolean` | Whether `env.mode()` is `"test"` or `"testing"`. |

## .env files

| Function | Returns | Notes |
| --- | --- | --- |
| `env.load(...paths)` | `result<unit, error>` | Reads the files (`.env` when none are given) and sets their variables, keeping any that are already set. Every readable file is applied in order, then the call fails with the first error: `NotFoundError` for a missing file, `PermissionError` or `IOError` for an unreadable one, `ValueError` for a key the OS rejects. |
| `env.parseFile(path)` | `result<*env.File, error>` | Reads a `.env` file into a handle that remembers its path. Fails with `NotFoundError`, `PermissionError` or `IOError`. |
| `env.parse(text)` | `*env.File` | Reads `.env` text into a handle with no path. |
| `env.from(values)` | `*env.File` | Builds a handle with no path from an object. Values become strings. |
| `env.stringify(values)` | `string` | Formats an object as `.env` text: one `KEY=value` line per key, sorted, quoting values that need it. |

To load a file and replace variables that are already set, use
`env.parseFile(path).apply({override: true})`.

```osl
auto file = env.parseFile(".env")
log file.get("PORT", "3000")

file.set("PORT", 9090).unset("DEBUG")
file.save()
```

### `*env.File` methods

Reading values:

| Method | Returns | Notes |
| --- | --- | --- |
| `file.get(key, fallback?)` | `string` | The value, or `fallback` (`""` without one) when it is missing or empty. |
| `file.has(key)` | `boolean` | Whether the file has the key, even with an empty value. |
| `file.int(key, fallback)` | `result<int, error>` | Like `env.int`. |
| `file.number(key, fallback)` | `result<number, error>` | Like `env.number`. |
| `file.bool(key, fallback)` | `result<boolean, error>` | Like `env.bool`. |
| `file.expand(key)` | `string` | The value with `$NAME` and `${NAME}` replaced, first from the file's own values (recursively, ignoring cycles), then from the environment. `\$` stays a literal `$`. |
| `file.all()` | `object` | Every value, as an object of strings. |
| `file.keys()` | `string[]` | The key names, sorted. |
| `file.text()` | `string` | The values as `.env` text, like `env.stringify`. |

Changing values (each mutates the handle and returns it, so calls chain):

| Method | Returns | Notes |
| --- | --- | --- |
| `file.set(key, value)` | `*env.File` | Sets a value. Non-strings are stored as their string form. Throws `ValueError` for an empty key. |
| `file.unset(key)` | `*env.File` | Removes a key. |
| `file.clear()` | `*env.File` | Removes every key. |
| `file.merge(values)` | `*env.File` | Sets every key of an object. Blank keys are skipped. |
| `file.setPath(path)` | `*env.File` | Sets the path `read` and `save` use. An empty path means `".env"`. |

Files and the environment:

| Method | Returns | Notes |
| --- | --- | --- |
| `file.path()` | `string` | The file's path, or `""` when it has none. |
| `file.read()` | `result<unit, error>` | Replaces the values with the contents of `file.path()`. Fails with `NotFoundError`, `PermissionError` or `IOError`, leaving the values unchanged. |
| `file.save()` | `result<unit, error>` | Writes the values to `file.path()` as `.env` text. Fails with `NotFoundError` when the directory doesn't exist, `PermissionError` or `IOError`. |
| `file.apply(options?)` | `result<unit, error>` | Sets every value as an environment variable. Option `override` (default `false`) also replaces variables that are already set. Fails with `ValueError` for a key the OS rejects, after setting the others. |

`read` and `save` throw `StateError` when the file has no path.

## Deprecated

These still work for one release, with an `OSL-DEPRECATED` warning at each call. The old typed
getters return the default for a malformed value instead of failing.

| Deprecated | Use instead |
| --- | --- |
| `env.getDefault(key, def)` | `env.get(key, def)` |
| `env.getInt(key, def)` | `env.int(key, def)` |
| `env.getFloat(key, def)` | `env.number(key, def)` |
| `env.getBool(key, def)` | `env.bool(key, def)` |
| `env.value(key)` and its `key`, `exists`, `string`, `fallback`, `int`, `float`, `bool` methods | `env.get`, `env.has`, `env.int`, `env.number`, `env.bool` |
| `env.overload(...paths)` | `env.parseFile(path).apply({override: true})` |
| `env.local()` | `env.load()` |
| `env.localOverload()` | `env.parseFile(".env").apply({override: true})` |
| `env.read(path)` | `env.parseFile(path)`, which fails when the file can't be read |
| `env.file(path)` | `env.from({}).setPath(path)`, or `env.parseFile(path)` for a file that exists |
| `env.home()` | `sys.homeDir()` |
| `env.cwd()` | `process.cwd()` |
| `file.value(key)` | `file.get`, `file.has`, `file.int`, `file.number`, `file.bool` |
| `file.getDefault`, `file.getInt`, `file.getFloat`, `file.getBool` | `file.get`, `file.int`, `file.number`, `file.bool` |
| `file.loaded()` | `env.parseFile` and `file.read()` now fail when the file can't be read |
| `file.load()` | `file.read()` then `file.apply()` |
| `file.overload()` | `file.read()` then `file.apply({override: true})` |
| `file.applyOverload()` | `file.apply({override: true})` |

## Behavior and limits

The older `import "osl/env"` spelling still works, with a migration warning.

The parser accepts a UTF-8 BOM, CRLF line endings, and quoted values. Text output quotes values that
contain whitespace, `#`, or quote characters, including backticks, so they parse back unchanged.
When a file repeats a key, the later value wins. `env.set`, `env.unset` and `apply` change the
environment for the whole program, and the change is safe across threads.
