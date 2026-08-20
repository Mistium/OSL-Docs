# md

> Markdown to HTML (CommonMark + GFM via goldmark)

Use `md` to turn Markdown into HTML (and back with
[`md.fromHTML`](#mdfromhtmlsource--string)). It is built for serving pages with
[`serve`](serve.md) and composing markup with [`template`](template.md).

```javascript
import "std:md"
```

## Example

```javascript
import "std:md"

log md.toHTML("# Hello\n\n**world**")
// <h1 id="hello">Hello</h1>\n<p><strong>world</strong></p>\n
```

## With `serve`

Pass the HTML string straight to `ctx.html` when you want a full response body:

```javascript
import "std:md"
import "std:serve"

*serve.Router app = serve.new()

app.GET("/", def(ctx) -> (
  string body = md.toHTML("# Home\n\nWelcome.")
  ctx.html(200, body)
))

app.run(":8080")
```

Or wrap it in a small page layout first:

```javascript
import "std:md"
import "std:template"
import "std:serve"

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
import "std:md"
import "std:template"

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
left as-is. It shares the safe engine's GFM and heading options; only raw-HTML
rendering differs. Only use this with trusted input.

```javascript
string html = md.toHTMLUnsafe("Hello <em>world</em>")
// contains a real <em> element
```

#### `md.fromHTML(source)` → `string`
The inverse of [`md.toHTML`](#mdtohtmlsource--string): converts an HTML `source`
string into Markdown. Headings, emphasis, links, lists, and other common
elements map to their Markdown equivalents; unconvertible input yields an empty
string.

```javascript
string mdText = md.fromHTML("<h1>Hello</h1><p>a <strong>bold</strong> word</p>")
// # Hello\n\na **bold** word
```

## Notes

- Prefer `import "std:md"`; the older `import "osl/md"` spelling remains supported.
- Rendering is powered by [goldmark](https://github.com/yuin/goldmark).
- Return values are ordinary OSL strings — pass them to `ctx.html`, `ctx.send`,
  or template slots as needed.

#### `md.sanitize(source)` → `string`

Sanitizes Markdown by rendering it through `md.toHTML` and converting that safe
HTML back to Markdown. Repeated sanitization is idempotent.
