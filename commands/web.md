# WebAssembly builds

`osl web` compiles an OSL program for Go's `js/wasm` target and creates a small browser project.

```bash
osl web main.osl
osl web main.osl -o dist --name game
```

The default output directory is `<source-name>-web`. A complete project contains:

- `app.wasm`, or the name selected with `--name`
- `wasm_exec.js` from the installed Go toolchain
- `index.html`, which loads and starts the module

Serve the directory over HTTP rather than opening `index.html` directly:

```bash
cd main-web
python3 -m http.server 8080
```

Use `--wasm-only` when another application supplies the JavaScript loader and HTML. `--no-cache`
disables compiler caching, and `-v` shows build details.

Only packages compatible with `GOOS=js` and `GOARCH=wasm` can be used. `osl/box2d` is supported.
`osl/raylib` is a native desktop package and produces a clear web-build error.
