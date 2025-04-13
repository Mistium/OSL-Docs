# listFiles()

The `listFiles()` function returns an array of file names in the current directory that the application has opened using file commands.

## Syntax

```javascript
listFiles()
```

## Parameters

None

## Return Value

An array of strings, where each string is the name of a file that has been opened by the application.

## Description

The `listFiles()` function provides a way to discover what files are available to your application. It returns a list of files that:

1. Are in the current working directory
2. Have been previously opened by the application
3. The application has permission to access

This is useful for applications that need to work with multiple files or need to display a list of available files to the user.

## Examples

### Basic Usage

```javascript
// Get a list of available files
files = listFiles()

// Display the files
log "Available files:"
for i files.len (
  // Using ++ to concatenate strings without spaces
  log (i + 1) ++ ". " ++ files[i]
)
```

### Checking if a File Exists

```javascript
// Get the list of files
files = listFiles()

// Check if a specific file exists
fileName = "config.json"
fileExists = files.contains(fileName)

if fileExists (
  // Open the file if it exists
  content = open(fileName)
  // Using ++ to join strings without adding spaces
  log "File opened: " ++ fileName
) else (
  log "File not found: " ++ fileName
)
```

### Processing Multiple Files

```javascript
// Get all available files
files = listFiles()

// Process only JSON files
jsonFiles = []
for i files.len (
  if files[i].endsWith(".json") (
    jsonFiles.append(files[i])
  )
)

// Process each JSON file
for i jsonFiles.len (
  currentFile = jsonFiles[i]
  log "Processing: " ++ currentFile
  
  // Open and process the file
  content = open(currentFile)
  data = content.JsonParse()
  
  // Do something with the data
  log "File contains " ++ data.len ++ " items"
)
```

### Creating a File Selector

```javascript
// Get available files
files = listFiles()

// Display a simple file selector
log "Select a file by number:"
for i files.len (
  log (i + 1) ++ ": " ++ files[i]
)

// Get user selection
selection = ask("Enter file number:").toNum()

if selection > 0 and selection <= files.len (
  selectedFile = files[selection - 1]
  log "You selected: " ++ selectedFile
  
  // Open the selected file
  content = open(selectedFile)
  log "File content: " ++ content
) else (
  log "Invalid selection"
)
```

## Notes

- The function only lists files that the application has previously opened
- It does not list all files in the directory (for security reasons)
- The returned list may be empty if no files have been opened yet
- File permissions are still enforced when trying to open files from the list
- The function returns only file names, not full paths
- To get more information about files, you'll need to open them individuall
