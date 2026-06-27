# Strings — Encoding, Hashing & Character Codes

Methods for character codes, Base64/hex/binary encoding, cryptographic digests and reading input.

## Character codes

#### `.ord()` → `int`
The character code of the first character.

```javascript
log "A".ord()  // 65
```

> To go the other way (code → character) use the number method `.chr()`, e.g. `(65).chr()` → `"A"`.
> See [Number conversion](../numbers/arithmetic.md).

## Base64, hex & binary

#### `.btoa()` → `string` / `.atob()` → `string`
Base64-encode / decode the string.

```javascript
log "hi".btoa()    // "aGk="
log "aGk=".atob()  // "hi"
```

#### `.encodeHex()` / `.decodeHex()` → `string`
Hex-encode / decode. (Imports `osl/crypto`.)

#### `.encodeBin()` / `.decodeBin()` → `string`
Binary-string encode / decode. (Imports `osl/crypto`.)

## Hashing

#### `.hashMD5()` / `.hashSHA1()` / `.hashSHA256()` / `.hashSHA512()` → `string`
Returns the hex digest of the string using the named algorithm.

```javascript
log "hi".hashSHA256()
// "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4"
```

## Input

#### `.ask()` → `result`
Prints the string as a prompt and reads a line from standard input, returning a
[`result`](../../packages/result.md).

```javascript
auto answer = "Continue? ".ask().unwrapOr("no")
```
