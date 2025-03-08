# octaveNoise(x, y, z, octaves, persistence)

The `octaveNoise()` function generates fractal Perlin noise by combining multiple layers (octaves) of noise at different frequencies and amplitudes. This creates more complex and natural-looking patterns than basic Perlin noise.

## Syntax

```javascript
octaveNoise(x, y, z, octaves, persistence)
```

## Parameters

- `x` - The x-coordinate in the noise space
- `y` - The y-coordinate in the noise space
- `z` - The z-coordinate in the noise space
- `octaves` - The number of layers of noise to combine
- `persistence` - How much each octave contributes to the final result (0-1)

## Return Value

A number between -1 and 1, representing the combined noise value at the given coordinates.

## Description

Octave noise (also known as fractal noise) combines multiple layers of Perlin noise to create more detailed and natural-looking patterns. Each octave:

1. Has double the frequency (more detail) of the previous octave
2. Has its amplitude reduced by the persistence factor

This creates noise with both large-scale features and fine details, similar to natural phenomena like terrain, clouds, or textures.

The parameters work as follows:
- Higher `octaves` values create more detailed noise but are more computationally expensive
- Lower `persistence` values create smoother noise with subtle details
- Higher `persistence` values create rougher noise with more prominent details

## Examples

### Basic Octave Noise

```javascript
// Generate basic octave noise
x = 0.5
y = 0.5
z = 0.5
octaves = 4
persistence = 0.5

value = octaveNoise(x, y, z, octaves, persistence)
log "Octave noise value: " ++ value
```

### Terrain Generation with Octave Noise

```javascript
// Generate more realistic terrain using octave noise
width = 100
scale = 0.03
octaves = 6
persistence = 0.5

heights = []
for x width (
  // Generate height value between 0 and 1
  height = (octaveNoise(x * scale, 0, 0, octaves, persistence) + 1) / 2
  
  // Scale to desired range (0-30)
  scaledHeight = (height * 30).floor()
  heights.append(scaledHeight)
)

// Render terrain
for x width (
  column = ""
  for y 30 (
    if y >= 30 - heights[x] (
      column = column ++ "#"
    ) else (
      column = column ++ " "
    )
  )
  log column
)
```

### 2D Noise Map with Different Parameters

```javascript
// Compare different octave and persistence values
width = 40
height = 20
scale = 0.1

// Low octaves, low persistence (smooth, few details)
log "Low octaves (2), low persistence (0.3):"
for y height (
  row = ""
  for x width (
    value = octaveNoise(x * scale, y * scale, 0, 2, 0.3)
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

// High octaves, high persistence (rough, many details)
log "High octaves (8), high persistence (0.7):"
for y height (
  row = ""
  for x width (
    value = octaveNoise(x * scale, y * scale, 0, 8, 0.7)
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
```

### Animated Cloud-like Pattern

```javascript
// Animate octave noise over time
mainloop:
  clear()
  time = getTime() * 0.005
  
  for y 20 (
    row = ""
    for x 40 (
      value = octaveNoise(x * 0.1, y * 0.1, time, 4, 0.5)
      normalized = (value + 1) / 2
      
      if normalized < 0.4 (
        row = row ++ " "  // Clear sky
      ) else if normalized < 0.6 (
        row = row ++ "."  // Light cloud
      ) else if normalized < 0.8 (
        row = row ++ "o"  // Medium cloud
      ) else (
        row = row ++ "#"  // Dense cloud
      )
    )
    log row
  )
  
  wait 50
```

## Comparison with Basic Noise

Octave noise differs from basic Perlin noise in several ways:

1. **Detail level**: Octave noise contains both large features and fine details
2. **Complexity**: Octave noise creates more complex, natural-looking patterns
3. **Control**: The octaves and persistence parameters allow fine-tuning of the noise characteristics
4. **Performance**: Octave noise is more computationally expensive due to calculating multiple layers

## Notes

- Typical values for `octaves` range from 1 to 8 (higher values are more expensive)
- Typical values for `persistence` range from 0.25 to 0.75
- Each additional octave doubles the computational cost
- For real-time applications, use fewer octaves (1-4)
- For pre-generated content, higher octave counts (4-8) create more detailed results 