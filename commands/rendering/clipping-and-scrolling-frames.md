# Clipping And Scrolling (frames)

## Clipping using the frame command

In osl, you can clip elements inside of a defined area using a simple frame

```clike
frame left top right bottom (
  // all content in here is clipped
)
```

Heres an example of the frame command in an application

```javascript
left = -100
// -100x
right = 100
// 100x
top = 100
// 100y
bottom = -100
// -100y

mainloop:

frame left top right bottom (
  square 10000 10000 20
  // the square is 10000x10000 pixels, but clipped
  // inside a 200x200 frame so it should only render a small square
)
```

## Scrolling using the frame command

Within osl, you can hand off scrolling to the system using a frame, which gives an area on your application that clips the data inside of it, adds scrolling for you and is generally simple.

```javascript
frame left top right bottom "frame_id" [content_width, content_height] (
  // content
)
```

Here is an example:

```javascript
text_size = 10
image_width = 150

// content width of 200, content height of 1000
frame -100 100 100 -100 "scroll_frame" [200, 1000] (
  // content to be scrolled
  goto scroll_x scroll_y
  text "Sample Text" text_size
  
  change_y -20
  // move down below the text
  image someImageResource image_width
  // additional content can be added here
)
```

In this setup, the `frame` command is used to define a scrollable area, where the outer rectangle is specified by the coordinates `left`, `top`, `right`, and `bottom`. The `[content_width, content_height]` parameters define a larger content area which can be navigated with the scroll feature.
