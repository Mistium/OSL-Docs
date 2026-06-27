# ptr

> Low-level pointer and memory utilities

```javascript
import "osl/ptr"
```

## Methods

- `ptr.pointer(v)` → `number`
- `ptr.deref(ptr)` → `any`
- `ptr.ref(v)` → `Pointer`
- `ptr.set(ptr, v)` → `boolean`
- `ptr.alloc(v)` → `Pointer`
- `ptr.allocTyped(typeName, v)` → `TypedPointer`
- `ptr.isNull(ptr)` → `boolean`
- `ptr.addressOf(v)` → `number`
- `ptr.equalPointers(a, b)` → `boolean`
- `ptr.sizeOf(v)` → `number`
- `ptr.alignOf(v)` → `number`
- `ptr.offsetOf(v, field)` → `number`
- `ptr.swap(a, b)` → `boolean`
- `ptr.copy(dst, src)` → `boolean`
- `ptr.sliceData(arr)` → `number`
- `ptr.stringData(s)` → `number`
- `ptr.sliceLen(arr)` → `number`
- `ptr.sliceCap(arr)` → `number`

## Returned object: `TypedPointer`

Returned by `ptr` methods; call these on the value you get back.

- `typedPointer.deref()` → `any`
- `typedPointer.setValue(v)` → `boolean`
