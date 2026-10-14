# ptr

Use `ptr` for shared mutable cells, and for low-level identity, address, and memory-layout queries.

```osl
import "std:ptr"
```

## Example

A `*ptr.Pointer` is a cell that every holder shares, so a function can change a value its caller
sees:

```osl
import "std:ptr"

*ptr.Pointer counter = ptr.new(0)

def bump(*ptr.Pointer p) (
  p.set(p.value() + 1)
)

bump(counter)
bump(counter)
log counter.value() // 2

*ptr.Pointer a = ptr.new("left")
*ptr.Pointer b = ptr.new("right")
a.swap(b)
log a.value() ++ " " ++ b.value() // right left
```

`ptr.deref` and `ptr.set` also work with a variable pointer made with `@`:

```osl
import "std:ptr"

int n = 5
auto p = @n
ptr.set(p, 9)
log n              // 9
log ptr.deref(p)   // 9
```

## API reference

### `ptr`

| Method | Returns | Notes |
| --- | --- | --- |
| `ptr.new(value: any)` | `*ptr.Pointer` | A cell holding `value`. Copies of the pointer share the cell. |
| `ptr.deref(pointer: any)` | `any` | The value `pointer` points at: the variable behind `@value`, or what a `ptr.new` pointer holds. |
| `ptr.set(pointer: any, value: any)` | `boolean` | Stores `value` where `pointer` points, in place, and returns `true`. |
| `ptr.addressOf(value: any)` | `int` | The address of `value`. For an object, array, function, or handle, the address of the data it refers to, which every reference shares; `0` for `null`; for other values, the address of a temporary copy. |
| `ptr.equalPointers(a: any, b: any)` | `boolean` | Whether `a` and `b` are the same object, array, function, or handle rather than equal copies. Two nulls are the same. |
| `ptr.isNull(value: any)` | `boolean` | Whether `value` is `null` or a null Go pointer. |
| `ptr.sizeOf(value: any)` | `int` | Size in bytes of the value's Go representation; for an array or object, the size of one element. |
| `ptr.alignOf(value: any)` | `int` | Alignment in bytes of the value's Go representation. |
| `ptr.offsetOf(value: any, field: string)` | `int` | Byte offset of the Go field `field` in a Go struct value, such as a package handle. OSL objects are maps, not structs. |
| `ptr.sliceData(arr: array)` | `int` | Address of the array's first element, or `0` for an empty array. |
| `ptr.stringData(text: string)` | `int` | Address of the string's first byte, or `0` for `""`. |
| `ptr.sliceLen(arr: array)` | `int` | How many elements the array holds. |
| `ptr.sliceCap(arr: array)` | `int` | How many elements the array can hold before it has to grow. |

### `*ptr.Pointer`

| Method | Returns | Notes |
| --- | --- | --- |
| `p.value()` | `any` | The value the pointer holds. |
| `p.set(value: any)` | `void` | Replaces the value, in place. |
| `p.swap(other: *ptr.Pointer)` | `void` | Exchanges the values of the two pointers, in place. |

## Errors

- `ptr.deref` and `ptr.set` throw `ValueError` for a null pointer and `TypeError` for a value that
  isn't a pointer, or a value the variable's type can't hold.
- `ptr.sizeOf` and `ptr.alignOf` throw `ValueError` for `null`.
- `ptr.offsetOf` throws `ValueError` when the value isn't a struct or has no such field.
- `p.swap` throws `TypeError` when `other` is `null`.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `ptr.ref(value)`, `ptr.alloc(value)` | `ptr.new(value)` |
| `ptr.pointer(value)` | `ptr.addressOf(value)` |
| `ptr.swap(a, b)` | `a.swap(b)` |
| `ptr.copy(dst, src)` | `dst.set(src.value())` |
| `ptr.allocTyped(typeName, value)` and its `deref()` / `setValue()` methods | `ptr.new(value)` with `p.value()` and `p.set(value)`, converting the value yourself |

## Notes

- Prefer `import "std:ptr"`; the older `import "osl/ptr"` spelling remains supported.
