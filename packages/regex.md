# regex

> Regular expressions plus validators and text helpers

Use `regex` for regular expressions, replacements, splitting, validation helpers, and text extraction.

```javascript
import "osl/regex"
```

## Example

```javascript
import "osl/regex"

log regex.match("[a-z]+", "hello123")
log regex.findAll("[0-9]+", "abc123def456")
```

## API reference

### `regex`

| Method | Returns | Description |
| --- | --- | --- |
| `regex.match(pattern: any, text: any)` | `boolean` | Runs the match operation. |
| `regex.find(pattern: any, text: any)` | `string` | Runs the find operation. |
| `regex.findAll(pattern: any, text: any)` | `array` | Runs the find all operation. |
| `regex.findSubmatch(pattern: any, text: any)` | `array` | Runs the find submatch operation. |
| `regex.replace(pattern: any, text: any, replacement: any)` | `string` | Runs the replace operation. |
| `regex.replaceFunc(pattern: any, text: any, fn: any)` | `string` | Runs the replace func operation. |
| `regex.split(pattern: any, text: any)` | `array` | Runs the split operation. |
| `regex.count(pattern: any, text: any)` | `number` | Runs the count operation. |
| `regex.test(pattern: any)` | `boolean` | Runs the test operation. |
| `regex.escape(text: any)` | `string` | Runs the escape operation. |
| `regex.isValidEmail(email: any)` | `boolean` | Reports whether valid email. |
| `regex.isValidURL(url: any)` | `boolean` | Reports whether valid url. |
| `regex.isValidIPv4(ip: any)` | `boolean` | Reports whether valid ipv4. |
| `regex.isValidIPv6(ip: any)` | `boolean` | Reports whether valid ipv6. |
| `regex.isValidPhone(phone: any)` | `boolean` | Reports whether valid phone. |
| `regex.extractEmail(text: any)` | `string` | Runs the extract email operation. |
| `regex.extractEmails(text: any)` | `array` | Runs the extract emails operation. |
| `regex.extractURLs(text: any)` | `array` | Runs the extract urls operation. |
| `regex.extractHashtags(text: any)` | `array` | Runs the extract hashtags operation. |
| `regex.extractMentions(text: any)` | `array` | Runs the extract mentions operation. |
| `regex.extractNumbers(text: any)` | `array` | Runs the extract numbers operation. |
| `regex.extractWords(text: any)` | `array` | Runs the extract words operation. |
| `regex.isAlpha(text: any)` | `boolean` | Reports whether alpha. |
| `regex.isAlphanumeric(text: any)` | `boolean` | Reports whether alphanumeric. |
| `regex.isNumeric(text: any)` | `boolean` | Reports whether numeric. |
| `regex.isHexadecimal(text: any)` | `boolean` | Reports whether hexadecimal. |
| `regex.isBase64(text: any)` | `boolean` | Reports whether base64. |
| `regex.isUUID(text: any)` | `boolean` | Reports whether uuid. |
| `regex.stripTags(text: any)` | `string` | Runs the strip tags operation. |
| `regex.stripWhitespace(text: any)` | `string` | Runs the strip whitespace operation. |
| `regex.truncate(text: any, length: any, suffix: any)` | `string` | Runs the truncate operation. |
| `regex.slugify(text: any)` | `string` | Runs the slugify operation. |
| `regex.camelize(text: any)` | `string` | Runs the camelize operation. |
| `regex.snakeCase(text: any)` | `string` | Runs the snake case operation. |
| `regex.kebabCase(text: any)` | `string` | Runs the kebab case operation. |
| `regex.maskEmail(email: any)` | `string` | Runs the mask email operation. |
| `regex.maskPhoneNumber(phone: any)` | `string` | Runs the mask phone number operation. |
| `regex.highlight(text: any, pattern: any, color: any)` | `string` | Runs the highlight operation. |
| `regex.wordCount(text: any)` | `number` | Runs the word count operation. |
| `regex.charCount(text: any, includeSpaces: any)` | `number` | Runs the char count operation. |
| `regex.sentenceCount(text: any)` | `number` | Runs the sentence count operation. |

## Notes

- Standard-library imports accept both `import "osl/regex"` and `import "regex"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
