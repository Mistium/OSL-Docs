# cron

Use `cron` to run functions on five-field cron schedules from a background scheduler.

```osl
import "std:cron"
```

## Example

```osl
import "std:cron"

*cron.Scheduler jobs = cron.new()
jobs.add("cleanup", "*/5 * * * *", def() -> (
  log "cleaning up"
))
jobs.add("report", "0 9 * * mon-fri", def() -> (
  log "sending report"
))

jobs.run("cleanup")               // run one job now, on this thread
log jobs.job("cleanup").runCount  // 1

jobs.start()                      // run jobs in the background on their schedules
```

`start` returns at once. The program still exits when its main code ends, so keep it alive (for
example with a server, or a thread that waits) while jobs should run, and call `stop` to end the
background runs.

## Schedules

A schedule has five space-separated fields:

| Field | Values |
| --- | --- |
| minute | 0-59 |
| hour | 0-23 |
| day of month | 1-31 |
| month | 1-12 or `jan`-`dec` |
| day of week | 0-7 (0 and 7 are Sunday) or `sun`-`sat` |

Each field is `*`, a value, a range `a-b`, a step `*/n` or `a-b/n`, or a comma-separated list of
these. When both day fields are restricted, a day matches if either does. Times are local and
reported in unix milliseconds.

## API reference

### `cron`

| Method | Returns | Notes |
| --- | --- | --- |
| `cron.new()` | `*cron.Scheduler` | A scheduler with no jobs. |
| `cron.isValid(schedule: string)` | `boolean` | Whether `schedule` is a valid five-field schedule that fires at least once. |
| `cron.next(schedule: string, options?: object)` | `number` | When `schedule` next fires after now, in unix milliseconds. Option: `from` (unix milliseconds) to find the next time after that instead. |

### `*cron.Scheduler`

| Method | Returns | Notes |
| --- | --- | --- |
| `s.add(name: string, schedule: string, fn: function)` | `void` | Registers `fn` to run on `schedule` under `name`, enabled. |
| `s.remove(name: string)` | `void` | Deletes the job. Removing a missing job does nothing. A run in progress finishes. |
| `s.clear()` | `void` | Removes every job. |
| `s.has(name: string)` | `boolean` | Whether a job called `name` exists. |
| `s.enable(name: string)` | `void` | Lets the job run on its schedule again, from its next matching time. |
| `s.disable(name: string)` | `void` | Stops the job from running on its schedule. `run` can still run it. |
| `s.isEnabled(name: string)` | `boolean` | Whether the job exists and is enabled. |
| `s.job(name: string)` | `{name, schedule, enabled, running, nextRun, lastRun, runCount}?` | Describes the job, or `null` when there is none. |
| `s.jobs()` | `{name, schedule, enabled, running, nextRun, lastRun, runCount}[]` | Every job, sorted by name. |
| `s.run(name: string)` | `void` | Runs the job now on the calling thread, even when disabled, and returns when it finishes. An error the job throws propagates. |
| `s.runAll()` | `void` | Runs every enabled job now, one after another in name order. Every job runs even if an earlier one throws; then the first error is rethrown. |
| `s.start()` | `void` | Runs enabled jobs in the background whenever their schedule matches, checking every second, until `stop`. Starting a running scheduler does nothing. |
| `s.stop()` | `void` | Stops scheduled runs; runs in progress finish. Stopping a stopped scheduler does nothing. |
| `s.isRunning()` | `boolean` | Whether `start` has been called without a later `stop`. |

In a job record, `nextRun` and `lastRun` are unix milliseconds. `nextRun` is `null` while the job
is disabled, `lastRun` is `null` until the job has run, and `running` is `true` while a run is in
progress.

In the background, a job that is still running when it is due again is skipped, and a job that
throws has its error printed while the scheduler keeps running.

## Errors

- `cron.next` and `s.add` throw `ValueError` for a schedule that is invalid or never fires.
- `s.add` throws `ValueError` when a job already has that name, and `TypeError` when `fn` isn't a
  function.
- `s.enable`, `s.disable`, and `s.run` throw `NotFoundError` when there is no such job.

## Deprecated

These still work for one release with their old behaviour and draw an `OSL-DEPRECATED` warning.
The package-level job functions use one shared scheduler, and report times in unix seconds with `0`
for a missing job.

| Deprecated | Use instead |
| --- | --- |
| `cron.create()` and its `*cron.Cron` handle | `cron.new()`, which returns a `*cron.Scheduler` |
| `cron.validateSchedule(schedule)`, `c.validateSchedule(schedule)` | `cron.isValid(schedule)` |
| `cron.addJob` / `c.addJob(name, schedule, fn)`, which return `false` on failure | `s.add(name, schedule, fn)` |
| `cron.removeJob`, `c.removeJob` | `s.remove(name)` |
| `cron.enableJob`, `cron.disableJob`, `c.enableJob`, `c.disableJob` | `s.enable(name)`, `s.disable(name)` |
| `cron.runJob`, `c.runJob` | `s.run(name)` |
| `cron.runAll`, `cron.runOnce`, `c.runAll`, `c.runOnce`, which return `{success, duration, count}` per job | `s.runAll()` |
| `cron.getJobs`, `c.getJobs` | `s.jobs()` |
| `cron.getJob`, `c.getJob` | `s.job(name)` |
| `cron.getJobCount`, `c.getJobCount` | `s.jobs().len` |
| `cron.isEnabled` | `s.isEnabled(name)` |
| `cron.getLastRun`, `cron.getNextRun`, `cron.getRunCount` (and the `c.` forms) | `s.job(name).lastRun`, `.nextRun`, `.runCount` (milliseconds) |
| `cron.clear` | `s.clear()` |
| `cron.start()` / `c.start()`, which return a token for `stop(token)` | `s.start()` and `s.stop()` |

## Notes

- Prefer `import "std:cron"`; the older `import "osl/cron"` spelling remains supported.
