/* How the reference writes a package member: OSL's own declaration syntax.
   Shared by the API widget and the Markdown versions of pages. */

import type { APIMethod, APIParam } from "./types";

/* A parameter as OSL declares one: type first, ? for an argument that may be
   left out, and `type ...name` for a rest parameter. */
export const paramLabel = (p: APIParam) => (p.variadic ? `${p.type} ...${p.name}` : `${p.type}${p.optional && !p.type.endsWith("?") ? "?" : ""} ${p.name}`);

export function signatureOf(owner: string, m: APIMethod) {
  return `${owner}.${m.name}(${m.params.map(paramLabel).join(", ")})${m.returns ? ` ${m.returns}` : ""}`;
}

/* A type's methods are called on a value, so the reference names that value
   after the type: *serve.Router's methods read router.get(...). */
export const ownerOf = (typeName: string) => (typeName.includes(".") ? typeName.split(".")[1].replace(/^./, (c) => c.toLowerCase()) : typeName);
