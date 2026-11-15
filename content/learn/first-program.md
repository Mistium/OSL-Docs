---
description: Write a program, run it, and turn it into an executable. Meet log, comments and the compiler.
lesson: 1
---

# Your first program

An OSL program is a file of statements that run from the top to the bottom. There is no `main` function to write, no class to wrap it in and no build file. This is a complete program:

```osl
log "Hello, world"
```

```output
Hello, world
```

Press **Run** above to see it. Every example in this course works like that: **Run** shows what the program prints, and clicking into the code lets you change it. The compiler runs in your browser and checks what you type as you type it.

## Printing with log

`log` prints its value and a newline. Give it more than one value, separated by spaces, and it prints them on one line:

```osl
log "one"
log "two" "three"
log 6 * 7
```

```output
one
two three
42
```

`log` is a *command*, so a space separates it from what it prints. You'll meet two more commands like it: `warn` and `error` print the same way but to the error stream, for messages that aren't the program's normal output.

## Statements and comments

Each line is one statement, and there are no semicolons. Comments start with `//` and run to the end of the line:

```osl
// Work out how long a trip takes.
number distance = 150   // kilometres
number speed = 60       // kilometres an hour
log distance / speed
```

```output
2.5
```

The lines that start with a type, like `number distance = 150`, declare *variables*. They are the subject of the next lesson.

## Run it on your machine

Save a program as `hello.osl` and run it:

```bash
osl run hello.osl
```

`osl run` compiles the program and runs it straight away. When you want something to keep, compile it into an executable:

```bash
osl compile hello.osl
./hello
```

`osl compile` writes a native program named after the file. It doesn't need OSL or Go to run, so you can copy it to another machine with the same operating system and run it there. Use `-o` to choose its name: `osl compile hello.osl -o bin/greeter`.

> [!tip] Format as you go
> `osl fmt hello.osl` rewrites a file in the one standard style: two-space indents and consistent spacing. Run it on a folder to format everything inside: `osl fmt src/`.

## When the compiler says no

The compiler reads the whole program before anything runs, and stops if something is wrong. Press **Compile** on this one:

```osl error
log "Hello, world
```

The message says what is wrong, shows the line, and points at the place. OSL's errors try to tell you how to fix the problem as well; you'll see many of them in this course, and they're worth reading closely.

:::quiz
You run a file that contains only `log 1 + 1`. What happens?

- [x] It prints `2`.
- [ ] Nothing: a program needs a `main` function.
- [ ] It fails to compile, because there's no type.

A file's statements run from top to bottom, so a one-line file is a whole program. `main` is optional: if you define `def main()` it runs after the top-level statements finish.
:::

## A main function, if you want one

Some people like a program's entry point to have a name. Define a function called `main` and OSL calls it after the file's top-level code has run:

```osl
log "setting up"

def main() (
  log "running"
)
```

```output
setting up
running
```

Most OSL programs don't bother. The top of the file is the entry point.

:::exercise title="Three lines"
Make the program print these three lines, in this order.

```osl
log "Hello"
```

```output
Hello
I am learning OSL
6
```

> [!hint]
> You need three `log` statements, one for each line.

> [!hint]
> The last line is a number. You can log `6` itself, or a sum like `2 + 4`.

```osl solution
log "Hello"
log "I am learning OSL"
log 2 + 4
```
:::
