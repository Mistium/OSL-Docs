# Promises

By default, OSL scripts will run synchronously. This means that every line runs one after another in a sequence. However, this also means if one especially resource intensive command takes a while to run, the rest of the code will have to wait until after it's finished to execute. A similar issue occurs when trying to [fetch from the internet](https://osl.mistium.com/methods/networking/.httpget), which will almost always need the extra time to run.

Sometimes, it can be helpful to run a script asynchronously (also referred to as async). Promises provide an easy way to do just that.

### Creating Promises

To create a promise, we can use the Promise object with the method "new". This method takes one parameter, which is the function to be run async.
```javascript
def fetch() (
  // Fetches a large text file
  response = "https://raw.githubusercontent.com/RoturTW/web/refs/heads/main/ram.web/assets/1mb.ram".httpGet()
)

Promise.new(fetch)
```
This works, however it can be inconvienent to have to define a function for every promise. Instead, we can define the function [inline](https://osl.mistium.com/custom-syntax/inline):
```javascript
// Functionally identical to the script above.
Promise.new(def() -> (
  response = "https://raw.githubusercontent.com/RoturTW/web/refs/heads/main/ram.web/assets/1mb.ram".httpGet()
))
```

### Following Up Promises

We can now create asynchronous scripts, however the data they provide isn't very useful to us in this state. Remember, these scripts run completely independently from the rest of the program; as such, it's difficult to know exactly when a promise is wrapped up. Luckily, there's another method we can use to help. To access it though, we'll need a reference to the promise we just created.

```javascript
myPromise @= Promise.new(fetch)
```

Using this reference, we can call on the "then" method to run a follow-up script after the initial promise has concluded. Similarly to the prior method, this one takes only a function as the parameter. There's no limit to the amount of "then" statements that can be added to one promise; in the case that there are multiple, they will run in the order they were defined.

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

Oftentimes, it'll be important to transfer variables from the initial promise to the follow-up function. We can do this with global variables (such as in the above examples), but a much cleaner way to accomplish this would be to store it in the promise itself using the "self" object.

```javascript
calculate @= Promise.new(def() -> (
  self.answer = 10 + 5
))

calculate.then(def() -> (
  log self.answer
))
```

By far the cleanest way to transfer data to follow up functions is to return it.

```javascript
void Promise.new(def() -> (
  return 10
))
.then(def(data) -> (
  log data
))
```

This script will log 10 as the returned value was passed out of the first function and into the follow-ups.

### Worker Variables

Promises internally use the osl worker api, these are some values that are accessible through this api.

| Variable | Type | Description |
|----------|------|-------------|
| `alive` | Boolean | Returns false if the promise has concluded, otherwise return true. |
| `createdTime` | Number | The timestamp at which the promise was first created. |
| `processTime` | Number | How long it took to run the promise, in seconds. |

Any of these variables can also be accessed outside their respective promise by accessing the "worker" property in the referenced promise. Additionally, any variables created with the "self" object will appear here too, minus the "self" prefix.

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

### Promises and Mainloop

Another important thing to note about promises is that the main script will not wait for them to finish before ending the entire program. As such, promises may not work as expected without a [mainloop](https://osl.mistium.com/basics/the-execution-loop) in the project, as most promises will not be able to conclude in one frame before the program automatically shuts down.

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
