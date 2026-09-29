# events

Use `events` to decouple code with named in-process events. Listeners run synchronously on the
thread that emits, and registration and emission are safe from any thread.

```osl
import "std:events"

def onScore(int points) (
  log "scored " ++ points
)

events.on("score", onScore)
events.emit("score", 10)
events.off("score", onScore)
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `events.on(name: string, callback: function)` | `void` | Adds a listener. The same function may be added more than once. |
| `events.off(name: string, callback: function)` | `boolean` | Removes the first matching listener and reports whether one was removed. |
| `events.emit(name: string, ...args)` | `void` | Calls every listener registered for `name` with `args`, in registration order. |

`emit` calls the listeners registered when it starts, so a listener can add or remove listeners
without affecting the current emission. Listeners may emit events recursively. A panic in a
listener propagates to the caller of `emit`.
