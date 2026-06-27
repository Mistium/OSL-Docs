# cron

> Task scheduling utilities

```javascript
import "osl/cron"
```

## Methods

- `cron.create()` → `Cron`
- `cron.addJob(name, schedule, callback)` → `boolean`
- `cron.removeJob(name)` → `boolean`
- `cron.enableJob(name)` → `boolean`
- `cron.disableJob(name)` → `boolean`
- `cron.runJob(name)` → `boolean`
- `cron.runAll()` → `object`
- `cron.start()` → `channel`
- `cron.stop(done)`
- `cron.getJobs()` → `array`
- `cron.getJob(name)` → `object`
- `cron.getJobCount()` → `number`
- `cron.isEnabled(name)` → `boolean`
- `cron.getLastRun(name)` → `number`
- `cron.getNextRun(name)` → `number`
- `cron.getRunCount(name)` → `number`
- `cron.runOnce()` → `object`
- `cron.clear()`
