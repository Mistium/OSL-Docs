# schema

The `schema` package validates unknown values, nested objects, and arrays. Schemas are reusable and
immutable: constraint methods return a new schema, leaving the original unchanged.

```javascript
import "std:schema"

*schema.Schema createUser = schema.object({
  name: schema.string().trim().minLen(1),
  age: schema.integer().min(0).optional(),
  roles: schema.array(schema.enum(["admin", "member"]))
})

auto checked = createUser.safeParse(payload)
if checked.isErr() (
  return err(checked.unwrapErr().message)
)
object user = checked.unwrap()
```

## Creating schemas

#### `schema.any()` → `*schema.Schema`

Accepts any value, including `null`.

#### `schema.string()` → `*schema.Schema`

Accepts a string.

#### `schema.number()` → `*schema.Schema`

Accepts a finite number.

#### `schema.integer()` → `*schema.Schema`

Accepts a finite whole number.

#### `schema.boolean()` → `*schema.Schema`

Accepts a boolean.

#### `schema.literal(value)` → `*schema.Schema`

Accepts only a value equal to `value`.

```javascript
*schema.Schema enabled = schema.literal(true)
```

#### `schema.enum(values)` → `*schema.Schema`

Accepts one of the supplied values. Values may be strings, numbers, booleans, or other OSL values.

```javascript
*schema.Schema status = schema.enum(["online", "away", "offline"])
```

#### `schema.array(itemSchema)` → `*schema.Schema`

Accepts an array and validates every element with `itemSchema`. Errors include the failing index,
such as `roles[1]`.

```javascript
*schema.Schema tags = schema.array(schema.string().minLen(1))
```

#### `schema.oneOrMany(itemSchema)` → `*schema.Schema`

Accepts either one value or an array of values and validates each value with `itemSchema`. The
normalized result is always an array, which is useful for APIs that accept scalar shorthand.

```javascript
*schema.Schema tags = schema.oneOrMany(schema.string())
array normalized = tags.parse("news") // ["news"]
```

#### `schema.object(shape)` → `*schema.Schema`

Accepts an object and validates the named fields with the schemas in `shape`. Fields not in the
shape are preserved unless `.strict()` is used. Nested error paths use dot notation.

```javascript
*schema.Schema profile = schema.object({
  id: schema.string().minLen(1),
  settings: schema.object({dark: schema.boolean().defaultValue(false)})
})
```

#### `schema.record(valueSchema)` → `*schema.Schema`

Accepts an object with arbitrary string keys and validates every value with `valueSchema`.

```javascript
*schema.Schema scores = schema.record(schema.integer().min(0))
```

#### `schema.union(schemas)` → `*schema.Schema`

Accepts a value when any supplied schema accepts it.

```javascript
*schema.Schema id = schema.union([schema.string(), schema.integer().gt(0)])
```

## Schema modifiers

Each modifier returns a new `*schema.Schema` and can be chained.

#### `value.optional()` → `*schema.Schema`

Allows a field to be absent. Because absent object fields read as `null` in OSL, optional schemas
also accept `null`.

#### `value.nullable()` → `*schema.Schema`

Allows `null` in addition to the schema's normal type.

#### `value.defaultValue(default)` → `*schema.Schema`

Uses `default` when the input is absent or `null`. The normalized output contains the default.

#### `value.trim()` → `*schema.Schema`

Trims leading and trailing whitespace from a string in the normalized output.

#### `value.min(limit)` / `value.max(limit)` → `*schema.Schema`

Sets an inclusive numeric minimum or maximum on number and integer schemas.

#### `value.minLen(limit)` / `value.maxLen(limit)` → `*schema.Schema`

Sets an inclusive length bound. Strings use Unicode character count; arrays and objects use item
or field count.

#### `value.length(size)` → `*schema.Schema`

Requires an exact string character count, array item count, or object field count.

#### `value.gt(limit)` / `value.lt(limit)` → `*schema.Schema`

Sets an exclusive numeric bound. For example, `.gt(0)` accepts positive numbers while `.min(0)`
also accepts zero.

#### `value.partial()` → `*schema.Schema`

Returns an object schema where every declared field is optional. This is useful for update payloads.

```javascript
*schema.Schema user = schema.object({name: schema.string(), age: schema.integer()})
*schema.Schema userUpdate = user.partial()
```

#### `value.extend(shape)` → `*schema.Schema`

Returns an object schema containing its existing fields plus the supplied fields. Supplied fields
replace existing fields with the same name.

```javascript
*schema.Schema account = user.extend({active: schema.boolean()})
```

#### `value.requireAny(fields)` → `*schema.Schema`

Requires an object to contain at least one named field. A present field with a `null` value counts,
so this works for patches where `null` intentionally clears a value.

```javascript
*schema.Schema update = user.partial().requireAny(["name", "age"])
```

#### `value.requireAnyValue(fields)` → `*schema.Schema`

Requires an object to contain a non-null value for at least one named field. Empty strings and
arrays still count; combine the field schema with `.minLen(1)` when emptiness should be rejected.

```javascript
*schema.Schema message = schema.object({
  content: schema.string().optional(),
  embeds: schema.array(schema.any()).optional()
}).requireAnyValue(["content", "embeds"])
```

Modifier misuse is reported as a schema configuration error instead of silently doing nothing. For
example, `schema.string().min(2)` returns `Invalid schema: min() cannot be used with string schemas`.

#### `value.strict()` → `*schema.Schema`

For an object schema, rejects fields not present in its shape. Other object schemas preserve
additional fields.

## Validating values

#### `value.safeParse(input)` → `result.Result`

Validates `input` without throwing. Returns `ok(normalizedValue)` on success. On failure it returns
`err(error)`, where `error` contains `message`, `path`, and `issues`. The current implementation
stops at the first issue.

```javascript
auto checked = profile.safeParse(input)
if checked.isErr() (
  object problem = checked.unwrapErr()
  log problem.message // settings.dark: Expected boolean, received string
  log problem.path    // ["settings", "dark"]
)
```

#### `value.parse(input)` → `any`

Returns the normalized value or throws a path-based validation message.

```javascript
object user = profile.parse(input)
```

#### `value.isValid(input)` → `boolean`

Returns whether `input` passes the schema without returning the normalized value or throwing.
This uses a validation-only fast path: it does not copy arrays or objects, construct normalized
values, or allocate successful error paths. Define reusable schemas once rather than rebuilding
them inside a frequently called function.
