---
description: Group named values into objects, look things up by key with typed maps, and loop over both.
lesson: 6
---

# Objects and maps

An object groups values under names, called keys. Write it in curly braces:

```osl
object book = {
  title: "Dune",
  author: "Frank Herbert",
  year: 1965
}
log book.title
log book["year"]
log book
```

```output
Dune
1965
{"author":"Frank Herbert","title":"Dune","year":1965}
```

Read a value with a dot, or with the key in square brackets when the key is in a variable or isn't a plain name. Objects print as JSON, with their keys in alphabetical order.

## Changing objects

Assign to a key to change it, or to add it if it isn't there yet. `delete` removes keys:

```osl
object user = {name: "Ada"}
user.age = 36
user["role"] = "admin"
log user
user.delete("role")
log user
```

```output
{"age":36,"name":"Ada","role":"admin"}
{"age":36,"name":"Ada"}
```

## Missing keys

Reading a key that isn't there gives `null`, so pair it with `??` for a default:

```osl
object settings = {theme: "dark"}
log settings.language
log settings.language ?? "en"
log settings.contains("theme")
```

```output
null
en
true
```

## Nesting

Values can be arrays or other objects, as deep as you like. This is the same shape as JSON, which is why objects are what you get when you [parse JSON](../packages/json.md):

```osl
object order = {
  id: 1042,
  customer: {name: "Grace", city: "Arlington"},
  items: ["keyboard", "mouse"]
}
log order.customer.name
log order.items[2]
order.items.append("cable")
log order.items.len
```

```output
Grace
mouse
3
```

## Looping over objects

`for key, value in` walks every entry. `getKeys` and `getValues` give you the keys or values as arrays. An object doesn't keep its keys in any particular order, so sort the keys when the order matters:

```osl
object stock = {apples: 12, pears: 0, plums: 7}
for name in stock.getKeys().sort() (
  log name ++ ": " ++ stock[name]
)
log stock.getValues().sum()

int total = 0
for _, count in stock (
  total += count
)
log total
```

```output
apples: 12
pears: 0
plums: 7
19
19
```

## Typed maps

`object` holds values of any type, which is flexible but means the compiler can't check much. When every value has the same type, use a typed map. `string[int]` reads as "keys are strings, values are ints":

```osl
string[int] wordCounts = {}
for word in "the cat and the hat".split(" ") (
  wordCounts[word] = (wordCounts[word] ?? 0) + 1
)
log wordCounts
log wordCounts["the"]
```

```output
{"and":1,"cat":1,"hat":1,"the":2}
2
```

The compiler now knows every value is an `int`, so `wordCounts["the"] + 1` is checked and fast, and putting a string in by mistake is a compile error:

```osl error
string[int] ages = {}
ages["ada"] = "thirty-six"
```

## Building objects from variables

When a key and a variable share a name, write it once. `...` spreads one object into another, and later keys win:

```osl
string name = "Ada"
int level = 3
object player = {name, level}
log player

object defaults = {sound: true, speed: 1}
object chosen = {...defaults, speed: 2}
log chosen
```

```output
{"level":3,"name":"Ada"}
{"sound":true,"speed":2}
```

`++` merges two objects the same way: `defaults ++ {speed: 2}`.

## Taking objects apart

Destructuring pulls named keys into variables:

```osl
object point = {x: 3, y: 4, label: "P"}
{x, y} = point
log x y
```

```output
3 4
```

## Sharing and copying

Like arrays, objects are shared when you assign them. `.clone()` makes an independent copy:

```osl
object first = {count: 0}
object second = first
second.count = 1
log first.count

object third = first.clone()
third.count = 99
log first.count
```

```output
1
1
```

> [!tip] When to use what
> Use a typed map like `string[int]` for lookups where every value is the same kind of thing. Use a [struct](structs.md) when the keys are fixed and known in advance, like a user with a name and an age. Keep plain `object` for data whose shape you don't control, such as JSON from somewhere else.

:::quiz
`object o = {a: 1}`. What does `log o.b` print?

- [ ] Nothing: it's a compile error.
- [x] `null`
- [ ] `0`

A missing key reads as `null`. Use `o.b ?? 0` for a default.
:::

:::exercise title="Total stock"
Print the total number of items in stock, and then the names of the items that have run out, in alphabetical order.

```osl
string[int] stock = {apples: 12, bread: 0, eggs: 30, milk: 0}

log stock
```

```output
42
["bread","milk"]
```

> [!hint]
> `stock.getValues().sum()` adds every count.

> [!hint]
> Loop with `for name, count in stock` and append the names whose count is 0 to a `string[]`. Maps have no order, so sort the result.

```osl solution
string[int] stock = {apples: 12, bread: 0, eggs: 30, milk: 0}

log stock.getValues().sum()
string[] empty = []
for name, count in stock (
  if count == 0 (
    empty.append(name)
  )
)
log empty.sort()
```
:::
