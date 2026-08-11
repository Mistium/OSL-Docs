# Benchmarking and CPU profiling

Use `osl bench` to find the functions and OSL source lines consuming the most CPU time:

```sh
osl bench app.osl
```

The command compiles an instrumented benchmark binary, automatically repeats the program for about one second, collects a Go CPU profile, and prints:

* the number of measured runs;
* total and mean execution time;
* the hottest functions and source lines, including `.osl` file names and line numbers.

Program output is discarded during measurement so logging does not dominate the profile. Log arguments are still evaluated. The program is run once to estimate a useful repetition count before the measured runs, so benchmark programs should be safe to execute repeatedly.

## Options

```text
osl bench <file.osl> [--time 1s] [--runs N] [--top N] [--profile cpu.pprof]
```

| Option | Description |
| --- | --- |
| `--time duration`, `-t duration` | Target profiling time used to choose the repetition count. Go durations such as `500ms`, `2s`, and `1m` are accepted. The default is `1s`. |
| `--runs N`, `-n N` | Run the program exactly `N` times instead of calibrating from `--time`. This also skips the calibration run. |
| `--top N` | Show at most `N` hot source locations. The default is `15`. |
| `--profile path` | Save the raw CPU profile for further analysis with `go tool pprof`. |

For a short computation, allow automatic repetition:

```sh
osl bench fizzbuzz.osl --time 2s --top 20
```

For a program with external side effects, explicitly select one run:

```sh
osl bench import-data.osl --runs 1 --profile import.pprof
```

The profile includes OSL functions, compiler runtime helpers, and source locations. A hot helper such as `OSLmodFloat` means the corresponding OSL operation is expensive across its callers; entries ending in `.osl:<line>` point directly to user code.
