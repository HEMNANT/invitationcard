import { useEffect, useRef, useState, useCallback } from 'react'
import { Corner, Divider, Icon } from './Ornaments.jsx'

/**
 * 6 selected couple moments from the collection:
 * ezgif-frame-004, ezgif-frame-011, ezgif-frame-020,
 * ezgif-frame-005, ezgif-frame-029, ezgif-frame-037
 */
const STORY_FRAMES = [
  { frame: 4, file: 'f-004.jpg', label: 'ezgif-frame-004', title: 'Joyful Radiance', subtitle: 'A Golden Smile' },
  { frame: 11, file: 'f-011.jpg', label: 'ezgif-frame-011', title: 'Tender Glance', subtitle: 'Two Hearts Meet' },
  { frame: 20, file: 'f-020.jpg', label: 'ezgif-frame-020', title: 'Hand in Hand', subtitle: 'A Sacred Promise' },
  { frame: 5, file: 'f-005.jpg', label: 'ezgif-frame-005', title: 'Golden Laughter', subtitle: 'Moments of Bliss' },
  { frame: 29, file: 'f-029.jpg', label: 'ezgif-frame-029', title: 'Soulful Harmony', subtitle: 'Walking Together' },
  { frame: 37, file: 'f-037.jpg', label: 'ezgif-frame-037', title: 'Eternal Beginning', subtitle: 'Bound by Love & Grace' },
]

export default function Story({ reduced }) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef(null)

  const current = STORY_FRAMES[index]

  // Preload all 6 frames for instant transitions
  useEffect(() => {
    STORY_FRAMES.forEach((item) => {
      const img = new Image()
      img.src = `/media/frames/${item.file}`
    })
  }, [])

  // Scroll-driven gallery: as guest scrolls through this section,
  // it cycles through all 6 photos before continuing down to the next section
  useEffect(() => {
    if (reduced) return

    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const totalScrollable = el.offsetHeight - window.innerHeight
      if (totalScrollable <= 0) return

      // Distance scrolled into the container
      const currentScroll = -rect.top
      if (currentScroll < 0) {
        setIndex(0)
        return
      }
      if (currentScroll >= totalScrollable) {
        setIndex(STORY_FRAMES.length - 1)
        return
      }

      const progress = Math.max(0, Math.min(0.999, currentScroll / totalScrollable))
      const targetIdx = Math.floor(progress * STORY_FRAMES.length)
      setIndex(targetIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduced])

  const go = useCallback((delta) => {
    setIndex((prev) => {
      const next = (prev + delta + STORY_FRAMES.length) % STORY_FRAMES.length
      // If manually clicking, optionally align scroll position
      const el = containerRef.current
      if (el) {
        const totalScrollable = el.offsetHeight - window.innerHeight
        if (totalScrollable > 0) {
          const targetY = el.offsetTop + (next / STORY_FRAMES.length) * totalScrollable
          window.scrollTo({ top: targetY, behavior: 'smooth' })
        }
      }
      return next
    })
  }, [])

  const selectPhoto = useCallback((idx) => {
    setIndex(idx)
    const el = containerRef.current
    if (el) {
      const totalScrollable = el.offsetHeight - window.innerHeight
      if (totalScrollable > 0) {
        const targetY = el.offsetTop + (idx / STORY_FRAMES.length) * totalScrollable
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    }
  }, [])

  const isLast = index === STORY_FRAMES.length - 1

  return (
    <section id="story" ref={containerRef} className="story-scroll-container" aria-label="Our Story">
      <div className="story-sticky-stage">
        <header className="story__head">
          <p className="eyebrow">Our Story</p>
          <h2 id="story-title">Two Hearts. One Beautiful Beginning.</h2>
          <Divider className="panel__divider" />
          <div className="story-scroll-pill">
            <span className="story-scroll-pill__dot" />
            <span>
              {isLast ? '✨ Keep scrolling for Sacred Wedding Card ↓' : `Scroll down to explore moments (${index + 1} of ${STORY_FRAMES.length}) ↓`}
            </span>
          </div>
        </header>

        {/* Centerpiece Photo Card */}
        <div className="story-solo-stage" role="region" aria-label="Couple photo frame" tabIndex={0}>
          <article className="story-frame-card story-frame-card--solo" key={current.frame}>
            <Corner className="card__corner card__corner--tl" />
            <Corner className="card__corner card__corner--tr" />
            <Corner className="card__corner card__corner--bl" />
            <Corner className="card__corner card__corner--br" />
            <div className="story-frame-card__img-wrap">
              <img
                src={`/media/frames/${current.file}`}
                alt={`T. Harrika & T. Manoj - ${current.title}`}
                loading="eager"
                className="story-frame-card__img story-frame-card__img--animated"
              />
              <div className="story-frame-card__overlay">
                <span className="story-frame-card__badge">{current.label}</span>
                <h3 className="story-frame-card__title">{current.title}</h3>
                <p className="story-frame-card__sub">{current.subtitle}</p>
              </div>
            </div>
          </article>
        </div>

        {/* Navigation & Dot Indicators */}
        <div className="story__controls">
          <button
            type="button"
            className="round"
            onClick={() => go(-1)}
            aria-label="Previous couple moment"
          >
            <Icon.Prev />
          </button>

          <div className="story__caption" aria-live="polite">
            <strong>{current.title}</strong>
            <span>Photo {index + 1} of {STORY_FRAMES.length}</span>
            <div className="dots" role="tablist" aria-label="Choose moment">
              {STORY_FRAMES.map((it, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Photo ${i + 1} (${it.label})`}
                  className={i === index ? 'on' : ''}
                  onClick={() => selectPhoto(i)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className="round"
            onClick={() => go(1)}
            aria-label="Next couple moment"
          >
            <Icon.Next />
          </button>
        </div>
      </div>
    </section>
  )
}
