import './mute-auto.mjs'
import { MUTE_LAUNCH, muteContext } from './mute.mjs'
// 17股トーク の検証。node verify.mjs（全部通ったら 0 で終わる）
import { chromium, webkit } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
const ROOT = import.meta.dirname
mkdirSync(ROOT + '/shots', { recursive: true })
const PORT = Number(process.env.VPORT || 5732)
const server = spawn(process.execPath, ['server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT) } })
await new Promise(r => setTimeout(r, 400))
const URL0 = `http://localhost:${PORT}/`
let pass = 0, fail = 0
const results = []
async function t(name, fn) {
  try { const r = await fn(); if (r === false) throw new Error('false'); pass++; results.push(`ok   ${name}${r && r !== true ? '  ' + JSON.stringify(r) : ''}`) }
  catch (e) { fail++; results.push(`FAIL ${name}  ${e.message.split('\n')[0]}`) }
}
const expect = (c, msg) => { if (!c) throw new Error(typeof msg === 'string' ? msg : JSON.stringify(msg)) }
async function open(browser, opts = {}, q = '') {
  const ctx = await browser.newContext({ locale: 'ja-JP', viewport: { width: 390, height: 844 }, ...opts })
  await muteContext(ctx)
  await ctx.addInitScript(() => { try { localStorage.clear() } catch (e) {} })
  const p = await ctx.newPage(); p.errs = []
  p.on('pageerror', e => p.errs.push('pageerror ' + e.message))
  p.on('console', m => { if (m.type() === 'error') p.errs.push('console ' + m.text()) })
  p.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)|googletagmanager/.test(r.url())) p.errs.push('reqfail ' + r.url()) })
  await p.goto(URL0 + q); await p.waitForFunction(() => window.__scReady, null, { timeout: 15000 })
  return p
}
const overflow = p => p.evaluate(() => {
  const W = document.documentElement.clientWidth, bad = []
  for (const el of document.querySelectorAll('main:not([hidden]) *, #how:not([hidden]) *')) {
    if (el.closest('[hidden]') || (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true }))) continue
    if (el.closest('#card')) continue
    const r = el.getBoundingClientRect(); if (r.width && (r.right > W + 1 || r.left < -1)) bad.push((el.id || el.className || el.tagName) + ':' + Math.round(r.left) + '-' + Math.round(r.right))
  }
  return { sw: document.documentElement.scrollWidth, W, bad: bad.slice(0, 5) }
})
const fit = q => q.evaluate(() => {
  const H = innerHeight, de = document.documentElement, over = []
  if (de.scrollHeight > H + 1) over.push('page:' + de.scrollHeight)
  for (const el of document.querySelectorAll('main:not([hidden]) button, main:not([hidden]) a, #how:not([hidden]) button')) {
    if (!el.offsetParent || el.closest('[hidden]') || (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true }))) continue
    const r = el.getBoundingClientRect(); if (r.bottom > H + 1 || r.top < -1) over.push((el.id || el.className) + ':' + Math.round(r.top) + '-' + Math.round(r.bottom))
  }
  return { H, over: over.slice(0, 6) }
})
// ゲームを始めて時間を止める（時間は step で進める）
const begin = (p, seed, tut) => p.evaluate(([s, tut]) => { __sc.seed(s); if (!tut) __sc.noTut(); document.querySelector('#bStart').click(); if (!tut) __sc.noTut(); __sc.pause(true) }, [seed, !!tut])
const step = (p, n) => p.evaluate(n => __sc.step(n), n)
const state = p => p.evaluate(() => { const g = __sc.g; return { t: g.t, peak: g.peak, miss: g.miss, bad: g.bad, over: g.over, replies: g.replies, order: g.order.slice(), room: g.room, cause: g.cause, dodged: g.dodged, prog: g.prog } })
// 恋人を n 人まで増やす（全部正しく返す）
const grow = (p, n) => p.evaluate(n => {
  const g = __sc.g, C = __sc.Core
  for (let k = 0; k < 20000 && g.peak < n && !g.over; k++) {
    __sc.step(1)
    if (g.room) C.back(g)
    const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend)
    if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); if (rc && !rc.wrong) C.choose(g, rc.choices.findIndex(c => c.ok)); else C.back(g) }
    if (g.group) { const j = g.order.indexOf('grp'); C.tapSlot(g, j); C.groupAnswer(g, !g.group.danger) }
  }
  __sc.step(2)
  return g.peak
}, n)

