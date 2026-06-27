# Strings - Case & Whitespace

Methods that change letter case or strip surrounding whitespace. None mutate the original string.

#### `.toUpper()` → `string`
Uppercases every letter.

```javascript
log "hello".toUpper()  // "HELLO"
```

#### `.toLower()` → `string`
Lowercases every letter.

```javascript
log "HELLO".toLower()  // "hello"
```

#### `.toTitle()` → `string`
Capitalises the first letter of each word.

```javascript
log "ada lovelace".toTitle()  // "Ada Lovelace"
```

#### `.trim()` → `string`
Removes leading and trailing whitespace.

```javascript
log "  hi  ".trim()  // "hi"
```

#### `.strip()` → `string`
Alias for `.trim()`.
