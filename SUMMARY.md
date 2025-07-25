# Table of contents

## Basics

* [Syntax](README.md)
* [Types](basics/types.md)
* [The Execution Loop](basics/the-execution-loop.md)
* [Defining Variables](basics/defining-variables.md)
  * [Clone Objects (=)](basics/defining-variables/clone-objects.md)
  * [References To Objects/Variables (@=)](basics/defining-variables/references-to-objects-variables.md)
* [Assignment Operators](basics/assignment-operators.md)
* [Local Scoping](basics/local-scoping.md)
* [Typed Variables](basics/typed-variables.md)

## Operators

* [Mathematical Usage](operators/mathematical-usage/README.md)
  * [Addition Operator (+)](operators/mathematical-usage/addition-operator-+.md)
  * [Subtraction Operator (-)](operators/mathematical-usage/subtraction-operator.md)
  * [Divide Operator (/)](operators/mathematical-usage/divide-operator.md)
  * [Multiply Operator (\*)](operators/mathematical-usage/multiply-operator.md)
  * [To The Power Of (^)](operators/mathematical-usage/to-the-power-of.md)
  * [Modulo Operator (%)](operators/mathematical-usage/modulo-operator.md)
* [Text Usage](operators/text-usage.md)
* [String Concatenation Operator (+)](operators/string-concatenation-operator.md)
* [Array Operations](operators/array-operations.md)
* [Comparative Operators](operators/comparative-operators.md)
* [Logical Operators](operators/logical-operators.md)
* [Bitwise operators](operators/bitwise-operators.md)
* [Pipe Operator (|>)](operators/pipe-operator.md)
* [Nullish Coalescing Operator (??)](operators/nullish-coalescing-operator.md)

## Program Flow

* [If Statements](program-flow/if-statements/README.md)
  * [if truthy (](program-flow/if-statements/if-truthy.md)
  * [) else if truthy (](program-flow/if-statements/else-if-truthy.md)
  * [) else (](program-flow/if-statements/else.md)
  * [)](program-flow/if-statements/undefined.md)
* [Switch Case](program-flow/switch-case.md)
* [Iteration](program-flow/iteration.md)
* [While And Until](program-flow/while-and-until.md)

## Arrays And Objects

* [Making Arrays Or Objects](arrays-and-objects/making-arrays-or-objects.md)
* [Modifying An Array](arrays-and-objects/modifying-an-array.md)
* [Clone Objects And References](arrays-and-objects/cloning-and-references.md)
* [Object Operations](arrays-and-objects/object-operations.md)
* [Object Property Shorthand](arrays-and-objects/object-property-shorthand.md)

## Environment

* [The Window System](environment/the-window-system.md)
* [Events](environment/events.md)
* [Mouse Cursor](environment/mouse-cursor.md)
* [Camera](environment/camera.md)
* [Sound System](environment/sound.md)
* [Input Simulation](environment/input-simulation.md)
* [Running Other Languages](environment/running-other-languages.md)
* [Notifications](environment/notifications.md)
* [Send Data Between Windows](environment/send-data-between-windows.md)
* [Interfacing With Rightclick](environment/interfacing-with-rightclick.md)
* [Permissions](environment/permissions.md)
* [Files](environment/files/README.md)
  * [What is a file? (in ofsf)](environment/files/what-is-a-file-in-ofsf.md)
  * [Creating Directories](environment/files/creating-directories.md)
  * [open("file\_path")](environment/files/open.md)
  * [fileGet(int)](environment/files/fileGet.md)
  * [listFiles()](environment/files/listFiles.md)

## Storage

* [Save DB](storage/save-db.md)
* [Local DB](storage/local-db.md)

## Custom Syntax

* [Commands](custom-syntax/commands.md)
* [Methods](custom-syntax/methods.md)
* [Functions](custom-syntax/functions.md)
* [Inline](custom-syntax/inline.md)
* [Lambda](custom-syntax/lambda.md)
* [Spread Operator](custom-syntax/spread-operator.md)
* [Typed Parameters](custom-syntax/typed-parameters.md)
* [Classes](custom-syntax/classes.md)
* [Promises](custom-syntax/promises.md)

