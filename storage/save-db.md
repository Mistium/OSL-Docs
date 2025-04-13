# Save DB

In origin specifically, you can use the save system to store data in the user's account using files that will be stored in the "user/application data" folder.

This is not and will never be supported by the embed system on originOS

## Listing save data

```js
log saveContents()
// logs an array of the files in your save data
```

## Setting your save directory

{% code overflow="wrap" %}

```js
save "myapp@myusername" "set_directory"
// a basic app data directory example

// if you are unable to set your directory because it has already been used, the user will be prompted to allow or deny you access, if the user denys access, your app will be closed, if they allow it, your app will execute the rest of your code.
```

{% endcode %}

<figure><img src="https://github.com/user-attachments/assets/0a526978-e414-4400-8e1b-c8fc2eb37e0f" alt=""><figcaption><p>The application waiting for you to allow its access to a save directory</p></figcaption></figure>

## Create/Set a save file

This command will create the file if it doesn't exist, and update its value if the file does exist

```js
save "data.txt" "set" "Hello, World!"
// set a file 
```

## Append data

This command appends data to a save file, the file must exist for this command to work

```js
save "data.txt" "append" " Goodbye now!"
// appends more data to the end of our file
```

this command when run on our file `data.txt` would update it's value to:

```
Hello, World! Goodbye now!
```

## Append a new line

This command appends data on a new line to a save file, the file must exist for this command to work

```js
save "data.txt" "newline" "JK I'm back"
// appends a new line to the "data.txt" file
```

this command when run on our file `data.txt` would update it's value to:

```
Hello, World! Goodbye now!
JK I'm back
```

## Getting data from your save

Using the .saveGet() method, you can get the value of a save file.

```js
my_text = "data.txt".saveGet()
// returns the data from our saved file
```

## Checking if a save file exists

You can easily check if a file exists using the .saveExists() method, it returns a boolean of if a save file exists

```js
if "data.txt".saveExists() (
  // will run if the file exists
) else (
  // will run if the file doesnt exist
)
```

