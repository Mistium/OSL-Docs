---
description: Send Web Push notifications to browsers with VAPID keys, and build and verify the signed tokens that push services require.
package: webpush
---

# webpush

Web Push lets a server show a notification in a user's browser even when your site is closed. The browser gives your page a subscription (an address plus keys), you send it to your server, and `std:webpush` encrypts a message for it and delivers it through the browser vendor's push service.

Sending needs a real subscription from a real browser, so `send` is shown but not run. Everything around it, the keys and the signed tokens, runs fine here.

## Make your server's keys

A push service wants to know which server is sending. You prove it with a VAPID key pair. `generateKeys()` makes one: keep `privateKey` secret, and give `publicKey` to the page so it can subscribe:

```osl
import "std:webpush"

auto keys = webpush.generateKeys()

log keys.privateKey.startsWith("-----BEGIN")
log keys.publicKey.len
log webpush.derivePublicKey(keys.privateKey).unwrap() == keys.publicKey
```

```output
true
87
true
```

The public key is derived from the private one, so the private key is all you have to keep.

## Keep keys between runs

Making new keys on every start would break existing subscriptions. `ensureKeys(path)` loads the key stored at `path`, or creates and saves one the first time:

```osl
import "std:webpush"
import "std:fs"

fs.remove("vapid.pem", {force: true}).unwrap()

auto first = webpush.ensureKeys("vapid.pem").unwrap()
auto second = webpush.ensureKeys("vapid.pem").unwrap()

log fs.exists("vapid.pem")
log first.publicKey == second.publicKey

fs.remove("vapid.pem", {force: true}).unwrap()
```

```output
true
true
```

Run it twice: the second run loads what the first saved. Treat that file as a secret.

## Sign and verify a token

Each push request carries a short-lived token (an ES256 JSON Web Token) for the push service's address. `signJWT(audience, privateKey, options)` makes one. A `subject` contact address is required, so the service can reach you if something goes wrong:

```osl
import "std:webpush"

auto keys = webpush.generateKeys()
string token = webpush.signJWT("https://push.example.com", keys.privateKey, {subject: "mailto:admin@example.com"}).unwrap()

log token.split(".").len
log webpush.verifyJWT(token, keys.publicKey)
log webpush.verifyJWT(token, webpush.generateKeys().publicKey)
```

```output
3
true
false
```

`send` does this for you. You only call `signJWT` yourself when you talk to a push service by other means.

## Check a subscription

The browser's subscription has an `endpoint` URL and two keys, `p256dh` and `auth`. `verifySubscription` says whether they are the right shape, so you can refuse junk at the door before you store it:

```osl
import "std:webpush"

log webpush.verifySubscription("http://push.example.com/abc", "key", "secret")
log webpush.verifySubscription("not a url", "", "")
```

```output
false
false
```

Try an `https` endpoint with real keys from a browser to see `true`. A plain `http` endpoint is always refused.

## Send a notification

With a subscription from a browser, `send(subscription, payload, options)` encrypts the payload (up to 3993 bytes) and delivers it. An object payload goes as JSON, which your service worker reads in its `push` event:

```osl norun
import "std:webpush"
import "std:env"

auto subscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
  keys: {p256dh: "BNc...", auth: "tBH..."}
}

auto outcome = webpush.send(subscription, {title: "New message", body: "Ada says hi"}, {
  privateKey: env.get("VAPID_PRIVATE_KEY"),
  subject: "mailto:admin@example.com",
  ttl: 3600000
})

switch outcome (
  case ok(_)
    log "delivered to the push service"
  case err(e)
    log "failed:" e.kind
)
```

A `NotFoundError` usually means the user unsubscribed, so delete that subscription from your store. `ttl` is how long the push service should hold the message when the device is offline, in milliseconds.

> [!warning]
> The endpoint comes from a browser, so anyone can submit one. `send` only posts to public `https` addresses and refuses loopback and private ones unless you set `allowPrivate`. Leave that off unless you run your own push server.

:::quiz
Why does `send` need your private VAPID key?

- [ ] To decrypt the user's reply.
- [x] To sign a token that proves to the push service which server is sending.
- [ ] To encrypt the payload.

The payload is encrypted for the subscription's own keys. The VAPID key only identifies you.
:::

:::exercise title="Fresh keys, same identity"
Make a key pair, then print whether `derivePublicKey` of the private key matches the public one, and whether a token signed with it verifies.

```osl
import "std:webpush"

auto keys = webpush.generateKeys()

log false
log false
```

```output
true
true
```

> [!hint]
> `webpush.derivePublicKey(keys.privateKey).unwrap() == keys.publicKey`.

> [!hint]
> Sign with `webpush.signJWT("https://push.example.com", keys.privateKey, {subject: "mailto:a@example.com"}).unwrap()` and pass the token to `verifyJWT`.

```osl solution
import "std:webpush"

auto keys = webpush.generateKeys()

log webpush.derivePublicKey(keys.privateKey).unwrap() == keys.publicKey

string token = webpush.signJWT("https://push.example.com", keys.privateKey, {subject: "mailto:a@example.com"}).unwrap()
log webpush.verifyJWT(token, keys.publicKey)
```

```output
true
true
```
:::

## API reference

::api
