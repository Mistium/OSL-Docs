# retry

> Bounded retries with exponential backoff, jitter, and structured outcomes

Use `retry` around transient operations that can be attempted again safely.

```osl
import "std:retry"
import "std:result"

auto outcome = retry.run(def(int attempt) -> (
  if attempt < 3 ( return result.err("not ready") )
  return result.ok("ready")
), {attempts: 5, delay: 0.1, factor: 2, max_delay: 2, jitter: 0.2})

if outcome.success ( log outcome.value )
```

## API reference

| Method | Returns | Description |
| --- | --- | --- |
| `retry.run(callback: function, options?: object)` | `object` | Calls the callback until it returns a regular value or `result.ok`, or the attempt limit is reached. Panics and `result.err` values are retried. |
| `retry.backoff(attempt: number, options?: object)` | `number` | Returns the bounded delay in seconds for an attempt. |

Options are `attempts` (default 3, maximum 100), `delay` in seconds (default 0), `factor`
(default 2), `max_delay` in seconds (default 30, maximum 300), and `jitter` from 0 to 1.
The callback may accept the one-based attempt number; zero-argument callbacks also work.

`run` returns `{success, value, error, attempts, elapsed}`. Attempts stop immediately on an
ordinary return value or `result.ok`. The final panic text or `result.err` value is preserved in
`error` when all attempts fail.
