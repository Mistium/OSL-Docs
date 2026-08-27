# Opal projects

Opal is OSL's Git-backed project and package manager. `opal` and `osl opal` run the same commands.

## Create a project

```bash
opal init my-project
cd my-project
```

| Path | Purpose |
| --- | --- |
| `opal.json` | Project name, version, entry file, dependencies, scripts, and commands. |
| `opal.lock` | Exact resolved dependency commits. Commit this file. |
| `.opal/` | Local checkouts and compiled commands. Ignore this directory. |

## Dependencies

```bash
opal add mist/physics@v1.2.0
opal add gh:owner/repository
opal add go:example.com/module@v1.2.0
opal remove mist/physics
opal update
opal sync
```

An unqualified `owner/repository` uses `git.rotur.dev`. Prefix a repository with `gh:` for GitHub. `--offline` restricts resolution to cached data.

Inspect the resolved graph with `opal list`, `opal graph`, and `opal why <package>`.

## Scripts

Scripts are command arrays in `opal.json`:

```json
{
  "name": "example",
  "version": "1.0.0",
  "main": "main.osl",
  "scripts": {
    "dev": ["osl", "run", "main.osl"],
    "test": ["osl", "test", "."]
  }
}
```

Run `opal run` to list scripts or `opal run <name>` to execute one. Arguments after the script name are appended to the command.

## Package commands

A package can expose executable entries through the `bin` object:

```json
{
  "bin": {
    "my-tool": "cmd/tool.osl"
  }
}
```

Run a package command once with `opal exec <package> [args]`. Install it globally with `opal add -g <package>`. Global commands live under `$OPAL_HOME/bin`; the default Opal home is `~/.opal`.

Use `--force` only when replacing a command-name conflict. `opal clean` removes local Opal state, which `opal sync` can restore from the lock file.
