# Compiler CLI

Run `osl` without arguments to print the command summary.

## Build and run

| Command | Result |
| --- | --- |
| `osl run <file>` | Builds the program and runs the resulting executable. |
| `osl compile <file> [-o <path>]` | Builds a native executable. |
| `osl transpile <file> [-o <path>]` | Writes generated Go without building it. |
| `osl test [path ...]` | Finds and runs OSL test files. |
| `osl bench <file>` | Benchmarks an OSL program. |

Native commands cache compiler output, generated workspaces, module state, and binaries. Add `--no-cache` when measuring an uncached build or investigating a cache problem. Add `-v` or `--verbose` to retain compiler-stage timings in the terminal.

## Inspect source and generated output

| Command | Result |
| --- | --- |
| `osl ast <file>` | Prints the parsed syntax tree as JSON. |
| `osl transpile <file>` | Prints generated Go. |
| `osl package` | Lists embedded standard packages. |
| `osl package <name>` | Prints an embedded package's source. |

`compile`, `run`, and `transpile` also accept a syntax-tree JSON file produced by `osl ast`.

## Format and edit

`osl fmt <path ...>` formats `.osl` files in place. Directory arguments are recursive. The formatter validates the file before writing and leaves invalid source unchanged.

`osl lsp` starts the language server over standard input and output. `osl lsp check <file>` prints its project-aware diagnostics without an editor.

## Cache commands

```bash
osl cache status
osl cache clean
```

The cache lives in the platform user-cache directory under `osl`. Set `OSL_CACHE_DIR` to choose another location or `OSL_CACHE_DISABLE=1` to disable persistent caches.

## Installation commands

| Command | Result |
| --- | --- |
| `osl setup` | Installs the `osl` and `opal` commands. |
| `osl update [-v]` | Fetches, builds, and installs the latest source. |
| `osl uninstall` | Removes installed commands. |
| `osl version` | Prints the compiler version. |

`osl opal <command>` and `opal <command>` call the same project and package manager. See [Opal projects](../projects/opal.md).
