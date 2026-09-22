# OSL command line

Run `osl` without arguments for the command summary.

## Build commands

```text
osl run <file.osl> [--no-cache] [-v|--verbose]
osl compile <file.osl> [-o <output>] [--no-cache] [--no-write] [-v|--verbose]
osl transpile <file.osl> [--no-cache] [-v|--verbose] [-o <file>]
```

`run` builds a temporary executable and runs it with the source directory as its working directory. It forwards the program's exit status. When the program is killed by a signal, `run` exits with 128 plus the signal number, as shells do.

`compile` writes a native executable. Without `-o`, it uses the entry filename without `.osl`. `--no-write` runs the compiler frontend but does not create a generated workspace or binary.

`transpile` stops after Go generation. It prints formatted Go to standard output unless `-o`
selects a file. Runtime panic metadata keeps path-qualified OSL locations so files with the same
basename remain distinct.

`--no-cache` disables compiler artifacts, module snapshots, generated workspaces, and native binary reuse for that command. Verbose mode keeps the timing for each compiler stage in the terminal.

## Source tools

```text
osl fmt <file-or-directory> [...]
osl fix <file-or-directory> [...]
osl ast <file.osl>
osl lsp [check <file>]
osl package <name>
```

`fmt` rewrites valid OSL source with canonical spacing and two-space indentation. When a path is a symlink, `fmt` and `fix` rewrite the file it points to and leave the link in place. Formatting never changes program meaning: a prefix operator written as `a -b` keeps its form, string and template literals are left untouched, and each closing bracket on a line such as `))` restores the indentation of the line that opened it. Validation errors report the line where the problem starts. It walks directory arguments recursively. Validation resolves locally imported type declarations relative to each file, so parameters such as `Entry[]` work when `Entry` is declared in an imported module.

`fix` applies the same automatic fixes the editor offers as one-click actions: redundant `.assert(...)` and `.<T>` assertions are removed and repeated top-level `import` lines are deleted. It takes the same file-or-directory arguments as `fmt` and prints only the files it changed. With `-v` it logs one line per checked file.

`ast` prints the parsed syntax tree as JSON. `compile`, `run`, and `transpile` can also consume that JSON representation.

`lsp` starts the language server over standard input and output. `lsp check` prints project diagnostics without an editor. It accepts `-v` for per-file logging.

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

Local imports are deduplicated by their resolved file paths. Matching relative names in separate directories, such as `db/attachments/storage.osl` and `attachments/storage.osl`, refer to separate modules.
