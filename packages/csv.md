# csv

Use `csv` to read CSV text as objects (one per row, keyed by the header) or as raw rows of cells, and to write either shape back out.

```osl
import "std:csv"
```

## Example

```osl
import "std:csv"

array people = csv.parse("name,age,city\nAda,36,London\nLinus,28,Helsinki\n")
log people[1].name // Ada

array older = people.filter(row -> row.age.toNum() > 30)
log csv.stringify(older, {columns: ["name", "city"]})
```

Every cell is parsed as a string. Use array methods such as `filter`, `map`, and `sortBy` to work with the records, then `csv.stringify` to write them.

## API reference

### `csv`

| Function | Returns | Notes |
| --- | --- | --- |
| `csv.parse(text: string, options?: object)` | `result<object[], error>` | Uses the first row as column names and returns one object per remaining row. A short row fills the missing cells with `""`. |
| `csv.parseFile(path: string, options?: object)` | `result<object[], error>` | Reads a file and parses it like `parse`. |
| `csv.parseRows(text: string, options?: object)` | `result<string[][], error>` | Returns every row as an array of string cells, header row included, keeping column order and row lengths. |
| `csv.parseRowsFile(path: string, options?: object)` | `result<string[][], error>` | Reads a file and parses it like `parseRows`. |
| `csv.stringify(data: array, options?: object)` | `string` | Writes an array of objects (a header row, then one row per object) or an array of arrays (rows as they are). |
| `csv.isValid(text: string)` | `boolean` | Whether `csv.parse` accepts the text with the default options. |

### Options

| Key | Used by | Meaning |
| --- | --- | --- |
| `delimiter` | all | One character separating cells. Default `","`. |
| `columns` | `stringify` with objects | The column names to write, in order. Default: every key used, sorted. |
| `header` | `stringify` with objects | Write the header row. Default `true`. |

```osl
import "std:csv"

array rows = csv.parseRows("a;b\n1;2", {delimiter: ";"})
log rows                                   // [["a","b"],["1","2"]]
log csv.stringify([["x", "y"], [1, null]]) // x,y then 1,
```

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `parse`, `parseRows` and their `File` forms | `ParseError` | Malformed quoting. `parse` also fails for a repeated column name or a row with more cells than columns. The message names the line. |
| `parseFile`, `parseRowsFile` | `NotFoundError`, `PermissionError`, `IOError` | The file can't be read. |
| `stringify` | throws `TypeError` | `data` is not an array of objects or an array of arrays, including a single object on its own (wrap it as `[record]`) or an array that mixes objects and rows. |

### Writing values

`stringify` writes `null` and missing keys as empty cells. Other values are written as OSL prints them. Objects don't keep column order, so pass `columns` when the order matters. To write a file, use `fs.writeFile(path, csv.stringify(records))`.

## Changes from earlier versions

The old helpers are gone. `csv.parseRaw`, `csv.readFile`, and `csv.readFileRaw` became `parseRows`, `parseFile`, and `parseRowsFile`. `stringifyRows`, `stringifyArray`, and the `write*` functions became `csv.stringify(data)`, with `fs.writeFile` to save the text. The record helpers such as `csv.filter`, `csv.sortBy`, and `csv.groupBy` are now plain array methods or a `for` loop over the records.

## Behavior and limits

- A UTF-8 byte order mark at the start of the text is ignored.
- The older `import "osl/csv"` spelling still works with a migration warning.
