// 手描きスタンプ（自分磨き30日の「こいぶみ」と同じ絵）。100x100
window.STAMPS = (() => {
  const K = 'stroke="#2a1d14" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"'
  const face = (x, y) => `<circle cx="${x - 9}" cy="${y}" r="3.5" fill="#2a1d14"/><circle cx="${x + 9}" cy="${y}" r="3.5" fill="#2a1d14"/>`
  return {
    heart: `<path d="M50 84 C20 64 10 46 18 30 C26 16 44 18 50 32 C56 18 74 16 82 30 C90 46 80 64 50 84Z" fill="#e8574a" ${K}/><path d="M30 32 q6-6 12-2" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
    faint: `<circle cx="50" cy="52" r="34" fill="#ffd78a" ${K}/><path d="M33 44 l10 10 M43 44 l-10 10 M57 44 l10 10 M67 44 l-10 10" ${K}/><ellipse cx="50" cy="70" rx="7" ry="5" fill="#2a1d14"/><path d="M20 18 q8 6 0 12 q-8 6 0 12" fill="none" ${K}/><path d="M80 14 q8 6 0 12" fill="none" ${K}/>`,
    thumb: `<path d="M30 46 h12 l10-24 q8-2 9 8 l-3 14 h18 q9 1 7 10 l-6 26 q-2 6-9 6 H42 q-6 0-12-4Z" fill="#ffd2a8" ${K}/><rect x="16" y="44" width="16" height="40" rx="3" fill="#f3d36b" ${K}/>`,
    onigiri: `<path d="M50 14 C64 14 86 56 86 70 C86 82 74 86 50 86 C26 86 14 82 14 70 C14 56 36 14 50 14Z" fill="#fffaf0" ${K}/><rect x="32" y="60" width="36" height="26" rx="2" fill="#2f3b2a" ${K}/><circle cx="50" cy="44" r="7" fill="#f08a6a"/>`,
    zzz: `<path d="M18 30 h20 l-20 24 h20" fill="none" ${K}/><path d="M48 18 h16 l-16 18 h16" fill="none" ${K}/><path d="M72 50 h12 l-12 14 h12" fill="none" ${K}/><path d="M14 80 q36-16 72 0" fill="#9fd0c7" ${K}/>`,
    book: `<path d="M14 26 q18-8 36 2 v56 q-18-10-36-2Z" fill="#c9533c" ${K}/><path d="M86 26 q-18-8-36 2 v56 q18-10 36-2Z" fill="#d8693f" ${K}/><path d="M22 40 q10-4 20 0 M22 52 q10-4 20 0 M58 40 q10-4 20 0" fill="none" stroke="#fff3dc" stroke-width="3" stroke-linecap="round"/>`,
    muscle: `<path d="M18 80 q-4-26 10-40 l8-14 q6-8 14-2 l-4 14 q16-6 28 4 q14 12 6 30 q-8 12-30 10 Z" fill="#ffc79a" ${K}/><path d="M44 58 q10-8 20 0" fill="none" ${K}/><path d="M80 18 l4 10 M90 28 l-10 2 M70 14 l2 8" ${K}/>`,
    sparkle: `<path d="M50 8 L58 42 L92 50 L58 58 L50 92 L42 58 L8 50 L42 42Z" fill="#ffd700" ${K}/><path d="M80 10 l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#fff3dc" ${K}/>`,
    peace: `<path d="M34 50 l-10-30 q-1-8 7-8 q6 0 7 6 l7 24 l3-26 q2-7 8-6 q7 1 6 8 l-4 32 q14 4 12 20 q-2 18-24 18 q-22 0-24-18 q-1-14 12-20Z" fill="#c98a5a" ${K}/>`,
    coin: `<circle cx="50" cy="50" r="34" fill="#f3c04b" ${K}/><circle cx="50" cy="50" r="24" fill="none" stroke="#b8861f" stroke-width="3"/><path d="M40 34 l10 16 10-16 M38 52 h24 M38 62 h24 M50 50 v22" fill="none" ${K}/>`,
    paw: `<ellipse cx="50" cy="64" rx="22" ry="18" fill="#f4a9a0" ${K}/><circle cx="24" cy="38" r="9" fill="#f4a9a0" ${K}/><circle cx="40" cy="24" r="9" fill="#f4a9a0" ${K}/><circle cx="60" cy="24" r="9" fill="#f4a9a0" ${K}/><circle cx="76" cy="38" r="9" fill="#f4a9a0" ${K}/>`,
    tea: `<path d="M20 44 h56 l-6 34 q-2 8-10 8 H36 q-8 0-10-8Z" fill="#8fb36b" ${K}/><path d="M76 52 q14 0 10 14 q-3 8-14 6" fill="none" ${K}/><path d="M34 34 q-6-8 0-14 M50 34 q-6-8 0-14 M66 34 q-6-8 0-14" fill="none" stroke="#8a7a6a" stroke-width="3.5" stroke-linecap="round"/><path d="M30 56 h36" stroke="#5f8a45" stroke-width="3"/>`,
    bandage: `<g transform="rotate(-35 50 50)"><rect x="8" y="36" width="84" height="28" rx="14" fill="#f2c79c" ${K}/><rect x="36" y="36" width="28" height="28" fill="#fff3dc" ${K}/><circle cx="44" cy="44" r="2" fill="#c9a07a"/><circle cx="56" cy="56" r="2" fill="#c9a07a"/><circle cx="56" cy="44" r="2" fill="#c9a07a"/><circle cx="44" cy="56" r="2" fill="#c9a07a"/></g>`,
    game: `<rect x="10" y="30" width="80" height="44" rx="20" fill="#5aa0d8" ${K}/><path d="M28 44 v16 M20 52 h16" ${K}/><circle cx="66" cy="46" r="5" fill="#e8574a" ${K}/><circle cx="76" cy="56" r="5" fill="#f3d36b" ${K}/>`,
    trophy: `<path d="M30 16 h40 v18 q0 22-20 26 q-20-4-20-26Z" fill="#ffd700" ${K}/><path d="M30 22 h-12 q0 18 14 18 M70 22 h12 q0 18-14 18" fill="none" ${K}/><path d="M44 60 h12 v12 h-12Z" fill="#e0b23a" ${K}/><rect x="30" y="72" width="40" height="12" rx="2" fill="#8a5a33" ${K}/>`,
    bankbook: `<rect x="16" y="20" width="68" height="62" rx="4" fill="#3d6fa8" ${K}/><rect x="26" y="32" width="48" height="10" rx="2" fill="#fff3dc"/><path d="M28 56 h44 M28 66 h30" stroke="#fff3dc" stroke-width="4" stroke-linecap="round"/><path d="M84 24 l6 6 M88 16 l2 8 M78 14 l0 6" ${K}/>`,
  }
})()
