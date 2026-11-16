---
description: Hash data, store passwords safely, encrypt text and files, sign messages and make secure random values.
package: crypto
---

# crypto

`std:crypto` is the toolbox for the security basics: fingerprints of data, password storage, encryption, signatures and random values you can trust. Every function takes text or bytes, so you can pass a string anywhere a `byte[]` is wanted.

Random results change on every run, so the examples print lengths and yes/no answers instead of the random values. Change them and run again.

## Hash something

A hash turns any data into a short fixed-size fingerprint. The same input always gives the same fingerprint, and a different input gives a different one:

```osl
import "std:crypto"

log crypto.sha256("abc")
log crypto.sha256("abd")
log crypto.hash("sha512", "abc").len
```

```output
ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
a52d159f262b2c6ddb724a61840befc36eb30c88877a4030b65cbe86298449c9
128
```

Try changing the text by one letter. Every hex digit changes. Use `sha256` for checksums and fingerprints. `md5` and `sha1` exist for old formats, but they are broken for anything security related.

`crypto.hashFile(path)` hashes a file without loading it all, which is how you check a download.

:::quiz
You store `sha256(password)` in your database. Why is that a bad way to keep passwords?

- [ ] SHA-256 is broken.
- [x] It is fast and has no salt, so attackers can try billions of guesses and reuse work between users.
- [ ] Hashes can be reversed with the right key.

Use `hashPassword`, which is slow on purpose and adds a random salt, as the next section shows.
:::

## Store passwords

`hashPassword` returns text safe to keep. `verifyPassword` checks a login attempt against it. Hash the same password twice and you get two different results, because each has its own random salt:

```osl
import "std:crypto"

string stored = crypto.hashPassword("hunter2").unwrap()

log crypto.verifyPassword("hunter2", stored)
log crypto.verifyPassword("Hunter2", stored)
log crypto.hashPassword("hunter2").unwrap() == stored
log crypto.needsRehash(stored)
```

```output
true
false
false
false
```

Never compare password hashes with `==` yourself. `verifyPassword` does it correctly. When `needsRehash(stored)` turns true (the recommended strength went up), hash the password again at the next successful login and save the new hash.

## Message authentication

An HMAC is a hash that needs a secret key. Only someone with the key can produce or check it, which makes it the tool for signing webhooks and cookies:

```osl
import "std:crypto"

string key = "shared secret"
string tag = crypto.hmac("sha256", key, "amount=10")

log tag.len
log tag == crypto.hmac("sha256", key, "amount=10")
log tag == crypto.hmac("sha256", key, "amount=99")
```

```output
64
true
false
```

When you compare two secret values, use `constantTimeCompare(a, b)`. It takes the same time whether they differ early or late, so an attacker can't learn the answer from timing:

```osl
import "std:crypto"

log crypto.constantTimeCompare("token-1", "token-1")
log crypto.constantTimeCompare("token-1", "token-2")
```

```output
true
false
```

## Encrypt with a password

`encrypt(data, password)` returns text. `decrypt` turns it back, and fails when the password is wrong or the text was changed:

```osl
import "std:crypto"

string sealed = crypto.encrypt("meet at noon", "correct horse")
log sealed != "meet at noon"
log crypto.decrypt(sealed, "correct horse").unwrap()

auto wrong = crypto.decrypt(sealed, "battery staple")
log wrong.isErr() wrong.unwrapErr().kind
```

```output
true
meet at noon
true PermissionError
```

Encryption is authenticated: a wrong password and a tampered message both fail with a `PermissionError`, and neither gives you garbage text. Try deleting a character from `sealed` before decrypting.

## Encrypt with a key

When you have a random key of your own instead of a password, use `aes256Encrypt` and `aes256Decrypt` with a 32-byte key. Make one from random hex:

```osl
import "std:crypto"

byte[] key = crypto.fromHex(crypto.randomHex(32)).unwrap()
log key.len

string box = crypto.aes256Encrypt("account 42", key).unwrap()
log crypto.aes256Decrypt(box, key).unwrap()

byte[] other = crypto.fromHex(crypto.randomHex(32)).unwrap()
log crypto.aes256Decrypt(box, other).isErr()
```

```output
32
account 42
true
```

`toHex` and `fromHex` convert between bytes and hex text. `fromHex` fails with a `ParseError` for text that isn't hex.

## Encrypt files

`encryptFile(from, to, password)` and `decryptFile` do the same to a file on disk:

