# Local DB

## Description

The Local DB system provides access to the browser's local storage, allowing you to store and retrieve data that persists between page refreshes and browser sessions.

## Methods

### localDbGet(key)

Retrieves a value from local storage by key.

```javascript
// Get a simple value
score = localDbGet("highscore")
if score == null (
  score = 0  // Default value if nothing stored
)

// Get an object
settings = localDbGet("userPrefs")
if settings (
  theme = settings.theme
  volume = settings.volume
)

// Using nullish coalescing for defaults
highScore = localDbGet("highscore") ?? 0
```

### localDbSet(key, value)

Stores a value in local storage under a specified key.

```javascript
// Store a simple value
localDbSet("highscore", 100)

// Store an object
settings = {
  theme: "dark",
  volume: 0.8
}
localDbSet("userPrefs", settings)

// Store an array
favorites = ["red", "blue", "green"]
localDbSet("favoriteColors", favorites)
```

### localDbDel(key)

Deletes a value from local storage by key.

```javascript
// Delete a single value
localDbDel("highscore")

// Delete user preferences
localDbDel("userPrefs")

// Example: Clear data when user logs out
localDbDel("userPrefs")
localDbDel("highscore")
localDbDel("favoriteColors")
```

## Complete Example

```javascript
// Save user preferences
prefs = {
  theme: "dark",
  volume: 0.8
}
localDbSet("userPrefs", prefs)

// Later retrieve preferences
saved = localDbGet("userPrefs")
if saved (
  theme = saved.theme
  volume = saved.volume
)

// Save high score if better than previous
if score > localDbGet("highscore") ?? 0 (
  localDbSet("highscore", score)
)
```

## Important Notes

- Data is stored in the user's browser local storage
- Data persists between page refreshes and browser sessions
- Storage is limited to the browser's local storage capacity
- Data is specific to the domain/origin of the page
- Values are automatically serialized to JSON when stored
- Returns `null` if a key doesn't exist
