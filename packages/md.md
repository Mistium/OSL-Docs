# md

> Markdown to HTML (CommonMark + GFM via goldmark)

Use `md` to turn Markdown into HTML. It is built for serving pages with
[`serve`](serve.md) and composing markup with [`template`](template.md).

```javascript
import "osl/md"
```

## Example

```javascript
import "osl/md"

log md.toHTML("# Hello\n\n**world**")
// <h1 id="hello">Hello</h1>\n<p><strong>world</strong></p>\n
```

## With `serve`

Pass the HTML string straight to `ctx.html` when you want a full response body:

```javascript
import "osl/md"
import "osl/serve"

*serve.Router app = serve.new()

app.GET("/", def(ctx) -> (
  string body = md.toHTML("# Home\n\nWelcome.")
  ctx.html(200, body)
))

app.run(":8080")
```

Or wrap it in a small page layout first:

```javascript
import "osl/md"
import "osl/template"
import "osl/serve"

*serve.Router app = serve.new()

app.GET("/doc", def(ctx) -> (
  string content = md.toHTML("# Docs\n\nSee below.")
  string page = template.renderHTML(`<!doctype html>
<html><body>
{{& content}}
</body></html>`, {content: content})
  ctx.html(200, page)
))

app.run(":8080")
```

## With `template`

`template.renderHTML` escapes interpolated values by default. Use `{{& name}}`
when the value is already HTML from `md.toHTML`:

```javascript
import "osl/md"
import "osl/template"

string body = md.toHTML("**hi**")
string out = template.renderHTML("<article>{{& body}}</article>", {body: body})
// <article><p><strong>hi</strong></p>\n</article>
```

Using `{{body}}` (without `&`) would escape the tags and show the HTML source.

## API reference

#### `md.toHTML(source)` → `string`
Renders Markdown `source` to HTML. Enables GitHub Flavored Markdown (tables,
strikethrough, autolinks, task lists) and auto heading IDs. Raw HTML tags in the
source are **not passed through** (safe default for untrusted content).

```javascript
string html = md.toHTML("# Title\n\n| a | b |\n| - | - |\n| 1 | 2 |")
```

#### `md.toHTMLUnsafe(source)` → `string`
Same as [`md.toHTML`](#mdtohtmlsource--string), but raw HTML in the Markdown is
left as-is. Only use this with trusted input.

```javascript
string html = md.toHTMLUnsafe("Hello <em>world</em>")
// contains a real <em> element
```

## Notes

- Standard-library imports accept both `import "osl/md"` and `import "md"`.
- Rendering is powered by [goldmark](https://github.com/yuin/goldmark).
- Return values are ordinary OSL strings — pass them to `ctx.html`, `ctx.send`,
  or template slots as needed.
