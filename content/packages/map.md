---
description: Look values up by key with map(), whose keys can be strings, numbers or booleans, and know when a typed map or an object fits better.
package: map
builtin: true
---

# map

A map stores values under keys and finds them again by key. OSL has three tools for this, and picking the right one is most of the skill:

- An [object](../learn/objects.md) has string keys and values of any type. It is the shape JSON has.
- A [typed map](../learn/objects.md#typed-maps) such as `string[int]` has string keys and one value type, checked by the compiler.
- `map()`, the subject of this page, is a map object with explicit methods (`set`, `get`, `has`) whose keys may be strings, numbers or booleans.

`map` is part of the language, so there is nothing to import.

## Making a map and using it

```osl
map ages = map()
ages.set("ada", 36)
ages.set("bo", 41)

log ages.get("ada")
log ages.size()
log ages.has("bo") ages.has("cy")
```

```output
36
2
true false
```

`set` stores a value, replacing any earlier one under that key. `get` returns it, `has` asks whether the key is present, and `size()` counts the keys.

## Missing keys

`get` gives `null` for a key that isn't there, so `??` supplies a default:

```osl
map ages = map()
ages.set("ada", 36)

log ages.get("zed")
log ages.get("zed") ?? 0
```

```output
null
0
```

A key can hold `null` as its value, and `has` is how you tell that apart from a missing key:

```osl
map notes = map()
notes.set("draft", null)

log notes.get("draft") == null
log notes.has("draft")
log notes.has("final")
```

```output
true
true
false
```

## Changing and removing

`delete(key)` removes a key and `clear()` removes everything. Both leave the map itself in place:

```osl
map stock = map()
stock.set("apples", 12)
stock.set("pears", 0)
stock.set("plums", 7)

stock.delete("pears")
log stock.size()
stock.clear()
log stock.size()
```

```output
2
0
```

`set` returns the map, so setting can be chained: `stock.set("a", 1).set("b", 2)`.

## Keys can be numbers

This is what `map()` has that an object doesn't. An object's keys are always strings, but a map keeps numbers and booleans as they are:

```osl
map names = map()
names.set(1, "one")
names.set(2, "two")
names.set(true, "yes")

log names.get(1)
log names.get(true)
log names.get("1")
```

```output
one
yes
null
```

The number `1` and the text `"1"` are different keys. The number `1` and `1.0` are the same key. Text keys are matched exactly, so `"Ada"` and `"ada"` are different, unlike `==` on strings.

Keys can be strings, numbers, booleans or `null`. An array or object as a key stops the program with a `TypeError`: use a string made from it instead, such as `x ++ "," ++ y` for a grid position.

## Looking at everything

`keys()`, `values()` and `entries()` return arrays. `entries()` is an array of `[key, value]` pairs. A map has no fixed order, so sort before printing:

```osl
map prices = map()
prices.set("tea", 3)
prices.set("coffee", 4)
prices.set("juice", 5)

log prices.keys().toSorted()
log prices.values().toSorted()
log prices.entries().toSorted()
```

```output
["coffee","juice","tea"]
[3,4,5]
[["coffee",4],["juice",5],["tea",3]]
```

You can also loop over the map directly with `for key, value in`:

```osl
map prices = map()
prices.set("tea", 3)
prices.set("coffee", 4)

int total = 0
for _, price in prices (
  total += price
)
log total
```

```output
7
```

`getKeys()` and `getValues()` are older names for `keys()` and `values()` and give a deprecation warning.

## Counting

The standard use is counting how often something happens: one key per thing, the count as the value. `get(k) ?? 0` handles the first time a key is seen:

```osl
map counts = map()
for word in "the cat and the hat and the end".split(" ") (
  counts.set(word, (counts.get(word) ?? 0) + 1)
)

for word in counts.keys().toSorted() (
  log word counts.get(word)
)
```

```output
and 2
cat 1
end 1
hat 1
the 3
```

## Grouping

Values are untyped (`any`), so when you store arrays, say what you expect when you take them out, with `.<string[]>`:

```osl
map byLetter = map()
for word in ["apple", "avocado", "banana", "blueberry", "cherry"] (
  string letter = word.left(1)
  string[] group = (byLetter.get(letter) ?? []).<string[]>
  group.append(word)
  byLetter.set(letter, group)
)

for letter in byLetter.keys().toSorted() (
  log letter byLetter.get(letter)
)
```

```output
a ["apple","avocado"]
b ["banana","blueberry"]
c ["cherry"]
```

## Caching results

A map remembers the answer for an input, so an expensive function runs only once per value. Check with `has`, so a stored `null` or `0` is still a hit:

```osl
map cache = map()
int calls = 0

def square(int n) int (
  if cache.has(n) ( return cache.get(n) )
  calls++
  int answer = n * n
  cache.set(n, answer)
  return answer
)

log square(4) square(4) square(5)
log calls
```

```output
16 16 25
2
```

For a cache that expires or has a size limit, use `std:cache` instead.

## Typed maps

When every value has the same type, a typed map checks that for you. `string[int]` has string keys and int values, and is written and read with brackets, like an object. The [objects lesson](../learn/objects.md#typed-maps) introduces it. Typed maps have their own methods, which differ from `map()`'s:

```osl
string[int] stock = {apples: 12, pears: 0, plums: 7}

log stock["apples"]
log stock.len
log stock.contains("apples") stock.contains("kiwi")
log stock.getKeys().toSorted()
log stock.getValues().toSorted()
log stock.pick("apples", "plums")
log stock.omit("pears")
log stock.merge({kiwi: 3})
```

```output
12
3
true false
["apples","pears","plums"]
[0,7,12]
{"apples":12,"plums":7}
{"apples":12,"plums":7}
{"apples":12,"kiwi":3,"pears":0,"plums":7}
```

`pick`, `omit` and `merge` return new maps and leave `stock` as it was. Two things differ from `map()`. Reading a key that isn't there gives the zero value for the type (`0` for an int, `""` for a string), not `null`, so use `contains` to test for presence. And the helpers are named `len`, `getKeys` and `getValues`, where `map()` has `size()`, `keys()` and `values()`.

`stock.toMap()` converts a typed map or an object into a `map()`.

## Which one

| You have | Use |
| --- | --- |
| Data from JSON, or keys you don't control | an `object` |
| String keys, all values one type, checked by the compiler | a typed map: `string[int]` |
| Number or boolean keys, or you want `has`, `set` and `get` as explicit calls | `map()` |
| A fixed set of named fields | a [struct](../learn/structs.md) |
| Unique values only, no values attached | a [set](set.md) |

:::exercise title="Most common word"
Count the words in the sentence with a `map()`, then print the word that appears most often and how many times it appeared.

```osl
string text = "the cat saw the dog and the bird"

map counts = map()
log text.split(" ").len
```

```output
the 3
```

> [!hint]
> Loop over `text.split(" ")` and do `counts.set(word, (counts.get(word) ?? 0) + 1)`.

> [!hint]
> Keep a `best` word and a `bestCount`. Loop over `counts.keys().toSorted()` and replace them when you find a bigger count.

```osl solution
string text = "the cat saw the dog and the bird"

map counts = map()
for word in text.split(" ") (
  counts.set(word, (counts.get(word) ?? 0) + 1)
)

string best = ""
number bestCount = 0
for word in counts.keys().toSorted() (
  number count = counts.get(word).<number>
  if count > bestCount (
    best = word
    bestCount = count
  )
)
log best bestCount
```
:::

## Reference

`map` has no package, so its API is listed here. `value` is a map made with `map()`.

| Method | Returns | What it does |
| --- | --- | --- |
| `map()` | `map` | Makes an empty map. |
| `value.set(key, v)` | `map` | Stores `v` under `key`, replacing any earlier value, and returns the map. |
| `value.get(key)` | `any` | The value under `key`, or `null` when there is none. |
| `value.has(key)` | `boolean` | True if `key` is present, even when its value is `null`. |
| `value.delete(key)` | nothing | Removes `key`. Does nothing if it isn't there. |
| `value.size()` | `int` | The number of keys. |
| `value.clear()` | nothing | Removes every key. |
| `value.keys()` | `array` | The keys, in no fixed order. |
| `value.values()` | `array` | The values, in no fixed order. |
| `value.entries()` | `array` | An array of `[key, value]` pairs, in no fixed order. |

Keys must be strings, numbers, booleans or `null`. `getKeys()` and `getValues()` are deprecated aliases of `keys()` and `values()`.
