# cron

Use `cron` to register named jobs, run them manually, or keep a scheduler loop checking cron-style schedules.

```osl
import "std:cron"
```

## API reference

### `cron`

| Method | Returns | Notes |
| --- | --- | --- |
| `cron.create()` | `*Cron` |  |
| `cron.addJob(name: any, schedule: any, callback: any)` | `boolean` | Adds job. |
| `cron.removeJob(name: any)` | `boolean` | Removes job. |
| `cron.enableJob(name: any)` | `boolean` | Enables an existing job. |
| `cron.disableJob(name: any)` | `boolean` | Disables an existing job through the same synchronized state update. |
| `cron.runJob(name: any)` | `boolean` | Runs job. |
| `cron.runAll()` | `object` | Runs each current job and returns results keyed by job name without intermediate result buffers. |
| `cron.validateSchedule(schedule: any)` | `boolean` | Validates schedule. |
| `cron.calculateNextRun(schedule: string)` | `time.Time` |  |
| `cron.start()` | `chan any` | Starts a scheduler loop; concurrent loops claim each due job only once. |
| `cron.stop(done: chan any)` | `void` | Stops the resource. |
| `cron.checkJobs()` | `void` |  |
| `cron.getJobs()` | `array` | Returns job snapshots using the same shape as `getJob`. |
| `cron.getJob(name: any)` | `object` | Returns the named job snapshot as a regular OSL object, or `null` when absent. |
| `cron.getJobCount()` | `number` | Returns job count. |
| `cron.isEnabled(name: any)` | `boolean` |  |
| `cron.getLastRun(name: any)` | `number` | Returns the last-run Unix timestamp, or `0` when absent. |
| `cron.getNextRun(name: any)` | `number` | Returns the next-run Unix timestamp, or `0` when absent. |
| `cron.getRunCount(name: any)` | `number` | Returns the completed run count, or `0` when absent. |
| `cron.runOnce()` | `object` | Runs once. |
| `cron.clear()` | `void` | Clears all stored values. |

## Notes

- Prefer `import "std:cron"`; the older `import "osl/cron"` spelling remains supported.

## Behavior and limits

Schedules accept names, ranges, lists, and steps. Invalid schedules return an error instead of
stopping the program. The scheduler will not start a second scheduled run of a job that is still
running. Calls to `runJob` are independent and can overlap. Calling `stop` more than once is safe.
