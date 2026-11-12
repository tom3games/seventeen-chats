// 17股トーク の画面。中身（時間・判定）は core.js。ここは描くのと、押したのを渡すのと、音と演出
;(function () {
  window.__jsUp = true
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)]
  const store = { get(k) { try { return localStorage.getItem(k) } catch (e) { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch (e) {} } }
  let lang = store.get('sc_lang') || ((navigator.language || 'ja').startsWith('ja') ? 'ja' : 'en')
  const U = () => D.UI[lang], tx = o => (o ? (o[lang] ?? o.ja) : '')
  const URLP = 'https://tom3games.com/play/seventeen-chats/'
  const V = 'v=1'
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const P = id => D.L[id]
  const face = id => `img/t_${id}.webp?${V}`, photo = id => `img/p_${id}.webp?${V}`

  // ---- 音（全部録音素材。出所は CREDITS.md）
  try { Snd.muted = store.get('sc_mute') === '1' } catch (e) {}
  Snd.def({
    notif: ['snd/notif1.mp3', 'snd/notif2.mp3', 'snd/notif3.mp3'], pop: ['snd/pop1.mp3', 'snd/pop2.mp3'], tap: 'snd/tap.mp3', stamp: 'snd/stamp.mp3',
    crack: ['snd/crack1.mp3'], shatter: ['snd/crack2.mp3'], buzz: ['snd/buzz1.mp3', 'snd/buzz2.mp3'], reply: 'snd/reply.mp3', meow: 'snd/meow.mp3',
    win: 'snd/win.mp3', win2: 'snd/win2.mp3', lose: 'snd/lose.mp3',
  })
  const CUE = {
    notif: [['notif', { vol: 0.5 }]], nudge: [['notif', { vol: 0.35, rate: 1.15 }]], tap: [['tap', { vol: 0.45, jitter: 0 }]], send: [['pop', { vol: 0.6 }]],
    good: [['pop', { vol: 0.35, rate: 1.25, delay: 0.55 }]], bad: [['buzz', { vol: 0.5 }]], heal: [['pop', { vol: 0.4, rate: 1.5 }]],
    miss: [['crack', { vol: 0.9 }], ['buzz', { vol: 0.6, delay: 0.05 }], ['stamp', { vol: 0.8, delay: 0.12 }]], over: [['shatter', { vol: 1 }], ['lose', { vol: 0.7, delay: 0.5 }]],
    join: [['reply', { vol: 0.55 }]], meow: [['meow', { vol: 0.7, delay: 0.3 }]], dodge: [['stamp', { vol: 0.9 }], ['win', { vol: 0.5, delay: 0.15 }]], joined: [['pop', { vol: 0.5 }]],
    end: [['win2', { vol: 0.7 }]],
  }
  window.__sfxCalls = {}
  const Sfx = n => { window.__sfxCalls[n] = (window.__sfxCalls[n] || 0) + 1; for (const [k, o] of CUE[n] || []) Snd.play(k, o) }
  const bed = on => { if (on) { Snd.loop('amb', 'snd/amb.mp3', 0.16); Snd.loop('bgm', 'snd/bgm.mp3', 0.15) } else { Snd.loop('bgm', null); Snd.loop('amb', 'snd/amb.mp3', 0.1) } }
  const muteIcon = () => { $('#icoWave').style.display = Snd.muted ? 'none' : '' }

  // ---- 言葉の部品
  const norm = tok => (Array.isArray(tok) && typeof tok[0] === 'string' && tok[0][0] === '@' ? tok[0] : tok)
  function tokText(tok) {
    tok = norm(tok)
    if (Array.isArray(tok)) return lang === 'ja' ? tok[0] : tok[1]
    if (tok.startsWith('st:')) return lang === 'ja' ? 'スタンプ' : 'Sticker'
    if (tok === '@ph' || tok.startsWith('@pic')) return lang === 'ja' ? '写真' : 'Photo'
    if (tok.startsWith('@v')) return lang === 'ja' ? 'ボイスメッセージ' : 'Voice message'
    return ''
  }
  function tokBody(tok, id) {
    tok = norm(tok)
    if (Array.isArray(tok)) return `<div class="bb">${esc(lang === 'ja' ? tok[0] : tok[1])}</div>`
    if (tok.startsWith('st:')) return `<div class="st"><svg viewBox="0 0 100 100">${STAMPS[tok.slice(3)] || ''}</svg></div>`
    if (tok === '@ph') return `<div class="ph"><img src="${photo(id)}" alt=""></div>`
    if (tok.startsWith('@pic:')) return `<div class="pic"><svg viewBox="0 0 100 100">${STAMPS[tok.slice(5)] || ''}</svg></div>`
    if (tok.startsWith('@v')) return `<div class="bb vc"><svg viewBox="0 0 20 20" class="play"><path d="M5 3l12 7-12 7z"/></svg><span class="wave">${'<i></i>'.repeat(12)}</span><b>${esc(tok.slice(2))}</b></div>`
    return ''
  }
  function chipHTML(tok) {
    tok = norm(tok)
    if (typeof tok === 'string' && tok.startsWith('st:')) return `<svg viewBox="0 0 100 100" aria-hidden="true">${STAMPS[tok.slice(3)] || ''}</svg><span>${esc(lang === 'ja' ? 'スタンプ' : 'Sticker')}</span>`
    return esc(tokText(tok))
  }
  const clock = t => { const m = 21 * 60 + Math.floor(t / 2); return `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, '0')}` }

  // ---- 状態
  let g = null, bot = null, playing = false, paused = false, ui = { room: null, closeAt: 0, lockUntil: 0, res: null }, evI = 0, seedNext = null
  let tutOn = store.get('sc_tut') !== '1', tut = { step: 0 }, best = Number(store.get('sc_best') || 0)
  function show(id) { for (const v of $$('main.view')) v.hidden = v.id !== id; $('#corner').hidden = false }

  // ---- 固定60Hz の進め方（中身は0.05秒刻み）
  let acc = 0, lastT = 0
  function frame(now) {
    requestAnimationFrame(frame)
    const dt = Math.min(0.25, (now - (lastT || now)) / 1000); lastT = now
    if (!playing || !g) return
    if (!paused && !document.hidden) {
      acc += dt
      while (acc >= Core.DT) { acc -= Core.DT; tick() }
    }
    render()
  }
  function tick() {
    if (g.over) return
    Core.step(g, Core.DT)
    if (bot) Core.botStep(g, bot)
    if (ui.room && !g.room && !ui.closeAt) closeRoomUI()   // 時間切れ・招待が消えた
    if (bot && g.room && !ui.room) openRoomUI()
    if (bot && !g.room && ui.room && !ui.closeAt) closeRoomUI()
    if (ui.closeAt && g.t >= ui.closeAt) { ui.closeAt = 0; closeRoomUI() }
    handleEvents()
  }

  // ---- 始める
  function start() {
    Snd.init(); bed(true)
    const seed = seedNext ?? (Math.floor(Math.random() * 1e9) + 1); seedNext = null
    g = Core.create(seed); evI = 0; acc = 0
    ui = { room: null, closeAt: 0, lockUntil: 0, res: null }
    rows.length = 0; $('#list').innerHTML = ''
    $('#crack').setAttribute('class', ''); $('#hanko').className = ''; $('#room').classList.remove('on')
    tut = { step: tutOn ? 1 : 0 }
    show('vPlay'); playing = true; paused = false
    setTexts(); render()
    window.TM && TM.start()
  }

  // ---- 一覧
  const rows = []
  function rowEl(i) {
    if (rows[i]) return rows[i]
    const b = document.createElement('button')
    b.className = 'row'; b.dataset.slot = i
    b.innerHTML = '<span class="ring"></span><span class="mid"><b></b><span></span></span><span class="side"><small></small><span class="badge"></span></span>'
    b.addEventListener('click', () => tapRow(i))
    $('#list').appendChild(b); rows[i] = b; b._k = ''
    return b
  }
  function lastShown(lv) { for (let i = lv.log.length - 1; i >= 0; i--) { const e = lv.log[i]; if (e.at <= g.t && e.w !== 's') return e } return null }
  function renderList() {
    const list = $('#list'), n = g.order.length, H = list.clientHeight || 500
    const rh = Math.max(16, Math.min(66, Math.floor(H / Math.max(n, 7))))
    if (list._rh !== rh) { list._rh = rh; list.style.setProperty('--rh', rh + 'px'); list.classList.toggle('tight', rh < 52) }
    for (let i = 0; i < Math.max(n, rows.length); i++) {
      const id = g.order[i], el = rowEl(i)
      if (!id) { el.hidden = true; continue }
      el.hidden = false; el.style.top = i * rh + 'px'
      if (id === 'grp') {
        const gr = g.group, lov = gr.mem.filter(m => m.id).slice(0, 2)
        const k = 'grp' + gr.n + lang
        if (el._k !== k) {
          el._k = k; el.className = 'row grp pend'; el._id = 'grp'
          el.querySelector('.ring').innerHTML = lov.map(m => `<img class="gface" src="${face(m.id)}" alt="">`).join('')
          el.querySelector('.mid b').textContent = U().inviteRow
          el.querySelector('.mid span').textContent = tx(gr.name)
          el.querySelector('.side small').textContent = clock(gr.t0)
          el.querySelector('.badge').textContent = '1'
        }
        const f = Math.max(0, (gr.until - g.t) / (gr.until - gr.t0))
        el.querySelector('.ring').style.background = `conic-gradient(${f < 0.3 ? '#d23a2a' : '#e08a3c'} ${f * 360}deg,transparent 0)`
        continue
      }
      const lv = g.L[id], last = lastShown(lv), ign = lv.log.length && lv.log.some(e => e.w === 's' && e.at > g.t - 2.2 && e.at <= g.t)
      const k = [id, lv.unread, last ? lv.log.indexOf(last) : -1, !!lv.pend, ign, lang].join('|')
      if (el._k !== k) {
        const fresh = el._id !== id
        el._k = k; el._id = id
        el.className = 'row' + (lv.pend ? ' pend' : '') + (tut.step === 1 && i === 0 && lv.pend ? ' tut' : '')
        const ring = el.querySelector('.ring')
        if (fresh || !ring.firstChild || ring.firstChild.className) { ring.innerHTML = `<img src="${face(id)}" alt="">`; ring.style.background = '' }
        el.querySelector('.mid b').innerHTML = `${esc(tx(P(id).name))}<small>${esc(tx(P(id).tag))}</small>`
        el.querySelector('.mid span').textContent = last ? (last.w === 'y' ? (lang === 'ja' ? 'あなた: ' : 'You: ') : '') + tokText(last.x) : U().newFriend
        el.querySelector('.side small').textContent = last ? clock(last.at) : ''
        el.querySelector('.badge').textContent = lv.unread ? String(lv.unread) : ''
        const old = el.querySelector('.ign'); if (old) old.remove()
        if (ign) el.insertAdjacentHTML('beforeend', `<span class="ign">${esc(U().ignored)}</span>`)
      }
      const p = lv.pend, f = p && p.pat !== Infinity ? Math.max(0, (p.until - g.t) / p.pat) : 0
      el.style.setProperty('--p', f.toFixed(3)); el.classList.toggle('urgent', !!p && f < 0.3)
    }
    $('#score').textContent = U().mata(g.peak)
    const bars = 3 - g.bad
    for (const sel of ['#bars', '#bars2']) $$(sel + ' i').forEach((b, j) => b.classList.toggle('off', j >= bars))
    $('#clk').textContent = $('#clk2').textContent = clock(g.t)
  }
  function tapRow(i) {
    if (!playing || !g || g.over || ui.room || g.t < ui.lockUntil) return
    Snd.init()
    const r = Core.tapSlot(g, i)
    if (!r) return
    Sfx('tap')
    if (tut.step === 1) { tut.step = 2; hideTip(); hideHand() }
    openRoomUI()
  }

  // ---- 開いた部屋
  function openRoomUI() {
    const rm = g.room
    ui.room = rm.grp ? { grp: true } : { id: rm.id }
    ui.res = null; ui.closeAt = 0
    const R = $('#room'); R.classList.add('on'); $('#toast').classList.remove('on')
    $('#rLog').innerHTML = ''; $('#rLog')._k = ''; $('#chips')._k = ''; $('#chips').classList.remove('busy')
    const grp = !!rm.grp
    $('#rLog').hidden = $('#chips').hidden = grp; $('#inv').hidden = $('#invBtns').hidden = !grp
    if (grp) {
      const gr = g.group, u = U()
      $('#rAv').src = face(gr.from); $('#rName').textContent = tx(gr.name); $('#rTag').textContent = u.members + ' ' + (gr.mem.length + 1)
      $('#invName').textContent = tx(gr.name); $('#invBy').textContent = u.invite(tx(P(gr.from).name), tx(gr.name))
      $('#invMem').innerHTML = gr.mem.map(m => m.id ? `<div class="mem"><img src="${face(m.id)}" alt=""><span>${esc(tx(P(m.id).name))}</span></div>` : `<div class="mem"><i>${esc(D.STRANGER[lang][m.s].slice(0, 1))}</i><span>${esc(D.STRANGER[lang][m.s])}</span></div>`).join('') + `<div class="mem me"><i>${esc(u.you)}</i><span>${esc(u.you)}</span></div>`
      $('#bJoin').textContent = u.join; $('#bDecline').textContent = u.decline
      if (tut.group === 1) { tut.group = 2; tip(U().tutGroup, true) }
    } else {
      const id = rm.id
      $('#rAv').src = face(id); $('#rName').textContent = tx(P(id).name); $('#rTag').textContent = tx(P(id).tag)
    }
    renderRoom()
  }
  function closeRoomUI() {
    ui.room = null; ui.closeAt = 0
    $('#room').classList.remove('on'); hideHand()
    if (g && g.room && !bot) Core.back(g)
  }
  function renderRoom() {
    if (!ui.room) return
    if (ui.room.grp) {
      const gr = g.group
      const f = gr ? Math.max(0, (gr.until - g.t) / (gr.until - gr.t0)) : 0
      $('#rTimer i').style.transform = `scaleX(${f})`; $('#rTimer').classList.toggle('urgent', f < 0.3)
      return
    }
    const id = ui.room.id, lv = g.L[id], log = $('#rLog')
    const vis = lv.log.filter(e => e.at <= g.t).slice(-9)
    const k = id + vis.length + '|' + lv.log.filter(e => e.at <= g.t).length + lang + vis.map(e => e.pend ? 1 : 0).join('')
    if (log._k !== k) {
      const grow = log._k && log._k.startsWith(id)
      log._k = k
      let h = '', sep = false, prev = null
      vis.forEach((e, j) => {
        if (e.pend && !sep) { sep = true; h += `<div class="sys unr">${esc(U().unreadSep)}</div>` }
        const isNew = grow && j === vis.length - 1
        if (e.w === 's') { h += `<div class="sys ign${isNew ? ' in' : ''}">${esc(U().ignored)}</div>`; prev = null; return }
        const av = e.w === 'p' ? `<img class="av" src="${face(id)}" alt=""${prev === 'p' ? ' style="visibility:hidden"' : ''}>` : ''
        const meta = `<div class="meta">${e.w === 'y' ? `<span>${U().read}</span>` : ''}<span>${clock(e.at)}</span></div>`
        h += `<div class="m ${e.w}${isNew ? ' in' : ''}">${av}${tokBody(e.x, id)}${meta}</div>`
        prev = e.w
      })
      log.innerHTML = h
    }
    const p = lv.pend, f = p && p.pat !== Infinity ? Math.max(0, (p.until - g.t) / p.pat) : (p ? 1 : 0)
    $('#rTimer i').style.transform = `scaleX(${f})`; $('#rTimer').classList.toggle('urgent', !!p && f < 0.3)
    const chips = $('#chips')
    if (ui.closeAt) { chips.classList.add('busy'); return }
    const rc = g.room ? Core.roomChoices(g) : null
    const ck = rc ? rc.target + ':' + g.L[rc.target].pend.n + lang : 'none' + lang
    if (chips._k !== ck) {
      chips._k = ck
      chips.innerHTML = rc ? rc.choices.map((c, i) => `<button class="chip" data-i="${i}">${chipHTML(c.tok)}</button>`).join('') : `<span class="none">${lang === 'ja' ? '……' : '...'}</span>`
      if (tut.step === 2 && rc && !rc.wrong) {
        const okI = rc.choices.findIndex(c => c.ok), el = chips.children[okI]
        el.classList.add('tut'); tip(U().tutPick, true); setTimeout(() => { if (ui.room && !ui.closeAt) pointAt(el) }, 220)
      }
    }
  }
  function choose(i) {
    if (!g || !g.room || ui.closeAt || g.over) return
    const res = Core.choose(g, i)
    if (!res) return
    ui.res = res; hideHand(); hideTip()
    Sfx('send')
    if (res.id === 'cat' && res.kind === 'good') Sfx('meow')
    ui.closeAt = g.t + (res.kind === 'gob' ? 1.5 : res.kind === 'pillow' ? 1.1 : 0.75)
    ui.lockUntil = ui.closeAt + 0.05
    if (tut.step === 2) tut.step = 3
    renderRoom()
  }

  // ---- 出来事 → 音と演出
  function handleEvents() {
    while (evI < g.ev.length) {
      const e = g.ev[evI++], u = U()
      if (e.type === 'msg' || e.type === 'nudge') {
        Sfx(e.type === 'msg' ? 'notif' : 'nudge')
        if (ui.room && ui.room.id !== e.id) banner(e.id)
        if (tut.step === 1 && e.type === 'msg' && !tut.shown) { tut.shown = true; setTimeout(() => { if (tut.step === 1 && !ui.room && rows[0]) { tip(u.tutRow); pointAt(rows[0], 0.35) } }, 60) }
      } else if (e.type === 'reorder') {
        const l = $('#list'); l.classList.remove('jolt'); void l.offsetWidth; l.classList.add('jolt')
        const r0 = rows[0]; if (r0) { r0.classList.remove('hot'); void r0.offsetWidth; r0.classList.add('hot') }
      } else if (e.type === 'open') {
        if (tut.step === 1) { tut.step = 2; hideTip(); hideHand() }
      } else if (e.type === 'good') Sfx('good')
      else if (e.type === 'bad') { Sfx('bad'); flashBars('drop') }
      else if (e.type === 'heal') { Sfx('heal'); flashBars('heal') }
      else if (e.type === 'miss') onMiss(e)
      else if (e.type === 'join') {
        if (g.peak > 1) {
          Sfx('join')
          if (ui.room) bannerText(u.added(tx(P(e.id).name)), tx(P(e.id).join), face(e.id))
          else toast(photo(e.id), u.added(tx(P(e.id).name)), tx(P(e.id).join))
          const s = $('#score'); s.classList.remove('up'); void s.offsetWidth; s.classList.add('up')
          if (tut.step && !tut.name) { tut.name = 1; setTimeout(() => { if (!playing || g.over) return; tip(u.tutName); setTimeout(() => { if (playing && !g.over) tip(u.tutClock) }, tipMs(u.tutName) + 300) }, 2500) }
        }
      } else if (e.type === 'group') { Sfx('notif'); if (tut.step && !tut.group) tut.group = 1; if (ui.room) bannerText(U().inviteRow, tx(g.group.name), face(g.group.from)) }
      else if (e.type === 'dodge') { Sfx('dodge'); toast(null, u.dodged, '+3') }
      else if (e.type === 'joined') { Sfx('joined'); toast(null, u.joined, '+1') }
      else if (e.type === 'over') onOver(e)
    }
  }
  function flashBars(c) { for (const sel of ['#bars', '#bars2']) { const b = $(sel); b.classList.remove('drop', 'heal'); void b.offsetWidth; b.classList.add(c) } }
  function onMiss(e) {
    const u = U()
    Sfx('miss')
    try { navigator.vibrate && navigator.vibrate(140) } catch (er) {}
    $('#crack').setAttribute('class', 'l' + Math.min(2, g.miss))
    const ph = $('#phone'); ph.classList.remove('shake'); void ph.offsetWidth; ph.classList.add('shake')
    const rf = $('#redflash'); rf.classList.remove('on'); void rf.offsetWidth; rf.classList.add('on')
    if (g.over) return
    const word = e.kind === 'ign' ? u.ignored : e.kind === 'mood' ? u.mood : u.shura
    const sub = e.kind === 'gob' ? u.gobaku : e.kind === 'grp' ? tx(P(e.id).name) + ' / ' + tx(P(e.b).name) : tx(P(e.id).name)
    hanko(word, sub, false)
  }
  function hanko(word, sub, stay) {
    const h = $('#hanko'); h.className = ''; h.innerHTML = `${esc(word)}${sub ? `<small>${esc(sub)}</small>` : ''}`; void h.offsetWidth; h.className = stay ? 'stay' : 'on'
  }
  function onOver(e) {
    const u = U()
    Sfx('over'); bed(false); hideTip(); hideHand()
    hanko(u.over, u.overSub, true)
    const myT = g
    setTimeout(() => { if (g === myT) showEnd() }, 2300)
  }
  let toastT = 0, bannerT = 0, tipT = 0
  function toast(img, b, s) {
    const t = $('#toast'); t.classList.toggle('noimg', !img); if (img) t.querySelector('img').src = img
    t.querySelector('b').textContent = b; t.querySelector('span').textContent = s
    t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2400)
  }
  function banner(id) {
    const lv = g.L[id], last = lastShown(lv) || lv.log[lv.log.length - 1]
    bannerText(tx(P(id).name), last ? tokText(last.x) : '', face(id))
  }
  function bannerText(b, s, img) {
    const n = $('#banner'); n.querySelector('img').src = img; n.querySelector('b').textContent = b; n.querySelector('span').textContent = s
    n.classList.add('on'); clearTimeout(bannerT); bannerT = setTimeout(() => n.classList.remove('on'), 1700)
  }
  const tipMs = s => Math.max(1800, 900 + 90 * s.length) * (lang === 'en' ? 0.6 : 1)
  function tip(s, up) {
    const t = $('#tip'); t.textContent = s; t.hidden = false; t.classList.toggle('up', !!up)
    clearTimeout(tipT); tipT = setTimeout(hideTip, tipMs(s) + 1200)
  }
  function hideTip() { $('#tip').hidden = true; if (tut.step === 1) { const r = rows[0]; if (r) r.classList.remove('tut') } }
  function pointAt(el, fx) {
    const h = $('#hand'), r = el.getBoundingClientRect(), pr = $('#phone').getBoundingClientRect()
    h.style.left = (r.left - pr.left + r.width * (fx || 0.62)) + 'px'; h.style.top = (r.top - pr.top + r.height * 0.45) + 'px'; h.hidden = false
    setTimeout(hideHand, 6500)
  }
  function hideHand() { $('#hand').hidden = true }

  function render() {
    if (!g) return
    renderList(); renderRoom()
    if (tut.step === 1 && ui.room) tut.step = 2
  }

  // ---- 結果
  function causeText() {
    const c = g.cause, L = U().lastCause
    if (!c) return ''
    if (c.kind === 'ign') return L.ign(tx(P(c.id).name))
    if (c.kind === 'gob') return L.gob(tx(P(c.id).name), tokText(c.tok))
    if (c.kind === 'mood') return L.mood(tx(P(c.id).name))
    if (c.kind === 'grp') return L.grp(tx(P(c.id).name), tx(P(c.b).name))
    return ''
  }
  function lastLines() {
    return Object.keys(g.L).map(id => {
      const lv = g.L[id]; let e = null
      for (let i = lv.log.length - 1; i >= 0; i--) if (lv.log[i].w === 'p') { e = lv.log[i]; break }
      return { id, tok: e ? norm(e.x) : null, text: e ? tokText(e.x) : '' }
    }).reverse()
  }
  function showEnd() {
    playing = false
    const u = U(), n = g.peak, isBest = n > best
    if (isBest) { best = n; store.set('sc_best', String(n)) }
    if (tutOn) { tutOn = false; store.set('sc_tut', '1') }
    show('vEnd'); Sfx('end')
    $('#eSpan').textContent = `21:00 - ${clock(g.overAt)}`; $('#clk3').textContent = clock(g.overAt)
    $('#eStamp').textContent = u.titleOf(n); $('#eTitle').textContent = tx(Core.title(n))
    $('#eCause').textContent = causeText(); $('#eBest').textContent = isBest && n > 1 ? u.newBest : u.best(best)
    $('#eTop').textContent = u.endTop
    const L = lastLines(), box = $('#eList')
    box.innerHTML = endRows(L)
    fitEndList(L.length)
    setTexts()
    window.TM && TM.end(n, n >= 10)
    window.__sc.lastEnd = { peak: n, cause: g.cause && g.cause.kind, t: g.overAt, replies: g.replies }
    drawCard()
  }
  const isSt = t => typeof t === 'string' && (t.startsWith('st:') || t.startsWith('@pic:'))
  const stName = t => t.startsWith('st:') ? t.slice(3) : t.slice(5)
  function endRows(L) {
    return L.map(l => `<div class="er"><img src="${face(l.id)}" alt=""><div><b>${esc(tx(P(l.id).name))}</b><span>${l.tok && isSt(l.tok) ? `<svg viewBox="0 0 100 100">${STAMPS[stName(l.tok)] || ''}</svg>` : esc(l.text)}</span></div></div>`).join('')
  }
  function fitEndList(n) {
    const box = $('#eList'), H = box.clientHeight
    let cols = 1, rh = Math.min(52, Math.floor((H + 3) / Math.max(n, 1)) - 3)
    const fits = (c, h) => Math.ceil(n / c) * (h + 3) <= H
    if (rh < 36) { cols = 2; rh = 36; if (!fits(2, 36)) rh = Math.max(24, Math.floor(H / Math.ceil(n / 2)) - 3) }
    box.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`; box.style.setProperty('--er', rh + 'px')
    const per = Math.max(1, Math.floor((H + 3) / (rh + 3)) * cols)
    $$('#eList .er').forEach((el, i) => { el.hidden = i >= per; el.classList.toggle('small', rh < 32) })
    $('#eMore').textContent = n > per ? (lang === 'ja' ? `ほか${n - per}人` : `+${n - per} more`) : ''
  }
  const loadImg = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src })
  async function drawCard() {
    const c = $('#card'), x = c.getContext('2d'), u = U(), W = 1080, H = 1350, n = g.peak
    const POP = '"RocknRoll One", "Hiragino Sans", sans-serif', HAND = '"Yusei Magic", "Hiragino Maru Gothic ProN", sans-serif', SANS = '"Hiragino Sans", "Noto Sans JP", sans-serif'
    try { await document.fonts.load(`40px ${POP}`); await document.fonts.load(`40px ${HAND}`) } catch (e) {}
    const L = lastLines(), imgs = await Promise.all(L.map(l => loadImg(face(l.id))))
    const sts = await Promise.all(L.map(l => l.tok && isSt(l.tok) ? loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">${STAMPS[stName(l.tok)] || ''}</svg>`)) : null))
    x.fillStyle = '#2a1d14'; x.fillRect(0, 0, W, H)
    x.fillStyle = '#c8552e'; x.fillRect(0, 0, W, 110)
    x.fillStyle = '#fff'; x.font = `44px ${POP}`; x.textBaseline = 'middle'; x.textAlign = 'left'; x.fillText(u.app, 44, 58)
    x.textAlign = 'right'; x.font = `600 34px ${SANS}`; x.fillText(`21:00 - ${clock(g.overAt)}`, W - 44, 58)
    x.save(); x.translate(W / 2, 230); x.rotate(-0.07)
    x.font = `120px ${POP}`; const tw = Math.min(980, x.measureText(u.titleOf(n)).width + 80)
    x.strokeStyle = '#ff6a4a'; x.lineWidth = 12; x.strokeRect(-tw / 2, -90, tw, 180)
    x.fillStyle = '#ff6a4a'; x.textAlign = 'center'; x.fillText(u.titleOf(n), 0, 6, 940); x.restore()
    x.textAlign = 'center'; x.fillStyle = '#ffd36b'; x.font = `56px ${POP}`; x.fillText(tx(Core.title(n)), W / 2, 380, 1000)
    x.fillStyle = '#fff3dc'; x.font = `42px ${HAND}`; x.fillText(causeText(), W / 2, 450, 1000)
    x.fillStyle = '#c9b597'; x.font = `600 30px ${SANS}`; x.textAlign = 'left'; x.fillText(u.endTop, 50, 520)
    const cols = L.length > 8 ? 2 : 1, rh = cols === 1 ? Math.min(104, Math.floor(690 / L.length) - 8) : 78, cw = cols === 1 ? 980 : 484, top = 556
    L.forEach((l, i) => {
      const col = cols === 1 ? 0 : Math.floor(i / 9), row = cols === 1 ? i : i % 9
      const px = 50 + col * (cw + 12), py = top + row * (rh + 8)
      x.fillStyle = 'rgba(255,250,240,.94)'; rr(x, px, py, cw, rh, 18); x.fill()
      const im = imgs[i], r = rh / 2 - 8, cx = px + 10 + r, cy = py + rh / 2
      x.save(); x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip()
      if (im) { const s = Math.max(2 * r / im.width, 2 * r / im.height); x.drawImage(im, cx - im.width * s / 2, cy - r * 1.15, im.width * s, im.height * s) } else { x.fillStyle = '#d9cdb9'; x.fill() }
      x.restore()
      const tx0 = cx + r + 16, maxW = px + cw - tx0 - 16
      x.textAlign = 'left'; x.fillStyle = '#7a6550'; x.font = `600 ${cols === 1 ? 24 : 22}px ${SANS}`; x.fillText(fit(x, tx(P(l.id).name), maxW), tx0, cy - 18)
      if (sts[i]) { const s2 = rh * 0.5; x.drawImage(sts[i], tx0, cy - 2, s2, s2 * 0.9) }
      else { x.fillStyle = '#2a1d14'; x.font = `${cols === 1 ? 34 : 30}px ${SANS}`; x.fillText(fit(x, l.text, maxW), tx0, cy + 16) }
    })
    x.fillStyle = '#fff3dc'; x.font = `44px ${POP}`; x.textAlign = 'left'; x.fillText(u.title, 50, H - 56)
    x.fillStyle = '#c9b597'; x.font = `600 28px ${SANS}`; x.textAlign = 'right'; x.fillText('tom3games.com', W - 50, H - 56)
    window.__sc.cardDrawn = true
  }
  function rr(x, a, b, w, h, r) { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath() }
  function fit(x, s, w) { if (x.measureText(s).width <= w) return s; while (s.length > 1 && x.measureText(s + '…').width > w) s = s.slice(0, -1); return s + '…' }

  // ---- タイトル
  function titleStack() {
    const ids = ['futsuu', 'cat', 'robot', 'granny', 'protein'], u = U()
    const box = $('#stack')
    const H = box.clientHeight || 260, fitN = Math.max(1, Math.min(ids.length, Math.floor((H - 34) / 62)))
    box.innerHTML = ids.slice(0, fitN).map((id, i) => {
      const m = P(id).msgs[0]
      return `<div class="ntf" style="animation-delay:${0.15 + i * 0.35}s"><img src="${face(id)}" alt=""><div><b>${esc(tx(P(id).name))}<small>${u.app}</small></b><span>${esc(tokText(m[0][0] === '@' ? m[0] : [m[0], m[1]]))}</span></div></div>`
    }).join('') + `<div class="ntf more" style="animation-delay:${0.15 + fitN * 0.35}s">${lang === 'ja' ? `ほか${17 - fitN}人から未読` : `${17 - fitN} more unread`}</div>`
  }
  function setTexts() {
    const u = U()
    document.documentElement.lang = lang
    $('#tTitle').innerHTML = lang === 'ja' ? '<b>17</b>股トーク' : '<b>17</b> Chats'
    $('#tSub').textContent = u.sub; $('#bStart').textContent = u.start; $('#bHow').textContent = u.how
    $('#tBest').textContent = best ? u.best(best) : ''
    $('#lkDate').textContent = lang === 'ja' ? '金曜日 21:00' : 'Friday 9:00 PM'
    $('#hTalk').textContent = u.talk
    $('#bSave').textContent = u.save; $('#bPost').textContent = u.post; $('#bAgain').textContent = u.again; $('#bTitle').textContent = u.toTitle
    $('#bOrig').innerHTML = `${esc(u.toOrig)} <b>${esc(u.orig)}</b>`
    $('#bLang').textContent = lang === 'ja' ? 'EN' : 'JA'
    $('#howH').textContent = u.howH; $('#howClose').textContent = u.back
    $('#howBody').innerHTML = u.howBody.map(s => `<p>${esc(s)}</p>`).join('') + `<p><b>${esc(u.howGroup)}</b></p><p>${esc(u.howBars)}</p><small>${esc(u.credits)}</small>`
    $('#loadTxt').textContent = u.load
    if (!$('#vTitle').hidden) titleStack()
    for (const r of rows) r._k = ''
    if ($('#rLog')) { $('#rLog')._k = ''; $('#chips')._k = '' }
  }

  // ---- 押す
  const on = (s, f) => $(s).addEventListener('click', f)
  on('#bStart', start)
  on('#bHow', () => { Snd.init(); $('#how').hidden = false })
  on('#howClose', () => { $('#how').hidden = true })
  on('#rBack', () => { if (ui.closeAt) return; closeRoomUI() })
  $('#chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) choose(Number(b.dataset.i)) })
  on('#bJoin', () => groupAns(true)); on('#bDecline', () => groupAns(false))
  function groupAns(join) {
    if (!g || !g.room || !g.room.grp || ui.closeAt) return
    Sfx('tap'); Core.groupAnswer(g, join); hideTip()
    ui.closeAt = g.t + 0.35; ui.lockUntil = ui.closeAt + 0.05
  }
  on('#bAgain', () => { start() })
  on('#bTitle', () => { show('vTitle'); setTexts(); titleStack() })
  on('#bLang', () => { lang = lang === 'ja' ? 'en' : 'ja'; store.set('sc_lang', lang); setTexts(); if (!$('#vEnd').hidden && g) showEndTexts() })
  function showEndTexts() { const L = lastLines(); $('#eList').innerHTML = endRows(L); fitEndList(L.length); const u = U(); $('#eStamp').textContent = u.titleOf(g.peak); $('#eTitle').textContent = tx(Core.title(g.peak)); $('#eCause').textContent = causeText(); $('#eBest').textContent = u.best(best); $('#eTop').textContent = u.endTop; drawCard() }
  on('#bMute', () => { Snd.init(); Snd.setMute(!Snd.muted); store.set('sc_mute', Snd.muted ? '1' : '0'); muteIcon() })
  on('#bSave', () => { window.TM && TM.share('save'); $('#card').toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'seventeen-chats.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000) }) })
  on('#bPost', () => {
    window.TM && TM.share('x'); const u = U()
    open('https://x.com/intent/post?text=' + encodeURIComponent(u.postText(g.peak, tx(Core.title(g.peak)))) + '&url=' + encodeURIComponent(URLP), '_blank')
  })
  document.addEventListener('click', e => { if (e.target && e.target.closest && e.target.closest('#tmSupport')) window.TM && TM.support() })
  document.addEventListener('visibilitychange', () => { lastT = 0 })

  // ---- 読み込み（顔17枚と壁紙だけ待つ。写真は裏で）
  async function boot() {
    setTexts(); muteIcon()
    const list = D.IDS.map(face).concat(['img/room.webp?v=1'])
    let done = 0
    const bar = $('#loadBar i'), ldN = $('#ldN')
    const one = src => loadImg(src).then(() => { done++; bar.style.width = (done / list.length * 100) + '%'; ldN.textContent = String(Math.max(0, 17 - Math.round(done / list.length * 17))) || '' })
    await Promise.race([Promise.all(list.map(one)), new Promise(r => setTimeout(r, 12000))])
    ldN.style.visibility = 'hidden'
    const L = $('#loading'); L.style.opacity = '0'; setTimeout(() => { L.hidden = true }, 360)
    show('vTitle'); titleStack()
    requestAnimationFrame(frame)
    window.__scReady = true
    setTimeout(() => D.IDS.forEach(id => loadImg(photo(id))), 400)
  }

  // ---- 検証用の窓口
  window.__sc = {
    get g() { return g }, Core, seed(s) { seedNext = s }, start,
    pause(v) { paused = v !== false }, step(n) { for (let i = 0; i < (n || 1); i++) tick(); render() },
    setBot(kind, s) { bot = kind ? Core.makeBot(kind, s || 1) : null },
    noTut() { tutOn = false; tut.step = 0 }, ui: () => ui, rows: () => rows,
    rowXY(slot) { const r = rows[slot].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } },
    chipXY(i) { const c = $('#chips').children[i]; if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } },
    lastEnd: null, cardDrawn: false, showEnd: () => showEnd(),
  }
  boot()
})()
