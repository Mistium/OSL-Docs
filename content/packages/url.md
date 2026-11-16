---
description: Parse, build, join and escape URLs and query strings without string surgery.
package: url
---

# url

`std:url` takes URLs apart and puts them back together. Reach for it whenever a URL is more than a string you pass along: reading a query parameter, adding one, resolving a link against a base, or escaping user input before it goes into an address. Building URLs with `++` works until a value contains a space or an ampersand.

## Parse a URL

`url.parse(text)` returns a result holding the parts. A URL that can't be parsed is an error, not a half-filled record:

```osl
import "std:url"

auto u = url.parse("https://ada:pw@example.com:8443/a/b%20c?x=1&y=two+words&x=2#top").unwrap()
log u.scheme u.hostname u.port
log u.host
log u.user u.password
log u.path
log u.rawPath
log u.queryString
log u.fragment

log url.parse("http://[bad").isErr()
```

```output
https example.com 8443
example.com:8443
ada pw
/a/b c
/a/b%20c
x=1&y=two+words&x=2
top
true
```

Try changing the port, or removing the `#top`, and run it again: the parts that are missing come back as empty strings.

`host` includes the port and `hostname` doesn't. `path` is decoded and `rawPath` is as it was written. The parts that are absent come back as empty strings.

## Query parameters

`u.query` is the query string already decoded into an object. A parameter that appears once is a string, and one that repeats is an array of strings. To read one parameter from a URL string directly, use `url.param`, which returns `null` for a parameter that isn't there:

```osl
import "std:url"

auto u = url.parse("https://example.com/s?x=1&y=two+words&x=2").unwrap()
log u.query

string link = "https://example.com/s?q=hello&n=2"
log url.param(link, "q").unwrap()
log url.param(link, "missing").unwrap()
```

```output
{"x":["1","2"],"y":"two words"}
hello
null
```

`url.parseQuery("a=1&b=2")` does the same for a bare query string, with or without the leading `?`. `url.stringifyQuery` goes the other way, with keys sorted so the result is stable, and an array becomes a repeated key:

```osl
import "std:url"

log url.parseQuery("?a=1&b=two+words&a=3").unwrap()
log url.stringifyQuery({b: 2, a: "x y", list: [1, 2]})
```

```output
{"a":["1","3"],"b":"two words"}
a=x+y&b=2&list=1&list=2
```

## Set parameters on a URL

`url.withParams(url, params)` returns the URL with the parameters set. Existing ones with the same name are replaced and the rest are kept:

```osl
import "std:url"

string next = url.withParams("https://example.com/s?q=1&keep=yes", {q: "new", page: 2}).unwrap()
log next
```

```output
https://example.com/s?keep=yes&page=2&q=new
```

This is the safe way to add a user's search text to a link: every value is escaped for you.

## Escaping

`url.escape` makes text safe to use as one query key or value, and `url.unescape` reverses it (a `+` becomes a space). Unescaping can fail on a broken `%` sequence, so it returns a result:

```osl
import "std:url"

log url.escape("a b&c=d/é")
log url.unescape("a%20b+c").unwrap()
log url.unescape("100%").isErr()
```

```output
a+b%26c%3Dd%2F%C3%A9
a b c
true
```

## Join and build

`url.join(base, reference)` resolves a link the way a browser does, so a page can turn `../api` into a full address. `url.build` assembles a URL from the same parts `parse` returns:

```osl
import "std:url"

log url.join("https://example.com/docs/guide/", "../api?v=2").unwrap()
log url.join("https://example.com/docs/guide", "/root").unwrap()
log url.build({scheme: "https", host: "example.com", path: "/a b", query: {k: "v"}, fragment: "f"})
```

```output
https://example.com/docs/api?v=2
https://example.com/root
https://example.com/a%20b?k=v#f
```

## Checking input

`url.isValid(text)` is true only for an absolute URL with a scheme and a host, so a relative path or a bare domain is rejected:

```osl
import "std:url"

for text in ["https://example.com", "example.com", "/relative", "ftp://files.example.com/a"] (
  log text url.isValid(text)
)
```

```output
https://example.com true
example.com false
/relative false
ftp://files.example.com/a true
```

A valid URL can still use a scheme you don't want. If a form accepts links, also check `scheme` is `http` or `https` before following one.

:::quiz
Why use `url.withParams` instead of joining `"?q=" ++ text` onto a URL?

- [ ] It is faster.
- [x] It escapes every value, so spaces and `&` in the text can't break the URL.
- [ ] It checks that the site exists.

String joining works until a value contains a character that means something in a URL.
:::

:::exercise title="Next page link"
Given a search URL, print the same URL with `page` set to 2. Keep the existing `q`.

```osl
import "std:url"

string current = "https://example.com/search?q=osl"
log current
```

```output
https://example.com/search?page=2&q=osl
```

> [!hint]
> `url.withParams(url, object)` returns a result.

> [!hint]
> `url.withParams(current, {page: 2}).unwrap()`.

```osl solution
import "std:url"

string current = "https://example.com/search?q=osl"
log url.withParams(current, {page: 2}).unwrap()
```

```output
https://example.com/search?page=2&q=osl
```
:::

## API reference

::api
