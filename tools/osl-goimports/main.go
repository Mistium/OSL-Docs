// Command osl-goimports prints the third-party Go packages OSL's std:
// packages import, one per line. scripts/osl-assets.ts builds them for
// js/wasm, at the versions the compiler's go.mod pins, so programs that use
// those packages build in the browser too.
//
// It reads the compiler's embedded packages, so it is built inside an OSL
// checkout (scripts/osl-assets.ts copies it to cmd/osl-docs-goimports there).
package main

import (
	"fmt"

	"osl/packages"
)

func main() {
	for _, path := range packages.GoImports() {
		fmt.Println(path)
	}
}
