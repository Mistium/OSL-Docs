# regex

Use `regex` for regular expressions, replacements, splitting, validation helpers, and text extraction.

```osl
import "std:regex"
```

## Example

```osl
import "std:regex"

log regex.match("[a-z]+", "hello123")
log regex.findAll("[0-9]+", "abc123def456")
```

## API reference

### `regex`

| Method | Returns | Notes |
| --- | --- | --- |
| `regex.match(pattern: any, text: any)` | `boolean` |  |
| `regex.find(pattern: any, text: any)` | `string` |  |
| `regex.findAll(pattern: any, text: any)` | `array` | Returns every non-overlapping match. |
| `regex.findSubmatch(pattern: any, text: any)` | `array` | Returns the full match and capture groups, or an empty array. |
| `regex.replace(pattern: any, text: any, replacement: any)` | `string` |  |
| `regex.replaceFunc(pattern: any, text: any, fn: any)` | `string` |  |
| `regex.split(pattern: any, text: any)` | `array` |  |
| `regex.count(pattern: any, text: any)` | `number` |  |
| `regex.test(pattern: any)` | `boolean` |  |
| `regex.escape(text: any)` | `string` |  |
| `regex.isValidEmail(email: any)` | `boolean` |  |
| `regex.isValidURL(url: any)` | `boolean` |  |
| `regex.isValidIPv4(ip: any)` | `boolean` |  |
| `regex.isValidIPv6(ip: any)` | `boolean` |  |
| `regex.isValidPhone(phone: any)` | `boolean` |  |
| `regex.extractEmail(text: any)` | `string` |  |
| `regex.extractEmails(text: any)` | `array` |  |
| `regex.extractURLs(text: any)` | `array` |  |
| `regex.extractHashtags(text: any)` | `array` |  |
| `regex.extractMentions(text: any)` | `array` |  |
| `regex.extractNumbers(text: any)` | `array` |  |
| `regex.extractWords(text: any)` | `array` |  |
| `regex.isAlpha(text: any)` | `boolean` |  |
| `regex.isAlphanumeric(text: any)` | `boolean` |  |
| `regex.isNumeric(text: any)` | `boolean` |  |
| `regex.isHexadecimal(text: any)` | `boolean` |  |
| `regex.isBase64(text: any)` | `boolean` |  |
| `regex.isUUID(text: any)` | `boolean` |  |
| `regex.stripTags(text: any)` | `string` |  |
| `regex.stripWhitespace(text: any)` | `string` |  |
| `regex.truncate(text: any, length: any, suffix: any)` | `string` |  |
| `regex.slugify(text: any)` | `string` |  |
| `regex.camelize(text: any)` | `string` |  |
| `regex.snakeCase(text: any)` | `string` |  |
| `regex.kebabCase(text: any)` | `string` |  |
| `regex.maskEmail(email: any)` | `string` |  |
| `regex.maskPhoneNumber(phone: any)` | `string` |  |
| `regex.highlight(text: any, pattern: any, color: any)` | `string` |  |
| `regex.wordCount(text: any)` | `number` |  |
| `regex.charCount(text: any, includeSpaces: any)` | `number` |  |
| `regex.sentenceCount(text: any)` | `number` |  |

## Notes

- Prefer `import "std:regex"`; the older `import "osl/regex"` spelling remains supported.

## Behavior and limits

Invalid patterns and replacement callback failures return errors. Matching code makes bounded
progress after an empty match. Truncation counts Unicode code points and treats a negative limit as
zero, while `charCount` reports UTF-8 bytes. IP and Base64 validators use Go's parsers.
