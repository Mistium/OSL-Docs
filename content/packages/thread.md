---
description: Run functions on threads with async functions and lambdas, wait for results, run work in parallel and pass values over channels.
package: thread
---

# thread

`std:thread` runs functions alongside the rest of your program. For concurrent work, write an `async` function or an async lambda: it needs no import and returns a typed thread. Reach for `std:thread` itself for the lower-level cases: `thread.new` for a one-off job, channels, `thread.parallel` and `thread.race`. The package's functions, such as `thread.sleep`, `thread.parallel` and `thread.channel`, are available in any file that has an async function or lambda. In a file without one, add `import "std:thread"`.

For a guided introduction, see the [concurrency lesson](../learn/concurrency.md).

## Async functions

Write `async` where you would write `def`. Calling the function starts its body on a thread and returns at once. `wait()` gives the value the body returned:

```osl
async square(int n) int (
  thread.sleep(50)
  return n * n
)

auto job = square(9)
log "started"
log job.wait()
```

```output
started
81
```

`job` is a `*thread.Thread<int>`. The `int` comes from the return type written on the function. A one-line async function uses `->`, a function with no return type returns a thread that gives nothing, and methods in a class can be async too:

```osl
async add(int a, int b) int -> a + b

async announce(string text) (
  log "announcing " ++ text
)

class Box (
  int n = 4
  async doubled() int -> self.n * 2
)

log add(2, 3).wait()
announce("hi").wait()
log Box().doubled().wait()
```

```output
5
announcing hi
8
```

There is no `await`. A thread is a value, and `.wait()` is how you get what is inside it. Forgetting to call it is a compile error that says so:

```osl error
async name() string -> "ada"

log name().toUpper()
```

## Async lambdas

An async lambda is the lambda form of the same thing, with `async` in place of `def`. Both the arrow form and the block form work:

```osl
auto double = async(int n) int -> n * 2
auto shout = async(string s) string (
  thread.sleep(10)
  return s.toUpper()
)
auto quiet = async() (
  log "ran"
)

log double(4).wait()
log shout("hello").wait()
quiet().wait()
```

```output
8
HELLO
ran
```

Pass one wherever a function is expected. A parameter that takes an async lambda has the type `def(int) *thread.Thread<int>`:

```osl
def retryTwice(def(int) *thread.Thread<int> job, int value) int -> job(job(value).wait()).wait()

log retryTwice(async(int n) int -> n + 10, 1)
```

```output
21
```

## What async is shorthand for

An async function returns the thread that `thread.new` makes for its body. These two functions are the same:

```osl fragment
async load(string name) string (
  return "profile of " ++ name
)

def load(string name) *thread.Thread<string> (
  return thread.new(def() string (
    return "profile of " ++ name
  ))
)
```

Prefer `async` when the work is a function of its own. Use `thread.new` directly for a one-off background job.

## Lower level: thread.new

`thread.new(fn, args...)` starts `fn` on a new thread, passes it the extra arguments, and returns the thread:

```osl
import "std:thread"

def cube(int n) int -> n * n * n

auto direct = thread.new(cube, 3)
auto inline = thread.new(def() string -> (
  thread.sleep(20)
  return "background result"
))
log direct.wait()
log inline.wait()
```

```output
27
background result
```

A thread is typed by the return type written on its function. `thread.new(def() int -> 1)` is a `*thread.Thread<int>`. If the function's return type is left for the compiler to work out, as in `def() -> 1`, you get a plain `*thread.Thread` whose `wait` gives `any`. Write the type where a thread is declared or returned to keep it.

When the main program finishes, running threads stop where they are. Keep your threads and wait for them.

## Waiting and then

`wait()` blocks until the thread is done. If the body threw, `wait()` rethrows the error, so wrap it in `try` to get a [result](../learn/errors.md):

```osl
async parse(string text) int (
  auto n = text.tryAs<int>
  if n.isErr() (
    throw error("ParseError", "not a number: " ++ text)
  )
  return n.unwrap()
)

log parse("42").wait()
auto bad = try(parse("nope").wait())
log bad.unwrapErr().kind bad.unwrapErr().message
```

```output
42
ParseError not a number: nope
```

`then(fn)` calls `fn` with the value once the thread finishes and returns another thread, typed by what `fn` returns. If the thread threw, `fn` doesn't run and the returned thread carries the error:

```osl
async load(string name) string -> "profile of " ++ name

auto length = load("ada").then(text -> text.len)
log length.wait()

async broken() string (
  throw error("StateError", "not ready")
)

auto skipped = broken().then(text -> text.len)
log try(skipped.wait()).unwrapErr().message
```

```output
14
not ready
```

`isDone()` says whether a thread has finished, and `age()` is how many milliseconds ago it started:

```osl
async quick() int -> 1

auto job = quick()
void job.wait()
log job.isDone()
log job.age() >= 0
```

```output
true
true
```

## Timeouts

`wait({timeout: ms})` gives up after that many milliseconds by throwing a `TimeoutError`. The thread keeps running, so you can wait again:

```osl
async slow() string (
  thread.sleep(300)
  return "finally"
)

auto job = slow()
auto early = try(job.wait({timeout: 20}))
log early.isErr()
log early.unwrapErr().kind
log job.wait()
```

```output
true
TimeoutError
finally
```

## Several threads

`thread.waitAll(threads)` waits for every thread and returns their values in the order the threads were given. If any threw, it rethrows the first failure after all have finished:

