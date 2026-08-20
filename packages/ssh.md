# ssh

> SSH connections, remote commands and SCP

Use `ssh` for SSH connections, remote commands, SCP transfers, tunnels, and key handling.

```javascript
import "std:ssh"
```

## API reference

### `ssh`

| Method | Returns | Description |
| --- | --- | --- |
| `ssh.connect(host: any, port: any, user: any, password: any, privateKey: any)` | `*SSHClient` | Opens a connection after shared 1-65535 port validation; an empty port defaults to 22. |
| `ssh.execRemote(host: any, port: any, user: any, password: any, privateKey: any, command: any)` | `object` | Runs the exec remote operation. |
| `ssh.scpUpload(client: *SSHClient, localPath: any, remotePath: any)` | `boolean` | Uploads through the shared checked SFTP transfer path. |
| `ssh.scpDownload(client: *SSHClient, remotePath: any, localPath: any)` | `boolean` | Downloads through the same checked SFTP transfer path. |
| `ssh.tunnel(localPort: any, remoteHost: any, remotePort: any, sshHost: any, sshPort: any)` | `*SSHClient` | Opens a verified tunnel using the same port validation and SSH port default. |
| `ssh.generateKeyPair(keyType: any)` | `object` | Runs the generate key pair operation. |
| `ssh.generateRSAKey()` | `string, string` | Generates RSA material through the shared private/public key encoder. |
| `ssh.generateEd25519Key()` | `string, string` | Generates Ed25519 material through the shared private/public key encoder. |
| `ssh.savePrivateKey(path: any, key: any)` | `boolean` | Saves private key. |
| `ssh.savePublicKey(path: any, key: any)` | `boolean` | Saves public key. |
| `ssh.loadPrivateKey(path: any)` | `string` | Loads private key. |
| `ssh.fingerprint(publicKey: any)` | `string` | Runs the fingerprint operation. |

### `SSHClient` values

Methods available on `SSHClient` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.exec(command: any)` | `object` | Runs the exec operation. |
| `value.execTimeout(command: any, timeout: any)` | `object` | Runs a command with a bounded timeout. |
| `value.startCommand(command: any)` | `boolean` | Starts command. |
| `value.sendInput(input: any)` | `boolean` | Sends input. |
| `value.readOutput(timeout: any)` | `string` | Reads output with a fractional-seconds timeout; non-positive values use one millisecond. |
| `value.close()` | `boolean` | Closes the resource. |
| `value.isConnected()` | `boolean` | Reports whether connected. |

## Notes

- Prefer `import "std:ssh"`; the older `import "osl/ssh"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Security and transfer behavior

Hosts are verified against `SSH_KNOWN_HOSTS`, or `~/.ssh/known_hosts` when the
variable is unset. A missing or mismatched key fails closed. File transfers use
SFTP over the verified connection, preserve exact remote paths, and remove
partial local files on failure. Saved private keys use mode `0600`.
