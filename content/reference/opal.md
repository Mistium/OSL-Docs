---
description: Opal, OSL's package manager and project file. The opal.json fields, every command, Git and Go dependencies, scripts and lint settings.
---

# Opal

Opal manages an OSL project: the `opal.json` file that describes it, the Git and Go packages it depends on, the scripts you run during development, and the lint settings that tune the compiler's warnings. It installs with OSL as the `opal` command. `osl opal <command>` runs the same code, so everything on this page works either way.

## A project

A project is a folder with an `opal.json` in it. Make one in the current folder:

```sh
mkdir my-project
cd my-project
opal init
```

`opal init [name]` writes `opal.json` and adds `.opal/` to `.gitignore`. The name defaults to the folder's name. It does not create or enter a folder, and it refuses to overwrite an existing `opal.json`. Every other command looks for `opal.json` in the current folder and then in each parent, so you can run them from any subfolder.

| Path | Purpose | Commit it? |
| --- | --- | --- |
| `opal.json` | Metadata, dependencies, scripts, commands and lint settings | Yes |
| `opal.lock` | The exact Git commits and Go module versions in use | Yes |
| `.opal/` | Checked-out packages and built commands | No |

## opal.json

```json
{
  "name": "mist/example",
  "version": "1.0.0",
  "description": "A small example",
  "main": "main.osl",
  "dependencies": {
    "git.rotur.dev/mist/project": "https://git.rotur.dev/mist/project.git",
    "github.com/owner/tool": { "repository": "https://github.com/owner/tool.git", "ref": "v1.2.0" }
  },
  "goDependencies": {
    "github.com/google/uuid": "v1.6.0"
  },
  "scripts": {
    "dev": ["osl", "run", "main.osl"],
    "test": ["osl", "test"]
  },
  "bin": {
    "example": "main.osl"
  },
  "lint": {
    "rules": { "OSL-COMMENT": "warning" }
  }
}
```

