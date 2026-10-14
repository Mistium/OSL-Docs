# md

Use `md` to turn Markdown into HTML and HTML back into Markdown. It pairs with [`serve`](serve.md) for pages and [`template`](template.md) for layouts.

```osl
import "std:md"
```

## Example

```osl
import "std:md"

log md.toHTML("# Hello\n\n**world**")
// <h1 id="hello">Hello</h1>
// <p><strong>world</strong></p>

log md.fromHTML("<h1>Hello</h1><p>a <strong>bold</strong> word</p>")
// # Hello
//
// a **bold** word
```

## With `serve` and `template`

`template.render` with `{html: true}` escapes inserted values. Use `{{& name}}` for a value that is already HTML from `md.toHTML`:

```osl
import "std:md"
import "std:template"
import "std:serve"

*serve.Router app = serve.new()

app.get("/doc", def(*serve.Context ctx) -> (
  string content = md.toHTML("# Docs\n\nSee below.")
  string page = template.render("<!doctype html>\n<html><body>\n{{& content}}\n</body></html>", {content: content}, {html: true})
  ctx.html(200, page)
))

app.run(":8080")
```

Writing `{{content}}` without `&` would escape the tags and show the HTML source.

## API reference

### `md`

| Function | Returns | Notes |
| --- | --- | --- |
| `md.toHTML(text: string, options?: object)` | `string` | Renders Markdown as HTML with GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks) and an `id` on every heading. Options: `unsafe` (default `false`). |
| `md.fromHTML(html: string)` | `result<string, error>` | Converts HTML to Markdown. Headings, emphasis, links, lists, and other common elements map to their Markdown forms. Fails with `ParseError` when the HTML can't be converted. |
| `md.sanitize(text: string)` | `result<string, error>` | Removes raw HTML and unsafe links from Markdown by rendering it to safe HTML and converting that back. Running it twice gives the same text. Fails with `ParseError` when the rendered HTML can't be converted back. |

### Raw HTML and unsafe links

By default `toHTML` drops raw HTML tags and `javascript:` links, so it is safe for untrusted text. Pass `{unsafe: true}` to keep them, and only for text you trust:

```osl
import "std:md"

log md.toHTML("Hello <em>world</em>")                 // <p>Hello <!-- raw HTML omitted -->world<!-- raw HTML omitted --></p>
log md.toHTML("Hello <em>world</em>", {unsafe: true}) // <p>Hello <em>world</em></p>
```

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `md.toHTMLUnsafe(text)` | `md.toHTML(text, {unsafe: true})` |

## Behavior and limits

- Rendering uses [goldmark](https://github.com/yuin/goldmark).
- The older `import "osl/md"` spelling still works with a migration warning.
