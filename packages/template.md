# template

> Lightweight `{{ }}` templating with HTML escaping

Use `template` to render small text or HTML templates with data maps.

```javascript
import "osl/template"
```

## Example

```javascript
import "osl/template"

log template.render("Hello {{name}}", {name: "Ada"})
```

## API reference

### `template`

| Method | Returns | Description |
| --- | --- | --- |
| `template.render(tmpl: any, data: object)` | `string` | Renders interpolation, loops, and shared `if`/`unless` conditional blocks. |
| `template.renderHTML(tmpl: any, data: object)` | `string` | Uses the shared renderer with standard HTML escaping enabled. |

## Notes

- Standard-library imports accept both `import "osl/template"` and `import "template"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

False, zero, and null remain distinct from missing values. Invalid loops,
unclosed directives, and all HTML-sensitive characters have controlled behavior.
Recursive block rendering returns only the rendered text and reuses scope storage.
