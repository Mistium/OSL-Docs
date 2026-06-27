# ssh

> SSH connections, remote commands and SCP

Use `ssh` for SSH connections, remote commands, SCP transfers, tunnels, and key handling.

```javascript
import "osl/ssh"
```

## API reference

### `ssh`

| Method | Returns | Description |
| --- | --- | --- |
| `ssh.connect(host: any, port: any, user: any, password: any, privateKey: any)` | `*SSHClient` | Opens a connection. |
| `ssh.execRemote(host: any, port: any, user: any, password: any, privateKey: any, command: any)` | `object` | Runs the exec remote operation. |
| `ssh.scpUpload(client: *SSHClient, localPath: any, remotePath: any)` | `boolean` | Runs the scp upload operation. |
| `ssh.scpDownload(client: *SSHClient, remotePath: any, localPath: any)` | `boolean` | Runs the scp download operation. |
| `ssh.tunnel(localPort: any, remoteHost: any, remotePort: any, sshHost: any, sshPort: any)` | `*SSHClient` | Runs the tunnel operation. |
| `ssh.generateKeyPair(keyType: any)` | `object` | Runs the generate key pair operation. |
| `ssh.generateRSAKey()` | `string, string` | Runs the generate rsakey operation. |
| `ssh.generateEd25519Key()` | `string, string` | Runs the generate ed25519 key operation. |
| `ssh.savePrivateKey(path: any, key: any)` | `boolean` | Saves private key. |
| `ssh.savePublicKey(path: any, key: any)` | `boolean` | Saves public key. |
| `ssh.loadPrivateKey(path: any)` | `string` | Loads private key. |
| `ssh.fingerprint(publicKey: any)` | `string` | Runs the fingerprint operation. |

### `SSHClient` values

Methods available on `SSHClient` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.exec(command: any)` | `object` | Runs the exec operation. |
| `value.startCommand(command: any)` | `boolean` | Starts command. |
| `value.sendInput(input: any)` | `boolean` | Sends input. |
| `value.readOutput(timeout: any)` | `string` | Reads output. |
| `value.close()` | `boolean` | Closes the resource. |
| `value.isConnected()` | `boolean` | Reports whether connected. |

## Notes

- Standard-library imports accept both `import "osl/ssh"` and `import "ssh"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
