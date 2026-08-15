# Package manager

OSL projects can install OSL source modules directly from Git repositories. The workflow uses an
`osl.mod` manifest, an exact-commit `osl.lock` file, and an `osl_modules` dependency directory.

```bash
osl pkg init github.com/me/game
osl pkg add owner/repository@v1.2.0
osl pkg add https://github.com/owner/other.git@main
osl pkg sync
```

The short `owner/repository` form uses GitHub. Full HTTPS and SSH Git URLs are also accepted. For
local development, pass a local Git repository and select a ref with `--version`:

```bash
osl pkg add ../shared-tools --version HEAD
```

Import the module by the path declared in its `osl.mod`:

```javascript
import "github.com/owner/repository"
```

Available commands:

| Command | Purpose |
| --- | --- |
| `osl pkg init [module]` | Create `osl.mod` in the current directory. |
| `osl pkg add <repository>[@ref]` | Add or update a direct dependency. |
| `osl pkg remove <module>` | Remove a direct dependency and unused transitive dependencies. |
| `osl pkg sync` | Restore the exact commits recorded in `osl.lock`. |
| `osl pkg list` | List resolved versions and commits. |

`osl get` is an alias for `osl pkg add`, and `osl mod` is an alias for `osl pkg`.

Commit `osl.mod` and `osl.lock`. Add `osl_modules/` to the project's `.gitignore`; `osl pkg sync`
recreates it from the lock file.
