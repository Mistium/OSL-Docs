// Each app's colour, and a way for people to pick their own. Plain JS with no
// dependencies, so it works the same in a Vite app, an OSL server's templates
// or a static page.
//
//   import { accentStore } from './rotur-ui/colour/colour.js'
//   const accent = accentStore({ app: 'place' })     // applies the saved colour now
//   accent.use(userId)                               // after sign-in: their colour
//
//   <r-colour-picker app="place"></r-colour-picker>  // swatches and a custom colour
//   picker.value = accent.value
//   picker.addEventListener('change', () => accent.set(picker.value))
//
// tokens.css derives every --r-accent-* token from --r-accent-base, so setting
// that one colour (applyAccent does) themes the whole kit, motifs included.

/** Each app's own colour, from the landing board the owner approved. */
export const APP_COLOURS = {
  notes: '#c299cf',
  mail: '#8aa2ff',
  photos: '#f7a46b',
  beam: '#ffc35a',
  connect: '#56c6e8',
  appsie: '#a093ff',
  gate: '#b7d96b',
  authenticator: '#59d4b4',
  reel: '#e08ae0',
  embed: '#ecd96a',
  place: '#ff8a80',
  devfund: '#74d48f',
}

/** Colours that read well on black, in an order that spreads the hues. */
export const SWATCHES = [
  { hex: '#c299cf', name: 'Lilac' },
  { hex: '#8aa2ff', name: 'Periwinkle' },
  { hex: '#56c6e8', name: 'Sky' },
  { hex: '#74d48f', name: 'Mint' },
  { hex: '#ffc35a', name: 'Marigold' },
  { hex: '#ff8a80', name: 'Coral' },
  { hex: '#e08ae0', name: 'Orchid' },
  { hex: '#f7a46b', name: 'Apricot' },
  { hex: '#59d4b4', name: 'Teal' },
  { hex: '#a093ff', name: 'Violet' },
  { hex: '#b7d96b', name: 'Lime' },
  { hex: '#ecd96a', name: 'Lemon' },
]

const HEX = /^#[0-9a-f]{6}$/i

export function isHex(value) {
  return typeof value === 'string' && HEX.test(value)
}

function nameOf(hex) {
  return SWATCHES.find((s) => s.hex === hex)?.name ?? hex
}

/** `count` swatches with `first` (the app's colour) at the front. */
export function swatchesFor(first, count = 8) {
  const lead = isHex(first) ? first.toLowerCase() : SWATCHES[0].hex
  const rest = SWATCHES.filter((s) => s.hex !== lead)
  return [{ hex: lead, name: nameOf(lead) }, ...rest].slice(0, Math.max(1, count))
}

