---
description: Describe when something should run with five-field cron schedules, work out the next run, and run jobs from a background scheduler.
package: cron
---

# cron

A cron schedule is a short text that says when something should run: every fifteen minutes, at 09:00 on weekdays, on the first of the month. `std:cron` parses those schedules, tells you when one next fires, and runs functions on them from a scheduler in the background.

## Reading a schedule

A schedule has five fields separated by spaces: minute, hour, day of month, month and day of week (0 or 7 is Sunday, 1 is Monday). Each field is one of:

- `*`, every value.
- A number, such as `9`.
- A range, such as `9-17`.
- A step, such as `*/15` (every 15th) or `10-50/10`.
- A comma-separated list of those, such as `0,30`.

When both day fields are restricted, a day matches if either one does. Times are local time.

`cron.isValid(schedule)` says whether a schedule parses and fires at least once:

```osl
import "std:cron"

for schedule in ["* * * * *", "*/15 * * * *", "0 9-17 * * 1-5", "0 0 1 1 *", "60 * * * *", "* * * *", "0 0 31 2 *"] (
  log schedule cron.isValid(schedule)
)
```

```output
* * * * * true
*/15 * * * * true
0 9-17 * * 1-5 true
0 0 1 1 * true
60 * * * * false
* * * * false
0 0 31 2 * false
```

`60` is not a minute, the sixth schedule has four fields, and February 31st never comes, so a schedule that can never fire is invalid too. Names such as `@daily` aren't supported: write `0 0 * * *`.

## When does it next run?

`cron.next(schedule, options)` returns when the schedule next fires after now, in unix milliseconds. The `from` option finds the next time after a moment you choose, which also makes a calculation repeatable:

```osl
import "std:cron"

number start = 1700000000000

number first = cron.next("*/15 * * * *", {from: start})
number second = cron.next("*/15 * * * *", {from: first})

log first > start
log first - start <= 900000
log second - first
log first % 60000
```

```output
true
true
900000
0
```

A quarter-hour schedule fires at most 15 minutes after any moment, and exactly 15 minutes after the previous fire. A fire time is always on a whole minute. `next` throws a `ValueError` for an invalid schedule, so check with `isValid` when the text comes from a user:

```osl
import "std:cron"

def describe(string schedule) string (
  if !cron.isValid(schedule) (
    return schedule ++ " is not a schedule"
  )
  return schedule ++ " fires every day: " ++ (cron.next(schedule, {from: 0}) > 0)
)

log describe("0 6 * * *")
log describe("every day")
```

```output
0 6 * * * fires every day: true
every day is not a schedule
```

## A scheduler with jobs

`cron.new()` makes a scheduler with no jobs. `add(name, schedule, fn)` registers a job. Each name is unique. `jobs()` describes every job, sorted by name:

```osl
import "std:cron"

auto scheduler = cron.new()
scheduler.add("backup", "0 3 * * *", def() -> (
  log "backing up"
))
scheduler.add("report", "0 9 * * 1-5", def() -> (
  log "sending report"
))

for job in scheduler.jobs() (
  log job.name job.schedule job.enabled job.runCount
)
```

```output
backup 0 3 * * * true 0
report 0 9 * * 1-5 true 0
```

Adding a name that exists, an invalid schedule, or something that isn't a function throws, so mistakes show up when the program starts rather than at three in the morning:

```osl
import "std:cron"

auto scheduler = cron.new()
scheduler.add("tidy", "0 * * * *", def() -> (
  log "tidying"
))

auto duplicate = try(scheduler.add("tidy", "30 * * * *", def() -> (
  log "again"
)))
log duplicate.unwrapErr().kind

auto bad = try(scheduler.add("other", "sometimes", def() -> (
  log "never"
)))
log bad.unwrapErr().kind
```

```output
ValueError
ValueError
```

## Running a job now

`run(name)` runs one job straight away, on the calling thread, and returns when it finishes. It works for disabled jobs too, and an error the job throws propagates to the caller. `runAll()` runs every enabled job one after another in name order. Both make the job's record update, so a scheduled job can be tested without waiting for its time:

```osl
import "std:cron"

auto scheduler = cron.new()
scheduler.add("b-second", "0 * * * *", def() -> (
  log "second job"
))
scheduler.add("a-first", "*/5 * * * *", def() -> (
  log "first job"
))

scheduler.runAll()
scheduler.run("a-first")

auto info = scheduler.job("a-first")
log info.runCount
log info.lastRun != null
log scheduler.job("b-second").runCount
```

```output
first job
second job
first job
2
true
1
```

`job(name)` returns an object with `name`, `schedule`, `enabled`, `running` (a run is in progress), `nextRun` and `lastRun` (unix milliseconds, `null` when not applicable) and `runCount`. It returns `null` when there is no such job. `run` on an unknown job throws a `NotFoundError`.

## Enable, disable and remove

A disabled job doesn't run on its schedule and has no next run, but `run` still works. `remove` deletes a job, and removing one that doesn't exist does nothing:

```osl
import "std:cron"

auto scheduler = cron.new()
scheduler.add("sync", "*/10 * * * *", def() -> (
  log "syncing"
))

log scheduler.isEnabled("sync")
log scheduler.job("sync").nextRun != null

scheduler.disable("sync")
log scheduler.isEnabled("sync")
log scheduler.job("sync").nextRun

scheduler.enable("sync")
log scheduler.isEnabled("sync")

scheduler.remove("sync")
scheduler.remove("sync")
log scheduler.has("sync")
log scheduler.jobs().len
```

```output
true
true
false
null
true
false
0
```

`clear()` removes every job.

## Starting the scheduler

`start()` runs enabled jobs in the background whenever their schedule matches. It checks every second, runs each due job on its own thread, and keeps going until `stop()`. `isRunning()` says whether it is started. Starting a running scheduler, or stopping a stopped one, does nothing:

```osl
import "std:cron"

auto scheduler = cron.new()
scheduler.add("tick", "* * * * *", def() -> (
  log "tick"
))

log scheduler.isRunning()
scheduler.start()
log scheduler.isRunning()
scheduler.stop()
log scheduler.isRunning()
```

```output
false
true
false
```

A job that is still running when it is due again is skipped, so a slow job never overlaps itself. A job that throws has its error printed and the scheduler keeps going. Runs already in progress finish after `stop`.

The program still ends when its main code ends, so a program that exists to run jobs must be kept alive. This one never returns, so it only compiles here:

```osl norun
import "std:cron"
import "std:thread"

auto scheduler = cron.new()
scheduler.add("cleanup", "0 3 * * *", def() -> (
  log "cleaning up old files"
))
scheduler.add("heartbeat", "* * * * *", def() -> (
  log "still alive"
))

scheduler.start()
log "scheduler started, next cleanup at " ++ scheduler.job("cleanup").nextRun

while true (
  thread.sleep(1000)
)
```

## Keeping a job short

Each run goes on a thread of its own, so a job can do anything an async function can. For work that takes a while or can fail, let the job start the real work and handle failures itself, so that nothing is lost in the scheduler's error printing:

```osl
import "std:cron"
import "std:retry"

string[] done = []

auto scheduler = cron.new()
scheduler.add("download", "0 * * * *", def() -> (
  auto outcome = retry.call(def(int attempt) string (
    if attempt < 2 (
      throw error("NetError", "busy")
    )
    return "downloaded"
  ), {delay: 1})
  done.append(outcome.unwrapOr("gave up"))
))

scheduler.run("download")
log done
```

```output
["downloaded"]
```

See [`std:retry`](retry.md) for the retry options, and [`std:thread`](thread.md) for running work on threads.

## API reference

::api
