# notify

Use `notify` to show desktop notifications from an OSL program.

```osl
import "std:notify"
```

## API reference

### `notify`

| Method | Returns | Notes |
| --- | --- | --- |
| `notify.send(title: any, message: any)` | `boolean` | Sends data. |
| `notify.sendWithSound(title: any, message: any, sound: any)` | `boolean` | Sends with sound on macOS and otherwise falls back to `send`. |
| `notify.alert(title: any, message: any)` | `boolean` |  |
| `notify.isAvailable()` | `boolean` |  |

## Notes

- Prefer `import "std:notify"`; the older `import "osl/notify"` spelling remains supported.

## Behavior and limits

On macOS and Linux, notification text is passed as command arguments rather than shell source. The
Windows implementation escapes quotes before building its PowerShell literal. `isAvailable`
checks for the platform command, and send failures return `false`.
