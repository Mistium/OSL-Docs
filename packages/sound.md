# sound

Use `sound` for loading and controlling audio playback.

```osl
import "std:sound"
```

## API reference

### `sound`

| Method | Returns | Notes |
| --- | --- | --- |
| `sound.new(url: any)` | `string` |  |
| `sound.load(url: any)` | `string` | Alias of `sound.new`. |
| `sound.play(id: any)` | `boolean` | Starts or resumes playback. |
| `sound.start(id: any)` | `boolean` | Alias of `sound.play`. |
| `sound.pause(id: any)` | `boolean` | Pauses active playback. |
| `sound.unpause(id: any)` | `boolean` | Resumes paused playback. |
| `sound.unload(id: any)` | `boolean` | Removes the loaded sound. |
| `sound.clear(id: any)` | `boolean` | Alias of `sound.unload`. |
| `sound.volume(id: any, value: number)` | `boolean` | Stores the sound's reported volume, clamped from 0 to 1. |
| `sound.currentTime(id: any)` | `number` | Returns the current playback time in seconds. |
| `sound.loaded(id: any)` | `boolean` |  |
| `sound.playing(id: any)` | `boolean` |  |
| `sound.duration(id: any)` | `number` |  |
| `sound.percent(id: any)` | `number` |  |
| `sound.info(id: string, field: string)` | `number` |  |

## Notes

- Prefer `import "std:sound"`; the older `import "osl/sound"` spelling remains supported.

## Behavior and limits

Audio downloads and in-memory sources have size limits. HTTP status codes are checked. Speaker
setup waits until the first playback, and audio with a different sample rate is resampled. Pause
state belongs to each sound value. Calling `unload` or `clear` more than once is safe.
