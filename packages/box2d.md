# box2d

`osl/box2d` provides worlds, bodies, and box, circle, or polygon fixtures using a pure-Go engine.

```javascript
import "std:box2d"

world = box2d.newWorld({x: 0, y: 10})
ground = world.createBody({type: "static", x: 0, y: 10})
void ground.addBox(20, 1, {friction: 0.4})

player = world.createBody({type: "dynamic", x: 0, y: 0})
void player.addBox(1, 1, {density: 1, friction: 0.4})

loop 120 (
  void world.step(1.0 / 60)
)

log player.position()
```

## Package

- `box2d.vec(x, y)` creates a vector object.
- `box2d.newWorld(gravity)` creates a world. Gravity accepts `{x, y}` or `[x, y]`.

## World

- `createBody(options)` creates a `static`, `kinematic`, or `dynamic` body.
- `step(dt, velocityIterations?, positionIterations?)` advances the simulation. Defaults are 8 and 3.
- `gravity()` and `setGravity(vector)` read or change gravity.
- `bodyCount()` and `contactCount()` report world state.
- `destroyBody(body)` removes one body. `destroy()` invalidates the world.

Body options include `position`, `x`, `y`, `angle`, `velocity`, `angularVelocity`, damping,
`allowSleep`, `awake`, `fixedRotation`, `bullet`, `active`, and `gravityScale`.

## Body

- `addBox(width, height, options)`, `addCircle(radius, options)`, and `addPolygon(points, options)` add fixtures.
- Fixture options include `density`, `friction`, `restitution`, and `sensor`.
- `position()`, `angle()`, `linearVelocity()`, `mass()`, `bodyType()`, and `awake()` inspect state.
- `setTransform(position, angle)` and `setLinearVelocity(vector)` change state.
- `applyForce(vector)` and `applyImpulse(vector)` affect dynamic bodies.

Destroyed body handles return safe zero values or `false` instead of accessing invalid engine state.
