# random

Use `random` for seedable pseudo-random numbers, choices, shuffling, and generated strings. For security-sensitive randomness, use `crypto`.

```osl
import "std:random"
```

## Example

```osl
import "std:random"

random.seed(123)
log random.int(10)         // integer in [0, 10)
log random.between(1, 10)  // integer in [1, 10] (inclusive)
```

## API reference

### `random`

| Method | Returns | Notes |
| --- | --- | --- |
| `random.seed(n: any)` | `void` |  |
| `random.float(...args: any)` | `number` |  |
| `random.int(n: any)` | `number` | Random integer in `[0, n)`. Extra arguments are ignored. Use `random.between` for a range. |
| `random.between(min: any, max: any)` | `number` | Random integer in `[min, max]` (inclusive). |
| `random.bool(...args: any)` | `boolean` | Returns `true` with the given probability, which defaults to `0.5`. |
| `random.pick(arr: any)` | `any` |  |
| `random.shuffle(arr: any)` | `array` | Returns a shuffled copy without mutating the input. |
| `random.sample(arr: any, n: any)` | `array` | Returns a random sample, clamping the count between zero and the input length. |
| `random.string(...args: any)` | `string` |  |
| `random.gaussian(...args: any)` | `number` | Draws from a normal distribution. Mean defaults to `0` and standard deviation to `1`. |

## Notes

- Prefer `import "std:random"`; the older `import "osl/random"` spelling remains supported.

## Behavior and limits

Choice helpers define fallback values for empty collections. Range methods accept reversed bounds,
and weighted choice rejects invalid weights. A fixed seed produces a repeatable sequence. The
generator remains safe when several threads use or reseed it.
