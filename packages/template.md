# template

Use `template` to fill `{{ }}` templates from an object, with `if`, `unless`, and `each` blocks and optional HTML escaping.

```osl
import "std:template"
```

## Example

```osl
import "std:template"

log template.render("Hello {{name}}", {name: "Ada"}) // Hello Ada

string list = template.render("<ul>{{#each items}}<li>{{.}}</li>{{else}}<li>none</li>{{/each}}</ul>", {items: ["<b>", "tea"]}, {html: true})
log list // <ul><li>&lt;b&gt;</li><li>tea</li></ul>
```

`template.render` returns `result<string, error>`. Assigning it to a `string` unwraps it and throws on a malformed template. Use `catch`, `try(...)`, or `auto` to handle the error yourself:

```osl
import "std:template"

auto page = template.render("{{#if user}}Hi", {})
if page.isErr() (
  log page.unwrapErr().message
  // template.render: line 1, column 1: {{#if user}} is never closed; add {{/if}}
)
```

## Syntax

| Tag | Meaning |
| --- | --- |
| `{{key}}` | Inserts a value. Dotted paths such as `{{user.name}}` read nested objects. |
| `{{.}}` or `{{this}}` | The current item inside `{{#each}}`. |
| `{{& key}}` | Inserts a value without HTML escaping. |
| `{{#if key}}...{{else}}...{{/if}}` | Renders the first part when the value is true, otherwise the `else` part. |
| `{{#unless key}}...{{/unless}}` | Renders when the value is false. |
| `{{#each key}}...{{else}}...{{/each}}` | Repeats for every item of an array. The `else` part renders for an empty array. Inside, keys read from the item first, then from the enclosing scope. |
| `{{! note}}` | A comment. Renders nothing. |

`null`, `false`, `0`, `""`, and empty arrays and objects are false. A key with no value renders as `""` unless `strict` is set.

## API reference

### `template`

| Function | Returns | Notes |
| --- | --- | --- |
| `template.render(text: string, data: object, options?: object)` | `result<string, error>` | Fills in the template. Options: `html` (HTML-escape inserted values, default `false`) and `strict` (fail for a key with no value, default `false`). |

### Errors

| Kind | When |
| --- | --- |
| `ParseError` | A malformed template: an unclosed `{{` or block, a closing tag that doesn't match its block, a stray or repeated `{{else}}`, an unknown block, or an empty tag. The message names the line and column. |
| `ValueError` | With `strict: true`, a key that has no value. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `template.renderHTML(text, data)` | `template.render(text, data, {html: true})`. `renderHTML` never fails: it renders unclosed blocks to the end and writes stray tags out as they are. |

## Behavior and limits

- HTML escaping covers every HTML-sensitive character.
- A nested block sees its parent scope, but values it sets don't leak back out.
- `{{#each}}` and `{{#if}}` accept typed arrays such as `string[]`.
- The older `import "osl/template"` spelling still works with a migration warning.
