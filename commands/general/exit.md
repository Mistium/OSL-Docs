# exit

`exit status` immediately terminates the current process with an integer status code. It is a
built-in command and does not require an import.

```javascript
if configuration.isErr() (
  error configuration.unwrapErr()
  exit 1
)

exit 0
```

A zero status conventionally indicates success; non-zero values indicate failure. Statements
after `exit` are not executed.
