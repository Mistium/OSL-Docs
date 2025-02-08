# Object Property Shorthand

## Description

In OSL, you can use the object property shorthand to create objects more concisely. When the property name and the variable name are the same, you can omit the value in the object literal.

## Usage

In the provided example, the variable `var` is defined with the value `"hello world"`. The `log` method is then used to output an object containing `var` and `var2`. The shorthand syntax allows you to include `var` in the object without explicitly specifying its value.

* A variable `var` is defined with the value `"hello world"`.
* The `log` method is called with an object containing `var` and `var2`.
* The output is an object with the values of `var` and `var2`.

{% code overflow="wrap" %}
```osl
var = "hello world"
var2 = "var2"

log {
  var,
  var2
}
// { "var": "hello world", "var2": "var2" }
```
{% endcode %}