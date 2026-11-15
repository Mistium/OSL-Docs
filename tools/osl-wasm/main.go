//go:build js && wasm

// Command osl-wasm is the OSL compiler's front end built for the browser. The
// docs site loads it in a web worker to check, format and transpile the code
// people edit, with the same diagnostics `osl lsp check` prints.
//
// It registers four globals:
//
//	oslCheck(request)     -> {"diagnostics": [...]}
//	oslTranspile(request) -> {"diagnostics": [...], "go": "..."}
//	oslFormat(source)     -> {"source": "..."} or {"error": "..."}
//	oslVersion            -> "9.1.0"
//
// A request is JSON: {"files": {"main.osl": "...", "greet.osl": "..."},
// "entry": "main.osl"}. Every file lives in memory under /playground, so
// relative imports between them resolve as they do on disk.
//
// It is built inside an OSL checkout (scripts/osl-assets.ts copies it to
// cmd/osl-docs-wasm there) because it uses the compiler's internal packages.
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"path"
	"regexp"
	"sort"
	"strings"
	"syscall/js"

	"osl/internal/compiler"
	"osl/internal/compiler/ast"
	"osl/internal/compiler/pipeline"
	"osl/internal/tooling/formatter"
	"osl/packages"
)

var version = "dev"

const root = "/playground"

type diagnostic struct {
	Severity string   `json:"severity"`
	Code     string   `json:"code,omitempty"`
	Message  string   `json:"message"`
	File     string   `json:"file,omitempty"`
	Line     int      `json:"line"`
	Column   int      `json:"column"`
	Length   int      `json:"length"`
	Notes    []string `json:"notes,omitempty"`
	Fix      string   `json:"fix,omitempty"`
	Rendered string   `json:"rendered,omitempty"`
}

type request struct {
	Files map[string]string `json:"files"`
	Entry string            `json:"entry"`
}

var ansi = regexp.MustCompile("\x1b\\[[0-9;]*m")

func plain(text string) string {
	return strings.ReplaceAll(ansi.ReplaceAllString(text, ""), root+"/", "")
}

func relative(file string) string {
	return strings.TrimPrefix(strings.TrimPrefix(file, root), "/")
}

func compile(req request, mode compiler.Mode) (result compiler.Result, diagnostics []diagnostic, failure error) {
	if req.Entry == "" {
		req.Entry = "main.osl"
	}
	overlay := map[string]string{}
	for name, source := range req.Files {
		overlay[path.Join(root, path.Clean("/"+name))] = source
	}
	entry := path.Join(root, path.Clean("/"+req.Entry))
	seen := map[string]bool{}
	add := func(d diagnostic) {
		key := fmt.Sprintf("%s:%d:%s", d.File, d.Line, strings.SplitN(d.Message, "\n", 2)[0])
		if seen[key] {
			return
		}
		seen[key] = true
		diagnostics = append(diagnostics, d)
	}
	fromError := func(ce *ast.CompileError) diagnostic {
		message := plain(ce.Message)
		code := ""
		if colon := strings.Index(message, ":"); colon > 0 && !strings.Contains(message[:colon], " ") {
			code = "OSL-" + strings.ToUpper(strings.TrimSuffix(message[:colon], "Error"))
		}
		return diagnostic{Severity: "error", Code: code, Message: message, File: relative(ce.File), Line: ce.Line, Column: ce.Column, Length: ce.Length, Rendered: plain(ce.Error())}
	}
	defer func() {
		if recovered := recover(); recovered != nil {
			if ce, ok := recovered.(*ast.CompileError); ok {
				add(fromError(ce))
				return
			}
			failure = fmt.Errorf("%v", recovered)
		}
	}()
	result, failure = compiler.NewEngine().Compile(context.Background(), compiler.Request{
		Entry:       entry,
		Overlay:     overlay,
		Mode:        mode,
		CachePolicy: compiler.CacheDisabled,
		Target:      compiler.Target{GOOS: "linux", GOARCH: "amd64"},
	})
	// Compile errors carry the rendered source excerpt; the diagnostics
	// list carries codes and fixes. Errors go first so their excerpt wins.
	for _, ce := range result.Errors {
		add(fromError(ce))
	}
	for _, d := range result.Diagnostics {
		if d.Severity == pipeline.DiagnosticSeverityPedantic {
			continue
		}
		out := diagnostic{Severity: string(d.Severity), Code: d.Code, Message: plain(d.Message), File: relative(d.Primary.File), Line: d.Primary.Line, Column: d.Primary.Column, Length: d.Primary.Length, Notes: d.Notes}
		if out.File == "" {
			out.File = relative(entry)
		}
		if d.Fix != nil && d.Fix.Replacement != "" {
			out.Fix = d.Fix.Replacement
		}
		add(out)
	}
	for i := range diagnostics {
		if diagnostics[i].File == "" {
			diagnostics[i].File = relative(entry)
		}
	}
	sort.SliceStable(diagnostics, func(i, j int) bool {
		if diagnostics[i].File != diagnostics[j].File {
			return diagnostics[i].File < diagnostics[j].File
		}
		return diagnostics[i].Line < diagnostics[j].Line
	})
	return result, diagnostics, failure
}

func reply(value map[string]any) any {
	data, _ := json.Marshal(value)
	return string(data)
}

func decode(args []js.Value) (request, error) {
	var req request
	if len(args) == 0 {
		return req, fmt.Errorf("missing request")
	}
	if err := json.Unmarshal([]byte(args[0].String()), &req); err != nil {
		return req, err
	}
	return req, nil
}

func handler(mode compiler.Mode, withGo bool) js.Func {
	return js.FuncOf(func(_ js.Value, args []js.Value) any {
		req, err := decode(args)
		if err != nil {
			return reply(map[string]any{"error": err.Error()})
		}
		result, diagnostics, failure := compile(req, mode)
		out := map[string]any{"diagnostics": diagnostics}
		if diagnostics == nil {
			out["diagnostics"] = []diagnostic{}
		}
		if failure != nil {
			out["error"] = plain(failure.Error())
		}
		if withGo && failure == nil {
			out["go"] = string(result.Go)
		}
		return reply(out)
	})
}

func main() {
	pipeline.ConfigurePackages(packages.FS)
	pipeline.ConfigureVersion(version)
	js.Global().Set("oslCheck", handler(compiler.ModeAnalysis, false))
	js.Global().Set("oslTranspile", handler(compiler.ModeTranspile, true))
	js.Global().Set("oslFormat", js.FuncOf(func(_ js.Value, args []js.Value) any {
		if len(args) == 0 {
			return reply(map[string]any{"error": "missing source"})
		}
		formatted, err := formatter.Format(args[0].String())
		if err != nil {
			return reply(map[string]any{"error": plain(err.Error())})
		}
		return reply(map[string]any{"source": formatted})
	}))
	js.Global().Set("oslVersion", version)
	js.Global().Set("oslReady", true)
	select {}
}
