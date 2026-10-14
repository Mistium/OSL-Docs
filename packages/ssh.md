# ssh

Use `ssh` to connect to SSH servers with host-key verification, run commands, read, write and
manage files over SFTP, forward ports, and manage SSH keys.

```osl
import "std:ssh"
```

## Example

```osl
import "std:ssh"

*ssh.Client client = ssh.connect("server.example.com", {
  username: "deploy",
  privateKey: ssh.loadPrivateKey("/home/deploy/.ssh/id_ed25519")
})

object out = client.run("uname -a", {timeout: 10000})
if out.ok (
  log out.stdout
) else (
  log "exit " ++ out.code ++ ": " ++ out.stderr
)

client.upload("build/app.tar.gz", "/srv/app/app.tar.gz")
client.close()
```

The server's host key is always checked, against `~/.ssh/known_hosts` by default. Pin a key with
`hostKey` instead when the server isn't in `known_hosts`:

```osl
import "std:ssh"

*ssh.Client client = ssh.connect("10.0.0.5:2222", {
  username: "ada",
  password: "secret",
  hostKey: "SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s"
}) catch (err) (
  log err.kind ++ ": " ++ err.message
  return
)
log client.run("whoami").stdout
client.close()
```

## API reference

### `ssh`

| Method | Returns | Notes |
| --- | --- | --- |
| `ssh.connect(address: string, options)` | `result<*ssh.Client, error>` | Connects to `"host"` or `"host:port"` (port 22 by default) and signs in. |
| `ssh.generateKeyPair(keyType: string, options?)` | `{private, public, type}` | Creates a key pair. `keyType` is `"ed25519"` or `"rsa"` (`""` means rsa). `private` is an unencrypted PEM private key, `public` one `authorized_keys` line. Option: `bits` (RSA size, 2048 to 8192, default 2048). Throws `ValueError` for another key type or size. |
| `ssh.fingerprint(publicKey: string)` | `result<string, error>` | SHA256 fingerprint of an `authorized_keys` public key, such as `"SHA256:uNiV…"`. Fails with `ParseError`. |
| `ssh.savePrivateKey(path: string, key: string)` | `result<unit, error>` | Writes `key` readable only by its owner (mode 0600), as SSH requires. |
| `ssh.savePublicKey(path: string, key: string)` | `result<unit, error>` | Writes `key` to `path`. |
| `ssh.loadPrivateKey(path: string)` | `result<string, error>` | Reads a private key file for the `privateKey` option. |

Options for `ssh.connect`:

| Key | Notes |
| --- | --- |
| `username` | Required. |
| `password` | Password sign-in. One of `password` and `privateKey` is required. |
| `privateKey` | A PEM private key, as text. |
| `passphrase` | Passphrase for an encrypted `privateKey`. |
| `knownHosts` | The `known_hosts` file to check the server's key against. Default `$SSH_KNOWN_HOSTS` or `~/.ssh/known_hosts`. |
| `hostKey` | The server's expected public key (`"ssh-ed25519 AAAA…"`) or its `"SHA256:…"` fingerprint, checked instead of `knownHosts`. |
| `insecureIgnoreHostKey` | `true` skips the host-key check. Anyone between you and the server can then read everything; use it only for throwaway test servers. |
| `timeout` | Milliseconds to connect. Default 10000. |

### `*ssh.Client`

