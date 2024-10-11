# Basics

## Script Execution

In osl all rendering is done at runtime, during program execution. If you draw an image and then set a variable, the script will wait for the ui to be rendered before it then moves onto the next task. An example is below for how this allows you to run scripts based off of real time ui information.

```javascript
square 100 100 10
// render a square with width 100 height 100 and rounding of 10
if onclick (
  // runs code only when the square is clicked
)

// continue your code somewhere else
```

This means that osl code handles all scripting and rendering simultaneously.

This also means that the order that you render elements also determines what elements are rendered on-top of other elements, since if you render an element last it will be rendered right at the front of the window.

## The Draw Cursor

In osl, the next rendered ui element will always be positioned at "the draw cursor" which is a set of x y values that define where the system should render the next element. You can change and set these using draw cursor commands, as shown below.

```javascript
goto 0 0

change_x 10

change_y -10
```
