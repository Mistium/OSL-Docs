# env

```osl
import "std:env"
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

## Complete API reference

### `env`

| Method | Returns | Notes |
| --- | --- | --- |
| `env.home()` | `string` |  |
| `env.cwd()` | `string` |  |
| `env.file(path: string)` | `*envFile` |  |
| `env.read(path: string)` | `*envFile` |  |
| `env.parse(text: string)` | `*envFile` | Parses input data. |
| `env.from(values: object)` | `*envFile` |  |
| `env.stringify(values: object)` | `string` | Serialises a value to text. |
| `env.load(...paths: string)` | `boolean` | Loads files in order without replacing existing environment values. |
| `env.overload(...paths: string)` | `boolean` | Loads files in order and replaces existing environment values. |
| `env.local()` | `boolean` |  |
| `env.localOverload()` | `boolean` |  |
| `env.get(key: string)` | `string` | Returns a value. |
| `env.getDefault(key: string, def: string)` | `string` | Returns default. |
| `env.value(key: string)` | `envValue` |  |
| `env.getInt(key: string, def: number)` | `number` | Returns int. |
| `env.getFloat(key: string, def: number)` | `number` | Returns float. |
| `env.getBool(key: string, def: boolean)` | `boolean` | Returns bool. |
| `env.has(key: string)` | `boolean` |  |
| `env.set(key: string, value: any)` | `boolean` | Sets a value. |
| `env.unset(key: string)` | `boolean` |  |
| `env.require(key: string)` | `string` |  |
| `env.required(...keys: string)` | `boolean` |  |
| `env.missing(...keys: string)` | `array` |  |
| `env.all()` | `object` |  |
| `env.keys()` | `array` | Returns all keys. |
| `env.expand(value: string)` | `string` |  |
| `env.mode()` | `string` |  |
| `env.isDev()` | `boolean` |  |
| `env.isProd()` | `boolean` |  |
| `env.isTest()` | `boolean` |  |

### `envFile` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.path()` | `string` |  |
| `value.setPath(path: string)` | `*envFile` | Sets path. |
| `value.loaded()` | `boolean` |  |
| `value.read()` | `boolean` |  |
| `value.load()` | `boolean` | Reads and applies the file without replacing existing values. |
| `value.overload()` | `boolean` | Reads and applies the file, replacing existing values. |
| `value.apply()` | `boolean` | Applies parsed values without replacing existing values. |
| `value.applyOverload()` | `boolean` | Applies parsed values, replacing existing values. |
| `value.save()` | `boolean` |  |
| `value.text()` | `string` |  |
| `value.all()` | `object` |  |
| `value.keys()` | `array` | Returns all keys. |
| `value.has(key: string)` | `boolean` |  |
| `value.value(key: string)` | `envValue` |  |
| `value.get(key: string)` | `string` | Returns a value. |
| `value.getDefault(key: string, def: string)` | `string` | Returns default. |
| `value.getInt(key: string, def: number)` | `number` | Returns int. |
| `value.getFloat(key: string, def: number)` | `number` | Returns float. |
| `value.getBool(key: string, def: boolean)` | `boolean` | Returns bool. |
| `value.set(key: string, value: any)` | `*envFile` | Sets a value. |
| `value.unset(key: string)` | `*envFile` |  |
| `value.clear()` | `*envFile` | Clears all stored values. |
| `value.merge(values: object)` | `*envFile` |  |
| `value.expand(key: string)` | `string` |  |

### `envValue` values

| Method | Returns |
| --- | --- |
| `value.key()` | `string` |
| `value.exists()` | `boolean` |
| `value.string()` | `string` |
| `value.fallback(def: string)` | `string` |
| `value.int(def: number)` | `number` |
| `value.float(def: number)` | `number` |
| `value.bool(def: boolean)` | `boolean` |

## Notes

- Prefer `import "std:env"`; the older `import "osl/env"` spelling remains supported.

## Behavior and limits

The parser accepts a UTF-8 BOM, CRLF line endings, and quoted values. It detects expansion cycles.
When a file repeats a key, the later value wins. Typed getters return their fallback for missing or
malformed values. Key lists are sorted.
