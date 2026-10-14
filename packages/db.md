# db

Use `db` for SQLite databases: plain SQL queries, and JSON document collections stored in the same
file.

```osl
import "std:db"
```

## Example

```osl
import "std:db"

auto d = db.open("app.db")
defer d.close()

d.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)")
int id = d.insert("users", {name: "Ada", age: 36})

for row in d.queryMap("SELECT name, age FROM users WHERE age > ?", 30) (
  log row.name ++ " is " ++ row.age
)

auto changed = d.run("UPDATE users SET age = age + 1 WHERE id = ?", id)
log changed.rowsAffected
```

Placeholders (`?`) are bound to the arguments that follow the SQL, in order. Never build SQL by
joining user input into the string.

## Opening a database

| Function | Returns | Notes |
| --- | --- | --- |
| `db.open(path)` | `result<*db.DB, error>` | Opens the SQLite file at `path`, creating it when it doesn't exist. `":memory:"` opens a private in-memory database. Fails with `NotFoundError` when the directory doesn't exist, `ParseError` when the file isn't an SQLite database, and `PermissionError` or `IOError` when it can't be opened. |

## SQL

### `*db.DB` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `d.exec(query, ...args)` | `result<unit, error>` | Runs one statement. As a condition (`if d.exec(...)`) it is true when the statement succeeded. |
| `d.run(query, ...args)` | `result<object, error>` | Runs one statement and returns `{rowsAffected, lastInsertID}`. `lastInsertID` is the rowid of the last inserted row, or 0. |
| `d.query(query, ...args)` | `result<*db.Row[], error>` | The rows as `*db.Row` handles. |
| `d.queryOne(query, ...args)` | `result<*db.Row?, error>` | The first row, or `null` when there are none. |
| `d.queryMap(query, ...args)` | `result<object[], error>` | The rows as objects keyed by column name. |
| `d.queryMapOne(query, ...args)` | `result<object?, error>` | The first row as an object, or `null` when there are none. |
| `d.insert(table, data)` | `result<int, error>` | Adds a row with the keys and values of `data` and returns its rowid. |
| `d.update(table, data, where, ...whereArgs)` | `result<int, error>` | Sets the columns in `data` on every row matching the SQL condition `where`, and returns how many rows changed. Pass `"1"` to update every row. |
| `d.delete(table, where, ...whereArgs)` | `result<int, error>` | Removes every row matching `where` and returns how many it removed. Pass `"1"` to delete every row. |
| `d.count(table, where, ...whereArgs)` | `result<int, error>` | How many rows match `where`. An empty `where` counts every row. |
| `d.exists(table, where, ...whereArgs)` | `result<boolean, error>` | Whether any row matches `where`. |
| `d.createTable(table, columns)` | `result<unit, error>` | Creates a table unless it exists. Each key of `columns` is a column, and its value the SQL type and constraints, such as `"INTEGER PRIMARY KEY"`. Columns are created in alphabetical order; use `exec` with `CREATE TABLE` to choose the order. |
| `d.dropTable(table)` | `result<unit, error>` | Deletes a table and its rows. A missing table is not an error. |
| `d.tables()` | `result<string[], error>` | Table names in alphabetical order, including the `coll_` tables behind collections. |
| `d.columns(table)` | `result<string[], error>` | Column names in table order, or `[]` when there is no such table. |
| `d.lastInsertID()` | `result<int, error>` | The rowid of the most recent successful `INSERT` on this database, or 0. Prefer the value from `run` or `insert`, which belongs to one statement. |
| `d.close()` | `result<unit, error>` | Closes the database, rolling back an open transaction. Closing twice does nothing. |

`insert`, `update`, `delete`, `count`, `exists`, `createTable`, `dropTable` and `columns` throw
`ValueError` for an invalid table or column name, and `insert` and `update` for empty `data`.
`update` and `delete` throw `ValueError` for an empty `where`.

### `*db.Row` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `row.get(column)` | `any` | A column's value, by 1-based position or by name (ignoring case). `null` when there is no such column. Throws `TypeError` when `column` is neither a number nor a string. |
| `row.columns()` | `string[]` | The column names, in order. |
| `row.toMap()` | `object` | The row as an object keyed by column name. When two columns share a name, the later one wins. |
| `row.toArray()` | `any[]` | The values, in column order. |
| `row.count()` | `int` | The number of columns. |
| `row.isEmpty()` | `boolean` | Whether the row has no columns. |

```osl
auto row = d.queryOne("SELECT name, age FROM users WHERE id = ?", 1)
if row != null (
  log row.get("name") ++ " " ++ row.get(2)
)
```

### Transactions

