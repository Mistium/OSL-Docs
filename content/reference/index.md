---
description: Look-up pages for the OSL language, its tools and its history: syntax, types, operators, built-ins, methods, the command line and more.
---

# Reference

Pages for looking things up. Every entry has a short example you can edit and run. To learn the language in order, start with the [course](../learn/index.md).

```osl
log "Hello, OSL".toUpper()
log [3, 1, 2].sort()
log {a: 1} ++ {b: 2}
log 2 ^ 8
```

```output
HELLO, OSL
[1,2,3]
{"a":1,"b":2}
256
```

## Language

:::cards
- [Syntax](syntax.md): comments, literals, declarations, every statement and keyword, reserved words
- [Types](types.md): every type, generics, conversions, `typeof`, assignability
- [Operators](operators.md): every operator with precedence and associativity
- [Built-in functions](builtins.md): commands, global values and global functions
- [Strings](strings.md): every string method and property
- [Arrays](arrays.md): every array method and property
- [Objects](objects.md): every object and typed map method
- [Numbers](numbers.md): every int and number method, and the arithmetic rules
:::

## Tools

:::cards
- [Command line](cli.md): `osl run`, `compile`, `test`, `fmt`, `fix` and the rest
- [Opal](opal.md): projects, packages and `osl.json`
- [Testing](testing.md): test blocks and `osl test`
- [Editor support](editor.md): the language server and editor setup
- [Diagnostics](diagnostics.md): errors and warnings the compiler gives, and what they mean
:::

## History

:::cards
- [Legacy OSL](legacy/index.md): how the language changed, and what older code looks like
:::
