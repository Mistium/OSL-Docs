# diff

Use `diff` to compare text by line, word, or character and render the result as plain text, HTML, JSON, or unified diff text.

```osl
import "std:diff"
```

## API reference

### `diff`

| Method | Returns | Notes |
| --- | --- | --- |
| `diff.compareLines(oldLines: array, newLines: array)` | `DiffResult` | Compares every positional line, including all trailing additions or removals. |
| `diff.compareWords(oldText: string, newText: string)` | `DiffResult` | Compares whitespace-delimited words by position. |
| `diff.tokenize(text: string)` | `array` | Splits text using standard Unicode whitespace rules. |
| `diff.text(oldStr: string, newStr: string)` | `DiffResult` |  |
| `diff.words(oldStr: string, newStr: string)` | `DiffResult` |  |
| `diff.chars(oldStr: string, newStr: string)` | `DiffResult` |  |
| `diff.unified(result: DiffResult)` | `string` |  |
| `diff.html(result: DiffResult)` | `string` | Renders escaped HTML using a reusable single-pass replacer. |
| `diff.json(result: DiffResult)` | `string` | Serializes the tagged result directly without an intermediate object. |

## Notes

- Prefer `import "std:diff"`; the older `import "osl/diff"` spelling remains supported.

Line, word, and Unicode character comparisons share one builder-backed engine.
