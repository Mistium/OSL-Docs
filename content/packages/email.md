---
description: Compose email with recipients, HTML bodies and attachments, check it, and send it through an SMTP server.
package: email
---

# email

`std:email` builds an email message and sends it through an SMTP server. Composing needs no network, so you can build, check and print a message to see exactly what would go out. Only `send` talks to a server.

## Build a message

`email.new(options)` returns a result, because it checks every address. Add recipients, set a body, and read the pieces back:

```osl
import "std:email"

auto mail = email.new({from: "ada@example.com", to: "bob@example.com", subject: "Lunch?"}).unwrap()
mail.setBody("Hi Bob,\nare you free at noon?")

log mail.from() mail.to() mail.subject()
log mail.preview()
```

```output
ada@example.com ["bob@example.com"] Lunch?
From: ada@example.com
To: bob@example.com
Subject: Lunch?

Hi Bob,
are you free at noon?
```

`preview()` is a quick look for logs and tests.

## More recipients

`addTo`, `addCc` and `addBcc` add one address each, and `setTo` and friends replace the lot. Bcc addresses get the message but never appear in the headers:

```osl
import "std:email"

auto mail = email.new({from: "ada@example.com", to: ["bob@example.com", "cy@example.com"]}).unwrap()
mail.addCc("dee@example.com").unwrap()
mail.addBcc("boss@example.com").unwrap()

log mail.recipients()
log mail.bcc()
log mail.hasRecipient("boss@example.com")
log mail.stringify().contains("boss@example.com")
```

```output
["bob@example.com","cy@example.com","dee@example.com","boss@example.com"]
["boss@example.com"]
true
false
```

## Bad addresses

Adding a bad address fails and leaves the message as it was:

```osl
import "std:email"

auto mail = email.new({from: "ada@example.com"}).unwrap()

auto bad = mail.addTo("not an address")
log bad.isErr() bad.unwrapErr().kind
log mail.to()

log email.new({from: "nope"}).isErr()
```

```output
true ValueError
[]
true
```

## Check before sending

`validate()` says whether the message can be sent: it needs a sender, a recipient and a subject, and it explains what is missing:

```osl
import "std:email"

auto mail = email.new({to: "bob@example.com"}).unwrap()
log mail.validate().unwrapErr().message

mail.setFrom("ada@example.com").unwrap()
log mail.validate().unwrapErr().message

mail.setSubject("Hi")
mail.setBody("hello")
log mail.validate().isOk()
```

```output
email.Email.validate: the message has no sender; call setFrom first
email.Email.validate: the message has no subject; call setSubject first
true
```

## HTML and attachments

`setBody(text, {html: true})` sends the body as HTML. `attach(name, data)` adds a file from memory and `attachFile(path)` one from disk:

```osl
import "std:email"

auto mail = email.new({from: "ada@example.com", to: "bob@example.com", subject: "Report"}).unwrap()
mail.setBody("<h1>Weekly report</h1><p>See attached.</p>", {html: true})
mail.attach("numbers.csv", "week,sales\n1,10\n2,14\n").unwrap()

log mail.isHTML()
log mail.attachments()
string wire = mail.stringify()
log wire.contains("Content-Type: text/html")
log wire.contains("numbers.csv")
```

```output
true
["numbers.csv"]
true
true
```

`stringify()` returns the complete message as `send` would transmit it, which is useful for tests that check what an app would email.

:::quiz
Which recipients appear in the message's headers?

- [x] To and Cc.
- [ ] To, Cc and Bcc.
- [ ] Only To.

Bcc recipients are delivered to but never listed, so the others can't see them.
:::

## Sending

`mail.send(host, options)` delivers the message. The defaults suit a normal provider: port 587 with TLS negotiated when the server offers it. Credentials go in the options:

```osl norun
import "std:email"
import "std:env"

auto mail = email.new({from: "ada@example.com", to: "bob@example.com", subject: "Hi"}).unwrap()
mail.setBody("Sent from OSL")

auto outcome = mail.send("smtp.example.com", {
  username: env.get("SMTP_USER"),
  password: env.get("SMTP_PASSWORD")
})
switch outcome (
  case ok(_)
    log "sent"
  case err(e)
    log "not sent:" e.kind e.message
)
```

Failures come back as an error: `NetworkError` and `TimeoutError` for connection trouble, `PermissionError` for a refused login, `UnsupportedError` when the server has no TLS and you gave a password (the password would travel in the clear), `RuntimeError` when the server refuses the sender, recipient or message, and `StateError` when the message isn't valid. Read the password from [env](env.md), not from source.

:::exercise title="A receipt"
Build a message from `shop@example.com` to a customer with the subject `Your receipt` and a body of `Total: 12.50`. Print its subject, and whether it is valid.

```osl
import "std:email"

auto mail = email.new({}).unwrap()

log mail.subject()
log mail.validate().isOk()
```

```output
Your receipt
true
```

> [!hint]
> Pass `from`, `to` and `subject` to `email.new`.

> [!hint]
> `mail.setBody("Total: 12.50")` sets the body.

```osl solution
import "std:email"

auto mail = email.new({
  from: "shop@example.com",
  to: "ada@example.com",
  subject: "Your receipt"
}).unwrap()
mail.setBody("Total: 12.50")

log mail.subject()
log mail.validate().isOk()
```

```output
Your receipt
true
```
:::

## API reference

::api
