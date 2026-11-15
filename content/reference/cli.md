---
description: Every osl command, its usage line and its flags, with an example of each, plus the environment variables the compiler reads.
---

# Command line

`osl` is one program that runs, builds, tests, formats and inspects OSL code. This page lists every command and flag in OSL 9.2.0. Run `osl` with no arguments (or `osl help`) for the short summary, and `osl version` for the installed version.

```sh
osl <command> [options]
```

There is no per-command `--help`: a command given the wrong arguments prints its usage line, and that is the line shown under each command below.

| Command | What it does |
| --- | --- |
| [`run`](#run) | Compile a program and run it |
| [`compile`](#compile) | Build a native executable |
| [`test`](#test) | Run `test` blocks and `.test.osl` files |
| [`opal`](#opal) | Manage projects and packages |
| [`fmt`](#fmt) | Format source files |
| [`fix`](#fix) | Apply automatic fixes |
| [`transpile`](#transpile) | Print the Go code a program compiles to |
| [`asm`](#asm) | Print the Go assembly a program compiles to |
| [`ast`](#ast) | Print the syntax tree as JSON |
| [`lsp`](#lsp) | Run the language server, or check a file |
| [`bench`](#bench) | Profile a program |
| [`package`](#package) | Print the source of a standard package |
| [`cache`](#cache) | Inspect or clear the build cache |
| [`setup`, `update`, `uninstall`, `version`](#installation-commands) | Install, update and remove OSL |

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | The command failed: a compile error, a failed test, a file that could not be read |
| `2` | Wrong arguments or an unknown command |

`osl run` is different: it returns the exit status of the program it ran. When the program is killed by a signal, `run` returns 128 plus the signal number, as a shell does.

## Options that work everywhere

| Flag | Effect |
| --- | --- |
| `--all-warnings` | Print every warning, including pedantic ones. Accepted by every command. |
| `-v`, `--verbose` | Show the time each compiler stage takes. Accepted by the build commands, `fix`, `lsp check` and `update`. |
| `--no-cache` | Skip the compiler's caches for this command (see [cache](#cache)). Accepted by `run`, `compile`, `transpile` and `asm`. |

Without `--all-warnings`, the build commands print at most 20 warnings and count the rest. See [Diagnostics](diagnostics.md) for what each warning means.

## run

Compiles a program to a temporary executable, runs it, and deletes it. The program's working directory is the folder of the source file.

```sh
osl run <file.osl> [--no-cache] [-v|--verbose] [-- program args]
```

| Flag | Effect |
| --- | --- |
| `--no-cache` | Rebuild everything instead of reusing cached results. |
| `-v`, `--verbose` | Print the timing of each stage. |
| `--` | Everything after it goes to the program, readable with `process.args()`. |

`test` blocks are left out of the program.

```sh
osl run hello.osl
osl run server.osl -- --port 8080
```

## compile

Builds a native executable you can copy to another machine of the same operating system and architecture. It needs no OSL installed to run.

```sh
osl compile <file.osl> [-o <output>] [--no-cache] [--no-write] [--optimise] [-v|--verbose] [-- program args]
```

| Flag | Effect |
| --- | --- |
| `-o <output>` | Name or path of the executable. Without it, the file name without `.osl`, next to the source. |
| `--no-write` | Check that the program compiles, and write nothing. Fast, and a good CI check. |
| `--optimise`, `--optimize` | Profile-guided build: runs the program under the [bench](#bench) harness, collects a CPU profile, then rebuilds so the Go toolchain can optimise what the program really does. |
| `--no-cache` | Rebuild everything. |
| `-v`, `--verbose` | Print the timing of each stage. |
| `--` | Arguments for the program. With `--optimise`, they are passed on every profiling run. |

```sh
osl compile todo.osl -o todo
osl compile todo.osl --no-write
osl compile server.osl --optimise -- --self-test
```

> [!note]
> Programs that use `std:raylib` or `std:window` link SDL2 from the system. A build fails without SDL2's development files, and the error says which package to install for your system.

## test

Finds and runs the tests under the paths you give (the current folder when you give none). It takes no flags. [Testing](testing.md) covers the test blocks, the output and the exit codes.

```sh
osl test [path ...]
```

```sh
osl test
osl test src/
osl test src/pricing.osl
```

## opal

Opal is the package manager. `osl opal <command>` and the `opal` program run the same code. [Opal](opal.md) lists every subcommand.

```sh
osl opal <command> [options]
```

```sh
osl opal init
osl opal add someone/some-package
```

## fmt

Rewrites source files in the canonical style: two-space indentation, tight call parentheses, a blank line between declarations. It leaves a file untouched when it does not parse, and never changes what a program means. A directory is searched recursively. It prints the path of every file it checked.

```sh
osl fmt <file-or-directory> [...]
```

```sh
osl fmt src/
osl fmt main.osl lib/
```

## fix

Applies the fixes the editor offers as quick fixes, and rewrites old syntax the compiler no longer accepts (old type declarations, reserved names used as variables, old lambdas and string escapes). It repeats until nothing more changes, up to 8 rounds, and prints the files it changed.

```sh
osl fix <file-or-directory> [...] [-v|--verbose]
```

| Flag | Effect |
| --- | --- |
| `-v`, `--verbose` | Log one line for every file checked. |

```sh
osl fix .
osl fix main.osl -v
```

## transpile

Prints the Go program that a file compiles to. Useful to see what the compiler does, or to report a bug.

```sh
osl transpile <file.osl> [--no-cache] [--explain-ownership] [-v|--verbose] [-o <file>]
```

| Flag | Effect |
| --- | --- |
| `-o <file>`, `--output`, `--out` | Write the Go source to a file instead of standard output. Runtime files the program needs are written next to it. |
| `--explain-ownership` | Print, on standard error, why the compiler copies or shares values. This turns the cache off for the run. |
| `--no-cache` | Skip the cache. |
| `-v`, `--verbose` | Print the timing of each stage. |

Only the functions and methods a program reaches are included, so the output stays small.

```sh
osl transpile main.osl
osl transpile main.osl -o out/main.go
```

## asm

Prints the Go assembly the program compiles to. Each instruction names the OSL line it came from, so you can see how a statement was lowered. The output is large: write it to a file.

```sh
osl asm <file.osl> [-o <file>] [--no-cache] [-v|--verbose]
```

| Flag | Effect |
| --- | --- |
| `-o <file>` | Write the assembly to a file instead of standard output. |
| `--no-cache` | Skip the cache. |
| `-v`, `--verbose` | Print the timing of each stage. |

```sh
osl asm hot.osl -o hot.s
```

## ast

Prints the parsed syntax tree of one file as JSON. It parses only: it does not type check.

```sh
osl ast <file.osl>
```

```sh
osl ast main.osl > main.ast.json
```

## lsp

Starts the language server on standard input and output, for editors. With `check`, it prints a file's diagnostics, and those of every file it imports, and exits with status 1 if any is an error. [Editor support](editor.md) has the details.

```sh
osl lsp [check <file> [-v|--verbose]]
```

| Form | Effect |
| --- | --- |
| `osl lsp` | Run the language server. |
| `osl lsp check <file>` | Print the diagnostics for a file, or `No diagnostics.` |
| `osl lsp check <file> -v` | The same, with per-file progress. |
| `osl lsp --version` | Print the version. |

```sh
osl lsp check src/main.osl
```

## bench

Runs a program repeatedly and reports where it spends time and memory. The program's own `log` output is discarded while it runs.

```sh
osl bench <file.osl> [--time 1s] [--runs N] [--top N] [--profile cpu.pprof] [-- program args]
```

| Flag | Default | Effect |
| --- | --- | --- |
| `--time <duration>`, `-t` | `1s` | How long to keep running the program, such as `500ms` or `5s`. |
| `--runs <n>`, `-n` | by time | Run exactly this many times instead. Use `1` for programs with side effects. |
| `--top <n>` | `15` | How many hot functions and lines to list. |
| `--profile <file>` | none | Also save the CPU profile, for Go's `pprof` tool. |
| `--` | | Arguments for the program, passed on every run. |

The report has four parts:

- **CPU self time** splits samples between generated OSL and runtime code, the Go runtime, reflection, and system calls.
- **Hot generated functions** lists functions by cumulative cost.
- **Hot OSL source lines** lists your own lines by self time.
- **Hot allocations** comes from one extra run with allocation profiling on, and lists allocation sites by bytes and object count.

```sh
osl bench sort.osl --time 3s --top 10
osl bench fetch.osl --runs 1 -- https://example.com
```

## package

Prints the source of a standard package, with the header that lists what it needs. With no name, it lists the packages. For a family such as `encodings`, it lists the members.

```sh
osl package [name]
```

```sh
osl package
osl package fs
osl package std:json
```

## cache

The compiler stores compiled programs, module snapshots and generated workspaces so the second build of anything is fast. The cache lives in the user cache folder, under `osl`.

```sh
osl cache status
osl cache clean
```

| Subcommand | Effect |
| --- | --- |
| `status` | Print the location, the schema version, the size and the number of artifacts of each kind. |
| `clean` | Delete the cache. The next build is slow while Go compiles OSL's runtime again. |

## Installation commands

```sh
osl setup
osl update [-v|--verbose]
osl uninstall
osl version
```

| Command | Effect |
| --- | --- |
| `setup` | Install the running binary as both `osl` and `opal`, and create Opal's command folder. This is the last step when building from source. |
| `update` | Download the installer and install the newest release. `-v` shows its progress. |
| `uninstall` | Remove the `osl` and `opal` binaries with `sudo rm`. Packages installed globally with Opal are kept. On Windows it tells you to delete them by hand. |
| `version` | Print the version, also available as `osl -v` and `osl --version`. |

## Environment variables

| Variable | Effect |
| --- | --- |
| `OSL_CACHE_DIR` | Use this folder for the cache instead of the user cache folder. |
| `OSL_CACHE_DISABLE=1` | Turn the persistent cache off. |
| `OSL_TEST_JOBS` | How many test files `osl test` runs at once. Default: the number of CPUs, at most 8. |
| `OSL_INSTALL_DIR` | The folder `osl setup` installs into. |
| `NO_COLOR` | Print diagnostics without colour. Colour is also off when `TERM=dumb`. |
| `OPAL_HOME` | Where Opal keeps globally installed packages and commands. Default `~/.opal`. See [Opal](opal.md). |
