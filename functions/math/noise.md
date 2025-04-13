# noise(x, y, z)

The `noise()` function generates coherent pseudo-random values using Perlin noise. It takes up to three coordinates and returns a value between -1 and 1, creating smooth transitions between adjacent coordinates.

## Syntax

```javascript
noise(x)
noise(x, y)
noise(x, y, z)
```

## Parameters

- `x` - The x-coordinate in the noise space
- `y` (optional) - The y-coordinate in the noise space
- `z` (optional) - The z-coordinate in the noise space

## Return Value

A number between -1 and 1, representing the noise value at the given coordinates.

## Description

Perlin noise is a type of gradient noise that produces natural-looking random patterns. Unlike pure random values, Perlin noise creates smooth transitions between values, making it ideal for:

- Generating terrain
- Creating natural-looking textures
- Simulating organic movement
- Procedural content generation

The function can be called with one, two, or three parameters to generate 1D, 2D, or 3D noise respectively.

## Examples

### 1D Noise

```javascript
// Generate 1D noise
for i 10 (
  value = noise(i * 0.1)
  // Using ++ for string concatenation without spaces
  log "Noise at " ++ i ++ ": " ++ value
)
```

### 2D Noise

```javascript
// Generate a 2D noise map
width = 10
height = 10
scale = 0.1

for y height (
  row = ""
  for x width (
    // Get noise value between -1 and 1
    value = noise(x * scale, y * scale)
    
    // Convert to a value between 0 and 1
    normalized = (value + 1) / 2
    
    // Map to a character based on value
    if normalized < 0.3 (
      row ++= " "
    ) else if normalized < 0.6 (
      row ++= "."
    ) else if normalized < 0.8 (
      row ++= "o"
    ) else (
      row ++= "#"
    )
  )
  log row
}
```

### 3D Noise (Animated)

```javascript
// Animate noise over time (3D noise)
mainloop:
  clear()
  time = getTime() * 0.01
  
  for y 20 (
    row = ""
    for x 40 (
      value = noise(x * 0.1, y * 0.1, time)
      normalized = (value + 1) / 2
      
      if normalized < 0.3 (
        row = row ++ " "
      ) else if normalized < 0.6 (
        row = row ++ "."
      ) else if normalized < 0.8 (
        row = row ++ "o"
      ) else (
        row = row ++ "#"
      )
    )
    log row
  )
  
  wait 50
```

### Terrain Generation

```javascript
// Generate terrain heights using noise
width = 100
scale = 0.05

heights = []
for x width (
  // Generate height value between 0 and 1
  height = (noise(x * scale) + 1) / 2
  
  // Scale to desired range (0-20)
  scaledHeight = (height * 20).floor()
  heights.append(scaledHeight)
)

// Render terrain
for x width (
  column = ""
  for y 20 (
    if y >= 20 - heights[x] (
      column = column ++ "#"
    ) else (
      column = column ++ " "
    )
  )
  log column
)
```

## Notes

- The same input coordinates will always produce the same output value
- Small changes in input produce small changes in output (coherence)
- For best results, use small increments between coordinates (0.01-0.1)
- The function is deterministic - same seed produces same sequence
- Combine with different scales for more complex patterns