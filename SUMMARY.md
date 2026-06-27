# Table of contents

## Introduction

* [What is OSL?](README.md)
* [Getting Started](getting-started/README.md)

## The Language

* [Syntax Overview](language/syntax.md)
* [Types](basics/types.md)
* [Defining Variables](basics/defining-variables.md)
  * [Clone Objects (=)](basics/defining-variables/clone-objects.md)
  * [References To Objects/Variables (@=)](basics/defining-variables/references-to-objects-variables.md)
* [Assignment Operators](basics/assignment-operators.md)
* [Typed Variables](basics/typed-variables.md)
* [Local Scoping](basics/local-scoping.md)
* [The Execution Loop](basics/the-execution-loop.md)

### Operators

* [Mathematical Usage](operators/mathematical-usage/README.md)
  * [Addition (+)](operators/mathematical-usage/addition-operator-+.md)
  * [Subtraction (-)](operators/mathematical-usage/subtraction-operator.md)
  * [Divide (/)](operators/mathematical-usage/divide-operator.md)
  * [Multiply (\*)](operators/mathematical-usage/multiply-operator.md)
  * [To The Power Of (^)](operators/mathematical-usage/to-the-power-of.md)
  * [Modulo (%)](operators/mathematical-usage/modulo-operator.md)
* [Text Usage](operators/text-usage.md)
* [String Concatenation (++)](operators/string-concatenation-operator.md)
* [Array Operations](operators/array-operations.md)
* [Comparative Operators](operators/comparative-operators.md)
* [Logical Operators](operators/logical-operators.md)
* [Bitwise Operators](operators/bitwise-operators.md)
* [Pipe Operator (|>)](operators/pipe-operator.md)
* [Nullish Coalescing (??)](operators/nullish-coalescing-operator.md)

### Program Flow

* [If Statements](program-flow/if-statements/README.md)
* [Switch Case](program-flow/switch-case.md)
* [Iteration](program-flow/iteration.md)
* [While And Until](program-flow/while-and-until.md)

### Arrays And Objects

* [Making Arrays Or Objects](arrays-and-objects/making-arrays-or-objects.md)
* [Modifying An Array](arrays-and-objects/modifying-an-array.md)
* [Clone Objects And References](arrays-and-objects/cloning-and-references.md)
* [Object Operations](arrays-and-objects/object-operations.md)
* [Object Property Shorthand](arrays-and-objects/object-property-shorthand.md)

### Functions, Classes & Custom Syntax

* [Functions](custom-syntax/functions.md)
* [Typed Parameters](custom-syntax/typed-parameters.md)
* [Lambda](custom-syntax/lambda.md)
* [Inline](custom-syntax/inline.md)
* [Spread Operator](custom-syntax/spread-operator.md)
* [Methods](custom-syntax/methods.md)
* [Classes](custom-syntax/classes.md)
* [Commands](custom-syntax/commands.md)
* [Promises](custom-syntax/promises.md)

## Built-in Functions & Methods

* [Global Built-in Functions](functions/builtins.md)
* [Math Functions](functions/math/README.md)
  * [Math()](functions/math/math.md)
  * [random(low, high)](functions/math/random.md)
  * [min / max](functions/math/min.md)
  * [sum / average](functions/math/sum.md)
  * [noise / octaveNoise](functions/math/noise.md)
* [Type Functions](functions/types/README.md)
  * [typeof(value)](functions/types/typeof.md)
  * [symbol(name)](functions/types/symbol.md)
* [Encoding Functions](functions/encoding/README.md)
  * [encodeURIComponent / decodeURIComponent](functions/encoding/encodeuricomponent.md)
  * [btoa / atob](functions/encoding/btoa-atob.md)
* [Other Functions](functions/function.md)
  * [formatFileSize(bytes)](functions/formatFileSize.md)
  * [parseFilePath(path)](functions/parseFilePath.md)
  * [ouidNew()](functions/ouidNew.md)
  * [getGamepads()](functions/getGamepads.md)

### Methods

* [Strings](methods/strings/README.md)
  * [Case & Whitespace](methods/strings/case.md)
  * [Searching & Testing](methods/strings/search.md)
  * [Slicing & Splitting](methods/strings/slicing.md)
  * [Building & Editing](methods/strings/editing.md)
  * [Encoding, Hashing & Input](methods/strings/encoding.md)
* [Numbers](methods/numbers/README.md)
  * [Rounding](methods/numbers/rounding.md)
  * [Arithmetic & Conversion](methods/numbers/arithmetic.md)
  * [Logarithms & Trigonometry](methods/numbers/trigonometry.md)
* [Arrays](methods/arrays/README.md)
  * [Transforming](methods/arrays/transforming.md)
  * [Adding & Removing](methods/arrays/mutating.md)
  * [Searching & Testing](methods/arrays/searching.md)
  * [Aggregating](methods/arrays/aggregating.md)
  * [Slicing & Converting](methods/arrays/converting.md)
* [Objects](methods/objects/README.md)
  * [Keys, Values & Membership](methods/objects/accessing.md)
  * [Modifying & Converting](methods/objects/transforming.md)
* [Types & Conversion](methods/types/README.md)
  * [Conversion](methods/types/conversion.md)
  * [Utility](methods/types/utility.md)
* [JSON](methods/json/README.md)
* [Functions](methods/functions/README.md)
  * [.bind(...args)](methods/functions/bind.md)

### Commands

* [Debugging (log / warn / error)](commands/debugging/README.md)
* [void](commands/general/void.md)
* [Modifiers](commands/modifiers.md)

## Packages

* [Overview](packages/README.md)

### Web & Networking

