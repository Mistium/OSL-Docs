import { expect, test } from "bun:test";
import { decodeFiles, encodeFiles } from "../src/lib/share";

const b64 = (text: string) => btoa(text);

test("a single main.osl round-trips through #code=", () => {
  const files = { "main.osl": 'log "héllo"' };
  const hash = encodeFiles(files);
  expect(hash.startsWith("code=")).toBe(true);
  expect(decodeFiles(`#${hash}`)).toEqual(files);
});

test("several files round-trip through #files=", () => {
  const files = { "main.osl": "log 1", "b.osl": "log 2" };
  expect(decodeFiles(`#${encodeFiles(files)}`)).toEqual(files);
});

test("garbled links decode to nothing instead of bad files", () => {
  expect(decodeFiles("#files=%%%")).toBeNull();
  expect(decodeFiles(`#files=${b64('{"main.osl":5}')}`)).toBeNull();
  expect(decodeFiles(`#files=${b64("[1,2]")}`)).toBeNull();
  expect(decodeFiles(`#files=${b64("{}")}`)).toBeNull();
  expect(decodeFiles("#other=1")).toBeNull();
});
