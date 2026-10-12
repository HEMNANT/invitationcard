/** Choose from a string or { sm, md, lg } by viewport width × pixel ratio. */
export function pickSrc(src) {
  if (!src) return ''
  if (typeof src === 'string') return src
  const px = typeof window !== 'undefined' ? window.innerWidth * Math.min(window.devicePixelRatio || 1, 2) : 1200
  if (px <= 800 && src.sm) return src.sm
  if (px <= 1400 && (src.md || src.sm)) return src.md || src.sm
  return src.lg || src.md || src.sm || ''
}

/** Fit a rectangle of the given aspect inside maxW × maxH. */
export function fitFrame(aspect, maxW, maxH) {
  const a = aspect > 0 ? aspect : 0.8
  const w = Math.min(maxW, maxH * a)
  return { w, h: w / a }
}
