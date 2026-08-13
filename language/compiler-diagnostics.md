# Compiler diagnostics

OSL reports mistakes as early as it can without requiring ownership annotations or
manual type narrowing. Errors stop compilation when the compiler can prove the
program cannot safely perform an operation. Warnings highlight code that is valid
but is very likely accidental.

## Compile-time safety checks

The compiler currently reports these high-confidence safety diagnostics:

- Division or remainder by a value known to be zero is an error.
- Assigning a variable directly to itself produces `OSL-SELF-ASSIGNMENT`.
- Comparing a value known to be non-null with `null` produces
  `OSL-CONSTANT-CONDITION` and states whether the comparison is always true or false.
- Discarding a `result` produces `OSL-DISCARDED-RESULT`. Handle or unwrap the result,
  assign it for later handling, or use `void` to explicitly ignore it.
- Redundant assertions and unused variables remain warnings.

These checks use propagated facts. For example, a nullable value narrowed by a guard
is treated as non-null only in the branch where that fact holds. Unknown and genuinely
nullable values do not produce constant-condition warnings.

## Suppressing an intentional warning

Warnings have stable codes so a narrow suppression can document intentional code:

```osl
// osl-disable-next-line OSL-DISCARDED-RESULT
operation()
```

To suppress one warning throughout a file, put this anywhere in the file:

```osl
// osl-disable-file OSL-SELF-ASSIGNMENT
```

Omitting the code, or using `all`, suppresses every warning for the next line or the
whole file. Prefer a specific code so newly introduced warnings remain visible.