```osl
async fetch(string name) string (
  thread.sleep(100)
  return name ++ " done"
)

*thread.Thread<string>[] jobs = []
for name in ["alpha", "beta", "gamma"] (
  jobs.append(fetch(name))
)
log thread.waitAll(jobs)
```

```output
["alpha done","beta done","gamma done"]
```

`thread.race(threads)` returns the value of the first thread to finish. The others keep running:

```osl
async after(int ms, string name) string (
  thread.sleep(ms)
  return name
)

log thread.race([after(300, "slow"), after(20, "quick")])
```

```output
quick
```

## Parallel maps

`thread.parallel(items, fn, limit?)` calls `fn(item, index)` for every item on separate threads and returns the results in item order. The index starts at 1. The optional limit caps how many run at once:

```osl
import "std:thread"

int[] sizes = [3, 1, 2]

auto results = thread.parallel(sizes, def(int n, int i) string -> (
  thread.sleep(n * 20)
  return i ++ ":" ++ ("x" * n)
))
log results

auto limited = thread.parallel([1, 2, 3, 4, 5, 6], def(int n) int -> n * n, 2)
log limited
```

```output
["1:xxx","2:x","3:xx"]
[1,4,9,16,25,36]
```

If any call throws, `parallel` rethrows the first failure after every call has finished.

## Channels

A channel passes values between threads. `thread.channel(capacity?)` makes one that holds up to `capacity` values (default 0) before `send` waits for a receiver. `send` returns a result, which is an error when the channel is closed. `recv` waits for the next value and returns `null` once the channel is closed and empty:

```osl
auto ch = thread.channel()

async produce() int (
  for n in 1 to 5 (
    void ch.send(n * n)
  )
  ch.close()
  return 5
)

auto producer = produce()

int total = 0
while true (
  auto value = ch.recv()
  if value == null break
  total += value.<int>
)
log total
log producer.wait()
```

```output
55
5
```

`values()` iterates over the received values and ends when the channel is closed, which reads better in a `for` loop, and still works when `null` is one of the values you send:

```osl
auto ch = thread.channel(3)

async fill() (
  for word in ["a", "b", "c"] (
    void ch.send(word)
  )
  ch.close()
)

auto filler = fill()
for word in ch.values() (
  log word
)
filler.wait()
log ch.isClosed()
```

```output
a
b
c
true
```

`tryRecv()` takes a value if one is ready and returns `null` straight away if not. `len()` says how many values are waiting in the buffer.

## Fan out, fan in

A common pattern: several workers pull jobs from one channel and push answers into another. Sort the answers before printing, since workers finish in any order:

```osl
auto jobs = thread.channel(10)
auto answers = thread.channel(10)

async worker() int (
  int handled = 0
  for n in jobs.values() (
    void answers.send(n * n)
    handled++
  )
  return handled
)

*thread.Thread<int>[] workers = []
loop 3 (
  workers.append(worker())
)

for n in 1 to 9 (
  void jobs.send(n)
)
jobs.close()

int handled = 0
for w in workers (
  handled += w.wait()
)
answers.close()

int[] squares = []
for s in answers.values() (
  squares.append(s.<int>)
)
log handled
log squares.sort()
```

```output
9
[1,4,9,16,25,36,49,64,81]
```

## Shared data

Once a program starts threads, each statement that touches shared data runs as one step, so eight threads adding to the same counter never lose an update and you write no lock:

```osl
string[int] counts = {}

async countUp(int times) int (
  loop times (
    counts["total"] = (counts["total"] ?? 0) + 1
  )
  return times
)

*thread.Thread<int>[] jobs = []
for t 8 (
  jobs.append(countUp(1000))
)
void thread.waitAll(jobs)
log counts["total"]
```

```output
8000
```

A sequence of statements isn't one step. When several must happen together, wrap them in `atomic ( ... )`. A `return` can't leave the block, so set a variable inside it:

```osl
int stock = 10

async buy() boolean (
  boolean bought = false
  atomic (
    if stock > 0 (
      stock--
      bought = true
    )
  )
  return bought
)

*thread.Thread<boolean>[] jobs = []
loop 15 (
  jobs.append(buy())
)

int happy = 0
for job in jobs (
  if job.wait() (
    happy++
  )
)
log happy stock
```

```output
10 0
```

For locks you manage yourself, wait groups and run-once setup, see [`std:sync`](sync.md).

## Sleeping

`thread.sleep(ms)` pauses the current thread. Other threads keep running. A zero or negative time returns at once.

:::quiz
What does this print?

```osl fragment
async slow() int (
  thread.sleep(100)
  return 7
)

auto job = slow()
log "started"
log job.wait()
```

- [ ] `7`, then `started`
- [x] `started`, then `7`
- [ ] Only `7`

Calling an async function starts it and returns at once, so `started` prints while the body sleeps. `wait()` then blocks for the value.
:::

:::exercise title="Three cubes at once"
Make `cube` an async function that returns `n * n * n`, so each call starts a thread. The loop collects the threads and waits for them all.

```osl
async cube(int n) int -> n

*thread.Thread<int>[] jobs = []
for n in 1 to 3 (
  jobs.append(cube(n))
)
log thread.waitAll(jobs)
```

```output
[1,8,27]
```

> [!hint]
> It is already `async`. Fix the body so it cubes `n`.

```osl solution
async cube(int n) int -> n * n * n

*thread.Thread<int>[] jobs = []
for n in 1 to 3 (
  jobs.append(cube(n))
)
log thread.waitAll(jobs)
```
:::

## API reference

::api
