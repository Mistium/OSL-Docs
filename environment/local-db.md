# Local DB

Using osl you can interface with Local Storage, a browser feature that allows the website to set a key locally to a value. If you do plan to store any important information in local storage, use a unique name so that its not able to be guessed by other applications.

## Set a key

<pre class="language-javascript"><code class="lang-javascript"><strong>localdb "set" "key" "value"
</strong><strong>// sets a value locally so that your app can recall that value later.
</strong><strong>// can be useful for user profiling (cringe)
</strong><strong>// or just for large and fast data storage outside of ram.
</strong></code></pre>

## Get a key

```javascript
log localdb("key")
// logs the value of a "key" in local storage
```

## Delete a key

```javascript
localdb "delete" "key"
// removes the key from local storage
```
