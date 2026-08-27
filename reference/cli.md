# OSL command line

Run `osl` without arguments for the command summary.

## Build commands

```text
osl run <file.osl> [--no-cache] [-v|--verbose]
osl compile <file.osl> [-o <output>] [--no-cache] [--no-write] [-v|--verbose]
osl transpile <file.osl> [--no-cache] [-v|--verbose] [-o <file>]
```

`run` builds a temporary executable and runs it with the source directory as its working directory. It forwards the program's exit status.

`compile` writes a native executable. Without `-o`, it uses the entry filename without `.osl`. `--no-write` runs the compiler frontend but does not create a generated workspace or binary.

`transpile` stops after Go generation. It prints Go to standard output unless `-o` selects a file.

`--no-cache` disables compiler artifacts, module snapshots, generated workspaces, and native binary reuse for that command. Verbose mode keeps the timing for each compiler stage in the terminal.

## Source tools

```text
osl fmt <file-or-directory> [...]
osl ast <file.osl>
osl lsp [check <file>]
osl package <name>
```

`fmt` rewrites valid OSL source with canonical spacing and two-space indentation. It walks directory arguments recursively.

`ast` prints the parsed syntax tree as JSON. `compile`, `run`, and `transpile` can also consume that JSON representation.

`lsp` starts the language server over standard input and output. `lsp check` prints project diagnostics without an editor.

`package` prints the embedded source for a standard package.

## Tests and profiling

```text
osl test [path ...]
osl bench <file.osl> [--time 1s] [--runs N] [--top N] [--profile cpu.pprof]
```

`test` discovers `.test.osl` files. See [Testing](testing.md).

`bench` repeats a program, records a CPU profile, and reports time against OSL source lines. Use `--runs 1` for code with external side effects.

## Cache

```text
osl cache status
osl cache clean
```

The cache lives in the platform user-cache directory under `osl`. `OSL_CACHE_DIR` chooses another directory. `OSL_CACHE_DISABLE=1` disables persistent caching.

## Installation

```text
osl setup
osl update [-v|--verbose]
osl uninstall
osl version
```

`setup` installs both `osl` and `opal`.
