# File System Variables

These global variables provide information about file types, file handling, and file operations in the OSL environment.

## File Type Definitions

The `file_types` object contains definitions for various file types recognized by the system. Each entry includes:
- Icon definition (for visual representation)
- Description of the file type
- Associated applications that can open the file type

Here's a summary of some key file types defined in the system:

| File Extension | Description | Associated Applications |
|----------------|-------------|-------------------------|
| `.folder` | Directory/Folder | Files.osl |
| `.osl` | Origin Script | Process_Opener.osl, Studio.osl |
| `.orsl` | Origin Script | Process_Opener.osl, Studio.osl |
| `.txt` | Plain Text | Studio.osl |
| `.md` | Markdown | Studio.osl |
| `.json` | JSON File | Studio.osl |
| `.xml` | Markup | Studio.osl |
| `.js` | Javascript | Studio.osl |
| `.html` | HTML File | Studio.osl |
| `.css` | CSS File | Studio.osl |
| `.py` | Python | Studio.osl |
| `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp` | Image Files | Previewer.osl |
| `.mp4`, `.webm` | Video Files | Media_Player.osl |
| `.mp3`, `.wav`, `.flac` | Audio Files | Media_Player.osl |

## File Constants and Special Values

| Variable | Type | Description |
|----------|------|-------------|
| `null` | Null | Special value representing null or empty |
| `newline` | String | String representing a newline character |
| `infinity` | Number | Special value representing infinity |

## Examples

```javascript
// Check if a file extension is recognized
def isRecognizedFileType(filename) (
  extension = filename.substring(filename.lastIndexOf("."))
  return file_types[extension] != null
)

// Get the description of a file type
def getFileTypeDescription(filename) (
  extension = filename.substring(filename.lastIndexOf("."))
  fileType = file_types[extension]
  
  if (fileType) {
    return fileType[1] // Return the description (second element)
  } else {
    return "Unknown file type"
  }
)

// Get applications that can open a file
def getCompatibleApps(filename) (
  extension = filename.substring(filename.lastIndexOf("."))
  fileType = file_types[extension]
  
  if (fileType && fileType[2]) {
    return fileType[2] // Return the array of applications
  } else {
    return []
  }
)

// Example usage
filename = "document.txt"

if (isRecognizedFileType(filename)) {
  log "File type: " + getFileTypeDescription(filename)
  
  apps = getCompatibleApps(filename)
  if (apps.length > 0) {
    log "Can be opened with: " + apps.join(", ")
  } else {
    log "No compatible applications found"
  }
}
```

## Notes

- The file types configuration is used by the system to determine how to display and handle different file types.
- New file types can be registered by applications by extending the `file_types` object.
- The icon definition uses a custom drawing syntax to define how the file type's icon should appear.
- Applications associated with file types are paths to OSL script files that can handle the specified file type.