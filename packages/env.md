# env

> .env file loader and typed environment helper for OSL

```javascript
import "osl/env"
```

## Methods

- `env.home()` → `string`
- `env.cwd()` → `string`
- `env.file(path)` → `envFile`
- `env.read(path)` → `envFile`
- `env.parse(text)` → `envFile`
- `env.from(values)` → `envFile`
- `env.stringify(values)` → `string`
- `env.load(...paths)` → `boolean`
- `env.overload(...paths)` → `boolean`
- `env.local()` → `boolean`
- `env.localOverload()` → `boolean`
- `env.get(key)` → `string`
- `env.getDefault(key, def)` → `string`
- `env.value(key)` → `OSLenvValue`
- `env.getInt(key, def)` → `number`
- `env.getFloat(key, def)` → `number`
- `env.getBool(key, def)` → `boolean`
- `env.has(key)` → `boolean`
- `env.set(key, value)` → `boolean`
- `env.unset(key)` → `boolean`
- `env.require(key)` → `string`
- `env.required(...keys)` → `boolean`
- `env.missing(...keys)` → `array`
- `env.all()` → `object`
- `env.keys()` → `array`
- `env.expand(value)` → `string`
- `env.mode()` → `string`
- `env.isDev()` → `boolean`
- `env.isProd()` → `boolean`
- `env.isTest()` → `boolean`

## Returned object: `envValue`

Returned by `env` methods; call these on the value you get back.

- `envValue.key()` → `string`
- `envValue.exists()` → `boolean`
- `envValue.string()` → `string`
- `envValue.fallback(def)` → `string`
- `envValue.int(def)` → `number`
- `envValue.float(def)` → `number`
- `envValue.bool(def)` → `boolean`

## Returned object: `envFile`

Returned by `env` methods; call these on the value you get back.

- `envFile.path()` → `string`
- `envFile.setPath(path)` → `envFile`
- `envFile.loaded()` → `boolean`
- `envFile.read()` → `boolean`
- `envFile.load()` → `boolean`
- `envFile.overload()` → `boolean`
- `envFile.apply()` → `boolean`
- `envFile.applyOverload()` → `boolean`
- `envFile.save()` → `boolean`
- `envFile.text()` → `string`
- `envFile.all()` → `object`
- `envFile.keys()` → `array`
- `envFile.has(key)` → `boolean`
- `envFile.value(key)` → `OSLenvValue`
- `envFile.get(key)` → `string`
- `envFile.getDefault(key, def)` → `string`
- `envFile.getInt(key, def)` → `number`
- `envFile.getFloat(key, def)` → `number`
- `envFile.getBool(key, def)` → `boolean`
- `envFile.set(key, value)` → `envFile`
- `envFile.unset(key)` → `envFile`
- `envFile.clear()` → `envFile`
- `envFile.merge(values)` → `envFile`
- `envFile.expand(key)` → `string`
