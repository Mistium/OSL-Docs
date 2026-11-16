---
description: Look up media types by file extension and parse or build Content-Type values.
package: mime
---

# mime

`std:mime` knows which media type (also called MIME type or content type) belongs to a file name, and how to read and write the `Content-Type` header value. Use it when you serve or upload files, decide how to handle a file by what it holds, or parse a header that comes with parameters such as `charset`.

## From file name to type

`mime.typeByFilename(path)` looks at the extension and ignores case. `mime.typeByExt(ext)` takes the extension alone, with or without the dot. Both return `null` when the extension isn't known, so use `??` for a fallback:

```osl
import "std:mime"

log mime.typeByFilename("photo.JPG")
log mime.typeByFilename("archive.tar.gz")
log mime.typeByExt(".json")
log mime.typeByExt("png")
log mime.typeByExt(".zzzz")

string type = mime.typeByFilename("data.unknown") ?? "application/octet-stream"
log type
```

```output
image/jpeg
application/gzip
application/json
image/png
null
application/octet-stream
```

Change the file name to `x.svg` or `x.wasm` and see what comes back.

`application/octet-stream` is the usual answer for "bytes of unknown kind". [serve](serve.md) already picks a `Content-Type` for files it serves, so you need `mime` when you set one yourself, such as on an upload.

## From type to extension

`mime.extByType` goes the other way, returning the usual extension with its dot, or `null`:

```osl
import "std:mime"

log mime.extByType("text/html")
log mime.extByType("image/png")
log mime.extByType("application/x-nothing")
```

```output
.html
.png
null
```

## Telling kinds of file apart

Five checks cover the common questions. Each exists in two forms: one that takes a media type, and one with `File` on the end that takes a file name:

```osl
import "std:mime"

log mime.isImage("image/png") mime.isAudio("audio/mpeg") mime.isVideo("video/mp4")
log mime.isText("application/json") mime.isText("image/png")
log mime.isImageFile("a.webp") mime.isTextFile("notes.md") mime.isVideoFile("x.txt")
```

```output
true true true
true false
true true false
```

`isText` counts anything readable as text, including JSON and XML, and not only `text/*`. That makes it a good test for "can I show this in a text box?".

## Parse a Content-Type

A `Content-Type` header holds a type and parameters. `mime.parse` returns the type lowercased and the parameters as an object, or an error for text that isn't a media type:

```osl
import "std:mime"

auto parsed = mime.parse("Text/HTML; charset=UTF-8; boundary=x").unwrap()
log parsed.type
log parsed.params["charset"]
log parsed.params

log mime.parse("???").isErr()
```

```output
text/html
UTF-8
{"boundary":"x","charset":"UTF-8"}
true
```

Parameter names are lowercased and their values are left as sent.

## Build a Content-Type

`mime.format(type, params)` writes the header value, quoting parameter values when they need it:

```osl
import "std:mime"

log mime.format("text/plain", {charset: "utf-8"})
log mime.format("multipart/form-data", {boundary: "----docs"})
```

```output
text/plain; charset=utf-8
multipart/form-data; boundary=----docs
```

:::quiz
What does `mime.typeByFilename("data.unknown")` return?

- [ ] `"application/octet-stream"`
- [x] `null`
- [ ] An error.

An unknown extension has no type, so you choose the fallback with `??`.
:::

:::exercise title="Content-Type for a file"
Write `typeFor(name)` that returns the media type of a file name, or `application/octet-stream` when it isn't known.

```osl
import "std:mime"

def typeFor(string name) string (
  return ""
)

log typeFor("logo.png")
log typeFor("notes.md")
log typeFor("blob.zzz")
```

```output
image/png
text/markdown; charset=utf-8
application/octet-stream
```

> [!hint]
> `mime.typeByFilename(name)` returns `string?`.

> [!hint]
> `?? "application/octet-stream"` supplies the fallback.

```osl solution
import "std:mime"

def typeFor(string name) string (
  return mime.typeByFilename(name) ?? "application/octet-stream"
)

log typeFor("logo.png")
log typeFor("notes.md")
log typeFor("blob.zzz")
```

```output
image/png
text/markdown; charset=utf-8
application/octet-stream
```
:::

## API reference

::api
