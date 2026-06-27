# csv

> CSV parsing plus a small dataframe-style toolkit

Use `csv` for CSV parsing, writing, and table-style transforms over arrays of row objects.

```javascript
import "osl/csv"
```

## Example

```javascript
import "osl/csv"

array rows = csv.parse("name,age\nAda,36")
log rows[0]["name"]
```

## API reference

### `csv`

| Method | Returns | Description |
| --- | --- | --- |
| `csv.parse(data: any)` | `array` | Parses input data. |
| `csv.parseRaw(data: any)` | `array` | Parses raw. |
| `csv.stringify(data: object)` | `string` | Serialises a value to text. |
| `csv.stringifyRows(data: array)` | `string` | Runs the stringify rows operation. |
| `csv.stringifyArray(data: array)` | `string` | Runs the stringify array operation. |
| `csv.readFile(path: any)` | `array` | Reads file. |
| `csv.readFileRaw(path: any)` | `array` | Reads file raw. |
| `csv.writeFile(path: any, data: object)` | `boolean` | Writes file. |
| `csv.writeFileRows(path: any, data: array)` | `boolean` | Writes file rows. |
| `csv.writeFileArray(path: any, data: array)` | `boolean` | Writes file array. |
| `csv.toRows(data: array)` | `array` | Converts to rows. |
| `csv.fromRows(rows: array)` | `array` | Creates from rows. |
| `csv.getColumn(data: array, column: any)` | `array` | Returns column. |
| `csv.filter(data: array, fn: any)` | `array` | Returns values accepted by a callback. |
| `csv.mapRows(data: array, fn: any)` | `array` | Runs the map rows operation. |
| `csv.reduce(data: array, initial: any, fn: any)` | `any` | Reduces values with a callback. |
| `csv.groupBy(data: array, key: any)` | `map[string]array` | Runs the group by operation. |
| `csv.sortBy(data: array, key: any)` | `array` | Runs the sort by operation. |
| `csv.sortByNum(data: array, key: any)` | `array` | Runs the sort by num operation. |
| `csv.aggregate(data: array, key: any, value: any, fn: any)` | `object` | Runs the aggregate operation. |
| `csv.count(data: array, key: any)` | `object` | Runs the count operation. |
| `csv.unique(data: array, key: any)` | `array` | Runs the unique operation. |
| `csv.join(data1: array, data2: array, key: any)` | `array` | Runs the join operation. |
| `csv.pivot(data: array, keyColumn: any, valueColumn: any, pivotColumn: any)` | `map[string]object` | Runs the pivot operation. |
| `csv.transpose(data: array)` | `array` | Runs the transpose operation. |
| `csv.stats(data: array, key: any)` | `object` | Returns usage statistics. |
| `csv.merge(data1: array, data2: array)` | `array` | Runs the merge operation. |
| `csv.chunk(data: array, size: any)` | `array` | Runs the chunk operation. |
| `csv.flatten(data: array, separator: any)` | `array` | Runs the flatten operation. |
| `csv.sample(data: array, count: any)` | `array` | Runs the sample operation. |
| `csv.appendRow(data: array, row: object)` | `array` | Runs the append row operation. |
| `csv.prependRow(data: array, row: object)` | `array` | Runs the prepend row operation. |
| `csv.insertRow(data: array, index: any, row: object)` | `array` | Runs the insert row operation. |
| `csv.deleteRow(data: array, index: any)` | `array` | Deletes row. |
| `csv.addColumn(data: array, column: any, defaultValue: any)` | `array` | Adds column. |
| `csv.removeColumn(data: array, column: any)` | `array` | Removes column. |
| `csv.renameColumn(data: array, oldColumn: any, newColumn: any)` | `array` | Runs the rename column operation. |

## Notes

- Standard-library imports accept both `import "osl/csv"` and `import "csv"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
