---
description: Every built-in property and method of objects and typed maps, with which ones change the object in place.
---

# Objects

Objects map text keys to values; a typed map such as `string[int]` fixes the value type. Lesson: [Objects and maps](../learn/objects.md).

```osl
object o = {name: "Ada", age: 36}
o.city = "London"
log o.name o["age"] o.missing
log o.getKeys().sort()
log o.pick("name", "city")
```

```output
Ada 36 null
["age","city","name"]
{"city":"London","name":"Ada"}
```

> [!warning] No fixed order
> Keys, values and entries come in no fixed order. Sort the keys before printing. `log` and `json.stringify` sort them for you.

## Literals, access and operators

| Form | Meaning |
| --- | --- |
| `{a: 1, b: 2}` | an object; a bare key is a literal key |
| `{"two words": 1}` | a quoted key, for keys that aren't names |
| `{[expr]: 1}` | the key is the value of `expr` |
| `{name, age}` | shorthand for `{name: name, age: age}` |
| `{...a, b: 2}` | `a`'s keys, then `b`; later keys win |
| `o.key` or `o["key"]` | the value, or `null` if the key is missing |
| `o.key = x` or `o["key"] = x` | sets (or adds) a key |
| `"key" in o` | `true` if the key exists |
| `o.len` | the number of keys |
| `a ++ b` | a new object with the keys of both; `b` wins |
| `{a, b} = o` | destructuring: reads `a` and `b` out of `o` |
| `for k in o`, `for k, v in o` | loops over the keys, or the keys and values |

```osl
string field = "level"
object o = {name: "Ada", [field]: 3, "two words": true}
log o
log o.name o["level"] o.missing
log "name" in o "zzz" in o
log o.len
o.age = 36
o["name"] = "Ada L."
log o ++ {extra: 1}
log {...o, age: 37}.age
{name, age} = o
log name age
string[] keys = o.getKeys().sort()
for k in keys ( log k ++ "=" ++ o[k] )
```

```output
{"level":3,"name":"Ada","two words":true}
Ada 3 null
true false
3
{"age":36,"extra":1,"level":3,"name":"Ada L.","two words":true}
37
Ada L. 36
age=36
level=3
name=Ada L.
two words=true
```

## Methods

| Method | Gives | |
| --- | --- | --- |
| `getKeys()` | an array of the keys | |
| `getValues()` | an array of the values | |
| `getEntries()` | an array of `[key, value]` pairs | |
| `contains(key)` | `true` if the key exists | |
| `get(key)` | the value, or `null` | |
| `get(key, fallback)` | the value, or `fallback` if the key is missing | |
| `insert(key, value)` | sets the key | in place |
| `delete(key, ...)` | removes each key; keys that aren't there are ignored | in place |
| `merge(other)` | a new object of both, `other` winning | copy |
| `pick(key, ...)` | a new object with only those keys | copy |
| `omit(key, ...)` | a new object without those keys | copy |
| `flip()` | a new object with keys and values swapped | copy |
| `clone()` | an independent deep copy | copy |
| `toStr()` | the object as JSON text | |
| `toMap()` | the object as a `map` | |

```osl
object o = {b: 2, a: 1, c: 3}
log o.getKeys().sort() o.getValues().sort()
log o.getEntries().sortBy(e -> e[1])
log o.contains("a") o.contains("z")
log o.get("a") o.get("z") o.get("z", 0)
log o.merge({c: 30, d: 4})
log o.pick("a", "b") o.omit("a")
log o.flip()
log o.toStr()
```

```output
["a","b","c"] [1,2,3]
[["a",1],["b",2],["c",3]]
true false
1 null 0
{"a":1,"b":2,"c":30,"d":4}
{"a":1,"b":2} {"b":2,"c":3}
{"1":"a","2":"b","3":"c"}
{"a":1,"b":2,"c":3}
```

`delete` and `insert` change the object they are called on and return it. The compiler warns if you assign the result to another name (`b = a.delete("x")`), because both names then refer to the same object; use `omit` for a changed copy.

```osl
object o = {a: 1, b: 2, c: 3}
o.insert("d", 4)
o.delete("a", "zzz")
log o
object copy = o.clone()
copy.b = 99
log o.b copy.b
```

```output
{"b":2,"c":3,"d":4}
2 99
```

## Typed maps

A typed map, written `string[int]` for text keys and int values, checks every value you store and read. Putting a value of the wrong type is a compile error. It has the same methods as an object, and `getValues()` gives an array of the value type. `map<string, int>` is another way to write the same type.

```osl
string[int] stock = {apples: 4, pears: 0}
stock["plums"] = 7
log stock.getKeys().sort()
log stock.getValues().sum()
log stock["apples"] + 1
log stock.get("kiwis", 0)
log stock.merge({figs: 2}).len
```

```output
["apples","pears","plums"]
11
5
0
4
```

```osl error
string[int] ages = {}
ages["ada"] = "thirty-six"
```

## Other collection types

`map` and `set` are separate built-in types, made with `map()` and `set(items)`. They have their own methods and need no import. Turn an object into a map with `toMap()` and an array into a set with `toSet()`.
