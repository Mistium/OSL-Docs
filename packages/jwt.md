# jwt

Use `jwt` to create and check HMAC-signed JSON Web Tokens (HS256, HS384, HS512).

```osl
import "std:jwt"
```

## Example

```osl
import "std:jwt"

string token = jwt.create({sub: "ada", role: "admin"}, "secret", {expiresIn: 3600000})

object claims = jwt.check(token, "secret") catch (err) (
  log "rejected: " ++ err.message
  return
)
log claims.sub
```

`jwt.check` returns a result. Used as a value it unwraps itself and throws on failure, so
`object claims = jwt.check(token, secret)` is enough when a bad token should stop the program.

## API reference

### `jwt`

| Method | Returns | Notes |
| --- | --- | --- |
| `jwt.create(claims: object, secret: string, options?)` | `string` | Signs a copy of `claims`. Adds `iat` (unix seconds) unless `claims` has one. Options: `expiresIn` (token lifetime in milliseconds, sets `exp`), `algorithm` (`"HS256"` default, `"HS384"`, `"HS512"`). |
| `jwt.check(token: string, secret: string, options?)` | `result<object, error>` | Verifies the signature and time claims and returns the claims. Option: `leeway`, allowed clock difference in milliseconds (default 0). |
| `jwt.renew(token: string, secret: string, options?)` | `result<string, error>` | Checks `token` like `jwt.check` and signs its claims again with a fresh `iat`. Options: `expiresIn` (ms; without it the old `iat`-to-`exp` lifetime carries over), `algorithm` (defaults to the old token's). |
| `jwt.decode(token: string)` | `result<{header, payload}, error>` | Reads the header and claims without checking the signature. Never trust the result; use `jwt.check` for that. |
| `jwt.isExpired(token: string)` | `boolean` | Whether `exp` has passed, without checking the signature. A token without `exp` never expires; a malformed token, or one whose `exp` isn't a number, counts as expired. |

`secret` also accepts a `byte[]`.

### Errors

| Function | Kind | When |
| --- | --- | --- |
| `check`, `renew` | `ParseError` | The token is malformed. |
| `check`, `renew` | `PermissionError` | Wrong signature, an unsigned (`alg: none`) token, or a token whose `nbf` is still in the future. |
| `check`, `renew` | `TimeoutError` | The token expired. |
| `check`, `renew` | `UnsupportedError` | The token uses another algorithm (such as RS256). |
| `decode` | `ParseError` | The token is malformed. |
| `create`, `check`, `renew` | `ValueError` (thrown) | Empty secret, unknown option or algorithm, a non-positive `expiresIn`, or claims that can't be written as JSON. |

```osl
import "std:jwt"

string token = jwt.create({sub: "ada"}, "secret")
auto claims, err = jwt.check(token, "wrong")
if err != null (
  log err.kind // PermissionError
)
```

## Behavior and limits

Tokens are standard JWTs: each part is unpadded base64url and the signature is HMAC over
`header.payload`, so tokens interoperate with other JWT libraries. Signature comparison is
constant-time.

`jwt.check` rejects unsigned tokens and unknown algorithms, and enforces both `exp` and `nbf`.
`expiresIn` is rounded up to a whole second, so even a short lifetime gives a token that is valid
now.

## Changes from earlier versions

`jwt.encode`, `jwt.sign`, `jwt.signWithExpiry`, `jwt.verify`, `jwt.refresh` and `jwt.getClaim` are
gone. Use `jwt.create` and `jwt.renew` (with `expiresIn` in milliseconds), `jwt.check` for verified
claims and `jwt.decode(token).payload` for an unverified read. `jwt.decode` no longer has an `error`
key; a malformed token fails with `ParseError`.
