# formatFileSize()

The `formatFileSize()` function converts a file size in bytes to a human-readable string representation with appropriate units.

```javascript
// Format 1500 bytes to a readable size
readableSize = formatFileSize(1500)  // "1.46 KB"
```

## Syntax

```javascript
formatFileSize(sizeInBytes)
```

## Parameters

- `sizeInBytes`: Number - The file size in bytes to format

## Return Value

Returns a string representing the file size with an appropriate unit (B, KB, MB, GB, etc.).

## Description

The `formatFileSize()` function takes a numeric value representing a file size in bytes and converts it to a human-readable string with the most appropriate unit. It automatically selects between bytes, kilobytes, megabytes, gigabytes, etc., based on the size of the input value.

This function is particularly useful when:

- Displaying file sizes in user interfaces
- Reporting download or upload sizes
- Showing disk usage information
- Working with file system operations

## Examples

### Basic Usage

```javascript
// Format various file sizes
bytes = formatFileSize(512)       // "512 B"
kilobytes = formatFileSize(1536)  // "1.5 KB"
megabytes = formatFileSize(1048576)  // "1 MB"
gigabytes = formatFileSize(1073741824)  // "1 GB"
```

### Practical Example with File Listing

```javascript
// Get files in a directory
files = listFiles("my_directory")

// Display file names and sizes
for file in files (
  size = formatFileSize(file.size)
  log file.name + ": " + size
)
```

### Using with File Upload UI

```javascript
// Display file size during upload
def showFileInfo(file) (
  fileSize = formatFileSize(file.size)
  
  // Update UI with file information
  goto 10 10
  text "Uploading: " + file.name 12
  goto 10 30
  text "Size: " + fileSize 12
  goto 10 50
  text "Status: " + file.status 12
)
```

## Notes

- The function typically rounds to 2 decimal places for readability.
- For very large files, the function will use the appropriate unit (TB, PB, etc.)
- For very small files, bytes (B) will be used without decimal places.
- The exact formatting may vary slightly depending on the implementation.
