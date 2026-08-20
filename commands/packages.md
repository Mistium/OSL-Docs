# Opal package manager

Opal is OSL's project and package manager. Git repositories are authoritative package sources.
Projects commit `opal.json` and the exact-commit `opal.lock`, while generated local state lives in
the ignored `.opal/` directory.

```bash
opal init my-game
opal add mist/physics@v1.2.0
opal add github:owner/other@main
opal add go:github.com/owner/native@v1.4.0
opal sync
```

The short `owner/repository` form uses `git.rotur.dev`. Explicit host shorthands are `rotur:`,
`github:`, `gitlab:`, and `codeberg:`. Full HTTPS and SSH Git URLs and local repositories are also
accepted. `osl opal` and `opal` call the same implementation.

The `go:` source kind records and downloads Go modules through the system Go toolchain. This is
useful for OSL packages that use `go/...` imports.

Import an installed package by its repository name:

```javascript
import "git.rotur.dev/mist/physics"
```

Available commands:

| Command | Purpose |
| --- | --- |
| `opal i`, `opal init` | Create `opal.json` and ignore `.opal/`. |
| `opal a`, `opal add` | Add or update a direct dependency. |
| `opal d`, `opal remove` | Remove a direct dependency and unreachable transitive packages. |
| `opal u`, `opal update` | Refresh one or all dependency commits. |
| `opal s`, `opal sync` | Restore the commits recorded in `opal.lock`; accepts `--offline`. |
| `opal l`, `opal list` | List resolved dependencies; accepts `--json`. |
| `opal g`, `opal graph` | Print the dependency graph; accepts `--json`. |
| `opal w`, `opal why` | Explain why a dependency is installed; accepts `--json`. |
| `opal r`, `opal run` | Run an argv-array script declared in `opal.json`. |
| `opal c`, `opal clean` | Remove project-local `.opal/` state. |

Scripts are argument arrays, so Opal does not invoke a shell:

```json
{
  "scripts": {
    "dev": ["osl", "run", "main.osl"]
  }
}
```
