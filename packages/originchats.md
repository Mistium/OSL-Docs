# originchats

`originchats` is a bot framework for [originChats](https://github.com/Mistium/originChats)
servers. It handles the WebSocket connection, the handshake, rotur authentication, reconnection,
slash command registration and request/response matching, so a bot is just handlers.

```osl
import "std:originchats"
```

## Example

```osl
import "std:originchats"
import "std:env"
import "std:random"

*originchats.Client bot = originchats.new("wss://chats.mistium.com", {token: env.require("ROTUR_TOKEN")})

bot.on("ready", def(*originchats.Client client, object packet) -> (
  log "logged in as " ++ (client.username() ?? "?")
))

bot.command("!hello", def(*originchats.Message msg) -> (
  msg.reply("Hello " ++ msg.user() ++ "!")
))

bot.on("message", def(*originchats.Message msg) -> (
  if msg.mentionsMe() (
    msg.react("👋")
  )
))

bot.slashCommand("roll")
  .description("Roll a die")
  .addInteger("sides", {description: "number of sides", required: false})
  .fn(def(*originchats.Slash call) -> (
    int sides = 6
    if call.has("sides") (
      sides = call.argNum("sides").toInt()
    )
    call.respond("You rolled " ++ random.between(1, sides))
  ))

bot.run()
```

`bot.run()` blocks until `bot.stop()`. Use `bot.start()` instead when the program has its own main
loop; it returns once the bot is logged in and ready.

## Types

| Type | What it is |
| --- | --- |
| `*originchats.Client` | The connection and everything you do with it. |
| `*originchats.Channel` | A channel or thread you can send to and read from. |
| `*originchats.Message` | A received or sent chat message. |
| `*originchats.Slash` | One slash command call. |
| `*originchats.SlashCommand` | A builder for registering a slash command. |
| `*originchats.Embed` | A rich embed or poll builder. |

## API reference

### `originchats`

| Method | Returns | Notes |
| --- | --- | --- |
| `originchats.new(url: string, options?)` | `*originchats.Client` | A bot client for a `ws://` or `wss://` server. `start()` or `run()` opens the connection. |
| `originchats.newEmbed(options?)` | `*originchats.Embed` | A rich embed. Options: `title`, `description`, `url`, `color` (`"#rrggbb"` or `{r, g, b}`). |
| `originchats.newPoll(question: string, choices: array, options?)` | `*originchats.Embed` | A poll embed. `choices` are strings or `{text, emoji}` objects. Option: `multiselect`. |

Options for `originchats.new`:

| Key | Notes |
| --- | --- |
| `token` | rotur account token. |
| `username`, `password` | A local account instead of a token. |
| `register` | `true` creates that local bot account on first connect. |
| `serverPassword` | For password-protected servers. |
| `invite` | Invite code. |
| `clientName` | Reported client name. Default `"osl"`. |
| `timeout` | Milliseconds to wait for the server. Default 10000. |
| `ignoreSelf` | Default `true`: no `"message"` events for the bot's own messages. |
| `signing` | Default `true`: sign messages with the rotur identity key when the server supports it. |
| `roturURL` | rotur API origin. Default `https://api.rotur.dev`. |

### Errors

Requests fail as results with a kind inferred from the server's error text, which the message
keeps:

| Kind | When |
| --- | --- |
| `StateError` | The client isn't connected, or the server rate-limits it. `stop()` also fails waiting requests with `StateError`. |
| `TimeoutError` | The server doesn't answer in time. |
| `PermissionError` | The server refuses (including a refused login). |
| `NotFoundError` | The target doesn't exist. |
| `ValueError` | The server rejects the input. |
| `NetworkError` | `start()` can't reach the server, or an upload can't. |
| `RuntimeError` | Anything else. |

### `*originchats.Client`: connection

| Method | Returns | Notes |
| --- | --- | --- |
| `client.start()` | `result<unit, error>` | Connects, logs in and waits until ready. Later drops reconnect by themselves. Already started is a no-op. |
| `client.run()` | `result<unit, error>` | Starts and blocks until `stop()`, retrying a failed start with backoff (1 s up to 30 s). Fails with `PermissionError` when the login is refused. |
| `client.stop()` | `void` | Closes the connection and ends `run()`. The client can be started again. Stopping twice is a no-op. |
| `client.isConnected()` | `boolean` | Whether the websocket is open (it may still be logging in). |
| `client.isReady()` | `boolean` | Whether the bot is logged in and ready. |
| `client.username()` | `string?` | The bot's username, or `null` before ready. |
| `client.userID()` | `string?` | The bot's user id, or `null` before ready. |
| `client.me()` | `any` | The bot's user object, or `null` before ready. |
| `client.server()` | `any` | The server info object from the handshake (`{name, icon, ...}`), or `null`. |
| `client.details()` | `any` | The whole handshake object, or `null`. |
| `client.limits()` | `any` | The server's limits object, or `null`. |
| `client.supports(command: string)` | `boolean` | Whether the server advertised a capability. |
| `client.url()` | `string` | The websocket address. |
| `client.httpURL()` | `result<string, error>` | The server's HTTP origin. Fails with `ParseError`. |
| `client.now()` | `number` | The server clock, in unix ms. |
| `client.latency()` | `result<number, error>` | Round trip to the server in ms. |
| `client.set(key: string, value)` | `void` | Stores a value for sharing state between handlers. |
| `client.get(key: string)` | `any` | A stored value, or `null`. |
| `client.call(payload: object, options?)` | `result<any, error>` | Sends a raw command (with a `cmd` key) and returns the answer, for commands without a method. Option: `wait` (default `true`; `false` returns `null` without waiting). |

### `*originchats.Client`: events and commands

| Method | Returns | Notes |
| --- | --- | --- |
| `client.on(event: string, handler)` | `void` | Adds a handler (see below). |
| `client.off(event: string, handler)` | `void` | Removes a handler added with `on`. |
| `client.command(prefix: string, handler)` | `void` | Runs `handler(message)` for messages starting with `prefix` as a whole word, with the prefix stripped from `message.content()`. The first matching command wins, and `"message"` doesn't fire for it. |
| `client.slashCommand(name: string)` | `*originchats.SlashCommand` | Starts a slash command (a leading `/` is dropped). |
| `client.slash(schema: object, handler)` | `void` | Registers a slash command from a raw schema in the server's format. Registering a name again replaces it. Throws `ValueError` without a name. |

Events for `client.on`:

| Event | Handler | Notes |
| --- | --- | --- |
| `"ready"` | `handler(client, packet)` | After every (re)connect. |
| `"disconnect"` | `handler(client)` | When a ready connection drops. |
| `"message"` | `handler(message)` | Each new message no prefix command took. |
| Any server command name | `handler(client, packet)` | Such as `"message_new"`, `"message_edit"`, `"message_delete"`, `"reaction_add"`, `"typing"`, `"user_join"`, `"thread_create"`, `"poll_vote"`, `"rate_limit"`, `"error"`. |
| `"*"` | `handler(client, packet)` | Every packet. |

Handlers run on background threads. A handler that throws has its error printed, and the bot
keeps running.

### `*originchats.Client`: server data and moderation

| Method | Returns | Notes |
| --- | --- | --- |
| `client.channel(name: string)` | `*originchats.Channel` | A handle for a channel. Nothing is sent until you use it. |
| `client.thread(threadID: string)` | `*originchats.Channel` | A handle for a thread. |
| `client.channels()` | `result<array, error>` | The server's channels. |
| `client.users()`, `client.usersOnline()`, `client.usersBanned()` | `result<array, error>` | Members, online members, banned users. |
| `client.roles()` | `result<object, error>` | Role name to role. |
| `client.userRoles(username: string)` | `result<array, error>` | Role names a user has. |
| `client.status(username: string)` | `result<object, error>` | A user's status object. |
| `client.unreads()` | `result<object, error>` | Channel to unread state. |
| `client.recentPings(options?)` | `result<array, error>` | Recent messages that mention the bot. Option: `limit`. |
| `client.emojis()`, `client.stickers()`, `client.stats()` | `result<object, error>` | Server data as the server reports it. |
| `client.poll(pollID: string)` | `result<object, error>` | A poll with its votes. |
| `client.vote(pollID: string, ...optionIDs)` | `result<unit, error>` | Votes for one or more option ids. |
| `client.endPoll(pollID: string)` | `result<unit, error>` | Closes a poll. |
| `client.attachments(offset: int, limit: int)` | `result<array, error>` | The bot's uploaded attachments. |
| `client.uploadBytes(name: string, data: byte[], options?)` | `result<object, error>` | Stores a file and returns the attachment object for `send({attachments})`. Option: `mimeType` (guessed from `name` by default). |
| `client.uploadFile(path: string, options?)` | `result<object, error>` | Uploads a local file. Options: `name`, `mimeType`. Fails with `NotFoundError` for a missing file. |
| `client.updateStatus(status: string, options?)` | `result<unit, error>` | `"online"`, `"idle"`, `"dnd"` or `"offline"`. Option: `text`. |
| `client.ban(username)`, `client.unban(username)` | `result<unit, error>` | |
| `client.kickUser(username: string, options?)` | `result<unit, error>` | Option: `reason`. |
| `client.muteUser(username: string, duration: number, options?)` | `result<unit, error>` | Times a user out for `duration` ms (whole seconds). Option: `reason`. |
| `client.setNickname(username: string, nickname: string)` | `result<unit, error>` | |
| `client.setRoles(username: string, roles: array)` | `result<unit, error>` | Replaces a user's roles. |
| `client.createRole(role: object)`, `client.updateRole(role: object)` | `result<unit, error>` | Fields in the server's format; `updateRole` matches on `role.name`. |
| `client.deleteRole(name: string)` | `result<unit, error>` | |
| `client.createChannel(name: string, fields?)` | `result<unit, error>` | A text channel. `fields` are extra channel fields, such as `{type: "voice"}`. |
| `client.updateChannel(name: string, updates: object)` | `result<unit, error>` | |
| `client.deleteChannel(name: string)` | `result<unit, error>` | |
| `client.deleteWebhook(id: string)` | `result<unit, error>` | |

### `*originchats.Client`: signing

| Method | Returns | Notes |
| --- | --- | --- |
| `client.isSigning()` | `boolean` | Whether outgoing messages are signed: signing is on, the server supports it and the rotur key loaded. |
| `client.setSigning(enabled: boolean)` | `void` | Turns signing on or off while the bot runs. |
| `client.signingKeyID()` | `string?` | Id of the rotur key the bot signs with, or `null`. |
| `client.signingURL()` | `string` | The server URL bound into signatures. |

### `*originchats.Channel`

| Method | Returns | Notes |
| --- | --- | --- |
| `channel.send(content: string, options?)` | `result<*originchats.Message, error>` | Posts a message. Options: `embeds` (embeds or objects), `attachments` (objects from an upload), `alias` (`{name, avatar, color}`), `replyTo` (message id), `ping` (default `true`). |
| `channel.typing()` | `result<unit, error>` | Shows the bot as typing for a few seconds. |
| `channel.get(id: string)` | `result<*originchats.Message, error>` | Fetches a message. Fails with `NotFoundError`. |
| `channel.messages(limit: int)` | `result<array, error>` | Newest messages as objects, oldest first. |
| `channel.messagesBefore(id: string, limit: int)` | `result<array, error>` | Messages older than `id`. |
| `channel.messagesAround(id: string, above: int, below: int)` | `result<array, error>` | A message with its neighbours. |
| `channel.messagesBatch(ids: array)` | `result<array, error>` | The messages with these ids. |
| `channel.pinned()` | `result<array, error>` | Pinned messages. |
| `channel.search(query: string, filters?)` | `result<object, error>` | `{results, total, has_more}`. `filters` go to the server as is, such as `{pinned: true}`. |
| `channel.markRead(options?)` | `result<unit, error>` | Option: `messageID` (read up to it). |
| `channel.info()` | `result<object, error>` | The channel's or thread's info. |
| `channel.listThreads(options?)` | `result<array, error>` | Option: `limit`. |
| `channel.createThread(name: string)` | `result<*originchats.Channel, error>` | Starts a thread. |
| `channel.webhooks()` | `result<array, error>` | |
| `channel.createWebhook(name: string)` | `result<object, error>` | The new webhook, with its token. |
| `channel.rename(name)`, `channel.archive(archived)`, `channel.lock(locked)`, `channel.join()`, `channel.leave()`, `channel.remove()`, `channel.pinThread()`, `channel.unpinThread()` | `result<unit, error>` | Thread operations. Throw `StateError` on a channel handle. |
| `channel.name()` | `string` | `""` for a thread handle. |
| `channel.threadID()` | `string?` | `null` for a channel. |
| `channel.isThread()` | `boolean` | |
| `channel.client()` | `*originchats.Client` | |

### `*originchats.Message`

| Method | Returns | Notes |
| --- | --- | --- |
| `message.id()`, `message.user()`, `message.content()`, `message.channel()` | `string` | Inside a prefix command, `content()` is the text after the prefix. |
| `message.authorID()` | `string` | The author's rotur user id (`""` when not sent). |
| `message.threadID()` | `string?` | `null` outside threads. |
| `message.sentAt()` | `number` | Unix ms. |
| `message.args()` | `array` | `content()` split on whitespace. |
| `message.arg(index: int)` | `string?` | The index-th word (1 for the first), or `null`. |
| `message.target()` | `*originchats.Channel` | The channel or thread the message is in. |
| `message.client()` | `*originchats.Client` | |
| `message.reply(content: string, options?)` | `result<*originchats.Message, error>` | Options: `ping` (default `true`), `embeds`, `attachments`, `alias`. |
| `message.edit(content: string, options?)` | `result<unit, error>` | Only the bot's own messages. Options: `embeds`, `attachments`. |
| `message.delete()` | `result<unit, error>` | |
| `message.react(emoji)`, `message.unreact(emoji)` | `result<unit, error>` | |
| `message.pin()`, `message.unpin()` | `result<unit, error>` | |
| `message.replies()` | `result<array, error>` | Replies as objects. |
| `message.isReply()`, `isPinned()`, `isEdited()`, `isEphemeral()`, `isThread()`, `isAutomated()`, `isSigned()` | `boolean` | `isAutomated` is true for webhook and slash command messages. |
| `message.mentions(name: string)` | `boolean` | Whether it pings `name` or contains `@name`, ignoring case. |
| `message.mentionsMe()` | `boolean` | Whether it mentions the bot. |
| `message.verify()` | `result<boolean, error>` | Whether its rotur signature is valid for the author. Unsigned, stale (over 5 minutes off) and unknown keys are `false`; fails only when the key can't be fetched. |
| `message.verifyEmbeds()` | `result<boolean, error>` | Whether it has embeds and every one carries a valid author signature. |
| `message.replyTo()`, `alias()`, `webhook()`, `interaction()`, `poll()` | `any` | Those parts of the message, or `null`. |
| `message.attachments()`, `message.embeds()` | `array` | |
| `message.reactions()` | `object` | Emoji to the usernames who reacted. |
| `message.pings()` | `object` | `{users, roles, replies}`. |
| `message.data()` | `object` | The message as the server sent it. |
| `message.raw()` | `object` | The whole packet it arrived in. |

### `*originchats.SlashCommand`

Each method changes the command and returns it, so calls chain. Finish with `fn(handler)`.

| Method | Notes |
| --- | --- |
| `cmd.description(text: string)` | |
| `cmd.addString(name: string, options?)` | Text input. Options: `description` (default `name`), `required` (default `true`). |
| `cmd.addInteger(name, options?)`, `cmd.addNumber(name, options?)`, `cmd.addBoolean(name, options?)`, `cmd.addUser(name, options?)` | Typed inputs, same options. |
| `cmd.addChoices(name: string, choices: string[], options?)` | An input limited to `choices`. |
| `cmd.addOption(option: object)` | A raw option in the server's format. |
| `cmd.whitelistRoles(roles: array)`, `cmd.blacklistRoles(roles: array)` | Who may use it. |
| `cmd.ephemeral(on: boolean)` | Responses visible only to the caller. |
| `cmd.fn(handler)` | Registers the command with `handler(call)`. |

### `*originchats.Slash`

| Method | Returns | Notes |
| --- | --- | --- |
| `call.respond(text: string)` | `result<unit, error>` | Answers the call. |
| `call.command()`, `call.id()`, `call.channel()`, `call.invoker()`, `call.user()` | `string` | `invoker` is the caller's user id. |
| `call.threadID()` | `string?` | |
| `call.args()` | `object` | Every argument by input name. |
| `call.arg(name: string)` | `any` | An argument, or `null`. |
| `call.argStr(name)`, `call.argNum(name)`, `call.argBool(name)` | `string`, `number`, `boolean` | `""`, `0` or `false` when not given; check with `has`. |
| `call.has(name: string)` | `boolean` | Whether the argument was given. |
| `call.isEphemeral()`, `call.isSigned()` | `boolean` | |
| `call.verify()` | `result<boolean, error>` | Whether the caller's rotur signature is valid. |
| `call.target()` | `*originchats.Channel` | Where the command was called. |
| `call.client()` | `*originchats.Client` | |
| `call.raw()` | `object` | The whole `slash_call` packet. |

### `*originchats.Embed`

Each setter changes the embed and returns it, so calls chain.

| Method | Notes |
| --- | --- |
| `embed.title(text)`, `embed.description(text)`, `embed.url(link)` | |
| `embed.color(value)` | `"#rrggbb"`, `{r, g, b}` or a `0xRRGGBB` number. Throws `ValueError` for a malformed color. |
| `embed.markdown(on: boolean)` | Markdown rendering. |
| `embed.timestamp(value: string)` | An ISO 8601 time. |
| `embed.image(link)`, `embed.thumbnail(link)`, `embed.video(link)`, `embed.audio(link)` | Media. |
| `embed.withAuthor(name: string, options?)` | Options: `url`, `iconURL`. |
| `embed.withFooter(text: string, options?)` | Option: `iconURL`. |
| `embed.addField(name: string, value: string, options?)` | Option: `inline`. |
| `embed.asPoll(question: string, choices: array, options?)` | Turns the embed into a poll. Option: `multiselect`. |
| `embed.build()` | Returns the object the server receives. |

```osl
import "std:originchats"

*originchats.Client bot = originchats.new("wss://chats.mistium.com", {token: "..."})
bot.start()

*originchats.Embed card = originchats.newEmbed({title: "Release", color: "#4caf50"})
  .addField("Version", "2.0", {inline: true})
  .withFooter("osl")
bot.channel("general").send("New release!", {embeds: [card]})
bot.channel("general").send("", {embeds: [originchats.newPoll("Lunch?", ["Pizza", "Sushi"])]})
bot.stop()
```

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `client.onReady`, `onDisconnect`, `onMessageNew`, `onMessageEdit`, `onMessageDelete`, `onMessagePin`, `onMessageUnpin`, `onReactionAdd`, `onReactionRemove`, `onTyping`, `onUserConnect`, `onUserDisconnect`, `onUserJoin`, `onUserLeave`, `onUserUpdate`, `onMessagesDelete`, `onThreadCreate`, `onThreadUpdate`, `onThreadDelete`, `onPollVote`, `onPollEnd`, `onError`, `onRateLimit` | `client.on("ready" \| "disconnect" \| "message" \| "message_edit" \| ..., handler)` |
| `client.onStatus(handler)` | `client.on("status_get", handler)` and `client.on("user_status", handler)` |
| `client.onUnreads(handler)` | `client.on("unreads_update", handler)` |
| `client.password(pw)`, `invite(code)`, `login(user, pass)`, `register(user, pass)`, `clientName(name)`, `roturApi(base)`, `ignoreSelf(v)` | `originchats.new(url, {serverPassword, invite, username, password, register, clientName, roturURL, ignoreSelf})` |
| `client.timeout(seconds)` | `originchats.new(url, {timeout: ms})` |
| `client.signing(enabled)` | `client.setSigning(enabled)` or `originchats.new(url, {signing})` |
| `client.connect(token?)` (returned a boolean) | `client.start()` |
| `client.connected()`, `client.ready()` | `client.isConnected()`, `client.isReady()` |
| `client.serverUrl()` | `client.url()` |
| `client.signingKey()` (returned the private key) | `client.signingKeyID()` |
| `client.serverTime()` (seconds) | `client.now()` (unix ms) |
| `client.pings(limit?)` | `client.recentPings({limit})` |
| `client.setStatus(status, text?)` | `client.updateStatus(status, {text})` |
| `client.kick(username, reason?)` | `client.kickUser(username, {reason})` |
| `client.mute(username, seconds, reason?)` | `client.muteUser(username, ms, {reason})` |
| `client.send(channel, content)`, `client.sendEmbed(...)`, `client.sendRaw(payload)` | `client.channel(name).send(content, options)` |
| `client.sendThread(threadID, content)` | `client.thread(threadID).send(content)` |
| `client.edit`, `delete`, `react`, `unreact`, `pin`, `unpin` (by channel and id) | `client.channel(name).get(id)` then the message method |
| `client.typing(channel)` | `client.channel(name).typing()` |
| `client.messages(channel, limit)`, `client.message(channel, id)`, `client.search(channel, query)` | `client.channel(name).messages(limit)`, `.get(id)`, `.search(query)` |
| `client.upload(name, data, mimeType)` | `client.uploadBytes(name, data, {mimeType})` or `client.uploadFile(path)` |
| `client.sendCmd(payload)` | `client.call(payload, {wait: false})` |
| `client.request(payload)`, `client.ok(payload)` | `client.call(payload)` |
| `client.dispatch(raw)` | None; an internal hook |
| `channel.sendWith`, `sendEmbed`, `sendAttachment`, `sendAs` | `channel.send(content, {embeds, attachments, alias})` |
| `channel.edit`, `editWith`, `delete`, `react`, `unreact`, `pin`, `unpin`, `message`, `replies` (by id) | `channel.get(id)` then the message method |
| `channel.ack(messageID?)` | `channel.markRead({messageID})` |
| `channel.threads(limit?)` | `channel.listThreads({limit})` |
| `message.send`, `sendWith`, `sendEmbed`, `typing` | `message.target().send(...)`, `message.target().typing()` |
| `message.replyNoPing(content)` | `message.reply(content, {ping: false})` |
| `message.replyWith(payload)`, `message.replyEmbed(content, embed)` | `message.reply(content, options)` |
| `message.editWith(payload)` | `message.edit(content, options)` |
| `message.timestamp()` (seconds) | `message.sentAt()` (unix ms) |
| `call.send(content)`, `call.sendEmbed(content, embed)` | `call.target().send(content, options)` |
| `cmd.addInput(kind, name, ...)` and the constants `originchats.username`, `string`, `integer`, `number`, `boolean`, `choice` | `cmd.addString`, `addInteger`, `addNumber`, `addBoolean`, `addUser` |
| `cmd.addChoice(name, choices, ...)` | `cmd.addChoices(name, choices, {description, required})` |
| `originchats.embed(title?, description?)` | `originchats.newEmbed({title, description})` |
| `originchats.poll(question, options, multiselect?)` | `originchats.newPoll(question, choices, {multiselect})` |
| `embed.author(name, url?, iconURL?)` | `embed.withAuthor(name, {url, iconURL})` |
| `embed.footer(text, iconURL?)` | `embed.withFooter(text, {iconURL})` |
| `embed.field(name, value, inline?)` | `embed.addField(name, value, {inline})` |
| `embed.poll(question, options, multiselect?)` | `embed.asPoll(question, choices, {multiselect})` |

Passing the token to `client.run(token)` still works; prefer `originchats.new(url, {token})`.

Message ids, thread ids and user ids that may be missing are now `string?` instead of `""`, and
times are unix milliseconds.
