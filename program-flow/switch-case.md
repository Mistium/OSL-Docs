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

## Advanced

### Compiler

The compiler is a complex topic and this is not for beginners, but does help for developers to understand this

A simple switch case like the one below is converted by the compiler into jumps and equality checks

```javascript
switch 2 (
  case 1
    log "hello"
    break
  case 2
    log "world"
    break
  default
    log "unknown"
    break
)
```

The compiler output for this script (origin v5.1.2) looks like this:

Comments have been added by me to help explain

```js
ji 1 == 2 6 /* case 1  compiled to (jump if) that goes to line 6 */
ji 2 == 2 9 /* case 2  compiled to (jump if) that goes to line 9 */
jt 12       /* default compiled to (jump to) that goes to line 12 */
jt 15       /* redundant jump incase there is no default */

log "hello" /* case 1 */
jt 15       /* break   jumps out of the switch case statement */

log "world" /* case 2 */
jt 15       /* break   jumps out of the switch case statement */

log "unknown" /* default case */



```
