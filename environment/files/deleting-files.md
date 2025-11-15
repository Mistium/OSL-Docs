# Deleting files

```javascript
file "exists" path/uuid
// if the file doesnt exist dont try to open it
if !exists (
  log "file does not exist"
  return
)
// use the file as the current target
file "open" path/uuid "onlyaccess"

// immediately delete the file
file "delete"

// clean up the file target
file "close"
```
