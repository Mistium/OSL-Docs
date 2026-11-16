---
description: How the original OSL scoped variables with the local keyword and the this object, and how typed declarations scope them today.
---

# Legacy local scoping

In the original OSL, every variable was global. A variable was local only if you declared it with the `local` keyword, and local variables lived on an object called `this`. Today's OSL works the opposite way: a variable belongs to the block that declares it, and `local` and `this` are gone. This page describes the old model for people reading old programs, and shows what the same code looks like now.

## The old model

An assignment created or changed a global variable. To get a variable that existed only in the current function, you wrote `local`:

```legacy
def myFunc() (
  local v = 0
  v ++
  return v
)

log myFunc()
// returns 1
```

`local` worked inside any function. It created a key on a JSON object that belonged to the current scope, and `this` was that object, so its value depended on where you read it:

```legacy
local key = "1234"

log this
// returns {"key":"1234"}
```

After a `local` declaration, the variable could be changed without repeating `local`. If a local and a global had the same name, the local won.

```legacy
def "test_cmd" (
  local hello = "Greetings!"
  log hello
  // logs "Greetings!"
  hello ++= " I'm Mistium"
  log hello
  // logs "Greetings! I'm Mistium"
)

local hello = "hello world"

test_cmd

log hello
// logs "hello world"
```

## Today

Declare a variable with its type, and it exists in the block you declared it in: a function body, an `if`, a loop. Nothing outside can see it, and it can have the same name as a variable outside, which then stays untouched. There is no keyword for it, because it is the only behaviour. The keyword `local` is a compile error:

```osl error
def myFunc() (
  local v = 0
  v ++
  return v
)

log myFunc()
```

The same function, written for today:

```osl
def myFunc() int (
  int v = 0
  v++
  return v
)

log myFunc()
```

```output
1
```

And the longer example. The inner `hello` is a different variable from the outer one:

```osl
string hello = "hello world"

def greet() (
  string hello = "Greetings!"
  log hello
  hello ++= " I'm Mist"
  log hello
)

greet()
log hello
```

```output
Greetings!
Greetings! I'm Mist
hello world
```

The custom command `def "test_cmd"` became an ordinary function, called with parentheses.

### Reading and changing outer variables

A function can read and change a variable that is declared at the top of the file. To do that, write the name without a type. Writing the type declares a new variable that hides the outer one:

```osl
int total = 0

def add(int n) (
  total = total + n
)

def shadow() int (
  int total = 100
  total++
  return total
)

add(5)
add(6)
log total
log shadow()
log total
```

```output
11
101
11
```

`add` changed the global. `shadow` declared its own `total`, so the global kept 11.

### Blocks have their own scope

A variable declared inside an `if` or a loop is not visible after it. The old language would have left it global. The compiler says where the variable lives and how to fix it:

```osl error
if true (
  int inner = 1
)
log inner
```

Declare the variable before the block, and assign it inside.

### What replaced `this`

There is no scope object to read. If you want a bundle of named values, make it on purpose, with an [object](../../learn/objects.md) or a [struct](../../learn/structs.md). Inside a struct or class method, `self` is the value the method was called on.

See [Legacy OSL](index.md) for the other differences.
