# Types & Conversion

These methods work on **any** value, regardless of its type — converting between types, copying, dynamic access and runtime assertions.

```javascript
log "42".toNum()         // 42
log [1, 2, 3].clone()    // independent copy
log [1, 2, 3].len        // 3 (property — no parentheses)
```

## In this section

* [**Conversion**](conversion.md) — `toStr`, `toNum`, `toInt`, `toBool`, `toArray`, `toObject`, and the `len` property.
* [**Utility**](utility.md) — `clone`, `item`, `reverse`, `call`, `match`, and the advanced `assert` / `assertElse` runtime casts.

> To get a value's **type name**, use the [`typeof(value)`](../../builtins/builtins.md) function. The [`result`](../../packages/result.md) and [`option`](../../packages/option.md) types have their own methods (`isOk`, `unwrap`, …) documented with their packages.
