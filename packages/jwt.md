# jwt

> JSON Web Token signing and verification

Use `jwt` for signing, verifying, decoding, and inspecting JSON Web Tokens.

```javascript
import "std:jwt"
```

## Example

```javascript
import "std:jwt"

string token = jwt.sign({user: "ada"}, "secret")
log jwt.verify(token, "secret")
```

## API reference

### `jwt`

| Method | Returns | Description |
| --- | --- | --- |
| `jwt.encode(header: any, payload: any, secret: any)` | `string` | Builds a signed three-part token from raw header and payload text. |
| `jwt.sign(claims: object, secret: any, expiresIn: any)` | `string` | JSON-encodes claims and uses the same token construction as `encode`. |
| `jwt.signWithExpiry(claims: object, secret: any, expiresIn: any)` | `string` | Signs with expiry. |
| `jwt.verify(token: any, secret: any)` | `object` | Verifies the signature with a constant-time comparison and uses shared framing, JSON, and expiry validation. |
| `jwt.getClaim(token: any, claim: any)` | `any` | Returns claim. |
| `jwt.isExpired(token: any)` | `boolean` | Reports whether expired. |
| `jwt.refresh(token: any, secret: any, expiresIn: any)` | `string` | Runs the refresh operation. |
| `jwt.decode(token: any)` | `object` | Decodes header and claims through the shared bounded JSON-part path without verifying a signature. |

## Notes

- Prefer `import "std:jwt"`; the older `import "osl/jwt"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Verification rejects malformed tokens, algorithm confusion, invalid signatures,
and invalid or expired time claims. Verification and unverified decoding share
the same bounded three-part parser.
