# random

> Seedable pseudo-random numbers

Use `random` for seedable pseudo-random numbers, choices, shuffling, and generated strings. For security-sensitive randomness, use `crypto`.

```javascript
import "osl/random"
```

## Example

```javascript
import "osl/random"

random.seed(123)
log random.int(10)         // integer in [0, 10)
log random.between(1, 10)  // integer in [1, 10] (inclusive)
```

## API reference

### `random`

| Method | Returns | Description |
| --- | --- | --- |
| `random.seed(n: any)` | `void` | Runs the seed operation. |
| `random.float(...args: any)` | `number` | Runs the float operation. |
| `random.int(n: any)` | `number` | Random integer in `[0, n)`. Extra arguments are ignored — for a range, use `random.between`. |
| `random.between(min: any, max: any)` | `number` | Random integer in `[min, max]` (inclusive). |
| `random.bool(...args: any)` | `boolean` | Runs the bool operation. |
| `random.pick(arr: any)` | `any` | Runs the pick operation. |
| `random.shuffle(arr: any)` | `array` | Runs the shuffle operation. |
| `random.sample(arr: any, n: any)` | `array` | Runs the sample operation. |
| `random.string(...args: any)` | `string` | Runs the string operation. |
| `random.gaussian(...args: any)` | `number` | Runs the gaussian operation. |

## Notes

- Standard-library imports accept both `import "osl/random"` and `import "random"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Empty collections, reversed bounds, invalid weights, and deterministic seeds
have explicit, tested behavior.
