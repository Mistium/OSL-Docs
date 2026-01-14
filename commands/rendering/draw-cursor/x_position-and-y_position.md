# x\_position and y\_position

In OSL you can also read the position of the draw cursor as x and y co-ordinates. They are normalised to the center of the current frame/window based on the current context that the draw cursor is acting in.

```javascript
set_x 0
change_x 10
log x_position
// 10
```

This allows you to save the position of the cursor to return to later, for example:

```javascript
// go somewhere random
goto random(-100, 100) random(-100, 100)
// save the random position
x = x_position
y = y_position

// go somewhere random
goto random(-100, 100) random(-100, 100)
// return to the original position
goto x y
```

These variables are accessible in every context and cannot be overwritten with other data.

| x\_position | returns the current position of the draw cursor on the x axis |
| ----------- | ------------------------------------------------------------- |
| y\_position | returns the current position of the draw cursor on the y axis |
