# Icon

The icon command renders a single ".icn" file that can be created locally on your account or pulled from the system.

## Functionality

The icon command allows you to display icons within your OSL application. These icons can be sourced from files in the system's Icons folder, specified by their names, or created using raw icon data directly within the command.

## Syntax

```osl
icon "code/name" size
```

## Parameters

* `"code/name"`: Specifies the name of the icon file or provides raw icon code for rendering.
* `size`: Sets the multiplier for the size of the icon to be rendered. (1 indicates the original size of the icon)

## Color Modifier

You can modify the color of the icon using a modifier syntax:

```osl
icon "code/name" size : c#fff
```

## Icon Creation Recommendations

It's recommended to keep all icon data inside the application and avoid referencing locally created icons. This ensures consistent access to icons across different users.

## Examples

1.  Display an icon named "my\_icon" with a size multiplier of 1:

    ```osl
    icon "my_icon" 1
    ```
2.  Draw an "X" icon using raw icon code and set its size to 2:

    ```osl
    icon "c #fff line -10 10 10 -10 line -10 -10 10 10" 2
    ```

## Learn icn here
https://icn.rotur.dev

## Notes

* Ensure that icon files are accessible to all users by storing them within the application rather than locally.

```js
// Define the icon code as a variable
my_icon_code = "c #fff line -10 10 10 -10 line -10 -10 10 10"

// Render the icon using the variable
icon my_icon_code 2
```

In this example:

* We define an icon code as a variable named `my_icon_code`.
* The icon code is specified as an array containing instructions to draw the icon.
* Later, we use the `icon` command and pass the `my_icon_code` variable as the icon data. We also set the size multiplier to `2` to make the icon larger.

This approach allows you to store icon data directly within your application's script, ensuring accessibility to all users without relying on external files or resources.
