# Editor tooling

`osl lsp` runs the OSL language server over standard input and output. Configure an editor's language-server client to start this command for `.osl` files.

The server provides diagnostics, completion, hover text, signature help, definitions, type definitions, references, rename, semantic highlighting, inferred-type hints, document symbols, links, folding, selection ranges, call hierarchy, import organization, quick fixes, and formatting.

Positions and ranges use UTF-16 code units, as the protocol requires, and identifiers may contain non-ASCII letters, so references, rename, and definitions work for names such as `año`.

It keeps one project-aware compiler engine. Unsaved editor buffers become in-memory overlays, so diagnostics can resolve imports without writing those buffers to disk.

## Check from a terminal

```bash
osl lsp check src/main.osl
```

This runs the same project diagnostic path, reports diagnostics from every reachable imported OSL file, and returns a failure status for errors.

Self-comparison warnings flag expressions such as `value != value`. They do not prevent compilation. NaN is an exception to ordinary self-equality: it is unequal to itself. Use `math.isNan(value)` when that is the intended check.

Boundary warnings flag explicit `any` or `unknown` contracts that hide where unknown input should be decoded: loose function parameters and returns (`OSL-LOOSE-PARAM`, `OSL-LOOSE-RETURN`), loose type aliases (`OSL-LOOSE-ALIAS`), and dictionaries with loose values (`OSL-LOOSE-DICTIONARY`). Related warnings flag a known literal widened into `any`/`unknown` and narrowed again with `.assert()` (`OSL-WIDENED-VALUE`), chained `.assert()` calls (`OSL-CHAINED-ASSERT`), consecutive `.filter()` and `.map()` passes (`OSL-FILTER-MAP`), nested ternaries (`OSL-NESTED-TERNARY`), `go:reflect` imports (`OSL-REFLECT-IMPORT`), and `raw()` calls without a `//` safety comment explaining why verbatim Go is needed (`OSL-RAW-WITHOUT-COMMENT`). They do not prevent compilation. Suppress one with an `osl-disable` comment like any other `OSL-*` code.

Readability warnings flag expressions with a simpler equivalent. Each one carries a replacement, so the editor offers it as a quick fix and `osl fix` applies it:

| Code | Pattern | Replacement |
| --- | --- | --- |
| `OSL-NEGATED-EQUALITY` | `!(a == b)` | `a != b` |
| `OSL-REDUNDANT-COALESCE` | `value ?? null` | `value` |
| `OSL-OPERATOR-ASSIGNMENT` | `total = total + n` | `total += n` |
| `OSL-REDUNDANT-TERNARY` | `ready ? true false` | `ready` |
| `OSL-POINTER-EQUALITY` | `conn == except` | `conn === except` |

`OSL-REDUNDANT-TERNARY` only fires when the condition is already boolean; a loose condition keeps its truthiness conversion. `OSL-OPERATOR-ASSIGNMENT` also folds chains such as `text = text ++ a ++ b` into `text ++= a ++ b` for the associative operators `+`, `++`, and `*`. `OSL-POINTER-EQUALITY` matters because `==` compares the contents of two handles, so two distinct connections in the same state compare equal; `===` and `!==` compare identity. `OSL-PREFIX-STRIP` flags `if s.startsWith(p) ( s = s.replace(p, "") )` and suggests `s.stripStart(p)` (or `stripEnd` for a suffix) without a fix, because `replace` also touches later occurrences. `key = key ?? null` is reported without a fix too: it only makes a missing object key present as `null`, which a `contains()` check says more clearly.

Branch warnings flag control flow that says less than it could. `OSL-BOOLEAN-BRANCHES` reports an `if` whose branches only `return true` and `return false`, whether the second return sits in an `else` or on the next line, and names the boolean expression to return instead. `OSL-IDENTICAL-BRANCHES` reports an `else` or `else if` whose body repeats the previous branch, and an `if` whose two branches run the same code. `OSL-INVERTED-CONDITION` reports an `if` immediately followed by an `if` on the negated condition when the first body leaves that condition unchanged.

All of these run for every reachable imported file, not only the entry file. `osl compile` and `osl run` print at most 20 warnings and count the rest; `osl lsp check` and `osl fix` report every warning.

## Quick fixes

Redundant `.assert()` calls flagged by `OSL-REDUNDANT-ASSERT` offer a quick-fix code action that removes the call, readability warnings that carry a replacement offer a "Replace with" action, and repeated top-level `import` lines are removed through organize imports. The same fixes run from a terminal with `osl fix`, which takes the same file-or-directory arguments as `osl fmt`. A fix is applied only when the file still contains the exact text the compiler reported, so stale diagnostics never rewrite code.

## Formatting

The editor and `osl fmt` use the same formatter:

```bash
osl fmt src/
```

The formatter preserves comments and string contents. It leaves a file unchanged when parsing fails. It inserts a blank line before `def`, `class`, `type`, `struct`, and `enum` declarations so definition blocks stay visually separated, and a blank line after a leading `import` block so imports stay separated from the code that follows.

Call and grouping parentheses are written tight, so `foo( a )` and `def f( a, b )` become `foo(a)` and `def f(a, b)`; block openers and lambda bodies after `->` keep the spacing you wrote. A block opener glued to its condition gets a space, so `if ready(` becomes `if ready (` and `) else(` becomes `) else (`. Postfix `count++` and `count--` stay attached to their operand. Inline blocks such as `if ok ( return value )` expand onto their own lines even when the condition contains `//` inside a string, as URLs do.

A method call whose receiver is still `any` and whose method cannot be resolved reports an OSL `TypeError` at the call. Narrow the receiver with a type guard, conversion, or assertion before using a type-specific method. This avoids an error about an undefined method in generated Go.
