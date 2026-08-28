# template

Use `template` to render small text or HTML templates with data maps.

```javascript
import "std:template"
```

## Example

```javascript
import "std:template"

log template.render("Hello {{name}}", {name: "Ada"})
```

## API reference

### `template`

| Method | Returns | Description |
| --- | --- | --- |
| `template.render(tmpl: any, data: object)` | `string` | Renders interpolation, loops, and shared `if`/`unless` conditional blocks. |
| `template.renderHTML(tmpl: any, data: object)` | `string` | Uses the shared renderer with standard HTML escaping enabled. |

## Notes

- Prefer `import "std:template"`; the older `import "osl/template"` spelling remains supported.

## Edge-case behavior

False, zero, and null remain distinct from missing values. Invalid loops,
unclosed directives, and all HTML-sensitive characters have controlled behavior.
Recursive block rendering returns only the rendered text and reuses scope storage.
