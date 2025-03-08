# fileGet("path")

The `fileGet()` function retrieves a specific data item from the currently open file. It's particularly useful for accessing specific values within structured data files like JSON.

## Syntax

```javascript
fileGet("path")
```

## Parameters

- `path` - A string representing the path to the data item within the file. This can use dot notation for objects and bracket notation for arrays.

## Return Value

The value at the specified path within the currently open file.

## Description

The `fileGet()` function allows you to access specific parts of a file's data structure without having to parse and navigate the entire file manually. It works with the file that was most recently opened using the `open()` function.

For structured data like JSON, the path parameter uses a syntax similar to JavaScript object and array access:
- Use dot notation (`object.property`) to access object properties
- Use bracket notation (`array[index]`) to access array elements
- Combine these for nested structures (`users[0].address.city`)

## Examples

### Basic Usage

```javascript
// Open a JSON file
open("config.json")

// Get specific values
username = fileGet("username")
theme = fileGet("settings.theme")
firstTag = fileGet("tags[0]")

log "Username: " + username
log "Theme: " + theme
log "First tag: " + firstTag
```

### Working with Nested Data

```javascript
// Assuming we have a users.json file with an array of user objects
open("users.json")

// Access nested data
firstName = fileGet("users[0].name.first")
city = fileGet("users[0].address.city")
secondUserEmail = fileGet("users[1].email")

log "First user's first name: " + firstName
log "First user's city: " + city
log "Second user's email: " + secondUserEmail
```

### Checking if Data Exists

```javascript
// Open a file
open("data.json")

// Check if a property exists before using it
hasSettings = fileGet("settings") != null
if hasSettings (
  darkMode = fileGet("settings.darkMode") ?? false
  log "Dark mode: " + darkMode
) else (
  log "Settings not found"
)
```

### Using with Different File Types

```javascript
// With a CSV file opened as a string
open("data.csv")
firstLine = fileGet("[0]")  // Gets the first line
secondValue = fileGet("[0][1]")  // Gets the second value in the first line

// With a configuration file
open("app.config")
port = fileGet("server.port")
host = fileGet("server.host")
```

## Error Handling

```javascript
// Open a file
open("data.json")

// Try to access data with error handling
try (
  value = fileGet("deeply.nested.property")
  log "Value: " + value
) catch (
  log "Error accessing property: " + error
)
```

## Notes

- A file must be opened with `open()` before using `fileGet()`
- If the specified path doesn't exist, the function returns `null`
- For JSON files, the file content is automatically parsed
- The function works best with structured data formats like JSON
- For simple text files, you can use array-like indexing to access lines
- Changes made to the data using `fileGet()` are not automatically saved to the file 