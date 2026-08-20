# email

> Compose and send email (SMTP)

Use `email` to compose SMTP messages, set recipients and bodies, attach files, preview messages, and send through common SMTP providers.

```javascript
import "std:email"
```

## API reference

### `email`

| Method | Returns | Description |
| --- | --- | --- |
| `email.create()` | `*Email` | Creates a new value. |
| `email.setFrom(addr: any)` | `boolean` | Sets from. |
| `email.addTo(recipient: any)` | `boolean` | Adds a validated, non-duplicate To recipient. |
| `email.addToMany(recipients: array)` | `boolean` | Adds to many. |
| `email.setTo(recipients: any)` | `boolean` | Replaces To recipients using shared address validation; fails on an invalid or duplicate entry. |
| `email.getTo()` | `array` | Returns to. |
| `email.addCc(recipient: any)` | `boolean` | Adds a validated, non-duplicate Cc recipient. |
| `email.setCc(recipients: any)` | `boolean` | Replaces Cc recipients, skipping invalid or duplicate entries. |
| `email.getCc()` | `array` | Returns cc. |
| `email.addBcc(recipient: any)` | `boolean` | Adds a validated, non-duplicate Bcc recipient. |
| `email.setBcc(recipients: any)` | `boolean` | Replaces Bcc recipients, skipping invalid or duplicate entries. |
| `email.getBcc()` | `array` | Returns bcc. |
| `email.setSubject(subject: any)` | `void` | Sets subject. |
| `email.getSubject()` | `string` | Returns subject. |
| `email.setBody(body: any)` | `void` | Sets body. |
| `email.getBody()` | `string` | Returns body. |
| `email.setHTML(html: any)` | `boolean` | Sets html. |
| `email.setText(text: any)` | `void` | Sets text. |
| `email.isHTML()` | `boolean` | Reports whether html. |
| `email.attachFile(filePath: any)` | `boolean` | Adds a readable file unless its basename is already attached. |
| `email.attachContent(files: object)` | `boolean` | Adds named inline attachments through the same duplicate-name validation. |
| `email.sendWithSmtp(host: any, port: any, username: any, password: any, auth: any)` | `object` | Sends with SMTP and returns the shared success or error result shape. |
| `email.sendGmail(username: any, password: any)` | `object` | Sends gmail. |
| `email.sendOutlook(username: any, password: any)` | `object` | Sends outlook. |
| `email.sendOffice365(username: any, password: any)` | `object` | Sends office365. |
| `email.sendLocalhost()` | `object` | Sends localhost. |
| `email.buildMessage(from: string, reader: *textproto.Reader)` | `string` | Runs the build message operation. |
| `email.toMap()` | `object` | Converts the value to an object. |
| `email.fromMap(data: object)` | `*Email` | Creates from map. |
| `email.validate()` | `boolean` | Validates the current value. |
| `email.getRecipients()` | `array` | Returns To, Cc, and Bcc values through the shared combined-recipient path. |
| `email.getRecipientCount()` | `number` | Returns recipient count. |
| `email.clear()` | `void` | Clears all stored values. |
| `email.reset()` | `void` | Runs the reset operation. |
| `email.queue()` | `object` | Runs the queue operation. |
| `email.preview()` | `string` | Runs the preview operation. |
| `email.wrapText(width: any)` | `boolean` | Runs the wrap text operation. |
| `email.getHeaders()` | `object` | Returns headers. |
| `email.hasRecipient(recipient: string)` | `boolean` | Searches the same combined To, Cc, and Bcc recipient list. |

## Notes

- Prefer `import "std:email"`; the older `import "osl/email"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Recipient state is kept per email value and guarded for concurrent access.
Headers reject newline injection and attachment failures are reported. Gmail,
Outlook, and Office 365 helpers use their standard SMTP submission hosts.
