# Objects — Modifying & Converting

Add, remove and reshape keys, or convert the object to another type.

#### `.insert(key, value)` — mutates
Sets `key` to `value` on the object.

#### `.delete(key)` — mutates
Removes `key` from the object.

```javascript
object o = { a: 1 }
void o.insert("b", 2)  // o is now {a: 1, b: 2}
void o.delete("a")     // o is now {b: 2}
```

#### `.omit(...keys)` → `object`
A copy of the object **without** the named keys.

#### `.pick(...keys)` → `object`
A copy of the object containing **only** the named keys.

```javascript
object o = { a: 1, b: 2, c: 3 }
log o.omit("a")  // {b: 2, c: 3}
log o.pick("a")  // {a: 1}
```

#### `.flip()` → `object`
Swaps keys and values.

```javascript
log { a: 1, b: 2 }.flip()  // {"1": "a", "2": "b"}
```

#### `.clone()` → `object`
An independent deep copy. (Plain `=` shares a reference.)

#### `.toMap()` → `map`
Converts to an insertion-ordered [`map`](../../packages/map.md).

#### `.toStr()` → `string`
Serialises the object to a JSON string.

```javascript
log { a: 1, b: 2 }.toStr()  // {"a":1,"b":2}
```
