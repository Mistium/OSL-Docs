# notify

Use `notify` to show desktop notifications from an OSL program.

```javascript
import "std:notify"
```

## API reference

### `notify`

| Method | Returns | Description |
| --- | --- | --- |
| `notify.send(title: any, message: any)` | `boolean` | Sends data. |
| `notify.sendWithSound(title: any, message: any, sound: any)` | `boolean` | Sends with sound on macOS and otherwise falls back to `send`. |
| `notify.alert(title: any, message: any)` | `boolean` | Runs the alert operation. |
| `notify.isAvailable()` | `boolean` | Reports whether the platform notification command is available. |

## Notes

- Prefer `import "std:notify"`; the older `import "osl/notify"` spelling remains supported.

## Edge-case behavior

Notification text is passed as process arguments on macOS and Linux. Windows
PowerShell literals escape embedded quotes before interpolation. Availability
uses executable lookup and failures return false.