| Method | Returns | Notes |
| --- | --- | --- |
| `client.run(command: string, options?)` | `result<{ok, code, stdout, stderr, truncated}, error>` | Runs `command` through the remote user's shell and waits for it. |
| `client.start(command: string)` | `result<*ssh.Session, error>` | Starts `command` and returns a session to talk to it. |
| `client.upload(localPath: string, remotePath: string)` | `result<unit, error>` | Copies a local file to the server over SFTP, replacing `remotePath`. |
| `client.download(remotePath: string, localPath: string)` | `result<unit, error>` | Copies a remote file over SFTP, creating missing local directories. A partly written file is removed. |
| `client.sftp()` | `result<*ssh.SFTP, error>` | Opens an SFTP session for file operations. |
| `client.forward(localAddress: string, remoteAddress: string)` | `result<*ssh.Tunnel, error>` | Listens on `localAddress` (port 0 for any free port) and forwards each connection through the server to `remoteAddress`, such as `"db.internal:5432"`. Connections the server can't make are closed. |
| `client.isConnected()` | `boolean` | Whether the client is connected and not closed. Does not contact the server. |
| `client.close()` | `result<unit, error>` | Closes the connection and its tunnels. Closing twice is a no-op. |

`client.run` returns the same keys as `process.run`:

| Key | Notes |
| --- | --- |
| `ok` | `true` when the exit code is 0. |
| `code` | Exit code, `-1` when the command was killed by a signal. |
| `stdout`, `stderr` | Output text. |
| `truncated` | Output went past `maxOutput`. |

A non-zero exit is not an error unless `check` is set. Options for `client.run`:

| Key | Notes |
| --- | --- |
| `timeout` | Milliseconds; 0 (the default) for none. |
| `maxOutput` | Bytes kept per stream. Default 16 MiB. |
| `input` | Text sent to the command's stdin. |
| `check` | `true` fails with `RuntimeError` on a non-zero exit. |

### `*ssh.Session`

| Method | Returns | Notes |
| --- | --- | --- |
| `session.write(data: byte[])` | `result<unit, error>` | Sends a string, `byte[]` or array of bytes to the command's stdin. Fails with `StateError` once input is closed. |
| `session.closeInput()` | `void` | Closes stdin, so the command sees the end of its input. Closing twice is a no-op. |
| `session.read(options?)` | `result<string, error>` | Waits for the next chunk of output (stdout and stderr together). Once the command has exited and all output is read, fails with `StateError`. Option: `timeout` (ms; waits indefinitely by default). |
| `session.wait()` | `result<int, error>` | Waits for the command to exit and returns its exit code (`-1` when killed by a signal). Unread output stays readable. |
| `session.close()` | `void` | Ends the session, killing the command if it is still running. Closing twice is a no-op. |

```osl
import "std:ssh"

*ssh.Client client = ssh.connect("server.example.com", {username: "ada", password: "secret"})
*ssh.Session session = client.start("cat")
session.write("hello\n")
session.closeInput()
while true (
  string chunk = session.read({timeout: 5000}) catch (err) ( break )
  log chunk
)
log session.wait()
session.close()
client.close()
```

### `*ssh.SFTP`

The methods are named like the [fs](fs.md) functions. The session also closes with the client.

| Method | Returns | Notes |
| --- | --- | --- |
| `sftp.readFile(path: string)` | `result<string, error>` | Reads a whole remote file as text. |
| `sftp.readFileBytes(path: string)` | `result<byte[], error>` | Reads a whole remote file as bytes. |
| `sftp.writeFile(path: string, text: string)` | `result<unit, error>` | Replaces a file's contents, creating it if needed. |
| `sftp.writeFileBytes(path: string, data: byte[])` | `result<unit, error>` | Same, with bytes. |
| `sftp.readDir(path: string)` | `result<string[], error>` | Entry names in a directory, sorted. |
| `sftp.entries(path: string)` | `result<Entry[], error>` | Directory entries, sorted by name. A symlink reports itself, not its target. |
| `sftp.stat(path: string)` | `result<Entry, error>` | Describes a file, directory or symlink. A symlink describes its target, with `isSymlink` true. |
| `sftp.exists(path: string)` | `boolean` | `false` when the path can't be checked. |
| `sftp.remove(path: string)` | `result<unit, error>` | Deletes a file, or a directory and everything in it. A missing path does nothing. A symlink is removed, not its target. |
| `sftp.rename(from: string, to: string)` | `result<unit, error>` | Moves or renames, replacing an existing file at `to` when the server supports it (OpenSSH does). |
| `sftp.mkdir(path: string, options?)` | `result<unit, error>` | Creates a directory. `{recursive: true}` also creates parents and succeeds when it exists. |
| `sftp.close()` | `void` | Ends the SFTP session; the client stays connected. Closing twice is a no-op. |

