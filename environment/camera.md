# Camera

OSL provides built-in camera functionality that allows you to capture and display camera input in your applications.

## Basic Camera Operations

### Starting the Camera

Before using any camera features, you must initialize the camera:

```javascript
camera "start"  // Initialize camera system
```

### Getting Camera Data

You can retrieve various types of data from the camera:

```javascript
// Get camera image as data URI
camera "get" "image"
imageData = data  // The result is stored in the 'data' variable

// Get camera dimensions
camera "get" "width"
cameraWidth = data

camera "get" "height"
cameraHeight = data
```

## Camera Selection

OSL supports both front and back cameras on devices that have them:

```javascript
// Switch to front camera
camera "use_front"

// Check if device has back camera
camera "get" "hasbackcam"
hasBackCamera = data  // true/false
```

## Displaying Camera Feed

### Method 1: Direct Rendering (Recommended)

The simplest and most efficient way to display the camera feed:

```javascript
// Renders camera feed directly
image "camera"
```

### Method 2: Manual Loading

For more control over the loading process:

```javascript
// Create unique identifier
uuid = ouidNew()

// Set up rendering loop
mainloop:
    // Load camera data into image
    image "load" data uuid
    // Display the image
    image uuid
```

## Important Notes

- Always call `camera "start"` before using other camera functions
- The `data` variable contains the result of `camera "get"` operations
- Direct rendering with `image "camera"` is more efficient
- Manual loading gives more control but is slower
- Camera availability depends on the device's hardware
- Front camera is available on most devices
- Back camera availability can be checked with `"hasbackcam"`

## Best Practices

1. Always check for camera availability before using it
2. Use direct rendering unless you need specific control
3. Handle cases where camera access might be denied
4. Consider device orientation for camera display
5. Be mindful of performance when using manual loading 