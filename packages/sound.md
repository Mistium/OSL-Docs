# sound

> Per-instance sound player with playback control and lifetime queries

```javascript
import "osl/sound"
```

## Methods

- `sound.new(url)` → `string`
- `sound.load(url)` → `string`
- `sound.play(id)` → `boolean`
- `sound.start(id)` → `boolean`
- `sound.pause(id)` → `boolean`
- `sound.unpause(id)` → `boolean`
- `sound.unload(id)` → `boolean`
- `sound.clear(id)` → `boolean`
- `sound.volume(id, value)` → `boolean`
- `sound.currentTime(id)` → `number`
- `sound.loaded(id)` → `boolean`
- `sound.playing(id)` → `boolean`
- `sound.duration(id)` → `number`
- `sound.percent(id)` → `number`
- `sound.info(id, field)` → `number`
