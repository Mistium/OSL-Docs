# Mouse Cursor

## Cursor Styles

In originOS scripting, the cursor commands allow you to control the appearance and behavior of the cursor within the graphical user interface. The cursor can represent different states or styles, enhancing the user experience. Here are the available cursor commands:

### Basic Cursor Styles

<table><thead><tr><th width="128">Name</th><th width="245">Code</th><th>Use</th><th>Typical Appearance</th></tr></thead><tbody><tr><td>Default</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "default"
</code></pre></td><td>Resets the cursor to its standard appearance.</td><td>An arrow</td></tr><tr><td>Pointer</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "pointer"
</code></pre></td><td>Ideal for UI elements like buttons or links.</td><td>A hand pointing </td></tr><tr><td>Move</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "move"
</code></pre></td><td>Useful when dragging elements within the interface.</td><td>A cross with the ends being arrows</td></tr><tr><td>Grah</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "grab"
</code></pre></td><td>Enhances the visual feedback during drag-and-drop interactions.</td><td>A hand about to grab something</td></tr><tr><td>Grabbing</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "grabbing"
</code></pre></td><td>Provides real-time feedback during dragging operations.</td><td>A grabbing hand</td></tr><tr><td>Text</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "text"
</code></pre></td><td>Indicates the cursor is ready for text input.</td><td>A capital I with 2 lines at the top and bottom</td></tr><tr><td>Vertical-Text</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "vertical-text"
</code></pre></td><td>Specifies the cursor style for vertical text entry.</td><td>Vertical version of Text</td></tr><tr><td>Wait</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "wait"
</code></pre></td><td>Provides feedback during loading or processing tasks.</td><td>An hourglass or spinning wheel</td></tr><tr><td>Progress</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "progress"
</code></pre></td><td>Conveys a sense of progress or loading.</td><td>A wait icon to the bottom right of the cursor</td></tr></tbody></table>

### Extended Cursor Styles

<table><thead><tr><th width="119">Name</th><th width="282">Code</th><th>Use</th><th>Typical Appearance</th></tr></thead><tbody><tr><td>Help</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "help"
</code></pre></td><td>Suggests that additional information is accessible.</td><td>A question mark</td></tr><tr><td>Context Menu</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "context-menu"
</code></pre></td><td>Provides visual feedback for right-click or context menu interactions.</td><td>Shows a context menu is available</td></tr><tr><td>Zoom in</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "zoom-in"
</code></pre></td><td>Used for interfaces where zooming in is a supported action.</td><td>A magnifying glass with a +</td></tr><tr><td>Zoom out</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "zoom-in"
</code></pre></td><td>Used for interfaces where zooming out is a supported actio</td><td>A magnifying glass with a -</td></tr><tr><td>Crosshair</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "crosshair"
</code></pre></td><td>Provides a visual reference for precise actions.</td><td>A crosshair</td></tr><tr><td>Cell</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "cell"
</code></pre></td><td>Used in spreadsheet-like interfaces for cell selection.</td><td>Similar to a crosshair</td></tr><tr><td>Not Allowed</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "not-allowed"
</code></pre></td><td>Provides a visual cue that a particular action is restricted.</td><td>A red circle wih a line through it</td></tr><tr><td>Copy</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "copy"
</code></pre></td><td>Used in interfaces where copying content is a supported action.</td><td>Shows it can copy</td></tr><tr><td>Alias</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "alias"
</code></pre></td><td>Provides visual feedback for alias-related interactions.</td><td>Shows its an alias</td></tr><tr><td>No Drop</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "no-drop"
</code></pre></td><td>Visualizes that dropping an object in the current location is prohibited.</td><td>A grabbing hand with a not allowed icon</td></tr><tr><td>All Scroll</td><td><pre class="language-javascript"><code class="lang-javascript">cursor "all-scroll"
</code></pre></td><td>Used in interfaces where vertical and horizontal scrolling is supported.</td><td>Similar to the move cursor</td></tr></tbody></table>

### Resizing

{% tabs %}
{% tab title="Row" %}
```javascript
cursor "row-resize"
```
{% endtab %}

{% tab title="Column" %}
```javascript
cursor "col-resize"
```
{% endtab %}

{% tab title="Cardinal Directions" %}
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

```javascript
cursor "lock"
```

## Unlock

* Unlocks the cursor, allowing it to move freely again.
* **Use Case:** Used to release the cursor from a locked state.

```javascript
cursor "unlock"
```

## Hide

* Hides the cursor from view.
* **Use Case:** Often used during specific UI interactions where the cursor's visibility is not required.

```javascript
cursor "hide"
```

Now you have a comprehensive set of cursor commands to enhance the visual feedback and user interactions in your originOS applications. Choose the appropriate cursor styles and commands based on the specific context and requirements of your interface or game.
