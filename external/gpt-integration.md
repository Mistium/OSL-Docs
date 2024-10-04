# GPT Integration

### Creating a new chat

```lua
name = gptNew()
```

### Resetting a chat

```lua
name.gptReset()
```

### Bot Setup

```lua
name.gptInform(data)
```

Example:

```lua
programmer = gptNew()
programmer.gptInform("You are a master programmer")

log programmer.gptSend("how do I print text in python?")
```

### Deleting a bot and it's chats

```lua
name.gptRemove()
```

### Sending a prompt to a bot

```lua
log name.gptSend(data)
```

Example:

```lua
test_bot = gptNew()
// create bot

say test_bot.gptSend("Hello! how are you?")
// Say the output from gpt
```

### Generating images

```lua
gpt "generate_img" "prompt"
```

#### Choose a specific model

```lua
gpt "generate_img" "prompt" "OpenJourney"
gpt "generate_img" "prompt" "Dreamshaper"
gpt "generate_img" "prompt" "Anything"
gpt "generate_img" "prompt" "Realistic"
```

Example:

```lua

my_image = ""
// setup the variables

mainloop:
// makes sure to run this every frame
if my_image == "" (
  gpt "generate_img" "A penguin on the moon"
  // Send to bot

  my_image = data
  // save the image url to a variable
)
image my_image 100
// draw the image

import "win-buttons"
// imports the window buttons
```

### Generate text with no context and no bots

```lua
say "hello, how are you?".gptGenerate()
// generates the text and says it
```

### Get chat history

```lua
history = name.gptHistory()
// grab the history of chats with a bot as a json array
// sets the history variable to a json array of your chats with a specific bot
```