| Method | Returns | Notes |
| --- | --- | --- |
| `d.transaction(fn)` | `result<unit, error>` | Calls `fn(d)` inside a transaction and commits when it returns. If `fn` throws, the transaction is rolled back and the error propagates. If `fn` returns an error or a failed result, the transaction is rolled back and the call fails with that error. |
| `d.begin()` | `result<unit, error>` | Starts a transaction. Every statement on this database runs in it until `commit` or `rollback`. |
| `d.commit()` | `result<unit, error>` | Saves the transaction. If the commit fails, the transaction is rolled back. |
| `d.rollback()` | `result<unit, error>` | Discards the transaction. |

`begin` and `transaction` throw `StateError` when a transaction is already open, and `commit` and
`rollback` when none is. A `transaction` callback must not commit or roll back itself.

```osl
d.transaction(def(*db.DB tx) -> (
  tx.insert("accounts", {owner: "Ada", balance: 100})
  tx.insert("accounts", {owner: "Linus", balance: 50})
))
```

## Collections

A collection stores JSON documents in a table named `coll_<name>`. Every document has a string `_id`.

```osl
auto users = d.collection("users")

users.insertOne({name: "Ada", age: 36, role: "admin"})
users.insertOne({name: "Linus", age: 28, role: "dev", address: {city: "Helsinki"}})

auto admins = users.find({role: "admin"}, {sort: {age: "desc"}, limit: 10})
log admins.len ++ " admins"
log users.count({age: {"$gte": 30}})

auto adults = users.where("age", ">=", 18).sort("name", "asc").fields("name").all()
log adults
users.where("address.city", "==", "Helsinki").set("country", "FI").apply()
```

### `*db.DB` collection methods

| Method | Returns | Notes |
| --- | --- | --- |
| `d.collection(name)` | `result<*db.Collection, error>` | The collection, creating its table when it doesn't exist. Throws `ValueError` unless `name` is letters, digits, `_` and `-`. |
| `d.collections()` | `result<string[], error>` | Collection names in alphabetical order. |

### `*db.Collection` methods

