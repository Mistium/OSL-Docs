# xml

Use `xml` for parsing XML documents, querying paths, reading attributes, editing text or attributes, and serialising back to XML.

```osl
import "std:xml"
```

## API reference

### `xml`

| Method | Returns | Notes |
| --- | --- | --- |
| `xml.toStr()` | `string` | Converts to str. |
| `xml.toArr()` | `array` | Recursively converts the document and its children to arrays and objects. |
| `xml.findNode(path: any)` | `*xmlNode` |  |
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

## Notes

- Prefer `import "std:xml"`; the older `import "osl/xml"` spelling remains supported.

## Behavior and limits

Malformed or truncated XML returns a parse error without exposing a partial document. Queries
handle namespaces, attributes, mixed content, entities, and nested elements. Empty child lists
return empty arrays. Serialization sorts attributes for stable output.
