/**
 * Decide how much 3D this device should be asked to do.
 *   none : no WebGL / data-saver / very low memory → lightweight HTML-only invitation
 *   low  : weak phones → fewer particles, no shadows, 1x pixel ratio
 *   mid  : ordinary phones → reduced geometry, no shadows
 *   high : desktops / strong devices
 * Override while testing with ?tier=none|low|mid|high
 */
export function detect() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  let webgl = false
  try {
    const c = document.createElement('canvas')
    webgl = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webgl = false
  }

  const nav = navigator
  const mem = nav.deviceMemory || 4
  const cores = nav.hardwareConcurrency || 4
  const saveData = !!nav.connection?.saveData
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false
  const mobile = coarse || window.innerWidth < 820

  let tier = 'high'
  if (!webgl || saveData || mem <= 1) tier = 'none'
  else if (mobile && (mem <= 3 || cores <= 4)) tier = 'low'
  else if (mobile) tier = 'mid'
  else if (mem <= 2 || cores <= 2) tier = 'low'

  const forced = new URLSearchParams(window.location.search).get('tier')
  if (['none', 'low', 'mid', 'high'].includes(forced)) tier = webgl || forced === 'none' ? forced : 'none'

  return { tier, reduced, mobile, webgl }
}

/** Per-tier budgets for the 3D scene. */
export const BUDGET = {
  high: { dpr: [1, 1.75], shadows: true, petals: 90, dust: 160, pillarStep: 5, garlandBeads: 34, envRes: 256, antialias: true },
  mid: { dpr: [1, 1.5], shadows: false, petals: 46, dust: 80, pillarStep: 7, garlandBeads: 22, envRes: 128, antialias: true },
  low: { dpr: [1, 1], shadows: false, petals: 22, dust: 36, pillarStep: 10, garlandBeads: 14, envRes: 64, antialias: false },
}
