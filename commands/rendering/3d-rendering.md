# 3D Rendering

OSL provides a powerful 3D rendering system for creating three-dimensional graphics and interactive environments.

> **Note**: The 3D system only works on apps in fullscreen mode.

## Setting Up the Environment

### Initialize 3D Rendering

```javascript
3dr "setup"  // Puts the window into fullscreen mode
```

### Camera Setup

```javascript
// Perspective projection
3dr "setup_perspective" fov min_distance max_distance

// Orthographic projection
3dr "setup_orthographic" min_distance max_distance
```

## Mesh Management

### Creating and Deleting Meshes

```javascript
// Create a new mesh
mesh = newMesh()  // Returns a mesh ID

// Delete a mesh
mesh.meshDelete()

// Check if mesh exists
mesh.meshExists()  // Returns boolean
```

### Mesh Data Operations

```javascript
// Load mesh from OBJ format
3dr "set_mesh_to_obj" mesh obj_line_array

// Create 2D plane mesh
3dr "set_mesh_xy" mesh array_x array_y

// Create 3D mesh
3dr "set_mesh_xyz" mesh array_x array_y array_z

// Set mesh blending mode
3dr "set_mesh_blending" mesh mode
// Modes: "default", "additive", "subtractive", "multiply", "invert", "mask", "erase"

// Set mesh culling
3dr "set_mesh_culling" mesh mode
// Modes: "nothing", "back faces", "front faces"
```

## Transformation and Rendering

### Transform Operations

```javascript
// Reset transformation matrix
3dr "reset_transform"

// Translate mesh
3dr "transform_xyz" x y z

// Scale mesh
3dr "scale_xyz" x y z  // Default: 1,1,1

// Draw mesh
3dr "draw_mesh" mesh

// Draw mesh at position
3dr "draw_mesh_at" mesh x y z
```

### Space Management

```javascript
// Switch to view space
3dr "to_view_space"

// Switch to world space
3dr "to_world_space"

// Transform from view to world space
3dr "transform_view_to_world" x y z
```

## Mesh Properties

```javascript
// Check mesh existence
mesh.meshExists()  // Returns boolean

// Check texture status
mesh.meshHasTexture()  // Returns boolean
```

## Example: Interactive 3D Scene

```javascript
// Setup 3D environment
3dr "setup"

// Camera position
cam_x = 0
cam_y = 3
cam_z = 0

// Create textured plane
plane = newMesh()
plane_x = [-1,1,-1,-1,1,1]
plane_y = [-1,-1,1,1,-1,1]
3dr "set_mesh_xy" plane plane_x plane_y

// Setup camera
3dr "setup_perspective" 90 0.01 1000

mainloop:
    // Camera rotation
    3dr "to_view_space"
    3dr "reset_transform"
    3dr "rotate" "x" 0 - mouse_y
    3dr "rotate" "y" 0 - mouse_x
    
    // Movement
    tx = ("a".pressed - "d".pressed) * delta_time * 20
    tz = ("w".pressed - "s".pressed) * delta_time * 20
    
    // Update camera position
    3dr "transform_view_to_world" tx 0 tz
    cam_x += 3drTransformX()
    cam_z += 3drTransformZ()
    
    // Render scene
    3dr "clear"
    3dr "to_world_space"
    3dr "reset_transform"
    3dr "draw_mesh" plane
```

## Important Notes

1. **Performance Considerations**
   - Minimize mesh updates during runtime
   - Use appropriate culling modes
   - Optimize texture sizes and formats

2. **Best Practices**
   - Always check mesh existence before operations
   - Clean up unused meshes
   - Use delta_time for smooth animations
   - Handle fullscreen mode appropriately

3. **Limitations**
   - Only works in fullscreen mode
   - Performance depends on browser capabilities
   - Mesh complexity affects rendering speed

4. **Camera Controls**
   - Use mouse for rotation
   - WASD for movement
   - Consider adding smooth transitions
   - Implement collision detection if needed 