---
description: Install the compiler, check it works, and set up your editor. About two minutes.
---

# Install OSL

OSL compiles your code to Go, and Go turns it into a native executable. So you need two things on the machine where you build: OSL and a recent [Go toolchain](https://go.dev/dl/) (1.25 or newer). The programs you build need neither: they are single files that run on their own.

:::steps
### Install Go

Download it from [go.dev/dl](https://go.dev/dl/), or use your package manager:

```bash
brew install go          # macOS
sudo pacman -S go        # Arch
sudo apt install golang  # Debian and Ubuntu
```

Check it with `go version`.

### Install OSL

One line installs both `osl`, the compiler, and `opal`, the project and package manager:

::install

### Check it

```bash
osl version
opal version
```

Both print a version number. If your shell can't find them, open a new terminal so it picks up the updated `PATH`.

### Run something

Make a file called `hello.osl`:

```osl
log "Hello from OSL"
```

```output
Hello from OSL
```

Then run it:

```bash
osl run hello.osl
```

The first build takes a few seconds while Go compiles OSL's runtime. After that, builds come from a cache and take a fraction of a second.
:::

## Set up your editor

`osl lsp` is a language server: diagnostics as you type, completion, hover types, go to definition, rename, formatting and quick fixes. Any editor that speaks the Language Server Protocol can use it. Point the editor's LSP client at the command `osl lsp` for files ending in `.osl`.

For Neovim, for example:

```lua
vim.lsp.config("osl", { cmd = { "osl", "lsp" }, filetypes = { "osl" }, root_markers = { "opal.json", ".git" } })
vim.lsp.enable("osl")
vim.filetype.add({ extension = { osl = "osl" } })
```

You can also check a whole project from the terminal, which is what the editor sees:

```bash
osl lsp check main.osl
```

## Build from source

The compiler is open source. To build the newest version yourself:

```bash
git clone https://git.rotur.dev/osl/.go osl
cd osl
go build -o osl .
./osl setup        # installs it as the osl and opal commands
```

## Keep it up to date

```bash
osl update
```

`osl uninstall` removes it again.

## Next

:::cards
- [Your first program](learn/first-program.md): write, run and compile a program, line by line.
- [The playground](/playground): try OSL in your browser before you install anything.
:::
