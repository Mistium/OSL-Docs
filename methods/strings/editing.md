# Strings - Building & Editing

Methods that produce a modified copy of the string - concatenating, inserting, replacing, stripping
and padding. The original is never mutated.

#### `.append(...parts)` → `string`
Concatenates each `part` onto the end.

#### `.prepend(...parts)` → `string`
Concatenates each `part` onto the front.

```javascript
log "ab".append("cd", "ef")  // "abcdef"
log "ab".prepend("XY")       // "XYab"
```

#### `.insert(index, str)` → `string`
Inserts `str` before position `index` (1-indexed).

```javascript
log "abc".insert(2, "X")  // "aXbc"
```

#### `.replace(old, new)` → `string`
Replaces **all** occurrences of `old` with `new`.

#### `.replaceFirst(old, new)` → `string`
Replaces only the **first** occurrence.

```javascript
log "Hello".replace("l", "L")       // "HeLLo"
log "Hello".replaceFirst("l", "L")  // "HeLlo"
```

#### `.stripStart(prefix)` → `string`
Removes `prefix` from the start, if present.

#### `.stripEnd(suffix)` → `string`
Removes `suffix` from the end, if present.

```javascript
log "hello".stripStart("he")  // "llo"
log "hello".stripEnd("lo")    // "hel"
```

#### `.padStart(char, length)` → `string`
Pads the front with `char` until the string is at least `length` long.

#### `.padEnd(char, length)` → `string`
Pads the end with `char` until the string is at least `length` long.

```javascript
log "5".padStart("0", 3)  // "005"
log "5".padEnd("0", 3)    // "500"
```
