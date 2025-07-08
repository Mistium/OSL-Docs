# System Information Variables

These global variables provide information about the system, operating system, and environment.

## Basic System Information

| Variable | Type | Description |
|----------|------|-------------|
| `system_os` | String | The operating system of the device (e.g., "macOS", "Windows", "Linux") |
| `system_browser` | String | The browser being used (e.g., "Chrome", "Firefox", "Safari") |
| `system_url` | String | The URL of the current environment |
| `fps` | Number | The current frames per second of the application |
| `delta_time` | Number | The time elapsed since the last frame in seconds |

## Origin System Information

| Variable | Type | Description |
|----------|------|-------------|
| `origin` | Object | Contains information about the Origin system version and kernel |
| `origin.version` | String | The version number of Origin |
| `origin.kernel.version` | String | The kernel version number |
| `origin.kernel.type` | String | The kernel type (e.g., "stable") |
| `origin.kernel.name` | String | The kernel name (e.g., "Dawn") |

## Examples

```javascript
// Display system information
log "Running on " + system_os + " using " + system_browser
log "Origin version: " + origin.version
log "Kernel: " + origin.kernel.name + " " + origin.kernel.version + " (" + origin.kernel.type + ")"

// Use the fps value for performance monitoring
if fps < 30 (
  log "Warning: Low performance detected"
)

// Use delta_time for frame-independent animations
position_x += speed * delta_time
```
