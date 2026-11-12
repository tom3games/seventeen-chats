import './mute-auto.mjs'
// OGP 画像（1200x630）を作る。遊んでいる一番おかしい場面（教授に「にゃ」を誤爆）＋題名。node og.mjs
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
const ROOT = import.meta.dirname
mkdirSync(ROOT + '/shots', { recursive: true })
const PORT = Number(process.env.VPORT || 5734)
const server = spawn(process.execPath, ['server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT) } })
await new Promise(r => setTimeout(r, 400))
const b = await chromium.launch()
const ctx = await b.newContext({ locale: 'ja-JP', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await ctx.addInitScript(() => { try { localStorage.clear() } catch (e) {} })
const p = await ctx.newPage()
await p.goto(`http://localhost:${PORT}/`); await p.waitForFunction(() => window.__scReady)
await p.evaluate(() => document.fonts.ready)
await p.evaluate(() => {
  __sc.seed(2024); __sc.noTut(); document.querySelector('#bStart').click(); __sc.noTut(); __sc.pause(true)
  const g = __sc.g, C = __sc.Core
  g.queue = ['prof', 'cat', 'gal', 'robot', 'granny', 'takane'].concat(g.queue.filter(x => !['prof', 'cat', 'gal', 'robot', 'granny', 'takane'].includes(x)))
  for (let k = 0; k < 30000 && g.peak < 7; k++) {
    __sc.step(1); if (g.room) C.back(g)
    const i = g.order.findIndex(id => id !== 'grp' && g.L[id].pend)
    if (i >= 0) { C.tapSlot(g, i); const rc = C.roomChoices(g); if (rc && !rc.wrong) C.choose(g, rc.choices.findIndex(c => c.ok)); else C.back(g) }
    if (g.group) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, !g.group.danger) }
  }
  // 教授から1通来て返した後、猫の「にゃ」が来るのを待つ
  for (let k = 0; k < 30000; k++) {
    __sc.step(1); if (g.room) C.back(g)
    for (const id of g.order) { if (id === 'grp' || id === 'cat' || id === 'prof') continue; const lv = g.L[id]; if (lv.pend) { C.tapSlot(g, g.order.indexOf(id)); C.choose(g, C.roomChoices(g).choices.findIndex(c => c.ok)) } }
    if (g.group) { C.tapSlot(g, g.order.indexOf('grp')); C.groupAnswer(g, !g.group.danger) }
    if (g.L.prof.pend && g.L.prof.log.length > 4) { C.tapSlot(g, g.order.indexOf('prof')); const rc = C.roomChoices(g); C.choose(g, rc.choices.findIndex(c => c.ok)) }
    if (g.L.cat.pend && !g.L.prof.pend && g.L.prof.log.length > 6 && g.t > g.L.prof.log[g.L.prof.log.length - 1].at + 1) break
  }
  const cp = g.L.cat.pend
  cp.choices = [{ tok: ['にゃ', 'Mew'], ok: true }, { tok: ['なに？', 'What?'], ok: false }, { tok: ['鶏むね', 'Chicken breast'], ok: false }]
  g.reorderAt = -9
  if (g.room) C.back(g)
  __sc.step(1); g.reorderAt = -9
  document.querySelectorAll('.row')[g.order.indexOf('prof')].click()
  __sc.step(2)
})
await p.waitForTimeout(400)
await p.evaluate(() => { document.querySelector('.chip[data-i="0"]').click(); __sc.step(13) })
await p.waitForTimeout(650)
const phone = await p.screenshot({ type: 'png' })
writeFileSync(`${ROOT}/shots/og-phone.png`, phone)
const faces = ['futsuu', 'takane', 'imo', 'pillow', 'otaku', 'protein', 'narcis', 'prof', 'inteli', 'gal', 'rich', 'goukon', 'cat', 'robot', 'granny', 'nurse', 'gamer']
  .map(id => 'data:image/webp;base64,' + readFileSync(`${ROOT}/img/t_${id}.webp`).toString('base64'))
const ctx2 = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
const pp = await ctx2.newPage()
await pp.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=RocknRoll+One&family=Yusei+Magic&display=swap" rel="stylesheet"><style>
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;overflow:hidden;background:#c8552e;font-family:"Hiragino Sans",sans-serif;position:relative}
.bg{position:absolute;inset:0;background:radial-gradient(circle at 75% 40%,#d9683c,#a8401f 70%)}
.ph{position:absolute;left:70px;top:18px;width:282px;height:610px;border-radius:30px;overflow:hidden;border:7px solid #2a1d14;box-shadow:0 18px 40px rgba(0,0,0,.45);transform:rotate(-4deg);background:#2a1d14}
.ph img{width:100%;height:100%;object-fit:cover;object-position:top}
.r{position:absolute;left:420px;right:40px;top:58px;color:#fff}
h1{font:400 112px/1 "RocknRoll One";letter-spacing:.01em;text-shadow:0 5px 0 #7d2f14}
h1 b{font-weight:400;color:#ffd36b}
.say{margin-top:26px;font:40px/1.35 "Yusei Magic";color:#fff3dc}
.say em{font-style:normal;background:#ffd36b;color:#2a1d14;padding:0 10px;border-radius:10px}
.faces{margin-top:30px;display:flex;flex-wrap:wrap;gap:8px;width:700px}
.faces img{width:62px;height:62px;border-radius:50%;object-fit:cover;object-position:50% 15%;border:3px solid #fff3dc}
</style></head><body><div class="bg"></div><div class="ph"><img src="data:image/png;base64,${phone.toString('base64')}"></div>
<div class="r"><h1><b>17</b>股トーク</h1><div class="say">猫に送るはずの<em>「にゃ」</em>を、<br>教授に送ってしまった。</div><div class="faces">${faces.map(f => `<img src="${f}">`).join('')}</div></div></body></html>`)
await pp.evaluate(() => document.fonts.ready); await pp.waitForTimeout(800)
await pp.screenshot({ path: `${ROOT}/og.png` })
console.log('og.png written')
await b.close(); server.kill()
