# Running Other Languages

OSL provides the ability to execute code in other programming languages, specifically Python and JavaScript. This feature requires explicit permission from the user for security reasons.

## Permissions System

Before running code in another language, you must request and receive permission from the user.

### Requesting Permission

```javascript
permission "request" "permission_name"
```

### Checking Permission Status

You can check if a permission has been granted by examining `window.permissions`:

```javascript
window.permissions.contains("permission_name")
```

## Python Integration

### Getting Python Permission

```javascript
permission "request" "python"
```

### Example Permission Check

```javascript
permission "request" "python"  // Request permission

authorised = false  // Track permission status

mainloop:
    if authorised.not (
        if window.permissions.contains("python") (
            authorised = true
            // Permission granted, can now run Python code
        )
    )
```

### Running Python Code

Once permission is granted, use the `py` command to execute Python code:

```javascript
py "print('Hello from Python')"
log data  // Outputs the Python print result
```

### Example Python Integration

```javascript
// Calculate Fibonacci numbers using Python
py "
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
print(fib(10))
"
log data  // Outputs the 10th Fibonacci number
```

## JavaScript Integration

### Getting JavaScript Permission

```javascript
permission "request" "javascript"
```

### Running JavaScript Code

Once permission is granted, use the `eval` command to execute JavaScript code:

```javascript
eval "console.log('Hello from JavaScript')"  // Outputs to browser console
```

### Example JavaScript Integration

```javascript
// Use JavaScript to interact with the browser
eval "
let date = new Date();
console.log(`Current time: ${date.toLocaleTimeString()}`);
"
```

## Best Practices

1. **Permission Management**
   - Always request permissions before attempting to run foreign code
   - Check permission status before each execution
   - Handle cases where permission is denied

2. **Code Safety**
   - Validate and sanitize any dynamic code before execution
   - Be cautious with user-provided code
   - Consider security implications of running foreign code

3. **Error Handling**
   - Check for execution errors
   - Provide fallback behavior when permissions are denied
   - Handle syntax errors in foreign code gracefully

## Example: Language Integration

```javascript
// Request both permissions
permission "request" "python"
permission "request" "javascript"

mainloop:
    if window.permissions.contains("python") (
        // Use Python for computation
        py "result = sum(range(1, 101))"
        sum = data
        
        if window.permissions.contains("javascript") (
            // Use JavaScript to display result
            // Using ++ to concatenate without spaces, since we need exact syntax for eval
            eval "console.log('Sum calculated by Python:', " ++ sum ++ ")"
        )
    )
```

## Important Notes

- Permissions must be requested at runtime
- Permissions can be revoked by the user
- Python and JavaScript execution environments are isolated
- Output from Python is captured in the `data` variable
- JavaScript console output appears in the browser's developer tools
- Code execution in other languages may have performance implications
- Always validate and sanitize any dynamic code before execution
