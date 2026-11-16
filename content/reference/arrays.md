---
description: Every built-in property and method of arrays, grouped by what it does, with which ones change the array in place.
---

# Arrays

Ordered lists, typed `int[]`, `string[]` or `array`. Positions count from 1. Lesson: [Arrays](../learn/arrays.md).

```osl
int[] a = [5, 3, 8, 1]
a.append(9)
log a.len a[1] a[-1]
log a.sum() a.max()
log a.map(n -> n * 2).filter(n -> n > 8)
```

```output
5 5 9
26 9
[10,16,18]
```

> [!important] In place
> Methods marked **in place** change the array and return it. Use `.clone()` first, or `toSorted`, `toReversed`, `toSortedBy`, to keep the original.

## Properties, indexing and operators

| Form | Gives |
| --- | --- |
| `a.len` | number of items (a property, no brackets) |
| `a[n]` | the item at position `n` (1 is the first, -1 the last) |
| `a[n] = x` | replaces the item at position `n` |
| `a[from:to]` | the items from `from` to `to`, both included; leave either out for the start or end |
| `a ++ b` | a new array of the items of `a` then `b` |
| `[...a, x]` | a new array with the items of `a` spread in |
| `x in a` | `true` if `x` is an item |
| `a == b` | `true` if both hold equal items in the same order |
| `1 to 5` | the array `[1, 2, 3, 4, 5]` |

Position 0 is an error. Reading past the end gives `null` (or the zero value of the item type, such as `0`, in a typed array).

```osl
int[] a = [10, 20, 30, 40]
log a.len a[1] a[-1]
log a[2:3] a[:2] a[3:]
a[1] = 11
log a ++ [50]
log [...a, 0]
log 20 in a
log 1 to 4
```

```output
4 10 40
[20,30] [10,20] [30,40]
[11,20,30,40,50]
[11,20,30,40,0]
true
[1,2,3,4]
```

```osl error
int[] a = [10, 20]
log a[0]
```

## Adding and removing

| Method | Does | |
| --- | --- | --- |
| `append(x, ...)` | adds each `x` to the end | in place |
| `prepend(x, ...)` | adds each `x` to the start | in place |
| `insert(n, x, ...)` | puts the values in before position `n` | in place |
| `delete(n)` | removes the item at position `n`; out of range does nothing | in place |
| `pop()` | removes the last item and returns it | in place |
| `shift()` | removes the first item and returns it | in place |
| `fill(x)` | sets every item to `x` | in place |
| `resize(n)` | cuts to `n` items, or adds empty items up to `n` | in place |
| `swap(a, b)` | exchanges the items at positions `a` and `b` | in place |
| `concat(other)` | returns a new array of both | copy |

```osl
int[] a = [1, 2, 3]
a.append(4, 5)
a.prepend(0)
a.insert(3, 99)
log a
a.delete(3)
log a.pop() a.shift()
log a
a.swap(1, 2)
log a
a.resize(5)
log a
a.fill(7)
log a
log [1, 2].concat([3])
```

```output
[0,1,99,2,3,4,5]
5 0
[1,2,3,4]
[2,1,3,4]
[2,1,3,4,0]
[7,7,7,7,7]
[1,2,3]
```

## Looking inside

| Method | Gives |
| --- | --- |
| `first()`, `last()` | the first or last item |
| `at(n)` | the item at position `n` (negative counts from the end), or `null` |
| `isEmpty()` | `true` if there are no items |
| `contains(x)` | `true` if `x` is an item |
| `containsAny(x, y, ...)` | `true` if any of the values is an item |
| `index(x)` | position of the first `x`, or `0` |
| `lastIndex(x)` | position of the last `x`, or `0` |
| `find(fn)` | the first item for which `fn` is true |
| `findIndex(fn)` | the position of that item |
| `count(fn)` | how many items `fn` is true for |
| `some(fn)` | `true` if `fn` is true for at least one item |
| `every(fn)` | `true` if `fn` is true for every item |

```osl
int[] a = [4, 8, 15, 16, 23, 42]
log a.first() a.last() a.at(2) a.at(-2) a.at(99)
log a.contains(15) a.index(15) a.index(99) a.containsAny(1, 42)
log a.find(n -> n > 10) a.findIndex(n -> n > 10)
log a.count(n -> n % 2 == 0)
log a.some(n -> n > 40) a.every(n -> n > 5)
```

```output
4 42 8 23 null
true 3 0 true
15 3
4
true false
```

`count` takes a function. For the number of items use `.len`.

## Transforming

None of these change the array.

