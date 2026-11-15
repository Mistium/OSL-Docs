---
description: Read CSV into objects or rows of cells, write it back with correct quoting, and handle messy files.
package: csv
---

# csv

`std:csv` reads and writes comma-separated values: spreadsheet exports, bank statements, database dumps. It handles the quoting (commas, quotes and newlines inside cells), so you never split lines by hand.

```osl fragment
import "std:csv"
```

## Parse into objects

`csv.parse` treats the first row as column names and returns one object per remaining row. It returns a [result](result.md), since the text may be malformed.

```osl
import "std:csv"

string text = "name,city,age\nAda,London,36\nGrace,New York,85\n"
auto people = csv.parse(text).unwrap()
log people.len
for p in people (
  log p.name "lives in" p.city
)
```

```output
2
Ada lives in London
Grace lives in New York
```

Every cell is a string, because CSV has no types. Convert what you need with `tryAs`, which is a result too, so a bad cell doesn't crash the program:

```osl
import "std:csv"

auto rows = csv.parse("item,qty\nbolt,12\nnut,many\nwasher,7\n").unwrap()
int total = 0
for r in rows (
  switch string(r.qty).tryAs<int> (
    case ok(n)
      total += n
    case err(e)
      log "bad quantity for" r.item ":" r.qty
  )
)
log "total" total
```

```output
bad quantity for nut : many
total 19
```

Try it: add a `Cy,Rome,40` row and run again.

## Quoted cells

Cells with commas, quotes or newlines are wrapped in double quotes, and a quote inside is doubled. `parse` unwraps them.

```osl
import "std:csv"

string text = "name,quote\n\"Smith, J\",\"He said \"\"hi\"\"\"\nLee,\"two\nlines\"\n"
for r in csv.parse(text).unwrap() (
  log r.name "|" r.quote
)
```

```output
Smith, J | He said "hi"
Lee | two
lines
```

Try it: put a comma in a name without quotes and see what happens to the row.

## Rows of cells

Objects don't keep column order, and a header can be missing or wrong. `csv.parseRows` returns plain rows of strings, header included, in file order, and never complains about uneven row lengths.

```osl
import "std:csv"

auto rows = csv.parseRows("a,b,c\n1,2\n3,4,5,6\n").unwrap()
for r in rows ( log r.len r )
```

```output
3 ["a","b","c"]
2 ["1","2"]
4 ["3","4","5","6"]
```

## Other delimiters

Tab-separated and semicolon-separated files are common. Pass `delimiter` (one character).

```osl
import "std:csv"

auto rows = csv.parse("id;price\n1;2,50\n2;3,10\n", {delimiter: ";"}).unwrap()
for r in rows ( log r.id r.price )
log csv.parseRows("a\tb\n1\t2", {delimiter: "\t"}).unwrap()
```

```output
1 2,50
2 3,10
[["a","b"],["1","2"]]
```

## When the input is bad

A `ParseError` names the line, and for quoting problems also the column. A row with more cells than the header, a repeated column name and an unclosed quote all fail. A row with fewer cells just leaves the rest empty.

```osl
import "std:csv"

string[] inputs = ["a,b\n1,2,3", "a,a\n1,2", "a,b\n\"1,2", "a,b\n1"]
for text in inputs (
  switch csv.parse(text) (
    case ok(rows)
      log "ok" rows
    case err(e)
      log e.kind e.message
  )
)
log csv.isValid("a,b\n1,2") csv.isValid("a,b\n\"1")
```

```output
ParseError csv.parse: line 2: 3 fields, but the header has 2 columns
ParseError csv.parse: line 1: the column "a" appears more than once
ParseError csv.parse: line 2, column 5: extraneous or missing " in quoted-field
ok [{"a":"1","b":""}]
true false
```

## Write CSV

`csv.stringify` takes an array of objects (a header row, then one row each) or an array of arrays (rows as they are). It quotes cells that need it. Columns default to every key used, sorted. Pass `columns` to choose and order them, and `header: false` to leave out the header row.

```osl
import "std:csv"

auto data = [
  {name: "Ann, Jr", age: 3, note: "say \"hi\""},
  {name: "Bo", age: 4}
]
log csv.stringify(data)
log csv.stringify(data, {columns: ["name", "age"]})
log csv.stringify(data, {columns: ["age"], header: false})
log csv.stringify([["a", 1], ["b", null]])
```

