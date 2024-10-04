# Interfacing With Rightclick

### Info

In osl, the right click menu can be incredibly powerful in your guis and apps

The base command for a right click is:

```
rightclick [data] [passed_info]
```

### Defining a custom menu

You can define a custom right click menu layout using an array and passing it as data

```js
my_menu = [
  "test1",
  "test2",
  "test3"
]

// render a ui element that is clickable
rightclick my_menu
```

### Example of a right clickable square

The right click command essentially makes the previously rendered ui object rightclickable, heres an example

```js
my_menu = [
  "test1",
  "test2",
  "test3"
]

square 400 400 : c#fff
rightclick my_menu
import "win-buttons"
```

![Screenshot 2024-07-02 at 15 22 04](https://github.com/Mistium/Origin-OS/assets/92952823/1349e6c6-5df3-49e7-a3b8-12a161ab4b1d)

### Submenus in right click

You are also able to create submenus using the right click system:

```js
my_menu = [
  "test1",
  "test2",
  "test3",
  ["my epic submenu",
    "wow option 1",
    "option 2?",
    "option 3 is epic"
  ]
]

square 400 400 : c#fff

rightclick my_menu
// activate the custom right click menu

import "win-buttons"
// use the default window buttons
```

![Screenshot 2024-07-02 at 15 23 53](https://github.com/Mistium/Origin-OS/assets/92952823/08f5f2f6-44f5-4d7b-a618-0a725fe2e184)

### Run custom commands from any right click option

you might be wondering, what's the point in this if i cant use it to run any code?

Well, any item of an array can be turned into an object, as shown below

this menu looks no different to the one from before, except for one change, it has an object and a command designated as linked to the first item in the right click menu.

```js
my_menu = [
  {"test1":"my_command"},
  "test2",
  "test3",
  ["my epic submenu",
    "wow option 1",
    "option 2?",
    "option 3 is epic"
  ]
]

def "my_command" "dat"
  log dat
endef
// define the command to be run

square 400 400 : c#fff

rightclick my_menu "hello world"
// pass hello world to the right click menu

import "win-buttons"
// use the default window buttons
```

Now, with these changes, the code above will log hello world whenever we click on the first option of the right click menu.

you can only use a defined command with this system, it cannot be a built in one
