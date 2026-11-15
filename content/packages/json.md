---
description: Parse JSON text into structs and values, write it back out, and read huge files one token at a time.
package: json
---

# json

`json` reads and writes JSON. Reach for it when you talk to a web API, read a config file, or store data another program will read. It can turn text into a typed struct, into plain objects and arrays, or into a stream of tokens when the file is too big to hold in memory.

```osl fragment
import "std:json"
```

## Parse into a struct

The best way to read JSON is to say what shape you expect. `json.parse<T>` checks the text against the type `T` and returns a [result](../learn/errors.md): the value if it fits, an error if it doesn't.

```osl
import "std:json"

struct User (
  string name = ""
  int age = 0
  string[] tags = []
)

User u = json.parse<User>(`{"name": "Grace", "age": 85, "tags": ["navy", "compilers"]}`).unwrap()
log u.name u.age u.tags
log u.tags.len
```

```output
Grace 85 ["navy","compilers"]
2
```

Keys the struct doesn't declare are ignored, and keys missing from the JSON keep the field's default. Nested structs and arrays of structs work the same way.

```osl
import "std:json"

struct Address (
  string city = ""
  string country = "unknown"
)

struct Person (
  string name = ""
  Address home = Address()
  Address[] visited = []
)

string text = `{
  "name": "Ada",
  "home": {"city": "London"},
  "visited": [{"city": "Turin", "country": "Italy"}, {"city": "Paris"}],
  "extra": true
}`

Person p = json.parse<Person>(text).unwrap()
log p.home.city p.home.country
for v in p.visited ( log v.city "-" v.country )
```

```output
London unknown
Turin - Italy
Paris - unknown
```

Try it: add a `boolean admin = false` field to `User` and an `"admin": true` key to the text, then log `u.admin`.

## When the JSON does not fit

A wrong type is an error that names the struct and the field. Invalid JSON is a `ParseError` that says where it broke. Handle both with `switch` or `catch`:

```osl
import "std:json"

struct User (
  string name = ""
  int age = 0
)

string[] inputs = [`{"name": "Bob", "age": "old"}`, `{"name": "Bob",}`, `[1, 2]`, ``]
for text in inputs (
  switch json.parse<User>(text) (
    case ok(u)
      log "ok" u.name
    case err(e)
      log e.kind ":" e.message
  )
)
```

```output
ParseError : Expected int, got string at ["age"] in User
ParseError : json.parse: line 1, column 16: unexpected "}" after ",": JSON has no trailing commas
ParseError : Expected User, got array
```

Parsing is strict. Duplicate keys, trailing commas, numbers out of range and anything after the document are all errors, so a document that parses is one you can trust.

Try it: change `"old"` to `30` and see the first input succeed.

## Parse into plain values

When you don't know the shape in advance, leave out the type. `json.parse(text)` gives objects, arrays, strings, numbers, booleans and `null` as OSL values.

```osl
import "std:json"

auto doc = json.parse(`{"id": 7, "tags": ["a", "b"], "meta": {"ok": true}}`).unwrap()
log doc.id
log doc.tags[1]
log doc.meta.ok
log doc.missing
```

```output
7
a
true
null
```

Pass `{type: "object"}` or `{type: "array"}` to insist on the kind of root value. `isValid`, `isObject` and `isArray` answer yes or no without building anything, which is handy for checking input before you route it.

```osl
import "std:json"

log json.isValid(`{"a": 1}`) json.isValid("{a: 1}")
log json.isObject(`{"a": 1}`) json.isArray(`{"a": 1}`)
log json.parse("[1, 2]", {type: "object"}).isErr()
```

```output
true false
true false
true
```

## Write JSON

`json.stringify` turns any value into JSON text. Object keys come out in sorted order, so the same data always gives the same text. That makes the output safe to compare, diff and commit.

```osl
import "std:json"

struct Point (
  int x = 0
  int y = 0
)

log json.stringify({name: "osl", version: 9, tags: ["go", "fast"], ok: true})
log json.stringify(Point(3, 4))
log json.stringify("a \"quoted\" line\n")
log json.stringify([1, 2.5, null])
```

```output
{"name":"osl","ok":true,"tags":["go","fast"],"version":9}
{"x":3,"y":4}
"a \"quoted\" line\n"
[1,2.5,null]
```

Give it `indent` for text people will read:

```osl
import "std:json"

auto data = {name: "osl", tags: ["go", "fast"], nested: {a: 1}}
log json.stringify(data, {indent: 2})
```

```output
{
  "name": "osl",
  "nested": {
    "a": 1
  },
  "tags": [
    "go",
    "fast"
  ]
}
```

Structs keep their fields in declaration order; plain objects are sorted. Values JSON can't hold, such as `NaN`, infinity or a function, throw instead of writing something wrong.

Try it: add a nested object to the first value and watch the keys stay sorted.

## Round trips

Parse and stringify are inverses for data that fits a struct. A common pattern is to read a typed value, change it and write it back:

```osl
import "std:json"

struct Settings (
  string theme = "light"
  int fontSize = 12
)

Settings s = json.parse<Settings>(`{"theme": "dark"}`).unwrap()
s.fontSize += 2
log json.stringify(s)
Settings again = json.parse<Settings>(json.stringify(s)).unwrap()
log again.theme again.fontSize
```

```output
{"theme":"dark","fontSize":14}
dark 14
```

## Files

`json.parseFile(path)` reads and parses a file in one step, with the same options as `parse`. Write the file with [fs](fs.md). A missing file and an invalid file are different errors, so you can tell the user which one went wrong.

