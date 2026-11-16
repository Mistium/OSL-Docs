---
layout: project
description: Build a chat room with `std:serve` and `std:ws`: WebSocket handlers, nicknames kept on each connection, JSON messages, broadcast and a browser page.
uses: serve, ws, json, thread
time: 25 minutes
---

# Build a realtime chat

You'll build a chat room: people connect, pick a nickname, and see everyone's messages as they happen. It uses a WebSocket server mounted on a `std:serve` router, and ends with a web page.

`std:ws` also has a client, so every step runs here: the try-it tab starts the server, connects clients and prints what they receive.

## Decide what messages look like

Both sides speak JSON with a `type`. Clients send `say` and `nick`; the server sends `chat`, `system` and `error`. One struct covers them all. `describe` decodes a message with `json.parse<Message>` and turns it into a line of text, and a broken one becomes a `?` line.

```osl
import "std:json"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

log describe(`{"type": "system", "text": "ann joined"}`)
log describe(`{"type": "chat", "name": "ann", "text": "hello!"}`)
log describe(`{"type": "error", "text": "unknown command"}`)
```

```output
* ann joined
ann: hello!
! unknown command
```

**Try changing** a message's type or text.

:::exercise title="Actions"
Make `describe` show an `action` message as `* ann waves`.

```osl
import "std:json"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)


def describe(string raw) string (
  Message m = json.parse<Message>(raw).unwrap()
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    default
      return "? " ++ m.text
  )
)

log describe(`{"type": "chat", "name": "ann", "text": "hello!"}`)
log describe(`{"type": "action", "name": "ann", "text": "waves"}`)
```

```output
ann: hello!
* ann waves
```

> [!hint]
> Add a `case "action"` that joins the name and text with `++`.

```osl solution
import "std:json"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)


def describe(string raw) string (
  Message m = json.parse<Message>(raw).unwrap()
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "action"
      return "* " ++ m.name ++ " " ++ m.text
    default
      return "? " ++ m.text
  )
)

log describe(`{"type": "chat", "name": "ann", "text": "hello!"}`)
log describe(`{"type": "action", "name": "ann", "text": "waves"}`)
```
:::


## Accept connections

`ws.new()` makes a WebSocket server and `app.ws("/chat", room)` mounts it on the router. `room.on("connect", fn)` runs for each new client. `conn.set(key, value)` keeps a value on that connection, which is where the nickname goes, and `conn.send(object)` sends JSON to that one client.

The try-it tab joins two clients. Each handler runs on its connection's own thread, so the test client drops what it receives into a channel and the main program waits for it with `recv()`. That keeps the output in a fixed order.

```osl
import "std:serve"
import "std:ws"
import "std:json"
import "std:thread"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

*serve.Router app = serve.new()
*ws.Server room = ws.new()
int guests = 0

room.on("connect", def(*ws.Connection conn) (
  guests += 1
  conn.set("name", "guest" ++ guests)
  conn.send({type: "system", text: "welcome, you are " ++ conn.get("name")}).unwrap()
))

app.ws("/chat", room)

// try it
struct Client (
  *ws.Connection conn
  *thread.Channel inbox
)

def join(string url) Client (
  auto inbox = thread.channel(16)
  *ws.Connection conn = ws.connect(url).unwrap()
  conn.on("message", def(*ws.Connection c, string message) (
    inbox.send(message).unwrap()
  ))
  return Client(conn, inbox)
)

def next(Client c) string (
  string raw = c.inbox.recv()
  return describe(raw)
)

app.start("127.0.0.1:8740").unwrap()
string url = "ws://127.0.0.1:8740/chat"

Client ann = join(url)
log next(ann)
Client bo = join(url)
log next(bo)
log room.connections().len

app.stop().unwrap()
```

```output
* welcome, you are guest1
* welcome, you are guest2
2
```

## Broadcast

`room.on("message", fn)` runs when any client sends something. A `say` message is decoded and sent to everyone with `room.broadcast`, the sender included, so everyone sees the same stream. Anything that isn't JSON gets an `error` back, to that client only.

