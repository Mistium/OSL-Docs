# Local Scoping

### About Variables

In osl all variables are global scope and to use locally scoped variables you must use the keyword `local`

### Where can I use `local`?

You can local scope inside of any function context

### How does `local` work?

The local keyword creates a key on an json object that's unique to the current context/scope that's accessible using the `this keyword`

```js
local key = "1234"

log this
// returns {"key":"1234"}
```

`this` has a different value depending on the scope of when you access it

### Local variables can be re-assigned without the local keyword

```javascript
def myFunc() (
  local v = 0
  v ++
  return v
)

log myFunc()
// returns 1
```

### Example script

```js
def "test_cmd" (
  local hello = "Greetings!"
  log hello
  // logs "Greetings!"
  hello += "I'm Mistium"
  log hello
  // logs "Greetings! I'm Mistium"
)

local hello = "hello world"

test_cmd

log hello
// logs "hello world"
```

If a local variable and a global variable exist with the same name, it will access the local variable first.
