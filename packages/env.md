# env

```osl
import "std:env"
```

## Methods

- `env.home()` → `string`
- `env.cwd()` → `string`
- `env.file(path)` → `*env.File`
- `env.read(path)` → `*env.File`
- `env.parse(text)` → `*env.File`
- `env.from(values)` → `*env.File`
- `env.stringify(values)` → `string`
- `env.load(...paths)` → `boolean`
- `env.overload(...paths)` → `boolean`
- `env.local()` → `boolean`
- `env.localOverload()` → `boolean`
- `env.get(key)` → `string`
- `env.getDefault(key, def)` → `string`
- `env.value(key)` → `env.Value`
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

## Returned object: `env.Value`

Returned by `env` methods; call these on the value you get back.

- `value.key()` → `string`
- `value.exists()` → `boolean`
- `value.string()` → `string`
- `value.fallback(def)` → `string`
- `value.int(def)` → `number`
- `value.float(def)` → `number`
- `value.bool(def)` → `boolean`

## Returned object: `*env.File`

Returned by `env` methods; call these on the value you get back.

- `value.path()` → `string`
- `value.setPath(path)` → `*env.File`
- `value.loaded()` → `boolean`
- `value.read()` → `boolean`
- `value.load()` → `boolean`
- `value.overload()` → `boolean`
- `value.apply()` → `boolean`
- `value.applyOverload()` → `boolean`
- `value.save()` → `boolean`
- `value.text()` → `string`
- `value.all()` → `object`
- `value.keys()` → `array`
- `value.has(key)` → `boolean`
- `value.value(key)` → `env.Value`
- `value.get(key)` → `string`
- `value.getDefault(key, def)` → `string`
- `value.getInt(key, def)` → `number`
- `value.getFloat(key, def)` → `number`
- `value.getBool(key, def)` → `boolean`
- `value.set(key, value)` → `*env.File`
- `value.unset(key)` → `*env.File`
- `value.clear()` → `*env.File`
- `value.merge(values)` → `*env.File`
- `value.expand(key)` → `string`

## Complete API reference

### `env`

| Method | Returns | Notes |
| --- | --- | --- |
| `env.home()` | `string` |  |
| `env.cwd()` | `string` |  |
| `env.file(path: string)` | `*env.File` |  |
| `env.read(path: string)` | `*env.File` |  |
| `env.parse(text: string)` | `*env.File` | Parses input data. |
| `env.from(values: object)` | `*env.File` |  |
| `env.stringify(values: object)` | `string` | Serialises a value to text. |
| `env.load(...paths: string)` | `boolean` | Loads files in order without replacing existing environment values. |
| `env.overload(...paths: string)` | `boolean` | Loads files in order and replaces existing environment values. |
| `env.local()` | `boolean` |  |
| `env.localOverload()` | `boolean` |  |
| `env.get(key: string)` | `string` | Returns a value. |
| `env.getDefault(key: string, def: string)` | `string` | Returns default. |
| `env.value(key: string)` | `env.Value` |  |
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

### `*env.File` values

| Method | Returns | Notes |
| --- | --- | --- |
| `value.path()` | `string` |  |
| `value.setPath(path: string)` | `*env.File` | Sets path. |
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
| `value.value(key: string)` | `env.Value` |  |
| `value.get(key: string)` | `string` | Returns a value. |
| `value.getDefault(key: string, def: string)` | `string` | Returns default. |
| `value.getInt(key: string, def: number)` | `number` | Returns int. |
| `value.getFloat(key: string, def: number)` | `number` | Returns float. |
| `value.getBool(key: string, def: boolean)` | `boolean` | Returns bool. |
| `value.set(key: string, value: any)` | `*env.File` | Sets a value. |
| `value.unset(key: string)` | `*env.File` |  |
| `value.clear()` | `*env.File` | Clears all stored values. |
| `value.merge(values: object)` | `*env.File` |  |
| `value.expand(key: string)` | `string` |  |

### `env.Value` values

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
