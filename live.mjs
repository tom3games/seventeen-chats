import './mute-auto.mjs'
import { MUTE_LAUNCH, muteContext } from './mute.mjs'
// 公開URLの確認。node live.mjs（ログインしていないブラウザで見る）。SKIPGH=1 で GitHub ページの確認を省く
// github.io は横丁（tom3games.com/play/seventeen-chats/）へ転送されるので、ここでは転送の script を外して github.io の中身を確かめる
import { chromium, webkit } from 'playwright'
import { execSync } from 'node:child_process'
// 個人のアカウント名は公開リポジトリに書かない。実行時に gh から取る
const OWNER = (() => { try { return execSync('gh api user -q .login', { encoding: 'utf8' }).trim().toLowerCase() } catch { return '' } })()
const URL0 = 'https://tom3games.github.io/seventeen-chats/'
const out = []
for (const [name, bt, opts] of [['chromium', chromium, {}], ['webkit', webkit, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const b = await bt.launch(bt === chromium ? MUTE_LAUNCH : {}), ctx = await b.newContext({ locale: 'ja-JP', viewport: { width: 390, height: 844 }, ...opts })
  await muteContext(ctx)
  await ctx.route(u => u.href.startsWith(URL0), async route => {
    if (route.request().resourceType() !== 'document') return route.continue()
    const r = await route.fetch(); const body = (await r.text()).replace(/<script id="ghMove">[\s\S]*?<\/script>/, '')
    return route.fulfill({ response: r, body })
  })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()) })
  p.on('requestfailed', r => { if (!/googletagmanager|fonts\.g/.test(r.url())) errs.push('fail ' + r.url()) })
  await p.goto(URL0 + '?t=' + Date.now(), { waitUntil: 'networkidle' })
  await p.waitForFunction(() => window.__scReady, null, { timeout: 15000 })
  // 遊びの通し: 開始 → 開く → 合う返事 → 何もしないで結果まで
  await p.evaluate(() => { __sc.seed(5); __sc.noTut(); document.querySelector('#bStart').click(); __sc.noTut(); __sc.pause(true); __sc.step(40) })
  await p.evaluate(() => document.querySelectorAll('.row')[0].click()); await p.waitForTimeout(300)
  await p.evaluate(() => { const i = __sc.Core.roomChoices(__sc.g).choices.findIndex(c => c.ok); document.querySelectorAll('.chip')[i].click() })
  const rep = await p.evaluate(() => __sc.g.replies)
  await p.evaluate(() => { const g = __sc.g; for (let k = 0; k < 6000 && !g.over; k++) __sc.step(1); __sc.pause(false) })
  await p.waitForFunction(() => window.__sc.cardDrawn, null, { timeout: 10000 })
  await p.screenshot({ path: `shots/live-${name}.png` })
  const og = await p.evaluate(async u => { const r = await fetch(u + 'og.png'); return r.status + ' ' + r.headers.get('content-type') }, URL0)
  out.push(`${name}: replies=${rep} og=${og} errors=${errs.length ? errs.join(' | ') : 'none'}`)
  await b.close()
}
if (process.env.SKIPGH) { console.log(out.join('\n')); process.exit(0) }
const b = await chromium.launch(MUTE_LAUNCH), p = await b.newPage()
for (const u of ['https://github.com/tom3games/seventeen-chats', 'https://github.com/tom3games/seventeen-chats/commits/main']) {
  const res = await p.goto(u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(2500)
  out.push(`${u} status=${res.status()} owner=${OWNER && (await p.content()).toLowerCase().includes(OWNER) ? 'FOUND' : 'none'}`)
}
await b.close()
console.log(out.join('\n'))
