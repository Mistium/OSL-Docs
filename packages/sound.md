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
| `sound.load(url: any)` | `string` | Runs the load operation. |
| `sound.play(id: any)` | `boolean` | Runs the play operation. |
| `sound.start(id: any)` | `boolean` | Starts the resource. |
| `sound.pause(id: any)` | `boolean` | Runs the pause operation. |
| `sound.unpause(id: any)` | `boolean` | Runs the unpause operation. |
| `sound.unload(id: any)` | `boolean` | Runs the unload operation. |
| `sound.clear(id: any)` | `boolean` | Clears all stored values. |
| `sound.volume(id: any, value: number)` | `boolean` | Runs the volume operation. |
| `sound.currentTime(id: any)` | `number` | Runs the current time operation. |
| `sound.loaded(id: any)` | `boolean` | Runs the loaded operation. |
| `sound.playing(id: any)` | `boolean` | Runs the playing operation. |
| `sound.duration(id: any)` | `number` | Runs the duration operation. |
| `sound.percent(id: any)` | `number` | Runs the percent operation. |
| `sound.info(id: string, field: string)` | `number` | Runs the info operation. |

## Notes

- Standard-library imports accept both `import "osl/sound"` and `import "sound"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
