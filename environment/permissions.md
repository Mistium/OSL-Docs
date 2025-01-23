# Permissions

### Permissions List:

#### IMPORTANT! PERMISSIONS ARE CASE SENSITIVE

[All Permissions Information](https://github.com/Mistium/Origin-OS/blob/main/Resources/permissions\_info.json)

***

### Permissions Overview

Permissions in Origin OS govern what actions applications are allowed to perform. These permissions are strictly case-sensitive and must be explicitly granted. Applications in the **Applications folder** or designated as **System Apps** automatically gain access to all permissions due to their elevated trust level.

#### Key Notes:

* **Case Sensitivity**: Permissions are case-sensitive. Ensure the correct capitalisation when requesting or granting permissions.
* **System Apps and Applications Folder**: Applications marked as system-level or stored in the Applications folder bypass manual permission requests and are granted all permissions automatically.
* **Permission Control**: Fine-grained permission control is available for non-system apps.

***

### Permissions Commands

#### 1. **Permission Request**

```js
permission "request" permission_name
```

**Purpose**: Requests a specific permission from the user. The requested permission must be named accurately (`permission_name`) due to case sensitivity.\
**Example**:

```js
permission "request" "file viewer"
// creates a permission popup that the user can accept or deny
```

#### 2. **Give a Permission**

```js
permission "give" permission_name application_name
// allows an osl file to give another osl file a permission
```

**Purpose**: Grants a specific permission (`permission_name`) to the specified application (`application_name`).\
**Requirements**:

* The executing application must have the **"permission editor"** privilege to perform this action.

***

### Accessing Application Permissions

To check the current permissions for an application, use the `window.permissions` variable (seen: [#file-and-code-data](the-window-system.md#file-and-code-data "mention")). This will return the list of permissions that the application currently has access to.

\
**Example Usage**:

```js
log window.permissions
// logs all the permissions that your window has, as an array

log window.parent.permissions
// allows you to see the permissions of the window that created yours
```

***

## Checking Permissions

### window.hasPermission(permission)

Checks if the window has been granted a specific permission.

```javascript
// Check if we have camera permission
if window.hasPermission("camera") (
  // Start using camera
) else (
  // Request camera permission first
)

// Check if we can simulate inputs
if window.hasPermission("simulate inputs") (
  // Simulate keyboard/mouse input
)

// Example: Check multiple permissions
if window.hasPermission("notifications") and window.hasPermission("sound") (
  // Play notification sound
)
```

## Requesting Permissions

By following these conventions, you can efficiently manage application permissions while maintaining the security and integrity of your system.
