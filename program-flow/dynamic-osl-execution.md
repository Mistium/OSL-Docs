# Dynamic OSL Execution

To run dynamic osl code, you can use the `run` command. It compiles and runs a json array of osl commands, allowing for an app to run downloaded scripts or other data.

## Syntax

```javascript
run ["command","comand2"] ["flag1","flag2"]
```

The run command can be customised to run at global scope or sandboxed depending on th elevel of access you want the code to have to the user's origin client.

Each item in the command array is essentially 1 line of osl code.

## Flags List

### "sandboxed"

This flag removes all permissions from the code running in this command. Allowing for safe execution of osl within the run command

### "raw"

this flag disables the run cache and simply runs the code "as-is" however this will not compile the osl, so unless the osl is precompiled, a lot of compile time features of osl will be missing.
