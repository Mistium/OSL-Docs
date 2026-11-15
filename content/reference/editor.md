---
description: Editor support for OSL: the language server (osl lsp), checking from a terminal, the formatter, quick fixes, silencing warnings and syntax highlighting.
---

# Editor support

OSL's editor support is one program: `osl lsp`, a language server that speaks the Language Server Protocol over standard input and output. Any editor with an LSP client can use it. Alongside it, `osl fmt` formats files, `osl fix` applies the editor's quick fixes from a terminal, and `osl lsp check` prints what the editor would show. All of them use the same compiler that builds your programs, so the editor and `osl run` never disagree.

## Connect an editor

Point your editor's LSP client at the command `osl lsp` for files ending in `.osl`. The server takes no arguments and needs no configuration. Use the folder that holds `opal.json` (or the Git root) as the project root.

For Neovim:

```lua
vim.lsp.config("osl", { cmd = { "osl", "lsp" }, filetypes = { "osl" }, root_markers = { "opal.json", ".git" } })
vim.lsp.enable("osl")
vim.filetype.add({ extension = { osl = "osl" } })
```

For any other editor, the settings are the same three facts:

| Setting | Value |
| --- | --- |
| Command | `osl lsp` |
| Transport | Standard input and output |
| File type | `.osl` files, language id `osl` |

> [!note]
> OSL does not ship an editor extension. Editors that need one for LSP, such as VS Code, need a generic LSP-client extension configured with the command above.

The server announces itself as `OSL Language Server`. It watches `**/*.osl` and `**/opal.json`, and rechecks open files when `opal.json` changes, so lint settings take effect on save. Set `OSL_LSP_DEBUG=1` to make it log what it is doing to standard error.

## What the server provides

| Feature | What you get |
| --- | --- |
| Diagnostics | Errors and warnings as you type, including those in imported files. See [Diagnostics](diagnostics.md). |
| Completion | Variables, functions, types, package members, struct and class fields, methods on the value before the dot, import paths. Triggered by `.`, `"` and `/`. |
| Hover | The type of a name, and the documentation of a package function or method. |
| Signature help | Parameter names and types while you type a call. Triggered by `(` and `,`. |
| Go to definition and type definition | Jumps to where a name, type or imported module is declared. |
| References and rename | Every use of a name across the project. Names with non-ASCII letters, such as `año`, work. |
| Document highlights | Highlights the other uses of the name under the cursor. |
| Symbols | An outline of the file, and a search across the workspace. |
| Call hierarchy | Who calls a function, and what it calls. |
| Inlay hints | Inferred types written next to `auto` variables and similar. |
| Folding and selection ranges | Fold blocks, and grow the selection to the enclosing expression. |
| Document links | Imports become links to the files they name. |
| Semantic highlighting | Colours from the compiler's own understanding of each name. |
| Formatting | The same formatter as `osl fmt`. |
| Quick fixes | See [Quick fixes](#quick-fixes). |
| Organize imports | Removes repeated top-level `import` lines. |

Unsaved buffers are used in place of the files on disk, so diagnostics and completion see imports of code you have not saved yet. Positions follow the protocol's rule of counting UTF-16 code units.

### Semantic token types

The semantic highlighting legend has these types, in this order: `namespace`, `type`, `class`, `enum`, `interface`, `struct`, `typeParameter`, `parameter`, `variable`, `property`, `enumMember`, `event`, `function`, `method`, `macro`, `keyword`, `modifier`, `comment`, `string`, `number`, `regexp`, `operator`. There are no token modifiers.

## Check from a terminal

`osl lsp check` runs the same project check as the editor and prints the diagnostics for a file and every OSL file it reaches. It exits with 1 if any is an error, so it works in CI and in a pre-commit hook.

```sh
osl lsp check src/main.osl
```

```text
src/main.osl:3:7: osl: UnusedVariableWarning: Variable 'z' is never used. Name it _, or start its name with _, to ignore it.

   |
 3 |   int z = 3
   |       ^
```

Each line has the file, line and column, then the diagnostic's kind and message, then the source with the problem underlined. With nothing to report it prints `No diagnostics.`. Add `-v` for progress per file. `osl lsp check` and `osl fix` report every warning, where `osl run` and `osl compile` print the first 20 and count the rest.

## Formatting

`osl fmt` and the editor's format command are one formatter:

```sh
osl fmt src/
```

What it does:

- Indents with two spaces and puts call and grouping parentheses tight: `foo( a )` becomes `foo(a)`.
- Puts a space between a block opener and its parenthesis: `if ready(` becomes `if ready (`.
- Puts a blank line before `def`, `class`, `type`, `struct` and `enum` declarations, and after a leading block of `import` lines.
- Expands inline blocks such as `if ok ( return value )` onto their own lines.
- Keeps comments and the contents of strings and templates as they are, and never changes what a program means.

If a file does not parse, `osl fmt` reports the line where the problem starts, leaves the file alone and exits with 1. When you give it a symlink, it rewrites the file the link points to.

## Quick fixes

Some diagnostics carry an exact replacement. The editor offers it as a quick fix (a "Replace with" action), and `osl fix` applies all of them from a terminal:

```sh
osl fix src/
```

Fixes include removing a redundant `.<T>` assertion, replacing `!(a == b)` with `a != b`, replacing `if r then true else false` with `r`, adding `void` in front of a value that does nothing, and removing a repeated `import`. A fix is applied only when the file still contains the exact text the compiler reported, so a stale diagnostic never rewrites code.

`osl fix` also rewrites syntax that old versions of OSL accepted and the compiler no longer does: old type declarations, reserved words used as variable names, old lambda forms and string escapes. It prints each file it changed. See [Command line](cli.md#fix).

## Silencing a warning

A comment on its own line silences warnings of one code on the line below it:

```osl norun
// osl-disable-next-line OSL-UNUSED-VARIABLE
int scratch = 3
```

`// osl-disable-file OSL-UNUSED-VARIABLE` anywhere in a file silences a code for the whole file. Without a code, the comment silences every warning. A code list can hold several codes separated by commas or spaces, and `all` matches every code. The comment has to be on a line by itself, and only the line directly after it is covered. Errors cannot be silenced. To change how a whole project treats a warning, use the [lint settings in `opal.json`](opal.md#lint-settings).

## Syntax highlighting

The language server's semantic highlighting is the accurate source of colour, because it knows whether a name is a type, a function or a variable. Editors that support semantic tokens get it with no extra setup. OSL does not bundle a TextMate or Tree-sitter grammar for editors without LSP. Those editors need a grammar of your own or a community one; `osl ast file.osl` prints the exact tokens and structure of a file if you are writing one.
