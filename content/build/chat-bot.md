---
layout: project
description: Build a dice and trivia bot for originChats: command handling you can test as plain functions, embeds and polls, then wire it to a server.
uses: originchats, random, result
time: 20 minutes
---

# Build a chat bot

You'll build a bot for an [originChats](https://chats.mistium.com) server that rolls dice (`!roll 2d6`), asks trivia (`!trivia`, `!answer paris`), keeps a scoreboard and posts embeds and polls.

Connecting needs a server and a token, so only the last step does. Until then the bot is one function, `handle(user, text)`, that takes a chat line and returns a reply. That's what the try-it tabs call, so you can watch whole conversations here.

## Roll a die

`std:random` gives `random.int(low, high)`, both ends included. `random.seed(n)` makes the sequence repeat, which is why this page always shows the same rolls. A real bot doesn't seed.

```osl
import "std:random"

random.seed(42)
log "you rolled a " ++ random.int(1, 6)
log "you rolled a " ++ random.int(1, 6)
```

```output
you rolled a 4
you rolled a 4
```

**Try changing** the seed, or the sides.

:::exercise title="Write roll"
Make `roll` return a random number from 1 to 6.

```osl
import "std:random"

random.seed(1)
def roll() int (
  return 1
)
log roll() <= 6 and roll() >= 1
```

```output
true
```

> [!hint]
> `random.int(1, 6)`.

```osl solution
import "std:random"

random.seed(1)
def roll() int (
  return random.int(1, 6)
)
log roll() <= 6 and roll() >= 1
```
:::


## Roll dice like `2d6`

People type `2d6` for two six-sided dice. `parseDice` splits it on `d`, and returns a `result`: a good roll, or an error whose message you can show. `rollText` handles both, so a mistake becomes a polite reply. See [errors](../learn/errors.md).

```osl
import "std:random"
import "std:result"

struct Dice (
  int count
  int sides
)

def parseDice(string text) result<Dice, error> (
  string[] parts = text.trim().toLower().split("d")
  if parts.len != 2 return result.err(error("use the form 2d6"))
  int count = 1
  if parts[1] != "" (
    count = parts[1].tryAs<int> catch return result.err(error("not a number: " ++ parts[1]))
  )
  int sides = parts[2].tryAs<int> catch return result.err(error("not a number: " ++ parts[2]))
  if count < 1 or count > 20 return result.err(error("roll between 1 and 20 dice"))
  if sides < 2 or sides > 1000 return result.err(error("dice have between 2 and 1000 sides"))
  return result.ok(Dice(count, sides))
)

def rollText(string spec) string (
  Dice d = parseDice(spec) catch (e) (
    return "Sorry, " ++ e.message
  )
  int[] rolls = []
  for _ in 1 to d.count (
    rolls.append(random.int(1, d.sides))
  )
  return spec.trim() ++ ": " ++ rolls.join(" + ") ++ " = " ++ rolls.sum()
)

// try it
random.seed(42)
log rollText("2d6")
log rollText("d20")
log rollText("banana")
log rollText("99d6")
```

```output
2d6: 4 + 4 = 8
d20: 1 = 1
Sorry, use the form 2d6
Sorry, roll between 1 and 20 dice
```

:::exercise title="A coin"
Make `coin` return `heads` or `tails` at random.

```osl
import "std:random"

def coin() string (
  return "heads"
)

random.seed(2)
log coin()
```

```output
heads
```

> [!hint]
> `random.bool()` is true or false.

```osl solution
import "std:random"

def coin() string (
  return if random.bool() then "heads" else "tails"
)

random.seed(2)
log coin()
```
:::


## Answer chat lines

`handle(user, text)` splits a line into words and `switch`es on the first one. Everything after it is `rest`. A line that isn't a command returns `""`, and the bot stays quiet. The try-it tab replays a little conversation.

