---
description: Describe what valid data looks like, then check and clean untrusted values and list every problem at once.
package: schema
---

# schema

`schema` checks data whose shape you don't control: a request body, a config file, a form. You build a schema out of small parts (`string`, `integer`, `object`, `array`), then ask it to `parse` a value. A good value comes back cleaned up, a bad one is reported with the path to the problem.

Reach for it when [`json.parse<T>`](json.md) is too rigid: values that can be one of several kinds, rules such as "at least 3 characters", or error messages you want to show users.

## A first schema

Schemas are values. `schema.object` takes the shape you expect, and `parse` returns the value if it fits.

```osl
import "std:schema"

auto user = schema.object({
  name: schema.string(),
  age: schema.integer().min(0)
})

auto ok = user.parse({name: "Ada", age: 36})
log ok.name ok.age
log user.isValid({name: "Ada", age: -1})
log user.isValid({name: "Ada"})
```

```output
Ada 36
false
false
```

`isValid` gives a yes or no. A key that isn't marked optional is required, so a missing `age` fails.

Try it: change `age` to `36.5` and check `isValid`. An integer schema wants whole numbers.

## Failure with parse

`parse` throws a `ValueError` that names the path of the first problem. Wrap the call in `try` to get a [result](../learn/errors.md) instead.

```osl
import "std:schema"

auto user = schema.object({name: schema.string(), age: schema.integer()})

switch try(user.parse({name: "Ada", age: "old"})) (
  case ok(v)
    log "fine"
  case err(e)
    log e.kind
    log e.message
)
```

```output
ValueError
schema.Schema.parse: age: Expected number, received string
```

## List every problem

When the user needs to fix a whole form, one error at a time is tedious. `issues` checks everything and returns a record per problem, each with a `path` (object keys and 1-based array positions) and a `message`. An empty list means the value is valid.

```osl
import "std:schema"

auto order = schema.object({
  customer: schema.string().minLen(2),
  items: schema.array(schema.object({
    sku: schema.string(),
    qty: schema.integer().min(1)
  }))
})

auto bad = {customer: "X", items: [{sku: "a", qty: 2}, {sku: "b", qty: 0}, {qty: 1}]}
for issue in order.issues(bad) (
  log issue.path issue.message
)
log order.issues({customer: "Ada", items: []}).len
```

```output
["customer"] Expected length at least 2
["items",2,"qty"] Expected at least 1
["items",3,"sku"] Required
0
```

## Clean up while you check

`parse` returns the value normalised, not just approved. `trim` removes surrounding whitespace, `defaultValue` fills in a missing key, and `oneOrMany` accepts one item or a list and always gives you a list.

```osl
import "std:schema"

auto signup = schema.object({
  email: schema.string().trim(),
  newsletter: schema.boolean().defaultValue(false),
  tags: schema.oneOrMany(schema.string())
})

auto a = signup.parse({email: "  ada@example.com ", tags: "math"})
log a.email "|" a.newsletter "|" a.tags
auto b = signup.parse({email: "bob@example.com", newsletter: true, tags: ["x", "y"]})
log b.newsletter b.tags
```

```output
ada@example.com | false | ["math"]
true ["x","y"]
```

## Optional, nullable and strict

`optional` allows a missing key (or null), `nullable` allows null, and `strict` rejects keys the shape doesn't mention. By default unknown keys pass through, which is kind to newer clients but means you should not trust them. Use `strict` when you'd rather refuse.

```osl
import "std:schema"

auto s = schema.object({id: schema.integer(), note: schema.string().optional()})
log s.isValid({id: 1})
log s.isValid({id: 1, note: null})
log s.isValid({id: 1, extra: true})
log s.strict().isValid({id: 1, extra: true})
log s.strict().parse({id: 1, note: "hi"}).note
```

```output
true
true
true
false
hi
```

Try it: add `.strict()` to `s` before the first `isValid`.

## Limits and choices

Numbers have `min`, `max`, `gt` and `lt`. Strings, arrays and objects have `minLen`, `maxLen` and `length`. `enum` and `literal` accept fixed values, and `union` takes the first schema that matches.

```osl
import "std:schema"

auto level = schema.enum(["low", "mid", "high"])
log level.isValid("mid") level.isValid("max")

auto id = schema.union([schema.integer(), schema.string().minLen(3)])
log id.isValid(5) id.isValid("abc") id.isValid("ab") id.isValid(true)

auto pct = schema.number().min(0).max(100)
log pct.isValid(99.5) pct.isValid(100.1)
```

```output
true false
true true false false
true false
```

Try it: add `"mid"` to the enum values, then check `"max"`.

## Maps with record

`record` is for objects whose keys you can't list but whose values all look alike, such as a map from name to score.

```osl
import "std:schema"

auto scores = schema.record(schema.integer().min(0))
log scores.isValid({ada: 10, bob: 7})
log scores.issues({ada: 10, bob: -3, cy: "x"}).len
```

```output
true
2
```

## Combining schemas

Schemas are immutable: every method returns a new one. That makes it easy to build variations. `extend` adds fields, `partial` makes every field optional (useful for a PATCH request), and `requireAny` demands at least one of several fields.

```osl
import "std:schema"

auto base = schema.object({name: schema.string(), email: schema.string()})
auto admin = base.extend({role: schema.enum(["admin", "owner"])})
auto patch = base.partial().requireAny(["name", "email"])

log base.isValid({name: "A", email: "a@x"})
log admin.isValid({name: "A", email: "a@x"})
log patch.isValid({email: "new@x"})
log patch.isValid({})
```

```output
true
false
true
false
```

## Validating JSON from outside

Put the pieces together: parse untrusted text with [json](json.md), then validate before using it.

```osl
import "std:json"
import "std:schema"

auto request = schema.object({
  action: schema.enum(["start", "stop"]),
  count: schema.integer().min(1).defaultValue(1)
})

for text in [`{"action": "start"}`, `{"action": "fly", "count": 0}`] (
  auto doc = json.parse(text).unwrap()
  auto problems = request.issues(doc)
  if problems.len > 0 (
    log "rejected:" problems.map(p -> p.path.join(".") ++ " " ++ p.message)
    continue
  )
  auto req = request.parse(doc)
  log req.action req.count
)
```

```output
start 1
rejected: ["action Expected one of [start stop], received fly","count Expected at least 1"]
```

:::quiz
What is the difference between `parse` and `issues`?

- [ ] `parse` returns a result, `issues` throws.
- [x] `parse` throws on the first problem, `issues` lists every problem.
- [ ] They do the same thing.

Use `issues` when the person needs to fix a whole form at once. `parse` stops at the first problem.
:::

:::exercise title="Check a signup"
Print the path of every problem in the value, one per line, then `valid` or `invalid`.

```osl
import "std:schema"

auto signup = schema.object({
  name: schema.string().minLen(2),
  age: schema.integer().min(0)
})
log signup.isValid({name: "A", age: -1})
```

```output
["age"]
["name"]
invalid
```

> [!hint]
> `signup.issues(value)` returns a list of records with a `path`.

> [!hint]
> `isValid` gives the final word.

```osl solution
import "std:schema"

auto signup = schema.object({
  name: schema.string().minLen(2),
  age: schema.integer().min(0)
})
auto value = {name: "A", age: -1}
for p in signup.issues(value) ( log p.path )
if signup.isValid(value) ( log "valid" ) else ( log "invalid" )
```

```output
["age"]
["name"]
invalid
```
:::

## API reference

::api
