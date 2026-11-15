---
description: Declare values with their types, change them, and print them.
lesson: 2
---

# Variables

Put the type before the name.

```osl
string name = "Ada"
int age = 36
log name ++ " is " ++ age
```

:::quiz
What does this print?

```osl fragment
log 10 + 2 * 3
```

- [ ] `16`
- [x] `36`

OSL reads mixed arithmetic from left to right, so this is `(10 + 2) * 3`.
:::

:::exercise title="Say hello"
Print `Hello, Grace!` using a variable.

```osl
string name = "Ada"
log "Hello, " ++ name ++ "!"
```

```output
Hello, Grace!
```

> [!hint]
> Change the value the variable holds.

```osl solution
string name = "Grace"
log "Hello, " ++ name ++ "!"
```
:::