```osl
import "std:random"
import "std:result"

struct Dice (
  int count
  int sides
)

def parseDice(string text) result<Dice, error> (
  string[] parts = text.trim().toLower().split("d")
  if parts.len != 2 return result.err(error("use the form 2d6"))
  int count = 1
  if parts[1] != "" (
    count = parts[1].tryAs<int> catch return result.err(error("not a number: " ++ parts[1]))
  )
  int sides = parts[2].tryAs<int> catch return result.err(error("not a number: " ++ parts[2]))
  if count < 1 or count > 20 return result.err(error("roll between 1 and 20 dice"))
  if sides < 2 or sides > 1000 return result.err(error("dice have between 2 and 1000 sides"))
  return result.ok(Dice(count, sides))
)

def rollText(string spec) string (
  Dice d = parseDice(spec) catch (e) (
    return "Sorry, " ++ e.message
  )
  int[] rolls = []
  for _ in 1 to d.count (
    rolls.append(random.int(1, d.sides))
  )
  return spec.trim() ++ ": " ++ rolls.join(" + ") ++ " = " ++ rolls.sum()
)

def helpText() string (
  return "!roll 2d6, !trivia, !answer <text>, !scores, !help"
)

def handle(string user, string text) string (
  string[] words = text.trim().split(" ")
  string rest = words.trim(2, words.len).join(" ")
  switch words[1] (
    case "!roll"
      return rollText(if rest == "" then "1d6" else rest)
    case "!help"
      return helpText()
    default
      return ""
  )
)

// try it
random.seed(7)
for line in ["!roll 3d6", "!roll", "hello there", "!help"] (
  log "ann: " ++ line
  string reply = handle("ann", line)
  if reply != "" (
    log "bot: " ++ reply
  )
)
```

```output
ann: !roll 3d6
bot: 3d6: 2 + 1 + 1 = 4
ann: !roll
bot: 1d6: 4 = 4
ann: hello there
ann: !help
bot: !roll 2d6, !trivia, !answer <text>, !scores, !help
```

:::quiz
Why is the bot's logic in `handle` and not inside the connection code?

- [ ] Handlers can't contain logic.
- [x] A plain function can be tested without a server, and the slash command can reuse it.
- [ ] It's required by originChats.

The connection code only moves text in and out. Everything the bot decides is testable here.
:::

:::exercise title="Shout"
Make `shout` return the text in capitals with an `!` at the end.

```osl
def shout(string text) string (
  return text
)

log shout("hello bot")
```

```output
HELLO BOT!
```

> [!hint]
> `text.toUpper()`.

```osl solution
def shout(string text) string (
  return text.toUpper() ++ "!"
)

log shout("hello bot")
```
:::


## Embeds and polls

`originchats.newEmbed({...})` starts a rich message and `addField` and `withFooter` chain onto it. `originchats.newPoll(question, choices)` makes a poll. `build()` returns what the server receives, so you can check it without a connection.

```osl
import "std:random"
import "std:result"
import "std:originchats"

struct Dice (
  int count
  int sides
)

def parseDice(string text) result<Dice, error> (
  string[] parts = text.trim().toLower().split("d")
  if parts.len != 2 return result.err(error("use the form 2d6"))
  int count = 1
  if parts[1] != "" (
    count = parts[1].tryAs<int> catch return result.err(error("not a number: " ++ parts[1]))
  )
  int sides = parts[2].tryAs<int> catch return result.err(error("not a number: " ++ parts[2]))
  if count < 1 or count > 20 return result.err(error("roll between 1 and 20 dice"))
  if sides < 2 or sides > 1000 return result.err(error("dice have between 2 and 1000 sides"))
  return result.ok(Dice(count, sides))
)

def rollText(string spec) string (
  Dice d = parseDice(spec) catch (e) (
    return "Sorry, " ++ e.message
  )
  int[] rolls = []
  for _ in 1 to d.count (
    rolls.append(random.int(1, d.sides))
  )
  return spec.trim() ++ ": " ++ rolls.join(" + ") ++ " = " ++ rolls.sum()
)

def helpText() string (
  return "!roll 2d6, !trivia, !answer <text>, !scores, !help"
)

def helpCard() *originchats.Embed (
  return originchats.newEmbed({title: "Dice bot", description: helpText(), color: "#5865f2"})
    .addField("!roll 2d6", "roll some dice")
    .addField("!trivia", "ask a question")
    .withFooter("dicebot")
)

def handle(string user, string text) string (
  string[] words = text.trim().split(" ")
  string rest = words.trim(2, words.len).join(" ")
  switch words[1] (
    case "!roll"
      return rollText(if rest == "" then "1d6" else rest)
    case "!help"
      return helpText()
    default
      return ""
  )
)

// try it
log helpCard().build()
log originchats.newPoll("Pizza tonight?", ["yes", "no"]).build()
```

