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
  readonly VITE_SITE_URL?: string;
}