## Commands

* [Debugging](commands/debugging/README.md)
  * [log "hello world"](commands/debugging/log-hello-world.md)
  * [warn "you should change this"](commands/debugging/warn-you-should-change-this.md)
  * [error "something went wrong"](commands/debugging/error-something-went-wrong.md)
  * [void expression](commands/void.md)
* [Rendering](commands/rendering/README.md)
  * [Basics](commands/rendering/basics.md)
    * [Color Commands](commands/rendering/basics/color.md)
    * [Color Picker](commands/rendering/basics/color-picker.md)
    * [Modifiers](commands/rendering/basics/modifiers.md)
  * [Draw Cursor](commands/rendering/draw-cursor/README.md)
    * [goto x y](commands/rendering/draw-cursor/goto-x-y.md)
    * [set\_x x](commands/rendering/draw-cursor/set_x-x.md)
    * [set\_y y](commands/rendering/draw-cursor/set_y-y.md)
    * [change\_x x](commands/rendering/draw-cursor/change_x-x.md)
    * [change\_y y](commands/rendering/draw-cursor/change_y-y.md)
    * [change x y](commands/rendering/draw-cursor/change-x-y.md)
    * [loc a b c d](commands/rendering/draw-cursor/loc-a-b-c-d.md)
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
  * [ICN (Icon System)](commands/rendering/icn/README.md)
    * [Drawing Commands](commands/rendering/icn/drawing-commands.md)
    * [Dynamic Icons](commands/rendering/icn/dynamic-icons.md)
  * [Clipping And Scrolling (frames)](commands/rendering/clipping-and-scrolling-frames.md)
  * [3D Rendering](commands/rendering/3d-rendering.md)

## Functions

* [Math](functions/math/README.md)
  * [Math()](functions/math/math.md)
  * [random(low,high)](functions/math/random.md)
  * [min(num1,num2)](functions/math/min.md)
  * [max(num1,num2)](functions/math/max.md)
  * [lcm(num1,num2)](functions/math/lcm.md)
  * [gcd(num1,num2)](functions/math/gcd.md)
  * [sum(num1,..)](functions/math/sum.md)
  * [average(num1,..)](functions/math/average.md)
  * [dist(x1,y1,x2,y2)](functions/math/dist.md)
  * [degtorad(angle)](functions/math/degtorad.md)
  * [radtodeg(angle)](functions/math/radtodeg.md)
  * [noise(x, y, z)](functions/math/noise.md)
  * [octaveNoise(x, y, z, octaves, persistence)](functions/math/octaveNoise.md)
* [Types](functions/types/README.md)
  * [typeof(value)](functions/types/typeof.md)
  * [symbol(name)](functions/types/symbol.md)
* [Encoding](functions/encoding/README.md)
  * [encodeURIComponent(string)](functions/encoding/encodeuricomponent.md)
  * [decodeURIComponent(string)](functions/encoding/decodeuricomponent.md)
  * [btoa/atob(string)](functions/encoding/btoa-atob.md)
* [function()](functions/function.md)
* [formatFileSize(bytes)](functions/formatFileSize.md)
* [getGamepads()](functions/getGamepads.md)
* [import(path)](functions/import.md)
* [ouidNew()](functions/ouidNew.md)
* [parseFilePath(path)](functions/parseFilePath.md)

## Global Variables

* [Overview](global-variables/README.md)
* [System Information](global-variables/system-info.md)
* [User Information](global-variables/user-info.md)
* [Date and Time](global-variables/date-time.md)
* [Input State](global-variables/input-state.md)
* [Display and UI](global-variables/display-ui.md)
* [Network](global-variables/network.md)
* [File System](global-variables/file-system.md)

## Methods