// WCAG relative luminance, 0 (black) to 1 (white).
function luminance(hex) {
  const channel = (i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

/** The text colour for an accent fill: near-black on light colours, white on dark ones. */
export function onAccent(hex) {
  return isHex(hex) && luminance(hex) > 0.18 ? '#120c08' : '#ffffff'
}

/** Themes the page (or `root`) with one colour. */
export function applyAccent(hex, root = document.documentElement) {
  if (!isHex(hex)) return
  root.style.setProperty('--r-accent-base', hex.toLowerCase())
  root.style.setProperty('--r-on-accent', onAccent(hex))
}

function fallbackOf(options) {
  const fallback = options.fallback ?? APP_COLOURS[options.app]
  return isHex(fallback) ? fallback.toLowerCase() : SWATCHES[0].hex
}

function storageKey(options, userId) {
  return `rotur-accent:${options.app}:${userId ?? 'signed-out'}`
}

/** The colour this person picked for the app, or the app's own. */
export function savedAccent(options, userId = null) {
  try {
    const saved = localStorage.getItem(storageKey(options, userId)) ?? ''
    return isHex(saved) ? saved.toLowerCase() : fallbackOf(options)
  } catch {
    return fallbackOf(options)
  }
}

export function saveAccent(options, userId, hex) {
  try {
    if (hex.toLowerCase() === fallbackOf(options)) localStorage.removeItem(storageKey(options, userId))
    else localStorage.setItem(storageKey(options, userId), hex.toLowerCase())
  } catch {
    // Private browsing without storage: the colour still applies for this visit.
  }
}

/**
 * The app's accent as one small store: it applies the saved colour straight
 * away, follows whoever is signed in, and saves what they pick. `subscribe`
 * calls back with every change, so a framework can mirror it.
 */
export function accentStore(options) {
  const listeners = new Set()
  let userId = null
  let value = savedAccent(options, null)
  const root = options.root ?? (typeof document !== 'undefined' ? document.documentElement : null)
  const show = (hex) => {
    value = hex
    if (root) applyAccent(hex, root)
    for (const listener of listeners) listener(hex)
  }
  show(value)
  return {
    get value() {
      return value
    },
    get fallback() {
      return fallbackOf(options)
    },
    /** Switches to this person's colour, or the signed-out one for null. */
    use(id) {
      userId = id ?? null
      show(savedAccent(options, userId))
    },
    set(hex) {
      if (!isHex(hex)) return
      saveAccent(options, userId, hex)
      show(hex.toLowerCase())
    },
    reset() {
      this.set(fallbackOf(options))
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const PLUS =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>'

/**
 * <r-colour-picker>: a radio group of swatches and a custom colour.
 * Attributes: value, app (puts that app's colour first), count, label,
 * size ("sm" or "lg"), shape ("square"), and custom="off" to leave out the
 * custom colour. The `swatches` property takes [{ hex, name }] instead.
 * It fires `input` while the custom colour is being dragged and `change`
 * when a colour is chosen; read `.value`. It only reports choices: the page
 * applies and saves them, with accentStore or its own code.
 */
class ColourPicker extends (typeof HTMLElement === 'undefined' ? class {} : HTMLElement) {
  static observedAttributes = ['value', 'app', 'count', 'label', 'size', 'shape', 'custom']

  #value = ''
  #swatches = null

  connectedCallback() {
    // A framework may set properties before the element was defined.
    for (const key of ['value', 'swatches']) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const v = this[key]
        delete this[key]
        this[key] = v
      }
    }
    this.#render()
  }

  attributeChangedCallback(name, _old, next) {
    if (name === 'value') this.#value = isHex(next) ? next.toLowerCase() : this.#value
    if (this.isConnected) this.#render()
  }

  get value() {
    return this.#value || this.#list()[0].hex
  }
  set value(hex) {
    if (!isHex(hex) || hex.toLowerCase() === this.#value) return
    this.#value = hex.toLowerCase()
    this.#sync()
  }

  get swatches() {
    return this.#list()
  }
  set swatches(list) {
    this.#swatches = Array.isArray(list) ? list.filter((s) => s && isHex(s.hex)) : null
    if (this.isConnected) this.#render()
  }

  #list() {
    if (this.#swatches?.length) return this.#swatches.map((s) => ({ hex: s.hex.toLowerCase(), name: s.name || s.hex }))
    const app = this.getAttribute('app')
    const count = Number(this.getAttribute('count')) || 8
    return swatchesFor(APP_COLOURS[app] ?? SWATCHES[0].hex, count)
  }

  #render() {
    const size = this.getAttribute('size')
    const group = document.createElement('div')
    group.className =
      'r-swatches' +
      (size === 'sm' || size === 'lg' ? ` r-swatches--${size}` : '') +
      (this.getAttribute('shape') === 'square' ? ' r-swatches--square' : '')
    group.setAttribute('role', 'radiogroup')
    group.setAttribute('aria-label', this.getAttribute('label') || 'Colour')
    for (const s of this.#list()) {
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'r-swatch'
      b.setAttribute('role', 'radio')
      b.setAttribute('aria-label', s.name)
      b.title = s.name
      b.dataset.hex = s.hex
      b.style.setProperty('--swatch', s.hex)
      b.addEventListener('click', () => this.#choose(s.hex))
      group.append(b)
    }
    if (this.getAttribute('custom') !== 'off') {
      const label = document.createElement('label')
      label.className = 'r-swatch r-swatch--custom'
      label.title = 'Custom colour'
      const input = document.createElement('input')
      input.type = 'color'
      input.setAttribute('aria-label', 'Custom colour')
      // The page hears this element's events, not the inner input's.
      input.addEventListener('input', (e) => {
        e.stopPropagation()
        this.#value = input.value.toLowerCase()
        this.#sync()
        this.dispatchEvent(new Event('input', { bubbles: true }))
      })
      input.addEventListener('change', (e) => {
        e.stopPropagation()
        this.#choose(input.value)
      })
      label.append(input)
      group.append(label)
    }
    group.addEventListener('keydown', (e) => this.#key(e))
    this.replaceChildren(group)
    this.#sync()
  }

  // Arrow keys move through the swatches and choose as they go, as radios do.
  #key(e) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    const radios = [...this.querySelectorAll('.r-swatch[role="radio"]')]
    const at = radios.indexOf(document.activeElement)
    if (at < 0) return
    let next = -1
    if (step) next = (at + step + radios.length) % radios.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = radios.length - 1
    if (next < 0) return
    e.preventDefault()
    radios[next].focus()
    this.#choose(radios[next].dataset.hex)
  }

  #choose(hex) {
    if (!isHex(hex)) return
    this.#value = hex.toLowerCase()
    this.#sync()
    this.dispatchEvent(new Event('input', { bubbles: true }))
    this.dispatchEvent(new Event('change', { bubbles: true }))
  }

  #sync() {
    const current = this.value
    const radios = [...this.querySelectorAll('.r-swatch[role="radio"]')]
    const preset = radios.some((b) => b.dataset.hex === current)
    for (const b of radios) {
      const on = b.dataset.hex === current
      b.setAttribute('aria-checked', String(on))
      b.tabIndex = on || (!preset && b === radios[0]) ? 0 : -1
    }
    const custom = this.querySelector('.r-swatch--custom')
    if (!custom) return
    custom.dataset.checked = String(!preset)
    custom.style.setProperty('--swatch', preset ? 'transparent' : current)
    const input = custom.querySelector('input')
    input.value = current
    const icon = custom.querySelector('svg')
    if (preset && !icon) custom.insertAdjacentHTML('afterbegin', PLUS)
    if (!preset && icon) icon.remove()
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('r-colour-picker')) {
  customElements.define('r-colour-picker', ColourPicker)
}
