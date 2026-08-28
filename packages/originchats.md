# originchats

The `originchats` package is a batteries-included bot framework: it handles the WebSocket
connection, the handshake → rotur validator → auth → ready flow, automatic reconnection,
slash command registration, and request/response matching, so a bot is just handlers.

```osl
import "std:originchats"
```

A minimal bot:

```osl
import "std:originchats"

*originchats.client client = originchats.new("wss://chats.mistium.com")

client.command("!hello", def(*originchats.message msg) -> (
  msg.reply("Hello " ++ msg.user() ++ "!")
))

client.run(token)
```

The package exposes four types:

- `*originchats.client` - the connection and everything you do with it
- `*originchats.message` - a received (or just-sent) chat message
- `*originchats.slash` - a slash command invocation
- `*originchats.slashCommand` - a fluent builder for registering slash commands

## Creating & running a client

#### `originchats.new(url)` → `*originchats.client`
Creates a client for the server at `url` (e.g. `"wss://chats.mistium.com"`).

#### `client.run(token)`
Connects (retrying with backoff until the server is reachable) and blocks forever. `token` is
the bot's rotur account token, used to fetch an auth validator during the handshake - pass `""`
to skip rotur auth (e.g. local test servers). The connection auto-reconnects and
re-authenticates if it drops. Call this last.

#### `client.connect(token)` → `boolean`
Non-blocking alternative to `run`: dials once and returns whether it connected. Use when your
program has its own main loop.

#### `client.stop()`
Disables reconnection and closes the connection.

#### `client.connected()` → `boolean`
Whether the client has an active connection.

#### `client.ready()` → `boolean`
Whether the client has authenticated and received `ready` from the server.

#### `client.password(pw)` → `*originchats.client`
Sets the server password sent with `auth`, for password-protected servers. Chainable.

#### `client.ignoreSelf(v)` → `*originchats.client`
Whether the bot's own messages are skipped by `onMessageNew` and `command` handlers.
Defaults to `true`. Raw event handlers always see everything. Chainable.

#### `client.timeout(seconds)` → `*originchats.client`
How long request/response calls (`send`, `reply`, `request`, `channels`, …) wait for the server
before giving up. Defaults to 10 seconds. Chainable. Calls made while the socket is closed or
waiting to reconnect return `not connected` immediately. Completed requests stop their timers,
and `stop()` wakes every pending request with a `stopped` error.

## Event handlers

Handlers may be named functions or lambdas. Handlers run concurrently in their own goroutines,
so it's safe to call blocking client methods inside them; a handler that panics logs the error
instead of crashing the bot.

#### `client.onReady(handler)`
Called with the client (`def(*originchats.client c)`) once the server accepts authentication.
Fires again after every reconnect.

```osl
client.onReady(def(*originchats.client c) -> (
  log "logged in as " ++ c.username()
))
```

#### `client.onMessageNew(handler)`
Called with a `*originchats.message` for every chat message that isn't handled by a prefix
command (and isn't the bot's own, unless `ignoreSelf(false)`).

```osl
client.onMessageNew(def(*originchats.message msg) -> (
  log msg.user() ++ ": " ++ msg.content()
))
```

#### Dedicated event registrars

Each of these subscribes to one protocol event. The handler is called with the client and the
raw event object: `def(*originchats.client c, object event)`.

- `client.onMessageEdit(handler)` - a message was edited
- `client.onMessageDelete(handler)` - a message was deleted
- `client.onReactionAdd(handler)` - a reaction was added (`event.channel`, `event.id`, `event.emoji`, `event.from`)
- `client.onReactionRemove(handler)` - a reaction was removed
- `client.onTyping(handler)` - a user is typing
- `client.onUserConnect(handler)` - a user connected
- `client.onUserDisconnect(handler)` - a user disconnected
- `client.onUserJoin(handler)` - a user joined the server for the first time
- `client.onUserLeave(handler)` - a user left (deleted their account)
- `client.onError(handler)` - the server sent an error packet
- `client.onRateLimit(handler)` - the bot was rate limited (`event.length` ms to wait)

```osl
client.onReactionAdd(def(*originchats.client c, object event) -> (
  log event.user.toStr() ++ " reacted with " ++ event.emoji.toStr()
))
```

#### `client.on(cmd, handler)`
Generic escape hatch for any protocol packet by its `cmd` name (`"voice_user_joined"`,
`"unreads_update"`, …), with the same handler shape as the dedicated registrars. Fires in
addition to the built-in handling, including for `message_new` and `slash_call`.

