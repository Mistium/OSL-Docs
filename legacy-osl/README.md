# Legacy originOS

OSL began as the scripting language inside originOS. That runtime supplied browser windows, camera access, simulated input, inter-window messages, permissions, global UI state, and its own file model.

The current OSL compiler builds standalone native programs. It does not include the originOS desktop environment, so those APIs do not carry over simply because the language syntax looks similar.

## What changed

| originOS feature | Current OSL replacement |
| --- | --- |
| Browser window commands | [`std:window`](../packages/window.md) or [`std:raylib`](../packages/raylib.md) |
| originOS filesystem | [`std:fs`](../packages/fs.md) |
| Browser HTTP and WebSocket methods | [`std:requests`](../packages/requests.md) and [`std:ws`](../packages/ws.md) |
| Desktop notifications | [`std:notify`](../packages/notify.md) |
| Embedded sound | [`std:sound`](../packages/sound.md) |
| Running Lua | [`std:lua`](../packages/lua.md) |
| originOS save database | [`std:save`](../packages/save.md) or [`std:db`](../packages/db.md) |

Camera access, simulated system input, originOS permissions, and inter-window desktop messages have no direct compiler equivalent.

## What remains here

The pages in this section preserve a small amount of old syntax for people reading historical originOS programs. They are not part of the current language guide and should not be used as a source for new OSL code.
