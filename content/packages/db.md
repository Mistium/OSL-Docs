---
description: Store data in SQLite with SQL queries and transactions, or as JSON documents in collections you search by example.
package: db
---

# db

`std:db` is a database in a file. It is built on SQLite, so there is no server to install or run: `db.open("app.db")` creates the file if it needs to and you start storing. Use it when data has outgrown a settings file, when you need to search, sort or update part of it, or when several things must change together or not at all. For a handful of named strings, [save](save.md) is lighter.

A database offers two ways to work, and you can mix them in one file:

- **Tables and SQL** for data with a fixed shape: users, orders, scores.
- **Collections of documents** for data that varies: each document is an object, and you find them by example, with no schema.

SQLite is the only engine in this package, so every example on this page runs as written. Each one deletes its database file first, because the examples run more than once.

## Open a database

`db.open(path)` returns a result holding the connection. Use `":memory:"` for a database that lives only as long as the program, which suits tests:

```osl
import "std:db"
import "std:fs"

fs.remove("first.db", {force: true}).unwrap()

auto conn = db.open("first.db").unwrap()
log conn.tables().unwrap()
conn.close().unwrap()
log fs.exists("first.db")

auto scratch = db.open(":memory:").unwrap()
log scratch.tables().unwrap()
scratch.close().unwrap()

fs.remove("first.db", {force: true}).unwrap()
```

```output
[]
true
[]
```

Close a connection when you are done with it. A closed connection throws a `StateError` if you use it.

## Create a table and insert rows

`exec` runs one SQL statement and returns a result. Use `?` placeholders for values and pass them after the SQL, so the database never mistakes data for code. `run` is like `exec` but tells you what happened, and `insert` builds the statement from an object:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER)").unwrap()

auto first = conn.run("INSERT INTO users (name, age) VALUES (?, ?)", "Ada", 36).unwrap()
log first.lastInsertID first.rowsAffected

int id = conn.insert("users", {name: "Grace", age: 45}).unwrap()
log id

log conn.tables().unwrap()
log conn.columns("users").unwrap()
conn.close().unwrap()
```

```output
1 1
2
["users"]
["id","name","age"]
```

Try inserting a row without a `name` and see whether the table allows it.

`insert` returns the new row's id. `createTable(name, columns)` builds a table from an object of column definitions when you don't want to write the SQL:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.createTable("notes", {id: "INTEGER PRIMARY KEY", body: "TEXT"}).unwrap()
log conn.columns("notes").unwrap().sort()
conn.close().unwrap()
```

```output
["body","id"]
```

> [!warning]
> Never build SQL by joining user input into the string. `"... WHERE name = '" ++ name ++ "'"` lets a name such as `x' OR '1'='1` change the query. Pass values as `?` arguments every time.

## Reading rows

`queryMap` returns the rows as objects keyed by column name, which is the easiest to use. `queryMapOne` returns the first row or `null`:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)").unwrap()
conn.insert("users", {name: "Ada", age: 36}).unwrap()
conn.insert("users", {name: "Grace", age: 45}).unwrap()
conn.insert("users", {name: "Linus", age: 28}).unwrap()

for user in conn.queryMap("SELECT name, age FROM users WHERE age > ? ORDER BY age", 30).unwrap() (
  log user["name"] user["age"]
)

log conn.queryMapOne("SELECT name FROM users WHERE id = ?", 3).unwrap()
log conn.queryMapOne("SELECT name FROM users WHERE id = ?", 99).unwrap()
conn.close().unwrap()
```

```output
Ada 36
Grace 45
{"name":"Linus"}
null
```

`query` and `queryOne` return `db.Row` values instead. A row reads a column by name or by position (from 1), and keeps the column order:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)").unwrap()
conn.insert("users", {name: "Ada", age: 36}).unwrap()

auto row = conn.queryOne("SELECT name, age FROM users").unwrap()
log row.get("name") row.get(2)
log row.columns() row.count()
log row.toMap()
conn.close().unwrap()
```

```output
Ada 36
["name","age"] 2
{"age":36,"name":"Ada"}
```

## Update, delete and count

`update`, `delete`, `count` and `exists` take a table, then a SQL condition with `?` placeholders and its values. They return the number of rows changed or counted:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)").unwrap()
conn.insert("users", {name: "Ada", age: 36}).unwrap()
conn.insert("users", {name: "Grace", age: 45}).unwrap()

