---
description: Create and check signed JSON Web Tokens for logins and API access, with expiry, issuer and audience checks.
package: jwt
---

# jwt

A JSON Web Token (JWT) is a small signed note: "this is user ada, and it is good for an hour". A server hands one out at login, the client sends it back with each request, and the server trusts what is inside once the signature checks out, with no session table to look up. `std:jwt` creates and checks tokens signed with a shared secret (HS256, HS384 or HS512).

## Make and check a token

`jwt.create(claims, secret)` signs an object into a token string. `jwt.check(token, secret)` verifies it and gives the claims back:

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"

string token = jwt.create({sub: "ada", role: "admin"}, secret).unwrap()
log token.split(".").len

auto claims = jwt.check(token, secret).unwrap()
log claims["sub"] claims["role"]
log claims["iat"] != null
```

```output
3
ada admin
true
```

A token is three dot-separated parts: header, claims, signature. `create` adds `iat`, when it was issued. 

> [!important]
> The secret must be at least 32 bytes for HS256 (48 for HS384, 64 for HS512). A shorter one is a `ValueError`. Make one with `crypto.randomHex(32)` and keep it in an environment variable, never in your source.

## Tokens are signed, not secret

Anyone can read what is inside a token. The signature only stops them changing it. `jwt.decode` reads a token without checking it, which is fine for showing a name in a UI, but never trust what it returns for a decision:

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"
string token = jwt.create({sub: "ada"}, secret).unwrap()

auto parts = jwt.decode(token).unwrap()
log parts.header
log parts.payload["sub"]
```

```output
{"alg":"HS256","typ":"JWT"}
ada
```

So never put passwords or private data in the claims.

## Bad tokens

`check` fails for a changed token, a wrong secret and a token that isn't one. The error kind tells you which:

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"
string other = "another-secret-that-is-32-bytes-long"
string token = jwt.create({sub: "ada"}, secret).unwrap()

log jwt.check(token, other).unwrapErr().kind
log jwt.check(token ++ "x", secret).isErr()
log jwt.check("not.a.token", secret).unwrapErr().kind

switch jwt.check(token, secret) (
  case ok(claims)
    log "welcome" claims["sub"]
  case err(e)
    log "refused:" e.kind
)
```

```output
PermissionError
true
ParseError
welcome ada
```

`PermissionError` means the signature or the audience or issuer is wrong. `ParseError` means the text isn't a token. Treat all failures the same toward the client: refuse the request.

:::quiz
A client sends a token whose claims say `role: "admin"`, but you signed it with a different secret. What does `jwt.check` do?

- [ ] Returns the claims, since the format is valid.
- [x] Fails with a `PermissionError`.
- [ ] Returns the claims with `role` removed.

The signature is the only thing that makes the claims trustworthy.
:::

## Expiry

Give a token a lifetime with `expiresIn`, in milliseconds. After that, `check` fails with an `ExpiredError`, and `isExpired` says so without needing the secret:

```osl
import "std:jwt"
import "std:thread"

string secret = "a-secret-that-is-at-least-32-bytes!"
string token = jwt.create({sub: "ada"}, secret, {expiresIn: 1000}).unwrap()

log jwt.isExpired(token)
thread.sleep(2100)
log jwt.isExpired(token)
log jwt.check(token, secret).unwrapErr().kind
```

```output
false
true
ExpiredError
```

Try an `expiresIn` of 60000 and the sleep no longer matters. For a login token an hour (`3600000`) is typical. Short lifetimes limit what a stolen token can do.

## Renewing

`jwt.renew(token, secret, options)` checks a token and returns a new one with the same claims and a fresh lifetime:

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"
string first = jwt.create({sub: "ada"}, secret, {expiresIn: 60000}).unwrap()

string second = jwt.renew(first, secret, {expiresIn: 3600000}).unwrap()
log jwt.check(second, secret).unwrap()["sub"]
```

```output
ada
```

## Issuer and audience

`iss` says who made the token and `aud` who it is for. Ask `check` to require them, so a token for one service isn't accepted by another:

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"
auto claims = {sub: "ada", iss: "auth.example", aud: "billing"}
string token = jwt.create(claims, secret).unwrap()

log jwt.check(token, secret, {issuer: "auth.example", audience: "billing"}).isOk()
log jwt.check(token, secret, {audience: "search"}).isErr()
log jwt.check(token, secret, {issuer: "someone.else"}).isErr()
```

```output
true
true
true
```

## Protect a route

Put it together with [serve](serve.md): a middleware reads the bearer token, checks it, and passes the claims on:

```osl norun
import "std:jwt"
import "std:serve"
import "std:requests"

string secret = "a-secret-that-is-at-least-32-bytes!"
auto app = serve.new()

app.use(def(*serve.Context c) (
  string token = c.bearer() ?? ""
  switch jwt.check(token, secret) (
    case ok(claims)
      c.set("user", claims["sub"])
      c.next()
    case err(e)
      c.unauthorized("invalid token")
  )
))
app.get("/me", def(*serve.Context c) (
  c.text(200, "hello " ++ c.get("user"))
))
app.start("127.0.0.1:8775").unwrap()

string good = jwt.create({sub: "ada"}, secret).unwrap()
auto headers = {Authorization: "Bearer " ++ good}
auto ok = requests.get("http://127.0.0.1:8775/me", {headers: headers}).unwrap()
log ok.status ok.body
log requests.get("http://127.0.0.1:8775/me").unwrap().status

app.stop().unwrap()
```

The request with the token prints `200 hello ada`, and the one without prints `401`.

:::exercise title="Admin only"
Write `adminName(token, secret)`. It returns the token's `sub` when the token is valid and its `role` claim is `"admin"`, and `"denied"` otherwise.

```osl
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"

def adminName(string token, string secret) string (
  return "denied"
)

string admin = jwt.create({sub: "ada", role: "admin"}, secret).unwrap()
string user = jwt.create({sub: "bob", role: "user"}, secret).unwrap()
log adminName(admin, secret)
log adminName(user, secret)
log adminName("junk", secret)
```

```output
ada
denied
denied
```

> [!hint]
> `switch jwt.check(token, secret) ( case ok(claims) ... case err(e) ... )`.

> [!hint]
> Compare `claims["role"]` to `"admin"` before returning `claims["sub"]`.

```osl solution
import "std:jwt"

string secret = "a-secret-that-is-at-least-32-bytes!"

def adminName(string token, string secret) string (
  switch jwt.check(token, secret) (
    case ok(claims)
      if claims["role"] == "admin" return claims["sub"]
      return "denied"
    case err(e)
      return "denied"
  )
)

string admin = jwt.create({sub: "ada", role: "admin"}, secret).unwrap()
string user = jwt.create({sub: "bob", role: "user"}, secret).unwrap()
log adminName(admin, secret)
log adminName(user, secret)
log adminName("junk", secret)
```

```output
ada
denied
denied
```
:::

## API reference

::api
