# csv

> CSV parsing and generation utilities

```javascript
import "osl/csv"
```

## Methods

- `csv.parse(data)` → `array`
- `csv.parseRaw(data)` → `array`
- `csv.stringify(data)` → `string`
- `csv.stringifyRows(data)` → `string`
- `csv.stringifyArray(data)` → `string`
- `csv.readFile(path)` → `array`
- `csv.readFileRaw(path)` → `array`
- `csv.writeFile(path, data)` → `boolean`
- `csv.writeFileRows(path, data)` → `boolean`
- `csv.writeFileArray(path, data)` → `boolean`
- `csv.toRows(data)` → `array`
- `csv.fromRows(rows)` → `array`
- `csv.getColumn(data, column)` → `array`
- `csv.filter(data, fn)` → `array`
- `csv.mapRows(data, fn)` → `array`
- `csv.reduce(data, initial, fn)` → `any`
- `csv.groupBy(data, key)` → `object`
- `csv.sortBy(data, key)` → `array`
- `csv.sortByNum(data, key)` → `array`
- `csv.aggregate(data, key, value, fn)` → `object`
- `csv.count(data, key)` → `object`
- `csv.unique(data, key)` → `array`
- `csv.join(data1, data2, key)` → `array`
- `csv.pivot(data, keyColumn, valueColumn, pivotColumn)` → `object`
- `csv.transpose(data)` → `array`
- `csv.stats(data, key)` → `object`
- `csv.merge(data1, data2)` → `array`
- `csv.chunk(data, size)` → `array`
- `csv.flatten(data, separator)` → `array`
- `csv.sample(data, count)` → `array`
- `csv.appendRow(data, row)` → `array`
- `csv.prependRow(data, row)` → `array`
- `csv.insertRow(data, index, row)` → `array`
- `csv.deleteRow(data, index)` → `array`
- `csv.addColumn(data, column, defaultValue)` → `array`
- `csv.removeColumn(data, column)` → `array`
- `csv.renameColumn(data, oldColumn, newColumn)` → `array`
