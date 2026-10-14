# webpush

Use `webpush` to send Web Push notifications to browser subscriptions, with VAPID keys, signing
and RFC 8291 (aes128gcm) payload encryption.

```osl
import "std:webpush"
```

## Example

Keep one key pair across restarts, give `publicKey` to the browser as its `applicationServerKey`,
then send to the subscription it hands back:

```osl
import "std:webpush"
import "std:json"

object keys = webpush.ensureKeys("vapid-private.pem")
log keys.publicKey

// The object from the browser's PushSubscription.toJSON()
object subscription = json.parse(`{
  "endpoint": "https://fcm.googleapis.com/fcm/send/abc123",
  "keys": {"p256dh": "BNc...", "auth": "tBH..."}
}`)

webpush.send(subscription, `{"title": "Hello"}`, {
  privateKey: keys.privateKey,
  subject: "mailto:admin@example.com",
  ttl: 3600000
}) catch (err) (
  if err.kind == "NotFoundError" (
    log "subscription expired; delete it"
  ) else (
    log err.message
  )
)
```

## API reference

### `webpush`

| Method | Returns | Notes |
| --- | --- | --- |
| `webpush.generateKeys()` | `{privateKey, publicKey}` | A new VAPID key pair. `privateKey` is a PEM P-256 key to keep secret; `publicKey` is the base64url key browsers use as `applicationServerKey`. |
| `webpush.ensureKeys(path: string)` | `result<{privateKey, publicKey}, error>` | Loads the private key stored at `path`, or creates one and saves it there (owner-readable only). Subscriptions are tied to the public key, so this keeps them working across restarts. Fails with `ParseError` when the file isn't a PEM P-256 private key (it is never overwritten), and `PermissionError` or `IOError` when it can't be read or written. |
| `webpush.derivePublicKey(privateKey: string)` | `result<string, error>` | The base64url public key for a PEM P-256 private key. Fails with `ParseError`. |
| `webpush.send(subscription: object, payload: string \| byte[], options)` | `result<unit, error>` | Encrypts `payload` (at most 3993 bytes) and delivers it through the subscription's push service. `subscription` has `endpoint`, `keys.p256dh` and `keys.auth`. |
| `webpush.verifySubscription(endpoint: string, p256dh: string, auth: string)` | `boolean` | Whether `endpoint` is an http(s) URL, `p256dh` a base64url P-256 public key and `auth` a base64url 16-byte secret. |
| `webpush.signJWT(audience: string, privateKey: string, options)` | `result<string, error>` | A VAPID token (ES256 JWT) for `audience`, the origin of a push service such as `"https://fcm.googleapis.com"`. `send` makes these itself; this is for talking to a push service directly. Options: `subject` (required, a `mailto:` or `https:` contact), `expires` (ms, default 43200000, at most 86400000). Fails with `ParseError` for a bad key; throws `ValueError` for a missing subject or out-of-range `expires`. |
| `webpush.verifyJWT(token: string, publicKey: string)` | `boolean` | Whether `token` is a VAPID token signed by the key belonging to `publicKey` and not expired. |

Options for `webpush.send`:

| Key | Notes |
| --- | --- |
| `privateKey` | Required. The PEM VAPID private key. |
| `subject` | Required. A `mailto:` or `https:` contact the push service can reach you at. |
| `ttl` | Milliseconds the push service keeps an undelivered message. Default 86400000, at most 2419200000; sent as whole seconds. |
| `urgency` | `"very-low"`, `"low"`, `"normal"` or `"high"`. |
| `topic` | Up to 32 URL-safe characters. A newer message with the same topic replaces an undelivered one. |
| `timeout` | Milliseconds. Default 10000. |

### Errors from `send`

| Kind | When |
| --- | --- |
| `NotFoundError` | The subscription expired or was unsubscribed; delete it. |
| `ValueError` | A malformed subscription or an oversized payload. Thrown for missing or invalid options. |
| `PermissionError` | The push service refuses the VAPID token. |
| `NetworkError`, `TimeoutError` | The push service can't be reached. |
| `RuntimeError` | Any other refusal. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `webpush.generateVAPIDKeys()` (returned `{private_key, public_key}` or `{error}`) | `webpush.generateKeys()` |
| `webpush.ensureVAPIDKeys(configPath, privateKeyPath)` | `webpush.ensureKeys(path)`, which keeps everything in the private key file and never overwrites a file it can't read |
| `webpush.sendWebPush(endpoint, p256dh, auth, data, privateKey, claimsEmail, ttl)` (`ttl` in seconds, returned `{success, status, error}`) | `webpush.send(subscription, payload, {privateKey, subject, ttl: ms})` |
| `webpush.signVapidJWT(audience, expiresIn, privateKey, claimsEmail)` (seconds) | `webpush.signJWT(audience, privateKey, {subject, expires: ms})` |
| `webpush.verifyVapidJWT(token, publicKey)` (ignored expiry) | `webpush.verifyJWT(token, publicKey)` |
