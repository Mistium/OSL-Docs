# Iteration

## Loop

* The `loop` statement repeats a block of code a specified number of times.

### Example

```js
loop 5 (
 command
 command
)
```

### Syntax

```js
loop number_of_times (
  commands
)
```

* `number_of_times`: The number of times to repeat the block of commands.
* `commands`: The commands to be executed within the loop.

### Example

```js
loop 3 (
  moveForward
  turnLeft
)
```

In this example, the robot will move forward and then turn left three times.

### Use Cases

#### **Fibonacci Sequence Generation:**

```js
// Generate Fibonacci sequence up to n terms
def "total_loops.fibonacci()"
  a = 0
  b = 0
  c = 1
  loop total_loops (
    a = b + c
    b = c
    c = a
  )
  return c
endef

// Usage:
loop 10 (
  say 5.fibonacci()
)
```

This example demonstrates how the `loop` command can be used to repeatedly generate the Fibonacci sequence with a specified number of terms.

#### **Repeated Task Execution:**

```js
// Perform a task repeatedly for a certain duration
def "performTask"
  // Your task implementation goes here
endef

// Usage:
loop 10 (
  performTask
)
```

Here, the `loop` command is used to execute a task function multiple times, which can be useful for performing repetitive tasks within a program.

## For

```js
// Usage:
for i 10 (
  log i
)
// logs the numbers 1-10

// Usage:
for i list.len (
  log list[i]
)
// logs the items in array "list"
```

## Each

```js
// Usage:
each i item list (
  log i
  log item
  log list[i]
)
// logs the items in array "list"
```
