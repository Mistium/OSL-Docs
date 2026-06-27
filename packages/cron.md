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
| `cron.enableJob(name: any)` | `boolean` | Runs the enable job operation. |
| `cron.disableJob(name: any)` | `boolean` | Runs the disable job operation. |
| `cron.runJob(name: any)` | `boolean` | Runs job. |
| `cron.runAll()` | `object` | Runs all. |
| `cron.validateSchedule(schedule: any)` | `boolean` | Validates schedule. |
| `cron.calculateNextRun(schedule: string)` | `time.Time` | Runs the calculate next run operation. |
| `cron.start()` | `chan any` | Starts the resource. |
| `cron.stop(done: chan any)` | `void` | Stops the resource. |
| `cron.checkJobs()` | `void` | Runs the check jobs operation. |
| `cron.getJobs()` | `array` | Returns jobs. |
| `cron.getJob(name: any)` | `object` | Returns job. |
| `cron.getJobCount()` | `number` | Returns job count. |
| `cron.isEnabled(name: any)` | `boolean` | Reports whether enabled. |
| `cron.getLastRun(name: any)` | `number` | Returns last run. |
| `cron.getNextRun(name: any)` | `number` | Returns next run. |
| `cron.getRunCount(name: any)` | `number` | Returns run count. |
| `cron.runOnce()` | `object` | Runs once. |
| `cron.clear()` | `void` | Clears all stored values. |

## Notes

- Standard-library imports accept both `import "osl/cron"` and `import "cron"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
