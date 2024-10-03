# Modifying An Array

OSL is a 1 indexed scripting language, meaning that arrays start at the index 1 not at 0 like many other languages.

## Setting Items Of An Array

You can set or update an item of an array using any way of assignment shown here [Broken link](broken-reference "mention")

```javascript
arr = ["value1","value2","value3","value4"]

arr[1] = "value5"

log arr
// returns ["value5","value2","value3","value4"]
```

## Appending And Prepending

To append and prepend to an array, you can not only use the `+` operator [#appending-or-prepending-to-an-array-with-a-value](../operators/array-operations.md#appending-or-prepending-to-an-array-with-a-value "mention") but you can also use the [#methods](../#methods "mention") .append() and .prepend().

```javascript
arr = ["wow"]
// setup the empty array

arr.prepend("hello world")
// i use a method as a command so that it updates the variable
// prepend adds the new value as the first item in the array

log arr
// returns ["hello world","wow"]
```

```javascript
arr = ["wow"]
// setup the empty array

arr.append("hello world")
// i use a method as a command so that it updates the variable
// prepend adds the new value as the last item in the array

log arr
// returns ["wow","hello world"]
```

## Delete An Item Of An Array

To remove an item from an array, you can use either the&#x20;
