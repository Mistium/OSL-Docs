# Programs and variables

An OSL file runs from top to bottom. You do not need a `main` function.

```osl
log "first"
log "second"
```

Function, class, struct, and enum declarations are available before their source position. Other statements run where they appear.

## Declarations

Put the type before the name:

```osl
string username = "Ada"
int attempts = 0
number ratio = 0.75
boolean ready = false
string[] tags = ["admin", "active"]
```

Use `auto` when the compiler should infer a concrete type:

```osl
auto count = tags.len
auto upper = username.toUpper()
```

Use `any` for a value that is intentionally dynamic:

```osl
any payload = json.parse(raw)
payload = "invalid"
```

An untyped assignment also creates dynamic storage:

```osl
payload = {ok: true}
```

Production OSL tends to declare types at function boundaries and for long-lived state. Short local values often use `auto` when their type is obvious from the right side.

## Assignment and mutation

```osl
attempts += 1
attempts++
username ++= " Lovelace"
```

OSL supports `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `++=`, and `??=`. Postfix `++` and `--` are statements. In an expression, `++` means concatenation.

```osl
string label = "attempts: " ++ attempts
```

## Scope

Variables declared inside a function are local to that call. A local declaration may shadow a global.

```osl
string status = "global"

def readStatus() string (
  string status = "local"
  return status
)
```

Blocks do not create a separate variable lifetime in the same way a function does. Keep declarations close to their use and avoid reusing one name for unrelated values.

## Explicit `main`

You can define a zero-argument `main` function. The runtime calls it after top-level statements finish.

```osl
log "setup"

def main() (
  log "main"
)
```

Most applications use top-level code as the composition root. The OriginChats server follows this pattern in `src/main.osl`: it declares shared state, imports feature directories, mounts routes, then starts the server.

## Comments and statement separators

Use `//` for line comments. Newlines separate statements. Semicolons are unnecessary.

```osl
// Requests expire after five minutes.
int timeout = 300
```
