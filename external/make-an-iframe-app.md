# Make An Iframe App

### Info

Iframes allow you to quickly show websites within Origin and on top of OSL applications.

This system uses the iframe methods that are found here: [iframes](../methods/iframes/ "mention")

### Example

Below is an example program to show youtube.com

{% code overflow="wrap" %}
```js
youtube = "https://youtube.com/".iframeNew()
youtube.iframeShow()
// adds the iframe to the window and shows it

// you can also use .iframeHide() to hide the iframe so that users cant see or interact with it but you don't have to reload the webpage or lose any changes when they want to see the page again

mainloop:

youtube.iframeResize(window_width,window_height - 40)
// resizes the iframe to the window

youtube.iframeGoto(0,-20)
// calls to update the iframe at the xy of the draw cursor

if "up arrow".onKeyDown() (
  youtube.iframeRedirect("https://studio.youtube.com")
  // redirects the iframe when the up arrow is pressed
)
if "space".onKeyDown() (
  youtube.iframeClose()
  // removes the iframe from the window
)

import "win-buttons"
```
{% endcode %}
