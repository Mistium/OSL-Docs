# ouidNew()

The `ouidNew()` function generates a unique identifier string suitable for use as database keys, session IDs, or any other scenario requiring unique values.

```javascript
// Generate a unique ID
id = ouidNew()
```

## Syntax

```javascript
ouidNew()
```

## Parameters

This function doesn't take any parameters.

## Return Value

Returns a string containing a cryptographically strong unique identifier.

## Description

The `ouidNew()` function creates unique identifiers by combining several sources of entropy including:

- Current timestamp
- System performance metrics
- User's unique identifier

The result is then hashed using SHA-256 to create a fixed-length unique string that's suitable for:

- Database record identifiers
- Session or authentication tokens
- Unique filenames
- Entity tracking in applications
- Temporary identifiers for objects

## Examples

### Basic Usage

```javascript
// Generate a simple unique ID
id = ouidNew()
log id  // Outputs something like "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
```

### Creating Unique Database Records

```javascript
// Create a new user record with a unique ID
def createUser(name, email) (
  user = {
    id: ouidNew(),
    name: name,
    email: email,
    created: timestamp()
  }
  
  // Store the user in the database
  users = localDbGet("users") ?? []
  users.push(user)
  localDbSet("users", users)
  
  return user.id
)
```

### Generating Unique Filenames

```javascript
// Create a unique filename for storing user uploads
def generateUniqueFilename(originalName) (
  // Extract file extension
  extension = originalName.split(".").pop()
  
  // Generate unique name with original extension
  return ouidNew() + "." + extension
)

// Usage
newFilename = generateUniqueFilename("profile.jpg")
```

### Creating Temporary Tokens

```javascript
// Generate a password reset token that expires
def createPasswordResetToken(userId) (
  token = ouidNew()
  
  // Store the token with expiration time
  localDbSet("reset_token_" + userId, {
    token: token,
    expires: timestamp() + 3600  // Expires in 1 hour
  })
  
  return token
)
```

## Notes

- The generated IDs are cryptographically strong and suitable for most applications
- The function generates a different ID on every call
- The length and format of the ID is consistent across all calls
- For extremely high-volume systems with thousands of IDs per second, consider monitoring for potential collisions
- The function generates strings that are suitable for use in URLs and filenames
