# Send Data Between Windows

## Send data to a window

```js
transmit data window_id
// send data to a window
```

## Handle receiving data

You will want something like what is below inside of your mainloop to handle all incoming transmit

```js
if new_transmit (
  // theres new data to handle
  
  log transmit_source
  // log the id of the window that sent you data
  // (normally so you can respond or verify that its allowed to transmit to you)
  
  log transmit_data
  // log the data from the transmit
  
  new_transmit = false
  // reset the flag (very important)
)
```

## Possibly helpful info

Check out the parents and children section for useful information: [#parents-and-children](the-window-system.md#parents-and-children "mention")
