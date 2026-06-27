# Modifiers

## Description

Modifiers can be appended to rendering commands after a colon. Current OSL
supports modifiers for draw color and relative cursor movement.

## Syntax

```javascript
command : modifier1 modifier2 modifier3
```

Multiple modifiers can be chained together.

## Supported Modifiers

### Color

`c#hexcode` sets the color used for the command.

```javascript
square 100 100 2 : c#ff0000
// Red square
```

### Relative Position

`chx#value` changes the X position before drawing. `chy#value` changes the Y
position before drawing.

```javascript
text "Hello" 16 : chx#50 chy#-30
// Text shifted 50 pixels right and 30 pixels up
```

## Combined Usage

Modifiers are processed left to right.

```javascript
square 50 50 1 : c#336699 chx#20 chy#-10
image "icon.png" 64 : chx#10 chy#10
```

## Important Notes

- Color modifiers affect the current command.
- Position modifiers are relative to the draw cursor.
- Hover, size and button modifiers were part of older originOS rendering docs and
  are not supported by the current compiler.
