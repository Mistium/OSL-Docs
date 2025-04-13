# import()

The `import()` function loads and evaluates OSL code from another file, making its contents available to the current script. This function supports importing both local files and package files.

```javascript
// Import a local OSL file
data = import("utilities.osl")

// Import a file without the .osl extension (it will be added automatically)
helpers = import("helpers")
```

## Syntax

```javascript
import(filename)
```

## Parameters

- `filename`: String - The name or path of the file to import. If the filename doesn't contain a '.', the '.osl' extension will be added automatically.

## Return Value

Returns the exported data from the imported file, which can be any valid OSL value (object, array, function, etc.).

## Description

The `import()` function loads and executes OSL code from an external file, allowing you to:

- Organize your code into modules
- Reuse code across multiple scripts
- Share functionality between different parts of your application
- Load dynamically selected scripts at runtime

The function supports two main import paths:

1. Local files in the current workspace
2. Package files from the packages directory

## Examples

### Basic Usage

```javascript
// Import a utility file
utils = import("utils.osl")

// Use functions from the imported file
result = utils.calculateTotal(100, 0.1)
```

### Importing Without Extension

```javascript
// The .osl extension is added automatically
config = import("config")
```

### Importing from Packages

```javascript
// Import a package from the packages directory
animation = import("animation-library")

// Use the imported package
animation.fadeIn("myElement", 500)
```

### Conditional Importing

```javascript
// Import different files based on conditions
if debugMode (
  logger = import("debug-logger")
) else (
  logger = import("production-logger")
)

// Use the appropriate logger
logger.log("Application started")
```

### Using Imported Data

```javascript
// Import configuration
config = import("app-config")

// Access the imported data
apiUrl = config.apiUrl
maxRetries = config.maxRetries
timeout = config.timeout

// Set up the API with the imported configuration
setupApi(apiUrl, maxRetries, timeout)
```

## Notes

- Imported files are executed in their own scope
- If a file doesn't exist or can't be loaded, an empty object is returned
- The import path is resolved relative to the current script's location
- For package imports, the file is loaded from the user's packages directory
- The function handles path resolution automatically, using the `parseFilePath` function internally
