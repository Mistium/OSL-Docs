import type { LanguageFn, Mode } from "highlight.js";

/* The OSL grammar from rotur.dev (src/lib/languages/osl.ts), which took it from
   originchats-client, with the keywords of the current compiler added: then,
   void, exit, test, warn and error commands, and the generator keywords. */

const KEYWORDS = [
  "as",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "def",
  "defer",
  "each",
  "else",
  "exit",
  "endef",
  "enum",
  "export",
  "extends",
  "fnc",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "interface",
  "is",
  "local",
  "loop",
  "mainloop",
  "match",
  "of",
  "return",
  "struct",
  "test",
  "then",
  "switch",
  "throw",
  "try",
  "type",
  "until",
  "wait",
  "while",
  "yield",
];

const TYPES = [
  "any",
  "array",
  "auto",
  "boolean",
  "byte",
  "canvas",
  "char",
  "error",
  "int",
  "int8",
  "int16",
  "int32",
  "int64",
  "uint",
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "bool",
  "iter",
  "map",
  "number",
  "number32",
  "number64",
  "object",
  "option",
  "promise",
  "regex",
  "result",
  "set",
  "string",
  "thread",
  "unit",
  "unknown",
  "void",
  "xml",
];

const LITERALS = ["true", "false", "null", "nil"];

/** Highlight.js grammar for the current OSL compiler syntax. */
const osl: LanguageFn = (hljs) => {
  const interpolation: Mode = {
    className: "subst",
    begin: /\$\{/,
    end: /\}/,
    keywords: { keyword: KEYWORDS, type: TYPES, literal: LITERALS },
  };

  return {
    name: "OSL",
    aliases: ["origin-script-language"],
    unicodeRegex: true,
    keywords: {
      $pattern: "[\\p{L}_][\\p{L}\\p{N}_]*",
      keyword: KEYWORDS,
      type: TYPES,
      literal: LITERALS,
      built_in: ["log", "warn", "error", "random", "typeof", "self", "this", "make", "clamp", "min", "max", "round", "floor", "ceil", "abs", "sqrt", "btoa", "atob"],
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: "meta",
        begin: /^\s*\/@line\s+\d+/,
      },
      {
        className: "regexp",
        begin: /\$`/,
        end: /`[gimsuy]*/,
        contains: [hljs.BACKSLASH_ESCAPE],
      },
      {
        className: "string",
        begin: /`/,
        end: /`/,
        contains: [hljs.BACKSLASH_ESCAPE, interpolation],
      },
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      {
        className: "number",
        relevance: 0,
        variants: [
          { begin: /\b0[xX][0-9a-fA-F](?:_?[0-9a-fA-F])*\b/ },
          { begin: /\b0[bB][01](?:_?[01])*\b/ },
          {
            begin:
              /\b(?:\d(?:_?\d)*)?(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)\b/,
          },
          { begin: /\b\d(?:_?\d)*(?:\.\d(?:_?\d)*)?\b/ },
        ],
      },
      {
        className: "title.function.invoke",
        begin:
          /\b(?!(?:def|if|for|while|until|loop|switch|match|catch)\b)[\p{L}_][\p{L}\p{N}_]*(?=\()/u,
        relevance: 0,
      },
      {
        className: "property",
        begin: /(?<=\.)[\p{L}_][\p{L}\p{N}_]*/u,
        relevance: 0,
      },
      {
        className: "operator",
        begin:
          /\.\.\.|\?->|>>>=|\^\^=|\?\?=|=\?\?|===|!==|>>>|<<=|>>=|\+\+|--|\?\?|->|\|>|==|!=|!>|!<|<=|>=|<<|>>|\^\^|\+=|-=|\*=|\/=|%=|\^=|\|=|&=|\b(?:and|or|nor|xor|xnor|nand|to|catch|in|of|is)\b|[+*/%^|&!?~<>=-]/,
        relevance: 0,
      },
    ],
  };
};

export default osl;
