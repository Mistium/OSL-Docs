# schema

> Composable schemas for validating and normalizing OSL values

The `schema` package validates unknown values, nested objects, and arrays. Schemas are reusable and
immutable: constraint methods return a new schema, leaving the original unchanged.

```javascript
import "osl/schema"

auto createUser = schema.object({
  name: schema.string().trim().nonempty(),
  age: schema.integer().nonnegative().optional(),
  roles: schema.array(schema.enum(["admin", "member"]))
})

auto checked = createUser.safeParse(payload)
if checked.isErr() (
  return err(checked.unwrapErr().message)
)
object user = checked.unwrap()
```

## Creating schemas

#### `schema.any()` → `schema.Schema`

Accepts any value, including `null`.

#### `schema.string()` → `schema.Schema`

Accepts a string.

#### `schema.number()` → `schema.Schema`

Accepts a finite number.

#### `schema.integer()` → `schema.Schema`

Accepts a finite whole number.

#### `schema.boolean()` → `schema.Schema`

Accepts a boolean.

#### `schema.literal(value)` → `schema.Schema`

Accepts only a value equal to `value`.

```javascript
auto enabled = schema.literal(true)
```

#### `schema.enum(values)` → `schema.Schema`

Accepts one of the supplied values. Values may be strings, numbers, booleans, or other OSL values.

```javascript
auto status = schema.enum(["online", "away", "offline"])
```

#### `schema.array(itemSchema)` → `schema.Schema`

Accepts an array and validates every element with `itemSchema`. Errors include the failing index,
such as `roles[1]`.

```javascript
auto tags = schema.array(schema.string().nonempty())
```

#### `schema.object(shape)` → `schema.Schema`

Accepts an object and validates the named fields with the schemas in `shape`. Fields not in the
shape are preserved unless `.strict()` is used. Nested error paths use dot notation.

```javascript
auto profile = schema.object({
  id: schema.string().nonempty(),
  settings: schema.object({dark: schema.boolean().defaultValue(false)})
})
```

#### `schema.union(schemas)` → `schema.Schema`

Accepts a value when any supplied schema accepts it.

```javascript
auto id = schema.union([schema.string(), schema.integer().positive()])
```

## Schema modifiers

Each modifier returns a new `schema.Schema` and can be chained.

#### `value.optional()` → `schema.Schema`

Allows a field to be absent. Because absent object fields read as `null` in OSL, optional schemas
also accept `null`.

#### `value.nullable()` → `schema.Schema`

Allows `null` in addition to the schema's normal type.

#### `value.defaultValue(default)` → `schema.Schema`

Uses `default` when the input is absent or `null`. The normalized output contains the default.

#### `value.trim()` → `schema.Schema`

Trims leading and trailing whitespace from a string in the normalized output.

#### `value.min(limit)` / `value.max(limit)` → `schema.Schema`

Sets an inclusive minimum or maximum. For numbers this checks the numeric value; for strings it
checks Unicode character count; for arrays it checks item count.

#### `value.nonempty()` → `schema.Schema`

Requires a string or array to contain at least one character or item. This is equivalent to
`.min(1)` and is commonly combined with `.trim()`.

#### `value.positive()` / `value.nonnegative()` → `schema.Schema`

Requires a number to be greater than zero or at least zero.

#### `value.strict()` → `schema.Schema`

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
  log problem.message // settings.dark: Expected boolean
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
