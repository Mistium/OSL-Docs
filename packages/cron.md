# cron

> Cron-style job scheduling

Use `cron` to register named jobs, run them manually, or keep a scheduler loop checking cron-style schedules.

```javascript
import "osl/cron"
```

## API reference

### `cron`

| Method | Returns | Description |
| --- | --- | --- |
| `cron.create()` | `*Cron` | Creates a new value. |
| `cron.addJob(name: any, schedule: any, callback: any)` | `boolean` | Adds job. |
| `cron.removeJob(name: any)` | `boolean` | Removes job. |
| `cron.enableJob(name: any)` | `boolean` | Enables an existing job. |
| `cron.disableJob(name: any)` | `boolean` | Disables an existing job through the same synchronized state update. |
| `cron.runJob(name: any)` | `boolean` | Runs job. |
| `cron.runAll()` | `object` | Runs each current job and returns results keyed by job name without intermediate result buffers. |
| `cron.validateSchedule(schedule: any)` | `boolean` | Validates schedule. |
| `cron.calculateNextRun(schedule: string)` | `time.Time` | Runs the calculate next run operation. |
| `cron.start()` | `chan any` | Starts the resource. |
| `cron.stop(done: chan any)` | `void` | Stops the resource. |
| `cron.checkJobs()` | `void` | Runs the check jobs operation. |
| `cron.getJobs()` | `array` | Returns job snapshots using the same shape as `getJob`. |
| `cron.getJob(name: any)` | `object` | Returns the named job snapshot as a regular OSL object, or `null` when absent. |
| `cron.getJobCount()` | `number` | Returns job count. |
| `cron.isEnabled(name: any)` | `boolean` | Reports whether enabled. |
| `cron.getLastRun(name: any)` | `number` | Returns the last-run Unix timestamp, or `0` when absent. |
| `cron.getNextRun(name: any)` | `number` | Returns the next-run Unix timestamp, or `0` when absent. |
| `cron.getRunCount(name: any)` | `number` | Returns the completed run count, or `0` when absent. |
| `cron.runOnce()` | `object` | Runs once. |
| `cron.clear()` | `void` | Clears all stored values. |

## Notes

- Standard-library imports accept both `import "osl/cron"` and `import "cron"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.

## Edge-case behavior

Cron parsing supports names, ranges, lists, and steps with controlled errors.
Jobs are safe to mutate concurrently, and repeated stops are harmless.