```osl
import "std:serve"
import "std:ws"
import "std:json"
import "std:thread"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

*serve.Router app = serve.new()
*ws.Server room = ws.new()
int guests = 0

room.on("connect", def(*ws.Connection conn) (
  guests += 1
  conn.set("name", "guest" ++ guests)
  conn.send({type: "system", text: "welcome, you are " ++ conn.get("name")}).unwrap()
))

room.on("message", def(*ws.Connection conn, string message) (
  Message m = json.parse<Message>(message) catch (e) (
    conn.send({type: "error", text: "send JSON"}).unwrap()
    return
  )
  string name = conn.get("name")
  switch m.type (
    case "say"
      room.broadcast({type: "chat", name: name, text: m.text})
    default
      conn.send({type: "error", text: "unknown type " ++ m.type}).unwrap()
  )
))

app.ws("/chat", room)

// try it
struct Client (
  *ws.Connection conn
  *thread.Channel inbox
)

def join(string url) Client (
  auto inbox = thread.channel(16)
  *ws.Connection conn = ws.connect(url).unwrap()
  conn.on("message", def(*ws.Connection c, string message) (
    inbox.send(message).unwrap()
  ))
  return Client(conn, inbox)
)

def next(Client c) string (
  string raw = c.inbox.recv()
  return describe(raw)
)

app.start("127.0.0.1:8741").unwrap()
string url = "ws://127.0.0.1:8741/chat"

Client ann = join(url)
log next(ann)
Client bo = join(url)
log next(bo)

ann.conn.send({type: "say", text: "hi bo"}).unwrap()
log next(ann)
log next(bo)
ann.conn.send("nonsense").unwrap()
log next(ann)

app.stop().unwrap()
```

```output
* welcome, you are guest1
* welcome, you are guest2
guest1: hi bo
guest1: hi bo
! send JSON
```

:::quiz
What is the difference between `conn.send(x)` and `room.broadcast(x)`?

- [ ] `send` is for JSON and `broadcast` for text.
- [x] `send` goes to one client, `broadcast` to every connected client.
- [ ] They are the same.

`conn.send` writes to a single connection. `room.broadcast` writes to all of them.
:::

:::exercise title="Mind your language"
Make `clean` replace `darn` with `****`. In the server you would clean `m.text` before broadcasting.

```osl
def clean(string text) string (
  return text
)

log clean("well darn it")
log clean("DARN!")
```

```output
well **** it
DARN!
```

> [!hint]
> `text.replace("darn", "****")`. The second line stays `DARN!`: replace is case-sensitive.

```osl solution
def clean(string text) string (
  return text.replace("darn", "****")
)

log clean("well darn it")
log clean("DARN!")
```
:::


## Nicknames

A `nick` message changes the name stored on the connection and tells the room. The `case "nick"` lines are new; the name is read back with `conn.get("name")` on every message, so a chat line carries the latest nickname.

```osl
import "std:serve"
import "std:ws"
import "std:json"
import "std:thread"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

*serve.Router app = serve.new()
*ws.Server room = ws.new()
int guests = 0

room.on("connect", def(*ws.Connection conn) (
  guests += 1
  conn.set("name", "guest" ++ guests)
  conn.send({type: "system", text: "welcome, you are " ++ conn.get("name")}).unwrap()
))

room.on("message", def(*ws.Connection conn, string message) (
  Message m = json.parse<Message>(message) catch (e) (
    conn.send({type: "error", text: "send JSON"}).unwrap()
    return
  )
  string name = conn.get("name")
  switch m.type (
    case "say"
      room.broadcast({type: "chat", name: name, text: m.text})
    case "nick"
      conn.set("name", m.name)
      room.broadcast({type: "system", text: name ++ " is now " ++ m.name})
    default
      conn.send({type: "error", text: "unknown type " ++ m.type}).unwrap()
  )
))

app.ws("/chat", room)

// try it
struct Client (
  *ws.Connection conn
  *thread.Channel inbox
)

def join(string url) Client (
  auto inbox = thread.channel(16)
  *ws.Connection conn = ws.connect(url).unwrap()
  conn.on("message", def(*ws.Connection c, string message) (
    inbox.send(message).unwrap()
  ))
  return Client(conn, inbox)
)

def next(Client c) string (
  string raw = c.inbox.recv()
  return describe(raw)
)

app.start("127.0.0.1:8742").unwrap()
string url = "ws://127.0.0.1:8742/chat"

Client ann = join(url)
log next(ann)
Client bo = join(url)
log next(bo)

ann.conn.send({type: "nick", name: "ann"}).unwrap()
log next(ann)
log next(bo)
bo.conn.send({type: "say", text: "hi ann"}).unwrap()
log next(ann)
log next(bo)

app.stop().unwrap()
```

