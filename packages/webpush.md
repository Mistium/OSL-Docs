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
| `webpush.derivePublicKey(privateKeyPEM: any)` | `string` | Runs the derive public key operation. |
| `webpush.signVapidJWT(audience: any, expiresIn: any, privateKeyPEM: any, claimsEmail: any)` | `string` | Signs vapid jwt. |
| `webpush.sendWebPush(endpoint: any, p256dh: any, auth: any, data: any, vapidPrivateKey: any, vapidClaimsEmail: any, ttl: any)` | `object` | Sends web push. |
| `webpush.verifySubscription(endpoint: any, p256dh: any, auth: any)` | `boolean` | Verifies subscription. |
| `webpush.ensureVAPIDKeys(configPath: any, privateKeyPath: any)` | `object` | Runs the ensure vapidkeys operation. |

## Notes

- Standard-library imports accept both `import "osl/webpush"` and `import "webpush"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
