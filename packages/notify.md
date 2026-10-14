# notify

Use `notify` to show desktop notifications and alert dialogs on macOS, Linux and Windows.

```osl
import "std:notify"
```

## Example

```osl
import "std:notify"

if notify.isAvailable() (
  notify.send("Build finished", "All 42 tests passed") catch (err) (
    log "couldn't notify: " ++ err.message
  )
)
```

## API reference

| Function | Returns | Notes |
| --- | --- | --- |
| `notify.send(title, message, options?)` | `result<unit, error>` | Shows a desktop notification. Option `sound` (a string) plays a named system sound with it, such as `"Glass"` or `"default"`; only macOS supports sounds. |
| `notify.alert(title, message)` | `result<unit, error>` | Shows a dialog with an OK button and waits until it is dismissed. |
| `notify.isAvailable()` | `boolean` | Whether `notify.send` can work here: the system is supported and its helper is installed. |

| System | `send` uses | `alert` uses |
| --- | --- | --- |
| macOS | `osascript` | `osascript` |
| Linux | `notify-send` | `zenity`, falling back to a notification when it isn't installed |
| Windows | PowerShell | PowerShell |

Both functions fail with:

| Kind | When |
| --- | --- |
| `UnsupportedError` | Another operating system, or a `sound` asked for outside macOS |
| `NotFoundError` | The helper command isn't installed |
| `RuntimeError` | The helper command failed |

Used as a plain statement, a failed call throws. Since a missing notification is rarely fatal,
handle the error with `catch` as in the example.

## Changes from earlier versions

`notify.sendWithSound(title, message, sound)` is now `notify.send(title, message, {sound: name})`.
`send` and `alert` return a result instead of `false` on failure; it still works as a condition, as
in `if notify.send(...)`.

## Behavior and limits

The older `import "osl/notify"` spelling still works, with a migration warning.

On macOS and Linux, the title and message are passed as command arguments rather than shell source,
and a title starting with `-` is shown rather than read as an option. On Windows, quotes are escaped
before the text is put into the PowerShell command.
