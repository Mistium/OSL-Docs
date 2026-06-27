# email

> Compose and send email (SMTP)

Use `email` to compose SMTP messages, set recipients and bodies, attach files, preview messages, and send through common SMTP providers.

```javascript
import "osl/email"
```

## API reference

### `email`

| Method | Returns | Description |
| --- | --- | --- |
| `email.create()` | `*Email` | Creates a new value. |
| `email.setFrom(addr: any)` | `boolean` | Sets from. |
| `email.addTo(recipient: any)` | `boolean` | Adds to. |
| `email.addToMany(recipients: array)` | `boolean` | Adds to many. |
| `email.setTo(recipients: any)` | `boolean` | Sets to. |
| `email.getTo()` | `array` | Returns to. |
| `email.addCc(recipient: any)` | `boolean` | Adds cc. |
| `email.setCc(recipients: any)` | `boolean` | Sets cc. |
| `email.getCc()` | `array` | Returns cc. |
| `email.addBcc(recipient: any)` | `boolean` | Adds bcc. |
| `email.setBcc(recipients: any)` | `boolean` | Sets bcc. |
| `email.getBcc()` | `array` | Returns bcc. |
| `email.setSubject(subject: any)` | `void` | Sets subject. |
| `email.getSubject()` | `string` | Returns subject. |
| `email.setBody(body: any)` | `void` | Sets body. |
| `email.getBody()` | `string` | Returns body. |
| `email.setHTML(html: any)` | `boolean` | Sets html. |
| `email.setText(text: any)` | `void` | Sets text. |
| `email.isHTML()` | `boolean` | Reports whether html. |
| `email.attachFile(filePath: any)` | `boolean` | Runs the attach file operation. |
| `email.attachContent(files: object)` | `boolean` | Runs the attach content operation. |
| `email.sendWithSmtp(host: any, port: any, username: any, password: any, auth: any)` | `object` | Sends with smtp. |
| `email.sendGmail(username: any, password: any)` | `object` | Sends gmail. |
| `email.sendOutlook(username: any, password: any)` | `object` | Sends outlook. |
| `email.sendOffice365(username: any, password: any)` | `object` | Sends office365. |
| `email.sendLocalhost()` | `object` | Sends localhost. |
| `email.buildMessage(from: string, reader: *textproto.Reader)` | `string` | Runs the build message operation. |
| `email.toMap()` | `object` | Converts the value to an object. |
| `email.fromMap(data: object)` | `*Email` | Creates from map. |
| `email.validate()` | `boolean` | Validates the current value. |
| `email.getRecipients()` | `array` | Returns recipients. |
| `email.getRecipientCount()` | `number` | Returns recipient count. |
| `email.clear()` | `void` | Clears all stored values. |
| `email.reset()` | `void` | Runs the reset operation. |
| `email.queue()` | `object` | Runs the queue operation. |
| `email.preview()` | `string` | Runs the preview operation. |
| `email.wrapText(width: any)` | `boolean` | Runs the wrap text operation. |
| `email.getHeaders()` | `object` | Returns headers. |

## Notes

- Standard-library imports accept both `import "osl/email"` and `import "email"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
