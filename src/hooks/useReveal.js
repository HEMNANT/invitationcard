import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Fade-and-rise children matching `selector` as the section scrolls into view.
 * Skipped entirely when the guest prefers reduced motion.
 */
export function useReveal(ref, selector = '[data-reveal]', { enabled = true, reduced = false, delay = 0 } = {}) {
  useLayoutEffect(() => {
    if (!enabled || reduced || !ref.current) return undefined
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(selector, ref.current)
      if (!items.length) return
      gsap.from(items, {
        y: 28,
        opacity: 0,
        duration: 1.8,
        ease: 'power1.out',
        stagger: 0.22,
        delay,
        scrollTrigger: { trigger: ref.current, start: 'top 82%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [ref, selector, enabled, reduced, delay])
}

export { gsap, ScrollTrigger }
