/* An in-memory filesystem for Go programs built for js/wasm. Go's syscall
   package calls Node's callback fs API through globalThis.fs (see
   syscall/fs_js.go in the Go source), so this implements that API, plus the
   process and path globals it also reads, over a Map of paths.

     const memfs = createMemFS({ stdin, stdout(bytes), stderr(bytes) });
     memfs.install();               // sets globalThis.fs, process and path
     memfs.writeFile("/main.go", bytes);
     memfs.readFile("/main.a");

   File descriptors 0, 1 and 2 are stdin (a Uint8Array) and the stdout and
   stderr callbacks. Everything else lives under "/". */

(() => {
  const S_IFDIR = 0o040000;
  const S_IFREG = 0o100000;
  const constants = {
    O_RDONLY: 0,
    O_WRONLY: 1,
    O_RDWR: 2,
    O_CREAT: 0o100,
    O_EXCL: 0o200,
    O_TRUNC: 0o1000,
    O_APPEND: 0o2000,
    O_DIRECTORY: 0o200000,
  };

  function fail(code, path) {
    const error = new Error(`${code}: ${path ?? ""}`);
    error.code = code;
    return error;
  }

  function normalize(path, cwd) {
    const parts = [];
    for (const part of (path.startsWith("/") ? path : `${cwd}/${path}`).split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") parts.pop();
      else parts.push(part);
    }
    return `/${parts.join("/")}`;
  }

  const parent = (path) => path.slice(0, path.lastIndexOf("/")) || "/";
  const base = (path) => path.slice(path.lastIndexOf("/") + 1);

  self.createMemFS = function createMemFS({ stdin = new Uint8Array(), stdout, stderr } = {}) {
    const decoder = new TextDecoder();
    let cwd = "/";
    let inode = 1;
    let nextFd = 3;
    let stdinPos = 0;
    const now = () => Date.now();
    const nodes = new Map();
    const fds = new Map();

    const makeNode = (dir, mode) => ({
      dir,
      mode: (dir ? S_IFDIR : S_IFREG) | (mode & 0o7777),
      data: new Uint8Array(0),
      size: 0,
      ino: inode++,
      mtime: now(),
    });
    nodes.set("/", makeNode(true, 0o755));

    const resolve = (path) => normalize(String(path), cwd);
    const lookup = (path) => {
      const node = nodes.get(path);
      if (!node) throw fail("ENOENT", path);
      return node;
    };
    const requireParent = (path) => {
      const dir = nodes.get(parent(path));
      if (!dir) throw fail("ENOENT", path);
      if (!dir.dir) throw fail("ENOTDIR", path);
    };
    const children = (path) => {
      const prefix = path === "/" ? "/" : `${path}/`;
      const names = [];
      for (const key of nodes.keys()) {
        if (key !== path && key.startsWith(prefix) && !key.slice(prefix.length).includes("/")) {
          names.push(key.slice(prefix.length));
        }
      }
      return names.sort();
    };
    // Sets a file's size. Bytes past the old end read as zeros, as on disk,
    // even where the buffer still holds what was there before a shrink.
    const resize = (node, size) => {
      if (size > node.data.length) {
        const next = new Uint8Array(Math.max(size, node.data.length * 2, 64));
        next.set(node.data.subarray(0, node.size));
        node.data = next;
      } else if (size > node.size) {
        node.data.fill(0, node.size, size);
      }
      node.size = size;
      node.mtime = now();
    };
    const stat = (node) => ({
      dev: 1,
      ino: node.ino,
      mode: node.mode,
      nlink: 1,
      uid: 0,
      gid: 0,
      rdev: 0,
      size: node.dir ? 4096 : node.size,
      blksize: 4096,
      blocks: Math.ceil(node.size / 512),
      atimeMs: node.mtime,
      mtimeMs: node.mtime,
      ctimeMs: node.mtime,
      isDirectory: () => node.dir,
    });
    const mkdirs = (path) => {
      let at = "";
      for (const part of path.split("/").filter(Boolean)) {
        at += `/${part}`;
        if (!nodes.has(at)) nodes.set(at, makeNode(true, 0o755));
      }
    };

    // Runs a synchronous body and reports to a Node-style callback.
    const call = (callback, body) => {
      let result;
      try {
        result = body();
      } catch (error) {
        callback(error);
        return;
      }
      callback(null, result);
    };

    const writeOut = (fd, bytes) => {
      const copy = bytes.slice();
      if (fd === 1) stdout?.(copy);
      else stderr?.(copy);
      return bytes.length;
    };

    const readAt = (node, buffer, offset, length, position) => {
      const n = Math.max(0, Math.min(length, node.size - position));
      buffer.set(node.data.subarray(position, position + n), offset);
      return n;
    };
    const writeAt = (node, buffer, offset, length, position) => {
      if (position + length > node.size) resize(node, position + length);
      node.data.set(buffer.subarray(offset, offset + length), position);
      node.mtime = now();
      return length;
    };
    // The open file behind a descriptor, if it was opened for reading or
    // for writing as asked.
    const ACCESS = 3;
    const opened = (fd, writing) => {
      const file = fds.get(fd);
      if (!file) throw fail("EBADF");
      const access = file.flags & ACCESS;
      const allowed = writing ? access !== constants.O_RDONLY : access !== constants.O_WRONLY;
      if (!allowed) throw fail("EBADF", file.path);
      return file;
    };

    const fs = {
      constants,
      writeSync(fd, buffer) {
        if (fd === 1 || fd === 2) return writeOut(fd, buffer);
        const file = opened(fd, true);
        if (file.flags & constants.O_APPEND) file.pos = file.node.size;
        const n = writeAt(file.node, buffer, 0, buffer.length, file.pos);
        file.pos += n;
        return n;
      },
      write(fd, buffer, offset, length, position, callback) {
        call(callback, () => {
          if (fd === 1 || fd === 2) return writeOut(fd, buffer.subarray(offset, offset + length));
          const file = opened(fd, true);
          if (file.flags & constants.O_APPEND) position = file.node.size;
          const at = position ?? file.pos;
          const n = writeAt(file.node, buffer, offset, length, at);
          if (position === null || position === undefined) file.pos = at + n;
          return n;
        });
      },
      read(fd, buffer, offset, length, position, callback) {
        call(callback, () => {
          if (fd === 0) {
            const n = Math.min(length, stdin.length - stdinPos);
            buffer.set(stdin.subarray(stdinPos, stdinPos + n), offset);
            stdinPos += n;
            return n;
          }
          const file = opened(fd, false);
          if (file.node.dir) throw fail("EISDIR", file.path);
          const at = position ?? file.pos;
          const n = readAt(file.node, buffer, offset, length, at);
          if (position === null || position === undefined) file.pos = at + n;
          return n;
        });
      },
      open(path, flags, mode, callback) {
        call(callback, () => {
          path = resolve(path);
          let node = nodes.get(path);
          const exclusive = flags & constants.O_CREAT && flags & constants.O_EXCL;
          if (node && exclusive) throw fail("EEXIST", path);
          if (!node) {
            requireParent(path);
            if (!(flags & constants.O_CREAT)) throw fail("ENOENT", path);
            node = makeNode(false, mode);
            nodes.set(path, node);
          }
          if (flags & constants.O_DIRECTORY && !node.dir) throw fail("ENOTDIR", path);
          const writing = flags & (constants.O_WRONLY | constants.O_RDWR);
          if (node.dir && writing) throw fail("EISDIR", path);
          if (flags & constants.O_TRUNC && !node.dir) resize(node, 0);
          const fd = nextFd++;
          fds.set(fd, { node, path, flags, pos: 0 });
          return fd;
        });
      },
      close(fd, callback) {
        call(callback, () => {
          if (fd > 2 && !fds.delete(fd)) throw fail("EBADF");
        });
      },
      fstat(fd, callback) {
        call(callback, () => {
          if (fd <= 2) return stat(makeNode(false, 0o600));
          const file = fds.get(fd);
          if (!file) throw fail("EBADF");
          return stat(file.node);
        });
      },
      stat(path, callback) {
        call(callback, () => stat(lookup(resolve(path))));
      },
      lstat(path, callback) {
        call(callback, () => stat(lookup(resolve(path))));
      },
      mkdir(path, perm, callback) {
        call(callback, () => {
          path = resolve(path);
          if (nodes.has(path)) throw fail("EEXIST", path);
          requireParent(path);
          nodes.set(path, makeNode(true, perm));
        });
      },
      readdir(path, callback) {
        call(callback, () => {
          path = resolve(path);
          if (!lookup(path).dir) throw fail("ENOTDIR", path);
          return children(path);
        });
      },
      rmdir(path, callback) {
        call(callback, () => {
          path = resolve(path);
          if (!lookup(path).dir) throw fail("ENOTDIR", path);
          if (children(path).length) throw fail("ENOTEMPTY", path);
          if (path === "/") throw fail("EBUSY", path);
          nodes.delete(path);
        });
      },
      unlink(path, callback) {
        call(callback, () => {
          path = resolve(path);
          if (lookup(path).dir) throw fail("EISDIR", path);
          nodes.delete(path);
        });
      },
      rename(from, to, callback) {
        call(callback, () => {
          from = resolve(from);
          to = resolve(to);
          const node = lookup(from);
          requireParent(to);
          if (from === to) return;
          if (from === "/") throw fail("EBUSY", from);
          if (to.startsWith(`${from}/`)) throw fail("EINVAL", to);
          const target = nodes.get(to);
          if (target && node.dir && !target.dir) throw fail("ENOTDIR", to);
          if (target && !node.dir && target.dir) throw fail("EISDIR", to);
          if (target?.dir && children(to).length) throw fail("ENOTEMPTY", to);
          const moves = [[from, to]];
          if (node.dir) {
            for (const key of nodes.keys()) {
              if (key.startsWith(`${from}/`)) moves.push([key, to + key.slice(from.length)]);
            }
          }
          const moved = moves.map(([a, b]) => [b, nodes.get(a)]);
          for (const [a] of moves) nodes.delete(a);
          for (const [b, n] of moved) nodes.set(b, n);
        });
      },
      truncate(path, length, callback) {
        call(callback, () => {
          const node = lookup(resolve(path));
          if (node.dir) throw fail("EISDIR", path);
          resize(node, length);
        });
      },
      ftruncate(fd, length, callback) {
        call(callback, () => {
          resize(opened(fd, true).node, length);
        });
      },
      chmod(path, mode, callback) {
        call(callback, () => {
          const node = lookup(resolve(path));
          node.mode = (node.mode & ~0o7777) | (mode & 0o7777);
        });
      },
      fchmod(fd, mode, callback) {
        call(callback, () => {
          const file = fds.get(fd);
          if (!file) throw fail("EBADF");
          file.node.mode = (file.node.mode & ~0o7777) | (mode & 0o7777);
        });
      },
      utimes(path, atime, mtime, callback) {
        call(callback, () => {
          lookup(resolve(path)).mtime = mtime * 1000;
        });
      },
      fsync(fd, callback) {
        callback(null);
      },
      chown(path, uid, gid, callback) {
        callback(null);
      },
      fchown(fd, uid, gid, callback) {
        callback(null);
      },
      lchown(path, uid, gid, callback) {
        callback(null);
      },
      link(path, link, callback) {
        callback(fail("ENOSYS", link));
      },
      symlink(path, link, callback) {
        callback(fail("ENOSYS", link));
      },
      readlink(path, callback) {
        callback(fail("EINVAL", path));
      },
    };

    const process = {
      pid: 1,
      ppid: 0,
      getuid: () => 0,
      getgid: () => 0,
      geteuid: () => 0,
      getegid: () => 0,
      getgroups: () => [0],
      umask: () => 0o022,
      cwd: () => cwd,
      chdir(path) {
        path = resolve(path);
        if (!lookup(path).dir) throw fail("ENOTDIR", path);
        cwd = path;
      },
    };

    const path = { resolve: (...segments) => segments.reduce((at, s) => normalize(s, at), cwd) };

    return {
      fs,
      process,
      path,
      decoder,
      install() {
        globalThis.fs = fs;
        globalThis.process = process;
        globalThis.path = path;
      },
      mkdir: (dir) => mkdirs(normalize(dir, "/")),
      writeFile(file, bytes) {
        file = normalize(file, "/");
        mkdirs(parent(file));
        const node = makeNode(false, 0o644);
        // A copy, so a program writing to the file can't change the caller's.
        node.data = bytes.slice();
        node.size = bytes.length;
        nodes.set(file, node);
      },
      readFile(file) {
        const node = nodes.get(normalize(file, "/"));
        return node && !node.dir ? node.data.slice(0, node.size) : null;
      },
      chdir: (dir) => process.chdir(dir),
      name: base,
    };
  };
})();