const browser = await chromium.launch(MUTE_LAUNCH)
let p = await open(browser)
await t('起動時にエラーが出ない', async () => { expect(p.errs.length === 0, p.errs.join('|')) })
await t('ブラウザの拡大が起きない（viewport・ピンチ・Ctrl+ホイール・Ctrl+プラス）', async () => {
  const r = await p.evaluate(() => {
    const vp = document.querySelector('meta[name=viewport]').content
    const g = new Event('gesturestart', { cancelable: true }); document.dispatchEvent(g)
    const w = new WheelEvent('wheel', { ctrlKey: true, deltaY: -10, bubbles: true, cancelable: true }); window.dispatchEvent(w)
    const k = new KeyboardEvent('keydown', { key: '+', ctrlKey: true, bubbles: true, cancelable: true }); window.dispatchEvent(k)
    return { vp, gesture: g.defaultPrevented, wheel: w.defaultPrevented, key: k.defaultPrevented, ta: getComputedStyle(document.documentElement).touchAction, us: getComputedStyle(document.body).userSelect }
  })
  expect(/user-scalable=no/.test(r.vp) && r.gesture && r.wheel && r.key && r.ta === 'manipulation' && r.us === 'none', r)
})
await t('OGP 一式がある', async () => {
  const r = await p.evaluate(() => ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'].map(k => !!document.querySelector(`meta[property="${k}"]`)).concat(!!document.querySelector('meta[name="twitter:card"]')))
  expect(r.every(Boolean), r)
})
await t('作り方の言葉が画面に出ない（個人名は公開前に grep で別に見る）', async () => {
  const s = await p.evaluate(() => document.body.innerText + document.title + JSON.stringify(D.UI))
  expect(!/画像生成|\bAI\b/.test(s), 'found')
})

// ---- 本物の指で: 始める → 一覧を押す → 返事を押す
await t('本物のクリックで 開始→トークを開く→合う返事 で返信が数えられる', async () => {
  await p.evaluate(() => { __sc.seed(11) })
  await p.click('#bStart'); await p.evaluate(() => __sc.pause(true))
  await step(p, 40)
  const xy = await p.evaluate(() => __sc.rowXY(0))
  await p.mouse.click(xy.x, xy.y)
  await p.waitForTimeout(250)
  const s1 = await state(p); expect(s1.room && s1.room.id === 'futsuu', s1)
  const okI = await p.evaluate(() => __sc.Core.roomChoices(__sc.g).choices.findIndex(c => c.ok))
  const c = await p.evaluate(i => __sc.chipXY(i), okI)
  await p.mouse.click(c.x, c.y)
  const s2 = await state(p); expect(s2.replies === 1 && s2.bad === 0 && !s2.room, s2)
  await step(p, 20)
  const ui = await p.evaluate(() => ({ room: __sc.ui().room, on: document.querySelector('#room').classList.contains('on') }))
  expect(!ui.room && !ui.on, ui)
  return { replies: s2.replies }
})
await t('チュートリアル: 最初の通知で指と説明が出て、自動で消える', async () => {
  const q = await open(browser)
  await begin(q, 5, true); await step(q, 40); await q.waitForTimeout(200)
  const a = await q.evaluate(() => ({ tip: !document.querySelector('#tip').hidden && document.querySelector('#tip').textContent, hand: !document.querySelector('#hand').hidden }))
  expect(a.tip && a.hand, a)
  await q.waitForTimeout(4600)
  const b = await q.evaluate(() => document.querySelector('#tip').hidden)
  expect(b, 'tip still shown'); await q.close()
  return a.tip
})
await t('合わない返事: 不機嫌が1つ増え、電波が1本へる', async () => {
  const q = await open(browser)
  await begin(q, 21); await step(q, 40)
  const r = await q.evaluate(() => { const g = __sc.g, C = __sc.Core; C.tapSlot(g, 0); const rc = C.roomChoices(g); C.choose(g, rc.choices.findIndex(c => !c.ok)); __sc.step(2); return { bad: g.bad, off: document.querySelectorAll('#bars i.off').length } })
  expect(r.bad === 1 && r.off === 1, r); await q.close(); return r
})
await t('合わない返事3回で1ミス（不機嫌）', async () => {
  const q = await open(browser)
  await begin(q, 22)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core; let n = 0
    for (let k = 0; k < 20000 && n < 3; k++) { __sc.step(1); const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend); if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); C.choose(g, rc.choices.findIndex(c => !c.ok)); n++ } }
    __sc.step(2); return { miss: g.miss, cause: g.cause && g.cause.kind, bad: g.bad, crack: document.querySelector('#crack').getAttribute('class') }
  })
  expect(r.miss === 1 && r.cause === 'mood' && r.bad === 0 && r.crack === 'l1', r); await q.close(); return r
})

