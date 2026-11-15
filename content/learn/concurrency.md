---
description: Do several things at once with async functions, share data safely, pass messages through channels, and run work in parallel.
lesson: 20
---

# Concurrency

A thread runs a function alongside the rest of your program. Threads make a slow job, such as waiting on the network or crunching numbers, happen at the same time as everything else. The normal way to write one is an `async` function. Underneath, OSL's threads come from [`std:thread`](../packages/thread.md), and shared data is safe by default.

## Async functions

Write `async` where you would write `def`. Calling the function starts its body on a thread of its own and returns at once, with a handle to that thread. `wait()` waits for it to finish and gives back what the body returned:

```osl
async slowSquare(int n) int (
  thread.sleep(100)
  return n * n
)

auto job = slowSquare(12)
log "working on something else meanwhile"
log job.wait()
```

```output
working on something else meanwhile
144
```

`job` is a `*thread.Thread<int>`: a thread whose `wait()` gives an `int`. The type comes from the return type you wrote. A file that has an async function can use `thread.sleep` and the rest of `std:thread` without importing it.

There is no `await` keyword. Call `.wait()` where you need the value. Using the handle as if it were the value is a compile error, and the message says to call `.wait()`:

```osl error
async name() string -> "ada"

string s = name()
log s
```

A one-line async function uses `->`, as a one-line `def` does:

```osl
async add(int a, int b) int -> a + b

log add(2, 3).wait()
```

```output
5
```

## Doing something with the result

`then(fn)` runs `fn` with the value once the thread finishes, and returns another thread that finishes with whatever `fn` returned. The parameter of `fn` has the type the thread gives:

```osl
async load(string name) string (
  thread.sleep(50)
  return "profile of " ++ name
)

auto shown = load("ada").then(text -> text.len)
log shown.wait()
```

```output
14
```

A thread's `wait()` is always how you finish a chain: the main program doesn't wait for threads on its own, so a thread nobody waits for can be cut off when the program ends.

## When the body fails

If the body throws, the caller doesn't see it until it calls `wait()`, which rethrows it. Wrap the call in `try` to get a result instead of a stop, as with any other [error](errors.md):

```osl
async parse(string text) int (
  auto n = text.tryAs<int>
  if n.isErr() (
    throw error("ParseError", "not a number: " ++ text)
  )
  return n.unwrap()
)

auto good = try(parse("42").wait())
auto bad = try(parse("forty-two").wait())
log good.unwrap()
log bad.unwrapErr().kind bad.unwrapErr().message
```

```output
42
ParseError not a number: forty-two
```

When the thread has failed, `then` doesn't call its function: the thread it returns carries the same error, and its `wait()` rethrows it.

## Timeouts

`wait({timeout: ms})` waits at most that long. If the thread is still running, it throws a `TimeoutError`, and `try` turns that into a result you can check. A timeout stops the waiting, not the thread, so you can wait again:

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

## Async lambdas

A lambda can be async too. Where a typed lambda starts with `def`, an async one starts with `async`:

```osl
auto double = async(int n) int -> n * 2
auto shout = async(string s) string (
  thread.sleep(10)
  return s.toUpper() ++ "!"
)

log double(4).wait()
log shout("hello").wait()
```

```output
8
HELLO!
```

Like any lambda it can be passed to a function. The parameter's type says it returns a thread:

```osl
def twice(def(int) *thread.Thread<int> job, int value) int -> job(job(value).wait()).wait()

log twice(async(int n) int -> n + 10, 1)
```

```output
21
```

Or kept in an array with others of the same kind. Give the function type a name with `type`, as in the [lambdas lesson](lambdas.md), and call each in turn:

```osl
type Step = def(int) *thread.Thread<int>

auto addOne = async(int n) int -> n + 1
auto square = async(int n) int -> n * n
Step[] steps = [addOne, square, addOne]

int value = 3
for step in steps (
  value = step(value).wait()
)
log value
```

```output
17
```

## Running several at once

Calling an async function never blocks, so start as many as you like and wait afterwards. Three jobs that each take a tenth of a second finish together in about a tenth of a second, not three:

```osl
async fetch(string name) string (
  thread.sleep(100)
  return name ++ " done"
)

*thread.Thread<string>[] jobs = []
for name in ["alpha", "beta", "gamma"] (
  jobs.append(fetch(name))
)

for job in jobs (
  log job.wait()
)
```

```output
alpha done
beta done
gamma done
```

Waiting in the order you started them gives results in that order, whichever finishes first. To collect them all in one step, `thread.waitAll(jobs)` returns the values as an array in the same order. If any thread threw, it rethrows the first failure after all of them have finished:

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

`thread.race(jobs)` gives the value of whichever finishes first instead. The others keep running.

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

