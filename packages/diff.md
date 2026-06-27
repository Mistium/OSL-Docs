# diff

> Text/line/word diffing

Use `diff` to compare text by line, word, or character and render the result as plain text, HTML, JSON, or unified diff text.

```javascript
import "osl/diff"
```

## API reference

### `diff`

| Method | Returns | Description |
| --- | --- | --- |
| `diff.compareLines(oldLines: array, newLines: array)` | `DiffResult` | Runs the compare lines operation. |
| `diff.compareWords(oldText: string, newText: string)` | `DiffResult` | Runs the compare words operation. |
| `diff.tokenize(text: string)` | `array` | Runs the tokenize operation. |
| `diff.text(oldStr: string, newStr: string)` | `DiffResult` | Runs the text operation. |
| `diff.words(oldStr: string, newStr: string)` | `DiffResult` | Runs the words operation. |
| `diff.chars(oldStr: string, newStr: string)` | `DiffResult` | Runs the chars operation. |
| `diff.unified(result: DiffResult)` | `string` | Runs the unified operation. |
| `diff.html(result: DiffResult)` | `string` | Runs the html operation. |
| `diff.json(result: DiffResult)` | `string` | Runs the json operation. |

## Notes

- Standard-library imports accept both `import "osl/diff"` and `import "diff"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
