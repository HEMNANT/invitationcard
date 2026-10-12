import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal.js'
import { Corner, Divider, Icon } from './Ornaments.jsx'

/**
 * 6 requested couple frames from the collection:
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
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef(null)
  useReveal(ref, '[data-reveal]', { reduced })

  const current = STORY_FRAMES[index]

  // Preload all 6 frames for instant, buttery transitions
  useEffect(() => {
    STORY_FRAMES.forEach((item) => {
      const img = new Image()
      img.src = `/media/frames/${item.file}`
    })
  }, [])

  const go = useCallback((delta) => {
    setIndex((prev) => (prev + delta + STORY_FRAMES.length) % STORY_FRAMES.length)
  }, [])

  // Fast & smooth auto-slide through the 6 frames (1.8s interval)
  useEffect(() => {
    if (reduced || isPaused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % STORY_FRAMES.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [reduced, isPaused])

  // Swipe / Drag handling
  const drag = useRef(null)
  const onDown = (e) => {
    setIsPaused(true)
    drag.current = { x: e.clientX || (e.touches && e.touches[0].clientX) || 0 }
  }
  const onUp = (e) => {
    setIsPaused(false)
    if (!drag.current) return
    const endX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0
    const diff = endX - drag.current.x
    drag.current = null
    if (Math.abs(diff) > 30) {
      go(diff < 0 ? 1 : -1)
    }
  }

  return (
    <section id="story" ref={ref} className="section story" data-section aria-labelledby="story-title">
      <header className="story__head">
        <p className="eyebrow" data-reveal>Our Story</p>
        <h2 id="story-title" data-reveal>Two Hearts. One Beautiful Beginning.</h2>
        <Divider className="panel__divider" />
        <div className="story-autoscroll-pill" data-reveal>
          <span className="story-autoscroll-dot" />
          <span>{isPaused ? 'Auto-slide Paused' : 'Auto-sliding Moments'}</span>
        </div>
      </header>

      {/* Single centerpiece frame (wider & fatter aspect ratio) */}
      <div
        className="story-solo-stage"
        role="region"
        aria-label="Couple moment frame"
        tabIndex={0}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => {
          drag.current = null
          setIsPaused(false)
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
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

      {/* Controls & Dots */}
      <div className="story__controls" data-reveal>
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
          <span>Moment {index + 1} of {STORY_FRAMES.length}</span>
          <div className="dots" role="tablist" aria-label="Choose moment">
            {STORY_FRAMES.map((it, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Moment ${i + 1} (${it.label})`}
                className={i === index ? 'on' : ''}
                onClick={() => setIndex(i)}
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

        <button
          type="button"
          className="round round--solid"
          onClick={() => setIsPaused((p) => !p)}
          aria-pressed={isPaused}
          aria-label={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
          title={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
        >
          {isPaused ? <Icon.Play /> : <Icon.Pause />}
        </button>
      </div>
    </section>
  )
}
