/// <reference types="vite/client" />

declare module "virtual:docs-index" {
  const index: import("./lib/types").DocsIndex;
  export default index;
}

declare module "virtual:landing-outputs" {
  const outputs: Record<string, import("./lib/types").Recorded>;
  export default outputs;
}

interface ImportMetaEnv {
  /* The run server's URL, such as https://run.osl-lang.org. Without one,
     edited code is checked in the browser but not run. */
  readonly VITE_OSL_RUNNER?: string;
  readonly VITE_SITE_URL?: string;
}