```output
* welcome, you are guest1
* welcome, you are guest2
* guest1 is now ann
* guest1 is now ann
guest2: hi ann
guest2: hi ann
```

:::quiz
`bo` joined as `guest2` and never sent a `nick`. What name does the room see on `bo`'s chat lines?

- [ ] None: the name is empty until a `nick` arrives.
- [x] `guest2`, because `connect` stored it on the connection.
- [ ] `bo`, because the client's variable is called `bo`.

`conn.set("name", ...)` ran when the socket opened, and each chat line reads the name back from the connection that sent it.
:::

:::exercise title="A valid nickname"
Return true only for names of 1 to 12 characters with no spaces.

```osl
def validNick(string name) boolean (
  return true
)

log validNick("ann")
log validNick("")
log validNick("a very long nickname indeed")
log validNick("two words")
```

```output
true
false
false
false
```

> [!hint]
> Combine three checks with `and`.

```osl solution
def validNick(string name) boolean (
  return name.len >= 1 and name.len <= 12 and !name.contains(" ")
)

log validNick("ann")
log validNick("")
log validNick("a very long nickname indeed")
log validNick("two words")
```
:::


## Announce who left

`"disconnect"` fires when a connection closes from either side. Closing with `wait: true` returns once the socket is closed, so the server has seen it by the time `ann` reads the news.

```osl
import "std:serve"
import "std:ws"
import "std:json"
import "std:thread"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

*serve.Router app = serve.new()
*ws.Server room = ws.new()
int guests = 0

room.on("connect", def(*ws.Connection conn) (
  guests += 1
  conn.set("name", "guest" ++ guests)
  conn.send({type: "system", text: "welcome, you are " ++ conn.get("name")}).unwrap()
))

room.on("message", def(*ws.Connection conn, string message) (
  Message m = json.parse<Message>(message) catch (e) (
    conn.send({type: "error", text: "send JSON"}).unwrap()
    return
  )
  string name = conn.get("name")
  switch m.type (
    case "say"
      room.broadcast({type: "chat", name: name, text: m.text})
    case "nick"
      conn.set("name", m.name)
      room.broadcast({type: "system", text: name ++ " is now " ++ m.name})
    default
      conn.send({type: "error", text: "unknown type " ++ m.type}).unwrap()
  )
))

room.on("disconnect", def(*ws.Connection conn) (
  string name = conn.get("name")
  room.broadcast({type: "system", text: name ++ " left"})
))

app.ws("/chat", room)

// try it
struct Client (
  *ws.Connection conn
  *thread.Channel inbox
)

def join(string url) Client (
  auto inbox = thread.channel(16)
  *ws.Connection conn = ws.connect(url).unwrap()
  conn.on("message", def(*ws.Connection c, string message) (
    inbox.send(message).unwrap()
  ))
  return Client(conn, inbox)
)

def next(Client c) string (
  string raw = c.inbox.recv()
  return describe(raw)
)

app.start("127.0.0.1:8743").unwrap()
string url = "ws://127.0.0.1:8743/chat"

Client ann = join(url)
log next(ann)
Client bo = join(url)
log next(bo)

bo.conn.close({wait: true})
log next(ann)

app.stop().unwrap()
```

```output
* welcome, you are guest1
* welcome, you are guest2
* guest2 left
```

**Try changing** the try-it tab: have `bo` say something first.

:::exercise title="Say who's left"
Make `leftText` say how many people remain: `bo left, 1 here`, or `ann left, the room is empty` when nobody's left.

```osl
def leftText(string name, int remaining) string (
  return name ++ " left"
)

log leftText("bo", 1)
log leftText("ann", 0)
```

```output
bo left, 1 here
ann left, the room is empty
```

> [!hint]
> Return early when `remaining` is 0.

```osl solution
def leftText(string name, int remaining) string (
  if remaining == 0 return name ++ " left, the room is empty"
  return name ++ " left, " ++ remaining ++ " here"
)

log leftText("bo", 1)
log leftText("ann", 0)
```
:::

## Serve a page

