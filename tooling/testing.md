# Testing OSL programs

`osl test` discovers `.test.osl` and `_test.osl` files from the paths supplied on the command line. With no path, it searches the current project.

```bash
osl test
osl test tests/
osl test tests/parser.test.osl
```

Import `std:testing` for assertions:

```osl
import "std:testing"

testing.equal(2 + 2, 4)
testing.notEqual("left", "right")
```

The command returns a nonzero status when compilation, execution, or an assertion fails. See the [`testing` package reference](../packages/testing.md) for the full API.
