# rotur

Use `rotur` as a client for the [rotur.dev](https://rotur.dev) API: sign in, accounts, posts,
groups, economy, signing and encryption, storage and realtime presence.

```osl
import "std:rotur"
```

## Example

Public endpoints work without a token:

```osl
import "std:rotur"

*rotur.Client api = rotur.new()

for post in api.posts().list({limit: 5}) (
  log post.user ++ ": " ++ post.content
)
log api.profiles().exists("mist")
log rotur.avatarURL("mist")
```

Sign in once with the rotur.dev/link device flow, then reuse the saved token:

```osl
import "std:rotur"

*rotur.Client client = rotur.load()
if !client.hasToken() (
  client.login()
)
log "signed in as " ++ client.username()

client.posts().create("Hello from OSL", {profileOnly: true})
object me = client.me().get()
log me["sys.currency"]
```

`client.login()` prints a code and URL, waits for you to approve it on rotur.dev and saves the token
to the rotur CLI config file, so `rotur.load()` finds it next time.

## Errors

Every API method returns `result<T, error>`. The message carries the API's own error text.

| Kind | When |
| --- | --- |
| `NotFoundError` | A missing resource (HTTP 404). |
| `PermissionError` | The client has no token, or the API refuses the request (401, 402, 403). |
| `ValueError` | Another rejected request (4xx). |
| `StateError` | A conflict or rate limit (409, 429). |
| `TimeoutError` | The request or a wait timed out. |
| `NetworkError` | The API can't be reached (also 502 and 503). |
| `RuntimeError` | Anything else. |

```osl
import "std:rotur"

*rotur.Client api = rotur.new()
object profile = api.profiles().get("no-such-user-here") catch (err) (
  log err.kind // NotFoundError
  return
)
log profile.username
```

Response objects keep the API's own keys, which are snake_case in places.

## API reference

### `rotur`

| Method | Returns | Notes |
| --- | --- | --- |
| `rotur.new(token?: string)` | `*rotur.Client` | A client. Without a token (or with `""`) it can only call public endpoints. Throws `TypeError` when `token` isn't a string. |
| `rotur.load()` | `result<*rotur.Client, error>` | A client with the saved token (see `loadToken`), or an anonymous one; check `client.hasToken()`. |
| `rotur.loadToken()` | `result<string?, error>` | `ROTUR_TOKEN`, else the token in the rotur CLI config file, else `null`. Fails with `IOError` or `ParseError` when the config file can't be read. |
| `rotur.logout()` | `result<unit, error>` | Removes the saved token and username from the config file. |
| `rotur.configPath()` | `result<string, error>` | The rotur CLI config file, `~/.config/rotur/config.json`. |
| `rotur.avatarURL(username: string, options?)` | `string` | Profile picture URL. Option: `version` (appended as `?v=` so a changed picture isn't cached; without it the URL has no query). |
| `rotur.bannerURL(username, options?)`, `rotur.overlayURL(username, options?)`, `rotur.backgroundURL(username, options?)` | `string` | Banner, avatar overlay and background video URLs. Same option. |
| `rotur.canonical(value)` | `string` | Canonical JSON (sorted keys, JavaScript number formatting), the bytes rotur signatures cover. |
| `rotur.signWith(seed: string, content)` | `result<string, error>` | Signs `content`'s canonical JSON with a base64url Ed25519 seed (a private JWK's `d`). Fails with `ValueError` for a bad seed. |
| `rotur.verifyWith(publicKey: string, content, signature: string)` | `result<boolean, error>` | Whether `signature` is valid for `publicKey` (a JWK's `x`). Fails with `ValueError` for malformed input. |
| `rotur.generateKey()` | `result<{private_key_jwk, public_key_jwk, algorithm}, error>` | A new Ed25519 key pair. |

### `*rotur.Client`

| Method | Returns | Notes |
| --- | --- | --- |
| `client.hasToken()` | `boolean` | Whether the client has a token. Doesn't check it; `whoami` does. |
| `client.useToken(token: string)` | `void` | Sends `token` from now on; `""` makes the client anonymous. Tokens are write-only: nothing returns them. |
| `client.useBaseURL(url: string)` | `void` | Another API root instead of `https://api.rotur.dev/v2`, such as a test server. |
| `client.login(options?)` | `result<unit, error>` | The rotur.dev/link device flow. Options: `timeout` (ms, default 180000), `save` (default `true`: also `saveToken`), `onCode` (function called with the code and approval URL; without it the instructions are printed). Fails with `TimeoutError` when nobody approves in time. |
| `client.saveToken(options?)` | `result<unit, error>` | Stores the token in the rotur CLI config file. Option: `username`. Fails with `StateError` without a token. |
| `client.whoami()` | `result<object, error>` | Checks the token: `{auth, username, token_type, permissions}`. |
| `client.username()` | `result<string, error>` | The account the token belongs to. Fails with `PermissionError` without a valid token. |
| `client.request(method: string, path: string, options?)` | `result<any, error>` | Calls any endpoint. `path` is relative to the base URL (`"/limits"`) or a full URL. Options: `query` (object), `body` (a string is sent as text/plain, anything else as JSON). Returns decoded JSON, or text. |
| `client.socket()` | `*rotur.Socket` | The client's realtime connection. |

Sub-APIs, each returned by a method on the client:

| Method | Covers |
| --- | --- |
| `client.me()` | The signed-in account: data, credits, badges, blocks, notes, billing. |
| `client.posts()` | Posts, replies, likes, polls, bookmarks, feeds. |
| `client.friends()` | Friends and friend requests. |
| `client.following()` | Follows and followers. |
| `client.notifications()` | Reading, marking and sending notifications. |
| `client.profiles()` | Public profiles. |
| `client.groups()` | Groups, members, roles, events, announcements, tips, products. |
| `client.keys()` | Purchasable access keys. |
| `client.items()` | Tradeable items. |
| `client.gifts()` | Credit gifts. |
| `client.tokens()` | Sub-tokens with limited permissions. |
| `client.stats()` | Public platform statistics. |
| `client.status()` | Live status. |
| `client.validators()` | Validator tokens for third-party sign-in. |
| `client.link()` | The device sign-in flow, step by step. |
| `client.cosmetics()` | Profile cosmetics. |
| `client.pets()` | Pets. |
| `client.push()` | Web push devices and notifications. |
| `client.files()` | The account's cloud files. |
| `client.storage()` | Per-app key/value storage. |
| `client.signing()` | Identity keys, signatures and encryption. |
| `client.avatars()` | Uploading profile pictures, banners and overlays. |
| `client.emojis()` | Custom emojis. |
| `client.trust()` | Trust scores and user verification. |
| `client.accounts()` | Registration, password resets, email verification. |
| `client.sessions()` | Usage sessions. |
| `client.ai()` | The rotur AI. |
| `client.systems()` | Registered systems and their badges. |

Methods marked *public* below work without a token; the rest need one and fail with
`PermissionError` without it. Unless a return type is given, a method returns
`result<object, error>` with the API's answer.

### `client.me()`

| Method | Notes |
| --- | --- |
| `get()` | The account's data object, including `sys.*` keys such as `sys.currency`. |
| `update(key: string, value)`, `deleteKey(key: string)` | Set or remove one key of the account data. |
| `refreshToken()` | A new token, as `{token}`. The old one stops working; pass the new one to `useToken`. |
| `pay(to: string, amount: number, options?)` | Sends credits. Option: `note`. |
| `claimDaily()` | Claims the daily reward. Fails with `StateError` or `ValueError` when already claimed. |
| `claimTime()` | `{wait_time}` until the next daily reward. |
| `transactions()` | `result<array, error>`: credit transactions. |
| `subscription()` | `result<{active, tier, next_billing}, error>`. Without one, `{active: false, tier: "Free", next_billing: 0}`. `next_billing` is unix ms. |
| `badges()`, `badgePreferences()`, `updateBadgePreferences(preferences: object)` | Badges and how they're shown. |
| `abilities()` | What the token may do. |
| `blocked()`, `block(username)`, `unblock(username)` | Blocks. |
| `note(username, content)`, `notes()`, `deleteNote(username)` | Private notes about users. |
| `benefits()`, `billing()`, `checkout(lookupKey)`, `billingPortal()` | Subscription and billing. |
| `changePassword(current, next)` | Fails with `PermissionError` when `current` is wrong. |
| `resendVerification()`, `acceptTOS()` | |

### `client.posts()`

| Method | Notes |
| --- | --- |
| `list(options?)` | Public. `result<array, error>`: the feed, newest first. Options: `limit` (1-100, default 100), `offset`. |
| `following(options?)` | `result<array, error>`: posts from followed accounts. Option: `limit`. |
| `popular(options?)` | Public. `result<array, error>`: most liked recent posts. Options: `limit` (default 50), `period` (ms to look back, default 86400000, whole hours). |
| `search(query: string, options?)` | Public. `result<array, error>`. Option: `limit` (1-20, default 20). |
| `get(id: string)` | Public. Fails with `NotFoundError`. |
| `create(content: string, options?)` | Publishes a post. Options: `attachment` (URL), `attachments` (array of URLs), `profileOnly`, `os` (a system to tag), `poll` (2-6 option strings), `scheduledFor` (unix ms). |
| `edit(id, content)`, `delete(id)` | |
| `reply(id, content)`, `repost(id)` | Return the new post. |
| `like(id)`, `unlike(id)`, `pin(id)`, `unpin(id)`, `bookmark(id)`, `unbookmark(id)` | |
| `vote(id: string, option: int)` | Votes in a post's poll, replacing an earlier vote, and returns `{poll}`. Options count from 1, so 1 is the first. Throws `ValueError` below 1. |
| `view(id)`, `viewMany(ids: array)` | Count views. |
| `bookmarks()`, `scheduled()` | `result<array, error>`. |
| `limits()` | Public. Posting limits per tier. |

### `client.friends()` and `client.following()`

| Method | Notes |
| --- | --- |
| `friends().list()` | `{friends}`. |
| `friends().request(username)`, `accept(username)`, `reject(username)`, `remove(username)`, `cancel(username)` | |
| `friends().requests()`, `friends().outgoing()` | `{requests}`, `{requests_out}`. |
| `following().follow(username)`, `unfollow(username)` | |
| `following().followers(username)`, `following().following(username)` | Public. |

### `client.notifications()`

| Method | Notes |
| --- | --- |
| `recent(options?)` | `result<array, error>`, newest first. Option: `period` (ms, default 30 days, whole days). |
| `read(id)`, `readMany(ids: array)`, `readAll()` | Mark read. |
| `delete(id)`, `clear()` | |
| `create(target: string, kind: string, options?)` | Sends a notification. Options: `actor`, `data`, `platform`, `platformData`. |

### `client.profiles()`

| Method | Notes |
| --- | --- |
| `get(username: string, options?)` | Public. A profile. Option: `includePosts` (default `true`). Fails with `NotFoundError`. |
| `exists(username: string)` | Public. `result<boolean, error>`. |
| `supporters()` | Public. `result<array, error>` of `{username, subscription}`. |
| `delete(username: string)` | Deletes the signed-in account, which must be `username`. |

### `client.groups()`

| Method | Notes |
| --- | --- |
| `mine()`, `search(query)` | `result<array, error>`. |
| `popular(options?)` | Public. Option: `limit` (default 10). |
| `create(tag: string, name: string, options?)` | Options: `description`, `iconURL`, `bannerURL`, `public`, `joinPolicy` (such as `"open"` or `"request"`). |
| `get(tag)`, `update(tag, updates)`, `delete(tag)` | |
| `join(tag)`, `requestJoin(tag, options?)`, `leave(tag)` | `requestJoin` option: `message`. |
| `represent(tag)`, `disrepresent(tag)`, `report(tag)` | |
| `announcements(tag)` | Public. `result<array, error>`. |
| `announce(tag, title, body, options?)` | Option: `pingMembers`. |
| `deleteAnnouncement(tag, id)`, `muteAnnouncements(tag)` | |
| `events(tag)`, `createEvent(tag, event)`, `updateEvent(tag, eventID, updates)`, `deleteEvent(tag, eventID)` | |
| `tips(tag)`, `tip(tag, amount, options?)`, `withdrawTip(tag, amount)`, `tipWithdrawals(tag, options?)` | `tip` option: `note`; `tipWithdrawals` option: `limit` (default 20). |
| `products(tag)`, `createProduct(tag, product)`, `deleteProduct(tag, productID)`, `purchaseProduct(tag, productID)`, `cancelProductSubscription(tag, productID)`, `myProductSubscriptions()` | `product` has `name`, `description`, `priceCredits`, `roleID`, `subscription`, `frequency`, `period`; any other key throws `ValueError`. |
| `productOwnership(tag, productID, username)` | Public. |
| `members(tag, options?)` | A page of members. Options: `page` (1-based), `perPage`, `search`. |
| `roles(tag)`, `createRole(tag, role)`, `updateRole(tag, roleID, updates)`, `deleteRole(tag, roleID)` | |
| `userRoles(tag, userID)`, `userPermissions(tag, userID)`, `userBenefits(tag, userID)` | `result<array, error>`. |
| `assignRole(tag, userID, roleID)`, `removeRole(tag, userID, roleID)` | |
| `invites(tag)`, `invite(tag, username)`, `revokeInvite(tag, inviteID)`, `myInvites()`, `acceptInvite(tag, inviteID)`, `declineInvite(tag, inviteID)` | |
| `joinRequests(tag)`, `acceptJoinRequest(tag, requestID)`, `declineJoinRequest(tag, requestID)` | |
| `kick(tag, userID)`, `ban(tag, userID, options?)`, `unban(tag, userID)`, `bans(tag)`, `checkBan(tag, userID)` | `ban` option: `reason`. |
| `memberInfo(tag, userID)`, `transferOwnership(tag, userID)` | |

### Economy: `client.keys()`, `client.items()`, `client.gifts()`

| Method | Notes |
| --- | --- |
| `keys().create(name, options?)` | Options: `description`, `price`, `subscription`, `frequency`, `period`. |
| `keys().mine()`, `keys().get(id)` (public), `keys().check(username, key)` (public) | |
| `keys().rename(id, name)`, `update(id, key, data)`, `delete(id)` | |
| `keys().addUser(id, user)`, `removeUser(id, user)`, `revoke(id, user)`, `buy(id)`, `cancel(id)` | |
| `items().create(item)`, `get(name)` (public), `list(username)` (public) | |
| `items().forSale(options?)` | Public. Option: `limit` (default 50). |
| `items().buy(name)`, `transfer(name, username)`, `sell(name)`, `stopSelling(name)`, `setPrice(name, price)`, `update(name, data)`, `delete(name)` | |
| `gifts().create(amount, options?)` | Options: `note`, `expiresIn` (ms, whole hours). |
| `gifts().get(code)` (public), `claim(code)`, `cancel(id)`, `mine()` | |

### `client.tokens()`

| Method | Notes |
| --- | --- |
| `permissions()` | Public. Permissions a sub-token can have. |
| `list()`, `active()` | `{tokens, total}`. |
| `create(name: string, permissions: array, options?)` | Returns the sub-token, including the token itself. Options: `expiresIn` (ms, whole hours), `origin`, `description`, `websites`. |
| `get(id)`, `activity(id)`, `update(id, changes)`, `rename(id, name)`, `revoke(id)`, `delete(id)` | |

### `client.stats()` and `client.status()`

| Method | Notes |
| --- | --- |
| `stats().economy()`, `stats().users()`, `stats().systems()` | Public. |
| `stats().topEarners(options?)` | Public. `[{user, earned}]`. Option: `limit` (default 10). |
| `stats().topFollowed(options?)` | Public. `[{username, follower_count}]`. Option: `limit`. |
| `stats().postActivity(options?)` | Public. `{days, total, buckets}`. Option: `period` (ms, default 7 days, whole days). |
| `status().get(username)` | Public. Live status. |
| `status().setLive(status: object)` | Publishes live status. |

### Sign-in: `client.validators()` and `client.link()`

| Method | Notes |
| --- | --- |
| `validators().generate(key: string)` | `{validator}`, a one-time proof of the account for the service `key`. |
| `validators().validate(validator: string, key: string)` | Public. Whether it's valid and for which user. |
| `link().code()` | Public. `result<string, error>`: a fresh device code. |
| `link().url(code)` | `string`: where the user approves `code`. |
| `link().status(code)`, `link().linkedUser(code)` | Public. `{status}`; `{linked, token?}`. |
| `link().linkCode(code)` | Approves `code` as the signed-in account. |
| `link().waitForToken(code, options?)` | `result<string, error>`: polls until approved, then uses and returns the token. Option: `timeout` (ms, default 120000). |

### Profile extras: `client.cosmetics()`, `client.pets()`, `client.avatars()`, `client.emojis()`

| Method | Notes |
| --- | --- |
| `cosmetics().shop(options?)` | Public. Options: `type`, `featured`, `search`, `sort`, `limit`, `offset`. |
| `cosmetics().get(id)`, `forUser(username)`, `forUsers(usernames)` | Public. |
| `cosmetics().mine()`, `purchase(id)`, `equip(id)`, `unequip(kind)`, `give(id, to, options?)`, `gifts()` | `give` option: `note`. |
| `cosmetics().overlayURL(id)`, `cosmetics().backgroundURL(id)` | `string`. |
| `pets().catalog()`, `pets().profile(username)` | Public. |
| `pets().mine()`, `purchase(id)`, `equip(id)`, `unequip()` | Return the API's answer as is. |
| `avatars().uploadAvatar(image)`, `uploadBanner(image)` | `image` is a data URL or base64 string. |
| `avatars().removeBanner()`, `removeBackground()`, `removeOverlay()` | |
| `emojis().mine()`, `upload(name, image)`, `add(id, name)`, `unsave(id)`, `delete(id)` | |
| `emojis().url(id)` | `string`. |

### Data: `client.storage()` and `client.files()`

| Method | Notes |
| --- | --- |
| `storage().get(id: string)` | `{id, data}`: every key stored for the app `id`. |
| `storage().value(id: string, key: string)` | `result<any, error>`: one key, or `null` when unset. |
| `storage().set(id, key, value)`, `storage().delete(id, key)` | Return `{id, data}`. |
| `storage().clear(id)`, `storage().clearAll()` | |
| `storage().list()`, `storage().usage()` | `{ids, usage, max}`, `{usage, max}` in bytes. |
| `files().index()`, `files().all()` | `result<array, error>`: entries without and with contents. |
| `files().byUUID(uuid)`, `files().byPath(path)` | Fail with `NotFoundError`. |
| `files().byUUIDs(uuids)`, `files().stats(uuids)`, `files().pathIndex()`, `files().usage()` | |
| `files().upload(files: object)`, `files().deleteAll()` | `upload` takes a request in the API's format. |

### `client.push()`

| Method | Notes |
| --- | --- |
| `vapidKeys()` | Public. `{public_key, subject}`. |
| `addDevice(device: object)` | `device` has `endpoint`, `p256dh`, `auth`, `source`, `fingerprint`. |
| `check(source, fingerprint)`, `endpoints()`, `deleteDevice(deviceID)` | |
| `allowedSenders()`, `allowSender(username, source)`, `removeSender(username, source)` | |
| `send(username, source, options?)`, `sendMany(users, source, options?)` | Options: `title`, `body`, `data`. |
| `log()`, `notifiableUsers(source)` | |

### `client.signing()`

| Method | Notes |
| --- | --- |
| `identity()` | `result<{user_id, username, key_id, algorithm, public_key_jwk}, error>`: the public half of the account's identity key. The private key never leaves the client. |
| `sign(content)` | `result<{author_id, key_id, signature}, error>`. Pass a function to sign content that must contain the author id: it receives the id and returns the content. |
| `verify(proof: object, content)` | `result<boolean, error>`. A malformed proof, unknown key, mismatched username or wrong signature is `false`; fails only when the key can't be fetched. |
| `lookupKey(userID, keyID, options?)` | A user's public key record, cached. Option: `refresh`. Fails with `NotFoundError`. |
| `currentKey(username)` | Public. A user's current public key record. |
| `rotate()` | Replaces the identity key; old signatures stay verifiable. |
| `encrypt(recipient: object, content)` | `result<Envelope, error>` for `{user_id, key_id, username?}`. Fails with `NotFoundError` for an unknown key, `ValueError` when `username` doesn't own it. |
| `encryptFor(username: string, content)` | Encrypts for the user's current key. |
| `compact(envelope: object)` | `result<string, error>`: one `"rotur_enc_v1."` string, as the rotur CLI prints. |
| `decrypt(envelope)` | `result<any, error>`: opens an envelope (object or compact string) addressed to the account. Fails with `ParseError` (malformed or tampered), `UnsupportedError` (unknown version or algorithm) or `ValueError` (another key's envelope). |

An `Envelope` is `{version, algorithm, recipient_id, recipient_key_id, ephemeral_public_key, salt, iv,
ciphertext}`, in rotur's wire format so it can be sent as JSON as is.

### Others

| Method | Notes |
| --- | --- |
| `trust().score(username)` | A trust score. |
| `trust().verify(options)` | Checks a user against requirements. Options: `username`, `userID`, `accountToken`, `minScore`, `requiredStanding`, `maxRisk`. |
| `accounts().register(account)` | Public. Creates an account from API fields. |
| `accounts().requestPasswordReset(email)`, `resetPassword(token, newPassword)`, `verifyEmail(token)` | Public. |
| `accounts().deletedCheck(ids)`, `accounts().bannedCheck(usernames)` | Public. |
| `sessions().start()`, `sessions().current()` | |
| `sessions().end()` | `result<unit, error>`. |
| `ai().ask(content: string, options?)` | `result<string, error>`: the reply. Options: `user`, `model`. |
| `ai().chat(history: array, options?)` | `result<any, error>`: the reply text, or with `returnHistory` the whole conversation as `[{role, content}]`. Options: `user`, `model`, `returnHistory`. |
| `systems().list()` | Public. System name to system. |
| `systems().users(system)` | `result<array, error>`. |
| `systems().update(system, key, value)` | |
| `systems().badges(system)` | Public. `{badges}`. |
| `systems().createBadge(system, definition)`, `updateBadge(system, badge, definition)`, `deleteBadge(system, badge)`, `revokeBadge(system, badge, username)` | |
| `systems().updateBadgeProgress(system, badge, progress: object)` | `progress` maps usernames to numbers; tiers unlock at the badge's thresholds. Stops at the first failure. Throws `TypeError` for a non-number. |

### `*rotur.Socket`

The realtime connection for presence, rooms, live account keys and activities. Each client has one.

| Method | Returns | Notes |
| --- | --- | --- |
| `socket.start(options?)` | `result<unit, error>` | Connects, authenticates with the client's token and waits until ready. Rooms are rejoined after a reconnect. Option: `timeout` (ms, default 10000). Fails with `PermissionError` (no token or refused), `NetworkError` or `TimeoutError`. |
| `socket.stop()` | `void` | Closes and forgets joined rooms and keys. Stopping twice is a no-op. |
| `socket.on(event: string, handler)` | `void` | Adds a handler that receives the message object. `event` is a server command such as `"ready"`, `"join_ok"`, `"gmsg"`, `"pmsg"` or `"key_update"`, `"close"` when the connection drops, or `"*"`. |
| `socket.off(event: string, handler)` | `void` | |
| `socket.isConnected()` | `boolean` | Connected and authenticated. |
| `socket.userID()`, `socket.username()` | `string?` | `null` before ready. |
| `socket.join(...rooms)`, `socket.leave(...rooms)` | `result<unit, error>` | Room names, or arrays of them. |
| `socket.rooms()` | `array` | Joined rooms. |
| `socket.listRooms()`, `socket.roomState(room)` | `result<unit, error>` | Answers arrive as `"rooms"` and `"room_state"` messages. |
| `socket.broadcast(room: string, value, options?)` | `result<unit, error>` | Delivered as `"gmsg"`. Option: `listener` (echoed back to match replies). |
| `socket.sendPrivate(room: string, to: string, value, options?)` | `result<unit, error>` | Delivered as `"pmsg"`. |
| `socket.key(key: string)` | `any` | A live account key, kept current by `key_update` messages, or `null`. |
| `socket.keys()` | `object` | Every live account key. |
| `socket.updateStatus(status: string, options?)` | `result<unit, error>` | Option: `presence` (`"online"`, `"idle"`, `"dnd"`). |
| `socket.addActivity(activity: object)`, `socket.removeActivity(id)` | `result<unit, error>` | `activity` needs an `id`. |
| `socket.setPlaying(application: string, options?)` | `result<unit, error>` | Options: `title`, `status`, `url`, `image`. |
| `socket.setListening(application: string, media: object, options?)` | `result<unit, error>` | `media` has `title`, `artist`, `album`, `start`, `end` (unix ms). Option: `title`. |
| `socket.send(packet: object)` | `result<unit, error>` | A raw message. |
| `socket.url()`, `socket.setURL(url)` | | The websocket address used by the next `start()`. |

Calls that send fail with `StateError` when the socket isn't connected. Handlers run on background
threads; a handler that throws has its error printed, and the socket keeps running.

```osl
import "std:rotur"

*rotur.Client client = rotur.load()
*rotur.Socket socket = client.socket()
socket.on("gmsg", def(object msg) -> (
  log msg
))
socket.start()
socket.join("lobby")
socket.broadcast("lobby", {text: "hi"})
socket.setPlaying("OSL", {status: "writing docs"})
wait 5
socket.stop()
```

## Changes from earlier versions

A few methods now have their natural names: `posts().find` is `posts().search`, `posts().castVote`
is `posts().vote` (options count from 1), `profiles().lookup` is `profiles().get`,
`profiles().userExists` is `profiles().exists`, `groups().askToJoin` is `groups().requestJoin` and
`groups().banMember` is `groups().ban`. Option keys are camelCase only, and durations such as
`expiresIn` and `period` are in milliseconds; the snake_case keys and `expiresInHrs` are gone. The
asset URL functions add `?v=` only when you pass a `version`.
