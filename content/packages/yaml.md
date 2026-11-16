---
description: Read and write YAML, the format most config files are written in.
package: yaml
---

# yaml

`yaml` reads and writes YAML. Use it for configuration that people edit by hand: it has comments, no quoting noise and readable nesting. Parsing gives you ordinary OSL values (objects, arrays, strings, numbers), the same ones [json](json.md) gives you, so the code that uses the data doesn't care which format it came from.

```osl fragment
import "std:yaml"
```

## Parse a document

`yaml.parse` returns a [result](../learn/errors.md). Mappings become objects, sequences become arrays, and scalars become strings, numbers, booleans or null.

```osl
import "std:yaml"

string text = `
name: shop
port: 8080
debug: false
owner: ~
tags:
  - web
  - prod
db:
  host: localhost
  pool: 4
`

auto cfg = yaml.parse(text).unwrap()
log cfg.name cfg.port cfg.debug cfg.owner
log cfg.tags[2]
log cfg.db.host cfg.db.pool
```

```output
shop 8080 false null
prod
localhost 4
```

Comments start with `#` and are dropped. An empty document parses to `null`.

Try it: add a `replicas: 3` line to the text and log it.

## Errors

Bad indentation, a duplicate key or an unclosed bracket is a `ParseError`. The message says which line.

```osl
import "std:yaml"

string[] docs = ["a: 1\nb: [1, 2", "a: 1\na: 2", "ok: true"]
for d in docs (
  switch yaml.parse(d) (
    case ok(v)
      log "ok"
    case err(e)
      log e.kind
  )
)
log yaml.isValid("x: 1") yaml.isValid("x: [")
```

```output
ParseError
ParseError
ok
true false
```

Try it: fix the first document's missing bracket and watch `ParseError` disappear.

## Some YAML surprises

YAML guesses types from how a value looks. `yes` is not special here, but `true`, `null`, numbers and `~` are. Quote anything that must stay text. Timestamps are left as the strings you wrote.

```osl
import "std:yaml"

auto v = yaml.parse(`
version: 1.10
code: "007"
when: 2026-11-15
empty:
`).unwrap()
log v.version v.code v.when v.empty
```

```output
1.1 007 2026-11-15 null
```

Note `version: 1.10` became the number `1.1`. If a value is a version or an identifier, quote it in the file.

## Anchors and multi-line text

Anchors (`&name`) and aliases (`*name`) let you reuse a block. Block scalars (`|` keeps newlines, `>` folds them) hold long text.

```osl
import "std:yaml"

auto cfg = yaml.parse(`
defaults: &defaults
  retries: 3
  timeout: 30
prod:
  <<: *defaults
  timeout: 60
banner: |
  Hello
  world
`).unwrap()
log cfg.prod.retries cfg.prod.timeout
log cfg.banner.len
```

```output
3 60
12
```

## Write YAML

`yaml.stringify` turns a value into YAML, with keys in sorted order and a trailing newline. The `indent` option sets the spaces per level (2 to 16, default 4).

```osl
import "std:yaml"

auto data = {name: "shop", ports: [80, 443], db: {host: "localhost", pool: 4}}
log yaml.stringify(data, {indent: 2})
```

```output
db:
  host: localhost
  pool: 4
name: shop
ports:
  - 80
  - 443

```

Strings that would be read back as something else are quoted for you, so `parse(stringify(x))` gives `x` back.

```osl
import "std:yaml"

auto back = yaml.parse(yaml.stringify({a: "true", b: "12", c: "plain"})).unwrap()
log back.a back.b back.c
log back.a == "true"
```

```output
true 12 plain
true
```

Try it: change `indent` to 4 and compare.

## Files

`yaml.parseFile` reads a file. A missing file is `NotFoundError`, a bad one is `ParseError`.

```osl
import "std:yaml"
import "std:fs"

fs.writeFile("app.yaml", yaml.stringify({name: "demo", workers: 2})).unwrap()
auto app = yaml.parseFile("app.yaml").unwrap()
log app.name app.workers
log yaml.parseFile("nope.yaml").unwrapErr().kind
```

```output
demo 2
NotFoundError
```

## Converting between formats

Because every format gives the same values, converting is a parse and a stringify:

```osl
import "std:yaml"
import "std:json"

auto doc = yaml.parse("a: 1\nlist:\n  - x\n  - y\n").unwrap()
log json.stringify(doc)
```

```output
{"a":1,"list":["x","y"]}
```

:::quiz
In YAML, `version: 1.10` is read as...

- [ ] The string `1.10`.
- [x] The number `1.1`.
- [ ] An error.

YAML guesses types from how a value looks. Quote it (`"1.10"`) to keep it as text.
:::

:::exercise title="Add up the ports"
Parse the YAML and print the name, then the sum of the ports.

```osl
import "std:yaml"

string text = "name: demo\nports:\n  - 80\n  - 443\n"
log text.len
```

```output
demo 523
```

> [!hint]
> `yaml.parse(text).unwrap()` gives an object.

> [!hint]
> `cfg.ports[1]` is the first port.

```osl solution
import "std:yaml"

string text = "name: demo\nports:\n  - 80\n  - 443\n"
auto cfg = yaml.parse(text).unwrap()
log cfg.name cfg.ports[1] + cfg.ports[2]
```

```output
demo 523
```
:::

## API reference

::api
