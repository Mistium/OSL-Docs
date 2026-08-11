# Debugging

The `log` command prints a value to standard output. It is the OSL equivalent of
`print` in Python or `console.log` in JavaScript, and is the main tool for
inspecting values while developing a script.

```javascript
log "hello world"
```

`say` is an alias for `log`:

```javascript
say "hello world"   // same as log
```

## Logging any value

`log` accepts any value. Arrays and objects are printed as JSON, numbers and
booleans as their literal form.

```javascript
log 42                 // 42
log [1, 2, 3]          // [1,2,3]
log { a: 1, b: 2 }     // {"a":1,"b":2}
log true               // true
```

## Building log messages

Use `++` to join a string with another value without adding a space (the value
is converted to a string automatically):

```javascript
auto x = 5
log "x is " ++ x       // x is 5
```

## warn and error

`warn` and `error` work exactly like `log` - they evaluate any number of values left-to-right and
use the same writer-based formatter - but they write to **standard error** instead of
standard output. Use them for diagnostics so they stay out of a program's normal
output and can be redirected separately.

```javascript
log "result"            // -> stdout
warn "low on memory"    // -> stderr
error "request failed"  // -> stderr
```

```javascript
def check(n) (
  if n < 0 (
    error "value must not be negative"
    return
  )
  log n
)
```

`warn` and `error` are identical; the two names just signal intent. Both let the
script keep running - to stop execution, use `throw`. For structured or levelled
logging, see the [`osl/log`](../../packages/log.md) package.

Runtime errors include the nearest mapped OSL source line and up to eight OSL stack frames.
The sparse source lookup table is embedded directly in generated Go as a package-level map literal, so it requires no runtime `init()` function.
Generated Go line directives use paths relative to the entry script's parent directory (`main.osl`, `folder/helper.osl`) rather than absolute filesystem paths, keeping transpiled output portable.
Compile errors scan their source once for token relocation and caret placement.
CLI source and serialized-AST compilation share the same panic-to-error translation.
Parser line markers are applied in one compaction pass while preserving blank-line positions.
String lint diagnostics use the same scanner for single- and double-quoted literals.
Lint rules share one token-range formatter for consistent line and highlight positions.
Unclosed single- and double-quoted strings share the same validation and one-character opener highlight.

Cold test runs link compiled cases from all selected test files into one batch runner, avoiding repeated linker startup.

Test suite declarations use the lightweight `defineSuite` function and its `test` shorthands without constructing helper classes.
Translated compiler diagnostics omit Go-only type and location annotations.
Syntax diagnostics include the source file and line, including incomplete inline
functions such as `value ->` with no body.
Unused top-level variable checks include references from local imports and point
to the variable's declaration line.
