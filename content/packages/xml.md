---
description: Parse XML, look things up with simple paths, change a document in place and write it back.
package: xml
---

# xml

`xml` reads, queries, edits and writes XML. Reach for it with RSS and Atom feeds, SVG, SOAP-style APIs and older config files. You parse text into a `Document` and ask it questions with short paths such as `feed>entry>title`.

```osl fragment
import "std:xml"
```

## Parse and look things up

`xml.parse` returns a [result](../learn/errors.md) holding a document. `text` gives an element's own text and `attr` an attribute, both `null` when nothing matches.

```osl
import "std:xml"

string text = `<library name="City">
  <book id="1"><title>Dune</title><year>1965</year></book>
  <book id="2"><title>Emma</title><year>1815</year></book>
</library>`

auto doc = xml.parse(text).unwrap()
log doc.text("library>book>title")
log doc.attr("library", "name")
log doc.attr("book", "id")
log doc.text("missing")
log doc.has("year") doc.has("author")
```

```output
Dune
City
1
null
true false
```

A path is a list of element names joined with `>`. Each name matches at any depth below the one before, so `book>title` works without spelling out `library`. The query returns the first match in document order.

Try it: ask for `doc.attr("book", "missing")` and see `null`.

## Every match

`findAll` returns each matching element as a record with `name`, `text`, `attrs` and `children`.

```osl
import "std:xml"

auto doc = xml.parse(`<lib><book id="1">Dune</book><book id="2">Emma</book></lib>`).unwrap()
for b in doc.findAll("book") (
  log b.attrs["id"] b.text
)
log doc.findAll("book").len
log doc.count("lib")
log doc.findAll("magazine")
```

```output
1 Dune
2 Emma
2
2
[]
```

`count(path)` counts the child elements of the first match, here the two books in `lib`. To count matches of a path, use `findAll(path).len`.

## Errors

Malformed XML is a `ParseError` with a line number. A file that doesn't exist is `NotFoundError`.

```osl
import "std:xml"

log xml.isValid("<a><b></a>") xml.isValid("<a/>")
switch xml.parse("<a><b></a>") (
  case ok(d)
    log "parsed"
  case err(e)
    log e.kind
)
log xml.parseFile("no-such.xml").unwrapErr().kind
```

```output
false true
ParseError
NotFoundError
```

## Edit in place

`setText`, `setAttr`, `remove` and `clear` change the document, and `toStr` writes it back. Editing a path that matches nothing is a `NotFoundError`, so a typo doesn't silently do nothing. Attributes are written in sorted order and text is escaped.

```osl
import "std:xml"

auto doc = xml.parse(`<config><name>old</name><debug>1</debug><tmp>x</tmp></config>`).unwrap()
doc.setText("name", "new & improved").unwrap()
doc.setAttr("config", "version", 2).unwrap()
doc.remove("tmp").unwrap()
doc.clear("debug").unwrap()
log doc.toStr()
log doc.setText("nope", "x").unwrapErr().kind
```

```output
<config version="2"><name>new &amp; improved</name><debug/></config>
NotFoundError
```

Try it: set the text of `"nope"` and read the error kind.

## Real-world: reading a feed

Walk the records `findAll` gives you and collect what you need:

```osl
import "std:xml"

string feed = `<rss><channel><title>News</title>
<item><title>First</title><link>http://x/1</link></item>
<item><title>Second</title><link>http://x/2</link></item>
</channel></rss>`

auto doc = xml.parse(feed).unwrap()
log "feed:" doc.text("channel>title")
for item in doc.findAll("item") (
  string title = ""
  for c in item.children (
    if c.name == "title" ( title = c.text )
  )
  log "-" title
)
```

```output
feed: News
- First
- Second
```

> [!note]
> `doc.text("channel>title")` finds the channel's title, because the channel's own title is the first `title` below `channel`. The item titles come later in the file.

## The whole tree

`root()` returns the root element with all its children as one nested record. That is handy for converting a document to JSON:

```osl
import "std:xml"
import "std:json"

auto doc = xml.parse(`<p class="x">hi <b>there</b></p>`).unwrap()
log json.stringify(doc.root())
```

```output
{"attrs":{"class":"x"},"children":[{"attrs":{},"children":[],"name":"b","text":"there"}],"name":"p","text":"hi"}
```

:::quiz
`doc.text("book>title")` when the file has three books returns...

- [ ] A list of three titles.
- [x] The first matching title.
- [ ] An error.

`text`, `attr` and `find` return the first match. Use `findAll` for every match.
:::

:::exercise title="List the items"
Print `id title` for every item. The title is the item's own text.

```osl
import "std:xml"

auto doc = xml.parse(`<list><item id="1">Apple</item><item id="2">Pear</item><item id="3">Fig</item></list>`).unwrap()
log doc.count("list")
```

```output
1 Apple
2 Pear
3 Fig
```

> [!hint]
> `doc.findAll("item")` gives records.

> [!hint]
> A record has `attrs` and `text`.

```osl solution
import "std:xml"

auto doc = xml.parse(`<list><item id="1">Apple</item><item id="2">Pear</item><item id="3">Fig</item></list>`).unwrap()
for item in doc.findAll("item") (
  log item.attrs["id"] item.text
)
```

```output
1 Apple
2 Pear
3 Fig
```
:::

## API reference

::api
