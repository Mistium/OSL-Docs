---
description: What the original OSL was, how it differed from today's compiled language, and a map of the pages that keep its old features on record.
---

# Legacy OSL

OSL began as the scripting language inside originOS, a browser-based desktop. Programs were interpreted while the desktop ran, and they could open windows, read the camera, send messages between windows and use the desktop's file system. Today's OSL is a compiler: it turns a program into a native executable through Go. The syntax looks alike, but the two are different languages, and old programs do not run unchanged. This section keeps the old features on record for people reading historical originOS programs. It is not a source for new code. Where a feature has a modern equivalent, the page shows it.

## How legacy OSL differed

| | Legacy OSL (originOS) | OSL today |
| --- | --- | --- |
| How it runs | Interpreted by the originOS runtime. | Compiled to a native program with `osl run` or `osl compile`. |
| Variables | `name = "Hello"`. Assignment created the variable, and it was global unless declared `local`. | A declaration with a type: `string name = "Hello"`. A variable lives in the block that declares it. |
| Types | Six dynamic types, checked while running. | A static type system, checked before the program runs. See [Types](types.md). |
| Errors | Mistakes showed up at run time. | Mistakes are compile errors with a place and a fix. See [Diagnostics](../diagnostics.md). |
| Debug output | `log`, `warn` and `error` wrote to the browser console. | `log` writes to standard output, `warn` and `error` to standard error. See [Debug commands](debug-commands.md). |
| Methods on values | Helpers such as `.JsonParse()`, `.padStart()` and `.toBase()` were built into the runtime. | Most live in standard packages, such as `std:json`. See [Prototype helpers](prototype-helpers.md). |
| Custom syntax | `def "name" "args"` defined new commands. | Ordinary functions: `def name(int a)`. |
| Promises | `Promise.new(fn)` and `.then`. | `async` functions, and `std:thread`. See [Concurrency](../../learn/concurrency.md). |
| Desktop APIs | Windows, camera, input simulation, clipboard, permissions. | None in the compiler. Standard packages cover the parts that make sense for a native program. |

Some things did not change. Arrays and strings are still indexed from 1. `log` still takes values separated by spaces. Arithmetic still evaluates strictly from left to right, so `1 + 1 * 4` is 8, and the compiler warns about [mixed operators](../diagnostics.md#conditions-and-comparisons) to make you add parentheses.

## What replaced what

| originOS feature | Today |
| --- | --- |
| Browser window commands and rendering | [`std:raylib`](../../packages/raylib.md) |
| The originOS file system | [`std:fs`](../../packages/fs.md) |
| HTTP and WebSocket methods | [`std:requests`](../../packages/requests.md) and [`std:ws`](../../packages/ws.md) |
| Desktop notifications | [`std:notify`](../../packages/notify.md) |
| Sound | [`std:sound`](../../packages/sound.md) |
| Running Lua | [`std:lua`](../../packages/lua.md) |
| The originOS save database | [`std:save`](../../packages/save.md) or [`std:db`](../../packages/db.md) |
| `Promise.new` | [`async` functions](../../learn/concurrency.md) |
| `def "name"` commands | [Functions](../../learn/functions.md) |

The camera, simulated system input, originOS permissions, the clipboard and messages between desktop windows have no equivalent in the compiler, because a native program has no desktop to talk to.

## The pages

:::cards
- [Debug commands](debug-commands.md): `log`, `say`, `warn` and `error`, and where their output went.
- [Prototype helpers](prototype-helpers.md): the methods the runtime added to strings, numbers, arrays and objects, and what to use now.
- [Types](types.md): the six original types and how they became static types.
- [Local scoping](local-scoping.md): `local` and `this`, and how variables are scoped today.
:::

## Moving an old program

1. Declare every variable with a type, or with `auto` while you work out what it should be.
2. Turn `def "name" "args"` commands into functions, and call them with parentheses.
3. Replace helper methods and desktop commands with the packages in the table above.
4. Run `osl fix` to apply the automatic rewrites for syntax that changed, then `osl lsp check` to see what is left.
5. Fix the errors from the top. Later ones are often caused by earlier ones.
