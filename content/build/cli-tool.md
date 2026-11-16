---
layout: project
description: Build `todo`, a command-line task list that keeps its data in a JSON file, then compile it into a program you can run from anywhere.
uses: fs, json, process
time: 20 minutes
---

# Build a command-line tool

You'll build `todo`: `todo add buy milk`, `todo list`, `todo done 1`. Tasks live in a JSON file, mistakes get a message and an exit code, and at the end it's a single program on your `PATH`.

## Print a task list

A task is a struct: some text and a done flag. Two of them in an array, and a loop that prints a checkbox, the number and the text. Numbers start at 1, like every array position in OSL.

```osl
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", false), Task("walk dog", true)]

for i, t in tasks (
  string mark = if t.done then "[x]" else "[ ]"
  log mark i t.text
)
```

```output
[ ] 1 buy milk
[x] 2 walk dog
```

`if t.done then "[x]" else "[ ]"` is an expression that picks one of two values. **Try changing** a task's text, or flip a `false` to `true`.

:::exercise title="Count what's done"
Write `summary` so it returns text like `1 of 3 done`.

```osl
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", true), Task("walk dog", false), Task("write docs", false)]

def summary(Task[] tasks) string (
  return ""
)

log summary(tasks)
```

```output
1 of 3 done
```

> [!hint]
> Count the tasks whose `done` is true in a loop, then build the text with `++`.

```osl solution
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", true), Task("walk dog", false), Task("write docs", false)]

def summary(Task[] tasks) string (
  int done = 0
  for t in tasks (
    if t.done (
      done += 1
    )
  )
  return done ++ " of " ++ tasks.len ++ " done"
)

log summary(tasks)
```
:::


## Add tasks with a function

Commands will be functions: `add` appends a task and `list` prints them. The calls move to the try-it tab, so the program reads as the tool itself.

```osl
struct Task (
  string text
  bool done
)

Task[] tasks = []

def add(string text) (
  tasks.append(Task(text, false))
  log "added #" ++ tasks.len
)

def list() (
  for i, t in tasks (
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
)

// try it
add("buy milk")
add("walk dog")
list()
```

```output
added #1
added #2
[ ] 1 buy milk
[ ] 2 walk dog
```

**Try changing** the try-it tab: add a third task before `list()`.

:::exercise title="Only the open ones"
Make `list` print only tasks that aren't done when `onlyOpen` is true. Keep each task's own number.

```osl
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", false), Task("walk dog", true), Task("write docs", false)]

def list(bool onlyOpen) (
  for i, t in tasks (
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
)

list(true)
```

```output
[ ] 1 buy milk
[ ] 3 write docs
```

> [!hint]
> Skip a finished task with `if onlyOpen and t.done continue`.

```osl solution
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", false), Task("walk dog", true), Task("write docs", false)]

def list(bool onlyOpen) (
  for i, t in tasks (
    if onlyOpen and t.done continue
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
)

list(true)
```
:::


## Remember tasks in a file

Right now the list vanishes when the program ends. `save` turns the array into text with `json.stringify` and writes it with `fs.writeFile`; `load` reads it back with `json.parse<Task[]>`. A missing file just means an empty list. A broken file is a real problem: say why and exit with status 1. `add` and `list` now go through `load` and `save`.

```osl
import "std:fs"
import "std:json"
import "std:process"

struct Task (
  string text
  bool done
)

string file = "tasks.json"

def load() Task[] (
  if !fs.exists(file) return []
  string text = fs.readFile(file) catch (e) (
    log "cannot read " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
  return json.parse<Task[]>(text) catch (e) (
    log file ++ " is not valid: " ++ e.message
    process.exit(1)
  )
)

def save(Task[] tasks) (
  fs.writeFile(file, json.stringify(tasks)) catch (e) (
    log "cannot write " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
)

def add(string text) (
  Task[] tasks = load()
  tasks.append(Task(text, false))
  save(tasks)
  log "added #" ++ tasks.len
)

def list() (
  for i, t in load() (
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
)

// try it
fs.remove(file, {force: true}).unwrap()
add("buy milk")
add("walk dog")
list()
log fs.readFile(file).unwrap()
```

```output
added #1
added #2
[ ] 1 buy milk
[ ] 2 walk dog
[{"text":"buy milk","done":false},{"text":"walk dog","done":false}]
```

