# ssh

> SSH and SFTP operations

```javascript
import "osl/ssh"
```

## Methods

- `ssh.connect(host, port, user, password, privateKey)` → `SSHClient`
- `ssh.execRemote(host, port, user, password, privateKey, command)` → `object`
- `ssh.scpUpload(client, localPath, remotePath)` → `boolean`
- `ssh.scpDownload(client, remotePath, localPath)` → `boolean`
- `ssh.tunnel(localPort, remoteHost, remotePort, sshHost, sshPort)` → `SSHClient`
- `ssh.generateKeyPair(keyType)` → `object`
- `ssh.savePrivateKey(path, key)` → `boolean`
- `ssh.savePublicKey(path, key)` → `boolean`
- `ssh.loadPrivateKey(path)` → `string`
- `ssh.fingerprint(publicKey)` → `string`

## Returned object: `SSHClient`

Returned by `ssh` methods; call these on the value you get back.

- `sSHClient.exec(command)` → `object`
- `sSHClient.startCommand(command)` → `boolean`
- `sSHClient.sendInput(input)` → `boolean`
- `sSHClient.readOutput(timeout)` → `string`
- `sSHClient.close()` → `boolean`
- `sSHClient.isConnected()` → `boolean`
