# webpush

Use `webpush` to generate VAPID keys and send Web Push notifications to browser push subscriptions.

```osl
import "std:webpush"
```

## API reference

### `webpush`

| Method | Returns | Notes |
| --- | --- | --- |
| `webpush.generateVAPIDKeys()` | `object` |  |
| `webpush.derivePublicKey(privateKeyPEM: any)` | `string` | Derives a public key from a validated P-256 private key. |
| `webpush.signVapidJWT(audience: any, expiresIn: any, privateKeyPEM: any, claimsEmail: any)` | `string` | Signs a VAPID JWT with a P-256 private key. |
| `webpush.sendWebPush(endpoint: any, p256dh: any, auth: any, data: any, vapidPrivateKey: any, vapidClaimsEmail: any, ttl: any)` | `object` | Encrypts and sends a bounded Web Push request. |
| `webpush.verifySubscription(endpoint: any, p256dh: any, auth: any)` | `boolean` | Validates the endpoint, P-256 key, and authentication secret. |
| `webpush.ensureVAPIDKeys(configPath: any, privateKeyPath: any)` | `object` | Reuses matching keys or generates replacement files under a process-wide lock. |
| `webpush.verifyVapidJWT(token: any, publicKey: any)` | `boolean` | Verifies the signature and required VAPID claim shape. |

## Notes

- Prefer `import "std:webpush"`; the older `import "osl/webpush"` spelling remains supported.

## Behavior and limits

The package validates P-256 public keys in subscriptions and JWTs. Invalid VAPID keys, tokens,
subscriptions, endpoints, or HTTP responses return failure values. If payload encryption fails,
the package does not send plaintext. Expiry times and payload sizes have fixed limits.
