# crypto

> Hashing, HMAC, AES, password hashing, file encryption, random

Use `crypto` for hashing, random values, encoding helpers, password checks, signatures, and file encryption helpers.

```javascript
import "osl/crypto"
```

## Example

```javascript
import "osl/crypto"

string digest = crypto.sha256("hello")
string id = crypto.randomUUID()
log digest
```

## API reference

### `crypto`

| Method | Returns | Description |
| --- | --- | --- |
| `crypto.sha1(data: any)` | `string` | Computes a SHA-1 digest through the shared hexadecimal digest path. |
| `crypto.sha256(data: any)` | `string` | Computes a SHA-256 digest through the shared hexadecimal digest path. |
| `crypto.sha512(data: any)` | `string` | Computes a SHA-512 digest through the shared hexadecimal digest path. |
| `crypto.md5(data: any)` | `string` | Computes an MD5 digest through the shared hexadecimal digest path. |
| `crypto.sha3_256(data: any)` | `string` | Computes a SHA3-256 digest through the shared hexadecimal digest path. |
| `crypto.hmacSha256(key: any, data: any)` | `string` | Computes HMAC-SHA256 through the shared HMAC path. |
| `crypto.hmacSha512(key: any, data: any)` | `string` | Computes HMAC-SHA512 through the shared HMAC path. |
| `crypto.md5Hash(data: any)` | `string` | Alias of `crypto.md5`. |
| `crypto.aes256Encrypt(key: any, plaintext: any)` | `string` | Encrypts with AES-GCM using a normalized 256-bit key. |
| `crypto.aes256Decrypt(key: any, ciphertext: any)` | `string` | Authenticates and decrypts AES-GCM ciphertext, returning empty on failure. |
| `crypto.randomBytes(size: any)` | `string` | Generates random bytes. |
| `crypto.randomInt(...args: any)` | `number` | Returns a secure integer in `[0, max)` or `[min, max)`. |
| `crypto.randomString(length: any)` | `string` | Generates random string. |
| `crypto.randomFloat(...args: any)` | `number` | Generates random float. |
| `crypto.uuidv4()` | `string` | Runs the uuidv4 operation. |
| `crypto.randomUUID()` | `string` | Generates random uuid. |
| `crypto.random(min: any, max: any)` | `any` | Returns a secure integer in `[min, max)`. |
| `crypto.hash(hashFunc: any, data: any)` | `string` | Runs the hash operation. |
| `crypto.pbkdf2(password: any, salt: any, iterations: any, keyLen: any, hashFunc: any)` | `string` | Runs the pbkdf2 operation. |
| `crypto.hexEncode(data: any)` | `string` | Runs the hex encode operation. |
| `crypto.hexDecode(data: any)` | `string` | Runs the hex decode operation. |
| `crypto.binEncode(data: any)` | `string` | Runs the bin encode operation. |
| `crypto.binDecode(data: any)` | `string` | Runs the bin decode operation. |
| `crypto.base64Encode(data: any)` | `string` | Runs the base64 encode operation. |
| `crypto.base64Decode(data: any)` | `string` | Runs the base64 decode operation. |
| `crypto.hashPassword(password: any)` | `string` | Runs the hash password operation. |
| `crypto.verifyPassword(password: any, storedHash: any)` | `boolean` | Verifies password. |
| `crypto.generateKeyPair()` | `object` | Runs the generate key pair operation. |
| `crypto.sign(key: any, data: any)` | `string` | Runs the sign operation. |
| `crypto.verify(key: any, data: any, signature: any)` | `boolean` | Runs the verify operation. |
| `crypto.constantTimeCompare(a: any, b: any)` | `boolean` | Uses the standard constant-time comparison, including unequal-length rejection. |
| `crypto.encrypt(data: any, password: any)` | `string` | Runs the encrypt operation. |
| `crypto.decrypt(data: any, password: any)` | `string` | Runs the decrypt operation. |
| `crypto.encryptFile(inputPath: any, outputPath: any, password: any)` | `boolean` | Encrypts through the shared fail-closed file transform. |
| `crypto.decryptFile(inputPath: any, outputPath: any, password: any)` | `boolean` | Decrypts through the shared fail-closed file transform. |
| `crypto.hashFile(filePath: any)` | `string` | Runs the hash file operation. |
| `crypto.hashDirectory(dirPath: any)` | `string` | Runs the hash directory operation. |
| `crypto.secureErase(filePath: any)` | `boolean` | Runs the secure erase operation. |

## Notes

- Standard-library imports accept both `import "osl/crypto"` and `import "crypto"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

AES keys are truncated or zero-padded to 32 bytes; nonce, salt, iteration, file,
and ciphertext sizes are validated. Invalid authentication data fails closed and
partial output is removed.
