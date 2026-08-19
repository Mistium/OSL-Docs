# sound

> Audio playback

Use `sound` for loading and controlling audio playback.

```javascript
import "osl/sound"
```

## API reference

### `sound`

| Method | Returns | Description |
| --- | --- | --- |
| `sound.new(url: any)` | `string` | Creates a new value. |
| `sound.load(url: any)` | `string` | Alias of `sound.new`. |
| `sound.play(id: any)` | `boolean` | Starts or resumes playback. |
| `sound.start(id: any)` | `boolean` | Alias of `sound.play`. |
| `sound.pause(id: any)` | `boolean` | Pauses active playback through the shared state transition. |
| `sound.unpause(id: any)` | `boolean` | Resumes paused playback through the shared state transition. |
| `sound.unload(id: any)` | `boolean` | Removes the loaded sound. |
| `sound.clear(id: any)` | `boolean` | Alias of `sound.unload`. |
| `sound.volume(id: any, value: number)` | `boolean` | Stores the sound's reported volume, clamped from 0 to 1. |
| `sound.currentTime(id: any)` | `number` | Returns the current playback time in seconds. |
| `sound.loaded(id: any)` | `boolean` | Reports whether the sound is loaded. |
| `sound.playing(id: any)` | `boolean` | Reports whether the sound is playing. |
| `sound.duration(id: any)` | `number` | Runs the duration operation. |
| `sound.percent(id: any)` | `number` | Runs the percent operation. |
| `sound.info(id: string, field: string)` | `number` | Runs the info operation. |

## Notes

- Standard-library imports accept both `import "osl/sound"` and `import "sound"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Audio sources are bounded and HTTP responses are validated by a reused client. Speaker setup is
lazy, differing sample rates are resampled, and pause state is per sound value.
In-memory decoding uses standard byte readers, generated IDs are serialized, and
duration probes close their decoder. Repeated unload and clear calls are safe.
