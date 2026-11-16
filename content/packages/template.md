---
description: Fill text templates with values using {{ }} placeholders, conditions and loops, for emails, reports and generated files.
package: template
---

# template

`template` fills in text. You write the fixed parts once, mark the gaps with `{{ }}`, and give it an object with the values. Use it for emails, reports, config files, HTML pages and anything else where the shape stays the same and the data changes. It is logic-light on purpose: values, conditions and loops, and nothing else.

```osl fragment
import "std:template"
```

## Fill in values

`template.render(text, data)` returns a [result](../learn/errors.md), because the template might be malformed. `{{name}}` is replaced by the value of `name` in the data.

```osl
import "std:template"

string text = "Hello {{name}}, you have {{count}} new messages."
log template.render(text, {name: "Ada", count: 3}).unwrap()
```

```output
Hello Ada, you have 3 new messages.
```

Numbers and booleans are written as OSL prints them, and `null` or a missing key gives nothing. Spaces inside the braces don't matter: `{{ name }}` is the same as `{{name}}`.

```osl
import "std:template"

string text = "[{{n}}] [{{ok}}] [{{nothing}}] [{{absent}}]"
log template.render(text, {n: 3.5, ok: true, nothing: null}).unwrap()
```

```output
[3.5] [true] [] []
```

Try it: add a `{{city}}` placeholder and don't provide it.

## Nested values

Use dots to reach into objects.

```osl
import "std:template"

auto data = {user: {name: "Grace", address: {city: "Arlington"}}}
log template.render("{{user.name}} lives in {{user.address.city}}.", data).unwrap()
```

```output
Grace lives in Arlington.
```

## Conditions

`{{#if key}} ... {{/if}}` keeps its body when the value is truthy: not `false`, `null`, `0`, an empty string or an empty array. `{{#unless key}}` is the opposite, and `{{else}}` gives an alternative.

```osl
import "std:template"

string text = [
  "{{#if admin}}Welcome back, admin.{{else}}Welcome.{{/if}}",
  "{{#unless verified}}Please verify your email.{{/unless}}"
].join(" ")
log template.render(text, {admin: true, verified: false}).unwrap()
log template.render(text, {admin: false, verified: true}).unwrap()
```

```output
Welcome back, admin. Please verify your email.
Welcome. 
```

Blocks nest as deep as you need.

```osl
import "std:template"

string text = "{{#if a}}a{{#if b}}+b{{/if}}{{/if}}"
log template.render(text, {a: 1, b: 1}).unwrap()
log template.render(text, {a: 1, b: 0}).unwrap()
log template.render(text, {a: 0, b: 1}).unwrap() ++ "|"
```

```output
a+b
a
|
```

## Loops

`{{#each items}} ... {{/each}}` repeats its body for every element. Inside, keys come from the current element, and keys that the element doesn't have are found in the data around it.

```osl
import "std:template"

string text = "Order for {{customer}}:\n{{#each items}}- {{qty}} x {{name}}\n{{/each}}"
auto data = {
  customer: "Ada",
  items: [{name: "bolt", qty: 12}, {name: "nut", qty: 30}]
}
log template.render(text, data).unwrap()
```

```output
Order for Ada:
- 12 x bolt
- 30 x nut

```

For an array of plain values, `{{.}}` is the element itself:

```osl
import "std:template"

string text = "Tags:{{#each tags}} [{{.}}]{{/each}}"
log template.render(text, {tags: ["go", "fast", "small"]}).unwrap()
log template.render("{{#each tags}}x{{/each}}none", {tags: []}).unwrap()
```

```output
Tags: [go] [fast] [small]
none
```

An empty array renders nothing, so pair a loop with an `{{#if}}` when you want a message for the empty case:

```osl
import "std:template"

string text = "{{#if items}}{{#each items}}{{.}} {{/each}}{{else}}nothing to show{{/if}}"
log template.render(text, {items: ["a", "b"]}).unwrap()
log template.render(text, {items: []}).unwrap()
```

```output
a b 
nothing to show
```

Conditions work inside loops, looking at the current element:

```osl
import "std:template"

string text = "{{#each tasks}}{{#if done}}[x]{{else}}[ ]{{/if}} {{title}}\n{{/each}}"
auto tasks = [{title: "write", done: true}, {title: "test", done: false}]
log template.render(text, {tasks: tasks}).unwrap()
```

```output
[x] write
[ ] test

```

Try it: add a third item and run it again.

## Comments

`{{! ... }}` is dropped from the output, for notes to whoever edits the template.

```osl
import "std:template"

log template.render("{{! greeting line }}Hi {{name}}", {name: "Bo"}).unwrap()
```

```output
Hi Bo
```

## Escaping for HTML

By default values are written as they are. When the output is HTML, pass `{html: true}` and every `{{value}}` is escaped, so user input can't inject markup. Write `{{& value}}` for a value that is already safe HTML.

