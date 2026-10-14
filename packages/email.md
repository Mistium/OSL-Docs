# email

Use `email` to compose messages with attachments and send them through an SMTP server.

```osl
import "std:email"
```

## Example

```osl
import "std:email"
import "std:env"

*email.Email message = email.new({
  from: "me@example.com",
  to: ["ada@example.com", "grace@example.com"],
  subject: "Weekly report",
  body: "<h1>Report</h1><p>All systems normal.</p>",
  html: true
})
message.addCc("team@example.com")
message.attach("report.csv", "day,visits\nmon,120\n")

message.send("smtp.gmail.com", {
  username: "me@example.com",
  password: env.require("SMTP_PASSWORD")
}) catch (err) (
  log "not sent: " ++ err.message
)
```

Gmail is `"smtp.gmail.com"`, Outlook `"smtp-mail.outlook.com"` and Office 365
`"smtp.office365.com"`, all with a username and app password.

## API reference

### `email`

| Method | Returns | Notes |
| --- | --- | --- |
| `email.new(options?)` | `result<*email.Email, error>` | A new message. Options: `from`, `to`, `cc`, `bcc` (an address or an array of addresses), `subject`, `body` and `html` (`true` when `body` is HTML). Fails with `ValueError` for an invalid address. |

Addresses must be plain ASCII, such as `"name@example.com"`.

### `*email.Email`

| Method | Returns | Notes |
| --- | --- | --- |
| `message.from()` | `string?` | The sender, or `null` when none is set. |
| `message.setFrom(address: string)` | `result<unit, error>` | Sets the sender. Fails with `ValueError`, leaving it unchanged, for an invalid address. |
| `message.to()` | `string[]` | The To addresses. |
| `message.setTo(addresses: string[])` | `result<unit, error>` | Replaces the To addresses. Fails with `ValueError`, changing nothing, when any is invalid. |
| `message.addTo(address: string)` | `result<unit, error>` | Adds a To address. An address already on the message (in any list, ignoring case) is skipped. |
| `message.cc()`, `message.setCc(addresses)`, `message.addCc(address)` | | Like the To methods, for Cc. |
| `message.bcc()`, `message.setBcc(addresses)`, `message.addBcc(address)` | | Like the To methods, for Bcc. Bcc addresses receive the message but are never written into it. |
| `message.recipients()` | `string[]` | Every To, Cc and Bcc address, in that order. |
| `message.hasRecipient(address: string)` | `boolean` | Whether `address` is a recipient, ignoring case. |
| `message.subject()` | `string` | |
| `message.setSubject(subject: string)` | `void` | Line breaks become spaces, so a subject can't add headers. |
| `message.body()` | `string` | |
| `message.isHTML()` | `boolean` | Whether the body is sent as HTML. |
| `message.setBody(body: string, options?)` | `void` | Replaces the body. Options: `html` (`true` for HTML, `false` for plain text; when omitted the format stays as it was), `wrap` (wrap lines at this many characters, between words; throws `ValueError` below 1). |
| `message.attach(name: string, data: string \| byte[])` | `result<unit, error>` | Adds an attachment. Fails with `ValueError` for an empty or duplicate name. |
| `message.attachFile(path: string, options?)` | `result<unit, error>` | Attaches a file, named after it. Option: `name`. Fails with `NotFoundError` or `PermissionError` when the file can't be read, `IOError` for a directory, `ValueError` for a duplicate name. |
| `message.attachments()` | `string[]` | Attachment names, sorted. |
| `message.validate()` | `result<unit, error>` | Checks for a sender, at least one To address and a subject. Fails with `StateError` naming what is missing. |
| `message.headers()` | `string[string]` | The headers it is sent with: From, To, Cc (when set), Subject, Date (now) and MIME-Version. Never Bcc. |
| `message.preview()` | `string` | A short summary: From, To and Subject lines, a blank line and the body. |
| `message.stringify()` | `string` | The message exactly as `send` transmits it: MIME headers, a quoted-printable body and base64 attachments, without Bcc. |
| `message.toMap()` | `{from, to, cc, bcc, subject, body, html}` | The message as an object `email.new` accepts. Attachments are not included. |
| `message.clear()` | `void` | Removes recipients, subject, body and attachments, keeping the sender. |
| `message.reset()` | `void` | Clears everything, the sender included. |
| `message.send(host: string, options?)` | `result<unit, error>` | Delivers to every To, Cc and Bcc address through the SMTP server at `host`. |

Options for `message.send`:

| Key | Notes |
| --- | --- |
| `port` | Default 587, or 465 with `tls: "implicit"`. |
| `username`, `password` | Sign in. The password is only sent over TLS, or to a server on this machine. |
| `tls` | `"auto"` (default) upgrades with STARTTLS when offered; `"starttls"` requires it; `"implicit"` connects with TLS from the start; `"none"` never uses TLS. |
| `timeout` | Milliseconds for the whole exchange. Default 30000. |

### Errors from `send`

| Kind | When |
| --- | --- |
| `StateError` | The message has no sender or To address. |
| `PermissionError` | The server refuses the sign-in. |
| `UnsupportedError` | TLS is required but not offered, or a password would be sent unencrypted. |
| `NetworkError`, `TimeoutError` | The server can't be reached. |
| `RuntimeError` | The server refuses the message or a recipient. |
| `ValueError` (thrown) | Invalid options. |

```osl
import "std:email"

*email.Email message = email.new({from: "me@example.com", subject: "Hi"})
message.setBody("A long line that should be wrapped for old mail readers.", {wrap: 20})
auto ok, err = message.validate()
if err != null (
  log err.message
)
message.addTo("ada@example.com")
log message.preview()
```

## Behavior and limits

Non-ASCII subjects use MIME encoded-words. Bodies and attachments stay within SMTP's 998-character
line limit. Control characters in attachment names are dropped and non-ASCII names are encoded, so
a name can't inject headers.

## Changes from earlier versions

There is no shared package-level message any more: `email.setFrom`, `email.addTo`,
`email.sendGmail` and the other package functions that edited it are gone, as are `email.create`
and `email.fromMap`. Build a message with `email.new(options)` and call its methods. The
`get`-prefixed getters are now `to()`, `subject()`, `recipients()` and so on, and
`sendWithSmtp`, `sendGmail`, `sendOutlook` and the other senders are replaced by
`message.send(host, {port, username, password})`.
