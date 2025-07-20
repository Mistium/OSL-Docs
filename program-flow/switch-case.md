# Switch Case

Switch case is incredibly useful in osl due to its sheer speed when compared with an if else tree, along with its improved readability

## Main Syntax

You encapsulate a switch case statement with a simple switch statement

```javascript
switch value (

)
```

## Cases

You can add a simple case using the syntax shown below

```javascript
/* open the switch statement */
switch value (
  case value
    command
    break
  case value2
    /* a case :3 */
    break
)
```

## Default

You can use the default case to handle when none of the cases are met.

It must be placed at the bottom of the switch case statement

Example shown below

```javascript
/* open the switch statement */
switch value (
  case value
    command
    break
  case value2
    /* a case :3 */
    break
  default
    /* any input that is not expected */
    break
)
```

## Break?

You need to send your cases with break otherwise you may end up causing some big issues

When break is run, the switch case will immediately be exited
