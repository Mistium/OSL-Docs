// Command osl-api prints every std: package's OSL API as JSON: its
// description, functions, constants and the methods of the types it exposes,
// with signatures as OSL writes them and the doc comments from the package
// source. The docs site builds its package reference from this.
//
// It reads the compiler's own package index, so it is built inside an OSL
// checkout (scripts/osl-assets.ts copies it to cmd/osl-docs-api there).
package main

import (
	"encoding/json"
	"os"
	"regexp"
	"sort"
	"strings"

	"osl/internal/compiler/pipeline"
	"osl/packages"
)

var version = "dev"

type param struct {
	Name     string `json:"name"`
	Type     string `json:"type"`
	Optional bool   `json:"optional,omitempty"`
	Variadic bool   `json:"variadic,omitempty"`
}

type method struct {
	Name       string  `json:"name"`
	Signature  string  `json:"signature"`
	Params     []param `json:"params"`
	Returns    string  `json:"returns,omitempty"`
	Doc        string  `json:"doc"`
	Deprecated string  `json:"deprecated,omitempty"`
}

type constant struct {
	Name       string `json:"name"`
	Type       string `json:"type"`
	Doc        string `json:"doc"`
	Deprecated string `json:"deprecated,omitempty"`
}

type typeAPI struct {
	Name    string   `json:"name"`
	Methods []method `json:"methods"`
}

type packageAPI struct {
	Name        string     `json:"name"`
	Import      string     `json:"import"`
	Description string     `json:"description"`
	About       string     `json:"about,omitempty"`
	Functions   []method   `json:"functions"`
	Constants   []constant `json:"constants"`
	Types       []typeAPI  `json:"types"`
}

// The OSL spelling of an optional variadic: a trailing ...any parameter that
// the doc calls optional reads as name?.
var optionalHint = regexp.MustCompile(`(?i)\b(optional|default|defaults|omitted|when given|if given)\b`)

func convert(receiver string, info pipeline.OSLPkgMethodInfo) method {
	out := method{Name: info.MethodName, Doc: strings.TrimSpace(info.Doc), Deprecated: info.Deprecated}
	labels := []string{}
	for _, p := range info.Params() {
		pp := param{Name: p.Name, Type: p.Type, Optional: p.Optional, Variadic: p.Variadic}
		out.Params = append(out.Params, pp)
		labels = append(labels, p.Label())
	}
	if out.Params == nil {
		out.Params = []param{}
	}
	if info.ReturnType != "" && !info.Void {
		out.Returns = pipeline.DisplayPackageType(info.ReturnType)
	}
	out.Signature = receiver + "." + info.MethodName + "(" + strings.Join(labels, ", ") + ")"
	if out.Returns != "" {
		out.Signature += " -> " + out.Returns
	}
	return out
}

func methods(receiver string, infos map[string]pipeline.OSLPkgMethodInfo, keep func(pipeline.OSLPkgMethodInfo) bool) []method {
	seen := map[string]bool{}
	out := []method{}
	for _, info := range infos {
		if !keep(info) || strings.HasPrefix(info.MethodName, "_") || strings.HasPrefix(info.MethodName, "OSL") {
			continue
		}
		key := strings.ToLower(info.MethodName)
		if seen[key] {
			continue
		}
		seen[key] = true
		out = append(out, convert(receiver, info))
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Name < out[j].Name })
	return out
}

// about is the package header's prose: its comment lines after the
// // description: line, up to the first blank comment block that ends it.
func about(source string) string {
	var lines []string
	started := false
	for _, raw := range strings.Split(source, "\n") {
		line := strings.TrimSpace(raw)
		if !strings.HasPrefix(line, "//") {
			if started || len(lines) > 0 {
				break
			}
			continue
		}
		text := strings.TrimPrefix(strings.TrimPrefix(line, "//"), " ")
		if strings.HasPrefix(text, "description:") {
			started = true
			continue
		}
		if !started {
			continue
		}
		for _, meta := range []string{"name:", "author:", "requires:", "conflicts:", "linkPackages:", "tags:"} {
			if strings.HasPrefix(text, meta) {
				text = "\x00"
			}
		}
		if text == "\x00" {
			continue
		}
		lines = append(lines, text)
	}
	return strings.TrimSpace(strings.Join(lines, "\n"))
}

func main() {
	pipeline.ConfigurePackages(packages.FS)
	pipeline.ConfigureVersion(version)
	var out []packageAPI
	for _, path := range pipeline.EmbeddedPackageNames() {
		name := path[strings.LastIndex(path, "/")+1:]
		source, _ := pipeline.EmbeddedPackageSource(path)
		api := packageAPI{Name: name, Import: "std:" + path, Description: pipeline.PackageDescription(path), About: about(source)}
		all := pipeline.PackageMethods(path)
		pkgReceiver := "OSL" + name + "Pkg"
		api.Functions = methods(name, all, func(info pipeline.OSLPkgMethodInfo) bool {
			return strings.TrimPrefix(info.GoReceiver, "*") == pkgReceiver
		})
		constants := pipeline.PackageConstants(path)
		names := make([]string, 0, len(constants))
		for n := range constants {
			names = append(names, n)
		}
		sort.Strings(names)
		api.Constants = []constant{}
		for _, n := range names {
			c := constants[n]
			api.Constants = append(api.Constants, constant{Name: c.Name, Type: pipeline.DisplayPackageType(c.Type), Doc: strings.TrimSpace(c.Doc), Deprecated: c.Deprecated})
		}
		api.Types = []typeAPI{}
		for _, typeName := range pipeline.PackageTypes(path) {
			typed := pipeline.TypeMethods(name + "." + typeName)
			api.Types = append(api.Types, typeAPI{Name: name + "." + typeName, Methods: methods(strings.ToLower(typeName[:1])+typeName[1:], typed, func(pipeline.OSLPkgMethodInfo) bool { return true })})
		}
		// Built-in types such as set have no package value: their methods
		// belong to the type the package defines.
		if len(api.Functions) == 0 && len(api.Types) == 0 && len(all) > 0 {
			api.Types = append(api.Types, typeAPI{Name: name, Methods: methods(name, all, func(pipeline.OSLPkgMethodInfo) bool { return true })})
		}
		out = append(out, api)
	}
	encoder := json.NewEncoder(os.Stdout)
	encoder.SetIndent("", "  ")
	encoder.SetEscapeHTML(false)
	_ = encoder.Encode(map[string]any{"version": version, "packages": out})
}
