---
description: Find, capture, replace and split text with regular expressions, validate common formats, and reshape text with ready-made helpers.
package: regex
---

# regex

A regular expression (regex) is a small pattern language for text: "one or more digits", "a word followed by an @", "anything between two quotes". `std:regex` runs these patterns for you. Reach for it when plain `contains` and `split` aren't precise enough: pulling numbers out of a log line, checking that input has the right shape, or rewriting text by rule.

The syntax is RE2, the same as Go. It supports groups, classes, repetition and flags, and it runs in time proportional to the text, so a bad pattern can't hang your program. It has no backreferences or lookahead.

This page also covers the ready-made helpers (`isValidEmail`, `slugify`, `extractURLs`) that save you writing the pattern at all.

## Writing patterns in strings

A pattern is a normal string. Because `\` starts an escape in an OSL string, write `\\d` to get the regex `\d` (a digit). Here are the building blocks used in this page:

| Pattern | Matches |
| --- | --- |
| `\\d` `\\w` `\\s` | a digit, a word character, a space |
| `.` | any character |
| `+` `*` `?` | one or more, zero or more, optional |
| `{4}` `{2,3}` | exactly 4, or 2 to 3 |
| `[abc]` `[a-z]` `[^0-9]` | a character from a set, a range, or not in a set |
| `^` `$` | start and end of the text |
| `( )` | a group you can capture |
| `a\|b` | a or b |

## Does it match?

`regex.match(pattern, text)` is true when the pattern matches anywhere in the text. Add `^` and `$` to require that it matches the whole text:

```osl
import "std:regex"

log regex.match("\\d+", "order 66")
log regex.match("^\\d+$", "order 66")
log regex.match("^\\d+$", "66")
```

```output
true
false
true
```

## Finding text

`findFirst` returns the first match, or `null` when there is none, so `??` gives a default. `findAll` returns every match, and `count` says how many:

```osl
import "std:regex"

string text = "abc 123 def 45"
log regex.findFirst("\\d+", text)
log regex.findFirst("\\d+", "no digits") ?? "nothing"
log regex.findAll("\\d+", text)
log regex.count("a", "banana")
```

```output
123
nothing
["123","45"]
3
```

Matches don't overlap, and they are found left to right.

## Capturing parts

Brackets make a group. `findSubmatch` returns the whole match, then what each group captured. It returns an empty array when nothing matches:

```osl
import "std:regex"

auto parts = regex.findSubmatch("(\\d{4})-(\\d{2})-(\\d{2})", "due on 2024-03-15 sharp")
log parts
log parts[1]
log parts[2] parts[3] parts[4]
log regex.findSubmatch("xyz", "nothing here").len
```

```output
["2024-03-15","2024","03","15"]
2024-03-15
2024 03 15
0
```

Index 1 is the whole match and the groups follow, because arrays count from 1. Check `parts.len` before reading groups of text that might not match.

## Replacing

`replace(pattern, text, replacement)` replaces every match. In the replacement, `$1`, `$2` and so on insert the captured groups, which lets you reorder text:

```osl
import "std:regex"

log regex.replace("\\s+", "too    many \t spaces", " ")
log regex.replace("(\\w+)@(\\w+)", "ada@home", "$2:$1")
log regex.replace("(\\d{4})-(\\d{2})-(\\d{2})", "2024-03-15", "$3/$2/$1")
```

```output
too many spaces
home:ada
15/03/2024
```

When a fixed replacement isn't enough, `replaceFunc` calls a function for each match and uses what it returns:

```osl
import "std:regex"

auto doubled = regex.replaceFunc("\\d+", "3 apples and 12 pears", n -> "" ++ (n.as<int> * 2))
log doubled
```

```output
6 apples and 24 pears
```

## Splitting

`split` cuts text around every match, which handles separators that vary:

```osl
import "std:regex"

log regex.split("[,;]\\s*", "a, b;c,   d")
log regex.split("\\s+", "split   on any   whitespace")
```

```output
["a","b","c","d"]
["split","on","any","whitespace"]
```

## Compiled patterns

The functions above read the pattern from a string on each call. When you use one pattern many times, or want to check it up front, compile it with `regex.compile`. It returns a [result](result.md), failing with a `ValueError` if the pattern is invalid:

```osl
import "std:regex"

auto bad = regex.compile("(unclosed")
log bad.isErr()
log bad.unwrapErr().kind

auto date = regex.compile("(?P<year>\\d{4})-(?P<month>\\d{2})").unwrap()
log date.match("due 2024-03")
log date.findSubmatch("due 2024-03")
log date.groupNames()
log date.count("2024-01 and 2025-02")
log date.replace("2024-03", "$month/$year")
log date.source()
```

```output
true
ValueError
true
["2024-03","2024","03"]
["year","month"]
2
03/2024
(?P<year>\d{4})-(?P<month>\d{2})
```

A `*regex.Pattern` has the same operations as the functions (`match`, `findFirst`, `findAll`, `findSubmatch`, `count`, `replace`, `replaceFunc`, `split`), without the pattern argument. Named groups, written `(?P<name>...)`, can be used in the replacement as `$name`.

`regex.isValid(pattern)` is a quick check when you only want to know if text is a legal pattern, for example one a user typed.

## Flags

Pass options to `compile` for case-insensitive or multi-line matching, or put the flags in the pattern as `(?i)`:

```osl
import "std:regex"

