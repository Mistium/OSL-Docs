# parseFilePath()

The `parseFilePath()` function resolves a relative file path into an absolute path, handling various file locations including user directories, packages, and current workspace paths.

```javascript
// Resolve a relative path to an absolute path
absolutePath = parseFilePath("myFolder/file.osl")
```

## Syntax

```javascript
parseFilePath(path)
```

## Parameters

- `path`: String - A relative or partial file path to resolve

## Return Value

Returns a string containing the resolved absolute file path.

## Description

The `parseFilePath()` function takes a relative or partial file path and resolves it to a complete absolute path, taking into account the current working directory, user directories, and package locations. This function is useful for:

- Resolving file paths before file operations
- Working with imports and includes
- Handling user files and packages consistently
- Navigating directory structures programmatically

The function handles various path formats and locations, making it easier to work with files across different contexts in the OSL environment.

## Examples

### Basic Usage

```javascript
// Resolve a simple file in the current directory
filePath = parseFilePath("config.json")
log filePath  // Full absolute path to config.json

// Resolve a file in a subdirectory
imagePath = parseFilePath("assets/images/logo.png")
log imagePath  // Full absolute path to the image
```

### Working with Package Files

```javascript
// Resolve a path to a package file
packagePath = parseFilePath("packages/utils/helpers.osl")
log packagePath  // Absolute path to the package file
```

### Using with File Operations

```javascript
// Resolve a path before reading a file
configPath = parseFilePath("config/settings.json")
configData = open(configPath, ["data"])

// Work with the file data
settings = configData[1]
```

### Path Manipulation

```javascript
// Get the directory containing a file
filePath = parseFilePath("documents/report.txt")
dirPath = filePath.replaceFirst(/\/[^\/]+$/, "")

// List files in that directory
files = listFiles(dirPath)
```

## Notes

- The function resolves paths relative to the current working directory by default
- Special directories like user directories and package locations are handled automatically
- The function does not verify if the file actually exists
- For security reasons, the function may prevent accessing paths outside allowed directories
- The resolved path follows the platform-specific format for the current environment