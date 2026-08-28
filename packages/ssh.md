# ssh

Use `ssh` for SSH connections, remote commands, SCP transfers, tunnels, and key handling.

```osl
import "std:ssh"
```

## API reference

### `ssh`

| Method | Returns | Notes |
| --- | --- | --- |
| `ssh.connect(host: any, port: any, user: any, password: any, privateKey: any)` | `*SSHClient` | Opens a connection. Ports must be between 1 and 65,535; an empty port defaults to 22. |
| `ssh.execRemote(host: any, port: any, user: any, password: any, privateKey: any, command: any)` | `object` |  |
| `ssh.scpUpload(client: *SSHClient, localPath: any, remotePath: any)` | `boolean` | Uploads a file over SFTP and reports transfer errors. |
| `ssh.scpDownload(client: *SSHClient, remotePath: any, localPath: any)` | `boolean` | Downloads a file over SFTP and reports transfer errors. |
| `ssh.tunnel(localPort: any, remoteHost: any, remotePort: any, sshHost: any, sshPort: any)` | `*SSHClient` | Opens a verified tunnel using the same port validation and SSH port default. |
| `ssh.generateKeyPair(keyType: any)` | `object` |  |
| `ssh.generateRSAKey()` | `string, string` | Returns PEM-encoded RSA private and public keys. |
| `ssh.generateEd25519Key()` | `string, string` | Returns encoded Ed25519 private and public keys. |
| `ssh.savePrivateKey(path: any, key: any)` | `boolean` | Saves private key. |
| `ssh.savePublicKey(path: any, key: any)` | `boolean` | Saves public key. |
| `ssh.loadPrivateKey(path: any)` | `string` | Loads private key. |
| `ssh.fingerprint(publicKey: any)` | `string` |  |

### `SSHClient` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.exec(command: any)` | `object` | Runs for at most 30 seconds and captures at most 16 MiB of combined output. |
| `value.execLimited(command: any, maxBytes: any)` | `object` | Runs for at most 30 seconds with a chosen output limit. Nonpositive values use 16 MiB; values above 1 GiB use 1 GiB. |
| `value.execTimeout(command: any, timeout: any)` | `object` | Runs for at most 300 seconds with the default 16 MiB output limit. Nonpositive timeouts use one millisecond. |
| `value.execTimeoutLimited(command: any, timeout: any, maxBytes: any)` | `object` | Runs with both a chosen timeout and output limit. |
| `value.startCommand(command: any)` | `boolean` | Starts command. |
| `value.sendInput(input: any)` | `boolean` | Sends input. |
| `value.readOutput(timeout: any)` | `string` | Reads the next ordered output chunk with a fractional-seconds timeout; repeated timeouts share one session-owned reader. Non-positive values use one millisecond. |
| `value.close()` | `boolean` | Closes the resource. |
| `value.isConnected()` | `boolean` |  |

## Notes

- Prefer `import "std:ssh"`; the older `import "osl/ssh"` spelling remains supported.

## Security and transfer behavior

Hosts are verified against `SSH_KNOWN_HOSTS`, or `~/.ssh/known_hosts` when the
variable is unset. A missing or mismatched key fails closed. File transfers use
SFTP over the verified connection, preserve exact remote paths, and remove
partial local files on failure. Saved private keys use mode `0600`.
Command results always include `output`, `error`, `timeout`, and `truncated`. Excess output keeps the
captured prefix and returns `success: false`. A timeout closes the session and joins its command worker.
