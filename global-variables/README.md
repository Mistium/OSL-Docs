# Global Variables

This section documents the global variables available in the OSL (Origin Script Language) environment.

Global variables are predefined variables that are accessible from anywhere in your script without requiring declaration or initialization.

## Categories

The global variables are organized into the following categories:

- [System Information](../global-variables/system-info.md) - Variables providing information about the system, OS, and environment
- [User Information](../global-variables/system-info.md) - Variables related to the current user and user settings
- [Date and Time](../global-variables/system-info.md) - Variables for current date, time, and related values
- [Input State](../global-variables/system-info.md) - Variables for tracking mouse, keyboard, and input devices
- [Display and UI](../global-variables/system-info.md) - Variables related to the display, window, and UI state
- [Network](../global-variables/system-info.md) - Variables for network status and connectivity information
- [File System](../global-variables/system-info.md) - Variables related to files and file types

## Usage

Global variables can be used directly in your code without declaration:

```javascript
// Using global variables for positioning
goto background_width / 2, background_height / 2
text "Centered text" 12

// Using time-related global variables
log "Current time: " + hour + ":" + minute + ":" + second
```

For some global variables (like those in objects), you need to use the dot notation to access their properties:

```javascript
// Accessing user object properties
log "Username: " + user.username
log "Theme accent color: " + user.theme.accent
```
