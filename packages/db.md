# db

```osl
import "std:db"
```

## Methods

- `db.open(path)` → `*db.DB`
- `db.openMemory()` → `*db.DB`
- `db.close()` → `error`
- `db.exec(query, ...args)` → `boolean`
- `db.query(query, ...args)` → `array`
- `db.queryOne(query, ...args)` → `db.Row`
- `db.queryMap(query, ...args)` → `array`
- `db.queryMapOne(query, ...args)` → `object`
- `db.insert(table, data)` → `number`
- `db.update(table, data, where, ...whereArgs)` → `boolean`
- `db.delete(table, where, ...whereArgs)` → `boolean`
- `db.count(table, where, ...whereArgs)` → `number`
- `db.exists(table, where, ...whereArgs)` → `boolean`
- `db.createTable(table, columns)` → `boolean`
- `db.dropTable(table)` → `boolean`
- `db.getTables()` → `array`
- `db.getColumns(table)` → `array`
- `db.begin()` → `boolean`
- `db.commit()` → `boolean`
- `db.rollback()` → `boolean`
- `db.transaction(fn)` → `error`
- `db.lastInsertId()` → `number`
- `db.rowsAffected(query, ...args)` → `number`
- `db.collection(name)` → `*db.Collection`
- `db.collections()` → `array`

## Returned object: `db.Row`

Returned by `db` methods; call these on the value you get back.

- `value.get(colIndex)` → `any`
- `value.getByName(colName)` → `any`
- `value.toMap()` → `object`
- `value.toArray()` → `array`
- `value.isEmpty()` → `boolean`
- `value.count()` → `number`

## Returned object: `*db.Collection`

Returned by `db` methods; call these on the value you get back.

- `value.insertOne(doc)` → `any`
- `value.insertMany(docs)` → `array`
- `value.find(filter, ...opts)` → `array`
- `value.findOne(filter)` → `object`
- `value.findById(id)` → `object`
- `value.all()` → `array`
- `value.count(filter)` → `number`
- `value.exists(filter)` → `boolean`
- `value.updateOne(filter, changes)` → `number`
- `value.updateMany(filter, changes)` → `number`
- `value.replaceOne(filter, doc)` → `number`
- `value.deleteOne(filter)` → `number`
- `value.deleteMany(filter)` → `number`
- `value.drop()` → `boolean`
- `value.save(doc)`
- `value.query()` → `*db.Query`
- `value.where(field, op, value)` → `*db.Query`
- `value.fields(...cols)` → `*db.Query`
- `value.sort(field, dir)` → `*db.Query`

## Returned object: `*db.Query`

Returned by `db` methods; call these on the value you get back.

- `value.where(field, op, value)` → `*db.Query`
- `value.and(field, op, value)` → `*db.Query`
- `value.sort(field, dir)` → `*db.Query`
- `value.fields(...cols)` → `*db.Query`
- `value.limit(n)` → `*db.Query`
- `value.skip(n)` → `*db.Query`
- `value.matched()` → `array`
- `value.all()` → `array`
- `value.get()` → `array`
- `value.first()` → `object`
- `value.count()` → `number`
- `value.exists()` → `boolean`
- `value.delete()` → `number`
- `value.set(field, value)` → `*db.Query`
- `value.unset(field)` → `*db.Query`
- `value.inc(field, n)` → `*db.Query`
- `value.mul(field, n)` → `*db.Query`
- `value.min(field, value)` → `*db.Query`
- `value.max(field, value)` → `*db.Query`
- `value.push(field, value)` → `*db.Query`
- `value.pull(field, value)` → `*db.Query`
- `value.rename(field, newField)` → `*db.Query`
- `value.apply()` → `number`

## Complete API reference

### `db`

| Method | Returns | Notes |
| --- | --- | --- |
| `db.open(path: any)` | `*db.DB` |  |
| `db.openMemory()` | `*db.DB` | Opens memory. |