// ---- 何もしない通し
await t('何もしない通し: 既読無視2回で終わり、最低の結果（1股・一途）', async () => {
  const q = await open(browser)
  await begin(q, 31)
  const r = await q.evaluate(() => { const g = __sc.g; for (let k = 0; k < 4000 && !g.over; k++) __sc.step(1); return { over: g.over, peak: g.peak, miss: g.miss, cause: g.cause.kind, t: g.t } })
  expect(r.over && r.peak === 1 && r.miss === 2 && r.cause === 'ign', r)
  await q.evaluate(() => __sc.pause(false))
  await q.waitForFunction(() => !document.querySelector('#vEnd').hidden, null, { timeout: 6000 })
  const e = await q.evaluate(() => ({ stamp: document.querySelector('#eStamp').textContent, title: document.querySelector('#eTitle').textContent, cause: document.querySelector('#eCause').textContent }))
  expect(e.stamp === '1股達成' && /一途/.test(e.title) && /既読無視/.test(e.cause), e)
  await q.close(); return { ...r, ...e }
})
await t('何もしない通し: 同じ種なら同じ時刻で終わる', async () => {
  const a = [], q = await open(browser)
  for (let i = 0; i < 2; i++) {
    await begin(q, 31)
    a.push(await q.evaluate(() => { const g = __sc.g; for (let k = 0; k < 4000 && !g.over; k++) __sc.step(1); return g.t }))
    await q.evaluate(() => { __sc.pause(false) }); await q.waitForFunction(() => !document.querySelector('#vEnd').hidden, null, { timeout: 6000 })
  }
  expect(a[0] === a[1], a); await q.close(); return a
})
await t('同じ種・同じ bot なら同じ結果（画面の中で）', async () => {
  const q = await open(browser), res = []
  for (let i = 0; i < 2; i++) {
    await begin(q, 777)
    res.push(await q.evaluate(() => { __sc.setBot('human', 9); const g = __sc.g; for (let k = 0; k < 40000 && !g.over; k++) __sc.step(1); __sc.setBot(null); return JSON.stringify({ peak: g.peak, t: g.t, replies: g.replies, cause: g.cause, miss: g.miss, dodged: g.dodged }) }))
    await q.evaluate(() => { __sc.pause(false) }); await q.waitForFunction(() => !document.querySelector('#vEnd').hidden, null, { timeout: 6000 })
  }
  expect(res[0] === res[1], res); await q.close(); return JSON.parse(res[0])
})

