# xml

Use `xml` to parse XML documents, query them with simple paths, edit text and attributes in place, and write them back out.

```osl
import "std:xml"
```

## Example

```osl
import "std:xml"

*xml.Document doc = xml.parse("<feed><entry id=\"1\"><title>One</title></entry><entry id=\"2\"><title>Two</title></entry></feed>")

log doc.text("entry>title") // One
string summary = doc.text("summary") ?? "none"
log summary

for entry in doc.findAll("entry") (
  string id = entry.attrs["id"]
  log id
)

doc.setAttr("feed", "lang", "en")
doc.remove("entry>title")
log doc.toStr()
```

## Paths

A path is element names separated by `>`, such as `"feed>entry>title"`. Each name matches an element at any depth below the previous one. Queries use the first matching element unless they say otherwise.

## API reference

### `xml`

| Function | Returns | Notes |
| --- | --- | --- |
| `xml.parse(text: string)` | `result<*xml.Document, error>` | Parses an XML document. |
| `xml.parseFile(path: string)` | `result<*xml.Document, error>` | Reads a file and parses it like `parse`. |
| `xml.isValid(text: string)` | `boolean` | Whether `xml.parse` accepts the text. |

The built-in `xml(text)` constructor also returns a document. It needs no import and throws a `ParseError` for malformed text.

### `*xml.Document` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `doc.find(path: string)` | `xml.Element?` | The first matching element, or `null`. |
| `doc.findAll(path: string)` | `xml.Element[]` | Every matching element in document order, including matches nested inside other matches. `[]` when nothing matches. |
| `doc.root()` | `xml.Element?` | The root element with its whole tree, or `null` for an empty document. |
| `doc.text(path: string)` | `string?` | The first match's own text, joined and trimmed, or `null` when nothing matches. |
| `doc.attr(path: string, name: string)` | `string?` | An attribute of the first match, or `null` when nothing matches or the attribute is missing. |
| `doc.has(path: string)` | `boolean` | Whether any element matches. |
| `doc.hasAttr(path: string, name: string)` | `boolean` | Whether the first match has the attribute. |
| `doc.count(path: string)` | `int` | How many child elements the first match has, or `0` when nothing matches. To count matches, use `doc.findAll(path).len`. |
| `doc.setText(path: string, value: any)` | `result<unit, error>` | Replaces the first match's text in place, keeping its child elements. |
| `doc.setAttr(path: string, name: string, value: any)` | `result<unit, error>` | Sets an attribute on the first match in place. |
| `doc.remove(path: string)` | `result<unit, error>` | Deletes the first match and its children. Text around it stays. |
| `doc.clear(path: string)` | `result<unit, error>` | Deletes the first match's text and children, keeping the element and its attributes. |
| `doc.toStr()` | `string` | Writes the document as XML with attributes in sorted order and text escaped. An empty document gives `""`. |

### Element records

`find`, `findAll`, and `root` return `xml.Element` records:

| Key | Type | Meaning |
| --- | --- | --- |
| `name` | `string` | The element name, with any prefix. |
| `text` | `string` | The element's own text, joined and trimmed. |
| `attrs` | `string[string]` | Attribute names (prefixes included, such as `"xlink:href"`) to values. |
| `children` | `xml.Element[]` | Child elements. |

An element's own text joins its text segments and trims only the outer whitespace, so `<p>Hello <b>big</b> world</p>` has the text `Hello  world`.

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `parse`, `parseFile` | `ParseError` | Malformed or truncated XML. The message names the line. |
| `parseFile` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |
| `setText`, `setAttr`, `remove`, `clear` | `NotFoundError` | No element matches the path. |

## Changes from earlier versions

The `get`-prefixed document methods took their short names: `getText` is now `text`, `getAttr` is `attr`, `get` is `find`, and `getAll` is `findAll`. `toArr()` and `findNode()` are gone; use `root()` and `find()`.

## Behavior and limits

- Malformed XML never gives a partial document.
- Queries handle namespaces, attributes, mixed content, and entities. Editing keeps mixed text where it was.
