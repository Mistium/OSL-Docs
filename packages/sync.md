# sync

> Named locks for synchronisation

Use `sync` for named locks shared by cooperating parts of a program.

```javascript
import "osl/sync"
```

## API reference

### `sync`

| Method | Returns | Description |
| --- | --- | --- |
| `sync.lock(name: string)` | `void` | Runs the lock operation. |
| `sync.unlock(name: string)` | `void` | Runs the unlock operation. |

## Notes

- Standard-library imports accept both `import "osl/sync"` and `import "sync"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