```osl
import "std:crypto"
import "std:fs"

fs.writeFile("notes.txt", "private notes").unwrap()
crypto.encryptFile("notes.txt", "notes.enc", "pw").unwrap()
crypto.decryptFile("notes.enc", "notes.out", "pw").unwrap()

log fs.readFile("notes.out").unwrap()
log fs.readFile("notes.enc").unwrap() != "private notes"
log crypto.decryptFile("notes.enc", "bad.out", "nope").isErr()

for name in ["notes.txt", "notes.enc", "notes.out", "bad.out"] (
  fs.remove(name, {force: true}).unwrap()
)
```

```output
private notes
true
true
```

## Sign and verify

A signature proves who wrote a message. `ed25519GenerateKeyPair()` returns a private key you keep and a public key you share. Anyone with the public key can check a signature, and nobody without the private key can make one:

```osl
import "std:crypto"

auto keys = crypto.ed25519GenerateKeyPair()
string signature = crypto.ed25519Sign(keys.private, "release v1.2")

log crypto.ed25519Verify(keys.public, "release v1.2", signature)
log crypto.ed25519Verify(keys.public, "release v1.3", signature)
```

```output
true
false
```

Keys and signatures are plain text (base64url), so they fit in a file or a header.

## Random values

Use these for tokens, ids and anything an attacker mustn't guess. Don't use [random](random.md) for secrets, which is for games and simulations:

```osl
import "std:crypto"

log crypto.randomHex(16).len
log crypto.randomString(12).len
log crypto.randomString(5, "01").len
log crypto.randomUUID().len

int roll = crypto.randomBetween(1, 6)
log roll >= 1 roll <= 6
```

```output
32
12
5
36
true true
```

`randomHex(n)` gives `n` bytes as `2n` characters. Pass an alphabet as the second argument of `randomString` to limit the characters.

## Stretching a password into a key

`deriveKey(password, salt)` turns a password into key text with PBKDF2. It is deterministic: the same password and salt always give the same key, so store the salt next to the data:

```osl
import "std:crypto"

string a = crypto.deriveKey("pw", "salt-1", {iterations: 1000})
string b = crypto.deriveKey("pw", "salt-1", {iterations: 1000})
string c = crypto.deriveKey("pw", "salt-2", {iterations: 1000})

log a == b
log a == c
log a.len
```

```output
true
false
64
```

:::exercise title="Sign a webhook"
A webhook is accepted when its signature header equals the HMAC-SHA256 of the body under the shared secret. Write `isValid(body, signature)` that returns true for a matching signature. Use `constantTimeCompare`.

```osl
import "std:crypto"

string secret = "whsec_demo"

def isValid(string body, string signature) boolean (
  return false
)

string body = `{"event":"paid"}`
string good = crypto.hmac("sha256", secret, body)
log isValid(body, good)
log isValid(body, "0000")
log isValid(`{"event":"refund"}`, good)
```

```output
true
false
false
```

> [!hint]
> Work out the expected signature with `crypto.hmac("sha256", secret, body)`.

> [!hint]
> `return crypto.constantTimeCompare(expected, signature)`.

```osl solution
import "std:crypto"

string secret = "whsec_demo"

def isValid(string body, string signature) boolean (
  string expected = crypto.hmac("sha256", secret, body)
  return crypto.constantTimeCompare(expected, signature)
)

string body = `{"event":"paid"}`
string good = crypto.hmac("sha256", secret, body)
log isValid(body, good)
log isValid(body, "0000")
log isValid(`{"event":"refund"}`, good)
```

```output
true
false
false
```
:::

:::exercise title="Seal and open"
Write `seal(text, password)` and `open(sealed, password)`. `open` should return the text, or `"locked"` when the password is wrong.

```osl
import "std:crypto"

def seal(string text, string password) string (
  return text
)

def open(string sealed, string password) string (
  return sealed
)

string box = seal("the cake is real", "lie")
log open(box, "lie")
log open(box, "truth")
```

```output
the cake is real
locked
```

> [!hint]
> `crypto.encrypt(text, password)` seals, and `crypto.decrypt(...)` returns a result.

> [!hint]
> `.unwrapOr("locked")` covers the failure.

```osl solution
import "std:crypto"

def seal(string text, string password) string (
  return crypto.encrypt(text, password)
)

def open(string sealed, string password) string (
  return crypto.decrypt(sealed, password).unwrapOr("locked")
)

string box = seal("the cake is real", "lie")
log open(box, "lie")
log open(box, "truth")
```

```output
the cake is real
locked
```
:::

## API reference

::api
