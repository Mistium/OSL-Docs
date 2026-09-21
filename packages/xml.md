# xml

Use `xml` for parsing XML documents, querying paths, reading attributes, editing text or attributes, and serialising back to XML.

`xml` is a built-in language type. It needs no package import.

## API reference

### `xml`

| Method | Returns | Notes |
| --- | --- | --- |
| `xml.toStr()` | `string` | Converts to str. |
| `xml.toArr()` | `array` | Recursively converts the document and its children to arrays and objects. |
| `xml.findNode(path: any)` | `*xml.Node` |  |
| `xml.getText(path: any)` | `any` | Returns text. |
| `xml.getAttr(path: any, attr: any)` | `any` | Returns an attribute, or `null` when either the node or attribute is missing. |
| `xml.get(path: any)` | `object` | Returns a value. |
| `xml.getAll(path: any)` | `array` | Returns all. |
| `xml.has(path: any)` | `boolean` |  |
| `xml.hasAttr(path: any, attr: any)` | `boolean` |  |
| `xml.setText(path: any, value: any)` | `void` | Sets text. |
| `xml.setAttr(path: any, attr: any, value: any)` | `void` | Sets attr. |
| `xml.count(path: any)` | `number` |  |
| `xml.remove(path: any)` | `void` | Removes a value or resource. |
| `xml.clear(path: any)` | `void` | Clears all stored values. |

## Behavior and limits

Malformed or truncated XML returns a parse error without exposing a partial document. An element's
text joins its own text segments and trims only the outer whitespace, so `<p>Hello <b>big</b> world</p>`
has the text `Hello  world`. `getAll` also returns matches nested inside other matches, each once. Queries
handle namespaces, attributes, mixed content, entities, and nested elements. Empty child lists
return empty arrays. Serialization sorts attributes for stable output.