log conn.update("users", {age: 37}, "name = ?", "Ada").unwrap()
log conn.count("users", "age > ?", 40).unwrap()
log conn.exists("users", "name = ?", "Nobody").unwrap()
log conn.delete("users", "age > ?", 40).unwrap()
log conn.count("users", "1 = 1").unwrap()
conn.close().unwrap()
```

```output
1
1
false
1
1
```

## Errors

Every database call that can fail returns a result, so a mistake is a value you can look at. A syntax error is a `ParseError`, and a broken rule such as a duplicate in a `UNIQUE` column or a `NULL` in a `NOT NULL` one is a `ValueError`:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL)").unwrap()
conn.insert("users", {email: "ada@example.com"}).unwrap()

auto syntax = conn.exec("SELEKT 1")
log syntax.unwrapErr().kind

auto duplicate = conn.insert("users", {email: "ada@example.com"})
log duplicate.unwrapErr().kind
log duplicate.unwrapErr().message

switch conn.exec("INSERT INTO users (email) VALUES (NULL)") (
  case ok(_)
    log "inserted"
  case err(e)
    log "rejected:" e.kind
)
conn.close().unwrap()
```

```output
ParseError
ValueError
db.DB.insert: UNIQUE constraint failed: users.email
rejected: ValueError
```

Let the database enforce the rules. A `UNIQUE` constraint can't be raced past, unlike "check first, then insert" in your code.

## Transactions

A transaction makes several changes happen together or not at all. `conn.transaction(fn)` runs `fn` with the connection and commits when it returns. If `fn` returns a failed result, everything it did is rolled back and that failure is the result of the call:

```osl
import "std:db"
import "std:result"

auto conn = db.open(":memory:").unwrap()
conn.exec("CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER)").unwrap()
conn.insert("accounts", {name: "ada", balance: 100}).unwrap()
conn.insert("accounts", {name: "bob", balance: 20}).unwrap()

def transfer(*db.DB conn, string source, string dest, int amount) result<unit, error> (
  return conn.transaction(def(*db.DB tx) result<int, error> (
    tx.exec("UPDATE accounts SET balance = balance - ? WHERE name = ?", amount, source)!
    int left = tx.queryMapOne("SELECT balance FROM accounts WHERE name = ?", source).unwrap()["balance"]
    if left < 0 (
      return result.err(error("insufficient funds"))
    )
    tx.exec("UPDATE accounts SET balance = balance + ? WHERE name = ?", amount, dest)!
    return result.ok(1)
  ))
)

log transfer(conn, "ada", "bob", 30).isOk()
log transfer(conn, "bob", "ada", 500).unwrapErr().message
for account in conn.queryMap("SELECT * FROM accounts ORDER BY name").unwrap() (
  log account["name"] account["balance"]
)
conn.close().unwrap()
```

```output
true
insufficient funds
ada 70
bob 50
```

The second transfer took 500 from `bob` before it noticed there wasn't enough, and the rollback put it back: balances are unchanged by it. When `fn` throws instead of returning an error, the transaction is rolled back and the throw continues. `begin()`, `commit()` and `rollback()` do the same by hand, for the cases where one function doesn't hold the whole job.

## Documents

A collection stores objects with no table to define first. `conn.collection(name)` returns it, creating it on first use. Each document gets an `_id` string. `insertOne` returns it, and `insertMany` returns all of them:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()

string id = people.insertOne({name: "Ada", age: 36, tags: ["math"]}).unwrap()
log id.len > 0
people.insertMany([
  {name: "Grace", age: 45, tags: ["navy", "cobol"]},
  {name: "Linus", age: 28}
]).unwrap()

log people.all().unwrap().len
log people.findByID(id).unwrap()["name"]
log people.findOne({name: "Grace"}).unwrap()["tags"]
log people.findOne({name: "Nobody"}).unwrap()
log conn.collections().unwrap()
conn.close().unwrap()
```

```output
true
3
Ada
["navy","cobol"]
null
["people"]
```

## Finding by example

`find(filter)` takes an object that describes what you want. A plain value means equals, and an object of operators compares: `$gt`, `$gte`, `$lt`, `$lte`, `$ne`, `$in`, `$nin`, `$exists`, `$regex` and `$contains`. Options sort and page the answer:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()
people.insertMany([
  {name: "Ada", age: 36, address: {city: "London"}},
  {name: "Grace", age: 45, address: {city: "New York"}},
  {name: "Linus", age: 28, address: {city: "Helsinki"}}
]).unwrap()

auto older = people.find({age: {"$gte": 30}}, {sort: {age: "desc"}}).unwrap()
log older.map(p -> p["name"])

log people.find({}, {sort: {name: "asc"}, skip: 1, limit: 1}).unwrap().map(p -> p["name"])
log people.count({age: {"$lt": 40}}).unwrap()
log people.exists({name: "Linus"}).unwrap()
log people.find({"address.city": "London"}).unwrap().map(p -> p["name"])
conn.close().unwrap()
```

```output
["Grace","Ada"]
["Grace"]
2
true
["Ada"]
```

A dot path such as `"address.city"` reaches into a nested object.

## Building queries

For anything longer than a filter, start a query with `where`, `sort`, `fields` or `query()` and chain more. Conditions combine with AND:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()
people.insertMany([
  {name: "Ada", age: 36, tags: ["math"]},
  {name: "Grace", age: 45, tags: ["navy", "cobol"]},
  {name: "Linus", age: 28, tags: []}
]).unwrap()

