# Sound System

OSL provides a comprehensive sound system for loading, playing, and manipulating audio in your applications.

> **Note**: Sound handling requires OriginOS version 4.6.4 or later.

## Basic Commands

### Loading Sounds

Load a sound into RAM from a URL or data URI:

```javascript
sound "url" "load" "name"
```

### Playback Control

```javascript
// Play from beginning
sound "url"/"name" "play"

// Pause playback
sound "url"/"name" "pause"

// Resume playback
sound "url"/"name" "unpause"

// Start at specific time
sound "url"/"name" "start" time

// Remove sound from memory
sound "url"/"name" "clear"
```

### Sound Properties

```javascript
// Adjust volume (0-1)
sound "url"/"name" "volume" int

// Change playback speed (default: 1)
sound "url"/"name" "speed" int
```

## Sound Information Methods

```javascript
// Check if sound is loaded
"sound_name".soundinfo("loaded")    // Returns boolean

// Get sound duration
"sound_name".soundinfo("duration")  // Returns seconds

// Get current playback position
"sound_name".soundinfo("current_time")

// Get current volume
"sound_name".soundinfo("volume")

// Get current pitch
"sound_name".soundinfo("pitch")

// Check if sound is playing
"sound_name".soundinfo("playing")   // Returns boolean
```

## Multiple Sound Support

You can pass multiple sounds in an array to apply commands to multiple sounds simultaneously:

```javascript
// Pause multiple sounds
sound ["sound1", "sound2"] "pause"

// Adjust volume for multiple sounds
sound ["background", "effects"] "volume" 0.5
```

## Example Usage

### Basic Sound Player

```javascript
// Load sound
sound_url = "https://example.com/music.mp3"
sound sound_url "load" "background_music"

// Play when loaded
if "background_music".soundinfo("loaded") (
    sound "background_music" "play"
)
```

### Advanced Sound Control

```javascript
// Load multiple sounds
sound "effect.wav" "load" "effect1"
sound "music.mp3" "load" "music"

mainloop:
    // Check if music is playing
    if "music".soundinfo("playing").not (
        // Start music if not playing
        sound "music" "play"
        sound "music" "volume" 0.7
    )
    
    // Play effect on spacebar
    if " ".isKeyDown() (
        sound "effect1" "play"
    )
```

### Sound Progress Tracker

```javascript
sound "song.mp3" "load" "current_song"

mainloop:
    if "current_song".soundinfo("loaded") (
        current = "current_song".soundinfo("current_time")
        total = "current_song".soundinfo("duration")
        progress = current / total
        
        // Display progress bar
        bar 200 20 5 progress
    )
```

## Important Notes

- Always check if sounds are loaded before playing
- Sound URLs can be external or data URIs
- Volume values range from 0 to 1
- Default playback speed is 1
- Multiple sounds can be controlled simultaneously using arrays
- Sound names must be unique when loading
- Memory management is important - clear unused sounds
- Sound availability depends on browser and system support 