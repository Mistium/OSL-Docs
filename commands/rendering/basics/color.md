# Color Commands

## Description

The color commands set the current color for all subsequent UI elements. OSL provides three equivalent commands for setting colors: `colour`, `color`, and `c`. All three commands function identically, allowing you to use whichever spelling you prefer.

## Syntax

```javascript
colour #hexcode
color #hexcode
c #hexcode
```

## Parameters

- `#hexcode`: A hexadecimal color code (e.g., #3498db) or single-value RGB color

## Usage Examples

```javascript
// Using different command variations
colour #3498db  // Dodger blue
color #3498db   // Same color, different spelling
c #3498db      // Shorthand version

// Using colors with UI elements
c #ff0000      // Red
rectangle 100 100 50 50

c #00ff00      // Green
text "Colored text"

// RGB color values
c #fff         // White (shorthand)
c #000000      // Black (full notation)
c #7f7f7f      // Gray

// Using colors in a drawing
c #f1c40f      // Yellow
rectangle 0 0 100 100
c #e74c3c      // Red
circle 50 50 30
c #3498db      // Blue
text "Hello, World!"
```

## Important Notes

- The color remains active until changed by another color command
- Supports both full (#RRGGBB) and shorthand (#RGB) hexadecimal notation
- Color affects all subsequent drawing operations
- The three command variations (`colour`, `color`, `c`) are completely interchangeable
- Colors are case-insensitive (#FFF is the same as #fff)
- Invalid color codes will be ignored
- The default color is white (#FFFFFF) if no color is set 