```osl
import "std:template"

string text = "<p>{{comment}}</p>{{& badge}}"
auto data = {comment: "<script>alert(1)</script> & more", badge: "<b>new</b>"}
log template.render(text, data, {html: true}).unwrap()
log template.render(text, data).unwrap()
```

```output
<p>&lt;script&gt;alert(1)&lt;/script&gt; &amp; more</p><b>new</b>
<p><script>alert(1)</script> & more</p><b>new</b>
```

> [!warning]
> Without `html: true`, nothing is escaped. Never render untrusted text into HTML without it.

## Errors

A malformed template is a `ParseError` with its position. Missing keys are silent by default, which hides typos. Pass `{strict: true}` to make them a `ValueError`:

```osl
import "std:template"

string[] bad = ["Hello {{name", "{{#if x}}never closed", "stray {{/if}}"]
for t in bad (
  log template.render(t, {x: 1}).unwrapErr().message
)

switch template.render("Hello {{nmae}}", {name: "Ada"}, {strict: true}) (
  case ok(s)
    log s
  case err(e)
    log e.kind ":" e.message
)
```

```output
template.render: line 1, column 7: unclosed tag; every {{ needs a matching }}
template.render: line 1, column 1: {{#if x}} is never closed; add {{/if}}
template.render: line 1, column 7: {{/if}} closes no open block
ValueError : template.render: line 1, column 7: no value for "nmae" in {{nmae}}
```

Strict mode is a good default while you develop, and for templates that must not be left half filled.

## Structs as data

The data can be an object or a struct. A struct's fields are read by name, and structs inside arrays and objects work the same way, so you can render your own types without converting them:

```osl
import "std:template"

struct Item (
  string name = ""
  number price = 0
)

struct Order (
  string id = ""
  Item[] items = []
)

auto order = Order("a1", [Item("pen", 1.5), Item("ink", 12)])
log template.render("Order {{id}}:{{#each items}} {{name}} ({{price}}){{/each}}", order).unwrap()
```

```output
Order a1: pen (1.5) ink (12)
```

## Templates in files

Keep long templates in their own file and read them with [fs](fs.md). That lets someone edit the wording without touching code.

```osl
import "std:template"
import "std:fs"

fs.remove("invoice.tpl", {force: true}).unwrap()
string invoice = [
  "Invoice {{id}}",
  "{{#each lines}}{{desc}}: {{amount}}",
  "{{/each}}Total: {{total}}",
  ""
].join("\n")
fs.writeFile("invoice.tpl", invoice).unwrap()

string tpl = fs.readFile("invoice.tpl").unwrap()
auto data = {id: 42, lines: [{desc: "Widget", amount: 10}, {desc: "Gadget", amount: 15}], total: 25}
fs.writeFile("invoice.txt", template.render(tpl, data).unwrap()).unwrap()
log fs.readFile("invoice.txt").unwrap()
```

```output
Invoice 42
Widget: 10
Gadget: 15
Total: 25

```

:::quiz
What does `{{#if items}}` do when `items` is an empty array?

- [ ] Renders its body, as the key exists.
- [x] Skips its body, as an empty array is falsy.
- [ ] Fails with a `ValueError`.

Empty arrays, empty strings, `0`, `false` and `null` are all falsy.
:::

:::exercise title="A shopping list"
Render the data as a bullet list: a heading line `Shopping for NAME`, then one line `- ITEM` for each item that is not bought, and `All done!` if there are no items left. Use a single template.

```osl
import "std:template"

auto data = {
  name: "Ada",
  items: [
    {item: "milk", bought: false},
    {item: "eggs", bought: true},
    {item: "tea", bought: false}
  ]
}
log template.render("{{name}}", data).unwrap()
```

```output
Shopping for Ada
- milk
- tea
```

> [!hint]
> Inside `{{#each items}}`, use `{{#unless bought}}- {{item}}{{/unless}}`.

> [!hint]
> Put a newline inside the `unless` block so skipped items don't leave blank lines.

```osl solution
import "std:template"

auto data = {
  name: "Ada",
  items: [
    {item: "milk", bought: false},
    {item: "eggs", bought: true},
    {item: "tea", bought: false}
  ]
}
string tpl = [
  "Shopping for {{name}}",
  "{{#each items}}{{#unless bought}}- {{item}}",
  "{{/unless}}{{/each}}"
].join("\n")
log template.render(tpl, data).unwrap().trim()
```

```output
Shopping for Ada
- milk
- tea
```
:::

:::exercise title="Catch the typo"
Render `Hello {{nmae}}` with `{name: "Ada"}` in strict mode and print the error kind.

```osl
import "std:template"

log template.render("Hello {{name}}", {name: "Ada"}).unwrap()
```

```output
ValueError
```

> [!hint]
> The third argument is `{strict: true}`.

> [!hint]
> `unwrapErr().kind`

```osl solution
import "std:template"

log template.render("Hello {{nmae}}", {name: "Ada"}, {strict: true}).unwrapErr().kind
```

```output
ValueError
```
:::

## API reference

::api
