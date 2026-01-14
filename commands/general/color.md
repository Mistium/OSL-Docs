# Color Commands

## Description

The color commands set the current color for all subsequent UI elements. OSL provides three equivalent commands for setting colors: `colour`, `color`, and `c`. All three commands function identically, allowing you to use whichever spelling you prefer.

## Syntax

```javascript
colour #hexcode
color #hexcode
c #hexcode

// Or using RGB integer (0-16777215)
colour integer
color integer
c integer
```

## Parameters

- `#hexcode`: A hexadecimal color code (e.g., #3498db) or single-value RGB color
- `integer`: A number between 0 and 16777215 representing RGB color (e.g., 13434829 for #CD1234)

## Usage Examples

```javascript
// Using different command variations with hex codes
colour #3498db  // Dodger blue
color #3498db   // Same color, different spelling
c #3498db      // Shorthand version

// Using RGB integers
c 16711680     // Red (#FF0000)
c 65280        // Green (#00FF00)
c 255          // Blue (#0000FF)
c 16777215     // White (#FFFFFF)
c 0            // Black (#000000)

// Using colors with UI elements
c #ff0000      // Red using hex
square 100 100 10

c 65280        // Green using RGB integer
text "Colored text" 10

// RGB color values in hex
c #fff         // White (shorthand)
c #000000      // Black (full notation)
c #7f7f7f      // Gray

// Using colors in a drawing
c #f1c40f      // Yellow using hex
square 100 100 10
c 15158332     // Red (#E74C3C) using RGB integer
icon "dot 0 0" 10
c #3498db      // Blue using hex
text "Hello, World!" 10
```

## Important Notes

- The color remains active until changed by another color command
- Supports both hex codes and RGB integers:
  - Hex: #RRGGBB or #RGB format
  - Integer: 0-16777215 (represents full RGB color space)
- Color affects all subsequent drawing operations
- The three command variations (`colour`, `color`, `c`) are completely interchangeable
- Hex colors are case-insensitive (#FFF is the same as #fff)
- Invalid color codes or integers outside the valid range will default to black (#000000)
- The default color is white (#FFFFFF or 16777215) if no color is set 