The `catch` blocks end in `process.exit(1)`, which never returns, so the code after `catch` only sees good values. See [errors](../learn/errors.md). The `fs.remove` in the try-it tab only makes each run start clean.

:::quiz
Why can the line after `fs.readFile(file) catch (...)` use the text as a plain string?

- [ ] `catch` turns every error into an empty string.
- [x] The block never returns, so the code after it only runs when reading worked.
- [ ] `readFile` can't fail.

`catch` runs its block on failure and gives back the plain value on success. A block that exits can't fall through.
:::

## Finish a task

`finish` can go wrong two ways: the argument isn't a number, or there's no such task. Each gets a message and an exit code: 2 means the command was used wrongly, 1 means something failed while doing the work. `tryAs<int>` returns a result, so `catch` handles "not a number" with an early `return 2`.

```osl
import "std:fs"
import "std:json"
import "std:process"

struct Task (
  string text
  bool done
)

string file = "tasks.json"

def load() Task[] (
  if !fs.exists(file) return []
  string text = fs.readFile(file) catch (e) (
    log "cannot read " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
  return json.parse<Task[]>(text) catch (e) (
    log file ++ " is not valid: " ++ e.message
    process.exit(1)
  )
)

def save(Task[] tasks) (
  fs.writeFile(file, json.stringify(tasks)) catch (e) (
    log "cannot write " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
)

def add(string text) (
  Task[] tasks = load()
  tasks.append(Task(text, false))
  save(tasks)
  log "added #" ++ tasks.len
)

def list() (
  for i, t in load() (
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
)


def finish(string input) int (
  int n = input.tryAs<int> catch (e) (
    log "not a number: " ++ input
    return 2
  )
  Task[] tasks = load()
  if n < 1 or n > tasks.len (
    log "no task #" ++ n
    return 1
  )
  tasks[n].done = true
  save(tasks)
  log "finished: " ++ tasks[n].text
  return 0
)

// try it
fs.remove(file, {force: true}).unwrap()
add("buy milk")
add("walk dog")
log finish("1")
log finish("9")
log finish("x")
list()
```

```output
added #1
added #2
finished: buy milk
0
no task #9
1
not a number: x
2
[x] 1 buy milk
[ ] 2 walk dog
```

**Try changing** the numbers in the try-it tab to hit each message.

:::exercise title="Don't finish twice"
Make `finish` refuse a task that's already done: print `already done: ` and its text, and return 1.

```osl
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", false), Task("walk dog", false)]

def finish(Task[] tasks, int n) int (
  if n < 1 or n > tasks.len (
    log "no task #" ++ n
    return 1
  )
  tasks[n].done = true
  log "finished: " ++ tasks[n].text
  return 0
)

log finish(tasks, 2)
log finish(tasks, 2)
```

```output
finished: walk dog
0
already done: walk dog
1
```

> [!hint]
> Check `tasks[n].done` before setting it.

```osl solution
struct Task (
  string text
  bool done
)

Task[] tasks = [Task("buy milk", false), Task("walk dog", false)]

def finish(Task[] tasks, int n) int (
  if n < 1 or n > tasks.len (
    log "no task #" ++ n
    return 1
  )
  if tasks[n].done (
    log "already done: " ++ tasks[n].text
    return 1
  )
  tasks[n].done = true
  log "finished: " ++ tasks[n].text
  return 0
)

log finish(tasks, 2)
log finish(tasks, 2)
```
:::


## One entry point

`run` takes the arguments as an array and returns an exit code: it `switch`es on the first one and hands the rest to the right function. `add` now takes the words and checks it got some. Because `run` takes arguments, the try-it tab can call it with made-up ones.

The real command line goes at the bottom: `process.args()` is what was typed after the program name, and `process.exit` ends with the code `run` returned. That only happens when arguments were given, so on this page the try-it code runs instead.

