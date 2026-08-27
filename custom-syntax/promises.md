# Promises

OSL scripts run synchronously by default, so a slow command blocks everything after it. A promise runs work asynchronously. This is useful for slow operations such as [network requests](https://osl.mistium.com/methods/networking/.httpget).

### Creating promises

`Promise.new` takes the function to run asynchronously.
```javascript
def fetch() (
  // Fetches a large text file
  response = "https://raw.githubusercontent.com/RoturTW/web/refs/heads/main/ram.web/assets/1mb.ram".httpGet()
)

Promise.new(fetch)
```
The function may also be [defined inline](https://osl.mistium.com/custom-syntax/inline):
```javascript
// Functionally identical to the script above.
Promise.new(def() -> (
  response = "https://raw.githubusercontent.com/RoturTW/web/refs/heads/main/ram.web/assets/1mb.ram".httpGet()
))
```

### Chaining promises

Keep a reference to the promise when code needs to inspect it or run another function after it finishes.

```javascript
myPromise @= Promise.new(fetch)
```

The `then` method takes a function and runs it after the promise finishes. Multiple `then` calls run in the order they were added.

```javascript
myPromise.then(def() -> (
  // Log the fetched data only after the promise has been fulfilled.
  log response
))
```
You can also chain directly onto the promise object.
```javascript
// Returns 1, 2, 3
void Promise.new(def() -> (
  log 1
))
.then(def() -> (
  log 2
))
.then(def() -> (
  log 3
))
```

Store intermediate values on `self` when a later function needs them:

```javascript
calculate @= Promise.new(def() -> (
  self.answer = 10 + 5
))

calculate.then(def() -> (
  log self.answer
))
```

Prefer returning a value when the next function only needs the result:

```javascript
void Promise.new(def() -> (
  return 10
))
.then(def(data) -> (
  log data
))
```

The returned value becomes the argument to the next function, so this example logs `10`.

### Worker variables

Promises expose these worker values:

| Variable | Type | Description |
|----------|------|-------------|
| `alive` | Boolean | Returns false if the promise has concluded, otherwise return true. |
| `createdTime` | Number | The timestamp at which the promise was first created. |
| `processTime` | Number | How long it took to run the promise, in seconds. |

Access these values through the promise's `worker` property. Values assigned to `self` also appear there without the `self` prefix.

```javascript
secret @= Promise.new(def() -> (
  log alive
  log createdTime
  self.favoriteAnimal = "cat"
  self.favoriteOS = "originOS"
  return self.favoriteOS
))

log secret.worker.alive
log secret.worker.favoriteAnimal
log secret.worker.return
```

### Promises and `mainloop`

The main script does not wait for promises before exiting. Use a [main loop](https://osl.mistium.com/basics/the-execution-loop) to keep the program alive while a promise runs.

```javascript
myPromise @= Promise.new(def() -> (
  return 45 / 5
))

myPromise.then(def() -> (
  log return
))

// Despite being nearly instant, a mainloop is still required to give the promise time to run it's course.
mainloop:
if myPromise.worker.alive.not() "window.close()"
```
