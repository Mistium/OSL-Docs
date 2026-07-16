# originchats

> Bot framework for [OriginChats](https://github.com/Mistium/originchats) servers

The `originchats` package is a batteries-included bot framework: it handles the WebSocket
connection, the handshake → rotur validator → auth → ready flow, automatic reconnection,
slash command registration, and request/response matching, so a bot is just handlers.

```javascript
import "osl/originchats"
```

A minimal bot:

```javascript
import "osl/originchats"

*originchats.Bot bot = originchats.new("wss://chats.mistium.com", token)

bot.command("!hello", def(*originchats.Message msg) -> (
  msg.reply("Hello " ++ msg.user() ++ "!")
))

bot.run()
```

The package exposes three types:

- `*originchats.Bot` - the connection and everything you do with it
- `*originchats.Message` - a received (or just-sent) chat message
- `*originchats.Slash` - a slash command invocation

## Creating & running a bot

#### `originchats.new(url, token)` → `*originchats.Bot`
Creates a bot for the server at `url` (e.g. `"wss://chats.mistium.com"`). `token` is the bot's
rotur account token, used to fetch an auth validator during the handshake. Pass `""` to skip
rotur auth (e.g. local test servers).

```javascript
*originchats.Bot bot = originchats.new("wss://chats.mistium.com", config.token)
```

#### `bot.password(pw)` → `*originchats.Bot`
Sets the server password sent with `auth`, for password-protected servers. Chainable.

#### `bot.ignoreSelf(v)` → `*originchats.Bot`
Whether the bot's own messages are skipped by `onMessage` and `command` handlers.
Defaults to `true`. Raw `on(...)` handlers always see everything. Chainable.

#### `bot.timeout(seconds)` → `*originchats.Bot`
How long request/response calls (`send`, `reply`, `request`, `channels`, …) wait for the server
before giving up. Defaults to 10 seconds. Chainable.

#### `bot.run()`
Connects (retrying with backoff until the server is reachable) and blocks forever. The
connection auto-reconnects and re-authenticates if it drops. Call this last.

#### `bot.connect()` → `boolean`
Non-blocking alternative to `run()`: dials once and returns whether it connected. Use when your
program has its own main loop.

#### `bot.stop()`
Disables reconnection and closes the connection.

#### `bot.connected()` → `boolean`
Whether the bot has an active connection.

#### `bot.ready()` → `boolean`
Whether the bot has authenticated and received `ready` from the server.

## Handlers

Handlers may be named functions or lambdas. Each handler receives one context value (except
`on`, which gets the bot and the raw event). Handlers run concurrently in their own
goroutines, so it's safe to call blocking bot methods inside them; a handler that panics logs
the error instead of crashing the bot.

#### `bot.onReady(handler)`
Called with the bot (`def(*originchats.Bot b)`) once the server accepts authentication. Fires
again after every reconnect.

```javascript
bot.onReady(def(*originchats.Bot b) -> (
  log "logged in as " ++ b.username()
))
```

#### `bot.onMessage(handler)`
Called with a `*originchats.Message` for every chat message that isn't handled by a prefix
command (and isn't the bot's own, unless `ignoreSelf(false)`).

#### `bot.command(prefix, handler)`
Registers a prefix command. When a message starts with `prefix` (followed by a space or the end
of the message), the handler is called with the message; `msg.content()` has the prefix already
stripped. Matched messages don't reach `onMessage`.

```javascript
bot.command("!roll", def(*originchats.Message msg) -> (
  msg.reply("You rolled a " ++ (random(1, 6)).toStr())
))
```

#### `bot.slash(schema, handler)`
Registers a slash command. `schema` is the OriginChats slash command object
(`name`, `description`, `options`, and optionally `whitelistRoles`, `blacklistRoles`,
`ephemeral`); `options` and `description` are filled with defaults if omitted. Commands are
sent to the server automatically on `ready` (and after every reconnect). The handler is called
with a `*originchats.Slash`.

```javascript
bot.slash({
  name: "weather",
  description: "Get the weather",
  options: [{name: "city", description: "City name", type: "str", required: true}]
}, def(*originchats.Slash call) -> (
  call.respond("It is sunny in " ++ call.argStr("city"))
))
```

#### `bot.on(cmd, handler)`
Raw event handler for any protocol packet (`"typing"`, `"message_react_add"`,
`"user_connect"`, `"message_delete"`, `"error"`, …). The handler is called with the bot and the
raw event object: `def(*originchats.Bot b, object event)`. Fires in addition to the built-in
handling, including for `message_new` and `slash_call`.

```javascript
bot.on("message_react_add", def(*originchats.Bot b, object event) -> (
  log event.user.toStr() ++ " reacted with " ++ event.emoji.toStr()
))
```

## Sending & editing

Sending methods wait for the server's response (up to `timeout`) and return the created
message, so you can chain edits or reactions onto it.

#### `bot.send(channel, content)` → `*originchats.Message`
Sends a message to a channel.

```javascript
*originchats.Message m = bot.send("general", "hello!")
m.react("👋")
```

#### `bot.sendThread(threadId, content)` → `*originchats.Message`
Sends a message into a thread.

#### `bot.sendRaw(payload)` → `*originchats.Message`
Sends a `message_new` with a payload you build yourself - use this for attachments, pings, or
any protocol field the helpers don't cover. `cmd` is set for you.

```javascript
bot.sendRaw({channel: "general", content: "look", attachments: [{id: att_id}]})
```

#### `bot.edit(channel, id, content)` → `object`
Edits a message by id and returns the server response.

#### `bot.delete(channel, id)`
Deletes a message by id.

#### `bot.react(channel, id, emoji)` / `bot.unreact(channel, id, emoji)`
Adds or removes a reaction.

#### `bot.pin(channel, id)` / `bot.unpin(channel, id)`
Pins or unpins a message.

#### `bot.typing(channel)`
Shows the bot's typing indicator in a channel.

#### `bot.setStatus(status, text)`
Sets the bot's presence. `status` is `"online"`, `"idle"`, `"dnd"` or `"offline"`; `text` is a
custom status message.

## Queries

Each of these performs a round-trip to the server and returns the useful part of the response.
On timeout they return an empty value.

#### `bot.messages(channel, limit)` → `array`
The most recent messages in a channel.

#### `bot.message(channel, id)` → `object`
A single message by id.

#### `bot.channels()` → `array`
The server's channel list.

#### `bot.users()` → `array`
All known users.

#### `bot.usersOnline()` → `array`
Currently connected users.

#### `bot.roles()` → `object`
The server's roles, keyed by role name.

#### `bot.userRoles(username)` → `array`
Role names of one user.

#### `bot.request(payload)` → `object`
Escape hatch for any protocol command: attaches a listener, sends `payload`, and returns the
server's response. Returns `{error: "timeout"}` if no response arrives in time.

```javascript
object res = bot.request({cmd: "unreads_get"})
```

#### `bot.sendCmd(payload)`
Fire-and-forget raw packet - like `request` without waiting for a response.

## Bot info & state

#### `bot.username()` → `string`
The bot's username (from `ready`).

#### `bot.me()` → `object`
The bot's full user object.

#### `bot.server()` → `object`
Server info from the handshake (`name`, etc.).

#### `bot.serverUrl()` → `string`
The URL the bot was created with.

#### `bot.set(key, value)` / `bot.get(key)` → `any`
Thread-safe per-bot key/value storage, handy for sharing state between handlers.

## Message objects

`*originchats.Message` values arrive in `onMessage` and `command` handlers and are returned by
the sending methods.

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
- `msg.bot()` → `*originchats.Bot` - the bot that received it

#### Actions

All of these target the message's own channel or thread automatically.

- `msg.reply(content)` → `*originchats.Message` - reply (pings the author)
- `msg.replyNoPing(content)` → `*originchats.Message` - reply without pinging
- `msg.send(content)` → `*originchats.Message` - plain message to the same channel/thread
- `msg.react(emoji)` - add a reaction
- `msg.edit(content)` - edit this message (must be the bot's own)
- `msg.delete()` - delete this message

```javascript
bot.command("!ping", def(*originchats.Message msg) -> (
  *originchats.Message m = msg.reply("pong")
  m.edit("pong 🏓")
))
```

## Slash calls

`*originchats.Slash` values arrive in `bot.slash(...)` handlers.

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
- `call.bot()` → `*originchats.Bot` - the bot
- `call.respond(text)` - send the command response (routed to the invoking thread automatically)

## Multiple servers

Create one bot per server - handlers and state are per-bot. Since `run()` blocks, start extra
bots with `connect()` first:

```javascript
*originchats.Bot main_bot = originchats.new("wss://chats.mistium.com", token)
*originchats.Bot dm_bot = originchats.new("wss://dms.mistium.com", token)

// ... register handlers on both ...

dm_bot.connect()
main_bot.run()
```
