---
description: Write bots for originChats servers: answer commands and slash commands, react to events, post embeds and polls, and manage channels.
package: originchats
---

# originchats

`std:originchats` is a bot framework for originChats servers. It handles the connection, the login, reconnecting and matching replies to requests, so a bot is a list of handlers. You react to messages and slash commands, and reply with text, embeds and polls.

A bot talks to a live server, so those examples compile but don't run here. Embeds and polls are plain data you can build and look at, so they run in the page.

## The smallest bot

`originchats.new(url, options)` makes a client. `command(prefix, handler)` answers messages that start with a word, and `run` connects and blocks:

```osl norun
import "std:originchats"

*originchats.Client client = originchats.new("wss://chats.example.com", {token: "your rotur token"})

client.command("!ping", def(*originchats.Message msg) (
  msg.reply("pong, " ++ msg.user()).unwrap()
))

client.run("your rotur token").unwrap()
```

Send `!ping` in a channel the bot can see and it answers. The handler receives a `Message`. `msg.user()` is who wrote it, `msg.content()` is the text with the prefix removed, and `msg.args()` splits it into words.

## Reading what was said

A command's text arrives without the prefix, so a command is a function of its arguments:

```osl norun
import "std:originchats"

*originchats.Client client = originchats.new("wss://chats.example.com", {token: "your rotur token"})

client.command("!add", def(*originchats.Message msg) (
  string[] parts = msg.args()
  if parts.len != 2 (
    msg.reply("usage: !add 1 2").unwrap()
    return
  )
  number total = parts[1].as<number> + parts[2].as<number>
  msg.reply("= " ++ total).unwrap()
))

client.run("your rotur token").unwrap()
```

Messages have more to look at: `isReply()`, `mentionsMe()`, `attachments()`, `embeds()` and `reactions()`. They can be acted on, too: `react("👍")`, `edit(text)`, `pin()` and `delete()`.

## Events

`client.on(event, handler)` handles anything the server sends. `"ready"` runs after every connect, `"message"` for each new message no command took (the bot's own are skipped), and a server event name such as `"reaction_add"` or `"user_join"` gets the raw packet. Handlers run on their own threads, and a throw is printed instead of stopping the bot:

```osl norun
import "std:originchats"

*originchats.Client client = originchats.new("wss://chats.example.com", {token: "your rotur token"})

client.on("ready", def(any c, any packet) ( log "connected as " ++ client.username() ))

client.on("message", def(*originchats.Message msg) (
  if msg.mentionsMe() (
    msg.react("👀").unwrap()
  )
))

client.run("your rotur token").unwrap()
```

:::quiz
You register `client.command("!ping", ...)` and `client.on("message", ...)`. A user sends `!ping`. Which handlers run?

- [ ] Both.
- [x] Only the command.
- [ ] Only the `"message"` handler.

The first matching command wins, and the message event doesn't fire for a message a command took.
:::

## Slash commands

A slash command has a name, a description and typed inputs, which the server shows in its menu. Build one with `slashCommand(name)`, add inputs, then give it a handler with `fn`:

```osl norun
import "std:originchats"
import "std:random"

*originchats.Client client = originchats.new("wss://chats.example.com", {token: "your rotur token"})

client.slashCommand("roll")
  .description("Roll a die")
  .addInteger("sides", {description: "How many sides", min: 2})
  .fn(def(*originchats.Slash call) (
    int sides = 6
    if call.has("sides") ( sides = call.argNum("sides").as<int> )
    call.respond("You rolled " ++ random.int(1, sides)).unwrap()
  ))

client.run("your rotur token").unwrap()
```

`addString`, `addBoolean`, `addNumber`, `addUser` and `addChoices` make other inputs, `ephemeral(true)` makes the answer visible only to the caller, and `whitelistRoles` limits who may run it. In the handler, `call.argStr`, `call.argNum`, `call.argBool` and `call.arg` read the inputs, and `call.invoker()` says who ran it.

## Channels

`client.channel(name)` is a handle for a channel. Nothing is sent until you use it:

```osl norun
import "std:originchats"

*originchats.Client client = originchats.new("wss://chats.example.com", {token: "your rotur token"})
client.start().unwrap()

auto general = client.channel("general")
general.send("Deploy finished").unwrap()

for item in general.messages(5).unwrap() (
  auto msg = item.<originchats.Message>
  log msg.user() ++ ": " ++ msg.content()
)
client.stop()
```

The list a read returns holds untyped items, so narrow each one with `item.<originchats.Message>`. `start()` connects and waits until the server is ready, which suits a script that does a job and exits. `run()` is for a bot that stays. Channels can also make threads, pin messages, search and manage webhooks.

## Embeds

An embed is a card attached to a message: a title, text, fields, a footer, an image. `originchats.newEmbed(options)` starts one, each method adds to it and returns it, and `build()` gives the data a server receives. That is plain data, so you can look at it:

```osl
import "std:originchats"

auto embed = originchats.newEmbed({
  title: "Build finished",
  description: "All checks passed",
  color: "#22aa55"
})
  .addField("Branch", "main", {inline: true})
  .addField("Time", "42s", {inline: true})
  .withFooter("CI")
  .build()

log embed.title
log embed.fields.len
log embed
```

```output
Build finished
2
{"color":2271829,"description":"All checks passed","fields":[{"inline":true,"name":"Branch","value":"main"},{"inline":true,"name":"Time","value":"42s"}],"footer":{"text":"CI"},"title":"Build finished","type":"rich"}
```

Change the colour or add a field and run it again. To post it, pass it to a send: `channel.send("", {embeds: [embed]})`.

## Polls

`originchats.newPoll(question, choices, options)` builds a poll embed. Choices are strings or `{text, emoji}`, and `multiselect` lets people pick several:

```osl
import "std:originchats"

auto poll = originchats.newPoll(
  "Lunch?",
  ["Pizza", {text: "Sushi", emoji: "🍣"}],
  {multiselect: true}
).build()
log poll
```

```output
{"poll":{"allow_multiselect":true,"options":[{"text":"Pizza"},{"emoji":"🍣","text":"Sushi"}],"question":"Lunch?"},"type":"poll"}
```

After it is posted, `client.vote(pollID, options)`, `client.poll(pollID)` and `client.endPoll(pollID)` work with it.

:::exercise title="A status card"
Build an embed titled `Status` with the description `All good` and one field named `Uptime` with the value `99.9%`. Print its `fields` length.

```osl
import "std:originchats"

auto embed = originchats.newEmbed({title: "Status"}).build()
log embed.title
```

```output
1
```

> [!hint]
> Add `description` to the options, chain `.addField("Uptime", "99.9%")` before `.build()`.

```osl solution
import "std:originchats"

auto embed = originchats.newEmbed({title: "Status", description: "All good"})
  .addField("Uptime", "99.9%")
  .build()
log embed.fields.len
```
:::

## Server management

A bot with the right permissions can manage the server: `createChannel`, `deleteChannel`, `createRole`, `setRoles`, `kickUser`, `banUser`, `muteUser`, `setNickname` and `uploadFile`. Reads such as `users()`, `usersOnline()`, `roles()` and `channels()` return results too. Check `client.supports(command)` before using something an older server may lack.

## API reference

::api
