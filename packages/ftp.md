# ftp

> FTP file transfers

Use `ftp` for connecting to FTP servers and transferring, renaming, deleting, or synchronising files and directories.

```javascript
import "osl/ftp"
```

## API reference

### `ftp`

| Method | Returns | Description |
| --- | --- | --- |
| `ftp.connect(host: any, port: any, user: any, password: any)` | `*FTP` | Opens a connection. |
| `ftp.connectEx(host: any, port: any, user: any, password: any)` | `*FTP` | Runs the connect ex operation. |
| `ftp.list(path: any)` | `array` | Runs the list operation. |
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
| `ftp.exists(path: any)` | `boolean` | Reports whether the value or resource exists. |
| `ftp.uploadDirectory(localDir: any, remoteDir: any)` | `boolean` | Runs the upload directory operation. |
| `ftp.downloadDirectory(remoteDir: any, localDir: any)` | `boolean` | Runs the download directory operation. |
| `ftp.setMode(path: any, mode: any)` | `boolean` | Sets mode. |
| `ftp.setModificationTime(path: any, timestamp: any)` | `boolean` | Sets modification time. |
| `ftp.passiveMode(enabled: any)` | `boolean` | Runs the passive mode operation. |
| `ftp.sync(localDir: any, remoteDir: any)` | `boolean` | Runs the sync operation. |
| `ftp.getStatistics()` | `object` | Returns statistics. |

### `FTP` values

Methods available on `FTP` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.login()` | `boolean` | Runs the login operation. |
| `value.disconnect()` | `boolean` | Runs the disconnect operation. |

## Notes

- Standard-library imports accept both `import "osl/ftp"` and `import "ftp"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
