# Legacy OSL (originOS)

OSL began life inside **originOS**, a graphical desktop environment where every program was a window
and the operating system provided features like a camera, simulated input, inter-window messaging and
a permission system.

This documentation covers **OSL.go**, the standalone compiler. Most of the language carries over
unchanged, but some originOS *environment* features have **no equivalent** in compiled OSL, because
there is no surrounding desktop OS to provide them. Those pages are collected here so the knowledge
isn't lost — they describe how things worked in originOS and remain useful if you're reading or
porting old originOS programs.

> The pages below describe **originOS behaviour** and generally do **not** work in compiled OSL.go
> programs. Where a modern replacement exists, it's noted.

## Not available in compiled OSL

| originOS feature | Modern replacement |
| --- | --- |
| [Camera](../environment/camera.md) | — (no equivalent) |
| [Mouse cursor control](../environment/mouse-cursor.md) | [`osl/window`](../packages/window.md) input, within a window |
| [Input simulation](../environment/input-simulation.md) | — (no equivalent) |
| [Send data between windows](../environment/send-data-between-windows.md) | — (use [`net`](../packages/net.md)/[`serve`](../packages/serve.md)) |
| [Interfacing with right-click](../environment/interfacing-with-rightclick.md) | — (no equivalent) |
| [Permissions](../environment/permissions.md) | — (the OS sandbox is gone) |
| [OFSF file model](../environment/files/README.md) — `open()`, `fileGet()`, `listFiles()` | [`osl/fs`](../packages/fs.md) |
| [`import()` as a function](../functions/import.md) | the [`import` statement](../getting-started/README.md#project-structure--imports) |

## Replaced by a package, kept for reference

| originOS page | Now use |
| --- | --- |
| [Desktop notifications](../environment/notifications.md) | [`osl/notify`](../packages/notify.md) |
| [The window system](../environment/the-window-system.md) | [`osl/window`](../packages/window.md) |
| [Running other languages](../environment/running-other-languages.md) | [`osl/lua`](../packages/lua.md) |
| [Sound](../environment/sound.md) | [`osl/sound`](../packages/sound.md) |

## Preserved originals

Where a general page was rewritten with OSL.go-specific information, a copy of the original is kept
under [`legacy-osl/originals/`](originals/) so nothing is lost.