```output
age,name,note
3,"Ann, Jr","say ""hi"""
4,Bo,

name,age
"Ann, Jr",3
Bo,4

3
4

a,1
b,

```

Missing keys and `null` become empty cells. The output ends with a newline, which `log` shows as a blank line.

Try it: change `columns` to `["age", "name"]`.

## Files

`csv.parseFile` and `csv.parseRowsFile` read a file directly. Write the output with [fs](fs.md).

```osl
import "std:csv"
import "std:fs"

auto people = [{name: "Ada", year: 1815}, {name: "Alan", year: 1912}]
string text = csv.stringify(people, {columns: ["name", "year"]})
fs.writeFile("people.csv", text).unwrap()
for p in csv.parseFile("people.csv").unwrap() (
  log p.name p.year
)
log csv.parseFile("missing.csv").unwrapErr().kind
fs.remove("people.csv").unwrap()
```

```output
Ada 1815
Alan 1912
NotFoundError
```

## Group and total

Read a sales export, total by category, and write a report:

```osl
import "std:csv"

string text = `category,item,amount
fruit,apple,3
veg,leek,2
fruit,pear,4
veg,kale,5
fruit,plum,1
`

string[number] totals = {}
for r in csv.parse(text).unwrap() (
  string cat = r.category
  number amount = string(r.amount).tryAs<number>.unwrapOr(0)
  if totals.contains(cat) ( totals[cat] += amount ) else ( totals[cat] = amount )
)

object[] report = []
for cat in totals.getKeys().sort() (
  report.append({category: cat, total: totals[cat]})
)
log csv.stringify(report, {columns: ["category", "total"]})
```

```output
category,total
fruit,8
veg,7

```

:::exercise title="Clean a contact list"
Parse the CSV text. Keep only people whose `email` contains an `@`, and print them as `name <email>`, one per line, followed by how many rows were dropped.

```osl
import "std:csv"

string text = "name,email\nAda,ada@example.com\nBob,not-an-email\nCy,cy@example.org\n"
auto rows = csv.parse(text).unwrap()
log rows.len
```

```output
Ada <ada@example.com>
Cy <cy@example.org>
dropped 1
```

> [!hint]
> Keep a counter of dropped rows and `continue` when an email has no `@`.

> [!hint]
> Strings have `.contains("@")`.

```osl solution
import "std:csv"

string text = "name,email\nAda,ada@example.com\nBob,not-an-email\nCy,cy@example.org\n"
auto rows = csv.parse(text).unwrap()
int dropped = 0
for r in rows (
  string email = r.email
  if !email.contains("@") (
    dropped++
    continue
  )
  log r.name ++ " <" ++ email ++ ">"
)
log "dropped" dropped
```

```output
Ada <ada@example.com>
Cy <cy@example.org>
dropped 1
```
:::

:::quiz
What type is every cell `csv.parse` gives you?

- [ ] `int` when it looks like a number.
- [x] `string`, always.
- [ ] `any`, decided by the column.

CSV has no types, so convert with `tryAs<int>` or `tryAs<number>` and handle the failure.
:::

:::exercise title="Double the scores"
Parse the CSV and write a new one with the columns `name` and `double`, where `double` is twice the score.

```osl
import "std:csv"

string text = "name,score\nAda,5\nBo,7\n"
log csv.parse(text).unwrap().len
```

```output
name,double
Ada,10
Bo,14
```

> [!hint]
> Build an array of objects with `{name: ..., double: ...}`.

> [!hint]
> `string(r.score).tryAs<int>.unwrapOr(0)` converts a cell.

> [!hint]
> `csv.stringify(rows, {columns: ["name", "double"]})`

```osl solution
import "std:csv"

string text = "name,score\nAda,5\nBo,7\n"
object[] out = []
for r in csv.parse(text).unwrap() (
  int score = string(r.score).tryAs<int>.unwrapOr(0)
  out.append({name: r.name, double: score * 2})
)
log csv.stringify(out, {columns: ["name", "double"]})
```

```output
name,double
Ada,10
Bo,14
```
:::

## API reference

::api
