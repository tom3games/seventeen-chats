import './mute-auto.mjs'
// チュートリアルの指の位置と英語の部屋を撮る（目で見る用）
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
const ROOT = import.meta.dirname
const server = spawn(process.execPath, ['server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: '5731' } })
await new Promise(r => setTimeout(r, 400))
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await p.goto('http://localhost:5731/'); await p.waitForFunction(() => window.__scReady)
await p.evaluate(() => { __sc.seed(5); document.querySelector('#bStart').click(); __sc.pause(true); __sc.step(40) })
await p.waitForTimeout(300)
const xy = await p.evaluate(() => __sc.rowXY(0)); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(600)
await p.screenshot({ path: ROOT + '/shots/d-tutpick.png' })
await p.click('#bLang')
await p.evaluate(() => { const g = __sc.g, C = __sc.Core; document.querySelector('#rBack').click(); __sc.noTut(); for (let k = 0; k < 20000 && g.peak < 6; k++) { __sc.step(1); if (g.room) C.back(g); const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend); if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); C.choose(g, rc.choices.findIndex(c => c.ok)) } if (g.group) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, !g.group.danger) } } __sc.ui().room = null
  for (let k = 0; k < 4000; k++) { __sc.step(1); const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend && id !== 'futsuu'); if (i >= 0) { document.querySelectorAll('.row')[i].click(); break } } __sc.step(2) })
await p.waitForTimeout(500)
await p.screenshot({ path: ROOT + '/shots/d-en-room.png' })
await b.close(); server.kill()
