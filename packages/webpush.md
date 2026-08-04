# webpush

> Web Push notifications (VAPID)

Use `webpush` to generate VAPID keys and send Web Push notifications to browser push subscriptions.

```javascript
import "osl/webpush"
```

## API reference

### `webpush`

| Method | Returns | Description |
| --- | --- | --- |
| `webpush.generateVAPIDKeys()` | `object` | Runs the generate vapidkeys operation. |
| `webpush.derivePublicKey(privateKeyPEM: any)` | `string` | Derives the public key through shared validated P-256 private-key parsing. |
| `webpush.signVapidJWT(audience: any, expiresIn: any, privateKeyPEM: any, claimsEmail: any)` | `string` | Signs a VAPID JWT using shared private-key parsing and JSON/base64 encoding. |
| `webpush.sendWebPush(endpoint: any, p256dh: any, auth: any, data: any, vapidPrivateKey: any, vapidClaimsEmail: any, ttl: any)` | `object` | Sends web push through the shared bounded HTTP client. |
| `webpush.verifySubscription(endpoint: any, p256dh: any, auth: any)` | `boolean` | Verifies endpoint, P-256 key, and auth secret through the shared parsers. |
| `webpush.ensureVAPIDKeys(configPath: any, privateKeyPath: any)` | `object` | Reuses matching keys or generates replacement files under a process-wide lock. |
| `webpush.verifyVapidJWT(token: any, publicKey: any)` | `boolean` | Verifies the signature and required VAPID claim shape. |

## Notes

- Standard-library imports accept both `import "osl/webpush"` and `import "webpush"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Malformed subscriptions and JWT verification share validated P-256 public-key decoding; VAPID keys, JWTs, and HTTP failures return controlled
false/error values. Endpoint and subscription parsing are shared by validation
and sending. Encryption failures never fall back to sending plaintext. Expiry
and payload sizes are bounded.