```output
{"color":5793266,"description":"!roll 2d6, !trivia, !answer <text>, !scores, !help","fields":[{"name":"!roll 2d6","value":"roll some dice"},{"name":"!trivia","value":"ask a question"}],"footer":{"text":"dicebot"},"title":"Dice bot","type":"rich"}
{"poll":{"options":[{"text":"yes"},{"text":"no"}],"question":"Pizza tonight?"},"type":"poll"}
```

**Try changing** the card's title or colour.

:::exercise title="A three-way poll"
Make `lunchPoll` ask `Lunch?` with the choices `pizza`, `ramen` and `salad`.

```osl
import "std:originchats"

def lunchPoll() *originchats.Embed (
  return originchats.newPoll("Lunch?", ["pizza", "ramen"])
)

log lunchPoll().build()
```

```output
{"poll":{"options":[{"text":"pizza"},{"text":"ramen"},{"text":"salad"}],"question":"Lunch?"},"type":"poll"}
```

> [!hint]
> The choices are an array of strings.

```osl solution
import "std:originchats"

def lunchPoll() *originchats.Embed (
  return originchats.newPoll("Lunch?", ["pizza", "ramen", "salad"])
)

log lunchPoll().build()
```
:::

## Trivia and scores

Questions are structs. `!trivia` picks one at random and remembers it, `!answer` checks the guess (`==` ignores case), and a map keeps each user's points. Sorting the names keeps the scoreboard in a fixed order. Run the try-it tab to read a whole game.

