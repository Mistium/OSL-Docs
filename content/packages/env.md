---
description: Read configuration from environment variables and .env files, with typed reads, required settings and defaults.
package: env
---

# env

`std:env` reads and sets environment variables and works with `.env` files. Use it for configuration that changes between machines: ports, API keys, database paths, a development or production mode. Secrets in the environment stay out of your source and your repository. The examples set their own variables; in a real program they come from the shell, a service manager or a `.env` file.

## Read a variable

`env.get(name)` returns the value as a string, or an empty string when it is unset. Give a second argument for a default. `env.has(name)` tells a variable that is set from one that isn't, even when it is set to an empty value:

```osl
import "std:env"

env.set("DOCS_NAME", "ada").unwrap()

log env.get("DOCS_NAME")
log "[" ++ env.get("DOCS_UNSET") ++ "]"
log env.get("DOCS_UNSET", "fallback")
log env.has("DOCS_NAME") env.has("DOCS_UNSET")

env.unset("DOCS_NAME").unwrap()
log env.has("DOCS_NAME")
```

```output
ada
[]
fallback
true false
false
```

`env.set` and `env.unset` change the variable for this program and the programs it starts. They don't change your shell. `set` returns a result because the system can refuse a name it doesn't allow.

## Typed reads

Environment variables are text. `env.int`, `env.number` and `env.bool` convert and take a fallback for an unset variable. A value that is set but isn't the right type is an error, which is better than silently using a default when someone mistyped a port:

```osl
import "std:env"

env.set("DOCS_PORT", "8080").unwrap()
env.set("DOCS_RATIO", "0.75").unwrap()
env.set("DOCS_DEBUG", "yes").unwrap()
env.set("DOCS_BAD", "eighty").unwrap()

log env.int("DOCS_PORT", 3000).unwrap()
log env.int("DOCS_UNSET", 3000).unwrap()
log env.number("DOCS_RATIO", 1).unwrap()
log env.bool("DOCS_DEBUG", false).unwrap()

auto bad = env.int("DOCS_BAD", 3000)
log bad.isErr() bad.unwrapErr().kind
```

```output
8080
3000
0.75
true
true ParseError
```

Booleans accept `1`, `true`, `t`, `yes`, `y` and `on` as true, and `0`, `false`, `f`, `no`, `n` and `off` as false, in any case.

## Required settings

`env.require(name)` returns the value, or an error naming the missing variable. `env.required(...)` checks several at once, and `env.missing(...)` lists the ones that are absent, so a program can report every problem in one go and stop at the start instead of failing halfway:

```osl
import "std:env"

env.set("DOCS_DB", "app.db").unwrap()

log env.require("DOCS_DB").unwrap()
log env.require("DOCS_TOKEN").unwrapErr().message
log env.missing("DOCS_DB", "DOCS_TOKEN", "DOCS_SECRET")

switch env.required("DOCS_DB", "DOCS_TOKEN") (
  case ok(_)
    log "configured"
  case err(e)
    log "cannot start:" e.message
)
```

```output
app.db
env.require: DOCS_TOKEN is not set
["DOCS_TOKEN","DOCS_SECRET"]
cannot start: env.required: DOCS_TOKEN is not set
```

A variable set to an empty string counts as not set for `require`, `required` and `missing`.

## Expanding references

`env.expand(text)` replaces `$NAME` and `${NAME}` with the variables' values, which is handy for paths from a config file:

```osl
import "std:env"

env.set("DOCS_HOME", "/srv/app").unwrap()
env.set("DOCS_PORT", "8080").unwrap()

log env.expand("$DOCS_HOME/data on port ${DOCS_PORT}")
```

```output
/srv/app/data on port 8080
```

## Parsing .env text

A `.env` file holds `NAME=value` lines, with comments after `#`, optional quotes and an optional `export`. `env.parse(text)` reads that text into a file handle without touching the real environment:

```osl
import "std:env"

string text = "# database\nHOST=localhost\nNAME=\"my app\"\nURL=$HOST/db\nexport PORT=5432\n"
auto config = env.parse(text)

log config.keys()
log config.get("NAME")
log config.int("PORT", 0).unwrap()
log config.expand("URL")
log config.get("MISSING", "none")
log config.all()
```

