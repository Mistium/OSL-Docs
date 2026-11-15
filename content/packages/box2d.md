---
description: Simulate rigid bodies falling, colliding and coming to rest with Box2D, and read their positions back as numbers.
package: box2d
---

# box2d

`std:box2d` is a 2D physics engine. You build a world, put bodies in it, give each body a shape, and call `advance` once per frame. The engine moves the bodies, resolves collisions and tells you where everything ended up. Use it for games, toys and anything where things should stack, bounce and slide.

The engine draws nothing. It works in plain numbers, so it runs, and can be tested, without a window. Pair it with [window](window.md) or [raylib](raylib.md) to show the bodies.

```osl fragment
import "std:box2d"
```

## A world and a body

`box2d.new()` makes an empty world. By default gravity is `{x: 0, y: 9.8}`, and y points down, like a screen. `createBody` adds a body and `addCircle` gives it a shape:

```osl
import "std:box2d"

auto world = box2d.new()
log world.gravity()

auto ball = world.createBody({type: "dynamic", position: {x: 0, y: 0}})
ball.addCircle(0.5).unwrap()

log world.bodyCount()
log ball.bodyType()
log ball.position()
```

```output
{"x":0,"y":9.8}
1
dynamic
{"x":0,"y":0}
```

Positions are in world units, not pixels. Pick a scale (say one unit is one metre, or 50 pixels) and convert when you draw. Shape functions return a `result`, so call `.unwrap()` or handle the failure.

## Body types

A body is one of three types:

- `"static"` (the default) never moves: floors, walls, platforms.
- `"dynamic"` is pushed around by gravity, forces and collisions.
- `"kinematic"` moves at the velocity you give it and ignores forces: moving platforms.

Shapes are `addBox(width, height)`, `addCircle(radius)` and `addPolygon(points)`, a convex polygon of 3 to 8 points. A body with no shape has no mass and collides with nothing.

## Advancing time

`world.advance(ms)` runs the simulation forward by that many milliseconds. Call it once per frame with the frame's duration. Here a ball falls onto a floor, 60 frames a second for two seconds:

```osl
import "std:box2d"

auto world = box2d.new()
auto floor = world.createBody({position: {x: 0, y: 10}})
floor.addBox(40, 1).unwrap()

auto ball = world.createBody({type: "dynamic"})
ball.addCircle(0.5, {restitution: 0.3}).unwrap()

for frame in 1 to 120 (
  world.advance(1000 / 60).unwrap()
  if frame % 30 == 0 (
    log "frame " ++ frame ++ ": y = " ++ round(ball.position().y, 2)
  )
)
```

```output
frame 30: y = 1.27
frame 60: y = 4.98
frame 90: y = 8.51
frame 120: y = 8.53
```

The floor is a box 1 unit tall centred on y = 10, so its top is at 9.5, and the ball touches it when its centre is at about 9. It lands a little after frame 80, bounces up a short way (restitution 0.3) and settles back. Use a fixed step like this, not the real elapsed time, if you want the same result on every run.

## Shape options

Every shape takes the same options:

- `density` (default 1) decides the body's mass together with the shape's area.
- `friction` (default 0.2) is how much surfaces grip.
- `restitution` is bounciness. 0 does not bounce, 1 keeps all its speed.
- `sensor: true` detects touching without colliding.

```osl
import "std:box2d"

auto world = box2d.new()
auto light = world.createBody({type: "dynamic"})
light.addBox(1, 1, {density: 1}).unwrap()
auto heavy = world.createBody({type: "dynamic"})
heavy.addBox(1, 1, {density: 5}).unwrap()

log light.mass()
log heavy.mass()
```

```output
1
5
```

## Resting and sleeping

A body that stops moving falls asleep, so the engine spends no time on it. `isAwake()` tells you, and `contactCount()` says how many shape pairs are touching:

```osl
import "std:box2d"

auto world = box2d.new({gravity: box2d.vec(0, 10)})
auto floor = world.createBody({position: {x: 0, y: 10}})
floor.addBox(40, 1).unwrap()
auto crate = world.createBody({type: "dynamic"})
crate.addBox(1, 1, {friction: 0.5}).unwrap()

for _ in 1 to 240 ( world.advance(1000 / 60).unwrap() )
log "y:" round(crate.position().y, 2)
log "awake:" crate.isAwake()
log "contacts:" world.contactCount()
```