```osl
import "std:json"
import "std:fs"

fs.writeFile("config.json", json.stringify({port: 8080, debug: false}, {indent: 2})).unwrap()
fs.writeFile("broken.json", "{\"port\": ").unwrap()

auto config = json.parseFile("config.json").unwrap()
log config.port

for path in ["missing.json", "broken.json"] (
  switch json.parseFile(path) (
    case ok(v)
      log "loaded" path
    case err(e)
      log path e.kind
  )
)
```

```output
8080
missing.json NotFoundError
broken.json ParseError
```

To get a typed value from a file, read the text and use `parse<T>`:

```osl
import "std:json"
import "std:fs"

struct Config (
  int port = 80
  boolean debug = false
)

fs.writeFile("typed.json", `{"port": 9000}`).unwrap()
Config c = json.parse<Config>(fs.readFile("typed.json").unwrap()).unwrap()
log c.port c.debug
```

```output
9000 false
```

Try it: change `broken.json` into valid JSON and see it load.

## Streaming large files

`parse` builds the whole document in memory. For a file of hundreds of megabytes, `json.open` gives you a stream that reads one token at a time. `events()` yields records with a `type`, a `value` and the nesting `depth`.

```osl
import "std:json"
import "std:fs"

fs.writeFile("small.json", `{"name": "osl", "tags": ["a", "b"], "n": 3}`).unwrap()

auto stream = json.open("small.json").unwrap()
for ev in stream.events() (
  log ev.depth ev.type ev.value
)
stream.close().unwrap()
```

```output
0 object-start null
1 key name
1 string osl
1 key tags
1 array-start null
2 string a
2 string b
1 array-end null
1 key n
1 number 3
0 object-end null
```

The usual job is to look only at the parts you care about. This one adds up the `id` of every record in a file and steps over each `payload` with `skip()`, so the bulky parts are never decoded. After a `key` event, `skip()` skips that key's value.

```osl
import "std:json"
import "std:fs"

string[] rows = []
for i in 1 to 5 ( rows.append(`{"id": ${i}, "payload": {"deep": [1, 2, 3]}}`) )
fs.writeFile("rows.json", "[" ++ rows.join(",") ++ "]").unwrap()

auto s = json.open("rows.json", {maxBytes: 1000000}).unwrap()
int total = 0
int records = 0
for ev in s.events() (
  if ev.type == "object-start" ( records++ )
  if ev.type == "key" and ev.value == "payload" (
    s.skip().unwrap()
  )
  if ev.type == "number" ( total += ev.value )
)
s.close().unwrap()
log records "records, ids add up to" total
```

```output
5 records, ids add up to 15
```

`readObject()` reads the next object whose values are plain strings, numbers, booleans or null, and returns it directly:

```osl
import "std:json"
import "std:fs"

fs.writeFile("flat.json", `{"a": 1, "b": "two", "c": null}`).unwrap()
auto s = json.open("flat.json").unwrap()
auto obj = s.readObject().unwrap()
log obj.a obj.b obj.c
s.close().unwrap()
```

```output
1 two null
```

`maxBytes` makes `open` and `readObject`'s `maxKeys` refuse input that is bigger than you are willing to handle, which matters when the file comes from someone else.

:::exercise title="Summarise a config"
Parse the JSON text into a `Config` struct. Print the app name, then each server on its own line as `host:port`. If a server has no port, use `80`. Finally print how many servers there are.

```osl
import "std:json"

struct Server (
  string host = ""
  int port = 80
)

struct Config (
  string app = ""
  Server[] servers = []
)

string text = `{"app": "shop", "servers": [{"host": "a.example", "port": 8080}, {"host": "b.example"}]}`
log text.len
```

```output
shop
a.example:8080
b.example:80
2
```

> [!hint]
> `json.parse<Config>(text).unwrap()` gives you the struct.

> [!hint]
> Loop over `c.servers` and build each line with `++`.

```osl solution
import "std:json"

struct Server (
  string host = ""
  int port = 80
)

struct Config (
  string app = ""
  Server[] servers = []
)

string text = `{"app": "shop", "servers": [{"host": "a.example", "port": 8080}, {"host": "b.example"}]}`
Config c = json.parse<Config>(text).unwrap()
log c.app
for s in c.servers ( log s.host ++ ":" ++ s.port )
log c.servers.len
```

```output
shop
a.example:8080
b.example:80
2
```
:::

:::quiz
A struct has `int age = 0`. What does `json.parse<User>` do with `{"name": "Bo"}`, which has no `age`?

- [ ] Fails with a `ParseError`.
- [x] Leaves `age` at its default, `0`.
- [ ] Sets `age` to `null`.

Missing keys keep the field's default. Wrong types fail; missing keys don't.
:::

:::exercise title="Which of these are objects?"
Print `object` for each entry that is a valid JSON object and `other` for the rest.

```osl
import "std:json"

string[] inputs = [`{"a": 1}`, `[1, 2]`, `nope`, `{}`]
log inputs.len
```

```output
object
other
other
object
```

> [!hint]
> `json.isObject(text)` answers without building anything.

> [!hint]
> Loop with `for text in inputs`.

```osl solution
import "std:json"

string[] inputs = [`{"a": 1}`, `[1, 2]`, `nope`, `{}`]
for text in inputs (
  if json.isObject(text) ( log "object" ) else ( log "other" )
)
```

```output
object
other
other
object
```
:::

## API reference

::api
