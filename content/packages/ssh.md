---
description: Run commands on remote machines, transfer files over SFTP, forward ports, and create and manage SSH keys.
package: ssh
---

# ssh

`std:ssh` connects to a server over SSH. Run a command, move files with SFTP, or forward a port through the connection. It always verifies the server's host key, so you can't be tricked into talking to an impostor without noticing.

Anything that reaches a server is `norun`. Key handling works offline and runs below, so we start there.

## Make a key pair

`ssh.generateKeyPair("ed25519")` returns a private and a public key as text. Ed25519 is the modern default, and `"rsa"` is there for old servers:

```osl
import "std:ssh"

auto keys = ssh.generateKeyPair("ed25519")
log keys.type
log keys.public.startsWith("ssh-ed25519 ")
log keys.private.startsWith("-----BEGIN")
```

```output
ed25519
true
true
```

Put the public key in the server's `authorized_keys`, and keep the private one to yourself.

## Fingerprints

A fingerprint is a short name for a key, which people compare to check it is the right one:

```osl
import "std:ssh"

auto keys = ssh.generateKeyPair("ed25519")
log ssh.fingerprint(keys.public).unwrap().startsWith("SHA256:")
log ssh.fingerprint("not a key").unwrapErr().kind
```

```output
true
ParseError
```

## Save and load keys

`savePrivateKey` writes a file only its owner can read. `loadPrivateKey` reads it back:

```osl
import "std:ssh"
import "std:fs"

fs.remove("id_demo", {force: true}).unwrap()
fs.remove("id_demo.pub", {force: true}).unwrap()

auto keys = ssh.generateKeyPair("ed25519")
ssh.savePrivateKey("id_demo", keys.private).unwrap()
ssh.savePublicKey("id_demo.pub", keys.public).unwrap()

log fs.stat("id_demo").unwrap().mode
log ssh.loadPrivateKey("id_demo").unwrap() == keys.private
log ssh.loadPrivateKey("missing").unwrapErr().kind

fs.remove("id_demo", {force: true}).unwrap()
fs.remove("id_demo.pub", {force: true}).unwrap()
```

```output
-rw-------
true
NotFoundError
```

The mode `-rw-------` is what SSH servers and clients insist on for private keys.

## Connect

`ssh.connect(address, options)` needs a `username` and either a `password` or a `privateKey`. The server's host key is checked against your `~/.ssh/known_hosts`, or pass `hostKey` to pin one:

```osl norun
import "std:ssh"

string key = ssh.loadPrivateKey("id_demo").unwrap()
auto client = ssh.connect("server.example.com", {username: "deploy", privateKey: key}).unwrap()
log client.isConnected()
client.close().unwrap()
```

A server that is down is a `NetworkError`, which you can see run:

```osl
import "std:ssh"

auto attempt = ssh.connect("127.0.0.1:1", {username: "me", password: "x", timeout: 1000})
log attempt.unwrapErr().kind
```

```output
NetworkError
```

> [!warning]
> `insecureIgnoreHostKey` turns host checking off. That is fine for a test machine, and it removes the protection that keeps someone in the middle out. Don't use it for real servers.

## Run a command

`client.run(command)` runs it through the remote shell and returns `{stdout, stderr, code, ok}`. A command that exits with an error is still a successful call: check `ok`:

```osl norun
import "std:ssh"

auto client = ssh.connect("server.example.com", {username: "deploy", password: "..."}).unwrap()

auto out = client.run("uname -a").unwrap()
log out.stdout.trim()

auto missing = client.run("ls /nowhere").unwrap()
log missing.ok missing.code
log missing.stderr.trim()
client.close().unwrap()
```

For a command that keeps running or needs input, `client.start(command)` returns a session you can read from and write to.

## Files with SFTP

`client.upload(local, remote)` and `client.download(remote, local)` copy a file. For more control, `client.sftp()` gives a handle with the shape of [fs](fs.md): `readFile`, `writeFile`, `entries`, `mkdir`, `remove`:

```osl norun
import "std:ssh"

auto client = ssh.connect("server.example.com", {username: "deploy", password: "..."}).unwrap()
auto files = client.sftp().unwrap()

files.mkdir("/srv/app/logs", {recursive: true}).unwrap()
files.writeFile("/srv/app/logs/hello.txt", "hi from OSL").unwrap()
log files.readFile("/srv/app/logs/hello.txt").unwrap()
for entry in files.entries("/srv/app/logs").unwrap() (
  log entry.name entry.size
)
files.close()
client.close().unwrap()
```

## Port forwarding

`client.forward(local, remote)` listens on a local address and sends every connection through SSH to the remote one. It is how you reach a database that only the server can see:

```osl norun
import "std:ssh"

auto client = ssh.connect("server.example.com", {username: "deploy", password: "..."}).unwrap()
auto tunnel = client.forward("127.0.0.1:0", "localhost:5432").unwrap()
log "connect your tool to" tunnel.localAddr()
```

:::quiz
`client.run("exit 3").unwrap()` returns. What is `.ok`?

- [ ] `true`, since the command ran.
- [x] `false`, and `.code` is 3.
- [ ] The call fails with an error.

The call fails only when the command couldn't be run. A non-zero exit is a normal result that you inspect.
:::

:::exercise title="Key round trip"
Generate an ed25519 key pair, save the private key to `id_exercise`, load it back, and print whether it matches. Delete the file at the end.

```osl
import "std:ssh"
import "std:fs"

log "?"
```

```output
true
```

> [!hint]
> `ssh.savePrivateKey(path, keys.private).unwrap()`, then `ssh.loadPrivateKey(path).unwrap()`.

> [!hint]
> Clean up with `fs.remove("id_exercise", {force: true}).unwrap()`.

```osl solution
import "std:ssh"
import "std:fs"

auto keys = ssh.generateKeyPair("ed25519")
ssh.savePrivateKey("id_exercise", keys.private).unwrap()
log ssh.loadPrivateKey("id_exercise").unwrap() == keys.private
fs.remove("id_exercise", {force: true}).unwrap()
```

```output
true
```
:::

## API reference

::api
