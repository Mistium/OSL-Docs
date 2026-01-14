# Modifiers

## Description

Modifiers in OSL allow for dynamic adjustments to UI elements' properties such as color, position, and size. They provide a flexible way to customize the appearance and behavior of UI elements based on different conditions.

## Syntax

```javascript
command : modifier1 modifier2 modifier3
```

Modifiers are appended after a colon (`:`) following a command. Multiple modifiers can be chained together.

## Common Modifiers

### Color Modifiers

- `c#hexcode`: Sets the color of the element
- `hover_c#hexcode`: Sets the color when the element is hovered

Example:
```javascript
square 100 100 2 : c#ff0000 hover_c#00ff00
// Red square that turns green on hover
```

### Position Modifiers

- `chx#value`: Changes the X position by the specified amount
- `chy#value`: Changes the Y position by the specified amount

Example:
```javascript
text "Hello" 16 : chx#50 chy#-30
// Text shifted 50 pixels right and 30 pixels up
```

### Size Modifiers

- `hover_size#scale`: Adjusts the element's size on hover (1.0 is normal size)

Example:
```javascript
image "image.png" 120 : hover_size#1.2
// Image grows to 120% size on hover
```

## Combined Usage

Modifiers can be combined to create complex behaviors:

```javascript
// Square with multiple modifiers
square 50 50 1 : c#336699 chx#20 chy#-10 hover_c#ff9900 hover_size#1.1

// Interactive button with hover effects
button "Click me" : c#fff hover_c#00ff00 hover_size#1.1

// Image with position and hover effects
image "icon.png" 64 : chx#10 chy#10 hover_size#1.2 hover_c#ff0000
```

## Important Notes

- Modifiers are processed in order from left to right
- Color modifiers affect the entire element
- Position modifiers are relative to the original position
- Hover modifiers only take effect when the mouse is over the element
- Multiple modifiers of the same type will use the last one specified
