import './mute-auto.mjs'
// 台本どおりに進めて撮る（目で見る用）。node shot.mjs [幅] [高さ]
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
const ROOT = import.meta.dirname
mkdirSync(ROOT + '/shots', { recursive: true })
const PORT = Number(process.env.VPORT || 5731)
const server = spawn(process.execPath, ['server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT) } })
await new Promise(r => setTimeout(r, 400))
const W = Number(process.argv[2] || 390), H = Number(process.argv[3] || 844), LANG = process.env.LANG2 || 'ja'
const b = await chromium.launch()
const ctx = await b.newContext({ locale: LANG === 'en' ? 'en-US' : 'ja-JP', viewport: { width: W, height: H }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })
await ctx.addInitScript(() => { try { localStorage.clear() } catch (e) {} })
const p = await ctx.newPage(); const errs = []
p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
await p.goto(`http://localhost:${PORT}/`); await p.waitForFunction(() => window.__scReady)
await p.waitForTimeout(1600)
const tag = `${W}x${H}${LANG === 'en' ? '-en' : ''}`
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-1title.png` })
await p.evaluate(() => { __sc.seed(77); __sc.start(); __sc.pause(true); __sc.step(40) })
await p.waitForTimeout(400)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-2tut.png` })
await p.evaluate(() => { __sc.noTut(); __sc.setBot('fast', 5); __sc.step(1400); __sc.setBot(null) })
await p.evaluate(() => { const g = __sc.g; if (g.room) __sc.Core.back(g) })
await p.waitForTimeout(300)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-3list.png` })
// 未読のある子を開く
await p.evaluate(() => { const g = __sc.g; __sc.ui().room = null; const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend); document.querySelectorAll('.row')[i].click(); __sc.step(4) })
await p.waitForTimeout(400)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-4room.png` })
await p.evaluate(() => { document.querySelector('#rBack').click() })
// 招待を出して開く
await p.evaluate(() => { const g = __sc.g; g.nextGroupAt = g.t + 0.05; for (let i = 0; i < 400 && !g.group; i++) __sc.step(1); const i = g.order.indexOf('grp'); if (i >= 0) document.querySelectorAll('.row')[i].click(); __sc.step(4) })
await p.waitForTimeout(400)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-5group.png` })
await p.evaluate(() => { document.querySelector('#rBack').click(); const g = __sc.g; __sc.setBot('sloppy', 3); for (let i = 0; i < 6000 && !g.over; i++) __sc.step(1); __sc.setBot(null) })
await p.waitForTimeout(500)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-6over.png` })
await p.evaluate(() => { __sc.pause(false) })
await p.waitForFunction(() => !document.querySelector('#vEnd').hidden, null, { timeout: 8000 })
await p.waitForTimeout(1200)
await p.screenshot({ path: `${ROOT}/shots/s-${tag}-7end.png` })
const card = await p.evaluate(() => document.querySelector('#card').toDataURL('image/png'))
const { writeFileSync } = await import('node:fs')
writeFileSync(`${ROOT}/shots/s-${tag}-8card.png`, Buffer.from(card.split(',')[1], 'base64'))
console.log('errors:', errs.length ? errs : 'none')
await b.close(); server.kill()
