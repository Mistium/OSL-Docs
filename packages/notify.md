# notify

> Desktop notifications

Use `notify` to show desktop notifications from an OSL program.

```javascript
import "osl/notify"
```

## API reference

### `notify`

| Method | Returns | Description |
| --- | --- | --- |
| `notify.send(title: any, message: any)` | `boolean` | Sends data. |
| `notify.sendWithSound(title: any, message: any, sound: any)` | `boolean` | Sends with sound. |
| `notify.alert(title: any, message: any)` | `boolean` | Runs the alert operation. |
| `notify.isAvailable()` | `boolean` | Reports whether available. |

## Notes

- Standard-library imports accept both `import "osl/notify"` and `import "notify"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