An `Entry` has the same keys as an `fs.entries` entry:

| Key | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Base name. |
| `path` | `string` | The directory path joined with `name`. |
| `ext` | `string` | Extension. |
| `isDir`, `isSymlink` | `boolean` | |
| `size` | `int` | Bytes. |
| `modTime` | `int` | Unix milliseconds. |
| `mode` | `string` | Such as `"-rw-r--r--"`. |

```osl
import "std:ssh"

*ssh.Client client = ssh.connect("server.example.com", {username: "ada", password: "secret"})
*ssh.SFTP files = client.sftp()
files.mkdir("/tmp/osl-demo", {recursive: true})
files.writeFile("/tmp/osl-demo/hello.txt", "hi")
for entry in files.entries("/tmp/osl-demo") (
  log entry.name ++ " " ++ entry.size
)
files.close()
client.close()
```

### `*ssh.Tunnel`

| Method | Returns | Notes |
| --- | --- | --- |
| `tunnel.localAddr()` | `string` | The address the tunnel listens on, such as `"127.0.0.1:41234"`. |
| `tunnel.close()` | `void` | Stops accepting connections. Closing twice is a no-op. The tunnel also closes with the client. |

### Errors

| Kind | When |
| --- | --- |
| `NetworkError` | The server's key isn't known or doesn't match, the server can't be reached, or the connection breaks. |
| `PermissionError` | The sign-in is refused, or a file can't be read or written. |
| `NotFoundError` | The `known_hosts` file, or a local or remote path, doesn't exist. |
| `ParseError` | `privateKey` or a public key can't be read. |
| `TimeoutError` | A connect, `run` or `read` timeout passed. |
| `UnsupportedError` | The server has no SFTP. |
| `StateError` | End of a session's output, or writing after `closeInput()`. Using a closed client, session or SFTP handle throws `StateError`. |
| `ValueError` (thrown) | `username`, or both `password` and `privateKey`, are missing. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `ssh.connect(host, port, user, password, privateKey)` (five arguments, a client whose `isConnected()` is `false` on failure) | `ssh.connect(address, {username, password, privateKey})` |
| `client.exec(command)` (returned `{success, output, error, timeout, truncated}`) | `client.run(command)` |
| `client.execLimited(command, maxBytes)` | `client.run(command, {maxOutput: bytes})` |
| `client.execTimeout(command, seconds)` | `client.run(command, {timeout: ms})` |
| `client.execTimeoutLimited(command, seconds, maxBytes)` | `client.run(command, {timeout: ms, maxOutput: bytes})` |
| `client.startCommand(command)` | `client.start(command)`, which returns a session |
| `client.sendInput(input)` | `session.write(data)` |
| `client.readOutput(seconds)` (returned `""` on timeout or at the end) | `session.read({timeout: ms})` |
| `ssh.execRemote(host, port, user, password, privateKey, command)` | `ssh.connect(address, options)` then `client.run(command)` |
| `ssh.scpUpload(client, localPath, remotePath)` | `client.upload(localPath, remotePath)` |
| `ssh.scpDownload(client, remotePath, localPath)` | `client.download(remotePath, localPath)` |
| `ssh.tunnel(localPort, remoteHost, remotePort, sshHost, sshPort)` (read credentials from `SSH_*` environment variables) | `ssh.connect(address, options)` then `client.forward(localAddress, remoteAddress)` |

`ssh.generateRSAKey()` and `ssh.generateEd25519Key()` were removed; use
`ssh.generateKeyPair("rsa")` or `ssh.generateKeyPair("ed25519")`.
