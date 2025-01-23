# ICN (Icon) System

## Description

ICN is a vector-based icon description language that's fundamental to originOS. It provides a simple and intuitive way to create vector graphics and dynamic icons. The ICN language supports both static and dynamic icons, with a straightforward syntax for drawing shapes, lines, and creating interactive elements.

## Basic Concepts

### Static vs Dynamic Icons

- **Static Icons**: Regular ICN files that describe fixed vector graphics
- **Dynamic Icons**: Icons marked with `@dynamic` that can respond to variables and conditions

### Color and Style

- Colors are set using the `c` command with hexadecimal values
- Line weights are controlled using the `w` command
- Both affect all subsequent drawing operations until changed

### Coordinate System

- Uses a standard coordinate system with (0,0) at the center
- Positive x extends right, negative x extends left
- Positive y extends up, negative y extends down

## File Format

ICN files use a simple text format with one command per line. For dynamic icons, the first line must be `@dynamic`.

```javascript
// Static icon example
c #fff
w 2
line 10 10 -10 -10

// Dynamic icon example
@dynamic
c #fff
$value > 50 (
    line 10 10 -10 -10
)
```

## Integration

ICN files can be used in projects by utilizing the ICN3 Renderer, available at:
https://github.com/Mistium/Origin-OS/blob/main/VersionsSource/Systems/ICN3%20Renderer.sb3 