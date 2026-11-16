---
description: Talk to rotur.dev from OSL: sign in, read the feed, post, manage groups and storage, listen in realtime, and sign and encrypt messages.
package: rotur
---

# rotur

`std:rotur` is a client for the rotur.dev API. Almost everything the website does is a method here: accounts, posts, friends, groups, the economy, key-value storage, signing and encryption, and a realtime socket for presence and rooms.

Calls talk to the network, so most examples on this page compile but don't run in the browser. Run them on your machine. A few helpers that work offline run right here.

## A client

`rotur.new(token)` makes a client. With no token (or `""`) it is anonymous and can call public endpoints:

```osl norun
import "std:rotur"

auto rotur_client = rotur.new()
auto feed = rotur_client.posts().list({limit: 3}).unwrap()
for post in feed (
  log post
)
```

Every API method returns a `result`. The response is the API's own JSON, so keys keep the names rotur.dev uses. Errors have a kind you can match on: `NotFoundError` (404), `PermissionError` (no token, or refused), `ValueError` (a rejected request), `StateError` (conflicts and rate limits), `TimeoutError` and `NetworkError`.

## Signing in

The first time, `client.login()` runs the device flow. It prints a code, you approve it on rotur.dev, and the token is saved where the rotur command line tool keeps it. After that `rotur.load()` finds it again. A program asks only once:

```osl norun
import "std:rotur"

*rotur.Client client = rotur.load().unwrap()
if !client.hasToken() (
  client.login().unwrap()
)
log "signed in as " ++ client.username().unwrap()
```

`ROTUR_TOKEN` in the environment also works, and is checked first. To skip the saved file, build the client with `rotur.new(token)`.

## Check who you are

`client.whoami()` asks the API what the token is allowed to do:

```osl norun
import "std:rotur"

*rotur.Client client = rotur.load().unwrap()
auto me = client.whoami().unwrap()
log me.username me.token_type
```

A call that needs a token without one fails with `PermissionError`, which you can handle:

```osl norun
import "std:rotur"

auto client = rotur.new()
auto attempt = client.posts().create("hello")
if attempt.isErr() (
  log attempt.unwrapErr().kind
)
```

:::quiz
`rotur.new()` with no token calls `client.posts().list()`. What happens?

- [x] It works: the public feed needs no token.
- [ ] It fails with `PermissionError`.
- [ ] It throws and stops the program.

Anonymous clients can call public endpoints. `posts().create` needs a token and would fail with `PermissionError`.
:::

## Posts and people

Each area of the API is a group of methods on the client: `posts()`, `friends()`, `following()`, `groups()`, `profiles()`, `notifications()`, `storage()` and more. They read like the website:

```osl norun
import "std:rotur"

*rotur.Client client = rotur.load().unwrap()

auto post = client.posts().create("Hello from OSL", {profileOnly: true}).unwrap()
client.posts().like(post.id).unwrap()
client.posts().reply(post.id, "A reply").unwrap()

log client.profiles().userExists("mist").unwrap()
for name in ["a", "b"] (
  client.following().follow(name).unwrap()
)
```

`posts().find(query)` searches, `posts().popular()` is the front page, and `groups()` has methods for creating, inviting, roles, bans and events.

## Storage

Your account has a small key-value store per application id. It is how a program remembers things across machines:

```osl norun
import "std:rotur"

*rotur.Client client = rotur.load().unwrap()
auto store = client.storage()

store.set("my-app", "theme", "dark").unwrap()
log store.value("my-app", "theme").unwrap()
store.delete("my-app", "theme").unwrap()
```

## Endpoints without a method

`client.request(method, path, options)` calls any endpoint the client has no method for, with `query` and `body` options. The token goes only to the client's own host:

```osl norun
import "std:rotur"

auto client = rotur.new()
auto limits = client.request("GET", "/limits").unwrap()
log limits
```

## Realtime

`client.socket()` is a websocket connection to rotur. `start()` connects and authenticates, `join` enters rooms, and `on(event, handler)` listens. Handlers run on background threads:

```osl norun
import "std:rotur"
import "std:thread"

*rotur.Client client = rotur.load().unwrap()
auto socket = client.socket()

socket.on("gmsg", def(any message) ( log message ))
socket.start().unwrap()
socket.join(["lobby"]).unwrap()
socket.broadcast("lobby", {hello: "world"}).unwrap()

thread.sleep(60000)
socket.stop()
```

## Offline helpers

These work without a network. `rotur.avatarURL`, `bannerURL`, `backgroundURL` and `overlayURL` build the image addresses for a user, and `version` busts the cache when a picture changes:

```osl
import "std:rotur"

log rotur.avatarURL("mist", {version: "2"})
```

```output
https://avatars.rotur.dev/mist?v=2
```

`rotur.canonical(value)` writes a value as canonical JSON: keys sorted, no spaces. Those bytes are what rotur signatures are made over, so two sides get the same bytes from the same data:

```osl
import "std:rotur"

log rotur.canonical({b: 1, a: [1, 2], c: "x"})
```

```output
{"a":[1,2],"b":1,"c":"x"}
```

`rotur.generateKey()` makes an Ed25519 key pair as JWK objects, and `rotur.signWith(seed, content)` and `rotur.verifyWith(publicKey, content, signature)` sign and check. For a signed-in client, `client.signing()` signs content as you, encrypts to another user, and decrypts what was sent to you.

```osl
import "std:rotur"

auto pair = rotur.generateKey().unwrap()
log pair.algorithm
```

```output
Ed25519
```

:::exercise title="Same bytes"
Two programs describe the same data with keys in different orders. Print `true` if `rotur.canonical` gives the same text for both.

```osl
import "std:rotur"

auto first = {name: "Ada", age: 36}
auto second = {age: 36, name: "Ada"}

log first == second
```

```output
true
```

> [!hint]
> Call `rotur.canonical` on each and compare the strings.

```osl solution
import "std:rotur"

auto first = {name: "Ada", age: 36}
auto second = {age: 36, name: "Ada"}

log rotur.canonical(first) == rotur.canonical(second)
```
:::

## API reference

::api