```osl
import "std:random"
import "std:result"
import "std:originchats"

struct Dice (
  int count
  int sides
)

def parseDice(string text) result<Dice, error> (
  string[] parts = text.trim().toLower().split("d")
  if parts.len != 2 return result.err(error("use the form 2d6"))
  int count = 1
  if parts[1] != "" (
    count = parts[1].tryAs<int> catch return result.err(error("not a number: " ++ parts[1]))
  )
  int sides = parts[2].tryAs<int> catch return result.err(error("not a number: " ++ parts[2]))
  if count < 1 or count > 20 return result.err(error("roll between 1 and 20 dice"))
  if sides < 2 or sides > 1000 return result.err(error("dice have between 2 and 1000 sides"))
  return result.ok(Dice(count, sides))
)

def rollText(string spec) string (
  Dice d = parseDice(spec) catch (e) (
    return "Sorry, " ++ e.message
  )
  int[] rolls = []
  for _ in 1 to d.count (
    rolls.append(random.int(1, d.sides))
  )
  return spec.trim() ++ ": " ++ rolls.join(" + ") ++ " = " ++ rolls.sum()
)

def helpText() string (
  return "!roll 2d6, !trivia, !answer <text>, !scores, !help"
)

def helpCard() *originchats.Embed (
  return originchats.newEmbed({title: "Dice bot", description: helpText(), color: "#5865f2"})
    .addField("!roll 2d6", "roll some dice")
    .addField("!trivia", "ask a question")
    .withFooter("dicebot")
)

struct Question (
  string text
  string answer
)

Question[] questions = [
  Question("What is the capital of France?", "paris"),
  Question("How many sides has a hexagon?", "6"),
  Question("Which planet is the Red Planet?", "mars"),
]

Question? current = null
string[int] scores = {}

def ask() string (
  Question q = random.item(questions)
  current = q
  return "Trivia: " ++ q.text
)

def answer(string user, string guess) string (
  if current == null return "No question yet. Try !trivia"
  Question q = current
  if guess.trim() == q.answer (
    current = null
    scores[user] = scores.get(user, 0) + 1
    return user ++ " got it! That's " ++ scores[user] ++ " point(s)."
  )
  return "Not " ++ guess.trim() ++ ". Try again!"
)

def scoreboard() string (
  if scores.len == 0 return "No scores yet."
  string[] lines = []
  for name in scores.getKeys().sort() (
    lines.append(name ++ ": " ++ scores[name])
  )
  return lines.join(", ")
)

def handle(string user, string text) string (
  string[] words = text.trim().split(" ")
  string rest = words.trim(2, words.len).join(" ")
  switch words[1] (
    case "!roll"
      return rollText(if rest == "" then "1d6" else rest)
    case "!trivia"
      return ask()
    case "!answer"
      return answer(user, rest)
    case "!scores"
      return scoreboard()
    case "!help"
      return helpText()
    default
      return ""
  )
)

// try it
random.seed(3)
string[] chat = [
  "ann|!trivia", "bo|!answer lyon", "ann|!answer 6", "bo|!roll 2d6",
  "ann|!answer again", "bo|!trivia", "bo|!answer Paris", "ann|!scores"
]
for line in chat (
  string[] pair = line.split("|")
  log pair[1] ++ ": " ++ pair[2]
  log "bot: " ++ handle(pair[1], pair[2])
)
```

```output
ann: !trivia
bot: Trivia: How many sides has a hexagon?
bo: !answer lyon
bot: Not lyon. Try again!
ann: !answer 6
bot: ann got it! That's 1 point(s).
bo: !roll 2d6
bot: 2d6: 1 + 6 = 7
ann: !answer again
bot: No question yet. Try !trivia
bo: !trivia
bot: Trivia: What is the capital of France?
bo: !answer Paris
bot: bo got it! That's 1 point(s).
ann: !scores
bot: ann: 1, bo: 1
```

:::exercise title="Singular"
Say `1 point` for one and `3 points` otherwise.

```osl
def pluralPoints(int n) string (
  return n ++ " point(s)"
)

log pluralPoints(1)
log pluralPoints(3)
```

```output
1 point
3 points
```

> [!hint]
> `if n == 1 then ... else ...`.

```osl solution
def pluralPoints(int n) string (
  return if n == 1 then "1 point" else n ++ " points"
)

log pluralPoints(1)
log pluralPoints(3)
```
:::

:::quiz
`!answer` is typed with no question asked. What does the bot do?

- [ ] Crashes.
- [x] Replies that there is no question yet.
- [ ] Asks a new question.

`current` is null until `!trivia` sets it, and `answer` checks for that first.
:::

## Connect it

`originchats.new(url, {token})` makes a client, and nothing happens until `client.run()`. `client.command(prefix, fn)` calls `fn` with a message when a line starts with the prefix. `msg.content()` is what comes after the prefix, and `msg.reply(text)` answers. Every handler just calls `handle`, and `/roll` is a slash command shown in the chat's command picker. The token comes from the environment: don't put it in the source.

