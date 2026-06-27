# Commands

In osl you can define a custom command using the `def` command, as with all other custom syntax. A custom command will not return a value, and will simply allow for a script to reuse commands.

## Syntax

```javascript
def "my_command" "input1" (
  // run command stuff
)
```

## Example

> ⚠️ **Custom command definitions are not fully implemented in the current OSL CLI.** The syntax shown below may not work as expected. This feature is under development.

```javascript
def "logtimes" "times, string" (
  loop times (
    log string
    // log the input string
  )
)

logtimes 5 "hello world"
// logs hello world 5 times
```