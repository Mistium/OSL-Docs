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

## Complete API reference

### `env`

| Method | Returns | Description |
| --- | --- | --- |
| `env.home()` | `string` | Runs the home operation. |
| `env.cwd()` | `string` | Runs the cwd operation. |
| `env.file(path: string)` | `*envFile` | Runs the file operation. |
| `env.read(path: string)` | `*envFile` | Runs the read operation. |
| `env.parse(text: string)` | `*envFile` | Parses input data. |
| `env.from(values: object)` | `*envFile` | Runs the from operation. |
| `env.stringify(values: object)` | `string` | Serialises a value to text. |
| `env.load(...paths: string)` | `boolean` | Runs the load operation. |
| `env.overload(...paths: string)` | `boolean` | Runs the overload operation. |
| `env.local()` | `boolean` | Runs the local operation. |
| `env.localOverload()` | `boolean` | Runs the local overload operation. |
| `env.get(key: string)` | `string` | Returns a value. |
| `env.getDefault(key: string, def: string)` | `string` | Returns default. |
| `env.value(key: string)` | `envValue` | Runs the value operation. |
| `env.getInt(key: string, def: number)` | `number` | Returns int. |
| `env.getFloat(key: string, def: number)` | `number` | Returns float. |
| `env.getBool(key: string, def: boolean)` | `boolean` | Returns bool. |
| `env.has(key: string)` | `boolean` | Reports whether the value exists. |
| `env.set(key: string, value: any)` | `boolean` | Sets a value. |
| `env.unset(key: string)` | `boolean` | Runs the unset operation. |
| `env.require(key: string)` | `string` | Runs the require operation. |
| `env.required(...keys: string)` | `boolean` | Runs the required operation. |
| `env.missing(...keys: string)` | `array` | Runs the missing operation. |
| `env.all()` | `object` | Runs the all operation. |
| `env.keys()` | `array` | Returns all keys. |
| `env.expand(value: string)` | `string` | Runs the expand operation. |
| `env.mode()` | `string` | Runs the mode operation. |
| `env.isDev()` | `boolean` | Reports whether dev. |
| `env.isProd()` | `boolean` | Reports whether prod. |
| `env.isTest()` | `boolean` | Reports whether test. |

### `envFile` values

Methods available on `envFile` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.OSLensure()` | `void` | Runs the oslensure operation. |
| `value.path()` | `string` | Runs the path operation. |
| `value.setPath(path: string)` | `*envFile` | Sets path. |
| `value.loaded()` | `boolean` | Runs the loaded operation. |
| `value.read()` | `boolean` | Runs the read operation. |
| `value.load()` | `boolean` | Runs the load operation. |
| `value.overload()` | `boolean` | Runs the overload operation. |
| `value.apply()` | `boolean` | Runs the apply operation. |
| `value.applyOverload()` | `boolean` | Runs the apply overload operation. |
| `value.save()` | `boolean` | Runs the save operation. |
| `value.text()` | `string` | Runs the text operation. |
| `value.all()` | `object` | Runs the all operation. |
| `value.keys()` | `array` | Returns all keys. |
| `value.has(key: string)` | `boolean` | Reports whether the value exists. |
| `value.value(key: string)` | `envValue` | Runs the value operation. |
| `value.get(key: string)` | `string` | Returns a value. |
| `value.getDefault(key: string, def: string)` | `string` | Returns default. |
| `value.getInt(key: string, def: number)` | `number` | Returns int. |
| `value.getFloat(key: string, def: number)` | `number` | Returns float. |
| `value.getBool(key: string, def: boolean)` | `boolean` | Returns bool. |
| `value.set(key: string, value: any)` | `*envFile` | Sets a value. |
| `value.unset(key: string)` | `*envFile` | Runs the unset operation. |
| `value.clear()` | `*envFile` | Clears all stored values. |
| `value.merge(values: object)` | `*envFile` | Runs the merge operation. |
| `value.expand(key: string)` | `string` | Runs the expand operation. |

### `envValue` values

Methods available on `envValue` values returned by this package or constructed by the language.

| Method | Returns | Description |
| --- | --- | --- |
| `value.key()` | `string` | Runs the key operation. |
| `value.exists()` | `boolean` | Reports whether the value or resource exists. |
| `value.string()` | `string` | Runs the string operation. |
| `value.fallback(def: string)` | `string` | Runs the fallback operation. |
| `value.int(def: number)` | `number` | Runs the int operation. |
| `value.float(def: number)` | `number` | Runs the float operation. |
| `value.bool(def: boolean)` | `boolean` | Runs the bool operation. |

## Notes

- Standard-library imports accept both `import "osl/env"` and `import "env"`.
- Return values such as `array` and `object` are regular OSL values unless a returned object section says otherwise.
