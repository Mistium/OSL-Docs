// The markup inside each motif's <div class="r-motif r-motif--NAME">, as
// motifs.css expects it. Plain strings, so any page can use them: set one as
// the div's innerHTML, or copy it into a template.

const b = (n) => '<b></b>'.repeat(n)
// Where the apps sit around the account in the rotur motif
const HUB = [[240, 45], [374, 76], [430, 150], [374, 224], [240, 255], [106, 224], [50, 150], [106, 76]]

export const MOTIFS = {
  notes: `<i>${b(3)}</i>`,
  mail: `<i>${b(3)}</i>`,
  photos: `<i><i>${b(3)}</i><i>${b(3)}</i><i>${b(4)}</i></i>`,
  gifs: '<i><b></b></i>',
  beam:
    '<svg viewBox="0 0 600 360">' +
    '<g><path d="M54 258Q136 148 218 200"/><path d="M218 200Q309 90 400 256"/><path d="M400 256Q474 112 548 222"/></g>' +
    '<g><rect x="16" y="190" width="76" height="136" rx="15"/><path d="M44 312h20"/></g>' +
    '<g><rect x="128" y="120" width="180" height="128" rx="14"/><path d="M128 146h180"/><circle cx="145" cy="133" r="3.5"/><circle cx="157" cy="133" r="3.5"/><circle cx="169" cy="133" r="3.5"/></g>' +
    '<g><rect x="334" y="214" width="132" height="88" rx="9"/><path d="M312 318h176"/></g>' +
    '<g><rect x="508" y="160" width="80" height="124" rx="13"/><path d="M538 270h20"/></g>' +
    '<rect x="-9" y="-9" width="18" height="18" rx="4"/>' +
    '</svg>',
  connect:
    '<svg viewBox="0 0 240 140">' +
    '<path d="M60 40C110 40 130 100 180 100"/><path d="M60 40C60 90 100 110 120 118"/>' +
    '<rect x="20" y="20" width="80" height="44" rx="8"/><rect x="150" y="80" width="70" height="44" rx="8"/><rect x="100" y="104" width="28" height="30" rx="6"/>' +
    '</svg>',
  appsie: `<i><i>${b(4)}</i><i>${b(4)}</i><i>${b(4)}</i></i>`,
  gate: '<i><b></b></i>',
  authenticator:
    '<i><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="25"/><circle cx="28" cy="28" r="25"/></svg>' +
    `<i>${b(6)}</i></i>`,
  reel: `<i>${b(3)}</i>`,
  embed: `<i>${b(4)}</i>`,
  place: `<i>${b(60)}</i>`,
  devfund: '<i></i>',
  git:
    '<svg viewBox="0 0 240 120">' +
    '<path d="M20 80H220"/><path d="M70 80C88 80 88 40 105 40H145C172 40 172 80 190 80"/>' +
    '<circle cx="20" cy="80" r="9"/><circle cx="70" cy="80" r="9"/><circle cx="105" cy="40" r="9"/>' +
    '<circle cx="145" cy="40" r="9"/><circle cx="190" cy="80" r="9"/><circle cx="220" cy="80" r="9"/>' +
    '</svg>',
  pounce:
    `<i>${b(4)}<svg viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></i>`,
  sable:
    `<i><i>${b(2)}</i><i><i>${b(3)}</i>${b(3)}</i>` +
    `<i><i><b></b></i><i><b></b></i><i><b></b></i><b></b></i></i>`,
  originchats: `<i><i>${b(4)}</i><i>${b(3)}</i></i>`,
  rotur:
    '<svg viewBox="0 0 480 300"><g>' +
    HUB.map(([x, y]) => `<path pathLength="1" d="M240 150L${x} ${y}"/>`).join('') +
    '</g><circle cx="240" cy="150" r="38"/><g>' +
    HUB.map(([x, y]) => `<rect x="${x - 22}" y="${y - 22}" width="44" height="44" rx="12"/>`).join('') +
    '</g></svg>',
}
