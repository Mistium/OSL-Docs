# ptr

> Low-level pointer operations

Use `ptr` for low-level pointer-style references when you need explicit mutation through a handle.

```javascript
import "osl/ptr"
```

## API reference

### `ptr`

| Method | Returns | Description |
| --- | --- | --- |
| `ptr.pointer(v: any)` | `number` | Returns the shared reflected address for a value. |
| `ptr.deref(ptr: any)` | `any` | Dereferences through the shared nil-safe reflection path. |
| `ptr.ref(v: any)` | `*Pointer` | Runs the ref operation. |
| `ptr.set(ptr: any, v: any)` | `boolean` | Sets a value when assignable, returning false instead of panicking for incompatible reflected values. |
| `ptr.alloc(v: any)` | `*Pointer` | Runs the alloc operation. |
| `ptr.allocTyped(typeName: any, v: any)` | `*TypedPointer` | Runs the alloc typed operation. |
| `ptr.isNull(ptr: any)` | `boolean` | Reports whether null. |
| `ptr.addressOf(v: any)` | `number` | Returns the same address representation as `ptr.pointer`. |
| `ptr.equalPointers(a: any, b: any)` | `boolean` | Compares values through the shared address representation. |
| `ptr.sizeOf(v: any)` | `number` | Returns the reflected size, or the element size for slices and maps. |
| `ptr.alignOf(v: any)` | `number` | Returns alignment through the shared reflected-value path. |
| `ptr.offsetOf(v: any, field: any)` | `number` | Runs the offset of operation. |
| `ptr.swap(a: any, b: any)` | `boolean` | Runs the swap operation. |
| `ptr.copy(dst: any, src: any)` | `boolean` | Runs the copy operation. |
| `ptr.sliceData(arr: array)` | `number` | Runs the slice data operation. |
| `ptr.stringData(s: string)` | `number` | Runs the string data operation. |
| `ptr.sliceLen(arr: array)` | `number` | Runs the slice len operation. |
| `ptr.sliceCap(arr: array)` | `number` | Runs the slice cap operation. |

### `TypedPointer` values

Methods available on `TypedPointer` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.deref()` | `any` | Runs the deref operation. |
| `value.setValue(v: any)` | `boolean` | Sets value. |

## Notes

- Standard-library imports accept both `import "osl/ptr"` and `import "ptr"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Nil pointers, empty slice data, wrong pointee types, out-of-range offsets, and
overlapping memory operations are guarded. Typed booleans reuse the language's
standard boolean conversion.
