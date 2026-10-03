# Arrays and objects

Arrays and strings are 1-indexed. Objects use string keys unless a typed map declares another key type.

## Arrays

```osl
string[] names = ["Ada", "Grace", "Lin"]

log names[1]
names[2] = "Hopper"
names.append("Margaret")
```

Negative positions count from the end. Position `0` is invalid and produces a compile error when the compiler can see it.

Common array methods include `append`, `prepend`, `pop`, `shift`, `insert`, `delete`, `contains`, `index`, `map`, `filter`, `some`, `every`, `sort`, `sortBy`, `reverse`, `join`, `clone`, `resize`, `min`, `max`, `sum`, and `len`.

```osl
int[] values = [3, 1, 4]
int[] doubled = values.map((int value) int -> value * 2)
int[] ordered = doubled.sort()
```

## Objects

```osl
object user = {
  id: "u1",
  profile: {
    name: "Ada"
  }
}

log user.profile.name
user["active"] = true
```

A missing property returns `null`. Useful object methods include `getKeys`, `getValues`, `getEntries`, `contains`, `insert`, `delete`, `pick`, and `clone`.

Typed maps preserve their key and value types in `getKeys()` and `getValues()`. Both methods take a snapshot under the runtime's shared collection lock in concurrent programs, including HTTP and WebSocket servers. Concurrent inserts, replacements, and deletions cannot invalidate the traversal. Values in the snapshot can still refer to shared records or objects. Use a named lock when several operations must form one transaction.

## Const collection views

`const<T[]>` and `const<object>` protect collections from mutation through that view:

```osl
const<int[]> values = [1, 2]
log values[1]
log values.join(",")
int[] editable = values.clone()
editable.append(3)
```

Nested references remain read-only, and casts and assertions preserve their protection.
Another existing mutable alias can still change the shared value. Use `.clone()` for an
independent mutable copy. See [const types](types.md#const-types) for function contracts
and the operations rejected by the compiler.

## References and copies

Assigning an array, object, or class instance with `=` shares the same mutable value:

```osl
object first = {count: 0}
object second = first
second.count = 1

log first.count
```

This logs `1`. Call `.clone()` for an independent deep copy:

```osl
object second = first.clone()
```

Record types share their instance on assignment and support `.clone()` for a deep copy. Structs are fixed-size values, so assigning a struct copies it.

An explicit `@arrayVariable` pointer retains the variable's storage, including its current array length after reassignment. Calling `.delete(position)` through it updates the original array:

```osl
int[] values = [1, 2, 3]
auto reference = @values
reference.delete(2)
log values // [1, 3]
log reference.len // 2
```

[Array pointer constraints](functions.md#array-pointer-constraints) let functions accept these references for any element type.

## Merging and spreading

`++` merges arrays and objects as well as concatenating strings:

```osl
object base = {name: "Ada", active: false}
object enabled = base ++ {active: true}
int[] all = [1, 2] ++ [3, 4]
```

Spread values inside literals or function calls:

```osl
int[] first = [1, 2]
int[] all = [...first, 3]
object copy = {...base, role: "owner"}
log max(...all)
```

## Destructuring

```osl
array pair = ["Ada", "Grace"]
[string first, string second] = pair
{id, profile: details} = user
```

Use `_` to discard a position. The source expression runs once. Patterns can nest and collect the remaining array elements or object entries with a final `...name` target:

```osl
int8[][] rows = [[1, 2, 3], [4]]
[[first, ...remaining], second] = rows
{profile: {name, scores: [best, ...scores]}, ...other} = user
```

New targets retain known element and field types; existing targets keep their declared types. For example, `first` above is `int8` and `remaining` is `int8[]`. Dynamic fields require an explicit target type or a later assertion. Rest collections are shallow copies. Arrays must have enough elements, and requested object fields must exist. A failed extraction leaves existing target bindings unchanged. Duplicate target names are rejected across the entire pattern.

Typed object literals also accept spread, checking keys and values against the destination type. Later entries override earlier ones, and each spread source runs once:

```osl
string[int8] defaults = {limit: 10, retries: 2}
string[int] settings = {...defaults, retries: 3}
```

Known incompatible types and narrowing spreads are compile errors. Dynamic spread values are checked at runtime; invalid fields or overflowing values fail instead of being silently converted.

## Iteration

Use `in` for values and `of` for positions or keys:

```osl
for index, name in names (
  log index ++ ": " ++ name
)

for index of names (
  log index
)
```

Both indexes start at `1` for arrays and strings.

## Generated collection access

Typed dictionary assignments convert compatible numeric values to the declared value
type. For example, an array length can be stored directly in `string[number]`:

```osl
string[] names = ["Ada", "Lin"]
string[number] counts = {}
counts["names"] = names.len
```

Assigning a known incompatible value, such as a string to this dictionary, reports
the actual value type and the expected value type at the assignment.

For a typed dictionary whose Go value type is concrete, reads in a program without concurrency use direct Go indexing. Declared record fields use direct map reads and their known field types. Dynamic objects retain prototype lookup. Concurrent programs retain collection locking.

Use `osl transpile file.osl` to inspect generated Go and `osl bench file.osl --runs 30` to measure a workload. Typed dictionaries and record fields avoid general reflection where the compiler already knows the key and value types.

Concurrent record reads use the declared field's type directly. Array callbacks whose
result type is known, including calls to typed functions and reads of declared fields,
keep a typed result array instead of converting through `any[]`. Empty-string and
nullable collection comparisons use native Go comparisons.

In concurrent programs, only proven private arrays can skip collection locks. Borrowed
arrays and function results remain protected. See [thread safety](../packages/thread.md#thread-safety)
for snapshot behavior during iteration and callbacks.

Scalar calculations stored in explicitly declared local variables do not make a private
array escape. Scratch arrays used this way can keep direct reads and native appends.
