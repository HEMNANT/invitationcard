import * as THREE from 'three'

const make = (w, h) => {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')]
}

function toTexture(c, { srgb = true, repeat, aniso = 4 } = {}) {
  const t = new THREE.CanvasTexture(c)
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = aniso
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
  }
  return t
}

/** Line-art lotus mandala drawn around (cx, cy). */
export function mandala(ctx, cx, cy, R, color, { petals = 16, lineWidth = 2, fill = null } = {}) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  for (const r of [R, R * 0.93, R * 0.36, R * 0.12]) {
    ctx.beginPath()
    ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  const petal = (len0, len1, wid) => {
    ctx.beginPath()
    ctx.moveTo(0, -len0)
    ctx.quadraticCurveTo(wid, -(len0 + len1) / 2, 0, -len1)
    ctx.quadraticCurveTo(-wid, -(len0 + len1) / 2, 0, -len0)
    if (fill) {
      ctx.fillStyle = fill
      ctx.fill()
    }
    ctx.stroke()
  }
  for (let k = 0; k < petals; k++) {
    ctx.save()
    ctx.rotate((k / petals) * Math.PI * 2)
    petal(R * 0.4, R * 0.9, R * 0.17)
    ctx.restore()
    ctx.save()
    ctx.rotate(((k + 0.5) / petals) * Math.PI * 2)
    petal(R * 0.4, R * 0.62, R * 0.09)
    ctx.restore()
  }
  ctx.fillStyle = color
  for (let k = 0; k < petals * 2; k++) {
    const a = (k / (petals * 2)) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(Math.cos(a) * R * 0.965, Math.sin(a) * R * 0.965, lineWidth * 0.9, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

/** Carved temple door in white marble and embossed gold. */
export function doorTexture(side) {
  const W = 512
  const H = 1024
  const [c, ctx] = make(W, H)
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#FFFFFF')
  g.addColorStop(0.5, '#F9F6F0')
  g.addColorStop(1, '#EFE8DC')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // subtle marble veining
  ctx.globalAlpha = 0.08
  for (let i = 0; i < 90; i++) {
    ctx.strokeStyle = i % 2 ? '#BCA371' : '#D4AF37'
    ctx.lineWidth = 1 + Math.random() * 1.5
    const x = Math.random() * W
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.bezierCurveTo(x + 18, H * 0.3, x - 18, H * 0.7, x + 6, H)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const gold = '#D4AF37'
  ctx.strokeStyle = gold
  ctx.lineWidth = 6
  ctx.strokeRect(14, 14, W - 28, H - 28)
  ctx.lineWidth = 2
  ctx.strokeRect(34, 34, W - 68, H - 68)

  // recessed panels (top & bottom)
  const panel = (y, h) => {
    ctx.fillStyle = 'rgba(212, 175, 55, 0.07)'
    ctx.fillRect(64, y, W - 128, h)
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)'
    ctx.lineWidth = 2
    ctx.strokeRect(64, y, W - 128, h)
    ctx.strokeRect(74, y + 10, W - 148, h - 20)
  }
  panel(70, 250)
  panel(H - 320, 250)

  // studs
  ctx.fillStyle = gold
  for (let r = 0; r < 9; r++) {
    for (const x of [48, W - 48]) {
      ctx.beginPath()
      ctx.arc(x, 110 + r * 100, 7, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // central mandala split across the two doors
  const cx = side === 'left' ? W : 0
  mandala(ctx, cx, H / 2, 300, 'rgba(212, 175, 55, 0.95)', { petals: 16, lineWidth: 3, fill: 'rgba(212, 175, 55, 0.15)' })

  // door handle ring
  const hx = side === 'left' ? W - 40 : 40
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(hx, H / 2 + 70, 22, 0, Math.PI * 2)
  ctx.stroke()
  return toTexture(c, { aniso: 8 })
}

/** Pure pearl-and-gold stationery backing for the 3D invitation card. */
export function cardBackTexture() {
  const W = 640
  const H = 920
  const [c, ctx] = make(W, H)
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#FFFFFF')
  g.addColorStop(1, '#F8F4EC')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#D4AF37'
  ctx.lineWidth = 5
  ctx.strokeRect(22, 22, W - 44, H - 44)
  ctx.lineWidth = 2
  ctx.strokeRect(40, 40, W - 80, H - 80)
  mandala(ctx, W / 2, H / 2, 250, 'rgba(212, 175, 55, 0.35)', { petals: 20, lineWidth: 2 })
  for (const [x, y, rx, ry] of [[40, 40, 1, 1], [W - 40, 40, -1, 1], [40, H - 40, 1, -1], [W - 40, H - 40, -1, -1]]) {
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(rx, ry)
    ctx.strokeStyle = '#D4AF37'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, 90)
    ctx.bezierCurveTo(0, 30, 30, 0, 90, 0)
    ctx.moveTo(14, 70)
    ctx.bezierCurveTo(18, 38, 38, 18, 70, 14)
    ctx.stroke()
    ctx.restore()
  }
  return toTexture(c, { aniso: 8 })
}

/** Arched, gold-trimmed white marble backdrop panel behind the hero frame. */
export function archPanelTexture() {
  const W = 768
  const H = 1024
  const [c, ctx] = make(W, H)
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, '#FFFFFF')
  g.addColorStop(1, '#F7F1E6')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  const arch = (inset, lw, color) => {
    ctx.strokeStyle = color
    ctx.lineWidth = lw
    ctx.beginPath()
    ctx.moveTo(inset, H - inset)
    ctx.lineTo(inset, W / 2 + inset)
    ctx.arc(W / 2, W / 2, W / 2 - inset, Math.PI, 0)
    ctx.lineTo(W - inset, H - inset)
    ctx.closePath()
    ctx.stroke()
  }
  arch(30, 8, '#D4AF37')
  arch(56, 3, 'rgba(212, 175, 55, 0.85)')
  // scalloped inner border
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)'
  ctx.lineWidth = 2
  for (let i = 0; i < 14; i++) {
    const a = Math.PI + (i / 13) * Math.PI
    const r = W / 2 - 90
    ctx.beginPath()
    ctx.arc(W / 2 + Math.cos(a) * r, W / 2 + Math.sin(a) * r, 16, 0, Math.PI * 2)
    ctx.stroke()
  }
  mandala(ctx, W / 2, W / 2 - 40, 150, 'rgba(212, 175, 55, 0.38)', { petals: 12, lineWidth: 2 })
  return toTexture(c, { aniso: 8 })
}

/** Rangoli / kolam drawn in shimmering gold on polished floor. */
export function kolamTexture() {
  const S = 768
  const [c, ctx] = make(S, S)
  ctx.clearRect(0, 0, S, S)
  mandala(ctx, S / 2, S / 2, 340, 'rgba(212, 175, 55, 0.95)', { petals: 24, lineWidth: 3 })
  mandala(ctx, S / 2, S / 2, 220, 'rgba(212, 175, 55, 0.98)', { petals: 12, lineWidth: 3, fill: 'rgba(212, 175, 55, 0.22)' })
  ctx.fillStyle = 'rgba(212, 175, 55, 0.95)'
  for (let k = 0; k < 48; k++) {
    const a = (k / 48) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(S / 2 + Math.cos(a) * 365, S / 2 + Math.sin(a) * 365, 5, 0, Math.PI * 2)
    ctx.fill()
  }
  return toTexture(c, { aniso: 8 })
}

export function stoneTexture(repeat) {
  const S = 256
  const [c, ctx] = make(S, S)
  ctx.fillStyle = '#FAF7F2' // Polished Makrana white marble
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 1200; i++) {
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '212,175,55' : '180,165,150'},${Math.random() * 0.08})`
    ctx.fillRect(Math.random() * S, Math.random() * S, 2 + Math.random() * 6, 2 + Math.random() * 6)
  }
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)'
  ctx.lineWidth = 4
  ctx.strokeRect(0, 0, S, S)
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.18)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(6, 6, S - 12, S - 12)
  return toTexture(c, { repeat, aniso: 4 })
}

/** Soft radial dot used for flame glow and gold dust. */
export function glowTexture() {
  const S = 128
  const [c, ctx] = make(S, S)
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)
  return toTexture(c, { srgb: true, aniso: 1 })
}
