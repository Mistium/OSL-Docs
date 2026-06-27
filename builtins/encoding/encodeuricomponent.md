# encodeURIComponent(string)

## Description

The **`encodeURIComponent()`** function encodes a [URI](https://developer.mozilla.org/en-US/docs/Glossary/URI) by replacing each instance of certain characters by one, two, three, or four escape sequences representing the [UTF-8](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8) encoding of the character (will only be four escape sequences for characters composed of two surrogate characters).

{% embed url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent" %}

## Parameters

encodeURIComponent() requires a single string to be encoded.

## Usage

```javascript
// Define a string with special characters
urlString = "Hello World! How are you?"

// Use encodeURIComponent to encode the URL component
encodedString = encodeURIComponent(urlString)

// Log the result to the console
log encodedString
// Output: Hello%20World!%20How%20are%20you%
```
