# Creating Directories

Creating a directory in osl is very simple, you just have to make a file at the directory you want to create. However, it does require permissions (or get the user to place you in the applications folder).

```javascript
file "goto_dir" "user/documents/my new folder"
// we go to the directory that we want to create
// this directory doesnt exist yet

file "set_file" "hello.txt" "hello world"
// create our hello world file at the current folder
// this command will build the .folder files that are nessecary to have this directory
```

In OSL, create a file at your target location to automatically generate the directory structure.
