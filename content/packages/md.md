---
description: Render Markdown to HTML, turn HTML back into Markdown, and strip unsafe content from Markdown you did not write.
package: md
---

# md

`md` converts between Markdown and HTML. Use it to publish posts and docs, to show user-written text on a web page, or to bring HTML from elsewhere into Markdown. It understands GitHub Flavored Markdown: tables, task lists, strikethrough and autolinks.

```osl fragment
import "std:md"
```

## Markdown to HTML

`md.toHTML` returns a string. Every heading gets an `id`, so you can link to it.

```osl
import "std:md"

string text = "# Hello there\n\nSome *emphasis*, **strong text** and `code`.\n\n- one\n- two\n"
log md.toHTML(text)
```

```output
<h1 id="hello-there">Hello there</h1>
<p>Some <em>emphasis</em>, <strong>strong text</strong> and <code>code</code>.</p>
<ul>
<li>one</li>
<li>two</li>
</ul>

```

Try it: add a `## Second` heading and see its `id`.

## GitHub extensions

Tables, task lists and strikethrough work as they do on GitHub.

```osl
import "std:md"

string text = [
  "| name | qty |",
  "|------|-----|",
  "| bolt | 12 |",
  "",
  "- [x] write",
  "- [ ] test",
  "",
  "~~old~~ new"
].join("\n")
log md.toHTML(text)
```

```output
<table>
<thead>
<tr>
<th>name</th>
<th>qty</th>
</tr>
</thead>
<tbody>
<tr>
<td>bolt</td>
<td>12</td>
</tr>
</tbody>
</table>
<ul>
<li><input checked="" disabled="" type="checkbox"> write</li>
<li><input disabled="" type="checkbox"> test</li>
</ul>
<p><del>old</del> new</p>

```

## Untrusted input is made safe

Raw HTML and `javascript:` links in the text are dropped, so you can render what visitors type without opening the door to script injection. The raw tags are replaced by comments.

```osl
import "std:md"

log md.toHTML("hi <script>steal()</script> [click](javascript:alert(1)) [ok](https://example.com)")
```

```output
<p>hi <!-- raw HTML omitted -->steal()<!-- raw HTML omitted --> <a href="">click</a> <a href="https://example.com">ok</a></p>

```

Notice that the text between the tags stays as plain text. If you trust the source, such as your own documents, pass `{unsafe: true}` to keep raw HTML:

```osl
import "std:md"

log md.toHTML("A <kbd>Ctrl</kbd> key", {unsafe: true})
```

```output
<p>A <kbd>Ctrl</kbd> key</p>

```

> [!warning]
> Only use `unsafe: true` on text you wrote yourself. It is the one switch that lets a script through.

## HTML to Markdown

`md.fromHTML` goes the other way. It returns a [result](../learn/errors.md): HTML it can't convert is a `ParseError`.

```osl
import "std:md"

string html = [
  `<h1>Title</h1>`,
  `<p>Hello <b>bold</b> and <a href="http://example.com">a link</a>.</p>`,
  `<ul><li>one</li><li>two</li></ul>`
].join("")
log md.fromHTML(html).unwrap()
```

```output
# Title

Hello **bold** and [a link](http://example.com).

- one
- two
```

This is useful for importing pages you scraped or for turning rich-text editor output into something you can store and diff.

Try it: add an `<h2>` and an `<em>` to the HTML.

## Sanitising Markdown

`md.sanitize` takes Markdown and returns Markdown with raw HTML tags and unsafe links removed. It does this by rendering to safe HTML and converting back, so the result is still Markdown you can store.

```osl
import "std:md"

string cleaned = md.sanitize(
  "**bold** <script>x()</script> [bad](javascript:alert(1)) [good](https://example.com)"
).unwrap()
log cleaned
```

```output
**bold** x() [bad]() [good](https://example.com)
```

Tag text such as `x()` survives as plain text, and the unsafe link loses its address. Sanitise what you store, or render with `toHTML`, which applies the same rules.

## A small page generator

Put it together with [fs](fs.md) to turn a Markdown file into a page:

```osl
import "std:md"
import "std:fs"

fs.writeFile("post.md", "# First post\n\nWritten in *Markdown*.\n").unwrap()
string body = md.toHTML(fs.readFile("post.md").unwrap())
string page = "<!doctype html>\n<title>Post</title>\n" ++ body
fs.writeFile("post.html", page).unwrap()
log fs.readFile("post.html").unwrap()
```

```output
<!doctype html>
<title>Post</title>
<h1 id="first-post">First post</h1>
<p>Written in <em>Markdown</em>.</p>

```

:::quiz
A visitor posts `<script>alert(1)</script>` in a comment. What does `md.toHTML(comment)` do with it?

- [ ] Leaves it, so the script runs.
- [x] Drops the tags, so it is safe by default.
- [ ] Throws a `ParseError`.

Raw HTML is dropped unless you pass `{unsafe: true}`, which is only for text you wrote.
:::

:::exercise title="A heading helper"
Write `heading(text)` that returns the HTML for a level-one heading with that text, and print it for `Hello`.

```osl
import "std:md"

log md.toHTML("plain text")
```

```output
<h1 id="hello">Hello</h1>
```

> [!hint]
> Markdown headings start with `# `.

> [!hint]
> `.trim()` removes the trailing newline.

```osl solution
import "std:md"

def heading(string text) string -> md.toHTML("# " ++ text).trim()

log heading("Hello")
```

```output
<h1 id="hello">Hello</h1>
```
:::

## API reference

::api