// ---- 誤爆
await t('誤爆: 未読のない部屋で送るとミス・修羅場のハンコ。返事は頭の中の相手あて', async () => {
  const q = await open(browser)
  await begin(q, 41); await grow(q, 3)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core
    if (g.room) C.back(g)
    for (let k = 0; k < 4000; k++) { const ps = g.order.filter(id => id !== 'grp' && g.L[id].pend); const no = g.order.filter(id => id !== 'grp' && !g.L[id].pend && id !== 'pillow'); if (ps.length && no.length && !g.group) break; __sc.step(1) }
    const target = g.order.find(id => id !== 'grp' && g.L[id].pend), wrong = g.order.find(id => id !== 'grp' && !g.L[id].pend && id !== 'pillow')
    g.reorderAt = -9
    C.tapSlot(g, g.order.indexOf(wrong))
    const rc = C.roomChoices(g)
    const before = g.miss
    C.choose(g, 0); __sc.step(3)
    return { wrong, target, rcWrong: rc.wrong, rcTarget: rc.target, missUp: g.miss - before, cause: g.cause.kind, hanko: document.querySelector('#hanko').textContent, stillPend: !!g.L[target].pend }
  })
  expect(r.rcWrong && r.rcTarget === r.target && r.missUp === 1 && r.cause === 'gob' && /修羅場/.test(r.hanko) && r.stillPend, r)
  await q.close(); return r
})
await t('誤爆: 並びが変わった直後に押すと、押そうとした子への返事が出る', async () => {
  const q = await open(browser)
  await begin(q, 42); await grow(q, 4)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core
    if (g.room) C.back(g)
    // 2番目の子に未読がある状態で、別の子から新着が来るのを待つ
    for (let k = 0; k < 20000; k++) {
      const before = g.order.slice()
      __sc.step(1)
      if (g.group || g.room) { if (g.room) C.back(g); continue }
      if (g.t - g.reorderAt < 0.01 && before.join() !== g.order.join()) {
        for (let s = 1; s < g.order.length; s++) { const aimed = before[s], now = g.order[s]; if (aimed !== now && aimed !== 'grp' && now !== 'grp' && g.L[aimed].pend && !g.L[now].pend && now !== 'pillow') { C.tapSlot(g, s); const rc = C.roomChoices(g); return { slot: s, aimed, opened: g.room.id, now, target: rc && rc.target, wrong: rc && rc.wrong } } }
      }
    }
    return null
  })
  expect(r && r.opened === r.now && r.wrong && r.target === r.aimed, r); await q.close(); return r
})
await t('抱き枕の部屋で送ってもミスにならない（息抜き）', async () => {
  const q = await open(browser)
  await begin(q, 43)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core
    C.step(g, 0.05)
    g.queue = ['pillow'].concat(g.queue.filter(x => x !== 'pillow'))
    for (let k = 0; k < 6000 && !g.L.pillow; k++) { __sc.step(1); const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend); if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); C.choose(g, rc.choices.findIndex(c => c.ok)) } }
    for (let k = 0; k < 6000; k++) { __sc.step(1); if (g.L.pillow.pend) { const i = g.order.indexOf('pillow'); C.tapSlot(g, i); C.choose(g, 0) } if (!g.L.pillow.pend && g.L.futsuu.pend) break }
    const m0 = g.miss
    C.tapSlot(g, g.order.indexOf('pillow')); const rc = C.roomChoices(g); C.choose(g, 0)
    return { wrong: rc && rc.wrong, missUp: g.miss - m0, pat: g.L.pillow.log.length }
  })
  expect(r.wrong && r.missUp === 0, r); await q.close(); return r
})

