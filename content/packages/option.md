---
description: Represent a value that may or may not be there with some and none, and transform it with map, andThen and okOr.
package: option
---

# option

An `option` is either `some(value)` or `none()`. It answers "is there a value?" in the type itself, and gives you methods to work with the answer.

Most of the time you don't need it. OSL already has nullable types: `string?` is a string or `null`, and `??` supplies a default. Use an `option` when `null` is itself a legitimate value and "absent" has to be told apart from "present, and null". The classic case is a lookup that can return a stored `null`.

`some` and `none` are built in, and `std:option` provides them.

## some and none

```osl
import "std:option"

auto present = some(5)
auto absent = none()

log present.isSome() present.isNone()
log absent.isSome() absent.isNone()
log present.unwrap()
```

```output
true false
false true
5
```

## Getting the value out

`unwrap()` gives the value and stops the program when the option is `none`. `unwrapOr(fallback)` is the safe form. `expect(message)` is `unwrap` with your message, to say what you were relying on:

```osl
import "std:option"

auto absent = none()
log absent.unwrapOr("fallback")
log try(absent.unwrap()).unwrapErr().toStr()
log try(absent.expect("no user selected")).unwrapErr().message
```

```output
fallback
StateError: Cannot unwrap none value
no user selected
```

## Returning an option

A search function should say "not found" in its type. Return `option<int>`, and callers have to handle both cases:

```osl
import "std:option"

def indexOf(string[] items, string target) option<int> (
  for i, item in items (
    if item == target ( return some(i) )
  )
  return none()
)

string[] names = ["ada", "bo", "cy"]
log indexOf(names, "bo").unwrap()
log indexOf(names, "zed").isNone()
log indexOf(names, "zed").unwrapOr(0)
```

```output
2
true
0
```

## Transforming with map

`map(fn)` changes the value inside a `some` and leaves a `none` alone, so you can write the happy path once:

```osl
import "std:option"

auto price = some(20)
auto missing = none()

log price.map(p -> p * 2).unwrap()
log missing.map(p -> p * 2).isNone()
log price.map(p -> "$" ++ p).unwrap()
```

```output
40
true
$20
```

## Chaining with andThen

When the function itself returns an option, use `andThen` so you don't end up with an option inside an option. A failure at any step turns the rest into no-ops:

```osl
import "std:option"

object users = {ada: {manager: "bo"}, bo: {manager: "cy"}, cy: {}}

def managerOf(string name) option<string> (
  object user = users[name] ?? {}
  string? boss = user.manager
  if boss == null ( return none() )
  return some(boss)
)

log managerOf("ada").unwrap()
log managerOf("ada").andThen(b -> managerOf(b)).unwrap()
log managerOf("ada").andThen(b -> managerOf(b)).andThen(b -> managerOf(b)).isNone()
```

```output
bo
cy
true
```

## Providing alternatives

`orElse(fn)` runs on `none` and returns another option, to try a second source. `unwrapOrElse(fn)` returns a plain fallback, computed only when needed:

```osl
import "std:option"

auto cached = none()
auto fresh = cached.orElse(def() -> some("from the network"))
log fresh.unwrap()

log cached.unwrapOrElse(def() -> "computed fallback")
```

```output
from the network
computed fallback
```

## Turning an option into a result

`okOr(error)` converts: a `some` becomes an `ok`, and a `none` becomes an `err` with the error you give. This is the bridge to [result](result.md) when absence is a failure the caller must handle:

```osl
import "std:option"
import "std:result"

def findUser(string name) result<string, error> (
  option<string> found = none()
  if name == "ada" ( found = some("Ada Lovelace") )
  return found.okOr(error("NotFoundError", "no user " ++ name))
)

log findUser("ada").unwrap()
log findUser("zed").unwrapErr().toStr()
```

```output
Ada Lovelace
NotFoundError: no user zed
```

## Present but null

This is the reason to choose an option over a nullable. `some(null)` is a value that exists and happens to be null, which is different from `none`:

```osl
import "std:option"

auto stored = some(null)
auto never = none()

log stored.isSome()
log never.isSome()
log stored.unwrap() == null
log never.unwrapOr("default")
log stored.unwrapOr("default") == null
```

```output
true
false
true
default
true
```

With a plain `string?` the first and last lines can't be told apart, because `null` would both mean "nothing" and "stored null".

## Options and JSON

When you turn an option into JSON, `some(x)` becomes `x` and `none()` becomes `null`:

```osl
import "std:option"
import "std:json"

log json.stringify([some("a"), none(), some(5)])
```

```output
["a",null,5]
```

## When to use a nullable instead

For everyday "maybe a value" with no need for the some-versus-null distinction, a nullable type is shorter:

```osl
string? nickname = null
log nickname ?? "no nickname"
```

```output
no nickname
```

Choose `T?` by default. Choose `option<T>` when null can be real data, or you want the `map` and `andThen` methods.

## API reference

::api
