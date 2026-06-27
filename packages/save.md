# save

> Persistent per-app key-value storage under a shared app data root

```javascript
import "osl/save"
```

## Methods

- `save.init(appName)` → `boolean`
- `save.OSL_path(filename)` → `string`
- `save.setItem(filename, value)` → `string`
- `save.getItem(filename)` → `object`
- `save.exists(filename)` → `boolean`
- `save.all()` → `array`
