# Commands

In osl you can define a custom command using the `def` command, as with all other custom syntax. A custom command will not return a value, and will simply allow for a script to reuse commands.

## Syntax

```javascript
def "my_command" "input1"
  // run command stuff
endef
```

## Example

```javascript
def "logtimes" "times, string"
  loop times (
    log string
    // log the input string
  )
endef

logtimes 5 "hello world"
// logs hello world 5 times
```

This has a flaw however, it fully uses only global variables, meaning that the variables can be accessed from anywhere and meaning that making a recursive command is almost impossible. To ensure it uses local we can use: `this` from [local-scoping.md](../variables/local-scoping.md "mention")

```javascript
def "logtimes" "this.times, this.string"
  loop this.times (
    log this.string
    // log the input string
  )
endef

logtimes 5 "hello world"
// logs hello world 5 times
```
