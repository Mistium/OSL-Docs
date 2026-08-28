# ptr

Use `ptr` for low-level pointer-style references when you need explicit mutation through a handle.

```osl
import "std:ptr"
```

## API reference

### `ptr`

| Method | Returns | Notes |
| --- | --- | --- |
| `ptr.pointer(v: any)` | `number` | Returns the value's address. |
| `ptr.deref(ptr: any)` | `any` | Returns the pointed-to value, or `null` for a nil pointer. |
| `ptr.ref(v: any)` | `*Pointer` |  |
| `ptr.set(ptr: any, v: any)` | `boolean` | Sets a value when assignable, returning false instead of panicking for incompatible reflected values. |
| `ptr.alloc(v: any)` | `*Pointer` |  |
| `ptr.allocTyped(typeName: any, v: any)` | `*TypedPointer` |  |
| `ptr.isNull(ptr: any)` | `boolean` |  |
| `ptr.addressOf(v: any)` | `number` | Returns the same address representation as `ptr.pointer`. |
| `ptr.equalPointers(a: any, b: any)` | `boolean` | Reports whether two pointers have the same address. |
| `ptr.sizeOf(v: any)` | `number` | Returns the reflected size, or the element size for slices and maps. |
| `ptr.alignOf(v: any)` | `number` | Returns the value's memory alignment in bytes. |
| `ptr.offsetOf(v: any, field: any)` | `number` |  |
| `ptr.swap(a: any, b: any)` | `boolean` |  |
| `ptr.copy(dst: any, src: any)` | `boolean` |  |
| `ptr.sliceData(arr: array)` | `number` |  |
| `ptr.stringData(s: string)` | `number` |  |
| `ptr.sliceLen(arr: array)` | `number` |  |
| `ptr.sliceCap(arr: array)` | `number` |  |

### `TypedPointer` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.deref()` | `any` |  |
| `value.setValue(v: any)` | `boolean` | Sets value. |

## Notes

- Prefer `import "std:ptr"`; the older `import "osl/ptr"` spelling remains supported.

## Behavior and limits

Nil pointers, empty slices, wrong pointee types, invalid offsets, and overlapping memory operations
return failure values. Boolean pointers use OSL's normal boolean conversion.
