# save

> Simple persistent key-value storage

Use `save` for simple persistent key-value data without designing a database schema.

```javascript
import "osl/save"
```

## Example

```javascript
import "osl/save"

save.set("theme", "dark")
log save.get("theme")
```

## API reference

### `save`

| Method | Returns | Description |
| --- | --- | --- |
| `save.init(appName: string)` | `boolean` | Runs the init operation. |
| `save.OSL_path(filename: string)` | `string` | Runs the osl path operation. |
| `save.setItem(filename: string, value: any)` | `string` | Sets item. |
| `save.getItem(filename: string)` | `object` | Returns item. |
| `save.exists(filename: string)` | `boolean` | Reports whether the value or resource exists. |
| `save.all()` | `array` | Runs the all operation. |

## Notes

- Standard-library imports accept both `import "osl/save"` and `import "save"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
