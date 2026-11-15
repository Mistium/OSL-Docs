export type AppName =
  | 'notes' | 'mail' | 'photos' | 'beam' | 'connect' | 'appsie' | 'gate' | 'authenticator'
  | 'reel' | 'embed' | 'place' | 'devfund'

export interface Swatch {
  hex: string
  name: string
}

export declare const APP_COLOURS: Record<AppName, string>
export declare const SWATCHES: Swatch[]

export declare function isHex(value: unknown): value is string
export declare function swatchesFor(first: string, count?: number): Swatch[]
export declare function onAccent(hex: string): string
export declare function applyAccent(hex: string, root?: HTMLElement): void

export interface AccentOptions {
  /** Separates one app's choice from another's in localStorage. */
  app: AppName | (string & {})
  /** The colour until someone picks another. Defaults to APP_COLOURS[app]. */
  fallback?: string
  /** Where the colour is set. Defaults to <html>. */
  root?: HTMLElement
}

export declare function savedAccent(options: AccentOptions, userId?: string | null): string
export declare function saveAccent(options: AccentOptions, userId: string | null, hex: string): void

export interface AccentStore {
  readonly value: string
  readonly fallback: string
  use(userId: string | null): void
  set(hex: string): void
  reset(): void
  subscribe(listener: (hex: string) => void): () => void
}

export declare function accentStore(options: AccentOptions): AccentStore

export interface ColourPickerElement extends HTMLElement {
  value: string
  swatches: Swatch[]
}

/** Attributes for <r-colour-picker>, for JSX intrinsic element declarations. */
export interface ColourPickerAttributes {
  value?: string
  app?: AppName | (string & {})
  count?: number | string
  label?: string
  size?: 'sm' | 'lg'
  shape?: 'square'
  custom?: 'off'
  swatches?: Swatch[]
}

declare global {
  interface HTMLElementTagNameMap {
    'r-colour-picker': ColourPickerElement
  }
}
