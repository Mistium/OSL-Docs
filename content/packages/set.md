---
description: Keep a collection of unique values with fast membership tests, and combine sets with union, intersection and difference.
package: set
builtin: true
---

# set

A set holds each value at most once and answers "is this in here?" quickly. Reach for one to remove duplicates, to track what you have already seen, or to compare two groups (who is in both, who is in only one).

An array can do all of that too, but `array.contains` looks at every item, and keeping an array free of duplicates is up to you. A set does both for you, and its lookups stay fast as it grows.

A set is part of the language, so there is nothing to import.

## Making a set

`set()` makes an empty one, and `set(array)` fills it from an array, dropping repeats:

```osl
set tags = set(["osl", "docs", "osl", "go", "docs"])
log tags.size()
log tags.toArray().toSorted()
```

```output
3
["docs","go","osl"]
```

An array's `.toSet()` does the same thing, which is the quickest way to count the distinct items in a list:

```osl
log [1, 2, 2, 3, 1].toSet().size()
```

```output
3
```

## Adding, removing and testing

`add` puts a value in (adding it again changes nothing), `contains` tests for it, and `delete` removes it and says whether it was there:

```osl
set seen = set()
seen.add("ada")
seen.add("bo")
seen.add("ada")

log seen.size()
log seen.contains("ada") seen.contains("cy")
log seen.delete("bo") seen.delete("bo")
log seen.size()
seen.clear()
log seen.size()
```

```output
2
true false
true false
1
0
```

`clear` removes everything. `size()` and `.len` both give the number of values. `add` returns the set itself, so calls can be chained: `seen.add("a").add("b")`.

## What can go in

A set holds strings, numbers, booleans and `null`. Arrays and objects are not accepted, and adding one stops the program with a `TypeError`. Matching is exact: `"Ada"` and `"ada"` are different members, unlike the `==` operator, which ignores case in strings. `1` and `1.0` are the same number, and `"1"` is a different member.

```osl
set values = set([1, 1.0, "1", "A"])
log values.size()
log values.contains("a")
```

```output
3
false
```

## Looping

Loop over a set with `for`. The order is not defined, so if you print members, sort them first:

```osl
set colors = set(["red", "green", "blue"])

for color in colors.toArray().toSorted() (
  log color
)

int letters = 0
for color in colors (
  letters += color.len
)
log letters
```

```output
blue
green
red
12
```

`toArray()` gives the members as an array, in no fixed order, so you can use every array method on it. (`toArr()` is the older name and is deprecated.)

## Removing duplicates

The classic job: keep the first occurrence of each item, in the original order. Walk the array and use the set to remember what you have seen:

```osl
string[] visits = ["home", "docs", "home", "blog", "docs", "home"]

set seen = set()
string[] unique = []
for page in visits (
  if !seen.contains(page) (
    seen.add(page)
    unique.append(page)
  )
)
log unique
```

```output
["home","docs","blog"]
```

If the order doesn't matter, `visits.toSet().toArray()` is shorter. The array method `deDupe()` also removes repeats and keeps order.

## Combining sets

`union` is everything in either set, `intersection` is what's in both, and `difference` is what's in the first but not the second. Each returns a new set and leaves the originals alone:

```osl
set mine = set(["ada", "bo", "cy"])
set yours = set(["bo", "cy", "di"])

log mine.union(yours).toArray().toSorted()
log mine.intersection(yours).toArray().toSorted()
log mine.difference(yours).toArray().toSorted()
log yours.difference(mine).toArray().toSorted()
```

```output
["ada","bo","cy","di"]
["bo","cy"]
["ada"]
["di"]
```

`isSubsetOf` asks whether every member of one set is in another:

```osl
set required = set(["read", "write"])
set granted = set(["read", "write", "admin"])

log required.isSubsetOf(granted)
log granted.isSubsetOf(required)
```

```output
true
false
```

A permissions check is exactly that: collect what a task needs, and test it against what the user has.

## Example: finding what changed

Comparing two lists of files shows what was added and removed:

```osl
set before = set(["a.txt", "b.txt", "c.txt"])
set after = set(["b.txt", "c.txt", "d.txt"])

log "added:" after.difference(before).toArray().toSorted()
log "removed:" before.difference(after).toArray().toSorted()
log "kept:" before.intersection(after).size()
```

```output
added: ["d.txt"]
removed: ["a.txt"]
kept: 2
```

:::quiz
What does this print?

```osl fragment
set a = set(["x", "y"])
set b = set(["y", "z"])
log b.difference(a).toArray()
```

- [ ] `["x"]`
- [x] `["z"]`
- [ ] `["y"]`

`difference` keeps what is in the first set and not in the second. `b.difference(a)` is `z`; `a.difference(b)` would be `x`.
:::

:::exercise title="Missing skills"
A job needs every skill in `required`. Print the skills the candidate is missing, then whether they have them all.

```osl
set required = set(["osl", "sql", "go"])
set have = set(["go", "osl"])

log required.toArray().toSorted()
```

```output
["sql"]
false
```

> [!hint]
> The missing skills are what `required` has that `have` doesn't: `difference`.

> [!hint]
> They have everything when `required.isSubsetOf(have)`.

```osl solution
set required = set(["osl", "sql", "go"])
set have = set(["go", "osl"])

log required.difference(have).toArray().toSorted()
log required.isSubsetOf(have)
```
:::

## Reference

`set` has no package, so its API is listed here. `value` is a set.

| Method | Returns | What it does |
| --- | --- | --- |
| `set()` or `set(array)` | `set` | Makes an empty set, or one holding the array's distinct values. |
| `value.add(v)` | `set` | Adds `v` and returns the set. Adding a member again does nothing. |
| `value.delete(v)` | `boolean` | Removes `v`. True if it was a member. |
| `value.contains(v)` | `boolean` | True if `v` is a member. |
| `value.size()` | `int` | The number of members. `value.len` is the same. |
| `value.clear()` | nothing | Removes every member. |
| `value.toArray()` | `array` | The members as an array, in no fixed order. |
| `value.union(other)` | `set` | A new set with the members of both. |
| `value.intersection(other)` | `set` | A new set with the members found in both. |
| `value.difference(other)` | `set` | A new set with the members of `value` that are not in `other`. |
| `value.isSubsetOf(other)` | `boolean` | True if every member of `value` is in `other`. |

`value.toArr()` still works but is deprecated: use `toArray()`.
