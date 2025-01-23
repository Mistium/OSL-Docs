# Pen

## Description

The pen commands allow you to draw various types of lines on the screen. The pen can be configured with different properties like size, opacity, and brightness.

## Pen Commands

### Pen State

```javascript
pen "down"
// Start drawing - subsequent movements will create lines

pen "up"
// Stop drawing - subsequent movements won't create lines
```

### Pen Properties

```javascript
pen "size" 3
// Set line thickness in pixels

pen "opacity" 75
// Set line opacity (0-100)

pen "brightness" 100
// Set line brightness (0-100)
```

## Line Drawing Commands

### Basic Line

Draws a straight line between two points.

```javascript
c #fff
pen "size" 3
// Set color and line thickness

goto 0 0
line 50 0 -50 -50
// Draws a line from (50,0) to (-50,-50)
```

![Basic Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/eb85a230-6307-4edc-8604-d6ca34a9d64e)

### Dotted Line

Creates a line made up of evenly spaced dots.

```javascript
c #fff
pen "size" 3
// Set color and dot size

goto 0 0
dots -100 -100 100 100 30
// Parameters: startX startY endX endY numberOfDots
```

![Dotted Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/b266c1c5-3b76-4de3-b979-1e87cdebcbac)

### Striped Line

Creates a dashed line with configurable segment length and spacing.

```javascript
c #fff
pen "size" 3
// Set color and line thickness

goto 0 0
stripe -100 100 100 -100 10 5
// Parameters: startX startY endX endY numberOfSegments gapSize
```

![Striped Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/9dc9b7d2-adda-478b-9a31-3fbc80323e45)

## Command Reference

### line x1 y1 x2 y2
Draws a solid line from point (x1,y1) to (x2,y2)

### dots x1 y1 x2 y2 count
Draws a dotted line from (x1,y1) to (x2,y2) with specified number of dots

### stripe x1 y1 x2 y2 segments gap
Draws a dashed line from (x1,y1) to (x2,y2) with specified number of segments and gap size

## Important Notes

- Always set color (`c`) and pen size before drawing
- Use `goto` to position the pen before drawing
- Pen properties (size, opacity, brightness) affect all subsequent drawing operations
- The coordinate system is centered (0,0 is in the middle of the window)
- Positive Y is up, negative Y is down
- Import "win-buttons" to show window controls when needed