// ---- 増える相手とグループ
await t('合う返事を重ねると恋人が増え、「友だち追加」が出る', async () => {
  const q = await open(browser)
  await begin(q, 51)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core, seen = []
    for (let k = 0; k < 20000 && g.peak < 5; k++) {
      __sc.step(1)
      const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend)
      if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); const before = g.peak; C.choose(g, rc.choices.findIndex(c => c.ok)); if (g.peak > before) seen.push({ peak: g.peak, replies: g.replies }) }
      if (g.group) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, !g.group.danger) }
    }
    __sc.step(2)
    return { seen, joins: g.ev.filter(e => e.type === 'join').length - 1, score: document.querySelector('#score').textContent, toast: document.querySelector('#toast b').textContent, rows: document.querySelectorAll('.row:not([hidden])').length }
  })
  expect(r.joins === 4 && r.seen[0].replies === 2 && r.score === '5股' && /友だち追加/.test(r.toast) && r.rows === 5, r)
  await q.close(); return r
})
await t('グループ招待: 恋人2人なら断ると修羅場回避（+3）、参加すると修羅場', async () => {
  const q = await open(browser)
  await begin(q, 61); await grow(q, 4)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core, out = {}
    for (const join of [false, true]) {
      if (g.room) C.back(g)
      for (let k = 0; k < 40000; k++) {
        if (g.group && g.group.danger) break
        if (g.group && !g.group.danger) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, true) }
        g.nextGroupAt = Math.min(g.nextGroupAt || 1e9, g.t + 0.1)
        __sc.step(1)
        for (const id of g.order) if (id !== 'grp' && g.L[id].pend) g.L[id].pend.until += 0.05
      }
      const lovers = g.group.mem.filter(m => m.id).length, m0 = g.miss, d0 = g.dodged, p0 = g.prog + g.peak * 100
      C.tapSlot(g, g.order.indexOf('grp'))
      C.groupAnswer(g, join)
      out[join ? 'join' : 'decline'] = { lovers, missUp: g.miss - m0, dodged: g.dodged - d0, cause: g.cause && g.cause.kind }
    }
    return out
  })
  expect(r.decline.lovers >= 2 && r.decline.dodged === 1 && r.decline.missUp === 0 && r.join.missUp === 1 && r.join.cause === 'grp', r)
  await q.close(); return r
})
await t('グループ招待: 知らない人だけなら参加が正解、断ると不機嫌', async () => {
  const q = await open(browser)
  await begin(q, 62); await grow(q, 3)
  const r = await q.evaluate(() => {
    const g = __sc.g, C = __sc.Core, out = []
    for (const join of [true, false]) {
      if (g.room) C.back(g)
      for (let k = 0; k < 40000; k++) {
        if (g.group && !g.group.danger) break
        if (g.group && g.group.danger) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, false) }
        g.nextGroupAt = Math.min(g.nextGroupAt || 1e9, g.t + 0.1)
        __sc.step(1)
        for (const id of g.order) if (id !== 'grp' && g.L[id].pend) g.L[id].pend.until += 0.05
      }
      const b0 = g.bad, m0 = g.miss
      C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, join)
      out.push({ join, lovers: 1, badUp: g.bad - b0 + (g.miss - m0) * 3 })
    }
    return out
  })
  expect(r[0].badUp === 0 && r[1].badUp === 1, r); await q.close(); return r
})
await t('時間切れ: 返事をしないと既読無視で1ミス、一覧に「既読無視」', async () => {
  const q = await open(browser)
  await begin(q, 71)
  const r = await q.evaluate(() => { const g = __sc.g; for (let k = 0; k < 4000 && !g.miss; k++) __sc.step(1); return { miss: g.miss, cause: g.cause.kind, ign: !!document.querySelector('.row .ign'), t: g.t } })
  expect(r.miss === 1 && r.cause === 'ign' && r.ign && r.t > 28, r); await q.close(); return r
})

