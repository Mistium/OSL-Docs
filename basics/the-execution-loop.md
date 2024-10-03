# The Execution Loop

In osl you can define what runs each frame using the placement of the "mainloop:" label. This label defines what line to jump to for each frame of the script.

Everything placed before the mainloop label will be run only on the first frame/when the app opens, and everything after it will be run every frame.

```javascript
log "onload"
// gets logged only on the first frame of the apps execution

mainloop:
log "mainloop"
// gets logged every frame
```

## for dummies

everything before the line, "mainloop:" gets run when the app is opened

everything after the line "mainloop:" gets run every frame

:3
