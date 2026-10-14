# events

Use `events` to decouple code with named in-process events. Listeners run synchronously on the
thread that emits, and registering, removing, and emitting are safe from any thread.

```osl
import "std:events"

def onScore(int points) (
  log "scored " ++ points
)

events.on("score", onScore)
events.once("score", def(int points) -> ( log "first score: " ++ points ))
events.emit("score", 10)
events.emit("score", 5)
log events.count("score") // 1
events.off("score", onScore)
```

## API reference

| Method | Returns | Notes |
| --- | --- | --- |
| `events.on(event: string, fn: function)` | `void` | Adds a listener. Adding the same function twice calls it twice. |
| `events.once(event: string, fn: function)` | `void` | Adds a listener that is removed just before its first call. |
| `events.off(event: string, fn: function)` | `boolean` | Removes the earliest registration of `fn`, whether added with `on` or `once`, and reports whether there was one. |
| `events.emit(event: string, ...args)` | `void` | Calls every listener of `event` with `args`, in the order they were added, and returns when they have all run. |
| `events.count(event: string)` | `int` | How many listeners `event` has. |

`emit` calls the listeners registered when it starts, so a listener can add or remove listeners
without affecting the current emit. Listeners may emit events recursively.

## Errors

- `on`, `once`, and `off` throw `TypeError` when `fn` isn't a function, at registration rather
  than at the next emit.
- An error a listener throws propagates to the caller of `emit`, and the remaining listeners are
  not called.
