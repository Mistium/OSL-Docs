import { describe, expect, test } from "bun:test";
import { examplesOf, parsePage, plain, slugify } from "../src/lib/markdown";

const page = (body: string) => parsePage(`---\ntitle: T\n---\n\n${body}\n`);

describe("examples", () => {
  test("an output fence after an osl fence is what it must print", () => {
    const [example] = examplesOf(page('```osl\nlog "hi"\n```\n\n```output\nhi\n```').blocks);
    expect(example.mode).toBe("run");
    expect(example.expect).toBe("hi");
    expect(example.files).toEqual([{ name: "main.osl", code: 'log "hi"' }]);
  });

  test("flags set the mode", () => {
    const modes = examplesOf(
      page("```osl norun\na\n```\n\n```osl error\nb\n```\n\n```osl fragment\nc\n```").blocks,
    ).map((e) => e.mode);
    expect(modes).toEqual(["norun", "error", "fragment"]);
  });

  test("adjacent file= fences form one project", () => {
    const md = '```osl file=main.osl\nimport "./b.osl"\n```\n```osl file=b.osl\nlog 1\n```';
    const [example] = examplesOf(page(md).blocks);
    expect(example.files.map((f) => f.name)).toEqual(["main.osl", "b.osl"]);
  });

  test("examples inside quizzes and exercises are found", () => {
    const md = [
      ":::quiz",
      "What prints?",
      "",
      "```osl",
      "log 1",
      "```",
      "",
      "- [x] 1",
      "- [ ] 2",
      ":::",
    ].join("\n");
    expect(examplesOf(page(md).blocks)).toHaveLength(1);
  });
});

describe("mistakes fail loudly", () => {
  test("an unclosed fence", () => {
    expect(() => page("```osl\nlog 1\n\nmore text")).toThrow("never closed");
  });

  test("an unclosed container", () => {
    expect(() => page(":::details title=x\nbody")).toThrow("never closed");
  });

  test("a quiz with no correct option", () => {
    expect(() => page(":::quiz\nQ?\n\n- [ ] a\n- [ ] b\n:::")).toThrow("no correct option");
  });
});

describe("text", () => {
  test("plain drops inline Markdown", () => {
    expect(plain("Build **Snake** with `std:raylib` and [img](img.md)")).toBe(
      "Build Snake with std:raylib and img",
    );
  });

  test("slugify makes heading ids", () => {
    expect(slugify("Match and switch")).toBe("match-and-switch");
    expect(slugify("`std:fs` files")).toBe("std-fs-files");
  });
});
