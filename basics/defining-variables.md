# Defining Variables

Use `name = value` to create or update an untyped variable.

```javascript
variable = 10
```

Top-level variables are global and can be read inside functions:

```javascript
greeting = "hello"

def showGreeting() (
  log greeting
)

showGreeting()
// hello
```

Inside a function or block, declare local variables with a type keyword or
`auto`. Local variables shadow globals with the same name and do not leak out of
the function.

```javascript
any count = 1

def increment() (
  any count = 10
  count += 1
  log count
)

increment()
log count
// 11
// 1
```

Variables must be assigned or declared before they are read. Referencing an
undefined variable is an error in current OSL.
