# Local Scoping

OSL uses declarations to create local variables inside functions and command
blocks. Use a type keyword such as `any`, `string`, `number`, `boolean`, `array`,
`object`, or `auto` before the variable name.

```javascript
def counter() (
  any count = 0
  count += 1
  return count
)

log counter()
// 1
```

## Shadowing Globals

A local declaration can use the same name as a global variable. Inside the
function, the local value is used first; outside the function, the global value
is unchanged.

```javascript
any message = "global"

def showMessage() (
  any message = "local"
  log message
)

showMessage()
log message
// local
// global
```

## Reassignment

After a local variable has been declared, reassign it without repeating the type.

```javascript
def total() (
  number value = 1
  value += 4
  return value
)

log total()
// 5
```

The old originOS `local` keyword is legacy syntax. Current OSL does not use
`local` or a `this` object for function-local variables.
