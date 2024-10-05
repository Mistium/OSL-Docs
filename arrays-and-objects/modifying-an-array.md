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

## Setting Nested Items

In osl you can update nested items using multiple stacked references to a part of an object/array that gets compiled into a simple json path.

```javascript
array = ["data",["data2","data3"]]

array[2][2] = "data4"

log array
// ["data",["data2","data4"]]
```

## Appending And Prepending

To append and prepend to an array, you can not only use the `+` operator in [array-operations.md](../operators/array-operations.md "mention") but you can also use the [.prepend-val.md](../methods/utilities/.prepend-val.md "mention") and [.append-val.md](../methods/utilities/.append-val.md "mention") methods

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

To remove an item from an array, you can use either the [.insert-location-val-1.md](../methods/utilities/.insert-location-val-1.md "mention") method or [.pop.md](../methods/json/arrays/.pop.md "mention") to remove the last item, or [.shift.md](../methods/json/arrays/.shift.md "mention") to remove the first item.
