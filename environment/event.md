# Event

The `window` object provides an event system for responding to various actions in your application:

```javascript
// Basic event registration
window.on("event_name", def() -> (
  log "Event handler executed"
))

// Emitting custom events
window.emit("event_name")
```

#### Event Registration

Register event handlers using `window.on()`:

```javascript
window.on("paste", def() -> (
  log "Content was pasted"
))
```

#### Standard Events

* `paste` - Fires when any data is pasted
* `copy` - Fires when any data is copied to the clipboard
* `system_focus_changed` - Fires whenever the system's tab changes focus
* `frame_end` - Executes after the main code runs each frame, useful for cleanup or post-processing

#### Custom Events

You can create and trigger your own events:

```javascript
// Register custom event handler
window.on("my_custom_event", def() -> (
  log "Custom event triggered"
))

// Later, trigger the event
window.emit("my_custom_event")
```

#### Important Notes

* Event names are case-sensitive
* Multiple handlers can be registered for the same event
* Handlers execute in the order they were registered
* Custom events are useful for decoupling application components
* The `window.emit()` method can be used to manually trigger any event
