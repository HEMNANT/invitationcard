import * as THREE from 'three'
import { mandala } from './textures.js'

/**
 * A clearly-labelled stand-in shown until the family supplies real media.
 * It deliberately contains no people.
 */
export function placeholderTexture(kind, label, aspect = 0.8) {
  const H = 768
  const W = Math.max(256, Math.round(H * aspect))
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#4a1420')
  g.addColorStop(1, '#641E2D')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  mandala(ctx, W / 2, H / 2, Math.min(W, H) * 0.42, 'rgba(197,161,92,0.32)', { petals: 16, lineWidth: 2 })
  ctx.strokeStyle = 'rgba(197,161,92,0.7)'
  ctx.lineWidth = 3
  ctx.strokeRect(18, 18, W - 36, H - 36)
  ctx.fillStyle = '#C5A15C'
  ctx.textAlign = 'center'
  ctx.font = `italic 500 ${Math.round(W * 0.07)}px "Cormorant Garamond", Georgia, serif`
  ctx.fillText(kind === 'video' ? 'Couple video here' : 'Couple photo here', W / 2, H * 0.47)
  ctx.font = `500 ${Math.round(W * 0.045)}px "Cormorant Garamond", Georgia, serif`
  ctx.fillStyle = 'rgba(247,240,227,0.85)'
  ctx.fillText(label || '', W / 2, H * 0.55)
  ctx.font = `400 ${Math.round(W * 0.034)}px "Cormorant Garamond", Georgia, serif`
  ctx.fillStyle = 'rgba(247,240,227,0.6)'
  ctx.fillText('Add the file in wedding.config.js', W / 2, H * 0.62)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}
