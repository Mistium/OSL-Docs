import { expect, test } from "bun:test";
import { normalize, slugFromPath } from "../src/lib/router";

test("addresses normalize to one form per page", () => {
  expect(normalize("/")).toBe("/");
  expect(normalize("/learn/")).toBe("/learn");
  expect(normalize("/learn/index.html")).toBe("/learn");
  expect(normalize("/learn/types.html")).toBe("/learn/types");
  expect(normalize("/learn/types?x=1#top")).toBe("/learn/types");
});

test("slugs drop the leading slash", () => {
  expect(slugFromPath("/")).toBe("");
  expect(slugFromPath("/packages/fs/")).toBe("packages/fs");
});