| Method | Returns | Notes |
| --- | --- | --- |
| `c.insertOne(doc)` | `result<string, error>` | Stores a document and returns its `_id`. A document without `_id` gets a random one, written into `doc`. Fails with `ValueError` when the `_id` is taken. |
| `c.insertMany(docs)` | `result<string[], error>` | Stores each document like `insertOne` and returns the ids in order. Throws `TypeError` before storing anything when an item isn't an object. When an insert fails, earlier documents stay stored. |
| `c.save(doc)` | `result<string, error>` | Replaces the document with `doc._id`, or inserts `doc` when there is none, and returns the `_id`. |
| `c.find(filter, options?)` | `result<object[], error>` | Documents matching a [filter](#filters). Options: `sort` (an object of field to `"asc"` or `"desc"`, applied in key order), `skip` and `limit`. |
| `c.findOne(filter)` | `result<object?, error>` | The first matching document, or `null`. |
| `c.findByID(id)` | `result<object?, error>` | The document with this `_id`, or `null`. |
| `c.all()` | `result<object[], error>` | Every document. |
| `c.count(filter)` | `result<int, error>` | How many documents match. |
| `c.exists(filter)` | `result<boolean, error>` | Whether any document matches. |
| `c.updateOne(filter, changes)` | `result<int, error>` | Sets each field of `changes` on the first matching document and returns 0 or 1. Dot paths such as `"address.city"` reach into nested objects. |
| `c.updateMany(filter, changes)` | `result<int, error>` | Like `updateOne`, on every matching document. Returns how many changed. |
| `c.replaceOne(filter, doc)` | `result<int, error>` | Replaces the first matching document with `doc`, keeping its `_id`. Returns 0 or 1. |
| `c.deleteOne(filter)` | `result<int, error>` | Removes the first matching document. Returns 0 or 1. |
| `c.deleteMany(filter)` | `result<int, error>` | Removes every matching document and returns how many. |
| `c.drop()` | `result<unit, error>` | Deletes the collection's table and documents. |
| `c.query()` | `*db.Query` | An empty query over the whole collection. |
| `c.where(field, op, value)` | `*db.Query` | A query with one condition. |
| `c.sort(field, direction)` | `*db.Query` | A query ordered by `field`. |
| `c.fields(...names)` | `*db.Query` | A query returning only the named fields. |

`findOne` and `findByID` return a nullable object. Check for `null` before changing it:

```osl
object? doc = users.findOne({name: "Ada"})
if doc != null (
  doc.age = 37
  users.save(doc)
)
```

### Filters

A filter object matches documents whose fields equal its values: `{role: "admin"}`. For other
comparisons, give an object of operators: `{age: {"$gte": 18, "$lt": 65}}`. Quote keys that start
with `$`. The operators are `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$contains`,
`$regex` and `$exists`, matching the query operators below. An unknown operator throws `ValueError`,
and an invalid `$regex` fails with `ParseError`.

### `*db.Query` methods

Query builders mutate the query and return it, so calls chain. Conditions combine with AND.

| Method | Returns | Notes |
| --- | --- | --- |
| `q.where(field, op, value)` | `*db.Query` | Adds a condition. `field` may be a dot path. `op` is `"=="`, `"!="`, `">"`, `">="`, `"<"`, `"<="`, `"in"` or `"notIn"` (value is an array), `"contains"` (a substring of a string or a member of an array), `"matches"` (value is a regular expression) or `"exists"` (value is `true` or `false`). The filter forms such as `"$gt"` work too. Throws `ValueError` for any other operator. |
| `q.sort(field, direction)` | `*db.Query` | Orders by `field`, `"asc"` or `"desc"`, after earlier sort fields. Mixed types order as null, booleans, numbers, strings, objects, arrays. Throws `ValueError` for another direction. |
| `q.fields(...names)` | `*db.Query` | Returns only the named fields (dot paths allowed) plus `_id`. |
| `q.limit(n)` | `*db.Query` | Returns at most `n` documents. Throws `ValueError` for a negative `n`. |
| `q.skip(n)` | `*db.Query` | Leaves out the first `n` documents. Throws `ValueError` for a negative `n`. |

Running a query:

| Method | Returns | Notes |
| --- | --- | --- |
| `q.all()` | `result<object[], error>` | The matching documents. Fails with `ParseError` for an invalid `"matches"` pattern. |
| `q.first()` | `result<object?, error>` | The first matching document, or `null`. |
| `q.count()` | `result<int, error>` | How many documents match, ignoring `skip` and `limit`. |
| `q.exists()` | `result<boolean, error>` | Whether any document matches. |
| `q.delete()` | `result<int, error>` | Removes every matching document, ignoring `sort`, `skip` and `limit`, and returns how many. |

Updating matched documents: queue changes, then call `apply()`:

| Method | Returns | Notes |
| --- | --- | --- |
| `q.set(field, value)` | `*db.Query` | Sets `field`. |
| `q.unset(field)` | `*db.Query` | Removes `field`. |
| `q.inc(field, amount)` | `*db.Query` | Adds `amount` to a number (missing counts as 0). |
| `q.mul(field, factor)` | `*db.Query` | Multiplies a number by `factor`. |
| `q.min(field, value)` | `*db.Query` | Lowers `field` to `value` when `value` is smaller or `field` is missing. |
| `q.max(field, value)` | `*db.Query` | Raises `field` to `value` when `value` is larger or `field` is missing. |
| `q.push(field, value)` | `*db.Query` | Appends to an array, creating it. |
| `q.pull(field, value)` | `*db.Query` | Removes every element equal to `value` from an array. |
| `q.rename(field, newField)` | `*db.Query` | Moves `field` to `newField`. |
| `q.apply()` | `result<int, error>` | Runs the queued changes on every matching document and returns how many it updated. With nothing queued it returns 0. |

```osl
users.where("role", "==", "admin").inc("logins", 1).push("tags", "staff").apply()
```

## Errors

SQL and collection methods fail with these kinds:

| Kind | When |
| --- | --- |
| `ParseError` | Invalid SQL, a file that isn't an SQLite database, or an invalid regular expression |
| `NotFoundError` | A missing table or column, or a missing directory for the database file |
| `ValueError` | A constraint violation (such as a duplicate primary key), the wrong number of arguments, or a duplicate document `_id` |
| `TypeError` | An argument SQLite can't store |
| `TimeoutError` | The database is locked |
| `StateError` | The database is closed, or a transaction call is out of order (thrown) |

## Deprecated

These still work for one release, with an `OSL-DEPRECATED` warning at each use.

| Deprecated | Use instead |
| --- | --- |
| `db.openMemory()` | `db.open(":memory:")` |
| `d.getTables()` | `d.tables()` |
| `d.getColumns(table)` | `d.columns(table)` |
| `d.rowsAffected(query, ...args)` | `d.run(query, ...args).rowsAffected` |
| `row.getByName(name)` | `row.get(name)` |
| `q.and(field, op, value)` | `q.where(field, op, value)` |
| `q.get()` | `q.all()` |
| Operator constants `db.equal`, `db.eq`, `db.notEqual`, `db.ne`, `db.greater`, `db.gt`, `db.greaterEqual`, `db.gte`, `db.less`, `db.lt`, `db.lessEqual`, `db.lte`, `db.oneOf`, `db.in`, `db.notOneOf`, `db.nin`, `db.contains`, `db.matches`, `db.present` | The operator as a string: `"=="`, `"!="`, `">"`, `">="`, `"<"`, `"<="`, `"in"`, `"notIn"`, `"contains"`, `"matches"`, `"exists"` |
| Sort constants `db.asc`, `db.desc` | `"asc"`, `"desc"` |

`query.matched()` has been removed; use `query.all()`.

## Behavior and limits

The older `import "osl/db"` spelling still works, with a migration warning.

In-memory and file-backed databases have the same API. Any method on a closed database, or on a
collection or query from one, throws `StateError`. Missing rows and documents are `null`, never an
empty object.
