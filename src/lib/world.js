import gsap from 'gsap'

// The opening sequence gates the whole invitation, so it must finish on schedule even when
// frames are slow (weak phones) instead of being stretched out by GSAP's lag smoothing.
gsap.ticker.lagSmoothing(0)

/**
 * Shared, mutable state read every frame by the 3D scene.
 * (Kept outside React so scroll/gesture updates never trigger re-renders.)
 */
export const world = {
  intro: 0, // 0 = free scroll camera right from the start
  doors: 1, // 1 = open
  light: 1, // 1 = fully illuminated
  sectionPos: 0, // index.fraction of the section being viewed (scroll driven)
  galleryIndex: 0,
  px: 0, // smoothed parallax, -1..1
  py: 0,
  hero: { w: 2.1, h: 2.6 },
  frames: [], // [{w,h}] measured by gallery frames
  reduced: false,
}

let opening = null

/** Animate the doors, camera push-in and lights. Safe to call before the 3D scene has mounted. */
export function playOpen({ reduced = false } = {}) {
  if (opening) return
  if (reduced) {
    Object.assign(world, { doors: 1, intro: 0, light: 1 })
    return
  }
  opening = gsap
    .timeline()
    .to(world, { light: 0.7, duration: 2.2, ease: 'sine.out' }, 0)
    .to(world, { doors: 1, duration: 4.8, ease: 'power2.inOut' }, 0.4)
    .to(world, { intro: 0, duration: 6.5, ease: 'power2.inOut' }, 1.0)
    .to(world, { light: 1, duration: 4.0, ease: 'sine.inOut' }, 2.5)
}
