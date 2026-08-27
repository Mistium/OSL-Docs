# Editor tooling

`osl lsp` runs the OSL language server over standard input and output. Configure an editor's language-server client to start this command for `.osl` files.

The server provides diagnostics, completion, hover text, signature help, definitions, type definitions, references, rename, semantic highlighting, inferred-type hints, document symbols, links, folding, selection ranges, call hierarchy, import organization, and formatting.

It keeps one project-aware compiler engine. Unsaved editor buffers become in-memory overlays, so diagnostics can resolve imports without writing those buffers to disk.

## Check from a terminal

```bash
osl lsp check src/main.osl
```

This runs the same project diagnostic path and returns a failure status for errors.

## Formatting

The editor and `osl fmt` use the same formatter:

```bash
osl fmt src/
```

The formatter preserves comments and string contents. It leaves a file unchanged when parsing fails.