```output
y: 8.99
awake: false
contacts: 1
```

The crate came to rest with its centre at about 9: the floor's top is at 9.5 and the crate is 0.5 from its centre to its bottom. `box2d.vec(x, y)` builds the `{x, y}` vector that gravity, forces and velocities use. Pass `allowSleep: false` to `createBody` to keep a body awake.

## Pushing bodies

`applyImpulse` changes a body's velocity at once (an impulse is mass times velocity). `applyForce` pushes for the next `advance`, so call it every frame for a steady push. Both wake a sleeping body. `setLinearVelocity` sets the speed directly:

```osl
import "std:box2d"

auto world = box2d.new({gravity: box2d.vec(0, 0)})
auto puck = world.createBody({type: "dynamic"})
puck.addCircle(0.5).unwrap()

puck.applyImpulse({x: 3, y: 0}).unwrap()
log puck.linearVelocity()

puck.setLinearVelocity({x: 0, y: -2}).unwrap()
for _ in 1 to 60 ( world.advance(1000 / 60).unwrap() )
log round(puck.position().y, 2)
```

```output
{"x":3.819718634205488,"y":0}
-2
```

With zero gravity and nothing in the way, the puck keeps its velocity: it moved 2 units up in one second. The puck has a mass of about 0.785 (density 1 times the circle's area), which is why an impulse of 3 gave a velocity of about 3.8.

## Placing bodies

Set where a body starts with `position`, `angle`, `velocity` and `angularVelocity` in `createBody`, and move it later with `setTransform(position, angle)`:

```osl
import "std:box2d"

auto world = box2d.new()
auto crate = world.createBody({
  type: "dynamic",
  position: {x: 4, y: 1},
  angle: 0.5
})
crate.addBox(1, 1).unwrap()
log crate.position() round(crate.angle(), 2)

crate.setTransform({x: 0, y: 0}, 0).unwrap()
log crate.position() crate.angle()
```

```output
{"x":4,"y":1} 0.5
{"x":0,"y":0} 0
```

## Destroying things

`body.destroy()` removes one body, and `world.destroy()` frees the whole world and every body in it. Using a destroyed body is an error, but you can check first:

```osl
import "std:box2d"

auto world = box2d.new()
auto ball = world.createBody({type: "dynamic"})
ball.addCircle(1).unwrap()

world.destroy().unwrap()
log world.isDestroyed() ball.isDestroyed()

auto added = ball.addBox(1, 1)
log added.isErr()
log added.unwrapErr().kind
```

```output
true true
true
StateError
```

Bad arguments, like a box with no width, are not results: they throw a `ValueError`.

> [!tip]
> A good game loop keeps the physics step fixed (1000 / 60 milliseconds) and draws as fast as the screen allows. If the frame took longer, call `advance` more than once.

:::quiz
A body made with `createBody({type: "static"})` is hit by a falling ball. What does the static body do?

- [ ] It falls too.
- [x] It stays where it is, and the ball bounces off or rests on it.
- [ ] It is destroyed.

Static bodies never move: floors, walls and platforms.
:::

:::exercise title="One second of free fall"
Drop a circle from y = 0 with no floor, advance 60 frames of 1000 / 60 milliseconds, and print its y rounded to a whole number. Gravity is the default, 9.8.

```osl
import "std:box2d"

auto world = box2d.new()
auto ball = world.createBody({type: "dynamic"})
ball.addCircle(0.5).unwrap()

log ball.position().y
```

```output
5
```

> [!hint]
> `for _ in 1 to 60 ( world.advance(1000 / 60).unwrap() )` runs the frames.

> [!hint]
> `round(value)` rounds to a whole number.

```osl solution
import "std:box2d"

auto world = box2d.new()
auto ball = world.createBody({type: "dynamic"})
ball.addCircle(0.5).unwrap()

for _ in 1 to 60 ( world.advance(1000 / 60).unwrap() )
log round(ball.position().y)
```

```output
5
```
:::

## API reference

::api
