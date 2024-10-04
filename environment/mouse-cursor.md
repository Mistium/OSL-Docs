# Mouse Cursor

## Cursor Styles

In originOS scripting, the cursor commands allow you to control the appearance and behavior of the cursor within the graphical user interface. The cursor can represent different states or styles, enhancing the user experience. Here are the available cursor commands:

### Basic Cursor Styles

{% tabs %}
{% tab title="Default" %}
Sets the cursor to the default style, typically an arrow.\
**Use Case:** Resets the cursor to its standard appearance.

```
cursor "default"
```
{% endtab %}

{% tab title="Pointer" %}
Sets the cursor to a pointer style, indicating that an element is clickable or interactive.\
**Use Case:** Ideal for UI elements like buttons or links.

```
cursor "pointer"
```
{% endtab %}

{% tab title="Move" %}
Indicates that the cursor is in move mode, allowing users to drag or move elements.\
**Use Case:** Useful when dragging elements within the interface.

```osl
cursor "move"
```
{% endtab %}

{% tab title="Grab" %}
Sets the cursor to a grabbing hand, indicating the intention to grab or move an object.\
**Use Case:** Enhances the visual feedback during drag-and-drop interactions.

```osl
cursor "grab"
```
{% endtab %}

{% tab title="Grabbing" %}
Displays a grabbing hand, indicating an active grab or move action.\
**Use Case:** Provides real-time feedback during dragging operations.

```osl
cursor "grabbing"
```
{% endtab %}

{% tab title="Text" %}
Sets the cursor to a text input style, typically a vertical I-beam.\
**Use Case:** Indicates the cursor is ready for text input.

```osl
cursor "text"
```
{% endtab %}

{% tab title="Vertical Text" %}
Sets the cursor to a vertical text input style, useful for vertical text input areas.\
**Use Case:** Specifies the cursor style for vertical text entry.

```osl
cursor "vertical-text"
```
{% endtab %}

{% tab title="Wait" %}
Displays an hourglass or spinning wheel, indicating that the system is processing.\
**Use Case:** Provides feedback during loading or processing tasks.

```osl
cursor "wait"
```
{% endtab %}

{% tab title="Progress" %}
Sets the cursor to a spinning wheel or hourglass, indicating that a process is ongoing.\
**Use Case:** Conveys a sense of progress or loading.

```osl
cursor "progress"
```
{% endtab %}
{% endtabs %}

### Extended Cursor Styles

{% tabs %}
{% tab title="Help" %}
Displays a question mark, indicating that help or information is available.\
**Use Case:** Suggests that additional information is accessible.

```
cursor "help"
```
{% endtab %}

{% tab title="Context Menu" %}
Sets the cursor to a context menu style, indicating that a context menu is available.\
**Use Case:** Provides visual feedback for right-click or context menu interactions.

```
cursor "context-menu"
```
{% endtab %}

{% tab title="Zoom In" %}
Indicates that the cursor is in zoom-in mode, suggesting the ability to zoom in.\
**Use Case:** Used for interfaces where zooming in is a supported action.

```osl
cursor "zoom-in"
```
{% endtab %}

{% tab title="Zoom Out" %}
Indicates that the cursor is in zoom-out mode, suggesting the ability to zoom out.\
**Use Case:** Used for interfaces where zooming out is a supported action.

```osl
cursor "zoom-out"
```
{% endtab %}

{% tab title="Crosshair" %}
Sets the cursor to a crosshair, often used for precision targeting or drawing applications.\
**Use Case:** Provides a visual reference for precise actions.

```osl
cursor "crosshair"
```
{% endtab %}

{% tab title="Cell" %}
Displays a cell or box, indicating a selection or highlighting a specific area.\
**Use Case:** Used in spreadsheet-like interfaces for cell selection.

```osl
cursor "cell"
```
{% endtab %}

{% tab title="Not Allowed" %}
Displays a circle with a line through it, indicating that the action is not allowed.\
**Use Case:** Provides a visual cue that a particular action is restricted.

```osl
cursor "not-allowed"
```
{% endtab %}

{% tab title="Copy" %}
Sets the cursor to a copy style, indicating the ability to copy content.\
**Use Case:** Used in interfaces where copying content is a supported action.

```osl
cursor "copy"
```
{% endtab %}

{% tab title="Alias" %}
Displays an alias symbol, suggesting an alias or alternative representation.\
**Use Case:** Provides visual feedback for alias-related interactions.

```osl
cursor "alias"
```
{% endtab %}

{% tab title="No Drop" %}
Indicates that dropping is not allowed, often displayed during drag-and-drop operations.\
**Use Case:** Visualizes that dropping an object in the current location is prohibited.

```
cursor "no-drop"
```
{% endtab %}

{% tab title="All Scroll" %}
Sets the cursor to an all-scroll style, suggesting that the entire content can be scrolled.\
**Use Case:** Used in interfaces where vertical and horizontal scrolling is supported.

```
cursor "all-scroll"
```
{% endtab %}

{% tab title="Resize" %}
## Resize a row

```
cursor "row-resize"
```

## Resize a column

```
cursor "col-resize"
```

## Resize Cardinal Directions

```javascript
// single direction
cursor "n-resize" // up
cursor "e-resize" // right
cursor "s-resize" // bottom
cursor "w-resize" // left

// two ways
cursor "ew-resize" // left right
cursor "ns-resize" // up down

// diagonals
cursor "ne-resize" // right up
cursor "nw-resize" // left up
cursor "se-resize" // right down
cursor "sw-resize" // left down

// two way diagonals
cursor "nesw-resize" // right up, left down
cursor "nwse-resize" // left up, right down
```
{% endtab %}
{% endtabs %}

## Lock

* Locks the cursor, preventing it from moving freely across the screen.
* **Use Case:** Useful when you want to restrict cursor movement during specific UI interactions or gameplay elements.

```osl
cursor "lock"
```

## Unlock

* Unlocks the cursor, allowing it to move freely again.
* **Use Case:** Used to release the cursor from a locked state.

```osl
cursor "unlock"
```

## Hide

* Hides the cursor from view.
* **Use Case:** Often used during specific UI interactions where the cursor's visibility is not required.

```osl
cursor "hide"
```

Now you have a comprehensive set of cursor commands to enhance the visual feedback and user interactions in your originOS applications. Choose the appropriate cursor styles and commands based on the specific context and requirements of your interface or game.
