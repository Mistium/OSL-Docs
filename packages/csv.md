# csv

Use `csv` for CSV parsing, writing, and table-style transforms over arrays of row objects.

```osl
import "std:csv"
```

## Example

```osl
import "std:csv"

array rows = csv.parse("name,age\nAda,36")
log rows[0]["name"]
```

## API reference

### `csv`

| Method | Returns | Notes |
| --- | --- | --- |
| `csv.parse(data: any)` | `array` | Maps each data row to the header names, filling missing fields with empty strings. |
| `csv.parseRaw(data: any)` | `array` | Parses raw. |
| `csv.stringify(data: object)` | `string` | Serialises a value to text. |
| `csv.stringifyRows(data: array)` | `string` |  |
| `csv.stringifyArray(data: array)` | `string` |  |
| `csv.readFile(path: any)` | `array` | Reads and parses keyed rows, returning an empty array on failure. |
| `csv.readFileRaw(path: any)` | `array` | Reads and parses raw rows, returning an empty array on failure. |
| `csv.writeFile(path: any, data: object)` | `boolean` | Stringifies one object and writes it to a file. |
| `csv.writeFileRows(path: any, data: array)` | `boolean` | Stringifies keyed rows and writes them to a file. |
| `csv.writeFileArray(path: any, data: array)` | `boolean` | Stringifies raw rows and writes them to a file. |
| `csv.toRows(data: array)` | `array` | Converts keyed objects through the same ordered row mapping used by parsing. |
| `csv.fromRows(rows: array)` | `array` | Creates from rows. |
| `csv.getColumn(data: array, column: any)` | `array` | Returns column. |
| `csv.filter(data: array, fn: any)` | `array` | Returns values accepted by a callback. |
| `csv.mapRows(data: array, fn: any)` | `array` |  |
| `csv.reduce(data: array, initial: any, fn: any)` | `any` | Reduces values with a callback. |
| `csv.groupBy(data: array, key: any)` | `string[array]` | Groups rows by the selected field. |
| `csv.sortBy(data: array, key: any)` | `array` |  |
| `csv.sortByNum(data: array, key: any)` | `array` |  |
| `csv.aggregate(data: array, key: any, value: any, fn: any)` | `object` |  |
| `csv.count(data: array, key: any)` | `object` |  |
| `csv.unique(data: array, key: any)` | `array` |  |
| `csv.join(data1: array, data2: array, key: any)` | `array` |  |
| `csv.pivot(data: array, keyColumn: any, valueColumn: any, pivotColumn: any)` | `string[object]` | Pivots rows into keyed objects. |
| `csv.transpose(data: array)` | `array` |  |
| `csv.stats(data: array, key: any)` | `object` | Returns usage statistics. |
| `csv.merge(data1: array, data2: array)` | `array` |  |
| `csv.chunk(data: array, size: any)` | `array` |  |
| `csv.flatten(data: array, separator: any)` | `array` |  |
| `csv.sample(data: array, count: any)` | `array` |  |
| `csv.appendRow(data: array, row: object)` | `array` |  |
| `csv.prependRow(data: array, row: object)` | `array` |  |
| `csv.insertRow(data: array, index: any, row: object)` | `array` |  |
| `csv.deleteRow(data: array, index: any)` | `array` | Deletes row. |
| `csv.addColumn(data: array, column: any, defaultValue: any)` | `array` | Adds column. |
| `csv.removeColumn(data: array, column: any)` | `array` | Removes column. |
| `csv.renameColumn(data: array, oldColumn: any, newColumn: any)` | `array` |  |

## Notes

- Prefer `import "std:csv"`; the older `import "osl/csv"` spelling remains supported.

## Behavior and limits

The parser accepts a UTF-8 BOM and rows with different lengths, but rejects duplicate headers.
Writers keep header order stable. Column edits do not change the source rows. A partial sample never
returns the same source row twice. Sampling and transposing empty or uneven data is supported.
