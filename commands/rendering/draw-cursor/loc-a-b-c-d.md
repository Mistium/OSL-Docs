# loc a b c d

## Description

Loc positions the draw cursor relative to the window width, height, and then offsets it.

Loc is more complicated and confusing / unreadable so its not recommended for osl beginners.

## Parameters

Loc takes 4 parameters.

## Usage

```javascript
loc 2 2 20 -20

// is identical to

goto window.width / -2 window.height / 2
change 20 -20
```

```javascript
loc a b c d

// is

goto window.width / -a window.height / b
change c d
```

```javascript
loc 2 2 0 0
// top left

loc -2 2 0 0
// top right

loc 2 -2 0 0
// bottom left

loc -2 -2 0 0
// bottom right
```

```javascript
// this can easily be replaced with
goto window.left window.top
```
