# db

```osl
import "std:db"
```

## Methods

- `db.open(path)` → `DB`
- `db.openMemory()` → `DB`
- `db.close()` → `error`
- `db.exec(query, ...args)` → `boolean`
- `db.query(query, ...args)` → `array`
- `db.queryOne(query, ...args)` → `DBRow`
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
- `db.collection(name)` → `dbCollection`
- `db.collections()` → `array`

## Returned object: `DBRow`

Returned by `db` methods; call these on the value you get back.

- `dBRow.get(colIndex)` → `any`
- `dBRow.getByName(colName)` → `any`
- `dBRow.toMap()` → `object`
- `dBRow.toArray()` → `array`
- `dBRow.isEmpty()` → `boolean`
- `dBRow.count()` → `number`

## Returned object: `dbCollection`

Returned by `db` methods; call these on the value you get back.

- `dbCollection.insertOne(doc)` → `any`
- `dbCollection.insertMany(docs)` → `array`
- `dbCollection.find(filter, ...opts)` → `array`
- `dbCollection.findOne(filter)` → `object`
- `dbCollection.findById(id)` → `object`
- `dbCollection.all()` → `array`
- `dbCollection.count(filter)` → `number`
- `dbCollection.exists(filter)` → `boolean`
- `dbCollection.updateOne(filter, changes)` → `number`
- `dbCollection.updateMany(filter, changes)` → `number`
- `dbCollection.replaceOne(filter, doc)` → `number`
- `dbCollection.deleteOne(filter)` → `number`
- `dbCollection.deleteMany(filter)` → `number`
- `dbCollection.drop()` → `boolean`
- `dbCollection.save(doc)`
- `dbCollection.query()` → `dbQuery`
- `dbCollection.where(field, op, value)` → `dbQuery`
- `dbCollection.fields(...cols)` → `dbQuery`
- `dbCollection.sort(field, dir)` → `dbQuery`

## Returned object: `dbQuery`

Returned by `db` methods; call these on the value you get back.

- `dbQuery.where(field, op, value)` → `dbQuery`
- `dbQuery.and(field, op, value)` → `dbQuery`
- `dbQuery.sort(field, dir)` → `dbQuery`
- `dbQuery.fields(...cols)` → `dbQuery`
- `dbQuery.limit(n)` → `dbQuery`
- `dbQuery.skip(n)` → `dbQuery`
- `dbQuery.matched()` → `array`
- `dbQuery.all()` → `array`
- `dbQuery.get()` → `array`
- `dbQuery.first()` → `object`
- `dbQuery.count()` → `number`
- `dbQuery.exists()` → `boolean`
- `dbQuery.delete()` → `number`
- `dbQuery.set(field, value)` → `dbQuery`
- `dbQuery.unset(field)` → `dbQuery`
- `dbQuery.inc(field, n)` → `dbQuery`
- `dbQuery.mul(field, n)` → `dbQuery`
- `dbQuery.min(field, value)` → `dbQuery`
- `dbQuery.max(field, value)` → `dbQuery`
- `dbQuery.push(field, value)` → `dbQuery`
- `dbQuery.pull(field, value)` → `dbQuery`
- `dbQuery.rename(field, newField)` → `dbQuery`
- `dbQuery.apply()` → `number`

## Complete API reference

### `db`

| Method | Returns | Notes |
| --- | --- | --- |
| `db.open(path: any)` | `*DB` |  |
| `db.openMemory()` | `*DB` | Opens memory. |

### `DB` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.close()` | `error` | Closes the resource. |
| `value.exec(query: any, ...args: any)` | `boolean` |  |
| `value.query(query: any, ...args: any)` | `array` |  |
| `value.queryOne(query: any, ...args: any)` | `DBRow` |  |
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
| `value.collection(name: any)` | `*dbCollection` |  |
| `value.collections()` | `array` |  |

### `DBRow` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.get(colIndex: any)` | `any` | Returns a value. |
| `value.getByName(colName: any)` | `any` | Returns by name. |
| `value.toMap()` | `object` | Converts the value to an object. |
| `value.toArray()` | `array` | Converts the value to an array. |
| `value.isEmpty()` | `boolean` |  |
| `value.count()` | `number` |  |

### `dbCollection` values

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
| `value.query()` | `*dbQuery` |  |
| `value.where(field: any, op: any, value: any)` | `*dbQuery` |  |
| `value.fields(...cols: any)` | `*dbQuery` |  |
| `value.sort(field: any, dir: any)` | `*dbQuery` |  |

### `dbQuery` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.where(field: any, op: any, value: any)` | `*dbQuery` |  |
| `value.and(field: any, op: any, value: any)` | `*dbQuery` |  |
| `value.sort(field: any, dir: any)` | `*dbQuery` |  |
| `value.fields(...cols: any)` | `*dbQuery` |  |
| `value.limit(n: any)` | `*dbQuery` |  |
| `value.skip(n: any)` | `*dbQuery` |  |
| `value.matched()` | `array` |  |
| `value.all()` | `array` |  |
| `value.get()` | `array` | Returns a value. |
| `value.first()` | `object` |  |
| `value.count()` | `number` |  |
| `value.exists()` | `boolean` |  |
| `value.delete()` | `number` | Deletes a value. |
| `value.addUpdate(kind: string, field: any, value: any)` | `*dbQuery` | Adds update. |
| `value.set(field: any, value: any)` | `*dbQuery` | Sets a value. |
| `value.unset(field: any)` | `*dbQuery` |  |
| `value.inc(field: any, n: any)` | `*dbQuery` |  |
| `value.mul(field: any, n: any)` | `*dbQuery` |  |
| `value.min(field: any, value: any)` | `*dbQuery` |  |
| `value.max(field: any, value: any)` | `*dbQuery` |  |
| `value.push(field: any, value: any)` | `*dbQuery` |  |
| `value.pull(field: any, value: any)` | `*dbQuery` |  |
| `value.rename(field: any, newField: any)` | `*dbQuery` |  |
| `value.apply()` | `number` |  |

## Notes

- Prefer `import "std:db"`; the older `import "osl/db"` spelling remains supported.

## Behavior and limits

Methods on a closed database, collection, or query return failure values instead of panicking.
Nested transactions are rejected. Query offsets and limits cannot be negative. Document queries
support nested paths, and both in-memory and file-backed databases use the same API.
