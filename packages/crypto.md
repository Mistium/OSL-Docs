# crypto

Use `crypto` for hashing, random values, encoding helpers, password checks, signatures, and file encryption helpers.

```javascript
import "std:crypto"
```

## Example

```javascript
import "std:crypto"

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
| `crypto.ed25519GenerateKeyPair()` | `object` | Generates an Ed25519 key pair encoded as unpadded base64url. |
| `crypto.ed25519Sign(privateKey: any, data: any)` | `string` | Signs data with an Ed25519 seed or private key and returns an unpadded base64url signature. |
| `crypto.ed25519Verify(publicKey: any, data: any, signature: any)` | `boolean` | Verifies an unpadded base64url Ed25519 signature. |
| `crypto.hashPassword(password: any)` | `string` | Runs the hash password operation. |
| `crypto.verifyPassword(password: any, storedHash: any)` | `boolean` | Verifies password. |
| `crypto.bcryptHash(password: any, cost?: any)` | `string` | Creates a bcrypt password hash using cost 10 by default. |
| `crypto.bcryptVerify(password: any, storedHash: any)` | `boolean` | Verifies a password against a bcrypt hash. |
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

## Bcrypt password hashing

#### `crypto.bcryptHash(password, cost?)` → `string`

Hashes the string representation of `password` with bcrypt. The optional cost
must be between 4 and 31 and defaults to 10. Invalid costs and passwords longer
than bcrypt's 72-byte limit return `""`.

```javascript
string stored = crypto.bcryptHash("secret")
```

#### `crypto.bcryptVerify(password, storedHash)` → `boolean`

Verifies the string representation of `password` against a standard bcrypt
hash. Both `$2a$` and `$2b$` hashes are accepted. Malformed hashes return
`false`.

```javascript
boolean valid = crypto.bcryptVerify("secret", stored)
```

## Ed25519 signatures

#### `crypto.ed25519GenerateKeyPair()` → `object`

Generates an Ed25519 key pair. The returned object contains `private`, a
32-byte private seed, and `public`, a 32-byte public key. Both values use
unpadded base64url encoding.

```javascript
object keys = crypto.ed25519GenerateKeyPair()
```

#### `crypto.ed25519Sign(privateKey, data)` → `string`

Signs the string representation of `data`. `privateKey` may be either a
32-byte Ed25519 seed or a 64-byte private key encoded as unpadded base64url.
Returns an unpadded base64url signature, or `""` if the key is malformed.

```javascript
string signature = crypto.ed25519Sign(keys.private, "hello")
```

#### `crypto.ed25519Verify(publicKey, data, signature)` → `boolean`

Verifies the signature against the string representation of `data`. The
public key and signature must use unpadded base64url encoding. Malformed keys
and signatures return `false`.

```javascript
boolean genuine = crypto.ed25519Verify(keys.public, "hello", signature)
```

## Notes

- Prefer `import "std:crypto"`; the older `import "osl/crypto"` spelling remains supported.

## Edge-case behavior

AES keys are truncated or zero-padded to 32 bytes; nonce, salt, iteration, file,
and ciphertext sizes are validated. Invalid authentication data fails closed and
partial output is removed.
