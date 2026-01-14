# Interacting with elements

Once an element has been drawn it sets multiple parts of global state that can then be read by the osl program. These are predominantly focused on the mouse pointer.

<table><thead><tr><th width="244.929931640625"></th><th></th></tr></thead><tbody><tr><td>mouse_touching</td><td>this is a boolean of if the mouse is over the current element</td></tr><tr><td>clicked</td><td>this is a boolean of if mouse_touching is true and the left mouse button is held.</td></tr><tr><td>onclick</td><td>this is a boolean of if mouse_touching is true and is only true on the first frame of the left mouse button being clicked</td></tr><tr><td>mouse_x</td><td>this is a number of the x position of the mouse normalised to the current rendering context's origin point</td></tr><tr><td>mouse_y</td><td>this is a number of the y position of the mouse normalised to the current rendering context's origin point</td></tr></tbody></table>

### Examples

Here is how you would use `onclick` . All other state variables are used in very similar ways.

```js
// draw a white square
square 100 100 : c#fff

// check if the square is clicked
if onclick (
  log "i was clicked!"
  // this only fires when the user clicks the square
)
```

You can also make a square that goes to the mouse pointer using the [goto-x-y.md](draw-cursor/goto-x-y.md "mention") command

```javascript
// go to the mouse pointer's position
goto mouse_x mouse_y
// draw a white square
square 100 100 : c#fff
```

You can use mouse\_touching to do hover effects

```javascript
// draw a white square
square 100 100 : c#fff
// check if the user is hovering over this square
if mouse_touching (
  // draw a red square ontop if the user is
  square 100 100 : c#f000
)
```
