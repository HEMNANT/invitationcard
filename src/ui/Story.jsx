import { useEffect, useRef, useState } from 'react'
import { Corner, Divider } from './Ornaments.jsx'
import { TreeBranchLeft, TreeBranchRight, FloatingLeaves } from './TreeBranches.jsx'
import AkshataShower from './AkshataShower.jsx'
import config from '../config/wedding.config.js'

/**
 * Story
 * "Two Hearts. One Beautiful Beginning."
 * Showcases T. Haarika & B. Manoj's real portrait (coupleImage),
 * framed by royal botanical tree branches that sway and animate with scroll parallax.
 */
export default function Story({ reduced }) {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (reduced) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false
          const el = containerRef.current
          if (!el) return
          const rect = el.getBoundingClientRect()
          const vh = window.innerHeight

          // Calculate progress as section moves through viewport
          const totalDistance = rect.height + vh
          const currentDistance = vh - rect.top
          const progress = Math.max(0, Math.min(1, currentDistance / totalDistance))

          setScrollProgress(progress)
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduced])

  // Parallax subtle scale & vertical float for the couple photo
  const imgScale = reduced ? 1 : 1.05 - scrollProgress * 0.05
  const imgTranslateY = reduced ? 0 : (scrollProgress - 0.5) * -16

  const { bride, groom } = config.couple

  return (
    <section id="story" ref={containerRef} className="story-tree-section" aria-label="Our Story">
      {/* Scroll-animated botanical trees framing the couple */}
      <TreeBranchLeft progress={scrollProgress} />
      <TreeBranchRight progress={scrollProgress} />
      <FloatingLeaves progress={scrollProgress} />

      <div className="story-stage">
        <header className="story__head">
          <p className="eyebrow">Our Story</p>
          <h2 id="story-title">Two Hearts. One Beautiful Beginning.</h2>
          <Divider className="panel__divider" />
          <p className="story__deva" lang="sa">
            ॥ श्री सीता राम कल्याणम् ॥
          </p>
        </header>

        {/* Centerpiece Photo Card with Tree Parallax & Cinematic Animation */}
        <div className="story-solo-stage" role="region" aria-label="Couple photo frame" tabIndex={0}>
          <article className="story-frame-card story-frame-card--tree">
            <Corner className="card__corner card__corner--tl" />
            <Corner className="card__corner card__corner--tr" />
            <Corner className="card__corner card__corner--bl" />
            <Corner className="card__corner card__corner--br" />

            <div className="story-frame-card__img-wrap">
              <picture>
                <source type="image/webp" srcSet="/media/coupleImage.webp" />
                <img
                  src="/media/coupleImage.jpg"
                  alt={`${bride.name} & ${groom.name}`}
                  loading="eager"
                  className="story-frame-card__img story-frame-card__img--animated"
                  style={{
                    transform: `scale(${imgScale}) translate3d(0, ${imgTranslateY}px, 0)`,
                    willChange: 'transform',
                  }}
                />
              </picture>

              <div className="story-frame-card__overlay">
                <span className="story-frame-card__badge">Auspicious Union</span>
                <h3 className="story-frame-card__title">
                  {bride.name} <i aria-hidden="true">&amp;</i> {groom.name}
                </h3>
                <p className="story-frame-card__sub">
                  Bound by Love, Grace &amp; Eternal Blessings
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Interactive Sacred Akshata & Petal Shower Blessing */}
        <AkshataShower className="story-akshata-shower" />

        <div className="story-scroll-pill">
          <span className="story-scroll-pill__dot" />
          <span>✨ Scroll to explore Sacred Wedding Card ↓</span>
        </div>
      </div>
    </section>
  )
}