## Commands

#### `client.command(prefix, handler)`
Registers a prefix command. When a message starts with `prefix` (followed by a space or the end
of the message), the handler is called with the message; `msg.content()` has the prefix already
stripped. Matched messages don't reach `onMessageNew`.

```osl
client.command("!roll", def(*originchats.message msg) -> (
  msg.reply("You rolled a " ++ (random(1, 6)).toStr())
))
```

#### `client.slashCommand(name)` → `*originchats.slashCommand`
Starts a fluent slash command builder. The leading `/` in `name` is optional. Chain option and
setting calls, then finish with `.fn(handler)` to register. Commands are sent to the server
automatically on `ready` (and after every reconnect).

```osl
client.slashCommand("/weather")
  .description("Get the weather")
  .addInput(originchats.string, "city", "City name")
  .addInput(originchats.boolean, "detailed", "Include the full forecast", false)
  .fn(def(*originchats.slash call) -> (
    call.respond("It is sunny in " ++ call.argStr("city"))
  ))
```

Builder methods (all chainable):

- `.description(text)` - what the command does (defaults to the command name)
- `.addInput(type, name)` / `.addInput(type, name, description)` / `.addInput(type, name, description, required)` -
  adds an option. `type` is one of the input type constants below. `required` defaults to `true`.
- `.addOption(option)` - adds a raw option object (use for `enum` options with `choices`)
- `.whitelistRoles(roles)` - only these roles may use the command
- `.blacklistRoles(roles)` - these roles may not use the command
- `.ephemeral(v)` - responses are only visible to the caller
- `.fn(handler)` - registers the command; the handler receives a `*originchats.slash`

#### Input type constants

| Constant | Protocol type | Meaning |
| --- | --- | --- |
| `originchats.string` | `str` | Free text |
| `originchats.integer` | `int` | Whole number |
| `originchats.number` | `float` | Decimal number |
| `originchats.boolean` | `bool` | true/false |
| `originchats.username` | `user` | A username - clients render a member picker |
| `originchats.choice` | `enum` | One of a fixed set (needs `choices` via `.addOption`) |

#### `client.slash(schema, handler)`
Protocol-level registration for when you already have a full slash command schema object
(`name`, `description`, `options`, `whitelistRoles`, `blacklistRoles`, `ephemeral`). Adding a
command after `ready` resends the client's complete command set because registration replaces
the server-side set for that connection.
`slashCommand(...)` is sugar over this.

## Sending & editing

Sending methods wait for the server's response (up to `timeout`) and return the created
message, so you can chain edits or reactions onto it. They return `null` if the request fails
or the server rejects the message.

#### `client.send(channel, content)` → `*originchats.message`
Sends a message to a channel.

```osl
*originchats.message m = client.send("general", "hello!")
m.react("👋")
```

#### `client.sendThread(threadId, content)` → `*originchats.message`
Sends a message into a thread.

#### `client.sendRaw(payload)` → `*originchats.message`
Sends a `message_new` with a payload you build yourself - use this for attachments, pings, or
any protocol field the helpers don't cover. `cmd` is set for you.

```osl
client.sendRaw({channel: "general", content: "look", attachments: [{id: att_id}]})
```

#### `client.edit(channel, id, content)` → `object`
Edits a message by id and returns the server response.

#### `client.delete(channel, id)`
Deletes a message by id.

#### `client.react(channel, id, emoji)` / `client.unreact(channel, id, emoji)`
Adds or removes a reaction.

#### `client.pin(channel, id)` / `client.unpin(channel, id)`
Pins or unpins a message.

#### `client.typing(channel)`
Shows the bot's typing indicator in a channel.

## Queries

Each of these performs a round-trip to the server and returns the useful part of the response.
On timeout they return an empty value.

#### `client.messages(channel, limit)` → `array`
The most recent messages in a channel.

#### `client.message(channel, id)` → `object`
A single message by id.

#### `client.channels()` → `array`
The server's channel list.

#### `client.users()` → `array`
All known users.

#### `client.usersOnline()` → `array`
Currently connected users.

#### `client.roles()` → `object`
The server's roles, keyed by role name.

#### `client.userRoles(username)` → `array`
Role names of one user.

#### `client.request(payload)` → `object`
Escape hatch for any protocol command: attaches a listener, sends `payload`, and returns the
server's response. Returns `{error: "timeout"}` if no response arrives in time.

```osl
object res = client.request({cmd: "unreads_get"})
```

