// 17股トーク の中身（画面なし）。ブラウザでも Node（sim.mjs）でも同じ物が動く。時間は秒、0.05秒刻み
// 同じ種・同じ操作なら同じ結果になる（乱数は種から作る mulberry32 だけ）
;(function (G) {
  const D = G.D
  const DT = 0.05
  function rng(seed) {
    let a = (seed >>> 0) || 1
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  }
  const pick = (r, a) => a[Math.floor(r() * a.length)]
  function shuffle(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }

  const AIM_WIN = 0.8        // 並びが変わってからこの秒数の間に押すと「押そうとした所」がずれたとみなす
  const NUDGE_AT = 0.55      // 待てる時間のこの割合で「ねえ」が来る
  const TUT_PAT = 30         // 最初の1通だけ待てる時間を長く
  // 恋人が n 人の時、次の1人が来るまでに要る「合う返事」の数
  const needFor = n => (n <= 1 ? 2 : n <= 3 ? 3 : n <= 6 ? 4 : n <= 10 ? 5 : 6)
  const GROUP_FROM = 3       // 恋人がこの人数になったらグループの招待が来はじめる

  function create(seed) {
    const r = rng(seed)
    const g = {
      seed, r, t: 0, L: {}, order: [], prevOrder: [], reorderAt: -9, room: null,
      miss: 0, bad: 0, streak: 0, prog: 0, need: needFor(1), replies: 0, dodged: 0, gob: 0, ign: 0, moods: 0, over: false, overAt: 0,
      cause: null, ev: [], group: null, nextGroupAt: 0, peak: 0, msgN: 0, gseq: 0,
    }
    // 来る順: ミサキが最初。残りは混ぜて、めずらしい子（rare）は3人目より後に
    const rest = D.IDS.filter(id => id !== 'futsuu')
    const common = shuffle(r, rest.filter(id => !D.L[id].rare)), rare = shuffle(r, rest.filter(id => D.L[id].rare))
    const q = common.slice()
    for (const id of rare) q.splice(2 + Math.floor(r() * (q.length - 1)), 0, id)
    g.queue = q
    addLover(g, 'futsuu', 1.5)
    return g
  }

  function emit(g, type, o) { g.ev.push(Object.assign({ type, t: g.t }, o || {})) }
  function reorder(g, id, watched) {
    const before = g.order.slice()
    g.order = [id].concat(g.order.filter(x => x !== id))
    if (watched !== false && before.join() !== g.order.join()) { g.prevOrder = before; g.reorderAt = g.t; emit(g, 'reorder') }
  }
  function delay(g, lv) {
    const n = g.order.filter(x => x !== 'grp').length
    // 17人そろった後は、返すほど間隔がつまる（いつか必ず崩れる）
    const heat = Math.max(0.4, 1 - 0.025 * (g.after || 0))
    return (13 + g.r() * 11) * D.L[lv.id].talk * (1 + 0.06 * (n - 1)) * heat
  }
  function addLover(g, id, first) {
    const lv = { id, pend: null, nextAt: g.t + (first || 1.4 + g.r() * 1.6), unread: 0, log: [], deck: [], joinedAt: g.t, tut: !!first }
    g.L[id] = lv
    reorder(g, id)
    g.peak = Object.keys(g.L).length
    g.need = needFor(g.peak)
    emit(g, 'join', { id })
  }
  // 1通届く
  function newMessage(g, lv) {
    const P = D.L[lv.id]
    if (!lv.deck.length) lv.deck = shuffle(g.r, P.msgs.map((_, i) => i))
    const mi = lv.deck.shift(), m = P.msgs[mi]
    let choices
    if (!m[3]) {   // 抱き枕: どれを送ってもいい
      choices = shuffle(g.r, m[2]).slice(0, 3).map(tok => ({ tok, ok: true }))
    } else {
      // 合う返事1・合わない返事1・ほかの子に合う返事1（送り先を間違えた時の言葉に見える）
      const others = g.order.filter(x => x !== 'grp' && x !== lv.id && x !== 'pillow')
      const pool = others.length ? others : D.IDS.filter(x => x !== lv.id && x !== 'pillow' && x !== 'futsuu')
      const sigTok = D.L[pick(g.r, pool)].sig
      const ok = pick(g.r, m[2])
      choices = shuffle(g.r, [{ tok: ok, ok: true }, { tok: m[3], ok: false }, { tok: sigTok, ok: false }])
    }
    const pat = P.pat ? (lv.tut ? TUT_PAT : P.pat) : Infinity
    lv.tut = false
    lv.pend = { mi, t0: g.t, until: g.t + pat, pat, choices, nudged: false, n: ++g.msgN }
    lv.unread++
    lv.log.push({ w: 'p', x: m[0] === '@' || m[0][0] === '@' ? m[0] : [m[0], m[1]], at: g.t, pend: true })
    reorder(g, lv.id)
    emit(g, 'msg', { id: lv.id })
  }
  function line(g, lv, list, at) { const x = pick(g.r, list); lv.log.push({ w: 'p', x, at: at ?? g.t }); return x }
  function miss(g, kind, o) {
    g.miss++
    g.cause = Object.assign({ kind }, o)
    if (kind === 'ign') g.ign++
    emit(g, 'miss', g.cause)
    if (g.miss >= 2 && !g.over) { g.over = true; g.overAt = g.t; g.room = null; emit(g, 'over', g.cause) }
  }
  function addProg(g, n) {
    g.prog += n
    while (g.prog >= g.need && g.queue.length && !g.over) { g.prog -= g.need; addLover(g, g.queue.shift()) }
  }
  function annoy(g, id) {
    g.bad++; g.moods++; g.streak = 0
    emit(g, 'bad', { id, bars: 3 - g.bad })
    if (g.bad >= 3) { g.bad = 0; miss(g, 'mood', { id }) }
  }

  function step(g, dt) {
    if (g.over) return
    g.t = Math.round((g.t + (dt || DT)) * 1000) / 1000
    for (const id of g.order.slice()) {
      if (id === 'grp') continue
      const lv = g.L[id], p = lv.pend
      if (p) {
        if (g.t >= p.until) {   // 既読無視
          lv.pend = null; lv.unread = 0
          for (const e of lv.log) e.pend = false
          if (g.room && g.room.id === id) g.room = null
          lv.log.push({ w: 's', x: 'ign', at: g.t })
          line(g, lv, D.L[id].ign, g.t + 0.3)
          lv.nextAt = g.t + delay(g, lv) * 1.5
          reorder(g, id)
          miss(g, 'ign', { id })
          if (g.over) return
        } else if (!p.nudged && p.pat !== Infinity && g.t >= p.t0 + p.pat * NUDGE_AT) {
          p.nudged = true; lv.unread++
          line(g, lv, D.L[id].nudge)
          reorder(g, id)
          emit(g, 'nudge', { id })
        }
      } else if (g.t >= lv.nextAt) newMessage(g, lv)
    }
    const gr = g.group
    if (gr && g.t >= gr.until) {   // 招待を放っておいた: 誘った子が不機嫌
      endGroup(g)
      emit(g, 'grpIgnore', { id: gr.from })
      annoy(g, gr.from)
    } else if (!gr && g.peak >= GROUP_FROM) {
      if (!g.nextGroupAt) g.nextGroupAt = g.t + 14 + g.r() * 10
      else if (g.t >= g.nextGroupAt) spawnGroup(g)
    }
  }

  function spawnGroup(g) {
    const ids = g.order.filter(x => x !== 'grp')
    const from = pick(g.r, ids.filter(x => x !== 'pillow'))
    const danger = g.r() < 0.6
    const P = D.L[from]
    const strangers = n => shuffle(g.r, D.STRANGER.ja.map((_, i) => i)).slice(0, n).map(i => ({ s: i }))
    let mem, name
    if (danger) {
      const others = shuffle(g.r, ids.filter(x => x !== from))
      const extra = others.slice(0, ids.length >= 5 && g.r() < 0.35 ? 2 : 1)
      mem = [{ id: from }].concat(extra.map(id => ({ id })), strangers(g.r() < 0.5 ? 1 : 2))
      name = g.r() < 0.4 ? P.safe : pick(g.r, D.DANGER)
    } else {
      mem = [{ id: from }].concat(strangers(2 + Math.floor(g.r() * 2)))
      name = P.safe
    }
    g.group = { n: ++g.gseq, from, danger, name, mem: [mem[0]].concat(shuffle(g.r, mem.slice(1))), t0: g.t, until: g.t + 16 }
    reorder(g, 'grp')
    emit(g, 'group', { danger })
  }
  function endGroup(g) {
    g.order = g.order.filter(x => x !== 'grp')
    g.group = null
    g.nextGroupAt = g.t + 28 + g.r() * 24
    if (g.room && g.room.grp) g.room = null
  }

  // ---- 操作
  function tapSlot(g, slot) {
    if (g.over || g.room) return null
    const id = g.order[slot]
    if (!id) return null
    let aimed = null
    if (g.t - g.reorderAt < AIM_WIN && g.prevOrder[slot] && g.prevOrder[slot] !== id) aimed = g.prevOrder[slot]
    if (id === 'grp') { g.room = { grp: true, aimed }; emit(g, 'open', { id }); return g.room }
    g.room = { id, aimed, at: g.t }
    const lv = g.L[id]; lv.unread = 0
    emit(g, 'open', { id, aimed })
    return g.room
  }
  // 今の部屋で出す3つの返事。未読のない部屋なら、頭の中の相手（押そうとした子・一番急ぐ子）への返事が出る
  function roomChoices(g) {
    const rm = g.room
    if (!rm || rm.grp) return null
    const lv = g.L[rm.id]
    if (lv.pend) return { choices: lv.pend.choices, wrong: false, target: rm.id }
    let tg = rm.aimed && rm.aimed !== 'grp' && g.L[rm.aimed] && g.L[rm.aimed].pend ? rm.aimed : null
    if (!tg) {
      let best = Infinity
      for (const id of g.order) { if (id === 'grp' || id === rm.id) continue; const p = g.L[id].pend; if (p && p.until < best) { best = p.until; tg = id } }
      if (!tg) for (const id of g.order) { if (id !== 'grp' && id !== rm.id && g.L[id].pend) { tg = id; break } }
    }
    if (!tg) return null
    return { choices: g.L[tg].pend.choices, wrong: true, target: tg }
  }
  function choose(g, i) {
    const rc = roomChoices(g)
    if (!rc || g.over) return null
    const c = rc.choices[i]
    if (!c) return null
    const lv = g.L[g.room.id], P = D.L[lv.id]
    lv.log.push({ w: 'y', x: c.tok, at: g.t })
    let res
    if (!rc.wrong) {
      for (const e of lv.log) e.pend = false
      lv.pend = null; lv.unread = 0
      lv.nextAt = g.t + delay(g, lv)
      if (c.ok) {
        g.replies++; g.streak++
        if (g.bad > 0 && g.streak >= 4) { g.bad--; g.streak = 0; emit(g, 'heal', { bars: 3 - g.bad }) }
        line(g, lv, P.good, g.t + 0.6)
        res = { kind: 'good', id: lv.id }
        emit(g, 'good', { id: lv.id })
        if (!g.queue.length) g.after = (g.after || 0) + 1
        addProg(g, 1)
      } else {
        line(g, lv, P.bad, g.t + 0.6)
        res = { kind: 'bad', id: lv.id }
        annoy(g, lv.id)
      }
    } else if (lv.id === 'pillow') {   // 抱き枕は何を送っても「……」。ミスにならない
      line(g, lv, P.good, g.t + 0.6)
      res = { kind: 'pillow', id: lv.id, target: rc.target }
      emit(g, 'pillowGob', { id: lv.id })
    } else {   // 誤爆
      g.gob++
      line(g, lv, P.gob, g.t + 0.5)
      res = { kind: 'gob', id: lv.id, target: rc.target, tok: c.tok }
      miss(g, 'gob', { id: lv.id, target: rc.target, tok: c.tok })
    }
    g.room = null
    if (!g.over) reorder(g, lv.id, false)
    return res
  }
  function back(g) { g.room = null }
  function groupAnswer(g, join) {
    const gr = g.group
    if (!gr || g.over) return null
    let res
    if (gr.danger) {
      if (join) { const b = gr.mem.find(m => m.id && m.id !== gr.from); res = { kind: 'shura', from: gr.from, b: b.id }; endGroup(g); emit(g, 'shura', res); miss(g, 'grp', { id: gr.from, b: b.id }) }
      else { res = { kind: 'dodge' }; g.dodged++; endGroup(g); emit(g, 'dodge'); addProg(g, 3) }
    } else {
      if (join) { res = { kind: 'joined' }; endGroup(g); emit(g, 'joined'); addProg(g, 1) }
      else { res = { kind: 'rude', id: gr.from }; endGroup(g); annoy(g, gr.from) }
    }
    g.room = null
    return res
  }

  // ---- 人の速さの bot（sim.mjs と OGP 撮影で使う）。kind: 'human' | 'fast' | 'idle' | 'sloppy'
  function makeBot(kind, seed) { return { kind, r: rng(seed ^ 0x9e3779b9), next: 0, phase: 'look', slot: -1 } }
  const BOT = {
    human: { react: [1.0, 1.6], read: [1.1, 1.8], acc: 0.86, notice: 0.75, grp: 0.85, urgent: 0.6 },
    good: { react: [0.7, 1.1], read: [0.8, 1.2], acc: 0.93, notice: 0.85, grp: 0.93, urgent: 0.8 },
    fast: { react: [0.45, 0.7], read: [0.5, 0.8], acc: 0.97, notice: 0.95, grp: 0.97, urgent: 1 },
    sloppy: { react: [0.8, 1.3], read: [0.6, 1.0], acc: 0.6, notice: 0.3, grp: 0.5, urgent: 0.3 },
  }
  function botStep(g, b) {
    if (g.over || b.kind === 'idle' || g.t < b.next) return
    const k = BOT[b.kind], r = b.r, span = a => a[0] + r() * (a[1] - a[0])
    if (!g.room) {
      if (b.phase === 'aim') { tapSlot(g, b.slot); b.phase = 'look'; b.next = g.t + span(k.read); return }
      const pend = g.order.filter(id => id === 'grp' || g.L[id].pend)
      if (!pend.length) { b.next = g.t + 0.2; return }
      let tgt
      if (r() < k.urgent) { let best = Infinity; for (const id of pend) { const u = id === 'grp' ? g.group.until : g.L[id].pend.until; if (u < best) { best = u; tgt = id } } }
      else tgt = pend[0]
      b.slot = g.order.indexOf(tgt); b.phase = 'aim'; b.next = g.t + span(k.react)
      return
    }
    if (g.room.grp) {
      const right = !g.group.danger
      groupAnswer(g, r() < k.grp ? right : !right); b.next = g.t + 0.6; return
    }
    const rc = roomChoices(g)
    if (!rc) { back(g); b.next = g.t + 0.4; return }
    if (rc.wrong) {
      if (r() < k.notice) { back(g); b.next = g.t + 0.5; return }
      choose(g, Math.floor(r() * 3)); b.next = g.t + 0.6; return
    }
    const okI = rc.choices.findIndex(c => c.ok)
    let i = okI
    if (r() > k.acc) { const bad = rc.choices.map((c, j) => j).filter(j => !rc.choices[j].ok); if (bad.length) i = pick(r, bad) }
    choose(g, i); b.next = g.t + 0.6
  }

  function title(n) { let t = D.TITLES[0][1]; for (const [k, v] of D.TITLES) if (n >= k) t = v; return t }

  G.Core = { DT, rng, create, step, tapSlot, roomChoices, choose, back, groupAnswer, makeBot, botStep, title, needFor, AIM_WIN }
})(typeof window !== 'undefined' ? window : globalThis)
