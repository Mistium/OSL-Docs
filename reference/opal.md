# Opal projects

Opal manages OSL projects and their Git and Go dependencies. The `opal` executable and `osl opal`
run the same code.

## Project files

```bash
mkdir my-project
cd my-project
opal init
```

`opal init [name]` writes `opal.json` and updates `.gitignore` in the current directory. The
optional name sets the project name. It does not create or enter a directory.

| Path | Purpose |
| --- | --- |
| `opal.json` | Project metadata, dependencies, scripts, and command entries |
| `opal.lock` | Resolved Git commits, Go module versions, and the dependency graph |
| `.opal/` | Checked-out packages and compiled project commands |

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

Each script is an argument array. Opal runs the first item as the executable and passes the rest as
arguments. It does not invoke a shell. Extra arguments after the script name are appended.

```bash
opal run
opal run dev
opal run test ./tests/packages
```

Running `opal run` without a name lists the available scripts.

## Dependencies

```bash
opal add mist/project
opal add mist/project@v1.2.0
opal add gh:owner/repository
opal add gitlab:owner/repository
opal add ../local-package
opal add go:example.com/module@v1.2
opal remove mist/project
opal update [package]
opal sync
```

An unqualified `owner/repository` uses `git.rotur.dev`. Host aliases include `rotur:`, `gh:` or
`github:`, `gitlab:`, and `codeberg:`. You can also pass a Git URL, an SSH URL, or a local directory.
Append `@ref` to select a branch, tag, or commit. `go:` records a Go module dependency and defaults
to `latest` when no version follows `@`.

`opal sync` restores the commits and module versions in `opal.lock`. `opal update` refreshes every
direct Git dependency, or one named dependency when given an argument. Pass `--offline` to `add`,
`update`, or `sync` to prohibit network access. Offline Git packages must already exist in
`.opal/packages` at the locked commit. Offline Go modules must already be in Go's module cache.

Inspect dependency state with:

```bash
opal list
opal graph
opal why mist/project
```

`list`, `graph`, and `why` accept `--json`. `why` exits with status 1 when it cannot find a path to
the requested dependency.

## Package commands

A package exposes commands through the manifest's `bin` object:

```json
{
  "bin": {
    "example": "src/main.osl"
  }
}
```

Run a package command once without installing it:

```bash
opal exec mist/tool --help
```

Install commands globally with `opal add -g mist/tool`. Opal compiles them into `$OPAL_HOME/bin`,
which defaults to `~/.opal/bin`.

```bash
opal list -g
opal update -g [package]
opal remove -g mist/tool
```

Use `--force` with `add`, `update`, or `sync` when two packages provide the same command name or a
file already occupies its destination. Add `$OPAL_HOME/bin` to `PATH` before invoking global
commands by name.

`opal clean` removes project-local `.opal` state. The lock file remains, so `opal sync` can restore it.

## Command summary

| Command | Short form | Purpose |
| --- | --- | --- |
| `init [name]` | `i` | Create `opal.json` in the current directory |
| `add <package>` | `a` | Add and resolve a Git or Go dependency |
| `remove <package>` | `d` | Remove a dependency |
| `update [package]` | `u` | Resolve new commits for one or all direct Git dependencies |
| `sync` | `s` | Restore the locked dependency tree |
| `list` | `l` | List locked dependencies |
| `graph` | `g` | Print the Git dependency tree |
| `why <package>` | `w` | Print paths from the project to a Git dependency |
| `run [script] [...]` | `r` | List scripts or run one |
| `exec <package> [...]` | `e` | Compile and run a package command in a temporary checkout |
| `clean` | `c` | Remove `.opal` |
| `version` | `v` | Print the OSL and Opal version |
