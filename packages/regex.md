# regex

Use `regex` for regular expressions (matching, finding, replacing, splitting), compiled patterns, and text validators and extractors built on them.

```osl
import "std:regex"
```

## Example

```osl
import "std:regex"

log regex.match("[a-z]+", "hello123")            // true
log regex.findAll("[0-9]+", "abc123def456")      // ["123","456"]
string first = regex.findFirst("[0-9]+", "none here") ?? "no digits"
log first
log regex.replace("(\\w+)@(\\w+)", "ada@home", "$2 at $1") // home at ada
```

Patterns use RE2 syntax, as in Go: no backreferences or lookaround, and matching always takes linear time.

### Compiled patterns

Use `regex.compile` for a pattern you reuse, want flags on, or got from outside the program. An invalid pattern fails the result with `ValueError` instead of throwing:

```osl
import "std:regex"

*regex.Pattern pair = regex.compile("^(?P<key>\\w+)=(?P<value>.*)$", {multiline: true})
log pair.findAll("a=1\nb=2")          // ["a=1","b=2"]
log pair.findSubmatch("name=Ada")     // ["name=Ada","name","Ada"]
log pair.groupNames()                 // ["key","value"]

auto userPattern = regex.compile("(")
if userPattern.isErr() (
  log userPattern.unwrapErr().message
)
```

## API reference

### Matching

The package functions take the pattern as their first argument and throw `ValueError` for an invalid pattern. Compiled patterns cannot be invalid, so their methods never throw.

| Function | `*regex.Pattern` method | Returns | Notes |
| --- | --- | --- | --- |
| `regex.match(pattern, text)` | `p.match(text)` | `boolean` | Whether the pattern matches anywhere in the text. |
| `regex.findFirst(pattern, text)` | `p.findFirst(text)` | `string?` | The first match, or `null`. |
| `regex.findAll(pattern, text)` | `p.findAll(text)` | `string[]` | Every non-overlapping match, in order. |
| `regex.findSubmatch(pattern, text)` | `p.findSubmatch(text)` | `string[]` | The first match followed by each capture group (`""` for a group that didn't take part), or `[]` when nothing matches. |
| `regex.replace(pattern, text, replacement)` | `p.replace(text, replacement)` | `string` | Replaces every match. `$1` or `${name}` stands for a capture group and `$$` for a literal `$`. |
| `regex.replaceFunc(pattern, text, fn)` | `p.replaceFunc(text, fn)` | `string` | Replaces every match with what `fn(match)` returns. |
| `regex.split(pattern, text)` | `p.split(text)` | `string[]` | Splits around every match. Text without a match comes back whole. |
| `regex.count(pattern, text)` | `p.count(text)` | `int` | How many non-overlapping matches the text has. |
| | `p.groupNames()` | `string[]` | Capture group names in order, `""` for an unnamed group. |
| | `p.source()` | `string` | The pattern text, including any `(?flags)` the options added. |

| Function | Returns | Notes |
| --- | --- | --- |
| `regex.compile(pattern: string, options?: object)` | `result<*regex.Pattern, error>` | Options: `ignoreCase`, `multiline` (`^` and `$` match at line breaks), and `dotAll` (`.` matches a line break), all `false` by default. Fails with `ValueError` for an invalid pattern. |
| `regex.isValid(pattern: string)` | `boolean` | Whether the pattern compiles. |
| `regex.escape(text: string)` | `string` | Escapes every metacharacter so the text matches itself literally. |

### Validators

All return `boolean`.

| Function | True when |
| --- | --- |
| `regex.isValidEmail(email)` | The text looks like `name@domain.tld`. A shape check only. |
| `regex.isValidURL(url)` | An `http` or `https` URL with a domain name. |
| `regex.isValidIPv4(ip)` | An IPv4 address such as `192.168.0.1`. |
| `regex.isValidIPv6(ip)` | An IPv6 address such as `::1`. |
| `regex.isValidPhone(phone)` | 10 to 14 digits with an optional leading `+`, ignoring spaces, dashes, and parentheses. |
| `regex.isAlpha(text)` | One or more ASCII letters. |
| `regex.isAlphanumeric(text)` | One or more ASCII letters and digits. |
| `regex.isNumeric(text)` | One or more digits `0` to `9`, with no sign or decimal point. |
| `regex.isHexadecimal(text)` | One or more hex digits, with an optional `0x` prefix. |
| `regex.isBase64(text)` | Standard padded base64, ignoring line breaks. `""` counts as valid. |
| `regex.isUUID(text)` | A UUID such as `3b241101-e2bb-4255-8caf-4136c566a962`, in either case. |

### Extractors

All return `string[]`, in order of appearance.

| Function | Finds |
| --- | --- |
| `regex.extractEmails(text)` | Email addresses. |
| `regex.extractURLs(text)` | `http` and `https` URLs. |
| `regex.extractHashtags(text)` | `#hashtags`, including the `#`. |
| `regex.extractMentions(text)` | `@mentions`, including the `@`. |
| `regex.extractNumbers(text)` | Runs of digits, as strings. |
| `regex.extractWords(text)` | Runs of letters in any language, which may contain an apostrophe (`don't`, `café`). |

### Text helpers

| Function | Returns | Notes |
| --- | --- | --- |
| `regex.stripTags(text)` | `string` | Removes anything that looks like an HTML tag. Not a sanitizer; don't rely on it to make input safe. |
| `regex.stripWhitespace(text)` | `string` | Trims and collapses each run of whitespace to one space. |
| `regex.truncate(text, length, suffix)` | `string` | Keeps the first `length` characters and appends `suffix`, or returns the text unchanged when it is short enough. |
| `regex.slugify(text)` | `string` | `"Hello World!"` to `"hello-world"`. |
| `regex.camelize(text)` | `string` | `"hello_world"` to `"helloWorld"`. |
| `regex.snakeCase(text)` | `string` | `"helloWorld"` to `"hello_world"`. |
| `regex.kebabCase(text)` | `string` | `"helloWorld"` to `"hello-world"`. |
| `regex.maskEmail(email)` | `string` | `"john@example.com"` to `"j***@example.com"`. |
| `regex.maskPhoneNumber(phone)` | `string` | Replaces every character but the last four with `*`. |
| `regex.wordCount(text)` | `int` | How many words `extractWords` finds. |
| `regex.charCount(text, includeSpaces)` | `int` | How many characters the text has, leaving out spaces unless `includeSpaces` is `true`. |
| `regex.sentenceCount(text)` | `int` | The pieces between `.`, `!`, and `?` that contain more than whitespace. |

## Changes from earlier versions

`regex.test(pattern)` is now `regex.isValid(pattern)`, and `regex.find` is now `regex.findFirst`, which returns `null` for no match and throws for an invalid pattern. `regex.extractEmail` gave way to `regex.extractEmails`, and `regex.highlight` to `regex.replace` with an ANSI color code around `$0`.

## Behavior and limits

- The package functions cache compiled patterns, up to 1,024 distinct ones. Further patterns still work and are compiled on each call.
- Matching makes progress after an empty match, so loops over matches always end.
- `truncate` and `charCount` count Unicode characters, not bytes.
- The older `import "osl/regex"` spelling still works with a migration warning.
