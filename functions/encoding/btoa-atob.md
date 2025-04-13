# btoa() and atob()

These functions convert between binary strings and base64-encoded ASCII strings, useful for data encoding and decoding operations.

## btoa() - Binary to ASCII

Encodes a string of data to base64.

```javascript
encoded = btoa("Hello, world!")
log encoded  // "SGVsbG8sIHdvcmxkIQ=="
```

### Syntax

```javascript
btoa(content)
```

### Parameters

- `content`: String - The string data to be encoded to base64

### Return Value

Returns a base64-encoded ASCII string.

## atob() - ASCII to Binary

Decodes a base64-encoded string back to its original form.

```javascript
decoded = atob("SGVsbG8sIHdvcmxkIQ==")
log decoded  // "Hello, world!"
```

### Syntax

```javascript
atob(content)
```

### Parameters

- `content`: String - The base64-encoded string to be decoded

### Return Value

Returns the decoded string.

## Use Cases

These functions are particularly useful for:

- Encoding binary data to be transmitted as text
- Working with data URLs
- Storing binary data in text-based formats
- Handling image data in data URI format
- Basic data obfuscation (not for security purposes)

## Examples

### Data URI Creation

```javascript
// Create a simple data URI for an image
dataURI = "data:image/png;base64," + btoa(imageBinaryData)

// Then use it in an image element
image dataURI 100 100
```

### Simple Text Encoding/Decoding

```javascript
// Encode a user message
message = "This is a secret message"
encoded = btoa(message)
log encoded  // Base64 encoded version

// Later decode it
original = atob(encoded)
log original  // "This is a secret message"
```

### Working with APIs that Return Base64

```javascript
// Some API returns base64 data
apiResponse = fetchData("https://api.example.com/image")

// Decode it
decodedData = atob(apiResponse)

// Process the decoded data
// ...
```

## Notes

- These functions work with strings, not arbitrary binary data
- For full Unicode support, you may need additional handling
- Not suitable for encrypting sensitive data
- Very large strings may cause performance issues
- If the input to `atob()` is not a valid base64 string, it will throw an error
