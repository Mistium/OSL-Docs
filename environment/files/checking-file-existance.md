# Checking file existance

```javascript
file "exists" path/uuid
// if the file doesnt exist dont try to open it
if exists (
  log "file exists!"
) else (
  log "file doesnt exist!"
)

// trying to open a file that doesnt exist causes an error
```
