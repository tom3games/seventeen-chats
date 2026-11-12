// 人の速さの bot を種を変えて回し、何股まで行くかの分布を出す（画面なし・Node だけ）。node sim.mjs [回数]
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
const ROOT = import.meta.dirname
const ctx = { console, Math }
vm.createContext(ctx)
for (const f of ['data.js', 'core.js']) vm.runInContext(readFileSync(`${ROOT}/${f}`, 'utf8'), ctx, { filename: f })
const { Core } = ctx
const N = Number(process.argv[2] || 200)

function run(kind, seed) {
  const g = Core.create(seed), b = Core.makeBot(kind, seed)
  while (!g.over && g.t < 1800) { Core.step(g, Core.DT); Core.botStep(g, b) }
  return { peak: g.peak, t: g.t, replies: g.replies, cause: g.cause && g.cause.kind, gob: g.gob, dodged: g.dodged }
}
const q = (a, p) => a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(p * a.length))]
for (const kind of ['idle', 'sloppy', 'human', 'good', 'fast']) {
  const rs = []
  for (let s = 1; s <= N; s++) rs.push(run(kind, s * 7919))
  const pk = rs.map(r => r.peak), tm = rs.map(r => r.t)
  const hist = {}
  for (const p of pk) hist[p] = (hist[p] || 0) + 1
  const causes = {}
  for (const r of rs) causes[r.cause] = (causes[r.cause] || 0) + 1
  console.log(`${kind.padEnd(6)} 股: 10%=${q(pk, .1)} 中央=${q(pk, .5)} 90%=${q(pk, .9)} 最高=${Math.max(...pk)}  時間(秒): 10%=${Math.round(q(tm, .1))} 中央=${Math.round(q(tm, .5))} 90%=${Math.round(q(tm, .9))}  誤爆/回=${(rs.reduce((a, r) => a + r.gob, 0) / N).toFixed(2)}  終わり方=${JSON.stringify(causes)}`)
  console.log('        分布 ' + Object.entries(hist).map(([k, v]) => `${k}股:${v}`).join(' '))
}
// 同じ種なら同じ結果
const a = run('human', 42), b = run('human', 42)
console.log('同じ種で同じ結果:', JSON.stringify(a) === JSON.stringify(b), JSON.stringify(a))
