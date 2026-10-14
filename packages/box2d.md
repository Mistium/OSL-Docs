# box2d

Use `box2d` for 2D rigid-body physics: worlds, static, dynamic, and kinematic bodies, and box,
circle, and polygon shapes. It uses a pure-Go engine.

```osl
import "std:box2d"
```

## Example

```osl
import "std:box2d"

auto world = box2d.new({gravity: {x: 0, y: 9.8}})

auto ground = world.createBody({position: {x: 0, y: 10}})
ground.addBox(20, 1, {friction: 0.4})

auto crate = world.createBody({type: "dynamic", position: {x: 0, y: 0}})
crate.addBox(1, 1, {density: 1, friction: 0.4, restitution: 0.2})

for i 120 (
  world.advance(1000 / 60)
)
log crate.position()
log crate.isAwake()
world.destroy()
```

With the default gravity `y` points down, so things fall down the screen. Distances are world
units; Box2D works best with metres for objects from 0.1 to 10 units across. Angles are radians.
Vectors (gravity, positions, velocities, forces, polygon points) are `{x, y}` objects.

## API reference

### `box2d`

| Function | Returns | Notes |
| --- | --- | --- |
| `box2d.new(options?)` | `*box2d.World` | An empty world. Option: `gravity` (`{x, y}`, default `{x: 0, y: 9.8}`). |
| `box2d.vec(x: number, y: number)` | `{x, y}` | A vector. |

### `*box2d.World`

| Method | Returns | Notes |
| --- | --- | --- |
| `world.createBody(options?)` | `*box2d.Body` | Adds a body. A body has no shape until `addBox`, `addCircle`, or `addPolygon` gives it one. |
| `world.advance(ms: number, options?)` | `result<unit, error>` | Runs the simulation forward by `ms` milliseconds. Call it once a frame with the frame's duration. Options: `velocityIterations` (8), `positionIterations` (3). |
| `world.gravity()` | `{x, y}` | |
| `world.setGravity(gravity: object)` | `result<unit, error>` | |
| `world.bodyCount()` | `int` | |
| `world.contactCount()` | `int` | Shape pairs touching or close to it. |
| `world.destroy()` | `result<unit, error>` | Frees the world and all its bodies. Destroying again does nothing. |
| `world.isDestroyed()` | `boolean` | |

`createBody` options:

| Option | Notes |
| --- | --- |
| `type` | `"static"` (default), `"dynamic"`, or `"kinematic"`. |
| `position` | `{x, y}`. Separate `x` and `y` options also work. |
| `angle` | Radians. |
| `velocity` | `{x, y}` units per second. |
| `angularVelocity` | Radians per second. |
| `linearDamping`, `angularDamping` | |
| `gravityScale` | Default 1. |
| `allowSleep`, `awake`, `active` | Default `true`. |
| `fixedRotation`, `bullet` | Default `false`. |

### `*box2d.Body`

| Method | Returns | Notes |
| --- | --- | --- |
| `body.addBox(width: number, height: number, options?)` | `result<unit, error>` | A rectangle centred on the body. |
| `body.addCircle(radius: number, options?)` | `result<unit, error>` | Extra option: `center` (`{x, y}` relative to the body). |
| `body.addPolygon(points: array, options?)` | `result<unit, error>` | A convex polygon with 3 to 8 points `{x, y}` relative to the body. |
| `body.position()` | `{x, y}` | |
| `body.angle()` | `number` | Radians. |
| `body.linearVelocity()` | `{x, y}` | Units per second. |
| `body.mass()` | `number` | Decided by the shapes' density and area. |
| `body.bodyType()` | `string` | `"static"`, `"dynamic"`, or `"kinematic"`. |
| `body.isAwake()` | `boolean` | Being simulated rather than resting asleep. A destroyed body isn't awake. |
| `body.setTransform(position: object, angle: number)` | `result<unit, error>` | |
| `body.setLinearVelocity(velocity: object)` | `result<unit, error>` | |
| `body.applyForce(force: object)` | `result<unit, error>` | Pushes the centre for the next `advance`, waking the body. |
| `body.applyImpulse(impulse: object)` | `result<unit, error>` | Changes velocity at once (mass times velocity), waking the body. |
| `body.destroy()` | `void` | Removes the body. Destroying again, or after the world was destroyed, does nothing. |
| `body.isDestroyed()` | `boolean` | Whether the body or its world has been destroyed. |

Shape options: `density` (default 1), `friction` (0.2), `restitution` (bounciness, 0), `sensor`
(detects contacts without colliding).

## Errors

Using a destroyed world, or a body whose world or self has been destroyed, is a `StateError`:
methods that return a result fail with it, and the others throw it. A negative `advance` duration, a
shape size or radius that isn't positive, or a polygon with fewer than 3 or more than 8 points
throws `ValueError`. A vector that isn't an `{x, y}` object, such as an array, throws `TypeError`.

## Changes from earlier versions

`box2d.newWorld(gravity)` is now `box2d.new({gravity})`, `world.step(seconds)` is
`world.advance(ms)`, `world.destroyBody(body)` is `body.destroy()`, and `body.awake()` is
`body.isAwake()`. Vectors are read only as `{x, y}` objects, not `[x, y]` arrays.
