# db

> SQLite database utilities

```javascript
import "osl/db"
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

| Method | Returns | Description |
| --- | --- | --- |
| `db.open(path: any)` | `*DB` | Opens a resource. |
| `db.openMemory()` | `*DB` | Opens memory. |

### `DB` values

Methods available on `DB` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.close()` | `error` | Closes the resource. |
| `value.exec(query: any, ...args: any)` | `boolean` | Runs the exec operation. |
| `value.query(query: any, ...args: any)` | `array` | Runs the query operation. |
| `value.queryOne(query: any, ...args: any)` | `DBRow` | Runs the query one operation. |
| `value.queryMap(query: any, ...args: any)` | `array` | Runs the query map operation. |
| `value.queryMapOne(query: any, ...args: any)` | `object` | Runs the query map one operation. |
| `value.insert(table: any, data: object)` | `number` | Runs the insert operation. |
| `value.update(table: any, data: object, where: any, ...whereArgs: any)` | `boolean` | Runs the update operation. |
| `value.delete(table: any, where: any, ...whereArgs: any)` | `boolean` | Deletes a value. |
| `value.count(table: any, where: any, ...whereArgs: any)` | `number` | Runs the count operation. |
| `value.exists(table: any, where: any, ...whereArgs: any)` | `boolean` | Reports whether the value or resource exists. |
| `value.createTable(table: any, columns: object)` | `boolean` | Creates table. |
| `value.dropTable(table: any)` | `boolean` | Runs the drop table operation. |
| `value.getTables()` | `array` | Returns tables. |
| `value.getColumns(table: any)` | `array` | Returns columns. |
| `value.begin()` | `boolean` | Runs the begin operation. |
| `value.commit()` | `boolean` | Runs the commit operation. |
| `value.rollback()` | `boolean` | Runs the rollback operation. |
| `value.transaction(fn: any)` | `error` | Runs the transaction operation. |
| `value.lastInsertId()` | `number` | Runs the last insert id operation. |
| `value.rowsAffected(query: any, ...args: any)` | `number` | Runs the rows affected operation. |
| `value.collection(name: any)` | `*dbCollection` | Runs the collection operation. |
| `value.collections()` | `array` | Runs the collections operation. |

### `DBRow` values

Methods available on `DBRow` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.get(colIndex: any)` | `any` | Returns a value. |
| `value.getByName(colName: any)` | `any` | Returns by name. |
| `value.toMap()` | `object` | Converts the value to an object. |
| `value.toArray()` | `array` | Converts the value to an array. |
| `value.isEmpty()` | `boolean` | Reports whether empty. |
| `value.count()` | `number` | Runs the count operation. |

### `dbCollection` values

Methods available on `dbCollection` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.insertOne(doc: object)` | `any` | Runs the insert one operation. |
| `value.insertMany(docs: array)` | `array` | Runs the insert many operation. |
| `value.find(filter: object, ...opts: object)` | `array` | Runs the find operation. |
| `value.findOne(filter: object)` | `object` | Runs the find one operation. |
| `value.findById(id: any)` | `object` | Runs the find by id operation. |
| `value.all()` | `array` | Runs the all operation. |
| `value.count(filter: object)` | `number` | Runs the count operation. |
| `value.exists(filter: object)` | `boolean` | Reports whether the value or resource exists. |
| `value.updateOne(filter: object, changes: object)` | `number` | Runs the update one operation. |
| `value.updateMany(filter: object, changes: object)` | `number` | Runs the update many operation. |
| `value.replaceOne(filter: object, doc: object)` | `number` | Runs the replace one operation. |
| `value.deleteOne(filter: object)` | `number` | Deletes one. |
| `value.deleteMany(filter: object)` | `number` | Deletes many. |
| `value.drop()` | `boolean` | Runs the drop operation. |
| `value.save(doc: object)` | `void` | Runs the save operation. |
| `value.query()` | `*dbQuery` | Runs the query operation. |
| `value.where(field: any, op: any, value: any)` | `*dbQuery` | Runs the where operation. |
| `value.fields(...cols: any)` | `*dbQuery` | Runs the fields operation. |
| `value.sort(field: any, dir: any)` | `*dbQuery` | Runs the sort operation. |

### `dbQuery` values

Methods available on `dbQuery` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.where(field: any, op: any, value: any)` | `*dbQuery` | Runs the where operation. |
| `value.and(field: any, op: any, value: any)` | `*dbQuery` | Runs the and operation. |
| `value.sort(field: any, dir: any)` | `*dbQuery` | Runs the sort operation. |
| `value.fields(...cols: any)` | `*dbQuery` | Runs the fields operation. |
| `value.limit(n: any)` | `*dbQuery` | Runs the limit operation. |
| `value.skip(n: any)` | `*dbQuery` | Runs the skip operation. |
| `value.matched()` | `array` | Runs the matched operation. |
| `value.all()` | `array` | Runs the all operation. |
| `value.get()` | `array` | Returns a value. |
| `value.first()` | `object` | Runs the first operation. |
| `value.count()` | `number` | Runs the count operation. |
| `value.exists()` | `boolean` | Reports whether the value or resource exists. |
| `value.delete()` | `number` | Deletes a value. |
| `value.addUpdate(kind: string, field: any, value: any)` | `*dbQuery` | Adds update. |
| `value.set(field: any, value: any)` | `*dbQuery` | Sets a value. |
| `value.unset(field: any)` | `*dbQuery` | Runs the unset operation. |
| `value.inc(field: any, n: any)` | `*dbQuery` | Runs the inc operation. |
| `value.mul(field: any, n: any)` | `*dbQuery` | Runs the mul operation. |
| `value.min(field: any, value: any)` | `*dbQuery` | Runs the min operation. |
| `value.max(field: any, value: any)` | `*dbQuery` | Runs the max operation. |
| `value.push(field: any, value: any)` | `*dbQuery` | Runs the push operation. |
| `value.pull(field: any, value: any)` | `*dbQuery` | Runs the pull operation. |
| `value.rename(field: any, newField: any)` | `*dbQuery` | Runs the rename operation. |
| `value.apply()` | `number` | Runs the apply operation. |

## Notes

- Standard-library imports accept both `import "osl/db"` and `import "db"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
