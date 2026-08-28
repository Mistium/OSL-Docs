# ftp

Use `ftp` for connecting to FTP servers and transferring, renaming, deleting, or synchronising files and directories.

```javascript
import "std:ftp"
```

## API reference

### `ftp`

| Method | Returns | Description |
| --- | --- | --- |
| `ftp.connect(host: any, port: any, user: any, password: any)` | `*FTP` | Opens a connection. |
| `ftp.connectEx(host: any, port: any, user: any, password: any)` | `*FTP` | Runs the connect ex operation. |
| `ftp.list(path: any)` | `array` | Lists compact entry projections through shared path and connection checks. |
| `ftp.upload(localFile: any, remotePath: any)` | `boolean` | Runs the upload operation. |
| `ftp.download(remotePath: any, localPath: any)` | `boolean` | Runs the download operation. |
| `ftp.delete(remotePath: any)` | `boolean` | Deletes a value. |
| `ftp.rename(oldPath: any, newPath: any)` | `boolean` | Runs the rename operation. |
| `ftp.createDirectory(path: any)` | `boolean` | Creates directory. |
| `ftp.deleteDirectory(path: any)` | `boolean` | Deletes directory. |
| `ftp.changeDirectory(path: any)` | `boolean` | Runs the change directory operation. |
| `ftp.currentDirectory()` | `string` | Runs the current directory operation. |
| `ftp.isActive()` | `boolean` | Reports whether active. |
| `ftp.setTimeout(seconds: any)` | `boolean` | Sets timeout. |
| `ftp.getFileSize(path: any)` | `number` | Returns file size. |
| `ftp.exists(path: any)` | `boolean` | Reports whether a validated remote path exists. |
| `ftp.uploadDirectory(localDir: any, remoteDir: any)` | `boolean` | Runs the upload directory operation. |
| `ftp.downloadDirectory(remoteDir: any, localDir: any)` | `boolean` | Runs the download directory operation. |
| `ftp.setMode(path: any, mode: any)` | `boolean` | Sets mode. |
| `ftp.setModificationTime(path: any, timestamp: any)` | `boolean` | Sets modification time through the same validated remote-path operation used by other commands. |
| `ftp.passiveMode(enabled: any)` | `boolean` | Runs the passive mode operation. |
| `ftp.sync(localDir: any, remoteDir: any)` | `boolean` | Runs the sync operation. |
| `ftp.getStatistics()` | `object` | Returns statistics. |

### `FTP` values

| Method | Returns | Description |
| --- | --- | --- |
| `value.login()` | `boolean` | Runs the login operation. |
| `value.disconnect()` | `boolean` | Runs the disconnect operation. |

## Notes

- Prefer `import "std:ftp"`; the older `import "osl/ftp"` spelling remains supported.

## Connection and transfer behavior

`connect` opens and logs into the server directly; it does not shell out to a
system `ftp` executable. The returned client owns its connection state.
Credentials and all single-path operations reject command separators. Failed or partial
downloads remove their local partial file, and recursive uploads reject
symlinks.
Connected operations share one state predicate while retaining their existing locks.
