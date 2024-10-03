# Types

OSL uses the syntax of data to dynamically figure out its type.

When a token is parsed, the osl system figures out its type dynamically based on how you wrote the code.

```javascript
// the command and operators
log "hello" + 10

// gets figured out to
["command","string","operator","number"]
```



### Strings

Any data surrounded with double quotes will be treated as a string. Examples of a string might be "hello world" or "100" because these values have double quotes surrounding them.

### Numbers

Numbers must be only digits from 0-9 and can only have a single decimal place. Examples of numbers are 10 or 5.3

### Arrays

An array must be surrounded with square brackets, for example \["hello","world"] Arrays store a "list" of values that can be any type, including arrays and objects

### Objects

An object must be surrounded with curly brackets, for example {"key":"value"} Objects can store key value pairs.

### Booleans

A boolean is either true or false, lower or upper case, and no quotation marks
