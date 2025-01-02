# Defining Variables

In OSL when you define a variable it will always be global scoped. This means the variable can be accessed from anywhere in your program including inside of defined functions.&#x20;

```javascript
variable = 10
```

Variables cannot be defined anywhere other than directly at the start of a line and using an equals sign.

If you attempt to access a variable that has not been defined yet, it will return the variable name as an untyped value.

```javascript
log undefined_variable
// logs undefined_variable to the console with no quoteation marks.
```

