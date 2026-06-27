# webpush

> Web Push protocol utilities for VAPID authentication and push encryption

```javascript
import "osl/webpush"
```

## Methods

- `webpush.generateVAPIDKeys()` → `object`
- `webpush.derivePublicKey(privateKeyPEM)` → `string`
- `webpush.signVapidJWT(audience, expiresIn, privateKeyPEM, claimsEmail)` → `string`
- `webpush.sendWebPush(endpoint, p256dh, auth, data, vapidPrivateKey, vapidClaimsEmail, ttl)` → `object`
- `webpush.verifySubscription(endpoint, p256dh, auth)` → `boolean`
- `webpush.ensureVAPIDKeys(configPath, privateKeyPath)` → `object`
