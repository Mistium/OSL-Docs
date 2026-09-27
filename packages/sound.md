# sound

Use `sound` for loading and controlling audio playback. It is the only audio API in OSL and works
with or without a window, including alongside [`raylib`](raylib.md) and [`window`](window.md).

```osl
import "std:sound"

string id = sound.new("jump.wav")
sound.volume(id, 0.5)
sound.pitch(id, 1.5)
sound.play(id)
```

## API reference

### `sound`

| Method | Returns | Notes |
| --- | --- | --- |
| `sound.new(url: any)` | `string` | Loads a sound and returns its id, or `""` on failure. |
| `sound.load(url: any)` | `string` | Alias of `sound.new`. |
| `sound.play(id: any)` | `boolean` | Starts playback, or resumes it when paused. Does nothing if already playing. |
| `sound.start(id: any)` | `boolean` | Alias of `sound.play`. |
| `sound.stop(id: any)` | `boolean` | Ends playback. The next `play` starts from the beginning. |
| `sound.pause(id: any)` | `boolean` | Pauses active playback. |
| `sound.unpause(id: any)` | `boolean` | Resumes paused playback. |
| `sound.unload(id: any)` | `boolean` | Stops and removes the loaded sound. |
| `sound.clear(id: any)` | `boolean` | Alias of `sound.unload`. |
| `sound.volume(id: any, value: number)` | `boolean` | Sets the sound's volume, clamped from 0 to 1. Applies immediately. |
| `sound.pitch(id: any, value: number)` | `boolean` | Sets the playback rate multiplier. `2.0` plays an octave higher and twice as fast. Must be greater than 0. |
| `sound.pan(id: any, value: number)` | `boolean` | Sets stereo position from -1 (left) to 1 (right), clamped. Applies immediately. Uses the same equal-power law as the Web Audio `StereoPannerNode`. |
| `sound.masterVolume(value: number)` | | Scales every sound, clamped from 0 to 1. |
| `sound.ready()` | `boolean` | Opens the audio device if needed and reports whether it is available. |
| `sound.close()` | | Stops every sound and suspends the audio device. The next `play` or `ready` resumes it. |
| `sound.currentTime(id: any)` | `number` | Current playback position in seconds, or 0 when stopped. |
| `sound.loaded(id: any)` | `boolean` |  |
| `sound.playing(id: any)` | `boolean` | True from `play` until the sound ends or is stopped, including while paused. |
| `sound.duration(id: any)` | `number` | Length in seconds. |
| `sound.percent(id: any)` | `number` | `currentTime / duration`, from 0 to 1. |
| `sound.info(id: string, field: string)` | `number` | `loaded`, `playing`, `volume`, `pitch`, `pan`, `duration`, or `current_time`. Booleans are 1 or 0. |

## Sources and formats

`url` can be a plain file path, a `file://` path, or an `http://` or `https://` URL. Other schemes
fail. WAV, MP3, OGG Vorbis, and QOA are supported. The format is detected from the file contents,
so the extension does not matter.

## Notes

- Prefer `import "std:sound"`; the older `import "osl/sound"` spelling remains supported.

## Behavior and limits

Playback needs no C libraries or system audio headers to build. On Linux it uses PulseAudio,
including PipeWire and WSLg, and falls back to ALSA at runtime.

Audio playback synchronizes its own state internally. Importing `sound` alone keeps OSL code
in single-threaded execution mode. Programs using `thread` or concurrent callbacks still use
the compiler's shared-state synchronization.

Sources are limited to 64 MiB. HTTP status codes are checked. Loading a sound does not open the
audio device, so sounds can be loaded and inspected on machines without audio hardware. The device
opens on the first `play` or `ready` call and mixes every sound at 44.1 kHz, resampling sources at
other rates. Each sound has one playback position, so calling `play` on a playing sound does not
start a second copy. Call `stop` then `play` to restart it. Calling `unload` or `clear` more than
once is safe.