| Method | Gives |
| --- | --- |
| `map(fn)` | a new array of `fn(item)` for each item |
| `filter(fn)` | a new array of the items for which `fn` is true |
| `flatten()` | the nested arrays opened one level |
| `chunk(n)` | an array of arrays of `n` items each |
| `zip(other)` | an array of `[item, otherItem]` pairs |
| `groupBy(fn)` | an object that maps each result of `fn` to the items that gave it |
| `deDupe()` | the items with repeats removed |
| `left(n)`, `right(n)` | the first or last `n` items |
| `trim(a, b)` | the items from position `a` to `b`, both included; negative counts from the end |
| `clone()` | an independent deep copy |
| `join(sep)` | the items as text, separated by `sep` |
| `getKeys(name)` | the field `name` of each item |
| `toEntriesObj()` | an object built from `[key, value]` pairs |
| `toSet()` | a set of the items |
| `iter()` | a lazy [iterator](../learn/iterators.md) over the items |

```osl
int[] a = [1, 2, 3, 4, 5, 6]
log a.map(n -> n * n)
log a.filter(n -> n % 2 == 0)
log [[1, 2], [3]].flatten()
log a.chunk(4)
log a.zip(["a", "b", "c"])
log a.groupBy(n -> n % 3)
log [1, 1, 2, 2, 3].deDupe()
log a.left(2) a.right(2) a.trim(2, 4) a.trim(-2, -1)
log a.join("-")
log [{name: "Ada"}, {name: "Lin"}].getKeys("name")
log [["a", 1], ["b", 2]].toEntriesObj()
log a.iter().map(n -> n + 1).take(3).toArray()
```

```output
[1,4,9,16,25,36]
[2,4,6]
[1,2,3]
[[1,2,3,4],[5,6]]
[[1,"a"],[2,"b"],[3,"c"]]
{"0":[3,6],"1":[1,4],"2":[2,5]}
[1,2,3]
[1,2] [5,6] [2,3,4] [5,6]
1-2-3-4-5-6
["Ada","Lin"]
{"a":1,"b":2}
[2,3,4]
```

`groupBy` keys are text, since they become object keys.

## Sorting

| Method | Gives | |
| --- | --- | --- |
| `sort()` | the items in ascending order | in place |
| `sort(fn)` | ordered by a comparison `fn(a, b)` that returns a negative, zero or positive number | in place |
| `sortBy(key)` | ordered by a field name or by `fn(item)` | in place |
| `sortBy(key, "descending")` | the same, largest first | in place |
| `reverse()` | the items in reverse order | in place |
| `toSorted()`, `toReversed()`, `toSortedBy(key)` | the same as above, on a copy | copy |
| `randomOf()` | one random item | |

`sort` orders numbers by value and other items by their text. `sortBy("field")` puts items without that field last.

```osl
int[] a = [5, 3, 8, 1]
log a.toSorted() a.toReversed()
log a
a.sort()
log a
a.sort(def(int x, int y) int -> y - x)
log a
string[] words = ["pear", "fig", "banana"]
log words.sortBy(w -> w.len)
log words.toSortedBy(w -> w)
object[] people = [{name: "Ada", age: 36}, {name: "Lin", age: 54}]
log people.sortBy("age", "descending").getKeys("name")
```

```output
[1,3,5,8] [1,8,3,5]
[5,3,8,1]
[1,3,5,8]
[8,5,3,1]
["fig","pear","banana"]
["banana","fig","pear"]
["Lin","Ada"]
```

## Numbers in an array

These need an array of numbers.

| Method | Gives |
| --- | --- |
| `sum()` | the total (`0` for an empty array) |
| `product()` | the items multiplied together (`1` for an empty array) |
| `min()`, `max()` | the smallest or largest item |
| `average()` | the mean |
| `minBy(fn)`, `maxBy(fn)` | the item for which `fn(item)` is smallest or largest |

```osl
number[] a = [4, 8, 15]
log a.sum() a.product() a.min() a.max() a.average()
object[] people = [{name: "Ada", age: 36}, {name: "Lin", age: 54}]
log people.minBy(p -> p.age).name
log people.maxBy(p -> p.age).name
```

```output
27 480 4 15 9
Ada
Lin
```

## Fixed-size arrays

`int[3]` is an array whose length is part of its type. Its items can be read and changed one by one, but `append`, `prepend`, `pop`, `shift` and `resize` are errors on it.

```osl error
int[3] fixed = [1, 2, 3]
fixed.append(4)
```

> [!note] Copying and sharing
> Assigning an array shares it: `b = a` makes both names the same array. Use `a.clone()` for a copy. Arrays inside structs are copied with the struct; arrays inside classes are shared.
