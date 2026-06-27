# email

> Email sending utilities

```javascript
import "osl/email"
```

## Methods

- `email.create()` → `Email`
- `email.setFrom(addr)` → `boolean`
- `email.addTo(recipient)` → `boolean`
- `email.addToMany(recipients)` → `boolean`
- `email.setTo(recipients)` → `boolean`
- `email.getTo()` → `array`
- `email.addCc(recipient)` → `boolean`
- `email.setCc(recipients)` → `boolean`
- `email.getCc()` → `array`
- `email.addBcc(recipient)` → `boolean`
- `email.setBcc(recipients)` → `boolean`
- `email.getBcc()` → `array`
- `email.setSubject(subject)`
- `email.getSubject()` → `string`
- `email.setBody(body)`
- `email.getBody()` → `string`
- `email.setHTML(html)` → `boolean`
- `email.setText(text)`
- `email.isHTML()` → `boolean`
- `email.attachFile(filePath)` → `boolean`
- `email.attachContent(files)` → `boolean`
- `email.sendWithSmtp(host, port, username, password, auth)` → `object`
- `email.sendGmail(username, password)` → `object`
- `email.sendOutlook(username, password)` → `object`
- `email.sendOffice365(username, password)` → `object`
- `email.sendLocalhost()` → `object`
- `email.toMap()` → `object`
- `email.fromMap(data)` → `Email`
- `email.validate()` → `boolean`
- `email.getRecipients()` → `array`
- `email.getRecipientCount()` → `number`
- `email.clear()`
- `email.reset()`
- `email.queue()` → `object`
- `email.preview()` → `string`
- `email.wrapText(width)` → `boolean`
- `email.getHeaders()` → `object`
