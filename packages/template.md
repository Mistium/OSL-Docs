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
| `template.render(tmpl: any, data: object)` | `string` | Runs the render operation. |
| `template.renderHTML(tmpl: any, data: object)` | `string` | Runs the render html operation. |

## Notes

- Standard-library imports accept both `import "osl/template"` and `import "template"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
