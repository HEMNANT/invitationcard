/**
 * Optional, dependency-free RSVP backend.
 *
 *   npm run rsvp            → listens on :8787, appends replies to server/rsvps.jsonl
 *   (dev) Vite proxies /api → :8787, so set  rsvp.endpoint = "/api/rsvp"  in wedding.config.js
 *   (prod) host this anywhere and set rsvp.endpoint to its full URL; set ALLOW_ORIGIN to your site.
 *
 * It only reports success after the reply has been written to disk.
 */
import http from 'node:http'
import { appendFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT || 8787)
const ORIGIN = process.env.ALLOW_ORIGIN || '*'
const FILE = process.env.RSVP_FILE || join(dirname(fileURLToPath(import.meta.url)), 'rsvps.jsonl')

const hits = new Map() // ip -> [timestamps]; tiny rate limit (8 / minute)
const limited = (ip) => {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 8
}

const send = (res, code, body) => {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {})
  if (req.url === '/api/health') return send(res, 200, { ok: true })
  if (req.method !== 'POST' || !req.url?.startsWith('/api/rsvp')) return send(res, 404, { ok: false })

  const ip = req.socket.remoteAddress || 'unknown'
  if (limited(ip)) return send(res, 429, { ok: false, error: 'Too many requests' })

  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 10_000) return send(res, 413, { ok: false, error: 'Too large' })
  }
  try {
    const d = JSON.parse(raw)
    const name = String(d.name || '').trim().slice(0, 80)
    if (!name) return send(res, 400, { ok: false, error: 'Name is required' })
    const record = {
      name,
      attending: d.attending === 'no' ? 'no' : 'yes',
      guests: Math.min(20, Math.max(1, Number(d.guests) || 1)),
      message: String(d.message || '').slice(0, 500),
      receivedAt: new Date().toISOString(),
    }
    await mkdir(dirname(FILE), { recursive: true })
    await appendFile(FILE, JSON.stringify(record) + '\n', 'utf8')
    return send(res, 200, { ok: true })
  } catch {
    return send(res, 400, { ok: false, error: 'Invalid request' })
  }
})

server.listen(PORT, () => console.log(`RSVP server on :${PORT} → ${FILE}`))
