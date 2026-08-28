# jwt

Use `jwt` for signing, verifying, decoding, and inspecting JSON Web Tokens.

```osl
import "std:jwt"
```

## Example

```osl
import "std:jwt"

string token = jwt.sign({user: "ada"}, "secret")
log jwt.verify(token, "secret")
```

## API reference

### `jwt`

| Method | Returns | Notes |
| --- | --- | --- |
| `jwt.encode(header: any, payload: any, secret: any)` | `string` | Builds a signed three-part token from raw header and payload text. |
| `jwt.sign(claims: object, secret: any, expiresIn: any)` | `string` | JSON-encodes claims and uses the same token construction as `encode`. |
| `jwt.signWithExpiry(claims: object, secret: any, expiresIn: any)` | `string` | Signs with expiry. |
| `jwt.verify(token: any, secret: any)` | `object` | Verifies the signature, JSON structure, and expiry. Signature comparison is constant-time. |
| `jwt.getClaim(token: any, claim: any)` | `any` | Returns claim. |
| `jwt.isExpired(token: any)` | `boolean` |  |
| `jwt.refresh(token: any, secret: any, expiresIn: any)` | `string` |  |
| `jwt.decode(token: any)` | `object` | Decodes the header and claims without verifying the signature. |

## Notes

- Prefer `import "std:jwt"`; the older `import "osl/jwt"` spelling remains supported.

## Behavior and limits

Verification rejects malformed tokens, unexpected algorithms, invalid signatures, and invalid or
expired time claims. Both verified and unverified decoding limit the token to three bounded parts.