auto names = people.where("age", ">", 30).sort("age", "asc").all().unwrap()
log names.map(p -> p["name"])

log people.where("tags", "contains", "cobol").count().unwrap()
log people.where("age", "<", 40).where("name", "!=", "Ada").first().unwrap()["name"]
log people.sort("name", "asc").limit(2).fields("name").all().unwrap().map(p -> p["name"])
conn.close().unwrap()
```

```output
["Ada","Grace"]
1
Linus
["Ada","Grace"]
```

The operators here are written as strings: `"=="`, `"!="`, `">"`, `">="`, `"<"`, `"<="`, `"in"`, `"notIn"`, `"contains"`, `"matches"` and `"exists"`.

## Changing documents

`updateOne` and `updateMany` set the fields you give on the documents a filter matches, and a dot path changes one nested field. A query can also change documents with `set`, `inc`, `push` and friends followed by `apply()`. `save` writes a whole document back under its `_id`:

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()
people.insertMany([
  {name: "Ada", age: 36, address: {city: "London"}, tags: []},
  {name: "Linus", age: 28, tags: []}
]).unwrap()

people.updateOne({name: "Ada"}, {"address.city": "Paris"}).unwrap()
log people.findOne({name: "Ada"}).unwrap()["address"]

people.where("name", "==", "Linus").inc("age", 1).push("tags", "kernel").apply().unwrap()
auto linus = people.findOne({name: "Linus"}).unwrap()
log linus["age"] linus["tags"]

linus["age"] = 50
people.save(linus).unwrap()
log people.findOne({name: "Linus"}).unwrap()["age"]

log people.deleteMany({age: {"$gt": 40}}).unwrap()
log people.count({}).unwrap()
conn.close().unwrap()
```

```output
{"city":"Paris"}
29 ["kernel"]
50
1
1
```

A filter with an operator the collection doesn't know, such as `$bogus`, is a programming error and throws a `ValueError`, instead of coming back as a failed result.

## Which to use

Reach for tables when every row has the same columns, when you join data across tables, or when you want the database to enforce types and uniqueness. Reach for collections when records vary, when you are still discovering the shape, or when the data is naturally a nested document. Both live in the same file and can be used in one transaction.

:::exercise title="A to-do list"
Make a `todos` table with an `id`, a `title` and a `done` column (0 or 1, default 0). Insert three to-dos, mark one done, and print the titles that are still open, in the order they were added.

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()

// create the table, add "write docs", "test docs" and "ship docs",
// finish "test docs", then print the open ones

conn.close().unwrap()
```

```output
write docs
ship docs
```

> [!hint]
> `CREATE TABLE todos (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0)`, then `conn.insert("todos", {title: "write docs"})` for each.

> [!hint]
> `conn.update("todos", {done: 1}, "title = ?", "test docs")`, and `conn.queryMap("SELECT title FROM todos WHERE done = 0 ORDER BY id")` for the open ones.

```osl solution
import "std:db"

auto conn = db.open(":memory:").unwrap()

conn.exec("CREATE TABLE todos (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0)").unwrap()
for title in ["write docs", "test docs", "ship docs"] (
  conn.insert("todos", {title: title}).unwrap()
)
conn.update("todos", {done: 1}, "title = ?", "test docs").unwrap()

for todo in conn.queryMap("SELECT title FROM todos WHERE done = 0 ORDER BY id").unwrap() (
  log todo["title"]
)

conn.close().unwrap()
```

```output
write docs
ship docs
```
:::

:::quiz
Why pass values as `?` arguments instead of joining them into the SQL string?

- [ ] It is shorter.
- [x] The database treats them as data, so input like `x' OR '1'='1` can't change the query.
- [ ] Joined strings don't work with SQLite.

This is how SQL injection is prevented.
:::

:::exercise title="Find the OSL people"
Store three documents in a `people` collection. Print the names, sorted, of those whose `tags` contain `"osl"`.

```osl
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()
people.insertMany([
  {name: "Ada", tags: ["osl", "math"]},
  {name: "Grace", tags: ["cobol"]},
  {name: "Linus", tags: ["osl", "kernel"]}
]).unwrap()

log "?"
conn.close().unwrap()
```

```output
["Ada","Linus"]
```

> [!hint]
> `people.where("tags", "contains", "osl")` starts a query.

> [!hint]
> `.all().unwrap().map(p -> p["name"]).sort()`.

```osl solution
import "std:db"

auto conn = db.open(":memory:").unwrap()
auto people = conn.collection("people").unwrap()
people.insertMany([
  {name: "Ada", tags: ["osl", "math"]},
  {name: "Grace", tags: ["cobol"]},
  {name: "Linus", tags: ["osl", "kernel"]}
]).unwrap()

log people.where("tags", "contains", "osl").all().unwrap().map(p -> p["name"]).sort()
conn.close().unwrap()
```

```output
["Ada","Linus"]
```
:::

## API reference

::api
