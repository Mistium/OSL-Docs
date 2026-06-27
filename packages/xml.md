# xml

> XML parsing and querying

Use `xml` for parsing XML documents, querying paths, reading attributes, editing text or attributes, and serialising back to XML.

```javascript
import "osl/xml"
```

## API reference

### `xml`

| Method | Returns | Description |
| --- | --- | --- |
| `xml.toStr()` | `string` | Converts to str. |
| `xml.toArr()` | `array` | Converts the value to an array. |
| `xml.findNode(path: any)` | `*xmlNode` | Runs the find node operation. |
| `xml.getText(path: any)` | `any` | Returns text. |
| `xml.getAttr(path: any, attr: any)` | `any` | Returns attr. |
| `xml.get(path: any)` | `object` | Returns a value. |
| `xml.getAll(path: any)` | `array` | Returns all. |
| `xml.has(path: any)` | `boolean` | Reports whether the value exists. |
| `xml.hasAttr(path: any, attr: any)` | `boolean` | Reports whether attr. |
| `xml.setText(path: any, value: any)` | `void` | Sets text. |
| `xml.setAttr(path: any, attr: any, value: any)` | `void` | Sets attr. |
| `xml.count(path: any)` | `number` | Runs the count operation. |
| `xml.remove(path: any)` | `void` | Removes a value or resource. |
| `xml.clear(path: any)` | `void` | Clears all stored values. |

## Notes

- Standard-library imports accept both `import "osl/xml"` and `import "xml"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
