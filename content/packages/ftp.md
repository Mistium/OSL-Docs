---
description: Connect to an FTP server to list, upload, download, rename and delete remote files and folders.
package: ftp
---

# ftp

FTP is the old protocol for moving files to and from a server, still common on shared hosting and in data feeds. `std:ftp` connects, logs in, and gives you a remote file manager. For servers you control, prefer [ssh](ssh.md) with SFTP.

## Connect

`ftp.connect(address, options)` opens a connection and logs in. It returns a result. Without a `username` it logs in as `anonymous`. Close the connection when you are done:

```osl norun
import "std:ftp"
import "std:env"

auto conn = ftp.connect("ftp.example.com", {
  username: "deploy",
  password: env.get("FTP_PASSWORD")
}).unwrap()

log conn.cwd().unwrap()
conn.close().unwrap()
```

TLS is on by default (`tls: "auto"` switches to it when the server offers). `"starttls"` requires it, `"implicit"` speaks it from the first byte, and `"none"` never uses it.

## Your password is never sent in the clear

A login to another machine without TLS is refused before the password leaves your program. You can see this safely, because it fails before any data is sent:

```osl
import "std:ftp"

auto attempt = ftp.connect("203.0.113.1:21", {
  username: "u",
  password: "p",
  tls: "none",
  timeout: 500
})
log attempt.unwrapErr().kind
log attempt.unwrapErr().message
```

```output
UnsupportedError
ftp.connect: 203.0.113.1:21 has no TLS, so the password would be sent unencrypted; use a server that offers TLS, or tls "implicit"
```

Loopback addresses are exempt, and so is the anonymous login. Change `tls: "none"` to `tls: "auto"` and run again: now it tries to connect, and fails with a `NetworkError` or `TimeoutError` because nothing is there.

## Connection errors

A refused or unreachable server is a `NetworkError`, and a slow one a `TimeoutError`:

```osl
import "std:ftp"

auto attempt = ftp.connect("127.0.0.1:1", {timeout: 1000})
log attempt.isErr()
log attempt.unwrapErr().kind
```

```output
true
NetworkError
```

A refused login is a `PermissionError`.

## Look around

`entries(path)` lists a folder, `stat` describes one item, and `exists`, `size` and `cwd` answer smaller questions. Paths are the server's:

```osl norun
import "std:ftp"

auto conn = ftp.connect("ftp.example.com", {username: "deploy", password: "..."}).unwrap()

for entry in conn.entries("/uploads").unwrap() (
  string kind = if entry.isDir then "dir " else "file"
  log kind entry.name entry.size
)
log conn.exists("/uploads/report.csv")
log conn.size("/uploads/report.csv").unwrapOr(-1)
conn.close().unwrap()
```

## Upload and download

`upload(local, remote)` replaces the remote file, and `download(remote, local)` writes a local one. `uploadDir` and `downloadDir` copy a whole folder:

```osl norun
import "std:ftp"
import "std:fs"

fs.writeFile("report.csv", "a,b\n1,2\n").unwrap()

auto conn = ftp.connect("ftp.example.com", {username: "deploy", password: "..."}).unwrap()
conn.upload("report.csv", "/uploads/report.csv").unwrap()
conn.download("/uploads/report.csv", "copy.csv").unwrap()
log fs.readFile("copy.csv").unwrap()
conn.close().unwrap()
```

Missing remote files fail with a `NotFoundError`, so check the result and not just the call.

## Rename, make folders, delete

```osl norun
import "std:ftp"

auto conn = ftp.connect("ftp.example.com", {username: "deploy", password: "..."}).unwrap()

conn.mkdir("/archive").unwrap()
conn.rename("/uploads/report.csv", "/archive/report.csv").unwrap()
conn.remove("/archive/old.csv").unwrap()
conn.removeDir("/empty-folder").unwrap()
conn.close().unwrap()
```

`mkdir` needs the parent to exist, and `removeDir` needs the folder to be empty.

:::quiz
You connect to a remote host with a username, a password and `tls: "none"`. What happens?

- [ ] It logs in and sends the password as plain text.
- [x] It fails with an `UnsupportedError` before the password is sent.
- [ ] It silently turns TLS on.

`std:ftp` refuses to send a password unencrypted to any machine but your own.
:::

:::exercise title="Handle a dead server"
Try to connect to `127.0.0.1:1` with a 500 ms timeout. Print `"offline"` when it fails and the error kind after it.

```osl
import "std:ftp"

log "?"
```

```output
offline NetworkError
```

> [!hint]
> `ftp.connect("127.0.0.1:1", {timeout: 500})` returns a result.

> [!hint]
> `switch` with `case ok(conn)` and `case err(e)`.

```osl solution
import "std:ftp"

switch ftp.connect("127.0.0.1:1", {timeout: 500}) (
  case ok(conn)
    log "online"
    conn.close().unwrap()
  case err(e)
    log "offline" e.kind
)
```

```output
offline NetworkError
```
:::

## API reference

::api
