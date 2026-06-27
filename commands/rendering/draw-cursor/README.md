# Draw Cursor

The draw cursor is the point that element commands draw from. Drawing commands such
as `square`, `icon` and `text` are positioned relative to the cursor's current
location, so you move the cursor first and then draw.

The commands below move or read the cursor:

* `goto x y` — jump to an absolute position.
* `change x y`, `change_x`, `change_y` — move relative to the current position.
* `loc a b c d` — set the cursor's bounding region.
* `x_position` / `y_position` — read the current cursor coordinates.
