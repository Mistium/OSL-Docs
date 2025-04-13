# Network Variables

These global variables provide information about the network status, connections, and online functionality of the OSL environment.

## Connection Variables

| Variable | Type | Description |
|----------|------|-------------|
| `network.connected` | Boolean | Whether the device is connected to a network |
| `network.server` | String | URL of the current server the application is connected to |
| `network.username` | String | Network username used for the current connection |
| `network.validator` | String | Validation string for secure network operations |

## Network Statistics

| Variable | Type | Description |
|----------|------|-------------|
| `network.upload` | Number | Current upload speed in bytes |
| `network.download` | Number | Current download speed in bytes |

## Online Users

| Variable | Type | Description |
|----------|------|-------------|
| `network.online_users` | Array | Array of usernames currently online on the server |

## RoTurLink

| Variable | Type | Description |
|----------|------|-------------|
| `roturlink.enabled` | Boolean | Whether RoTurLink functionality is enabled |
| `roturlink.ws` | Object | WebSocket connection object for RoTurLink |
| `roturlink.send` | Function | Function to send data through RoTurLink |

## Examples

```javascript
// Check network connection
if (network.connected) {
  log "Connected to " + network.server
} else {
  log "Not connected to a network"
}

// Display online users
log "Users online: " + network.online_users.length
for (user in network.online_users) {
  log "- " + user
}

// Display network statistics
log "Upload: " + formatFileSize(network.upload) + "/s"
log "Download: " + formatFileSize(network.download) + "/s"

// Using RoTurLink to send a message when enabled
if (roturlink.enabled) {
  message = {
    type: "chat",
    text: "Hello from OSL!",
    timestamp: timestamp
  }
  
  roturlink.send(message)
  log "Message sent through RoTurLink"
}
```