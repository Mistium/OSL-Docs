# OSL command line

Run `osl` without arguments for the command summary.

## Build commands

```text
osl run <file.osl> [--no-cache] [-v|--verbose] [-- program args]
osl compile <file.osl> [-o <output>] [--no-cache] [--no-write] [--optimise] [-v|--verbose] [-- program args]
osl transpile <file.osl> [--no-cache] [-v|--verbose] [-o <file>]
```

`run` builds a temporary executable and runs it with the source directory as its working directory. It forwards the program's exit status. When the program is killed by a signal, `run` exits with 128 plus the signal number, as shells do.

`compile` writes a native executable. Without `-o`, it uses the entry filename without `.osl`. `--no-write` runs the compiler frontend but does not create a generated workspace or binary.

`--optimise` builds a profile-guided binary. It runs the program under the `bench` harness first, collects a CPU profile, then rebuilds with Go's `-pgo`, so the toolchain can inline and lay out the code the program actually runs. The profile is collected from repeated runs, so arguments after `--` are passed to the program every time. The final binary is written to the same output path `compile` would use.

`transpile` stops after Go generation. It prints formatted Go to standard output unless `-o`
selects a file. Compile errors go to standard error with exit status 1, as with `run`. Runtime panic metadata keeps path-qualified OSL locations so files with the same
basename remain distinct.

Imported package sources and runtime helpers are trimmed to the functions and methods the program
reaches, and to the Go imports those declarations use, so a program that calls one method does not
carry an entire package's implementation.

For packages with platform-specific Go companions, `transpile -o` automatically writes those
files next to the selected output. Build the generated directory with Go so its platform file
selection includes the companions. Standard-output transpilation is useful for inspecting the
main generated source; `compile` and `run` handle all required sources automatically.

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
osl bench <file.osl> [--time 1s] [--runs N] [--top N] [--profile cpu.pprof] [-- program args]
```

`test` discovers inline `test (...)` blocks and `.test.osl` files. See [Testing](testing.md).

`bench` repeats a program and reports where it spends time and allocates:

- `CPU self time` splits samples across generated OSL/runtime code, the Go runtime, reflection, and syscalls and I/O. Time in a syscall is attributed to the syscall, not the OSL line that made the call.
- `Hot generated functions` lists generated and runtime functions by cumulative cost, so a helper such as `OSLtuiPkg.write` shows the cost its callers pay.
- `Hot OSL source lines` lists user source lines by self time.
- `Hot allocations` records one extra run with allocation profiling on and lists allocation sites in bytes and object counts, mapped to OSL lines where the compiler can attribute them.

Use `--runs 1` for code with external side effects. Arguments after `--` are passed to the program on every run. The program's own `log` output is discarded while benchmarking.

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
