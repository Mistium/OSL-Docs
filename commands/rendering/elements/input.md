# input

## Description

The `input` command renders an input field that users can type text into. The input's value can be accessed through a variable with the prefix `input_` followed by the input's ID.

## Syntax

```javascript
input px-width px-height "input_id" "default_text" border_weight text_colour
```

## Parameters

- `px-width`: Width of the input field in pixels
- `px-height`: Height of the input field in pixels
- `input_id`: Unique identifier for the input (used to access its value)
- `default_text`: Placeholder text shown when input is empty
- `border_weight`: Thickness of the input's border
- `text_colour`: Color of the input text (hex code or color name)

## Usage

```javascript
// Basic input field
input 300 20 "username" "Enter username" 2 #fff
log input_username
// Logs whatever the user has typed in the input

// Password input field (v4.6.4+)
input 300 20 "hidden.password" "Enter password" 2 #fff
log input_password
// Note: "hidden." prefix makes the input mask characters, but
// you still access the value without the "hidden." prefix

// Styling example
input 400 30 "search" "Search..." 5 #00ff00
// Wide input with thick border and green text

// Using input in conditions
input 200 25 "age" "Enter your age" 1 #fff
if input_age == "18" (
    log "You're 18!"
)

// Multiple inputs
input 300 20 "firstname" "First name" 2 #fff
input 300 20 "lastname" "Last name" 2 #fff
log input_firstname ++ " " ++ input_lastname
// Combines first and last name inputs
```

## Important Notes

- Input values are accessed using the `input_` prefix followed by the input's ID
- For password fields, add the `hidden.` prefix to the input_id (v4.6.4+)
- The `hidden.` prefix is only used when creating the input, not when accessing its value
- Input values are always strings; convert to numbers if needed
- Each input should have a unique ID to avoid conflicts 