# Methods

## Defining a custom method

Using the `def` command you can create a new custom method for your program to use. A custom method will return a value

## Syntax

<pre class="language-js"><code class="lang-js">def input.method(parameters)
    // run your method code
    return "data"
endef

log "hi".method()
<strong>// this passes "hi" and null to the method and then logs "data"
</strong></code></pre>

## Example

The below is an example of how to make a script that splits a string into single characters, like using&#x20;

```js
def text_data.makeLetters()
  data = []
  // new array
  i = 0
  loop text_data.len (
    i ++
    // increment counter
    
    letter = text_data[i]
    // get letter of string

    data = data.append(letter)
    // push letter of string onto data array
  )
  return data
  // return the array
endef

log "hello".makeLetters()
// ["h","e","l","l","o"]
```

We can also compress the splitter using some more advanced techniques

```javascript
def text_data.makeLetters()
  data = []
  // new array
  
  // start a for loop using the "i" variable
  for i text_data.len (
  
    data.append(text_data[i])
    // push letter of string onto data array
  )
  return data
  // return the array
endef

log "hello".makeLetters()
// ["h","e","l","l","o"]
```
