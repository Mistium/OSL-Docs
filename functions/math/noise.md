# noise(x, y, z)

The `noise()` function generates coherent pseudo-random values using Perlin noise. It takes up to three coordinates and returns a value between -1 and 1, creating smooth transitions between adjacent coordinates.

## Syntax

```javascript
noise(x)
noise(x, y)
noise(x, y, z)
```

## Parameters

* `x` - The x-coordinate in the noise space
* `y` (optional) - The y-coordinate in the noise space
* `z` (optional) - The z-coordinate in the noise space

## Return Value

A number between -1 and 1, representing the noise value at the given coordinates.

## Description

Perlin noise is a type of gradient noise that produces natural-looking random patterns. Unlike pure random values, Perlin noise creates smooth transitions between values, making it ideal for:

* Generating terrain
* Creating natural-looking textures
* Simulating organic movement
* Procedural content generation

The function can be called with one, two, or three parameters to generate 1D, 2D, or 3D noise respectively.

## Examples

### 1D Noise

```javascript
// Generate 1D noise
for i 10 (
  value = noise(i * 0.1, 0, 0)
  // Using ++ for string concatenation without spaces
  log "Noise at " ++ i ++ ": " ++ value
)
```

### 2D Animated noise map

```javascript
width = 50
height = 50
scale = 0.1

// Generate a 2D noise map
def generateNoiseMap(x2, y2) (
  local output = []
  for y height (
    local row = []
    for x width (
      // Get noise value between -1 and 1
      value = noise(x + x2 * scale, y + y2 * scale, 0)
      
      // Convert to a value between 0 and 1
      normalized = (value + 1) / 2
      
      // Convert to a value from 0 to 7
      // Round the value
      // Make it a string and repeat it 3 times
      hex = round(normalized * 7).toStr() * 3
      
      // append a new icn to the grid array
      void row.append("w 20 c #" ++ hex ++ " dot 0 0")
    )
    // append the row
    void output.append(row)
  )
  return output
)

mainloop:

// render the icon grid
icongrid 10 10 width height generateNoiseMap(round(timer * 10), round(timer * 10))

// import the default window buttons
import "win-buttons"
```

## Notes

* The same input coordinates will always produce the same output value
* Small changes in input produce small changes in output (coherence)
* For best results, use small increments between coordinates (0.01-0.1)
* The function is deterministic - same seed produces same sequence
* Combine with different scales for more complex patterns