// ---- 結果・音・英語
await t('結果: 画像が描けて、Xでポストの文と元のゲームへのリンクがある', async () => {
  const q = await open(browser)
  await begin(q, 81)
  await q.evaluate(() => { __sc.setBot('human', 3); const g = __sc.g; for (let k = 0; k < 40000 && !g.over; k++) __sc.step(1); __sc.setBot(null); __sc.pause(false) })
  await q.waitForFunction(() => window.__sc.cardDrawn, null, { timeout: 8000 })
  const r = await q.evaluate(() => {
    const c = document.querySelector('#card'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    let s = 0, s2 = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 97) { const v = d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11; s += v; s2 += v * v; n++ }
    return { varc: Math.round(s2 / n - (s / n) ** 2), orig: document.querySelector('#bOrig').href, rows: document.querySelectorAll('#eList .er').length, peak: __sc.g.peak, support: !!document.querySelector('#tmSupport') }
  })
  let url = null
  q.context().on('page', np => { url = np.url() })
  await q.evaluate(() => { window.open = u => { window.__opened = u } })
  await q.click('#bPost')
  const opened = await q.evaluate(() => window.__opened)
  expect(r.varc > 500 && /jibun-migaki/.test(r.orig) && r.rows === r.peak && r.support && /x\.com\/intent\/post/.test(opened) && /17%E8%82%A1/.test(opened), { ...r, opened })
  await q.screenshot({ path: `${ROOT}/shots/v-end.png` })
  await q.close(); return r
})
await t('音: 鳴らす操作をした後も実際には無音（Chromium）・音は呼ばれている', async () => {
  const r = await p.evaluate(() => ({ ok: window.__muteOk(), calls: window.__sfxCalls }))
  expect(r.ok === true && r.calls.notif > 0 && r.calls.send > 0, r); return r.calls
})
await t('英語: 切り替えると画面の言葉が英語になる', async () => {
  const q = await open(browser)
  await q.click('#bLang')
  const a = await q.evaluate(() => ({ start: document.querySelector('#bStart').textContent, title: document.querySelector('#tTitle').textContent }))
  await begin(q, 91); await grow(q, 3); await q.waitForTimeout(100)
  const b = await q.evaluate(() => ({ head: document.querySelector('#hTalk').textContent, score: document.querySelector('#score').textContent, rows: [...document.querySelectorAll('.row:not([hidden]) .mid')].map(e => e.textContent).join('|') }))
  const ja = /[ぁ-んァ-ヶ一-龠]/
  expect(a.start === 'Open chats' && /17 Chats/.test(a.title) && b.head === 'Chats' && !ja.test(b.score) && !ja.test(b.rows), { a, b })
  await q.screenshot({ path: `${ROOT}/shots/v-en-list.png` })
  await q.close(); return b.score
})
await t('X のアプリ内ブラウザ: 返事のボタンが下の52pxに入らない', async () => {
  const q = await open(browser, {}, '?inapp=x')
  await begin(q, 92); await step(q, 40)
  await q.evaluate(() => { const g = __sc.g; document.querySelectorAll('.row')[0].click() })
  await step(q, 2); await q.waitForTimeout(250)
  const r = await q.evaluate(() => { const H = innerHeight; return { H, bots: [...document.querySelectorAll('.chip')].map(c => Math.round(c.getBoundingClientRect().bottom)), cls: document.documentElement.className } })
  expect(/inapp-x/.test(r.cls) && r.bots.length === 3 && r.bots.every(b => b <= r.H - 52), r); await q.close(); return r
})
await p.close()

