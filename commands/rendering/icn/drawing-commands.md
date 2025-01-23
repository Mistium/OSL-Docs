# ICN Drawing Commands

## Line Commands

### line
Draws a line between two points.
```javascript
line x1 y1 x2 y2
```
Example:
```javascript
line 10 10 -10 -10  // Draws a diagonal line
```

### cont
Continues a line from the last point of the previous line.
```javascript
cont x y
```
Example:
```javascript
line 10 10 -10 -10
cont 10 -10  // Continues from (-10, -10) to (10, -10)
```

## Style Commands

### c (color)
Sets the color for subsequent drawing operations.
```javascript
c #hexcode
```
Example:
```javascript
c #fff  // Sets color to white
c #ff0000  // Sets color to red
```

### w (weight)
Sets the line weight for subsequent drawing operations.
```javascript
w number
```
Example:
```javascript
w 2  // Sets line weight to 2 pixels
```

## Shape Commands

### square
Draws a square outline at the specified position.
```javascript
square x y width height
```
Example:
```javascript
square 0 0 20 20  // Draws a 20x20 square centered at origin
```

### dot
Draws a single dot at the specified position.
```javascript
dot x y
```
Example:
```javascript
dot 15 15  // Draws a dot at (15, 15)
```

### cutcircle
Draws a partial circle outline.
```javascript
cutcircle x y size angle filled
```
Parameters:
- x, y: Center position
- size: Radius
- angle: Rotation (0-36)
- filled: Arc length in degrees (0-360)

Example:
```javascript
cutcircle 0 0 10 0 180  // Draws a semicircle
```

### ellipse
Draws an ellipse.
```javascript
ellipse x y width height_multiplier direction
```
Parameters:
- x, y: Center position
- width: Base width
- height_multiplier: Height relative to width
- direction: Rotation angle

Example:
```javascript
ellipse 0 0 20 1.5 45  // Draws a rotated ellipse
``` 