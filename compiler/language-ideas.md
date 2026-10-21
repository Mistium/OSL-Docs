# Language ideas

Working notes for OSL syntax and type changes discussed while cleaning up
`originchats-osl`. This is not published documentation.

## Status

- **Done:** lock values in `std:sync`.
- **Done:** nullable struct fields and struct-aware JSON parsing.
- **Next:** postfix `!` for result propagation.
- **Open:** automatic transactions over shared state.
- **Rejected:** `guard`, structural `match`, package-defined block syntax,
  language-level `fail`/`ok`, and `sync.Cell`.

## 1. Locks as values

Implemented in `std:sync`.

```osl
*sync.Lock access = sync.newLock()

access.lock()
defer access.unlock()

access.with(def() -> (
  ...
))
```

- A lock is a handle, so it has identity and cannot be copied like a struct.
- Locks are unnamed by default. `sync.newNamedLock("access")` is only for
  diagnostics; two locks with the same name are independent.
- `tryLock`, `rlock`, `runlock`, `with` and `withRLock` work on the value.
- The string API (`sync.lock("access")`, `sync.withLock(...)`) remains for
  existing code and shares one process-wide lock per name.
- Deadlock and lock errors name the lock and say how to release it.

### Open questions

- **Generic `with` is not possible as a Go method.** Go does not allow type
  parameters on methods. `lock.with(fn)` therefore returns `any`. A generic
  `sync.withLock<T>` would have to be a package-level generic function or a
  compiler special case. Do not add a generic wrapper type just to recover the
  type; the `any` result is acceptable until there is a real need.
- **Dynamic locks.** Per-room or per-user locking still needs a map of lock
  values. A small `sync.LockMap` could own that map without making strings the
  default.
- **Lock ordering.** Value locks do not prevent two locks being taken in
  opposite orders. A wait-for graph keyed by lock identity can detect cycles,
  but it is a later diagnostic improvement.

## 2. Nullable struct fields and JSON defaults

Implemented: `T?` struct fields, defaults for missing JSON keys, field-named
`ParseError`s, and rejection of unknown keys.

This was a bug, not a feature request. Before the fix this was rejected:

```osl
struct AccessData (
  string mode = "open"
  string? password_hash = null
)
```

It reports `struct field 'password_hash' requires a concrete type`. Missing
JSON fields can also produce `null` for a field declared non-null, so the type
is not honest.

Desired behavior:

- `T?` fields compile and default to `null`.
- `json.parse<Struct>` applies field defaults for missing keys.
- A wrong-typed value is a `ParseError` naming the field.
- Unknown keys are rejected unless the struct opts into them.
- Spread, clone, assignment and assertions preserve nullability.

This unlocks typed records for stored and protocol data and removes most of
the `assertElse` and `<>("")` noise in `originchats-osl`:

```osl
struct AccessData (
  string mode = "open"
  string[] whitelisted_user_ids = []
  string? password_hash = null
  object[] applications = []
  object[] invites = []
)

AccessData data = json.parse<AccessData>(text)
string mode = data.mode
```

Related refactor: use object spread instead of `clone()` plus field
assignments where the update is pure.

## 3. Postfix `!` for result propagation

Use `!` instead of `?`, because `?` is tied to the legacy ternary and `!`
reads as a failure marker.

```osl
def dbRead<T>(string file) result<T, string> (
  string path = dbGetPath(file)
  if !fs.isFile(path) return result.err("Missing required database file: " ++ path)
  string text = fs.readFile(path)!
  return json.parse<T>(text)!
)
```

Semantics:

- Valid only on a `result<T, E>`.
- Valid only in a function returning a compatible `result<U, E>`.
- On failure, returns the failed result immediately.
- It does not throw and does not silently unwrap.
- It is not a non-null assertion. `.<T>` and `.assert(...)` keep that job.
- It does not apply to handlers returning `{error: ...}`; those need a typed
  result protocol or an explicit `catch`.

Open questions:

- Exact error types only, or allow conversion with `!` plus an error type?
- Does `!` work on a result held in a variable, or only on a call expression?
  It should work on any result-typed expression.
- How does it interact with `try(...) catch (...)`? `!` is for propagation;
  `try` is for recovery.

## 4. Automatic transactions over shared state

`sync.Cell<T>` was proposed and rejected. Do not implement it.

The current model:

- Individual collection operations are locked automatically in concurrent
  programs.
- Named locks and lock values are for multi-statement transactions.
- The compiler knows which globals are shared across threads.

The missing piece is the transaction boundary. A per-statement lock cannot
prevent a lost update in a read, clone and commit sequence. Options for later:

1. **Synchronized declarations.** Mark a global as synchronized and have the
   compiler take a read or write lock around each function that touches it.
   This is automatic, but coarse and prone to deadlocks across several
   globals.
2. **A language-level transaction block.** A `transaction ( ... )` block takes
   a global transaction lock or locks the shared values touched in the block.
   There is still an explicit block, but no lock name.
3. **Data-owned locking without a cell.** A typed wrapper other than
   `sync.Cell` might be acceptable; this needs a new design before it is
   proposed again.
4. **Optimistic concurrency.** Version shared values and retry transactions on
   conflict. Too large for now.

Recommendation: keep lock values as the primitive, and revisit automatic
transactions only after the originchats migration shows which transactions
remain.

## 5. Rejected or parked

- **`guard`:** rejected. `if` reads clearly and already narrows and records
  facts. Do not add a second early-return keyword.
- **Structural `match`:** rejected for now.
- **Package-defined block syntax:** rejected. It makes each package a small
  language. If trailing blocks are ever added, they should be one general rule
  for every function, not a per-package feature.
- **Language-level `fail` / `ok`:** rejected. Define helpers in
  `originchats-osl` if they improve the handler protocol.
- **`|>`:** optional. It exists, but `xs.map(...)` is already readable. Do not
  push a pipe style.
- **`sync.Cell<T>`:** rejected.

## 6. Existing features to use more

- `??` for typed nullable values.
- Object spread for pure updates.
- `map` / `filter` / iterators instead of `for` plus `append` where the loop
  only transforms a collection.
- Precise filesystem predicates: `isFile` before a file read, `isDir` before
  `readDir`, instead of `exists`.
- `struct` for fixed-shape internal data instead of `object`.