* [Strings](methods/strings/README.md)
  * [.padStart(val,num)](methods/strings/.padstart-val-num.md)
  * [.padEnd(val,num](methods/strings/.padend-val-num.md)
  * [.startsWith(val)](methods/strings/.startswith-val.md)
  * [.endsWith(val)](methods/strings/.endswith-val.md)
  * [.wrapText(characters)](methods/strings/.wraptext-characters.md)
  * [.trimText(characters)](methods/strings/.trimtext-characters.md)
  * [.split(characters)](methods/strings/.split.md)
  * [.count(val)](methods/strings/.count.md)
  * [.replace(old,new)](methods/strings/.replace.md)
  * [.replaceFirst(old,new)](methods/strings/.replacefirst.md)
  * [.oslTokenise()](methods/strings/.osltokenise.md)
  * [.strip()](methods/strings/.strip.md)
  * [.toOrdArray()](methods/strings/.toordarray.md)
  * [.match(pattern)](methods/strings/.match.md)
  * [Encoding](methods/strings/encoding/README.md)
    * [.encodeBin()](methods/strings/encoding/.encodebin.md)
    * [.decodeBin()](methods/strings/encoding/.decodebin.md)
    * [.encodeHex()](methods/strings/encoding/.encodehex.md)
    * [.decodeHex()](methods/strings/encoding/.decodehex.md)
    * [.encodeUTF16()](methods/strings/encoding/.encodeutf16.md)
    * [.decodeUTF16()](methods/strings/encoding/.decodeutf16.md)
    * [.encrypt(password)](methods/strings/encoding/.encrypt.md)
    * [.decrypt(password)](methods/strings/encoding/.decrypt.md)
    * [.ord()](methods/strings/encoding/.ord.md)
    * [.chr()](methods/strings/encoding/.chr.md)
  * [Hashing](methods/strings/hashing/README.md)
    * [.hashMD5()](methods/strings/hashing/.hashmd5.md)
    * [.hashSHA1()](methods/strings/hashing/.hashsha1.md)
    * [.hashSHA256()](methods/strings/hashing/.hashsha256.md)
    * [.hashSHA512()](methods/strings/hashing/.hashsha512.md)
  * [Case](methods/strings/case/README.md)
    * [.toLower()](methods/strings/case/.tolower.md)
    * [.toUpper()](methods/strings/case/.toupper.md)
    * [.toMixed()](methods/strings/case/.tomixed.md)
    * [.toTitle()](methods/strings/case/.totitle.md)
* [Keyboard](methods/keyboard/README.md)
  * [.isKeyDown()](methods/keyboard/.iskeydown.md)
  * [.onKeyDown()](methods/keyboard/.onkeydown.md)
* [Utilities](methods/utilities/README.md)
  * [.len](methods/utilities/.len.md)
  * [.not](methods/utilities/.not.md)
  * [.ask()](methods/utilities/.ask.md)
  * [.reverse()](methods/utilities/.reverse.md)
  * [.first()](methods/utilities/.first.md)
  * [.last()](methods/utilities/.last.md)
  * [.append(val)](methods/utilities/.append.md)
  * [.prepend(val)](methods/utilities/.prepend.md)
  * [.insert(location,val)](methods/utilities/.insert.md)
  * [.delete(location)](methods/utilities/.delete.md)
  * [.concat(val)](methods/utilities/.concat-val.md)
  * [.trim(idx1,idx2)](methods/utilities/.trim.md)
  * [.left(num)](methods/utilities/.left.md)
  * [.right(num)](methods/utilities/.right.md)
  * [.contains(val)](methods/utilities/.contains.md)
  * [.index(val)](methods/utilities/.index.md)
* [Maths](methods/maths/README.md)
  * [.abs()](methods/maths/.abs.md)
  * [.invabs()](methods/maths/.invabs.md)
  * [.log()](methods/maths/.log.md)
  * [.ln()](methods/maths/.ln.md)
  * [.isPrime()](methods/maths/.isprime.md)
  * [.sqrt()](methods/maths/.sqrt.md)
  * [.sign()](methods/maths/.sign.md)
  * [.chance()](methods/maths/.chance.md)
  * [.clamp(low,high)](methods/maths/.clamp.md)
  * [.toBase(base)](methods/maths/.tobase.md)
  * [Rounding](methods/maths/rounding/README.md)
    * [.round(places)](methods/maths/rounding/.round.md)
    * [.ceiling()](methods/maths/rounding/.ceiling.md)
    * [.floor()](methods/maths/rounding/.floor.md)
  * [Trigonometry](methods/maths/trigonometry/README.md)
    * [.sin](methods/maths/trigonometry/.sin.md)
    * [.cos](methods/maths/trigonometry/.cos.md)
    * [.tan](methods/maths/trigonometry/.tan.md)
    * [.asin()](methods/maths/trigonometry/.sin-1.md)
    * [.acos()](methods/maths/trigonometry/.sin-2.md)
    * [.atan()](methods/maths/trigonometry/.sin-3.md)
    * [.radSin()](methods/maths/trigonometry/.radsin.md)
    * [.radCos()](methods/maths/trigonometry/.radcos.md)
* [Iframes](methods/iframes/README.md)
  * [.iframeNew()](methods/iframes/.iframeNew.md)
  * [.iframeGoto()](methods/iframes/.iframeGoto.md)
  * [.iframeResize()](methods/iframes/.iframeResize.md)
  * [.iframeRedirect()](methods/iframes/.iframeRedirect.md)
  * [.iframeShow()](methods/iframes/.iframeShow.md)
  * [.iframeHide()](methods/iframes/.iframeHide.md)
  * [.iframeClose()](methods/iframes/.iframeClose.md)
* [JSON](methods/json/README.md)
  * [Arrays](methods/json/arrays/README.md)
    * [.pop()](methods/json/arrays/.pop.md)
    * [.shift()](methods/json/arrays/.shift.md)
    * [.randomOf()](methods/json/arrays/.randomof.md)
    * [.sort(direction)](methods/json/arrays/.sort.md)
    * [.sortBy(key,direction)](methods/json/arrays/.sortby.md)
    * [.swap(idx1,idx2)](methods/json/arrays/.swap.md)
    * [.fill(value)](methods/json/arrays/.fill.md)
    * [.join(characters)](methods/json/arrays/.join.md)
    * [.map(callback)](methods/json/arrays/.map.md)
    * [.filter(callback)](methods/json/arrays/.filter.md)
    * [.some(callback)](methods/json/arrays/.some.md)
    * [.every(callback)](methods/json/arrays/.every.md)
  * [Objects](methods/json/objects/README.md)
    * [.getKeys(keys)](methods/json/objects/.getkeys.md)
    * [.getValues()](methods/json/objects/.getvalues.md)
  * [.JsonStringify()](methods/json/.jsonstringify.md)
  * [.JsonParse()](methods/json/.jsonparse.md)
  * [.JsonFormat()](methods/json/.jsonformat.md)
  * [.JsonClean()](methods/json/.jsonclean.md)
* [Types](methods/types/README.md)
  * [.getType()](methods/types/.gettype.md)
  * [.isType(type)](methods/types/.istype.md)
  * [.toNum()](methods/types/.tonum.md)
  * [.toBool()](methods/types/.tobool.md)
  * [.toStr()](methods/types/.tostr.md)
* [Functions](methods/functions/README.md)
  * [.bind(context)](methods/functions/bind.md)
* [Networking](methods/networking/README.md)
  * [.httpGet()](methods/networking/.httpget.md)
  * [.http(method,data,headers)](methods/networking/.http.md)
  * [.getAsync()](methods/networking/.getasync.md)
  * [.roturConnect()](methods/networking/.roturconnect.md)
  * [.roturSend(msg,target)](methods/networking/.rotursend-msg-target.md)
  * [Websockets](methods/networking/websockets/README.md)
    * [.newWebsocket()](methods/networking/websockets/.newwebsocket.md)
    * [.wsSend(msg)](methods/networking/websockets/.wssend.md)
    * [.wsClose()](methods/networking/websockets/.wsclose.md)
    * [.wsOpen()](methods/networking/websockets/.wsopen.md)
    * [.wsHasnew()](methods/networking/websockets/.wshasnew.md)
    * [.wsGetnext()](methods/networking/websockets/.wsgetnext.md)
    * [.wsGetcount()](methods/networking/websockets/.wsgetcount.md)
* [Timestamp](methods/timestamp/README.md)
  * [.timestamp("convert-date")](methods/timestamp/timestamp-convert-date.md)
  * [.timestamp("component")](methods/timestamp/timestamp-component.md)
