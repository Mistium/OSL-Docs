# template

Use `template` to render small text or HTML templates with data maps.

```osl
import "std:template"
```

## Example

```osl
import "std:template"

log template.render("Hello {{name}}", {name: "Ada"})
```

## API reference

### `template`

| Method | Returns | Notes |
| --- | --- | --- |
| `template.render(tmpl: any, data: object)` | `string` | Renders interpolation, loops, and `if` or `unless` blocks. |
| `template.renderHTML(tmpl: any, data: object)` | `string` | Renders a template and HTML-escapes inserted values. |

## Notes

- Prefer `import "std:template"`; the older `import "osl/template"` spelling remains supported.

## Behavior and limits

`false`, zero, `null`, and a missing value remain distinct. Invalid loops and unclosed directives
return errors. HTML rendering escapes all HTML-sensitive characters. A nested block receives its
parent scope without leaking local values back into it.
