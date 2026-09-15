# Editor tooling

`osl lsp` runs the OSL language server over standard input and output. Configure an editor's language-server client to start this command for `.osl` files.

The server provides diagnostics, completion, hover text, signature help, definitions, type definitions, references, rename, semantic highlighting, inferred-type hints, document symbols, links, folding, selection ranges, call hierarchy, import organization, quick fixes, and formatting.

It keeps one project-aware compiler engine. Unsaved editor buffers become in-memory overlays, so diagnostics can resolve imports without writing those buffers to disk.

## Check from a terminal

```bash
osl lsp check src/main.osl
```

This runs the same project diagnostic path, reports diagnostics from every reachable imported OSL file, and returns a failure status for errors.

Self-comparison warnings flag expressions such as `value != value`. They do not prevent compilation. NaN is an exception to ordinary self-equality: it is unequal to itself. Use `math.isNan(value)` when that is the intended check.

Boundary warnings flag explicit `any` or `unknown` contracts that hide where unknown input should be decoded: loose function parameters and returns (`OSL-LOOSE-PARAM`, `OSL-LOOSE-RETURN`), loose type aliases (`OSL-LOOSE-ALIAS`), and dictionaries with loose values (`OSL-LOOSE-DICTIONARY`). Related warnings flag a known literal widened into `any`/`unknown` and narrowed again with `.assert()` (`OSL-WIDENED-VALUE`), chained `.assert()` calls (`OSL-CHAINED-ASSERT`), consecutive `.filter()` and `.map()` passes (`OSL-FILTER-MAP`), nested ternaries (`OSL-NESTED-TERNARY`), `go:reflect` imports (`OSL-REFLECT-IMPORT`), and `raw()` calls without a `//` safety comment explaining why verbatim Go is needed (`OSL-RAW-WITHOUT-COMMENT`). They do not prevent compilation. Suppress one with an `osl-disable` comment like any other `OSL-*` code.

## Quick fixes

Redundant `.assert()` calls flagged by `OSL-REDUNDANT-ASSERT` offer a quick-fix code action that removes the call, and repeated top-level `import` lines are removed through organize imports. The same fixes run from a terminal with `osl fix`, which takes the same file-or-directory arguments as `osl fmt`.

## Formatting

The editor and `osl fmt` use the same formatter:

```bash
osl fmt src/
```

The formatter preserves comments and string contents. It leaves a file unchanged when parsing fails. It inserts a blank line before `def`, `class`, `type`, `struct`, and `enum` declarations so definition blocks stay visually separated, and a blank line after a leading `import` block so imports stay separated from the code that follows.

A method call whose receiver is still `any` and whose method cannot be resolved reports an OSL `TypeError` at the call. Narrow the receiver with a type guard, conversion, or assertion before using a type-specific method. This avoids an error about an undefined method in generated Go.
