# jwt

> JSON Web Token signing and verification

Use `jwt` for signing, verifying, decoding, and inspecting JSON Web Tokens.

```javascript
import "osl/jwt"
```

## Example

```javascript
import "osl/jwt"

string token = jwt.sign({user: "ada"}, "secret")
log jwt.verify(token, "secret")
```

## API reference

### `jwt`

| Method | Returns | Description |
| --- | --- | --- |
| `jwt.encode(header: any, payload: any, secret: any)` | `string` | Runs the encode operation. |
| `jwt.sign(claims: object, secret: any, expiresIn: any)` | `string` | Runs the sign operation. |
| `jwt.signWithExpiry(claims: object, secret: any, expiresIn: any)` | `string` | Signs with expiry. |
| `jwt.verify(token: any, secret: any)` | `object` | Runs the verify operation. |
| `jwt.getClaim(token: any, claim: any)` | `any` | Returns claim. |
| `jwt.isExpired(token: any)` | `boolean` | Reports whether expired. |
| `jwt.refresh(token: any, secret: any, expiresIn: any)` | `string` | Runs the refresh operation. |

## Notes

- Standard-library imports accept both `import "osl/jwt"` and `import "jwt"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
