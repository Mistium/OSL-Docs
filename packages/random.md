# random

Use `random` for fast, seedable pseudo-random numbers, picks, shuffles, and generated strings. For
secrets, tokens, and anything security-sensitive, use [`crypto`](crypto.md).

```osl
import "std:random"
```

## Example

```osl
import "std:random"

random.seed(123)
log random.between(1, 6)              // a die roll: 1 to 6, both included
log random.float()                    // 0 up to but not including 1
log random.pick(["red", "green", "blue"])
log random.string(8)                  // 8 letters and digits
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `random.seed(seed: int)` | `void` | Restarts the generator. The same seed always produces the same sequence from every function. |
| `random.float()` | `number` | From 0 up to but not including 1. |
| `random.float(max: number)` | `number` | From 0 up to `max`. |
| `random.float(min: number, max: number)` | `number` | From `min` up to `max`. |
| `random.between(min: int, max: int)` | `int` | A whole number from `min` to `max`, both included. The bounds may come in either order. |
| `random.bool(probability?: number)` | `boolean` | `true` or `false` with equal odds, or `true` with the given probability from 0 to 1. |
| `random.pick(items: array)` | `any` | A random item, or `null` when `items` is empty. |
| `random.shuffle(items: array)` | `array` | A shuffled copy. `items` is unchanged. |
| `random.sample(items: array, count: int)` | `array` | `count` different items in random order, or all of them shuffled when `count` is larger than `items`. |
| `random.string(length?: int, alphabet?: string)` | `string` | Random characters. The default is 16 letters and digits; `alphabet` sets the characters to draw from. |
| `random.gaussian(mean?: number, stdDev?: number)` | `number` | A normally distributed number. The defaults are mean 0 and standard deviation 1. |

## Errors

Bad arguments are a bug in the calling code, so they throw:

- `random.float` throws `TypeError` for more than two arguments or a non-number.
- `random.bool` throws `ValueError` for a probability outside 0 to 1.
- `random.sample` throws `ValueError` for a negative count.
- `random.string` throws `ValueError` for a negative length, a length over 16777216, or an empty
  alphabet, and `TypeError` for other argument types.
- `random.gaussian` throws `ValueError` for a negative standard deviation.

## Changes from earlier versions

`random.int(max)` is gone. Write `random.between(0, max - 1)`: `between` includes both bounds,
where `int` excluded `max`.

## Notes

- Prefer `import "std:random"`; the older `import "osl/random"` spelling remains supported.
- The generator is safe to use and reseed from several threads.
