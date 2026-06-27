# ftp

> FTP file transfer protocol

```javascript
import "osl/ftp"
```

## Methods

- `ftp.connect(host, port, user, password)` → `FTP`
- `ftp.connectEx(host, port, user, password)` → `FTP`
- `ftp.login()` → `boolean`
- `ftp.disconnect()` → `boolean`
- `ftp.list(path)` → `array`
- `ftp.upload(localFile, remotePath)` → `boolean`
- `ftp.download(remotePath, localPath)` → `boolean`
- `ftp.delete(remotePath)` → `boolean`
- `ftp.rename(oldPath, newPath)` → `boolean`
- `ftp.createDirectory(path)` → `boolean`
- `ftp.deleteDirectory(path)` → `boolean`
- `ftp.changeDirectory(path)` → `boolean`
- `ftp.currentDirectory()` → `string`
- `ftp.isActive()` → `boolean`
- `ftp.setTimeout(seconds)` → `boolean`
- `ftp.getFileSize(path)` → `number`
- `ftp.exists(path)` → `boolean`
- `ftp.uploadDirectory(localDir, remoteDir)` → `boolean`
- `ftp.downloadDirectory(remoteDir, localDir)` → `boolean`
- `ftp.setMode(path, mode)` → `boolean`
- `ftp.setModificationTime(path, timestamp)` → `boolean`
- `ftp.passiveMode(enabled)` → `boolean`
- `ftp.sync(localDir, remoteDir)` → `boolean`
- `ftp.getStatistics()` → `object`
