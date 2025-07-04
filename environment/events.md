# Events

`window.on(event, callback)`

The `window.on()` function allows you to listen for custom events in your application. It takes two parameters: the name of the event you want to listen for and a callback function that will be executed when the event is fired.

**Example:**

```javascript
window.on("event", () -> (
   log "my event fired"
))

window.emit("event")
// This will trigger the above callback
```

**Useful for Custom Events**

This function is particularly useful for handling custom events that you define in your application.

**Event List:**

* **paste**: Fires when any data is pasted.
* **copy**: Fires when any data is copied to the clipboard.
* **system\_focus\_changed**: Fires whenever the system's tab changes focus.
* **frame\_end**: Useful for adding scripts to run after the main code of your app has executed every frame.
