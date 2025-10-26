# Running Other Languages

OSL provides the ability to execute code in other programming languages, specifically JavaScript. This feature requires explicit permission from the user for security reasons.

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

## Javascript Integration

### Getting Permission

```javascript
permission "request" "python"
```

### Example Permission Check

```javascript
permission "request" "javascript"  // Request permission

authorised = false  // Track permission status

window.on("permission_granted", (name) -> (
  if name == "javascript" (
    authorised = true
    // run some js code with your new permission
  )
))

window.on("permission_rejected", (name) -> (
  if name == "javascript" (
    say "This app needs the javascript permission to run"
  )
))

mainloop:
    if authorised (
      // only run code that requires javascript once you get the permission
    )
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

## Important Notes

- Permissions must be requested at runtime
- Permissions can be revoked by the user
- JavaScript console output appears in the browser's developer tools
- Code execution in other languages may have performance implications
- Always validate and sanitize any dynamic code before execution