The same router serves the browser client at `/`. It opens a socket to `/chat`, shows what arrives and sends what you type as the JSON from step 1. Typing `/nick ann` sends a `nick` message. The try-it tab fetches the page and checks the client is in it.

```osl
import "std:serve"
import "std:ws"
import "std:json"
import "std:thread"
import "std:requests"

struct Message (
  string type = ""
  string name = ""
  string text = ""
)

def describe(string raw) string (
  Message m = json.parse<Message>(raw) catch (e) (
    return "? " ++ raw
  )
  switch m.type (
    case "chat"
      return m.name ++ ": " ++ m.text
    case "system"
      return "* " ++ m.text
    default
      return "! " ++ m.text
  )
)

*serve.Router app = serve.new()
*ws.Server room = ws.new()
int guests = 0

string page = `<!doctype html>
<meta charset="utf-8">
<title>Chat</title>
<div id="log"></div>
<form id="form">
  <input id="text" autocomplete="off" placeholder="Say something, or /nick name">
  <button>Send</button>
</form>
<script>
  var log = document.getElementById("log");
  var scheme = location.protocol === "https:" ? "wss://" : "ws://";
  var socket = new WebSocket(scheme + location.host + "/chat");
  function add(text) {
    var line = document.createElement("div");
    line.textContent = text;
    log.appendChild(line);
  }
  socket.onmessage = function (event) {
    var m = JSON.parse(event.data);
    add(m.type === "chat" ? m.name + ": " + m.text : "* " + m.text);
  };
  document.getElementById("form").onsubmit = function (event) {
    event.preventDefault();
    var box = document.getElementById("text");
    var text = box.value.trim();
    if (text.startsWith("/nick ")) {
      socket.send(JSON.stringify({type: "nick", name: text.slice(6)}));
    } else if (text) {
      socket.send(JSON.stringify({type: "say", text: text}));
    }
    box.value = "";
  };
</script>
`

app.get("/", def(*serve.Context c) (
  c.html(200, page)
))

room.on("connect", def(*ws.Connection conn) (
  guests += 1
  conn.set("name", "guest" ++ guests)
  conn.send({type: "system", text: "welcome, you are " ++ conn.get("name")}).unwrap()
))

room.on("message", def(*ws.Connection conn, string message) (
  Message m = json.parse<Message>(message) catch (e) (
    conn.send({type: "error", text: "send JSON"}).unwrap()
    return
  )
  string name = conn.get("name")
  switch m.type (
    case "say"
      room.broadcast({type: "chat", name: name, text: m.text})
    case "nick"
      conn.set("name", m.name)
      room.broadcast({type: "system", text: name ++ " is now " ++ m.name})
    default
      conn.send({type: "error", text: "unknown type " ++ m.type}).unwrap()
  )
))

room.on("disconnect", def(*ws.Connection conn) (
  string name = conn.get("name")
  room.broadcast({type: "system", text: name ++ " left"})
))

app.ws("/chat", room)

// try it
struct Client (
  *ws.Connection conn
  *thread.Channel inbox
)

def join(string url) Client (
  auto inbox = thread.channel(16)
  *ws.Connection conn = ws.connect(url).unwrap()
  conn.on("message", def(*ws.Connection c, string message) (
    inbox.send(message).unwrap()
  ))
  return Client(conn, inbox)
)

def next(Client c) string (
  string raw = c.inbox.recv()
  return describe(raw)
)

app.start("127.0.0.1:8744").unwrap()
string url = "ws://127.0.0.1:8744/chat"

auto r = requests.get("http://127.0.0.1:8744/").unwrap()
string body = r.body
log r.status body.contains("new WebSocket")

Client ann = join(url)
log next(ann)

app.stop().unwrap()
```

```output
200 true
* welcome, you are guest1
```

> [!note]
> The shared `guests` counter is touched from several connection threads. A busy server should guard it with a lock from `std:sync`.

## Run it for real

The try-it tab starts and stops the server itself. For the real thing, save the program above without the try-it part and end it with `app.run`, which serves until the program stops:

```osl fragment
log "chat running at http://localhost:8080"
app.run(":8080").unwrap()
```

Run it with `osl run chat.osl`, open `http://localhost:8080` in two tabs and type `/nick ann` in one. Next: [ws](../packages/ws.md), [serve](../packages/serve.md), or a [desktop app](desktop-app.md).
