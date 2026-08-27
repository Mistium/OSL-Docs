# Editor tooling

`osl lsp` starts the bundled language server over standard input and output. Configure an editor's language-server client to run that command for `.osl` files.

The server provides project diagnostics, completion, hover details, signature help, definitions, references, rename, semantic highlighting, inferred-type hints, symbols, document links, folding, selection ranges, call hierarchy, import organization, and formatting.

It resolves diagnostics through the project entry file, including imported files. Open editor buffers are passed to the compiler as in-memory overlays and are not written to disk.

## Terminal checks

```bash
osl lsp check main.osl
```

The command exits with a failure status when diagnostics contain errors.

## Formatting

```bash
osl fmt main.osl
osl fmt src/
```

The editor and CLI use the same formatter. It preserves comments and literal contents and does not rewrite a file that fails syntax validation.
