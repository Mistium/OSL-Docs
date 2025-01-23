# Triangle

## Description

The `triangle` command draws a triangle by specifying three vertices and a border weight. The triangle is positioned relative to the current draw cursor position.

## Syntax

```javascript
triangle point1_x point1_y point2_x point2_y point3_x point3_y border_weight
```

## Parameters

- `point1_x`: x-coordinate of the first vertex
- `point1_y`: y-coordinate of the first vertex
- `point2_x`: x-coordinate of the second vertex
- `point2_y`: y-coordinate of the second vertex
- `point3_x`: x-coordinate of the third vertex
- `point3_y`: y-coordinate of the third vertex
- `border_weight`: Thickness of the triangle's border in pixels

## Usage Examples

```javascript
// Basic triangle
c #fff
goto 100 100
triangle 0 0 50 50 0 100 2
// Creates a right triangle at (100,100)

// Equilateral triangle
c #00ff00
goto 200 200
triangle -50 43 50 43 0 -43 3
// Creates an equilateral triangle centered at (200,200)

// Arrow pointer
c #ff0000
goto 150 150
triangle 0 -25 25 25 -25 25 1
// Creates a triangle pointing upward
```

## Important Notes

- Triangle vertices are positioned relative to the draw cursor position
- The triangle is drawn using the current color (set with the `c` command)
- Triangles are non-interactive visual elements (not clickable)
- Border weight affects the thickness of all triangle edges
- Coordinates can be negative to draw relative to the cursor position
- The triangle is filled with the current color
- Order of vertices determines the triangle's orientation 