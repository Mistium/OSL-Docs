# email

Use `email` to compose SMTP messages, set recipients and bodies, attach files, preview messages, and send through common SMTP providers.

```osl
import "std:email"
```

## API reference

### `email`

| Method | Returns | Notes |
| --- | --- | --- |
| `email.create()` | `*Email` |  |
| `email.setFrom(addr: any)` | `boolean` | Sets from. |
| `email.addTo(recipient: any)` | `boolean` | Adds a validated, non-duplicate To recipient. |
| `email.addToMany(recipients: array)` | `boolean` | Adds to many. |
| `email.setTo(recipients: any)` | `boolean` | Replaces To recipients. Invalid or duplicate addresses return `false`. |
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
| `email.isHTML()` | `boolean` |  |
| `email.attachFile(filePath: any)` | `boolean` | Adds a readable file unless its basename is already attached. |
| `email.attachContent(files: object)` | `boolean` | Adds named inline attachments through the same duplicate-name validation. |
| `email.sendWithSmtp(host: any, port: any, username: any, password: any, auth: any)` | `object` | Sends with SMTP and returns `{success}` or `{success: false, error}`. |
| `email.sendGmail(username: any, password: any)` | `object` | Sends gmail. |
| `email.sendOutlook(username: any, password: any)` | `object` | Sends outlook. |
| `email.sendOffice365(username: any, password: any)` | `object` | Sends office365. |
| `email.sendLocalhost()` | `object` | Sends localhost. |
| `email.toMap()` | `object` | Converts the value to an object. |
| `email.fromMap(data: object)` | `*Email` | Creates from map. |
| `email.validate()` | `boolean` | Validates the current value. |
| `email.getRecipients()` | `array` | Returns the combined To, Cc, and Bcc recipients. |
| `email.getRecipientCount()` | `number` | Returns recipient count. |
| `email.clear()` | `void` | Clears all stored values. |
| `email.reset()` | `void` |  |
| `email.queue()` | `object` |  |
| `email.preview()` | `string` |  |
| `email.wrapText(width: any)` | `boolean` |  |
| `email.getHeaders()` | `object` | Returns headers. |
| `email.hasRecipient(recipient: string)` | `boolean` | Searches the same combined To, Cc, and Bcc recipient list. |

## Notes

- Prefer `import "std:email"`; the older `import "osl/email"` spelling remains supported.

## Behavior and limits

Each email value has its own recipient list and can be used safely across threads. Header values
containing newlines are rejected. Attachment errors are reported. The Gmail, Outlook, and Office
365 helpers use those providers' standard SMTP submission hosts.
