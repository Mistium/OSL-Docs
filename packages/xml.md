# xml

Use `xml` for parsing XML documents, querying paths, reading attributes, editing text or attributes, and serialising back to XML.

```javascript
import "std:xml"
```

## API reference

### `xml`

| Method | Returns | Description |
| --- | --- | --- |
| `xml.toStr()` | `string` | Converts to str. |
| `xml.toArr()` | `array` | Recursively converts nodes through the same projection used for nested children. |
| `xml.findNode(path: any)` | `*xmlNode` | Runs the find node operation. |
| `xml.getText(path: any)` | `any` | Returns text. |
| `xml.getAttr(path: any, attr: any)` | `any` | Returns an attribute, or `null` when either the node or attribute is missing. |
| `xml.get(path: any)` | `object` | Returns a value. |
| `xml.getAll(path: any)` | `array` | Returns all. |
| `xml.has(path: any)` | `boolean` | Reports whether the value exists. |
| `xml.hasAttr(path: any, attr: any)` | `boolean` | Reports whether the node has the requested attribute. |
| `xml.setText(path: any, value: any)` | `void` | Sets text. |
| `xml.setAttr(path: any, attr: any, value: any)` | `void` | Sets attr. |
| `xml.count(path: any)` | `number` | Runs the count operation. |
| `xml.remove(path: any)` | `void` | Removes a value or resource. |
| `xml.clear(path: any)` | `void` | Clears all stored values. |

## Notes

- Prefer `import "std:xml"`; the older `import "osl/xml"` spelling remains supported.

## Edge-case behavior

Malformed/truncated input, namespaces, attributes, mixed content, entities, and
deep nesting are handled without leaking partial parser state through string,
array, path, or multi-match queries. Empty child collections use zero-value slices,
and serialized attributes remain deterministically sorted.