```osl
import "std:fs"
import "std:json"
import "std:process"

struct Task (
  string text
  bool done
)

string file = "tasks.json"

def load() Task[] (
  if !fs.exists(file) return []
  string text = fs.readFile(file) catch (e) (
    log "cannot read " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
  return json.parse<Task[]>(text) catch (e) (
    log file ++ " is not valid: " ++ e.message
    process.exit(1)
  )
)

def save(Task[] tasks) (
  fs.writeFile(file, json.stringify(tasks)) catch (e) (
    log "cannot write " ++ file ++ ": " ++ e.message
    process.exit(1)
  )
)

string usage = "usage: todo add <text> | list | done <n>"

def add(string[] words) int (
  if words.len == 0 (
    log usage
    return 2
  )
  Task[] tasks = load()
  tasks.append(Task(words.join(" "), false))
  save(tasks)
  log "added #" ++ tasks.len
  return 0
)

def list() int (
  Task[] tasks = load()
  if tasks.len == 0 (
    log "nothing to do"
  )
  for i, t in tasks (
    string mark = if t.done then "[x]" else "[ ]"
    log mark i t.text
  )
  return 0
)

def finish(string input) int (
  int n = input.tryAs<int> catch (e) (
    log "not a number: " ++ input
    return 2
  )
  Task[] tasks = load()
  if n < 1 or n > tasks.len (
    log "no task #" ++ n
    return 1
  )
  tasks[n].done = true
  save(tasks)
  log "finished: " ++ tasks[n].text
  return 0
)


def run(string[] args) int (
  if args.len == 0 (
    log usage
    return 2
  )
  string[] rest = args.trim(2, args.len)
  switch args[1] (
    case "add"
      return add(rest)
    case "list"
      return list()
    case "done"
      if rest.len == 0 (
        log usage
        return 2
      )
      return finish(rest[1])
    default
      log usage
      return 2
  )
)

if process.args().len > 0 (
  process.exit(run(process.args()))
)

// try it
fs.remove(file, {force: true}).unwrap()
for line in ["add buy milk", "add walk dog", "add write docs", "done 2", "list", "bogus"] (
  log "$ todo " ++ line
  log "exit " ++ run(line.split(" "))
)
```

```output
$ todo add buy milk
added #1
exit 0
$ todo add walk dog
added #2
exit 0
$ todo add write docs
added #3
exit 0
$ todo done 2
finished: walk dog
exit 0
$ todo list
[ ] 1 buy milk
[x] 2 walk dog
[ ] 3 write docs
exit 0
$ todo bogus
usage: todo add <text> | list | done <n>
exit 2
```

:::quiz
`todo bogus` prints the usage line. Which exit code fits, and why?

- [ ] 0, because the program didn't crash.
- [ ] 1, because every failure is 1.
- [x] 2, because the command was used wrongly, not because something broke.

Scripts check the code, so 0 must mean success. 2 for bad usage is the convention; 1 is for a failure while doing the work.
:::

:::exercise title="Add a version command"
Add a `version` command that prints `todo 1.0` and returns 0.

```osl
def run(string[] args) int (
  if args.len == 0 (
    log "usage: todo list | version"
    return 2
  )
  switch args[1] (
    case "list"
      log "(no tasks)"
      return 0
    default
      log "usage: todo list | version"
      return 2
  )
)

log run(["list"])
log run(["version"])
log run([])
```

```output
(no tasks)
0
todo 1.0
0
usage: todo list | version
2
```

> [!hint]
> Add another `case` before `default`.

```osl solution
def run(string[] args) int (
  if args.len == 0 (
    log "usage: todo list | version"
    return 2
  )
  switch args[1] (
    case "list"
      log "(no tasks)"
      return 0
    case "version"
      log "todo 1.0"
      return 0
    default
      log "usage: todo list | version"
      return 2
  )
)

log run(["list"])
log run(["version"])
log run([])
```
:::


## Build it and put it on your PATH

Save the program as `todo.osl`. `osl run` builds and runs it, and everything after `--` goes to your program:

```bash
osl run todo.osl -- add buy milk
```

`osl compile` builds a native executable once. It's a single file that needs neither OSL nor Go to run:

```bash
osl compile todo.osl -o todo
./todo add buy milk
./todo list
mkdir -p ~/.local/bin && mv todo ~/.local/bin/
todo done 1
```

The tasks live in `tasks.json` in the directory you run it from. For one global list, change `file` to `fs.joinPath(env.get("HOME"), ".todo.json")` (with `import "std:env"`). Next: a [JSON web API](web-api.md), or the [fs](../packages/fs.md), [json](../packages/json.md) and [process](../packages/process.md) pages.