```osl norun
import "std:random"
import "std:result"
import "std:originchats"
import "std:env"

struct Dice (
  int count
  int sides
)

def parseDice(string text) result<Dice, error> (
  string[] parts = text.trim().toLower().split("d")
  if parts.len != 2 return result.err(error("use the form 2d6"))
  int count = 1
  if parts[1] != "" (
    count = parts[1].tryAs<int> catch return result.err(error("not a number: " ++ parts[1]))
  )
  int sides = parts[2].tryAs<int> catch return result.err(error("not a number: " ++ parts[2]))
  if count < 1 or count > 20 return result.err(error("roll between 1 and 20 dice"))
  if sides < 2 or sides > 1000 return result.err(error("dice have between 2 and 1000 sides"))
  return result.ok(Dice(count, sides))
)

def rollText(string spec) string (
  Dice d = parseDice(spec) catch (e) (
    return "Sorry, " ++ e.message
  )
  int[] rolls = []
  for _ in 1 to d.count (
    rolls.append(random.int(1, d.sides))
  )
  return spec.trim() ++ ": " ++ rolls.join(" + ") ++ " = " ++ rolls.sum()
)

def helpText() string (
  return "!roll 2d6, !trivia, !answer <text>, !scores, !help"
)

def helpCard() *originchats.Embed (
  return originchats.newEmbed({title: "Dice bot", description: helpText(), color: "#5865f2"})
    .addField("!roll 2d6", "roll some dice")
    .addField("!trivia", "ask a question")
    .withFooter("dicebot")
)

struct Question (
  string text
  string answer
)

Question[] questions = [
  Question("What is the capital of France?", "paris"),
  Question("How many sides has a hexagon?", "6"),
  Question("Which planet is the Red Planet?", "mars"),
]

Question? current = null
string[int] scores = {}

def ask() string (
  Question q = random.item(questions)
  current = q
  return "Trivia: " ++ q.text
)

def answer(string user, string guess) string (
  if current == null return "No question yet. Try !trivia"
  Question q = current
  if guess.trim() == q.answer (
    current = null
    scores[user] = scores.get(user, 0) + 1
    return user ++ " got it! That's " ++ scores[user] ++ " point(s)."
  )
  return "Not " ++ guess.trim() ++ ". Try again!"
)

def scoreboard() string (
  if scores.len == 0 return "No scores yet."
  string[] lines = []
  for name in scores.getKeys().sort() (
    lines.append(name ++ ": " ++ scores[name])
  )
  return lines.join(", ")
)

def handle(string user, string text) string (
  string[] words = text.trim().split(" ")
  string rest = words.trim(2, words.len).join(" ")
  switch words[1] (
    case "!roll"
      return rollText(if rest == "" then "1d6" else rest)
    case "!trivia"
      return ask()
    case "!answer"
      return answer(user, rest)
    case "!scores"
      return scoreboard()
    case "!help"
      return helpText()
    default
      return ""
  )
)

string token = env.get("ROTUR_TOKEN")
*originchats.Client client = originchats.new("wss://chats.mistium.com", {token: token})

client.on("ready", def(*originchats.Client c) (
  log "ready as " ++ (c.username() ?? "?")
))

client.command("!help", def(*originchats.Message msg) (
  msg.reply("", {embeds: [helpCard()]}).unwrap()
))

client.command("!roll", def(*originchats.Message msg) (
  msg.reply(handle(msg.user(), "!roll " ++ msg.content())).unwrap()
))

client.command("!trivia", def(*originchats.Message msg) (
  msg.reply(handle(msg.user(), "!trivia")).unwrap()
))

client.command("!answer", def(*originchats.Message msg) (
  msg.reply(handle(msg.user(), "!answer " ++ msg.content())).unwrap()
))

client.command("!scores", def(*originchats.Message msg) (
  msg.reply(handle(msg.user(), "!scores")).unwrap()
))

client.command("!poll", def(*originchats.Message msg) (
  msg.target().send("", {embeds: [originchats.newPoll(msg.content(), ["yes", "no"])]}).unwrap()
))

client.slashCommand("/roll")
  .description("roll some dice")
  .addString("dice", {description: "for example 2d6", required: false})
  .fn(def(*originchats.Slash call) (
    call.respond(handle(call.user(), "!roll " ++ call.argStr("dice"))).unwrap()
  ))

client.run().unwrap()
```

Run it with `ROTUR_TOKEN=... osl run bot.osl`. Next: [originchats](../packages/originchats.md), or a [web API](web-api.md).
