# Clipboard
The clipboard is a system on the parent OS that handles copying and pasting text, images, and files. This can be interacted with directly through OSL, allowing scripts to read and set the clipboard.

**It's worth noting that the copy/paste functionality in originOS can be unstable at times. This is simply due to the nature of how browsers handle these events. Be prepared for edge cases and unexpected functionality.**

### Setting the Clipboard

There are 2 OSL commands for manipulating the clipboard; `clipboard "set"` allows overwriting the current contents of the clipboard with a new value, while `clipboard "clear"` removes the clipboard's current data.

```js
// data - the value to be copied to the clipboard
//    this is typically a string
clipboard "set" data

// "clear" doesn't require a data argument.
clipboard "clear"
```

### Reading the Clipboard

The clipboard can be read simply through accessing the `clipboard` global variable.

```js
// puts the clipboard's content into the console
log clipboard
```

### Clipboard Events

OSL has two events related to the clipboard, one fires when a copy is detected (typically Ctrl + C or Ctrl + X) and one when a paste is detected (typically Ctrl + V).

```js
window.on("copy", () -> (
   log "Copied text:" + clipboard
))

window.on("paste", () -> (
   log "Pasted text:" + clipboard
))
```
