# goto x y

## Description

Goto moves the draw cursor to a certain position on the window

## Parameters

Goto takes an x and a y value for it to move the draw cursor to

## Usage

{% code overflow="wrap" %}
```javascript
goto 100 100

goto -100 -100

goto 0 0
// 0 0 is centered on the window


goto window.left window.top
change 20 -20
// can also be used in conjunction with the window object to anchor elements to specific sides of the window
```
{% endcode %}

[the-window-system.md](../../../environment/the-window-system.md "mention")
