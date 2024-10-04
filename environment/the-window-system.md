# The Window System

### Important

OSL applications are all run as windows, even scripts, everything is a window.

Each file only has access to a single window and acts as only one window

If you want to do almost anything with the window in osl you will more than likely need to use either the window commands or the newer, window object

## Showing the window

```js
window "show"
// Shows the window (allowing the user to move/drag and resize the window by default)

window "hide"
// Hides the window, stopping all user interaction that is handled by origin
```

If a window is hidden and lacks a "mainloop:" label, it will be closed by origin when the program finishes execution.

## Modifying the window

You can modify the parameters of your osl window in origin such as disabling resizing, moving, and changing the dimensions of your window.

### **Window Position**

```js
window "x" x
window "y" y
// set the x and y of the window

window.x = x
window.y = y
// equivalent as cleaner syntax

window "goto" x y
// make the window goto an x y position
```

### **Window Size**

```js
window "resizable" true/false
// enables and disables the window from being resized by the user

window "width" width
window "height" height
// set the width and height of the window

window.width = width
window.height = height
// equivalent as cleaner syntax

window "dimensions" width height
// set the width and height of the window
```

### Closing the window and execution control

```js
window "stop"
// this instantly closes the window and stops all code execution

exit "exit code"
// Ends the current cycle with a chosen exit code, if the program is hidden and 
// doesn't have a mainloop: it will be closed, otherwise it will jump to the end 
// of the script and start from the beginning next frame

window "responsive" true/false
// this disables origin's application sleep mode for this window, allowing you to continue running code even when the window is not in focus
// this may affect system performance depending on what code you are running
```

### Extra

If your window is hidden and you are rendering things, they may leave a trail behind, so when you move the thing you are rendering and need to clear the screen, use

```js
window "redraw_bg"
// this redraws the background behind your app
```

### Get data from your window

You can access data about the window using the `window` variable. It is a json object and is writable.

```js
log window.width
// get the width property from the window

window.width = 1000
// equivalent to
// window "width" 1000

log window_width
// window_width is a legacy variable

log window.height
// the window's height in pixels
```

## Create a new window

```javascript
window "add" window.file.uuid "data"
// the data is what that window receives in the variable "passed_data"
// window.file.uuid returns the uud of the file that this window is made from, essentially making an exact duplicate window
```

## All endpoints on the window variable

### **Parents and Children**

```js
window.parent.id
// returns the window id of the window that created this window
// this key is not a direct reference to the parent id and changing it will not edit the parent id

window.parent.permissions
// the permissions of the window that created this window
// this key is not a direct reference to the parent permissions and changing it will not edit the parent permissions

window.parent.name
// the name of the window that created this window
// this key is not a direct reference to the parent name and changing it will not edit the parent name

window.children
// returns an array of the ids of windows that this window has created
// this key is not a direct reference to the window children and changing it will only affect your program
```

### **File and code data**

```js
window.code
// returns the fully compiled code of the window (this is an array)
// this key is not a direct reference to the window code and changing it will not edit the code

window.permissions
// returns the permissions of the current window as an array
// example: ["file admin","camera"]
// this key is only a copy of the window permissions
// it will not edit the actual permissions if you change this

window.file.uuid
// returns the uuid that leads to the file that controls this window

window.file.code
// this data is an array
// returns the current uncompiled code that is running

window.drop_location
// this data is settable
// allows you to set the folder that a file will be moved to when it is dropped onto this window
```

### **Window Location**

```js
window.top
// returns window.height / 2
// this is only a reference to the maths above, setting it will only persist for one cycle

window.bottom
// returns window.height / -2
// this is only a reference to the maths above, setting it will only persist for one cycle

window.left
// returns window.width / -2
// this is only a reference to the maths above, setting it will only persist for one cycle

window.right
// returns window.width / 2
// this is only a reference to the maths above, setting it will only persist for one cycle

window.width
// returns the width of the window
// This is settable

window.height
// returns the height of the window
// This is settable
```

### **Window Execution**

```js
window.renderexec
// a boolean that enables or disables the window osl script running when hovered over with the mouse and not focused
// this is settable

window.framerate
// the fps that the window wants to be run at
// clamped between 10 and 250
// this is settable
```

## Accent Colour

You can set the outline of your window using the window\_accent variable

```js
window_accent = #fff
// this sets the accent of the window
```

![Screenshot 2024-07-04 at 18 41 04](https://github.com/Mistium/Origin-OS/assets/92952823/b6759e77-d5e8-47f4-bd84-51170a0954f6)

## Minimised Text

You can change the text it shows when a window is minimised using the minimised\_text variable

```js
minimised_text = "shown"
// this has a maximum length of 6
```

![Screenshot 2024-07-04 at 18 42 27](https://github.com/Mistium/Origin-OS/assets/92952823/435128f0-71fd-4b5c-a725-0ae50fab96f9)
