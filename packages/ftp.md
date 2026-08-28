# ftp

Use `ftp` for connecting to FTP servers and transferring, renaming, deleting, or synchronising files and directories.

```osl
import "std:ftp"
```

## API reference

### `ftp`

| Method | Returns | Notes |
| --- | --- | --- |
| `ftp.connect(host: any, port: any, user: any, password: any)` | `*FTP` | Opens a connection. |
| `ftp.connectEx(host: any, port: any, user: any, password: any)` | `*FTP` |  |
| `ftp.list(path: any)` | `array` | Lists entries at the remote path. |
| `ftp.upload(localFile: any, remotePath: any)` | `boolean` |  |
| `ftp.download(remotePath: any, localPath: any)` | `boolean` |  |
| `ftp.delete(remotePath: any)` | `boolean` | Deletes a value. |
| `ftp.rename(oldPath: any, newPath: any)` | `boolean` |  |
| `ftp.createDirectory(path: any)` | `boolean` | Creates directory. |
| `ftp.deleteDirectory(path: any)` | `boolean` | Deletes directory. |
| `ftp.changeDirectory(path: any)` | `boolean` |  |
| `ftp.currentDirectory()` | `string` |  |
| `ftp.isActive()` | `boolean` |  |
| `ftp.setTimeout(seconds: any)` | `boolean` | Sets timeout. |
| `ftp.getFileSize(path: any)` | `number` | Returns file size. |
| `ftp.exists(path: any)` | `boolean` |  |
| `ftp.uploadDirectory(localDir: any, remoteDir: any)` | `boolean` |  |
| `ftp.downloadDirectory(remoteDir: any, localDir: any)` | `boolean` |  |
| `ftp.setMode(path: any, mode: any)` | `boolean` | Sets mode. |
| `ftp.setModificationTime(path: any, timestamp: any)` | `boolean` | Sets a remote file's modification time. |
| `ftp.passiveMode(enabled: any)` | `boolean` |  |
| `ftp.sync(localDir: any, remoteDir: any)` | `boolean` |  |
| `ftp.getStatistics()` | `object` | Returns statistics. |

### `FTP` values

| Method | Returns |
| --- | --- |
| `value.login()` | `boolean` |
| `value.disconnect()` | `boolean` |

## Notes

- Prefer `import "std:ftp"`; the older `import "osl/ftp"` spelling remains supported.

## Connection and transfer behavior

`connect` opens and logs into the server directly; it does not shell out to a
system `ftp` executable. The returned client owns its connection state.
Credentials and all single-path operations reject command separators. Failed or partial
downloads remove their local partial file, and recursive uploads reject
symlinks.
Connected operations share one state predicate while retaining their existing locks.
