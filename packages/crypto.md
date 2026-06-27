# crypto

> Cryptographic utilities

```javascript
import "osl/crypto"
```

## Methods

- `crypto.sha1(data)` → `string`
- `crypto.sha256(data)` → `string`
- `crypto.sha512(data)` → `string`
- `crypto.md5(data)` → `string`
- `crypto.sha3_256(data)` → `string`
- `crypto.hmacSha256(key, data)` → `string`
- `crypto.hmacSha512(key, data)` → `string`
- `crypto.md5Hash(data)` → `string`
- `crypto.aes256Encrypt(key, plaintext)` → `string`
- `crypto.aes256Decrypt(key, ciphertext)` → `string`
- `crypto.randomBytes(size)` → `string`
- `crypto.randomInt(...args)` → `number`
- `crypto.randomString(length)` → `string`
- `crypto.randomFloat(...args)` → `number`
- `crypto.uuidv4()` → `string`
- `crypto.randomUUID()` → `string`
- `crypto.random(min, max)` → `any`
- `crypto.hash(hashFunc, data)` → `string`
- `crypto.pbkdf2(password, salt, iterations, keyLen, hashFunc)` → `string`
- `crypto.hexEncode(data)` → `string`
- `crypto.hexDecode(data)` → `string`
- `crypto.binEncode(data)` → `string`
- `crypto.binDecode(data)` → `string`
- `crypto.base64Encode(data)` → `string`
- `crypto.base64Decode(data)` → `string`
- `crypto.hashPassword(password)` → `string`
- `crypto.verifyPassword(password, storedHash)` → `boolean`
- `crypto.generateKeyPair()` → `object`
- `crypto.sign(key, data)` → `string`
- `crypto.verify(key, data, signature)` → `boolean`
- `crypto.constantTimeCompare(a, b)` → `boolean`
- `crypto.encrypt(data, password)` → `string`
- `crypto.decrypt(data, password)` → `string`
- `crypto.encryptFile(inputPath, outputPath, password)` → `boolean`
- `crypto.decryptFile(inputPath, outputPath, password)` → `boolean`
- `crypto.hashFile(filePath)` → `string`
- `crypto.hashDirectory(dirPath)` → `string`
- `crypto.secureErase(filePath)` → `boolean`
