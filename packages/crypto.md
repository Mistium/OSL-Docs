# crypto

Use `crypto` for hashes, HMACs, password hashing, authenticated encryption, Ed25519 signatures, and
cryptographically secure random values. For fast, seedable randomness that isn't secret, use
[`random`](random.md).

```osl
import "std:crypto"
```

## Example

```osl
import "std:crypto"

log crypto.sha256("hello")
log crypto.hash("sha3-256", "hello")

string mac = crypto.hmac("sha256", "secret-key", "message")
log crypto.constantTimeCompare(mac, crypto.hmac("sha256", "secret-key", "message")) // true

string stored = crypto.hashPassword("hunter2")
log crypto.verifyPassword("hunter2", stored) // true

string sealed = crypto.encrypt("top secret", "correct horse")
string plain = crypto.decrypt(sealed, "correct horse") catch (err) (
  log err // PermissionError for a wrong password or modified data
  return
)
log plain
```

Parameters typed `byte[]` below also accept a string, which is used as its UTF-8 bytes.

## API reference

### Hashes and HMACs

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.hash(algorithm: string, data: byte[])` | `string` | The hex digest of `data`. Algorithms: `md5`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `sha3-224`, `sha3-256`, `sha3-384`, `sha3-512`, in any case. |
| `crypto.md5(data: byte[])` | `string` | Hex MD5. MD5 is broken for security; use it only for checksums and compatibility. |
| `crypto.sha1(data: byte[])` | `string` | Hex SHA-1. Broken for security; use it only for checksums and compatibility. |
| `crypto.sha256(data: byte[])` | `string` | Hex SHA-256. |
| `crypto.sha512(data: byte[])` | `string` | Hex SHA-512. |
| `crypto.hmac(algorithm: string, key: byte[], data: byte[])` | `string` | The hex HMAC of `data` under `key`, with any algorithm `crypto.hash` accepts. |
| `crypto.constantTimeCompare(a: byte[], b: byte[])` | `boolean` | Whether `a` and `b` are equal, taking the same time wherever they differ. Use it to compare secrets such as HMACs. |
| `crypto.hashFile(path: string, options?: object)` | `result<string, error>` | The hex digest of a file, read in pieces. Option: `algorithm` (default `"sha256"`). |
| `crypto.hashDirectory(path: string, options?: object)` | `result<string, error>` | One hex digest covering every file below a directory: each file's relative path and contents, so it changes when a file is added, removed, renamed, or edited. Option: `algorithm` (default `"sha256"`). |

### Passwords and keys

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.hashPassword(password: string, options?: object)` | `result<string, error>` | Hashes a password for storage with a random salt. Argon2id by default, giving a `$argon2id$...` string. Options: `algorithm` (`"argon2id"` or `"bcrypt"`) and `cost` (bcrypt's work factor from 4 to 31, default 10). |
| `crypto.verifyPassword(password: string, hash: string)` | `boolean` | Whether `password` matches a hash from `hashPassword`: Argon2id, bcrypt, or the salted SHA-256 format earlier versions produced. A hash it can't read is `false`. |
| `crypto.needsRehash(hash: string)` | `boolean` | Whether a stored hash is weaker than what `hashPassword` produces now (bcrypt, old salted SHA-256, or lighter Argon2id settings). After a successful `verifyPassword`, store a fresh `hashPassword(password)`. |
| `crypto.deriveKey(password: string, salt: byte[], options?: object)` | `string` | A PBKDF2 key as hex. Use a random salt of at least 16 bytes and store it with the result. Options: `iterations` (default 600000), `length` in bytes (default 32), and `hash` (default `"sha256"`). |

### Encryption

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.encrypt(data: byte[], password: string)` | `string` | Encrypts with a password. The password is stretched with Argon2id and a random salt, and the data is sealed with AES-256-GCM, so the result reveals only the data's length and any change to it is detected. |
| `crypto.decrypt(data: string, password: string)` | `result<string, error>` | Decrypts text from `crypto.encrypt`, including text from earlier versions. |
| `crypto.encryptFile(inputPath: string, outputPath: string, password: string)` | `result<unit, error>` | Encrypts a file like `crypto.encrypt` and writes the text to `outputPath`. |
| `crypto.decryptFile(inputPath: string, outputPath: string, password: string)` | `result<unit, error>` | Decrypts a file from `encryptFile` and writes the original bytes, readable only by the owner when new. |
| `crypto.aes256Encrypt(key: string, data: byte[])` | `string` | AES-256-GCM under a raw key, as hex, with a fresh random nonce. `key` should be 32 random bytes; a shorter key is zero-padded and a longer one hashed with SHA-256. To encrypt with a password, use `crypto.encrypt`. |
| `crypto.aes256Decrypt(key: string, ciphertext: string)` | `result<string, error>` | Decrypts text from `aes256Encrypt` with the same key. |
| `crypto.secureErase(path: string)` | `result<unit, error>` | Overwrites a regular file with random bytes three times, flushing each pass to the device, then deletes it. Best effort: on SSDs, copy-on-write or journaling filesystems, and wherever backups or snapshots exist, copies can survive. |

### Signatures

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.ed25519GenerateKeyPair()` | `{private, public}` | A new Ed25519 key pair: the 32-byte private seed and the public key, each as unpadded base64url. Keep `private` secret. |
| `crypto.ed25519Sign(privateKey: string, data: byte[])` | `string` | Signs `data`. The key may be base64url or hex, as the 32-byte seed or the 64-byte private key. Returns an unpadded base64url signature. |
| `crypto.ed25519Verify(publicKey: string, data: byte[], signature: string)` | `boolean` | Whether `signature` is a valid signature of `data` by `publicKey` (base64url or hex). A malformed key or signature is `false`. |

```osl
import "std:crypto"

auto keys = crypto.ed25519GenerateKeyPair()
string signature = crypto.ed25519Sign(keys.private, "hello")
log crypto.ed25519Verify(keys.public, "hello", signature) // true
```

### Random values and encoding

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.randomHex(size: int)` | `string` | `size` secure random bytes as hex, so the text is `2 * size` characters. |
| `crypto.randomBetween(min: int, max: int)` | `int` | A secure random whole number from `min` to `max`, both included. The bounds may come in either order. |
| `crypto.randomFloat(min?: number, max?: number)` | `number` | `randomFloat()` is from 0 up to but not including 1, `randomFloat(max)` from 0 up to `max`, and `randomFloat(min, max)` from `min` up to `max`. |
| `crypto.randomString(length: int, alphabet?: string)` | `string` | `length` secure random letters and digits, or characters of `alphabet`, as in `crypto.randomString(6, "0123456789")`. |
| `crypto.randomUUID()` | `string` | A random version 4 UUID. |
| `crypto.toHex(data: byte[])` | `string` | Lowercase hex. |
| `crypto.fromHex(text: string)` | `result<byte[], error>` | Decodes hex in either case. |

## Errors

Failures from outside the program are results:

- `decrypt`, `aes256Decrypt`, and `decryptFile` fail with `ParseError` when the input isn't
  ciphertext from this package, and `PermissionError` for the wrong password or key, or modified
  data.
- `fromHex` fails with `ParseError` for an odd length or a character that isn't a hex digit.
- The file functions fail with `NotFoundError`, `PermissionError`, or `IOError` when a file can't
  be read or written. `hashDirectory` fails with `UnsupportedError` when the tree contains a
  symbolic link, and `secureErase` for anything but a regular file.
- `hashPassword` fails with `ValueError` when bcrypt is asked to hash a password over its 72-byte
  limit.

Bad arguments throw:

- `ValueError` for an unknown hash algorithm, a size or length outside 0 to 16777216, an empty
  alphabet, a bad `hashPassword` or `deriveKey` option, or an Ed25519 private key that isn't a
  valid seed or private key.
- `TypeError` for `randomFloat` with more than two arguments or a non-number.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning:

| Deprecated | Use instead |
| --- | --- |
| `crypto.sha3_256(data)` | `crypto.hash("sha3-256", data)` |
| `crypto.md5Hash(data)` | `crypto.md5(data)` |
| `crypto.hmacSha256(key, data)`, `crypto.hmacSha512(key, data)` | `crypto.hmac("sha256", key, data)`, `crypto.hmac("sha512", key, data)` |
| `crypto.sign(key, data)`, `crypto.verify(key, data, signature)` | `crypto.hmac("sha256", key, data)` checked with `crypto.constantTimeCompare`, or `crypto.ed25519Sign` / `ed25519Verify`. `sign` is `sha256(key + data)`, which anyone who has seen one signature can extend, so it is not a secure signature. |
| `crypto.randomBytes(size)` | `crypto.randomHex(size)` |
| `crypto.randomInt(max)`, `crypto.randomInt(min, max)`, `crypto.random(min, max)` (max excluded) | `crypto.randomBetween(min, max)` (both included) |
| `crypto.uuidv4()` | `crypto.randomUUID()` |
| `crypto.hexEncode(data)` | `crypto.toHex(data)` or `text.encodeHex()` |
| `crypto.hexDecode(text)` (`""` for invalid hex) | `crypto.fromHex(text)` or `text.decodeHex()` |
| `crypto.binEncode(data)`, `crypto.binDecode(text)` | `text.encodeBin()`, `text.decodeBin()` |
| `crypto.base64Encode(data)`, `crypto.base64Decode(text)` | `btoa(data)`, `atob(text)` |
| `crypto.generateKeyPair()` (hex keys) | `crypto.ed25519GenerateKeyPair()` (base64url keys; both encodings sign and verify) |
| `crypto.bcryptHash(password, cost)` (`""` on failure) | `crypto.hashPassword(password, {algorithm: "bcrypt", cost})`, or `crypto.hashPassword(password)` for Argon2id |
| `crypto.bcryptVerify(password, hash)` | `crypto.verifyPassword(password, hash)` |
| `crypto.pbkdf2(password, salt, iterations, length, hash)` (`""` on failure) | `crypto.deriveKey(password, salt, {iterations, length, hash})` |

## Notes

- Prefer `import "std:crypto"`; the older `import "osl/crypto"` spelling remains supported.
- `crypto.encrypt` output starts with `osl1:`. `crypto.decrypt` still reads the format earlier
  versions produced.
