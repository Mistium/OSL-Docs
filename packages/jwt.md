# jwt

> JSON Web Token utilities

```javascript
import "osl/jwt"
```

## Methods

- `jwt.encode(header, payload, secret)` → `string`
- `jwt.sign(claims, secret, expiresIn)` → `string`
- `jwt.signWithExpiry(claims, secret, expiresIn)` → `string`
- `jwt.verify(token, secret)` → `object`
- `jwt.decode(token)` → `object`
- `jwt.getClaim(token, claim)` → `any`
- `jwt.isExpired(token)` → `boolean`
- `jwt.refresh(token, secret, expiresIn)` → `string`
