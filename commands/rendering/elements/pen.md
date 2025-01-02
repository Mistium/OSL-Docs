# Pen

## Drawing Lines in OSL

### Basics

#### Setting Pen States

*   **Pen Down**: Activates the pen to draw when moving.

    ```js
    pen "down"
    ```
*   **Pen Up**: Deactivates the pen, so movement doesn’t draw.

    ```js
    pen "up"
    ```

#### Customizing the Pen

*   **Size**: Sets the pen’s thickness.

    ```js
    pen "size" [int]
    // Example: pen "size" 3
    ```
*   **Opacity**: Adjusts the line’s transparency (0-100).

    ```js
    pen "opacity" [0-100]
    // Example: pen "opacity" 80
    ```
*   **Brightness**: Controls the line’s brightness (0-100).

    ```js
    pen "brightness" [0-100]
    // Example: pen "brightness" 90
    ```

***

### Rendering Lines

#### Basic Line

Draws a simple straight line.

```js
c #fff  
pen "size" 3  
// Set the line color to white and size to 3.

goto 0 0  
line 50 0 -50 -50  
// Draw a line centered at (0, 0), starting at (50, 0) and ending at (-50, -50).

import "win-buttons"  
// Import the system's window buttons.
```

**Output**:\
![Basic Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/eb85a230-6307-4edc-8604-d6ca34a9d64e)

***

#### Dotted Line

Creates a line made of dots.

```js
c #fff  
pen "size" 3  
// Set the dotted line color to white and size to 3.

goto 0 0  
dots -100 -100 100 100 30  
// Draw a dotted line from (-100, -100) to (100, 100) with 30 evenly spaced dots.

import "win-buttons"  
// Import the system's window buttons.
```

**Output**:\
![Dotted Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/b266c1c5-3b76-4de3-b979-1e87cdebcbac)

***

#### Striped Line

Creates a line made of alternating segments.

```js
c #fff  
pen "size" 3  
// Set the striped line color to white and size to 3.

goto 0 0  
stripe -100 100 100 -100 10 5  
// Draw a striped line from (-100, 100) to (100, -100) with 10 segments and 5 units of spacing between them.

import "win-buttons"  
// Import the system's window buttons.
```

**Output**:\
![Striped Line Example](https://github.com/Mistium/Origin-OS/assets/92952823/9dc9b7d2-adda-478b-9a31-3fbc80323e45)
