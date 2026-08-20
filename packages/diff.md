# diff

> Text/line/word diffing

Use `diff` to compare text by line, word, or character and render the result as plain text, HTML, JSON, or unified diff text.

```javascript
import "std:diff"
```

## API reference

### `diff`

| Method | Returns | Description |
| --- | --- | --- |
| `diff.compareLines(oldLines: array, newLines: array)` | `DiffResult` | Compares every positional line, including all trailing additions or removals. |
| `diff.compareWords(oldText: string, newText: string)` | `DiffResult` | Uses the shared positional comparison engine on whitespace-delimited words. |
| `diff.tokenize(text: string)` | `array` | Splits text using standard Unicode whitespace rules. |
| `diff.text(oldStr: string, newStr: string)` | `DiffResult` | Runs the text operation. |
| `diff.words(oldStr: string, newStr: string)` | `DiffResult` | Runs the words operation. |
| `diff.chars(oldStr: string, newStr: string)` | `DiffResult` | Runs the chars operation. |
| `diff.unified(result: DiffResult)` | `string` | Runs the unified operation. |
| `diff.html(result: DiffResult)` | `string` | Renders escaped HTML using a reusable single-pass replacer. |
| `diff.json(result: DiffResult)` | `string` | Serializes the tagged result directly without an intermediate object. |

## Notes

- Prefer `import "std:diff"`; the older `import "osl/diff"` spelling remains supported.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

Line, word, and Unicode character comparisons share one builder-backed engine.