#### `client.sendCmd(payload)`
Fire-and-forget raw packet - like `request` without waiting for a response.

## Client info & state

#### `client.details()` → `object`
Returns the complete server handshake details as a defensive copy. This includes `server`,
`limits`, `uploads`, `attachments`, `version`, `validator_key`, `capabilities`, and `permissions`,
plus any fields added by newer servers.

```osl
object details = client.details()
log details.limits.post_content
log details.attachments.max_size
```

#### `client.supports(command)` → `boolean`
Whether the server advertised `command` in its handshake capability list. Use this before
calling newer commands through `request()` or `sendCmd()`.

```osl
if client.supports("messages_search") (
  object response = client.request({cmd: "messages_search", query: "release"})
)
```

#### `client.username()` → `string`
The bot's username (from `ready`).

#### `client.me()` → `object`
The bot's full user object.

#### `client.server()` → `object`
Server info from the handshake (`name`, etc.).

#### `client.serverUrl()` → `string`
The URL the client was created with.

#### `client.set(key, value)` / `client.get(key)` → `any`
Thread-safe per-client key/value storage, handy for sharing state between handlers.

## Message objects

`*originchats.message` values arrive in `onMessageNew` and `command` handlers and are returned
by the sending methods.

#### Accessors

- `msg.user()` → `string` - the sender's username
- `msg.content()` → `string` - the text (prefix already stripped in `command` handlers)
- `msg.channel()` → `string` - channel name (empty for thread messages)
- `msg.threadId()` → `string` - thread id (empty for channel messages)
- `msg.id()` → `string` - message id
- `msg.timestamp()` → `number` - unix timestamp
- `msg.isReply()` → `boolean` - whether this message replies to another
- `msg.replyTo()` → `object` - `{id, user}` of the replied-to message
- `msg.attachments()` → `array` - attachment objects
- `msg.pings()` → `object` - `{users, roles, replies}` ping summary
- `msg.mentions(name)` → `boolean` - whether the message pings or `@`-mentions `name`
- `msg.isAutomated()` → `boolean` - whether it came from a webhook or slash interaction
- `msg.data()` → `object` - the raw message object
- `msg.raw()` → `object` - the whole `message_new` event
- `msg.client()` → `*originchats.client` - the client that received it

#### Actions

All of these share the same owner validation and automatically target the message's own channel or thread.

- `msg.reply(content)` → `*originchats.message` - reply (pings the author)
- `msg.replyNoPing(content)` → `*originchats.message` - reply without pinging
- `msg.send(content)` → `*originchats.message` - plain message to the same channel/thread
- `msg.react(emoji)` - add a reaction
- `msg.edit(content)` - edit this message (must be the bot's own)
- `msg.delete()` - delete this message

```osl
client.command("!ping", def(*originchats.message msg) -> (
  *originchats.message m = msg.reply("pong")
  m.edit("pong 🏓")
))
```

## Slash calls

`*originchats.slash` values arrive in slash command handlers.

- `call.command()` → `string` - the command name
- `call.user()` → `string` - username of the invoker
- `call.invoker()` → `string` - user id of the invoker
- `call.channel()` → `string` - channel it was invoked in
- `call.threadId()` → `string` - thread it was invoked from, if any
- `call.args()` → `object` - all arguments
- `call.arg(name)` → `any` - one argument (`null` if absent)
- `call.argStr(name)` → `string` / `call.argNum(name)` → `number` / `call.argBool(name)` → `boolean` - typed argument access
- `call.has(name)` → `boolean` - whether an argument was provided
- `call.raw()` → `object` - the whole `slash_call` event
- `call.client()` → `*originchats.client` - the client
- `call.respond(text)` - send the command response, correlated with the incoming `slash_call` id

## Multiple servers

Create one client per server - handlers and state are per-client. Since `run` blocks, start
extra clients with `connect` first:

```osl
*originchats.client main_chat = originchats.new("wss://chats.mistium.com")
*originchats.client dms = originchats.new("wss://dms.mistium.com")

// ... register handlers on both ...

dms.connect(token)
main_chat.run(token)
```

## Reliability and security

`wss://` connections use normal TLS certificate verification. Malformed frames
are ignored, callback panics are contained, duplicate listeners run
independently, and client state is synchronized for concurrent handlers.
Connections reuse the `ws` dialer, construction, and worker lifecycle. Client
state uses shared read/write lock paths, message and slash accessors share one
nil-safe projection, and callback fan-out shares one panic boundary. `stop()` is
idempotent and releases pending requests with a stopped error.