| Field | Type | Meaning |
| --- | --- | --- |
| `name` | string | Required. The project's name. For a package other people install, use `owner/repository`. |
| `version` | string | The project's version. `opal init` writes `1.0.0`. |
| `description` | string | One line about the project. |
| `main` | string | The project's entry file. `opal init` writes `main.osl`. |
| `osl` | string | The OSL version the project is written for. Informational. |
| `dependencies` | object | Git packages. Each key is the package's full name, such as `git.rotur.dev/mist/project`. The value is a repository URL, or an object with `repository` and an optional `ref`. `opal add` writes this field for you. |
| `goDependencies` | object | Go modules, as `"module/path": "version"`. |
| `scripts` | object | Named commands for `opal run`. Each is an array of arguments. |
| `bin` | object | Commands the package provides, as `"command": "file.osl"`. |
| `lint` | object | Warning levels for this project. See [Lint settings](#lint-settings). |

Opal reads and rewrites the file with two-space indentation, and keeps `lint` exactly as you wrote it.

## Scripts

A script is an argument array, not a shell string. Opal runs the first item as the program and passes the rest as arguments, with no shell in between. Extra words after the script name are added to the end. The project's `.opal/bin` folder is put at the front of `PATH`, so scripts can call commands that packages provide.

```json
{
  "name": "example",
  "scripts": {
    "dev": ["osl", "run", "main.osl"],
    "test": ["osl", "test"]
  }
}
```

```sh
opal run              # list the scripts
opal run dev          # run one
opal run test src/    # extra arguments are appended: osl test src/
```

Scripts run with the project folder as their working directory. The exit status is Opal's: a failing script makes `opal run` exit with 1.

## Packages and dependencies

A package is a Git repository with an `opal.json`. Add one, and Opal clones it into `.opal/packages`, records the commit in `opal.lock`, and writes it to `dependencies`:

```sh
opal add mist/project
opal add mist/project@v1.2.0
opal add gh:owner/repository
opal add https://example.com/team/tool.git
opal add ../local-package
```

How the argument is read:

| Form | Resolves to |
| --- | --- |
| `owner/repo` | `git.rotur.dev/owner/repo` |
| `host/owner/repo` | That host, such as `git.example.com/team/tool` |
| `rotur:owner/repo` | `git.rotur.dev/owner/repo` |
| `gh:owner/repo` or `github:owner/repo` | `github.com/owner/repo` |
| `gitlab:owner/repo` | `gitlab.com/owner/repo` |
| `codeberg:owner/repo` | `codeberg.org/owner/repo` |
| A Git URL (`https://...`, `git@host:owner/repo`) | That repository, named by host and path |
| A local folder | That folder, which must be a Git repository. It is named by its `opal.json`. |
| any of the above plus `@ref` | The branch, tag or commit `ref` |

Without a `@ref`, Opal follows the repository's default branch and locks the commit it finds.

### Importing a package

Import a package by its name. As with `opal add`, a name with two parts is shorthand for `git.rotur.dev`:

```osl fragment
import "mist/project"
import "github.com/owner/repository"
```

An import loads every `.osl` file in the package's top folder (apart from `.test.osl` files), the same way a folder import does. The [modules lesson](../learn/modules.md) covers how imported names are used.

### The lock file

`opal.lock` records the commit of every Git package, including the packages those packages depend on, and the version and checksums of every Go module. Anyone who runs `opal sync` gets exactly those versions, whatever the packages have published since.

| Command | Effect |
| --- | --- |
| `opal sync` | Restore the project to what `opal.lock` says. Run it after cloning. |
| `opal update` | Move every direct Git dependency to the newest commit of its ref. |
| `opal update <package>` | Move one dependency. |
| `opal remove <package>` | Remove a dependency. A bare repository name works when it is unambiguous. |

Add `--offline` to `add`, `update` or `sync` to forbid network access. Git packages must then already be in `.opal/packages` at the locked commit, and Go modules must already be in Go's module cache.

### Inspecting dependencies

```sh
opal list
opal graph
opal why mist/project
```

`list` prints each locked dependency and its commit. `graph` prints the Git dependency tree. `why` prints the chain of packages that leads from the project to one dependency, and exits with 1 when there is no such chain. All three take `--json`.

## Go dependencies

Go packages from outside Go's standard library come in as Go modules. Add one with the `go:` prefix:

```sh
opal add go:github.com/google/uuid
opal add go:github.com/google/uuid@v1.6.0
```

Without a version after `@`, Opal uses `latest` and records the version it found. The module goes under `goDependencies` in `opal.json`, and its version and checksums go in `opal.lock`. Use it in a program with a `go:` import, as the [Go lesson](../learn/go.md) shows:

```osl fragment
import "go:github.com/google/uuid"

log uuid.NewString()
```

A package's own `goDependencies` join your project's lock. When both name the same module, your entry wins. To move a module to a newer version, add it again, for example `opal add go:github.com/google/uuid@latest`. Remove one with `opal remove go:github.com/google/uuid`. Builds fetch any module they are missing at the locked version.

## Package commands

A package can provide programs through the `bin` field, a map from command name to the `.osl` file that implements it:

```json
{
  "name": "mist/tool",
  "version": "1.0.0",
  "bin": { "tool": "src/main.osl" }
}
```

Three ways to use one:

```sh
opal exec mist/tool --help      # run once, from a temporary checkout
opal add mist/tool              # as a dependency: built into .opal/bin
opal add -g mist/tool           # install it for everyone on this machine
```

`opal exec` compiles the package's command, runs it with the arguments you give, and throws the build away. As a project dependency, the commands are built into `.opal/bin`, which `opal run` puts on `PATH`. With `-g`, they are built into `$OPAL_HOME/bin`, which is `~/.opal/bin` unless you set `OPAL_HOME`. Put that folder on your `PATH` to call global commands by name.

```sh
opal list -g
opal update -g [package]
opal remove -g mist/tool
```

Two packages cannot provide the same command name, and a command cannot replace a file that is already there. Pass `--force` to `add`, `update` or `sync` to replace it.

`opal clean` deletes the project's `.opal` folder. `opal.lock` stays, so `opal sync` brings everything back.

## Lint settings

The `lint` field turns the compiler's warnings up, down or off for one project. `osl run`, `osl compile`, `osl test`, `osl lsp check` and the editor all read it, and the editor rechecks open files when you save `opal.json`.

```json
{
  "name": "example",
  "lint": {
    "rules": {
      "OSL-LOOSE-PARAM": "error",
      "OSL-COMMENT": "warning",
      "OSL-LONG-FUNCTION": ["warning", { "max": 80 }]
    },
    "overrides": [
      { "files": "src/legacy/", "rules": { "OSL-LONG-FUNCTION": "off" } }
    ]
  }
}
```

Each rule is named by its code (see the [diagnostics reference](diagnostics.md#warnings) for every code) and set to a severity, or to an array of a severity and options.

| Severity | Effect |
| --- | --- |
| `off` | Not reported. |
| `pedantic` | Reported only with `--all-warnings`. The editor shows it as a hint. |
| `warning` | Reported, and the program still compiles. |
| `error` | Reported as an error. The warning's kind changes from `...Warning` to `...Error`, and `compile`, `run`, `test` and `lsp check` fail. |

Only warnings can be configured. Compile errors such as `TypeError` always stay errors. An unknown code, a bad severity or a bad option is reported as a `ConfigError` at its place in `opal.json`.

`overrides` apply rules to the files that match `files`, a glob or a list of globs relative to the project folder. `*` matches within one folder, `**` matches any depth, and a glob that names a folder (with or without a trailing `/`) matches everything inside it. Use `/` as the separator on every system. Overrides apply in order, and the last match wins. An override that sets only a severity keeps the options set before it. Packages installed in `.opal/` always use the default severities.

A `// osl-disable` comment still silences a warning that the project has made an error.

### Opt-in rules

These four rules are off unless a project turns them on:

| Code | Reports | Options |
| --- | --- | --- |
| `OSL-COMMENT` | Comments, apart from `osl-disable` directives and the safety comment that `raw()` calls need. A run of comment lines counts once. | |
| `OSL-LONG-FUNCTION` | Functions longer than `max` lines. | `max`, default `60` |
| `OSL-UNTYPED-GLOBAL` | Top-level variables declared with `auto`, `any` or no type. | |
| `OSL-OBJECT-PARAM` | Parameters declared as plain `object` or `array`, or collections of them, where a struct or typed collection would say what is expected. | |

## Command summary

Every command has a one-letter short form. Options: `-g`, `--global` manages installed commands, `--offline` forbids network access, `--force` replaces conflicting commands, and `--json` prints structured output.

| Command | Short | Usage | Effect |
| --- | --- | --- | --- |
| `init` | `i` | `opal init [name]` | Create `opal.json` in the current folder. |
| `add` | `a` | `opal add <package> [--offline] [-g] [--force]` | Add and lock a Git or `go:` dependency. |
| `remove` | `d` | `opal remove <package> [-g]` | Remove a dependency. |
| `update` | `u` | `opal update [package] [--offline] [-g] [--force]` | Refresh locked commits. |
| `sync` | `s` | `opal sync [--offline] [--force]` | Restore what `opal.lock` records. |
| `list` | `l` | `opal list [-g] [--json]` | List locked dependencies. |
| `graph` | `g` | `opal graph [--json]` | Print the dependency tree. |
| `why` | `w` | `opal why <package> [--json]` | Show why a package is a dependency. |
| `run` | `r` | `opal run [script] [args...]` | List scripts, or run one. |
| `exec` | `e` | `opal exec <package> [args...]` | Run a package command once. |
| `clean` | `c` | `opal clean` | Delete `.opal`. |
| `version` | `v` | `opal version` | Print the version. |
| `help` | `h` | `opal help` | Print the command summary. |

## Environment

| Variable | Effect |
| --- | --- |
| `OPAL_HOME` | Where global packages and commands live. Default `~/.opal`. |
| `OSL_CACHE_DIR` | The compiler's cache folder, which Opal's builds use too. |