### `DB` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.close()` | `error` | Closes the resource. |
| `value.exec(query: any, ...args: any)` | `boolean` |  |
| `value.query(query: any, ...args: any)` | `array` |  |
| `value.queryOne(query: any, ...args: any)` | `db.Row` |  |
| `value.queryMap(query: any, ...args: any)` | `array` |  |
| `value.queryMapOne(query: any, ...args: any)` | `object` |  |
| `value.insert(table: any, data: object)` | `number` |  |
| `value.update(table: any, data: object, where: any, ...whereArgs: any)` | `boolean` |  |
| `value.delete(table: any, where: any, ...whereArgs: any)` | `boolean` | Deletes a value. |
| `value.count(table: any, where: any, ...whereArgs: any)` | `number` |  |
| `value.exists(table: any, where: any, ...whereArgs: any)` | `boolean` |  |
| `value.createTable(table: any, columns: object)` | `boolean` | Creates table. |
| `value.dropTable(table: any)` | `boolean` |  |
| `value.getTables()` | `array` | Returns tables. |
| `value.getColumns(table: any)` | `array` | Returns columns. |
| `value.begin()` | `boolean` |  |
| `value.commit()` | `boolean` |  |
| `value.rollback()` | `boolean` |  |
| `value.transaction(fn: any)` | `error` |  |
| `value.lastInsertId()` | `number` |  |
| `value.rowsAffected(query: any, ...args: any)` | `number` |  |
| `value.collection(name: any)` | `*db.Collection` |  |
| `value.collections()` | `array` |  |

### `db.Row` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.get(colIndex: any)` | `any` | Returns a value. |
| `value.getByName(colName: any)` | `any` | Returns by name. |
| `value.toMap()` | `object` | Converts the value to an object. |
| `value.toArray()` | `array` | Converts the value to an array. |
| `value.isEmpty()` | `boolean` |  |
| `value.count()` | `number` |  |

### `*db.Collection` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.insertOne(doc: object)` | `any` |  |
| `value.insertMany(docs: array)` | `array` |  |
| `value.find(filter: object, ...opts: object)` | `array` | Returns every matching document after optional sorting and paging. |
| `value.findOne(filter: object)` | `object` | Returns the first document from the shared matcher, or an empty object. |
| `value.findById(id: any)` | `object` |  |
| `value.all()` | `array` |  |
| `value.count(filter: object)` | `number` |  |
| `value.exists(filter: object)` | `boolean` |  |
| `value.updateOne(filter: object, changes: object)` | `number` | Updates at most one matching document and returns the count. |
| `value.updateMany(filter: object, changes: object)` | `number` | Updates all matching documents and returns the count. |
| `value.replaceOne(filter: object, doc: object)` | `number` | Replaces at most one matching document, preserving its ID. |
| `value.deleteOne(filter: object)` | `number` | Deletes at most one matching document and returns the count. |
| `value.deleteMany(filter: object)` | `number` | Deletes all matching documents and returns the count. |
| `value.drop()` | `boolean` |  |
| `value.save(doc: object)` | `void` |  |
| `value.query()` | `*db.Query` |  |
| `value.where(field: any, op: any, value: any)` | `*db.Query` |  |
| `value.fields(...cols: any)` | `*db.Query` |  |
| `value.sort(field: any, dir: any)` | `*db.Query` |  |

### `*db.Query` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.where(field: any, op: any, value: any)` | `*db.Query` |  |
| `value.and(field: any, op: any, value: any)` | `*db.Query` |  |
| `value.sort(field: any, dir: any)` | `*db.Query` |  |
| `value.fields(...cols: any)` | `*db.Query` |  |
| `value.limit(n: any)` | `*db.Query` |  |
| `value.skip(n: any)` | `*db.Query` |  |
| `value.matched()` | `array` |  |
| `value.all()` | `array` |  |
| `value.get()` | `array` | Returns a value. |
| `value.first()` | `object` |  |
| `value.count()` | `number` |  |
| `value.exists()` | `boolean` |  |
| `value.delete()` | `number` | Deletes a value. |
| `value.addUpdate(kind: string, field: any, value: any)` | `*db.Query` | Adds update. |
| `value.set(field: any, value: any)` | `*db.Query` | Sets a value. |
| `value.unset(field: any)` | `*db.Query` |  |
| `value.inc(field: any, n: any)` | `*db.Query` |  |
| `value.mul(field: any, n: any)` | `*db.Query` |  |
| `value.min(field: any, value: any)` | `*db.Query` |  |
| `value.max(field: any, value: any)` | `*db.Query` |  |
| `value.push(field: any, value: any)` | `*db.Query` |  |
| `value.pull(field: any, value: any)` | `*db.Query` |  |
| `value.rename(field: any, newField: any)` | `*db.Query` |  |
| `value.apply()` | `number` |  |

## Notes

- Prefer `import "std:db"`; the older `import "osl/db"` spelling remains supported.

## Behavior and limits

Methods on a closed database, collection, or query return failure values instead of panicking.
Nested transactions are rejected. Query offsets and limits cannot be negative. Document queries
support nested paths, and both in-memory and file-backed databases use the same API.

`close` and `transaction` return `null` on success and an error on failure. Their
results support `== null` checks.
