# sound

Use `sound` to play WAV, MP3, OGG Vorbis, and QOA audio with per-sound volume, pitch, pan, pausing,
and seeking. It is the only audio API in OSL and works with or without a window, including
alongside [raylib](raylib.md).

```osl
import "std:sound"
```

## Example

```osl
import "std:sound"

auto jump = sound.decodeFile("jump.wav") catch (err) (
  log "can't load sound: " ++ err.message
  return
)
log "length " ++ jump.duration() ++ " ms"
jump.setVolume(0.5)
jump.setPitch(1.5)
jump.play()
```

`sound.decodeFile` returns a result. Used as a value it unwraps itself and throws on failure.

## API reference

### `sound`

| Function | Returns | Notes |
| --- | --- | --- |
| `sound.decode(data: byte[])` | `result<*sound.Sound, error>` | Decodes WAV, MP3, OGG Vorbis, or QOA bytes. The format is recognised from the data. |
| `sound.decodeFile(path: string)` | `result<*sound.Sound, error>` | Decodes a sound file of up to 64 MiB. |
| `sound.fetch(url: string, options?)` | `result<*sound.Sound, error>` | Downloads a sound over http or https and decodes it. Option: `timeout` (milliseconds, default 10000). |
| `sound.isReady()` | `boolean` | Whether an audio output device is available, opening it if needed. |
| `sound.globalVolume()` | `number` | The volume applied to every sound, 0 to 1. |
| `sound.setGlobalVolume(volume: number)` | `void` | Sets the volume applied to every sound, 0 to 1. |
| `sound.close()` | `void` | Stops every sound and releases the audio device until a sound plays again. Sounds stay loaded. |

### `*sound.Sound`

| Method | Returns | Notes |
| --- | --- | --- |
| `snd.play()` | `result<unit, error>` | Starts from the current position, or resumes when paused. Does nothing if already playing. |
| `snd.pause()` | `void` | Pauses where it is, if playing. |
| `snd.resume()` | `void` | Continues a paused sound. |
| `snd.stop()` | `void` | Ends playback and rewinds to the start. |
| `snd.isPlaying()` | `boolean` | Playing and not paused. A closed sound isn't playing. |
| `snd.isPaused()` | `boolean` | Paused part way through. |
| `snd.duration()` | `number` | Length in milliseconds. |
| `snd.position()` | `number` | Playback position in milliseconds. |
| `snd.seek(ms: number)` | `result<unit, error>` | Moves playback to `ms` from the start, playing or not. |
| `snd.progress()` | `number` | How far through playback is, 0 to 1. |
| `snd.volume()` / `snd.setVolume(volume: number)` | `number` / `void` | 0 (silent) to 1 (full, the default). |
| `snd.pitch()` / `snd.setPitch(pitch: number)` | `number` / `void` | Playback speed. 2 plays twice as fast and an octave higher. Must be more than 0. Default 1. |
| `snd.pan()` / `snd.setPan(pan: number)` | `number` / `void` | Stereo position from -1 (left) through 0 (centre) to 1 (right). |
| `snd.close()` | `void` | Stops and frees the sound. Closing again does nothing. |
| `snd.isClosed()` | `boolean` | Whether `close` has been called. |

Each sound has one playback position, so calling `play` on a playing sound doesn't start a second
copy; call `stop` then `play` to restart it. Several sounds play at once, mixed together.

## Errors

| Function | Kind | When |
| --- | --- | --- |
| `decode`, `decodeFile`, `fetch` | `ParseError` | The data isn't a sound it can decode. |
| `decodeFile` | `NotFoundError`, `IOError` | The file can't be read. |
| `decodeFile`, `fetch` | `UnsupportedError` | The source is over 64 MiB. |
| `fetch` | `NetworkError`, `TimeoutError` | The download failed or took too long. |
| `fetch` | `NotFoundError` | HTTP 404 or 410. |
| `fetch` | `PermissionError` | HTTP 401 or 403. |
| `play` | `IOError` | No audio output device can be opened. |
| `seek` | `IOError` | The decoder can't seek. |
| setters, `seek` | `ValueError` (thrown) | A value out of range. |
| any `*sound.Sound` method | `StateError` (thrown) | The sound is closed. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning. They took a string ID
returned by `sound.new`, returned `""`, `0`, or `false` on failure, and reported times in
**seconds**; the `*sound.Sound` methods use milliseconds.

| Deprecated | Use instead |
| --- | --- |
| `sound.new(url)`, `sound.load(url)` | `sound.decodeFile(path)` or `sound.fetch(url)` |
| `sound.play(id)`, `sound.start(id)` | `snd.play()` |
| `sound.pause(id)` | `snd.pause()` |
| `sound.unpause(id)` | `snd.resume()` |
| `sound.stop(id)` | `snd.stop()` |
| `sound.unload(id)`, `sound.clear(id)` | `snd.close()` |
| `sound.volume(id, value)` | `snd.setVolume(volume)` |
| `sound.pitch(id, value)` | `snd.setPitch(pitch)` |
| `sound.pan(id, value)` | `snd.setPan(pan)` |
| `sound.masterVolume(value)` | `sound.setGlobalVolume(volume)` |
| `sound.ready()` | `sound.isReady()` |
| `sound.loaded(id)` | `snd.isClosed()` |
| `sound.playing(id)` | `snd.isPlaying()` or `snd.isPaused()` |
| `sound.currentTime(id)` (seconds) | `snd.position()` (milliseconds) |
| `sound.duration(id)` (seconds) | `snd.duration()` (milliseconds) |
| `sound.percent(id)` | `snd.progress()` |
| `sound.info(id, field)` | The `*sound.Sound` methods |

## Behavior and limits

Playback needs no C libraries or system audio headers to build. On Linux it uses PulseAudio
(including PipeWire and WSLg) and falls back to ALSA at run time.

Decoding a sound doesn't open the audio device, so sounds can be loaded and inspected on machines
without audio hardware. The device opens on the first `play` or `isReady` call and mixes every sound
at 44.1 kHz, resampling sources at other rates. Panning uses the same equal-power law as the Web
Audio `StereoPannerNode`.
