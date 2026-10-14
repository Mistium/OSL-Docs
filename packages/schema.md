# schema

Use `schema` to validate and normalize unknown values, nested objects, and arrays. Schemas are reusable and immutable: every modifier returns a new schema and leaves the original unchanged.

```osl
import "std:schema"
```

## Example

```osl
import "std:schema"

*schema.Schema createUser = schema.object({
  name: schema.string().trim().minLen(1),
  age: schema.integer().min(0).optional(),
  roles: schema.array(schema.enum(["admin", "member"]))
})

object user = createUser.parse({name: "  Ada ", roles: ["admin"]})
log user // {"name":"Ada","roles":["admin"]}

for issue in createUser.issues({name: "", age: -1, roles: ["owner"]}) (
  log issue.path.join(".") ++ ": " ++ issue.message
)
// age: Expected at least 0
// name: Expected length at least 1
// roles.1: Expected one of [admin member], received owner
```

## Validating values

| Method | Returns | Notes |
| --- | --- | --- |
| `s.parse(value: any)` | `any` | Validates and returns the normalized value: strings trimmed where `.trim()` is used, defaults filled in, a `oneOrMany` value as an array, and keys outside a strict object removed. Throws `ValueError` naming the path of the first problem. |
| `s.issues(value: any)` | `schema.Issue[]` | Lists every problem as `{path, message}` records. `[]` means the value is valid. |
| `s.isValid(value: any)` | `boolean` | Whether `parse` would accept the value. It doesn't build the normalized value, so it is cheaper than `parse`. |

`path` holds the object keys and 1-based array indexes leading to the bad value, and is `[]` for the value itself. The `parse` error message writes the same path as `users[2].name`.

Wrap `parse` in `try(...)` to get a `result` instead of a throw:

```osl
import "std:schema"

*schema.Schema profile = schema.object({
  settings: schema.object({dark: schema.boolean().defaultValue(false)})
})

auto checked = try(profile.parse({settings: {dark: "yes"}}))
if checked.isErr() (
  log checked.unwrapErr().message
  // schema.Schema.parse: settings.dark: Expected boolean, received string
)
```

## Creating schemas

| Function | Accepts |
| --- | --- |
| `schema.any()` | Any value, `null` included, returned unchanged. |
| `schema.string()` | Strings. |
| `schema.number()` | Finite numbers. |
| `schema.integer()` | Finite whole numbers. |
| `schema.boolean()` | `true` and `false`. |
| `schema.literal(value)` | Only `value` itself. |
| `schema.enum(values: array)` | Any one of `values`. Throws `ValueError` for an empty array. |
| `schema.array(item: *schema.Schema)` | Arrays whose every item matches `item`. |
| `schema.oneOrMany(item: *schema.Schema)` | One `item` value or an array of them. Always returns an array. |
| `schema.object(shape: object)` | Objects whose keys match the schemas in `shape`. A key whose schema isn't optional is required. Other keys pass through unless `.strict()` is used. Throws `TypeError` when a shape value isn't a schema. |
| `schema.record(item: *schema.Schema)` | Objects whose every value matches `item`, whatever the keys. |
| `schema.union(schemas: array)` | A value matching any of `schemas`, tried in order. Returns it as the first match normalizes it. Throws `TypeError` for an item that isn't a schema and `ValueError` for an empty array. |

```osl
import "std:schema"

*schema.Schema tags = schema.oneOrMany(schema.string())
array normalized = tags.parse("news") // ["news"]

*schema.Schema id = schema.union([schema.string(), schema.integer().gt(0)])
*schema.Schema scores = schema.record(schema.integer().min(0))
```

## Modifiers

Each modifier returns a new `*schema.Schema` and can be chained. Using a modifier on a schema kind it doesn't apply to throws `TypeError`, for example `schema.string().min(2)`.

| Modifier | Applies to | Effect |
| --- | --- | --- |
| `.optional()` | any | Also accepts `null` or a missing key. |
| `.nullable()` | any | Also accepts `null`. |
| `.defaultValue(value)` | any | Uses `value` in place of `null` or a missing key. |
| `.trim()` | string | Trims surrounding whitespace before checking. |
| `.min(n)`, `.max(n)` | number, integer | Inclusive bounds. |
| `.gt(n)`, `.lt(n)` | number, integer | Exclusive bounds. `.gt(0)` accepts positive numbers, while `.min(0)` also accepts zero. |
| `.minLen(n)`, `.maxLen(n)` | string, array, object | Inclusive length bounds, in characters, items, or keys. Throws `ValueError` unless `n` is a whole number `>= 0`. |
| `.length(n)` | string, array, object | An exact length. |
| `.strict()` | object | Rejects keys not in the shape. |
| `.partial()` | object | Makes every field optional. Useful for update payloads. |
| `.extend(shape)` | object | Adds or replaces fields, keeping the other modifiers (`strict`, `optional`, `nullable`, `requireAny`, defaults). |
| `.requireAny(fields)` | object | At least one of `fields` must be present, even as `null`. Useful for patches where `null` clears a value. |
| `.requireAnyValue(fields)` | object | At least one of `fields` must hold a non-null value. Empty strings and arrays still count; add `.minLen(1)` to reject them. |

```osl
import "std:schema"

*schema.Schema user = schema.object({name: schema.string(), age: schema.integer()})
*schema.Schema update = user.partial().requireAny(["name", "age"])
*schema.Schema account = user.extend({active: schema.boolean()})

*schema.Schema message = schema.object({
  content: schema.string().optional(),
  embeds: schema.array(schema.any()).optional()
}).requireAnyValue(["content", "embeds"])
```

A `null` default keeps a nullable schema nullable: `schema.array(schema.string()).nullable().defaultValue(null)` accepts `null` and gives `null` for a missing key. On a schema that is neither nullable nor optional, a `null` default still reports `Required`.

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `s.safeParse(value)` (a result whose error is an object `{message, path, issues}` with 0-based indexes) | `try(s.parse(value))` for a result, or `s.issues(value)` to list every problem |

## Behavior and limits

- Define reusable schemas once rather than rebuilding them inside a frequently called function.