// ---- 6サイズ × 全画面で一画面に収まる
const SIZES = [[360, 640, 'small'], [390, 844, 'phone'], [430, 932, 'max'], [844, 390, 'land'], [768, 1024, 'tab'], [1440, 900, 'pc']]
for (const [w, h, name] of SIZES) {
  const q = await open(browser, { viewport: { width: w, height: h } })
  const views = {}
  await q.waitForTimeout(700)
  views.title = await fit(q); await q.screenshot({ path: `${ROOT}/shots/fit-${name}-title.png` })
  await q.click('#bHow'); views.how = await fit(q); await q.click('#howClose')
  await begin(q, 101); await grow(q, 17); await q.evaluate(() => { const g = __sc.g; g.nextGroupAt = g.t + 0.05; for (let i = 0; i < 300 && !g.group; i++) __sc.step(1) })
  views.list17 = await fit(q); const lo = await overflow(q); await q.screenshot({ path: `${ROOT}/shots/fit-${name}-list.png` })
  await q.evaluate(() => { const g = __sc.g; const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend); document.querySelectorAll('.row')[Math.max(0, i)].click(); __sc.step(2) })
  await q.waitForTimeout(250); views.room = await fit(q); await q.screenshot({ path: `${ROOT}/shots/fit-${name}-room.png` })
  await q.evaluate(() => { document.querySelector('#rBack').click(); __sc.step(1); const g = __sc.g; const i = g.order.indexOf('grp'); if (i >= 0) document.querySelectorAll('.row')[i].click(); __sc.step(1) })
  await q.waitForTimeout(250); views.group = await fit(q); await q.screenshot({ path: `${ROOT}/shots/fit-${name}-group.png` })
  await q.evaluate(() => { const g = __sc.g; for (let k = 0; k < 40000 && !g.over; k++) __sc.step(1); __sc.pause(false) })
  await q.waitForFunction(() => window.__sc.cardDrawn, null, { timeout: 8000 }); await q.waitForTimeout(700)
  views.end = await fit(q); const eo = await overflow(q); await q.screenshot({ path: `${ROOT}/shots/fit-${name}-end.png` })
  for (const [v, r] of Object.entries(views)) await t(`一画面に収まる ${name} ${w}x${h} ${v}`, async () => { expect(!r.over.length, r) })
  await t(`${name}: はみ出し・エラーなし`, async () => { expect(lo.sw <= lo.W && !lo.bad.length && eo.sw <= eo.W && !eo.bad.length && !q.errs.length, { lo, eo, e: q.errs }) })
  await q.close()
}
await browser.close()

// ---- WebKit（iPhone 相当）でタッチの通し
const wb = await webkit.launch(), wp = await open(wb, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await t('WebKit: 2本指の touchmove を止める', async () => {
  const r = await wp.evaluate(() => { const e = new Event('touchmove', { cancelable: true, bubbles: true }); Object.defineProperty(e, 'touches', { value: [{}, {}] }); document.body.dispatchEvent(e); return e.defaultPrevented })
  expect(r, r)
})
await t('WebKit: タップで 開始→開く→返事', async () => {
  await wp.evaluate(() => __sc.seed(13)); await wp.tap('#bStart'); await wp.evaluate(() => __sc.pause(true)); await step(wp, 40)
  const xy = await wp.evaluate(() => __sc.rowXY(0)); await wp.touchscreen.tap(xy.x, xy.y); await wp.waitForTimeout(300)
  const okI = await wp.evaluate(() => __sc.Core.roomChoices(__sc.g).choices.findIndex(c => c.ok))
  const c = await wp.evaluate(i => __sc.chipXY(i), okI); await wp.touchscreen.tap(c.x, c.y)
  const s = await state(wp); expect(s.replies === 1, s); return s.replies
})
await t('WebKit: 実際には無音', async () => { const r = await wp.evaluate(() => window.__muteOk()); expect(r === true, r) })
await t('WebKit: 何もしない通しで結果まで行ける', async () => {
  await wp.evaluate(() => { const g = __sc.g; for (let k = 0; k < 6000 && !g.over; k++) __sc.step(1); __sc.pause(false) })
  await wp.waitForFunction(() => window.__sc.cardDrawn, null, { timeout: 8000 })
  await wp.screenshot({ path: `${ROOT}/shots/v-webkit-end.png` })
})
await t('WebKit: エラーなし', async () => { expect(wp.errs.length === 0, wp.errs.join('|')) })
await wb.close()
server.kill()
console.log(results.join('\n'))
console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
