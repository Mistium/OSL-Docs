---
description: The legacy log, say, warn and error commands, where their output went in originOS, and how each works in compiled OSL.
---

# Legacy debug commands

In originOS, four commands inspected a running script: `log`, `say`, `warn` and `error`. They wrote to the browser's developer console. In compiled OSL they still exist, and write to the terminal instead. `log` and `say` behave as before. `warn` and `error` now write to standard error.

## log and say

`log` printed any value so you could see it while developing. It is OSL's `print`. `say` was an alias:

```legacy
log "hello world"
say "same as log"
```

The output format has not changed. Strings print as they are. Numbers and booleans print as written. Arrays and objects print as JSON, with objects' keys in sorted order:

```osl
log "hello world"
say "same as log"
log 42
log [1, 2, 3]
log {a: 1, b: 2}
log true
```

```output
hello world
same as log
42
[1,2,3]
{"a":1,"b":2}
true
```

`log` takes any number of values and prints them separated by spaces. Commas between them are a syntax error. To build one string with no spaces, join with `++`, which turns the other value into text:

```osl
int x = 5
log "x is " ++ x
log "a" "b" 3
```

```output
x is 5
a b 3
```

## warn and error

`warn` and `error` took the same arguments as `log`, and differed only in where the message went. In originOS, they sent a warning or an error to the browser console, where it appeared with a yellow or red mark:

```legacy
warn "im warning you >:("
error "something went wrong!!"
```

The two names signal intent, and nothing else. Neither stopped the script. To stop it, use `throw`.

In compiled OSL, both write to standard error, so they stay out of a program's normal output and can be redirected on their own:

```osl norun
log "result"             // standard output
warn "low on memory"     // standard error
error "request failed"   // standard error
```

```sh
osl run job.osl > result.txt          # only log goes to the file
osl run job.osl 2> problems.txt       # only warn and error go to the file
```

## Levelled logging

For logs with levels, timestamps and history, use [`std:log`](../../packages/log.md). It has `log.debug`, `log.info`, `log.success`, `log.error`, `log.fatal` and more:

```osl norun
import "std:log"

log.info("server started")
log.error("request failed")
```

## What to use now

| Legacy | Today |
| --- | --- |
| `log value` | `log value`, unchanged |
| `say value` | `say value`, or just `log` |
| `warn value` | `warn value`, now on standard error |
| `error value` | `error value`, now on standard error |
| Console output visible in the browser | The terminal. Run with `osl run`. |
| Stopping a script on a problem | `throw error("message")`, or `exit` the program |
