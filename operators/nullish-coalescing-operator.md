# Nullish Coalescing Operator (??)

The nullish coalescing operator (`??`) provides a way to define a fallback value when dealing with `null` values. It returns the right-hand operand when the left-hand operand is `null`, otherwise it returns the left-hand operand.

## Syntax

```javascript
leftExpr ?? rightExpr
```

## Description

The `??` operator is particularly useful when you want to provide default values for potentially null variables or expressions. Unlike logical OR (`||`), which returns the right-hand operand for any falsy value (including `0`, `""`, `false`), the nullish coalescing operator only does this for `null` values.

This makes it ideal for cases where `0`, empty strings, or `false` are valid values that should be preserved.

## Examples

### Basic Usage

```javascript
// With variables that might be null
username = null
defaultName = "Guest"

displayName = username ?? defaultName
log displayName  // Outputs: "Guest"

// With non-null values
username = "Alice"
displayName = username ?? defaultName
log displayName  // Outputs: "Alice"
```

### Comparison with Logical OR

```javascript
// Nullish coalescing preserves falsy values that aren't null
score = 0
defaultScore = 100

// Using ??
finalScore = score ?? defaultScore
log finalScore  // Outputs: 0 (preserves the 0)

// Using ||
finalScore = score || defaultScore
log finalScore  // Outputs: 100 (treats 0 as falsy)
```

### Working with Objects

```javascript
// Accessing potentially missing object properties
user = {
  name: "Alice",
  age: 30
}

// If bio doesn't exist, use a default
bio = user.bio ?? "No bio available"
log bio  // Outputs: "No bio available"
```

### Working with Database Values

```javascript
// Getting values from a database with fallbacks
highScore = localDbGet("highscore") ?? 0
log highScore  // Outputs: 0 if the value doesn't exist

// In conditionals
if score > (localDbGet("highscore") ?? 0) (
  localDbSet("highscore", score)
  log "New high score!"
)
```

### Chaining Nullish Coalescing

You can chain the `??` operator to try multiple fallback values:

```javascript
// Try multiple sources for a value
value = primarySource ?? backupSource ?? defaultValue

// Example with user preferences
fontSize = userPrefs.fontSize ?? siteDefaults.fontSize ?? 16
```

## Nullish Assignment (??=)

OSL also supports the nullish assignment operator (`??=`), which assigns the right-hand value only if the left-hand value is `null`:

```javascript
// Only assigns if the variable is null
variable ??= 10

// Equivalent to:
if variable == null (
  variable = 10
)
```

## Notes

- The `??` operator only considers `null` as the trigger for using the fallback value
- Empty strings, `0`, and `false` are all considered valid values and will not trigger the fallback
- The `??` operator has relatively low precedence, but explicit parentheses can be used for clarity
- The nullish coalescing operator is particularly useful when working with database values, API responses, or optional object properties 