```output
["HOST","NAME","PORT","URL"]
my app
5432
localhost/db
none
{"HOST":"localhost","NAME":"my app","PORT":"5432","URL":"$HOST/db"}
```

A file handle has the same reads as the package (`get`, `int`, `number`, `bool`, `has`, `keys`, `expand`). Values are kept as written, and `expand(key)` resolves references to other values in the file first, then to the environment.

## Load a .env file

`env.load(path)` reads a `.env` file and sets its values as environment variables. It leaves alone variables that are already set, so a real environment wins over the file. With no path it reads `.env`:

```osl
import "std:env"
import "std:fs"

fs.writeFile(".env.demo", "DOCS_GREETING=hello\nDOCS_LEVEL=3\n").unwrap()

env.unset("DOCS_GREETING").unwrap()
env.set("DOCS_LEVEL", "9").unwrap()
env.load(".env.demo").unwrap()

log env.get("DOCS_GREETING")
log env.get("DOCS_LEVEL")

log env.load("does-not-exist.env").unwrapErr().kind
fs.remove(".env.demo", {force: true}).unwrap()
```

```output
hello
9
NotFoundError
```

`DOCS_LEVEL` kept its value of 9. To make the file win, parse it and call `apply({override: true})`:

```osl
import "std:env"

env.set("DOCS_MODE", "old").unwrap()
auto file = env.parse("DOCS_MODE=new")

file.apply().unwrap()
log env.get("DOCS_MODE")
file.apply({override: true}).unwrap()
log env.get("DOCS_MODE")
```

```output
old
new
```

Never commit a `.env` file that holds secrets. Commit a `.env.example` with the names and no values.

## Editing and saving a .env file

A file handle can be changed and written back. `set`, `unset` and `merge` return the handle, so calls chain, and `save()` writes to the handle's path:

```osl
import "std:env"
import "std:fs"

fs.remove(".env.edit", {force: true}).unwrap()

auto file = env.parse("A=1\nB=2\n")
file.set("C", 3).merge({D: "four words"}).unset("A")
log file.text()

file.setPath(".env.edit")
file.save().unwrap()

auto again = env.parseFile(".env.edit").unwrap()
log again.keys()
log again.path()
fs.remove(".env.edit", {force: true}).unwrap()
```

```output
B=2
C=3
D="four words"

["B","C","D"]
.env.edit
```

`env.stringify(object)` formats an object as `.env` text without a handle.

## Modes

`env.mode()` reports the app's mode from `APP_ENV`, `OSL_ENV` or `NODE_ENV`, in that order, and is `development` when none is set. `isDev()`, `isProd()` and `isTest()` test it, which lets a program turn on debug output or strict settings without its own convention:

```osl
import "std:env"

env.set("APP_ENV", "production").unwrap()
log env.mode()
log env.isProd() env.isDev() env.isTest()
```

```output
production
true false false
```

:::quiz
`DOCS_PORT` is set to `eighty`. What does `env.int("DOCS_PORT", 3000)` give?

- [ ] `3000`, the fallback.
- [x] A failed result with a `ParseError`.
- [ ] `0`.

The fallback is for a variable that is unset. A value that is set but wrong is an error you should see.
:::

:::exercise title="Port from the environment"
Print the port the program would use: the `EX_PORT` variable as an integer, or 8080 when unset. Then set it to `9000` and print again, then to `abc` and print 8080 for the bad value too.

```osl
import "std:env"

env.unset("EX_PORT").unwrap()
log 0
```

```output
8080
9000
8080
```

> [!hint]
> `env.int("EX_PORT", 8080)` returns a result.

> [!hint]
> `env.set("EX_PORT", "9000").unwrap()` between reads, and `.unwrapOr(8080)` covers the bad value.

```osl solution
import "std:env"

env.unset("EX_PORT").unwrap()
log env.int("EX_PORT", 8080).unwrapOr(8080)
env.set("EX_PORT", "9000").unwrap()
log env.int("EX_PORT", 8080).unwrapOr(8080)
env.set("EX_PORT", "abc").unwrap()
log env.int("EX_PORT", 8080).unwrapOr(8080)
```

```output
8080
9000
8080
```
:::

## API reference

::api
