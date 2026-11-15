---
description: Load and play WAV, MP3, OGG and QOA sounds, with volume, pitch, pan, pause and seeking.
package: sound
---

# sound

`std:sound` plays audio. Load a sound from a file, bytes or a URL, then `play`, `pause`, `seek` and change its volume, pitch and stereo position while it plays. It works on its own or beside a [raylib](raylib.md) window, and supports WAV, MP3, OGG Vorbis and QOA.

Playing needs an audio device, so the playing examples are marked compile-only. Loading and inspecting a sound doesn't, so those run here. To have a sound to load, the examples make a half-second beep in memory with a small helper in `tone.osl`.

## Load a sound

`sound.decode(bytes)` reads a sound from bytes and `sound.decodeFile(path)` from a file. Both return a result. A sound knows how long it is, in milliseconds:

```osl file=main.osl
import "std:sound"
import "./tone.osl"

*sound.Sound beep = sound.decode(tone(500)).unwrap()
log beep.duration()
log beep.volume() beep.pitch() beep.pan()
```

```osl file=tone.osl
// A square-wave beep as a WAV file in memory: 8000 samples a second, 8 bits.
def le32(int n) byte[] -> [(n % 256).as<byte>, (floor(n / 256) % 256).as<byte>, (floor(n / 65536) % 256).as<byte>, (floor(n / 16777216) % 256).as<byte>]

def tone(int ms) byte[] (
  int count = floor((8000 * ms) / 1000).as<int>
  byte[] samples = []
  for i in 0 to count - 1 (
    samples.append((if floor(i / 9) % 2 == 0 then 200 else 56).as<byte>)
  )
  byte[] header = [0x52, 0x49, 0x46, 0x46] + le32(36 + count) + [0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20] + le32(16) + [1, 0, 1, 0] + le32(8000) + le32(8000) + [1, 0, 8, 0] + [0x64, 0x61, 0x74, 0x61] + le32(count)
  return header + samples
)
```

```output
500
1 1 0
```

A new sound has volume 1, pitch 1 (normal speed) and pan 0 (centre). Change `tone(500)` to `tone(1200)` and run it again.

## Play it

`play()` starts the sound, or resumes it if it was paused. It fails with an `IOError` when there is no audio device, so it returns a result:

```osl norun
import "std:sound"

*sound.Sound jump = sound.decodeFile("jump.wav").unwrap()
jump.play().unwrap()
```

The program ends when `main` ends, so a short program that plays a sound needs to stay alive, for instance with `thread.sleep(jump.duration())`. A game keeps running anyway.

## Volume, pitch and pan

Setters take effect at once, even while the sound plays:

```osl file=main.osl
import "std:sound"
import "./tone.osl"

*sound.Sound beep = sound.decode(tone(500)).unwrap()

beep.setVolume(0.5)
beep.setPitch(2)
beep.setPan(-1)
log beep.volume() beep.pitch() beep.pan()

log sound.globalVolume()
sound.setGlobalVolume(0.8)
log sound.globalVolume()
```

```osl file=tone.osl
def le32(int n) byte[] -> [(n % 256).as<byte>, (floor(n / 256) % 256).as<byte>, (floor(n / 65536) % 256).as<byte>, (floor(n / 16777216) % 256).as<byte>]

def tone(int ms) byte[] (
  int count = floor((8000 * ms) / 1000).as<int>
  byte[] samples = []
  for i in 0 to count - 1 (
    samples.append((if floor(i / 9) % 2 == 0 then 200 else 56).as<byte>)
  )
  byte[] header = [0x52, 0x49, 0x46, 0x46] + le32(36 + count) + [0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20] + le32(16) + [1, 0, 1, 0] + le32(8000) + le32(8000) + [1, 0, 8, 0] + [0x64, 0x61, 0x74, 0x61] + le32(count)
  return header + samples
)
```

```output
0.5 2 -1
1
0.8
```

Volume is 0 (silent) to 1. Pitch is the playback speed, so 2 is twice as fast and an octave higher, and 0.5 an octave lower. Pan runs from -1 (left) to 1 (right). A value out of range throws a `ValueError`. `sound.setGlobalVolume` scales every sound at once, like a master volume knob.

:::quiz
You call `beep.setPitch(0.5)`. What do you hear?

- [ ] Half as loud.
- [x] Half as fast and an octave lower.
- [ ] Panned to the left.

Pitch is a speed multiplier. Volume is the loudness control.
:::

## Pause, stop and seek

A sound has a position in milliseconds. `pause` keeps it, `stop` rewinds to the start, and `seek(ms)` jumps anywhere, playing or not. `progress()` is the position as a fraction from 0 to 1:

```osl file=main.osl
import "std:sound"
import "./tone.osl"

*sound.Sound beep = sound.decode(tone(500)).unwrap()
log beep.isPlaying() beep.isPaused() beep.position()

beep.seek(250).unwrap()
log beep.position() beep.progress()
```

```osl file=tone.osl
def le32(int n) byte[] -> [(n % 256).as<byte>, (floor(n / 256) % 256).as<byte>, (floor(n / 65536) % 256).as<byte>, (floor(n / 16777216) % 256).as<byte>]

def tone(int ms) byte[] (
  int count = floor((8000 * ms) / 1000).as<int>
  byte[] samples = []
  for i in 0 to count - 1 (
    samples.append((if floor(i / 9) % 2 == 0 then 200 else 56).as<byte>)
  )
  byte[] header = [0x52, 0x49, 0x46, 0x46] + le32(36 + count) + [0x57, 0x41, 0x56, 0x45, 0x66, 0x6D, 0x74, 0x20] + le32(16) + [1, 0, 1, 0] + le32(8000) + le32(8000) + [1, 0, 8, 0] + [0x64, 0x61, 0x74, 0x61] + le32(count)
  return header + samples
)
```

```output
false false 0
250 0.5
```

A progress bar for a sound player is `progress()` times the bar's width.

## Sound effects and music

Sound effects are loaded once and played often. Each `Sound` plays one voice, and `play()` on one that is already playing does nothing, so for overlapping effects (many gunshots) load the file more than once. Music is one long sound with `isPlaying()` checked each frame:

```osl norun
import "std:raylib"
import "std:sound"

*sound.Sound music = sound.decodeFile("theme.ogg").unwrap()
*sound.Sound click = sound.decodeFile("click.wav").unwrap()
music.setVolume(0.4)
music.play().unwrap()

raylib.runWindow(def(ms) (
  if raylib.isKeyPressed("space") (
    click.stop()
    click.play().unwrap()
  )
  if !music.isPlaying() (
    music.seek(0).unwrap()
    music.play().unwrap()
  )
), {background: "#181825"})
```

`click.stop()` rewinds it first, so a quick second press restarts the sound.

## From a URL, and cleaning up

`sound.fetch(url)` downloads and decodes a sound from an `http` or `https` address. `sound.isReady()` opens the audio device and tells you whether there is one, which is how a program checks before it relies on sound. `sound.close()` stops everything and releases the device, and a sound's own `close()` frees it. Using a closed sound throws a `StateError`.

:::exercise title="Reject bad data"
Decode the bytes `[1, 2, 3, 4]`. They aren't a sound, so the result is an error. Print its kind.

```osl
import "std:sound"

log sound.globalVolume()
```

```output
ParseError
```

> [!hint]
> `sound.decode(...)` returns a result. Use `.unwrapErr().kind`.

```osl solution
import "std:sound"

log sound.decode([1, 2, 3, 4]).unwrapErr().kind
```
:::

## API reference

::api
