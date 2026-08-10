# Structs

Structs are compact, named value types. Unlike classes, structs are copied when assigned and compile to Go struct values rather than pointers or dynamic objects.

## Declaring a struct

Every field has a concrete type and a default value.

```javascript
struct Point (
  int x = 0
  int y = 0
)
```

Field names must be unique without regard to case. Struct bodies contain fields only; methods and inheritance belong to classes.

## Constructing values

Call the struct with no arguments to use every default, or supply one positional argument for every field in declaration order.

```javascript
Point origin = Point()
Point location = Point(10, 20)
```

Partial positional construction is rejected.

## Fields and value semantics

Fields are read and written with dot notation. Assignment copies the entire value, so later changes do not affect the original.

```javascript
Point first = Point(2, 3)
Point second = first
second.x = 9

log first.x   // 2
log second.x  // 9
```

Structs whose fields are comparable support native equality.

## Typed arrays

Struct arrays retain their concrete representation rather than becoming dynamic `array` values.

```javascript
Point[] points = []
points.append(Point(1, 2))
points.append(Point(3, 4))
points[2].y = 8

log points[2].y  // 8
```

Generated Go uses `[]OSL_Point`, avoiding maps, interfaces, pointers, and per-element allocations.
