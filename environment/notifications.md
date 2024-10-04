# Notifications

In osl notifications can only be sent at runtime using a running script. You cannot send notifications while no code is running.

To send a notification you need the "notifications" permission, to get this permission you must ask the user for it using the code below:

```js
permission "request" "notifications"
```

This code will give your user a popup to allow or deny the permission request while your app continues running in the background. You may need to restart your program or continuously check the "permissions" variable for if it contains "notifications" using something like the code below:

```js
permission "request" "notifications"
hasperms = false
mainloop:
if hasperms.not (
  // only check while you don't have permissions
  if permissions.contains("notifications") (
    hasperms = true
  ) else (
    exit
    // this stops the execution of the program for this frame
  )
)

```

## Sending a notification

Notifications are not secure, please do not put sensitive info in them

```js
notify "text"
// this will make a small popup at the top of the screen with your app icon, name, and the text you want to display below it
```

## Getting all notifications

With the notification permission you can also get an array of all notifications that the user has recieved since booting the device

```js
log allNotify()
// this logs an array of all notifications
```

## Info on the notification array

Notifications are stored as an array of objects

```json
[
  {
    "icon":"(icn file data)",
    "title":"app name",
    "text":"hi"
  },
  {
    "icon":"(icn file data)",
    "title":"app name2",
    "text":"hi"
  }
]
```
