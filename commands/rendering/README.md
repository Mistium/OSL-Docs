# Rendering

Rendering commands draw to the window opened by the [`osl/window`](../../packages/window.md)
package. They run inside the `mainloop:` block, which executes once per frame, so
whatever you draw is redrawn every frame.

A program positions a **draw cursor**, sets a colour, then issues element commands
(`square`, `icon`, `text`, `image`) relative to that cursor.

* [Basics](basics.md) - colours and the frame model.
* [Draw Cursor](draw-cursor/README.md) - moving the point that elements draw from.
* [Elements](elements/README.md) - the shapes and content you can draw.
