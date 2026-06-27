# Object Methods

Methods you can call on any `object` (a string-keyed map). Read values with `o.key`, `o["key"]` or
`o.item(key)`.

```javascript
object user = { name: "Ada", age: 36 }
log user.name        // "Ada"
log user.getKeys()   // ["name", "age"]
log user.len         // 2
```

## In this section

- **[Keys, Values & Membership](accessing.md)** - `getKeys`, `getValues`, `getEntries`, `contains`.
- **[Modifying & Converting](transforming.md)** - `insert`, `delete`, `omit`, `pick`, `flip`,
  `clone`, `toMap`, `toStr`.

> `.insert` and `.delete` mutate the object in place. `.omit`, `.pick`, `.flip` and `.clone` return a
> new object and leave the original untouched.

Objects also support the universal methods `.len` (a property), `.getType()`, `.item(key)` - see
[Type & conversion methods](../types/README.md). For richer key/value structures with insertion
order and non-string keys, see the [`map`](../../packages/map.md) package.