* [serve](packages/serve.md)
* [ws](packages/ws.md)
* [requests](packages/requests.md)
* [net](packages/net.md)
* [url](packages/url.md)
* [ftp](packages/ftp.md)
* [ssh](packages/ssh.md)
* [s3](packages/s3.md)
* [webpush](packages/webpush.md)

### Data & Serialization

* [json](packages/json.md)
* [yaml](packages/yaml.md)
* [csv](packages/csv.md)
* [xml](packages/xml.md)
* [template](packages/template.md)
* [mime](packages/mime.md)
* [diff](packages/diff.md)

### Databases & Storage

* [db](packages/db.md)
* [save](packages/save.md)
* [cache](packages/cache.md)
* [env](packages/env.md)

### Filesystem & System

* [fs](packages/fs.md)
* [sys](packages/sys.md)
* [process](packages/process.md)
* [zip](packages/zip.md)

### Crypto & Security

* [crypto](packages/crypto.md)
* [jwt](packages/jwt.md)

### Text, Math & Time

* [regex](packages/regex.md)
* [semver](packages/semver.md)
* [math](packages/math.md)
* [random](packages/random.md)
* [date](packages/date.md)
* [cron](packages/cron.md)

### Terminal & Logging

* [tui](packages/tui.md)
* [log](packages/log.md)
* [notify](packages/notify.md)

### Media & Documents

* [img](packages/img.md)
* [qr](packages/qr.md)
* [pdf](packages/pdf.md)
* [canvas](packages/canvas.md)
* [colors](packages/colors.md)
* [sound](packages/sound.md)

### Scripting & Concurrency

* [lua](packages/lua.md)
* [thread](packages/thread.md)
* [sync](packages/sync.md)

### Utilities & Data Structures

* [map](packages/map.md)
* [set](packages/set.md)
* [option](packages/option.md)
* [result](packages/result.md)
* [ptr](packages/ptr.md)

### More

* [email](packages/email.md)
* [torrent](packages/torrent.md)

## Graphics (osl/window)

* [window](packages/window.md)
* [Rendering](commands/rendering/README.md)
  * [Basics](commands/rendering/basics.md)
    * [Color Commands](commands/general/color.md)
    * [Color Picker](commands/general/color-picker.md)
  * [Draw Cursor](commands/rendering/draw-cursor/README.md)
    * [goto x y](commands/rendering/draw-cursor/goto-x-y.md)
    * [set\_x x](commands/rendering/draw-cursor/set_x-x.md)
    * [set\_y y](commands/rendering/draw-cursor/set_y-y.md)
    * [change\_x x](commands/rendering/draw-cursor/change_x-x.md)
    * [change\_y y](commands/rendering/draw-cursor/change_y-y.md)
    * [change x y](commands/rendering/draw-cursor/change-x-y.md)
    * [loc a b c d](commands/rendering/draw-cursor/loc-a-b-c-d.md)
    * [x_position and y_position](commands/rendering/draw-cursor/x_position-and-y_position.md)
  * [Elements](commands/rendering/elements/README.md)
    * [Rectangle](commands/rendering/elements/rectangle.md)
    * [Triangle](commands/rendering/elements/triangle.md)
    * [Icon](commands/rendering/elements/icon.md)
    * [Text](commands/rendering/elements/text.md)
    * [Image](commands/rendering/elements/image.md)
    * [Video](commands/rendering/elements/video.md)
    * [Input](commands/rendering/elements/input.md)
    * [Pen](commands/rendering/elements/pen.md)
    * [Hitbox](commands/rendering/elements/hitbox.md)
    * [Bar](commands/rendering/elements/bar.md)
    * [Slider](commands/rendering/elements/slider.md)
  * [Image Editing](commands/rendering/editing/README.md)
    * [Canvas](commands/rendering/editing/canvas.md)
    * [URI](commands/rendering/editing/uri.md)
  * [Interacting With Elements](commands/rendering/interacting-with-elements.md)
  * [Clipping And Scrolling (frames)](commands/rendering/clipping-and-scrolling-frames.md)
  * [3D Rendering](commands/rendering/3d-rendering.md)

## Global Variables

* [Overview](global-variables/README.md)
* [System Information](global-variables/system-info.md)
* [User Information](global-variables/user-info.md)
* [Date and Time](global-variables/date-time.md)
* [Input State](global-variables/input-state.md)
* [Display and UI](global-variables/display-ui.md)
* [Network](global-variables/network.md)
* [File System](global-variables/file-system.md)

## Legacy OSL (originOS)

* [About Legacy OSL](legacy-osl/README.md)
* [The Window System](environment/the-window-system.md)
* [Events](environment/events.md)
* [Camera](environment/camera.md)
* [Mouse Cursor](environment/mouse-cursor.md)
* [Input Simulation](environment/input-simulation.md)
* [Notifications (now osl/notify)](environment/notifications.md)
* [Send Data Between Windows](environment/send-data-between-windows.md)
* [Interfacing With Right-click](environment/interfacing-with-rightclick.md)
* [Running Other Languages (now osl/lua)](environment/running-other-languages.md)
* [Sound (now osl/sound)](environment/sound.md)
* [Permissions](environment/permissions.md)
* [Files (OFSF)](environment/files/README.md)
  * [What is a file? (in ofsf)](environment/files/what-is-a-file-in-ofsf.md)
  * [Creating Directories](environment/files/creating-directories.md)
  * [open("file\_path")](environment/files/open.md)
  * [fileGet(int)](environment/files/fileGet.md)
  * [listFiles()](environment/files/listFiles.md)
* [import() as a function](functions/import.md)
* [Save DB](storage/save-db.md)
* [Local DB](storage/local-db.md)
