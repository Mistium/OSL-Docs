# Table of contents

## Basics

* [Syntax](README.md)
* [Types](basics/types.md)
* [The Execution Loop](basics/the-execution-loop.md)

## Variables

* [Defining Variables](variables/defining-variables.md)
* [Assignment Operators](variables/assignment-operators.md)
* [Local Scoping](variables/local-scoping.md)

## Operators

* [Mathematical Usage](operators/mathematical-usage.md)
* [Text Usage](operators/text-usage.md)
* [Array Operations](operators/array-operations.md)
* [Comparative Operators](operators/comparative-operators.md)
* [Logical Operators](operators/logical-operators.md)
* [Bitwise operators](operators/bitwise-operators.md)

## Program Flow

* [If Statements](program-flow/if-statements.md)
* [Switch Case](program-flow/switch-case.md)
* [Iteration](program-flow/iteration.md)
* [While And Until](program-flow/while-and-until.md)
* [Dynamic OSL Execution](program-flow/dynamic-osl-execution.md)

## Arrays And Objects

* [Making Arrays Or Objects](arrays-and-objects/making-arrays-or-objects.md)
* [Modifying An Array](arrays-and-objects/modifying-an-array.md)

## Environment

* [The Window System](environment/the-window-system.md)
* [Mouse Cursor](environment/mouse-cursor.md)
* [Notifications](environment/notifications.md)
* [Send Data Between Windows](environment/send-data-between-windows.md)
* [Interfacing With Rightclick](environment/interfacing-with-rightclick.md)

## Storage

* [Save DB](storage/save-db.md)
* [Local DB](storage/local-db.md)

## Custom Syntax

* [Commands](custom-syntax/commands.md)
* [Methods](custom-syntax/methods.md)
* [Functions](custom-syntax/functions.md)
* [Inline](custom-syntax/inline.md)

## External

* [Make An Iframe App](external/make-an-iframe-app.md)
* [GPT Integration](external/gpt-integration.md)

## Methods

* [Strings](methods/strings/README.md)
  * [.padStart(num,val)](methods/strings/.padstart-num-val.md)
  * [.padEnd(num,val)](methods/strings/.padend-num-val.md)
  * [.startsWith(val)](methods/strings/.startswith-val.md)
  * [.endsWith(val)](methods/strings/.endswith-val.md)
  * [.wrapText(characters)](methods/strings/.wraptext-characters.md)
  * [.trimText(characters)](methods/strings/.trimtext-characters.md)
  * [.split(characters)](methods/strings/.split.md)
  * [Encoding](methods/strings/encoding/README.md)
    * [.encodeBin()](methods/strings/encoding/.encodebin.md)
    * [.decodeBin()](methods/strings/encoding/.decodebin.md)
    * [.encodeHex()](methods/strings/encoding/.encodehex.md)
    * [.decodeHex()](methods/strings/encoding/.decodehex.md)
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
    * [.join(characters)](methods/json/arrays/.join.md)
    * [.map(callback)](methods/json/arrays/.join-1.md)
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

## Advanced

* [Canvas](advanced/canvas.md)

## Rendering

* [Basics](rendering/basics.md)
* [Commands](rendering/commands/README.md)
  * [Draw Cursor](rendering/commands/draw-cursor/README.md)
    * [goto x y](rendering/commands/draw-cursor/goto-x-y.md)
    * [set\_x x](rendering/commands/draw-cursor/set\_x-x.md)
    * [set\_y y](rendering/commands/draw-cursor/set\_y-y.md)
    * [change\_x x](rendering/commands/draw-cursor/change\_x-x.md)
    * [change\_y y](rendering/commands/draw-cursor/change\_y-y.md)
    * [change x y](rendering/commands/draw-cursor/change-x-y.md)
