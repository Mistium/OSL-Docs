# Clone Objects And References

## Basic Concepts

OSL provides two ways to assign arrays and objects:
- `=` creates a deep clone (complete copy)
- `@=` creates a reference (points to the same data)

## Deep Cloning

When using `=`, OSL creates a complete copy of the object or array:

```javascript
// Objects
original = {x: 1, y: {z: 2}}
clone = original     // Creates a deep copy

clone.x = 10        // Only affects clone
clone.y.z = 20      // Only affects clone

log original.x      // Still 1
log original.y.z    // Still 2

// Arrays
arr1 = [1, 2, [3, 4]]
arr2 = arr1         // Creates a deep copy

arr2[1] = 10        // Only affects arr2
arr2[3][1] = 40    // Only affects arr2

log arr1[1]         // Still 1
log arr1[3][1]      // Still 4
```

## References

Using `@=` creates a reference to the original data:

```javascript
// Objects
original = {x: 1, y: {z: 2}}
reference @= original    // Creates a reference

reference.x = 10        // Affects both objects
reference.y.z = 20      // Affects both objects

log original.x          // Now 10
log original.y.z        // Now 20

// Arrays
arr1 = [1, 2, [3, 4]]
arr2 @= arr1           // Creates a reference

arr2[1] = 10           // Affects both arrays
arr2[3][1] = 40       // Affects both arrays

log arr1[1]            // Now 10
log arr1[3][1]         // Now 40
```

## When to Use Each

- Use `=` when you need a separate copy that can be modified independently
- Use `@=` when you want multiple variables to point to the same data
- Use `=` to prevent accidental modifications to the original
- Use `@=` to save memory when working with large data structures

## Important Notes

- `=` creates a complete copy of all nested structures
- `@=` maintains a single copy with multiple references
- Modifying a reference affects all variables pointing to the same data
- References are useful for passing large objects efficiently
- Deep clones are safer but use more memory 