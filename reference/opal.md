# Opal projects

Opal manages project metadata, Git dependencies, Go dependencies, lock data, scripts, and package commands. `opal` and `osl opal` run the same implementation.

## Project files

```bash
opal init my-project
cd my-project
```

| Path | Purpose |
| --- | --- |
| `opal.json` | Project metadata, entry file, dependencies, scripts, and command entries |
| `opal.lock` | Exact resolved commits and dependency graph |
| `.opal/` | Local checkouts and compiled commands |

Commit `opal.json` and `opal.lock`. Ignore `.opal/`.

## Manifest

```json
{
  "name": "example",
  "version": "1.0.0",
  "main": "src/main.osl",
  "scripts": {
    "dev": ["osl", "run", "src/main.osl"],
    "test": ["osl", "test", "src"]
  },
  "bin": {
    "example": "src/main.osl"
  }
}
```

Scripts are argument arrays. Opal executes them directly without a shell.

```bash
opal run
opal run dev
```

Running `opal run` without a name lists the available scripts.

## Dependencies

```bash
opal add mist/project
opal add mist/project@v1.2.0
opal add gh:owner/repository
opal add go:example.com/module@v1.2
opal remove mist/project
opal update
opal sync
```

An unqualified `owner/repository` uses `git.rotur.dev`. `gh:` selects GitHub. `go:` records a Go module dependency.

`sync` restores the exact locked project. `--offline` restricts it to cached repositories.

Inspect dependency state with:

```bash
opal list
opal graph
opal why mist/project
```

These commands accept `--json` where structured output is useful.

## Package commands

A package exposes commands through the manifest's `bin` object. Run one without installing it:

```bash
opal exec mist/tool --help
```

Install commands globally with `opal add -g mist/tool`. They are written to `$OPAL_HOME/bin`, which defaults to `~/.opal/bin`.

`opal clean` removes project-local `.opal` state. The lock file remains, so `opal sync` can restore it.
