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
