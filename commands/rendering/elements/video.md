# Video

## Creating a Video Element

By using the `video` [command](https://osl.mistium.com/#commands), videos can be displayed an OSL program. To initialize a video, simply render it using the following syntax:

```javascript
// video url width height
// "height" argument is optional
url = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/Resources/gifs/badapplefull.mp4"
video url 300 400
```

OSL handles all the fetching and loading of videos internally the first time a URL is used. However, videos take a while to load; you may notice that when running the example script above, the screen will be black for several frames while the video initializes. To work around this, we can initialize the video *before* it's displayed by using the "load" argument.

```javascript
// video "load" url id
url = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/Resources/gifs/badapplefull.mp4"
video "load" url "my_video"
```

## Manipulating a Video Element

To manipulate a video's state, we first need to identify the video's ID. All videos created in OSL have a video ID. Typically, this ID is just the same as the URL you used to initialize the video. However, when pre-loading a video using the "load" argument, a custom ID can be chosen for the video.

### "Pause" and "Play"

You may notice that when loading a video, it doesn't begin playing right away. That's because when initialized, a video begins paused; to unpause it, the "play" command must be called. Inversely, the "pause" command can return the video to a non-playing state.

```javascript
video "videoID_here" "play"

video "videoID_here" "pause"
```

### "Seek"

To seek (or jump to a specific part of) a video, the aptly named "seek" argument is used. By specifying a time in seconds, we can start the video at that point. Note that if the video was paused before calling "seek," this command resumes playback—the video can be paused after using "seek" to mitigate this.

```javascript
// Starts the video at 10 seconds
video "videoID_here" "seek" 10
```

### "Volume" and "Speed"

By using the "volume" and "speed" commands, we can tinker with those values as well. By default, volume is set to 100 and playback speed is set to 1.

```javascript
// Slows the video to half speed, then to x2 speed.
video "videoID_here" "speed" .5
video "videoID_here" "speed" 2

// Mutes the video.
video "videoID_here" "volume" 0
```

### "Clear"

To clear a video from memory, the "clear" argument can be used.

```javascript
url = "https://raw.githubusercontent.com/Mistium/Origin-OS/main/Resources/gifs/badapplefull.mp4"
video "load" url "my_video"

// Removes the video from memory.
video url "clear"
```

## Video Info

By using the `.videoInfo()` [method](https://osl.mistium.com/#methods) after the video ID, information about the respective video can be accessed. The method takes one argument, which specifies which data to return.

| Method | Type | Description |
| --- | --- | --- |
| `.videoInfo("loaded")` | Boolean | Returns whether a video has been fully initialized or not. |
| `.videoInfo("playing")` | Boolean | Returns if a video is actively playing content; in other words, checks if the video is paused or not. |
| `.videoInfo("width")` | Number | Return the video's width in pixels. |
| `.videoInfo("height")` | Number | Return the video's height in pixels. |
| `.videoInfo("current_time")` | Number | Return the current time of the video in seconds. |
| `.videoInfo("duration")` | Number | Return the runtime of the video in seconds. |
| `.videoInfo("volume")` | Number | Returns the volume of the video; defaults to 100, but can be set using the "volume" argument above. |
