# regex

> Regular expression utilities

```javascript
import "osl/regex"
```

## Methods

- `regex.match(pattern, text)` → `boolean`
- `regex.find(pattern, text)` → `string`
- `regex.findAll(pattern, text)` → `array`
- `regex.findSubmatch(pattern, text)` → `array`
- `regex.replace(pattern, text, replacement)` → `string`
- `regex.replaceFunc(pattern, text, fn)` → `string`
- `regex.split(pattern, text)` → `array`
- `regex.count(pattern, text)` → `number`
- `regex.test(pattern)` → `boolean`
- `regex.escape(text)` → `string`
- `regex.isValidEmail(email)` → `boolean`
- `regex.isValidURL(url)` → `boolean`
- `regex.isValidIPv4(ip)` → `boolean`
- `regex.isValidIPv6(ip)` → `boolean`
- `regex.isValidPhone(phone)` → `boolean`
- `regex.extractEmail(text)` → `string`
- `regex.extractEmails(text)` → `array`
- `regex.extractURLs(text)` → `array`
- `regex.extractHashtags(text)` → `array`
- `regex.extractMentions(text)` → `array`
- `regex.extractNumbers(text)` → `array`
- `regex.extractWords(text)` → `array`
- `regex.isAlpha(text)` → `boolean`
- `regex.isAlphanumeric(text)` → `boolean`
- `regex.isNumeric(text)` → `boolean`
- `regex.isHexadecimal(text)` → `boolean`
- `regex.isBase64(text)` → `boolean`
- `regex.isUUID(text)` → `boolean`
- `regex.stripTags(text)` → `string`
- `regex.stripWhitespace(text)` → `string`
- `regex.truncate(text, length, suffix)` → `string`
- `regex.slugify(text)` → `string`
- `regex.camelize(text)` → `string`
- `regex.snakeCase(text)` → `string`
- `regex.kebabCase(text)` → `string`
- `regex.maskEmail(email)` → `string`
- `regex.maskPhoneNumber(phone)` → `string`
- `regex.highlight(text, pattern, color)` → `string`
- `regex.wordCount(text)` → `number`
- `regex.charCount(text, includeSpaces)` → `number`
- `regex.sentenceCount(text)` → `number`
