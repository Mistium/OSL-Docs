# Local Scoping

### About Variables

In osl all variables are global scope and to use locally scoped variables you must use the keyword `this`

### Where can i use `this`?

You can use `this` inside of the following scopes

```
def

method

main

run
```

### How does `this` work?

The `this` variable is a json object that can be modified by setting keys on it, as shown below

```js
this.key = "1234"

log this
// returns {"key":"1234"}
```

`this` has a different value depending on the scope of when you access it

### Example script

```js
def "test_cmd"
  this.hello = "greetings!"
  log this.hello
  // logs "greetings!"
endef

this.hello = "hello world"

test_cmd

log this.hello
// logs "hello world"
```