The most common job is "do this to every item, using every core". `thread.parallel` does exactly that, and returns the results in order:

```osl
import "std:thread"

def collatzSteps(int start) int (
  int n = start
  int steps = 0
  while n != 1 (
    n = if n % 2 == 0 then n / 2 else (n * 3) + 1
    steps++
  )
  return steps
)

int[] starts = [27, 97, 871, 6171]
log thread.parallel(starts, def(int n, int i) int -> collatzSteps(n))
```

```output
[111,118,178,261]
```

The function gets each item and its position. An optional third argument limits how many run at once. It's the right tool when you have a list and one function; use async functions when the jobs differ or when you want to do other things before you wait.

## thread.new, the tool underneath

An async function is shorthand. This:

```osl fragment
async load(string name) string (
  return "profile of " ++ name
)
```

means exactly this:

```osl fragment
def load(string name) *thread.Thread<string> (
  return thread.new(def() string (
    return "profile of " ++ name
  ))
)
```

Writing that by hand for every function is noisy, which is why `async` exists. `thread.new` is still the right tool for a one-off background job that isn't a function of its own. It takes a function, and any extra arguments are passed to it:

```osl
import "std:thread"

auto job = thread.new(def() string -> (
  thread.sleep(50)
  return "background result"
))
log "main carries on"
log job.wait()

def cube(int n) int -> n * n * n
log thread.new(cube, 3).wait()
```

```output
main carries on
background result
27
```

Import `std:thread` when you use `thread.new` in a file that has no async function. The handle is the same `*thread.Thread<T>` either way, with the same `wait`, `then` and timeout behaviour as above.

## Sharing data is safe

Once a program starts threads, every statement that touches shared data runs as one indivisible step. Eight threads adding to the same object never lose an update, and you don't write a single lock:

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

Each statement is atomic, but a sequence of statements isn't: another thread can act between two of them. When several steps must happen together, wrap them in `atomic ( ... )`, which runs the block as one step.

Here fifteen threads each try to buy one of ten tickets. The check and the update must go together, or two threads could both see one ticket left and both take it. A `return` can't leave the block, so set a variable inside it and return after:

```osl
int stock = 10
int sold = 0

async buy() boolean (
  boolean bought = false
  atomic (
    if stock > 0 (
      stock--
      sold++
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
log happy stock sold
```

```output
10 0 10
```

For locks you take yourself, wait groups and run-once setup, see [`std:sync`](../packages/sync.md).

## Channels

A channel passes values from one thread to another, in order. One side `send`s, the other `recv`s, waiting when there's nothing yet:

```osl
auto ch = thread.channel()

async produce() int (
  for n in 1 to 5 (
    void ch.send(n * n)
  )
  ch.close()
  return 0
)

auto producer = produce()

int total = 0
while true (
  auto value = ch.recv()
  if value == null break
  total += value.<int>
)
void producer.wait()
log total
```

```output
55
```

`recv` returns `null` once the channel is closed and empty, which ends the loop.

> [!note] Servers are concurrent already
> A web server from [`std:serve`](../packages/serve.md) handles each request on its own thread, with the same safety for shared data. You get concurrency there without starting a thread yourself.

:::quiz
Eight threads each run `count += 1` a thousand times on a shared variable. What is `count` afterwards?

- [x] Always 8000.
- [ ] Usually a bit less than 8000.
- [ ] It doesn't compile without a lock.

Every statement on shared data is atomic once threads exist, so no update is lost.
:::

:::quiz
What does `square(5)` give, when `async square(int n) int -> n * n`?

- [x] A `*thread.Thread<int>`, which gives `25` from `.wait()`.
- [ ] The number `25`, after waiting for the body to finish.
- [ ] A `result<int, error>`.

The call returns at once with a handle to the thread running the body. `.wait()` gets the value, and rethrows anything the body threw.
:::

:::exercise title="Word lengths in parallel"
Write the async function `length`, which waits 50 milliseconds and returns the length of a word. Start one for every word, then print the lengths in order.

```osl
string[] words = ["fig", "banana", "kiwi", "apple"]

log words
```

```output
[3,6,4,5]
```

> [!hint]
> `async length(string word) int ( ... )` can call `thread.sleep(50)` and then `return word.len`.

> [!hint]
> Collect the threads in a `*thread.Thread<int>[]`, then print `thread.waitAll(jobs)`.

```osl solution
async length(string word) int (
  thread.sleep(50)
  return word.len
)

string[] words = ["fig", "banana", "kiwi", "apple"]

*thread.Thread<int>[] jobs = []
for word in words (
  jobs.append(length(word))
)
log thread.waitAll(jobs)
```
:::
