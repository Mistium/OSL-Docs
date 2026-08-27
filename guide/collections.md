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

Common array methods include `append`, `prepend`, `pop`, `shift`, `insert`, `delete`, `contains`, `index`, `map`, `filter`, `some`, `every`, `sort`, `sortBy`, `reverse`, `join`, `clone`, `min`, `max`, `sum`, and `len`.

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

Structs behave differently. They are values, so assigning a struct copies it.

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

Use `_` to discard a position. The source expression runs once.

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
