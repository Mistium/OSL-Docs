# Text

## **Command:**&#x20;

```javascript
text "text-to-draw" size
```

## **Parameters:**

### size:

Specifies the size of the text to be rendered.

### text-to-draw:&#x20;

The text string that needs to be displayed.

## **Description:**

The `text` command displays the given text at the current cursor position, applying the specified size for rendering.

### **Example:**

```js
text "Hello, World!" 16
// Renders the text "Hello, World!" at the current draw cursor position with a font size of 16
```

### Explanation:

In this example, the text "Hello, World!" is rendered at the current draw cursor position with a font size of 16. The `text` command allows for direct rendering of text strings on the screen.

## Centering text

### Centering Text

The `centext` command works similarly to the `text` command, but with the added functionality of centering the text on the draw cursor position. This command is beneficial for aligning text centrally within the UI component or screen area, ensuring a balanced and aesthetically pleasing visual arrangement. Like the `text` command, it allows for customization of font size and style.

```javascript
centext "hello world" 10
```

## Using the Font System

### Changing Line Height

The line height can be adjusted using the `configtext` command with the `lineheight` parameter. The default line height is 23.

#### **Example:**

```javascript
configtext "lineheight" 23
// Sets the line height to 23
```

### Changing Character Spacing

The space between characters can be adjusted as a multiple of the size of the text using the `configtext` command with the `spacing` parameter.

**Example:**

```javascript
configtext "spacing" 1
// Sets the spacing between characters to 1 times the size of the text
```

### Selecting a Font

To select a font to use, use the `configtext` command with the `usefont` parameter and specify the font name.

**Example:**

```javascript
configtext "usefont" "Llama"
// Selects the "Llama" font for text rendering
```

### Loading a Font from a URL

To load a font from a URL, use the `configtext` command with the `importfont` parameter, specifying the font name and URL.

**Example:**

```js
configtext "importfont" "CustomFont" "https://example.com/fonts/customfont.ojff"
// Loads the "CustomFont" from the specified URL
```

### Reverting to Default Font

To revert to the default font, use the `configtext` command with the `usedefault` parameter.

**Example:**

```js
configtext "usedefault"
// Reverts to the default font
```

### Practical Examples

#### **Rendering Text with Custom Font Size**

To render text with a custom font size of 20:

```js
text "Welcome to the system!" 20
// Renders the text "Welcome to the system!" with a font size of 20
```

#### **Adjusting Line Height and Character Spacing**

To set the line height to 30 and character spacing to 1.5 times the size of the text:

```js
configtext "lineheight" 1.5
configtext "spacing" 1.5
// Sets the line height to 1.5x normal and character spacing to 1.5x the size of the text
```

#### **Using a Custom Font**

To use a custom font named "Roboto":

```js
configtext "usefont" "Llama"
// Selects the "Llama" font for text rendering
```

#### **Loading and Using a Font from a URL**

To load a font from a URL and use it for rendering text:

```js
configtext "importfont" "CoolFont" "https://example.com/fonts/coolfont.ojff"
configtext "usefont" "CoolFont"
// Loads the "CoolFont" from the specified URL and selects it for text rendering
```
