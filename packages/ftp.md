# ftp

Use `ftp` to connect to FTP servers and list, upload, download, rename and delete remote files and
directories.

```osl
import "std:ftp"
```

## Example

```osl
import "std:ftp"

*ftp.FTP client = ftp.connect("ftp.example.com", {username: "ada", password: "secret"})

for entry in client.entries("/public") (
  if !entry.isDir (
    log entry.name ++ " " ++ entry.size ++ " bytes"
  )
)

client.upload("report.pdf", "/public/report.pdf")
client.download("/public/notes.txt", "downloads/notes.txt")
client.close()
```

`ftp.connect` returns a client that is already logged in, or fails with a typed error:

```osl
import "std:ftp"

*ftp.FTP client = ftp.connect("ftp.example.com:2121", {username: "ada", password: "secret", tls: "explicit"}) catch (err) (
  log "can't connect: " ++ err.message
  return
)
log client.cwd()
client.close()
```

## API reference

### `ftp`

| Method | Returns | Notes |
| --- | --- | --- |
| `ftp.connect(address: string, options?)` | `result<*ftp.FTP, error>` | Connects to `"host"` or `"host:port"` (port 21 by default) and logs in. |

Options for `ftp.connect`:

| Key | Default | Notes |
| --- | --- | --- |
| `username` | `"anonymous"` | |
| `password` | `"anonymous"` | |
| `timeout` | `10000` | Milliseconds for connecting and for each reply. |
| `tls` | `"none"` | `"explicit"` upgrades with AUTH TLS; `"implicit"` connects with TLS from the start, usually on port 990. |

### `*ftp.FTP`

Relative remote paths start from the remote working directory.

| Method | Returns | Notes |
| --- | --- | --- |
| `client.entries(path: string)` | `result<Entry[], error>` | Lists the directory at `path` (`""` for the current directory). `.` and `..` are left out. |
| `client.stat(path: string)` | `result<Entry, error>` | Describes one remote file or directory. Needs server support for MLST. |
| `client.exists(path: string)` | `boolean` | Whether something exists at `path`. |
| `client.size(path: string)` | `result<int, error>` | Size of a remote file in bytes. |
| `client.upload(localPath: string, remotePath: string)` | `result<unit, error>` | Copies a local file to `remotePath`, replacing it. |
| `client.download(remotePath: string, localPath: string)` | `result<unit, error>` | Copies a remote file to `localPath`, creating missing local directories. A partly written file is removed. |
| `client.uploadDir(localDir: string, remoteDir: string)` | `result<unit, error>` | Copies a local directory tree, creating remote directories as needed. Fails with `IOError` for a symlink inside. |
| `client.downloadDir(remoteDir: string, localDir: string)` | `result<unit, error>` | Copies a remote directory tree. Fails with `IOError` when the server lists an unsafe name or a symlink. |
| `client.remove(path: string)` | `result<unit, error>` | Deletes a remote file. |
| `client.rename(from: string, to: string)` | `result<unit, error>` | Moves or renames a remote file or directory. |
| `client.mkdir(path: string)` | `result<unit, error>` | Creates a directory; its parent must exist. Most servers refuse with `PermissionError` when it already exists. |
| `client.removeDir(path: string, options?)` | `result<unit, error>` | Deletes a directory, which must be empty unless `{recursive: true}`. |
| `client.chdir(path: string)` | `result<unit, error>` | Changes the remote working directory. |
| `client.cwd()` | `result<string, error>` | The remote working directory, such as `"/uploads"`. |
| `client.setModTime(path: string, modTime: int)` | `result<unit, error>` | Sets a file's modification time in unix milliseconds (servers keep whole seconds). Needs server support for MFMT. |
| `client.isConnected()` | `boolean` | Whether the client is logged in and not closed. Does not contact the server. |
| `client.close()` | `result<unit, error>` | Logs out and closes the connection. Closing twice is a no-op. |

### `Entry`

| Key | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Base name. |
| `path` | `string` | Remote path. |
| `isDir` | `boolean` | |
| `isSymlink` | `boolean` | |
| `size` | `int` | Bytes. |
| `modTime` | `int?` | Unix milliseconds, `null` when the server doesn't say. |
| `target` | `string?` | Where a symlink points, `null` otherwise. |

### Errors

| Kind | When |
| --- | --- |
| `PermissionError` | The login is refused, the server refuses a write or directory change, or a local file can't be read or written. |
| `NetworkError`, `TimeoutError` | The server can't be reached or stops answering. |
| `NotFoundError` | A remote or local path doesn't exist. |
| `IOError` | A transfer breaks off, or a local path isn't a regular file or directory. |
| `UnsupportedError` | The server doesn't offer the requested TLS, MLST (`stat`) or MFMT (`setModTime`). |
| `ValueError` (thrown) | An address with line breaks or invalid options. |

## Deprecated

These still work for one release and draw an `OSL-DEPRECATED` warning.

| Deprecated | Use instead |
| --- | --- |
| `ftp.connect(host, port, user, password)` (four arguments, a client whose `isConnected()` is `false` on failure) | `ftp.connect(address, {username, password})` |
| `ftp.connectEx(...)`, `client.connectEx(...)` (returned `null` on failure) | `ftp.connect(address, {username, password})` |
| `client.login()` | `ftp.connect` logs in; use `client.isConnected()` |
| `client.disconnect()` | `client.close()` |
| `client.list(path)` | `client.entries(path)` |
| `client.delete(path)` | `client.remove(path)` |
| `client.createDirectory(path)` | `client.mkdir(path)` |
| `client.deleteDirectory(path)` | `client.removeDir(path)` |
| `client.changeDirectory(path)` | `client.chdir(path)` |
| `client.currentDirectory()` | `client.cwd()` |
| `client.isActive()`, `client.getStatistics()` | `client.isConnected()` |
| `client.getFileSize(path)` | `client.size(path)` |
| `client.uploadDirectory(localDir, remoteDir)`, `client.sync(localDir, remoteDir)` | `client.uploadDir(localDir, remoteDir)` |
| `client.downloadDirectory(remoteDir, localDir)` | `client.downloadDir(remoteDir, localDir)` |
| `client.setModificationTime(path, timestamp)` | `client.setModTime(path, unixMilliseconds)` |
| `client.setTimeout(seconds)` (now fails with `UnsupportedError`) | Pass `{timeout: ms}` to `ftp.connect` |
| `client.setMode(path, mode)` (fails with `UnsupportedError`) | None; FTP has no portable way to change permissions |
| `client.passiveMode(enabled)` | None; transfers always use passive mode |

The package-level functions of the old global client (`ftp.list`, `ftp.upload`, `ftp.download`,
`ftp.delete`, `ftp.rename`, `ftp.createDirectory`, `ftp.exists`, `ftp.login`, `ftp.disconnect` and
the rest) are deprecated too and do nothing: they return `false`, `""`, `0`, `[]` or `{}`. Call the
matching method on the client from `ftp.connect` instead.
