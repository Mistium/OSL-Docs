# crypto

Use `crypto` for hashing, random values, encoding helpers, password checks, signatures, and file encryption helpers.

```osl
import "std:crypto"
```

## Example

```osl
import "std:crypto"

string digest = crypto.sha256("hello")
string id = crypto.randomUUID()
log digest
```

## API reference

### `crypto`

| Method | Returns | Notes |
| --- | --- | --- |
| `crypto.sha1(data: any)` | `string` | Returns a hexadecimal SHA-1 digest. |
| `crypto.sha256(data: any)` | `string` | Returns a hexadecimal SHA-256 digest. |
| `crypto.sha512(data: any)` | `string` | Returns a hexadecimal SHA-512 digest. |
| `crypto.md5(data: any)` | `string` | Returns a hexadecimal MD5 digest. |
| `crypto.sha3_256(data: any)` | `string` | Returns a hexadecimal SHA3-256 digest. |
| `crypto.hmacSha256(key: any, data: any)` | `string` | Returns a hexadecimal HMAC-SHA256 value. |
| `crypto.hmacSha512(key: any, data: any)` | `string` | Returns a hexadecimal HMAC-SHA512 value. |
| `crypto.md5Hash(data: any)` | `string` | Alias of `crypto.md5`. |
| `crypto.aes256Encrypt(key: any, plaintext: any)` | `string` | Encrypts with AES-GCM using a normalized 256-bit key. |
| `crypto.aes256Decrypt(key: any, ciphertext: any)` | `string` | Authenticates and decrypts AES-GCM ciphertext, returning empty on failure. |
| `crypto.randomBytes(size: any)` | `string` | Generates random bytes. |
| `crypto.randomInt(...args: any)` | `number` | Returns a secure integer in `[0, max)` or `[min, max)`. |
| `crypto.randomString(length: any)` | `string` | Generates random string. |
| `crypto.randomFloat(...args: any)` | `number` | Generates random float. |
| `crypto.uuidv4()` | `string` |  |
| `crypto.randomUUID()` | `string` | Generates random uuid. |
| `crypto.random(min: any, max: any)` | `any` | Returns a secure integer in `[min, max)`. |
| `crypto.hash(hashFunc: any, data: any)` | `string` |  |
| `crypto.pbkdf2(password: any, salt: any, iterations: any, keyLen: any, hashFunc: any)` | `string` |  |
| `crypto.hexEncode(data: any)` | `string` |  |
| `crypto.hexDecode(data: any)` | `string` |  |
| `crypto.binEncode(data: any)` | `string` |  |
| `crypto.binDecode(data: any)` | `string` |  |
| `crypto.base64Encode(data: any)` | `string` |  |
| `crypto.base64Decode(data: any)` | `string` |  |
| `crypto.ed25519GenerateKeyPair()` | `object` | Generates an Ed25519 key pair encoded as unpadded base64url. |
| `crypto.ed25519Sign(privateKey: any, data: any)` | `string` | Signs data with an Ed25519 seed or private key and returns an unpadded base64url signature. |
| `crypto.ed25519Verify(publicKey: any, data: any, signature: any)` | `boolean` | Verifies an unpadded base64url Ed25519 signature. |
| `crypto.hashPassword(password: any)` | `string` |  |
| `crypto.verifyPassword(password: any, storedHash: any)` | `boolean` | Verifies password. |
| `crypto.bcryptHash(password: any, cost?: any)` | `string` | Creates a bcrypt password hash using cost 10 by default. |
| `crypto.bcryptVerify(password: any, storedHash: any)` | `boolean` | Verifies a password against a bcrypt hash. |
| `crypto.generateKeyPair()` | `object` |  |
| `crypto.sign(key: any, data: any)` | `string` |  |
| `crypto.verify(key: any, data: any, signature: any)` | `boolean` |  |
| `crypto.constantTimeCompare(a: any, b: any)` | `boolean` | Uses the standard constant-time comparison, including unequal-length rejection. |
| `crypto.encrypt(data: any, password: any)` | `string` |  |
| `crypto.decrypt(data: any, password: any)` | `string` |  |
| `crypto.encryptFile(inputPath: any, outputPath: any, password: any)` | `boolean` | Encrypts a file. A failure removes partial output. |
| `crypto.decryptFile(inputPath: any, outputPath: any, password: any)` | `boolean` | Decrypts a file. Authentication failure removes partial output. |
| `crypto.hashFile(filePath: any)` | `string` |  |
| `crypto.hashDirectory(dirPath: any)` | `string` |  |
| `crypto.secureErase(filePath: any)` | `boolean` |  |

## Bcrypt password hashing

#### `crypto.bcryptHash(password, cost?)` → `string`

Hashes the string representation of `password` with bcrypt. The optional cost
must be between 4 and 31 and defaults to 10. Invalid costs and passwords longer
than bcrypt's 72-byte limit return `""`.

```osl
string stored = crypto.bcryptHash("secret")
```

#### `crypto.bcryptVerify(password, storedHash)` → `boolean`

Verifies the string representation of `password` against a standard bcrypt
hash. Both `$2a$` and `$2b$` hashes are accepted. Malformed hashes return
`false`.

```osl
boolean valid = crypto.bcryptVerify("secret", stored)
```

## Ed25519 signatures

#### `crypto.ed25519GenerateKeyPair()` → `object`

Generates an Ed25519 key pair. The returned object contains `private`, a
32-byte private seed, and `public`, a 32-byte public key. Both values use
unpadded base64url encoding.

```osl
object keys = crypto.ed25519GenerateKeyPair()
```

#### `crypto.ed25519Sign(privateKey, data)` → `string`

Signs the string representation of `data`. `privateKey` may be either a
32-byte Ed25519 seed or a 64-byte private key encoded as unpadded base64url.
Returns an unpadded base64url signature, or `""` if the key is malformed.

```osl
string signature = crypto.ed25519Sign(keys.private, "hello")
```

#### `crypto.ed25519Verify(publicKey, data, signature)` → `boolean`

Verifies the signature against the string representation of `data`. The
public key and signature must use unpadded base64url encoding. Malformed keys
and signatures return `false`.

```osl
boolean genuine = crypto.ed25519Verify(keys.public, "hello", signature)
```

## Notes

- Prefer `import "std:crypto"`; the older `import "osl/crypto"` spelling remains supported.

## Behavior and limits

AES keys are truncated or zero-padded to 32 bytes; nonce, salt, iteration, file,
and ciphertext sizes are validated. Invalid authentication data fails closed and
partial output is removed.
