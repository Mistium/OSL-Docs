# Text

## Command

```javascript
text "text-to-draw" size
```

## Parameters

### `text-to-draw`

The text string to display.

### `size`

The size of the text.

## Description

The `text` command displays the given text at the current cursor position, applying the specified size for rendering.

## Example

```js
text "Hello, World!" 16
// Renders the text "Hello, World!" at the current draw cursor position with a font size of 16
```

## Centering text

The `centext` command works similarly to `text`, but centers the text on the
current draw cursor position.

```javascript
centext "hello world" 10
```