auto ci = regex.compile("hello", {ignoreCase: true}).unwrap()
log ci.replace("Hello HELLO hello", "x")

auto lines = regex.compile("^\\w+", {multiline: true}).unwrap()
log lines.findAll("one two\nthree four")

log regex.replace("(?i)hello", "Hello HELLO", "x")
```

```output
x x x
["one","three"]
x x
```

The options are `ignoreCase`, `multiline` (`^` and `$` match at each line) and `dotAll` (`.` also matches a new line).

## Escaping user text

If you build a pattern from text you don't control, escape it first, so characters like `.` and `*` mean themselves:

```osl
import "std:regex"

string needle = "a.b*c"
log regex.escape(needle)
log regex.match(regex.escape(needle), "xx a.b*c xx")
log regex.match(needle, "xx aXbbbc xx")
```

```output
a\.b\*c
true
true
```

The third line shows the danger: unescaped, `a.b*c` is a pattern that matches `aXbbbc`.

## Validating common formats

Common checks come ready-made. They are practical sanity checks, not full standards: `isValidEmail` accepts anything shaped like `name@domain.tld`, and the only real proof an address works is to send mail to it.

```osl
import "std:regex"

log regex.isValidEmail("ada@example.com") regex.isValidEmail("not an email")
log regex.isValidURL("https://osl-lang.org") regex.isValidURL("osl-lang.org")
log regex.isValidIPv4("192.168.0.1") regex.isValidIPv6("::1")
log regex.isUUID("123e4567-e89b-12d3-a456-426614174000")
log regex.isNumeric("123") regex.isNumeric("12.5")
log regex.isAlpha("abc") regex.isAlphanumeric("abc123") regex.isHexadecimal("ff09")
```

```output
true false
true false
true true
true
true false
true true true
```

The rest of the family: `isValidPhone`, `isBase64`.

## Extracting things from text

The `extract` functions scan free text and return what they find, in order:

```osl
import "std:regex"

string post = "Thanks @ada! Docs at https://osl-lang.org/docs, mail bo@example.com #osl #docs, 3 or 12 tips."
log regex.extractMentions(post)
log regex.extractHashtags(post)
log regex.extractURLs(post)
log regex.extractEmails(post)
log regex.extractNumbers(post)
log regex.extractWords("Hi, there!")
```

```output
["@ada","@example"]
["#osl","#docs"]
["https://osl-lang.org/docs,"]
["bo@example.com"]
["3","12"]
["Hi","there"]
```

Two things to notice. `extractMentions` also found `@example`, inside the email address, because it looks for any `@` followed by word characters. And the URL kept its trailing comma: the helper takes everything up to the next space. Trim or filter the results yourself if your text has such cases, or write your own pattern with `findAll`.

## Reshaping text

Case and layout helpers cover everyday renaming and cleanup:

```osl
import "std:regex"

log regex.slugify("Hello World_Foo!")
log regex.camelize("hello_world") regex.snakeCase("helloWorld") regex.kebabCase("helloWorld")
log regex.truncate("A long sentence about regex", 11, "...")
log regex.stripTags("<p>Hello <b>there</b></p>")
log regex.stripWhitespace("  tidy    up   this  ")
log regex.maskEmail("ada@example.com") regex.maskPhoneNumber("5551234567")
log regex.wordCount("one two three") regex.sentenceCount("One. Two! Three?")
```

```output
hello-world-foo
helloWorld hello_world hello-world
A long sent...
Hello there
tidy up this
a***@example.com ******4567
3 3
```

`slugify` is what you want for URLs from titles. `stripTags` is a cleanup aid, not a security boundary: escape or sanitise HTML properly before showing untrusted text in a page.

## Example: parsing log lines

Putting it together: compile once, capture parts, and skip lines that don't fit.

```osl
import "std:regex"

auto line = regex.compile("^(\\w+) (\\d{3}) (\\d+)ms$").unwrap()
string[] logs = ["GET 200 12ms", "POST 500 340ms", "garbage", "GET 404 8ms"]

int slow = 0
for entry in logs (
  auto parts = line.findSubmatch(entry)
  if parts.len == 0 ( continue )
  if parts[4].as<int> > 100 ( slow++ )
  log parts[2] parts[3]
)
log "slow requests:" slow
```

```output
GET 200
POST 500
GET 404
slow requests: 1
```

:::exercise title="Reformat phone numbers"
Rewrite every number written as `5551234567` into `(555) 123-4567`, leaving the rest of the sentence alone.

```osl
import "std:regex"

string text = "Call 5551234567 or 5559876543 today."

log text
```

```output
Call (555) 123-4567 or (555) 987-6543 today.
```

> [!hint]
> Capture three groups: three digits, three digits, four digits.

> [!hint]
> Use `$1`, `$2` and `$3` in the replacement.

```osl solution
import "std:regex"

string text = "Call 5551234567 or 5559876543 today."

log regex.replace("(\\d{3})(\\d{3})(\\d{4})", text, "($1) $2-$3")
```
:::

## API reference

::api
