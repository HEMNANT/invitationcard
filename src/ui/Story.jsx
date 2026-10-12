import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal.js'
import { Corner, Divider, Icon } from './Ornaments.jsx'

/**
 * Generate 2 anchor frames + 5 random frames from the 113 couple video frames.
 */
function generateStoryFrames() {
  const baseFrames = [
    { frame: 24, title: 'Two Hearts Meet', subtitle: 'A Golden Smile' },
    { frame: 72, title: 'Cherished Vows', subtitle: 'Hand in Hand' },
  ]

  // Pick 5 distinct random frames from the remaining 111 frames (range 8 to 110)
  const available = []
  for (let f = 8; f <= 110; f++) {
    if (f !== 24 && f !== 72) available.push(f)
  }

  // Shuffle and pick 5 distinct moments
  const shuffled = available.sort(() => 0.5 - Math.random()).slice(0, 5)
  const meta = [
    { title: 'Tender Glance', subtitle: 'A Glimpse of Eternity' },
    { title: 'Radiant Joy', subtitle: 'Laughter & Light' },
    { title: 'Divine Grace', subtitle: 'Blessings of Love' },
    { title: 'Pure Harmony', subtitle: 'Together in Bliss' },
    { title: 'Soulful Promise', subtitle: 'Two Hearts as One' },
  ]

  const randomFrames = shuffled.map((fNum, idx) => ({
    frame: fNum,
    title: meta[idx].title,
    subtitle: meta[idx].subtitle,
  }))

  // 2 anchor frames + 5 random frames = 7 moments total
  return [
    baseFrames[0],
    randomFrames[0],
    randomFrames[1],
    baseFrames[1],
    randomFrames[2],
    randomFrames[3],
    randomFrames[4],
  ]
}

export default function Story({ reduced }) {
  const frames = useMemo(() => generateStoryFrames(), [])
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef(null)
  useReveal(ref, '[data-reveal]', { reduced })

  const nextIndex = (index + 1) % frames.length

  const go = useCallback((delta) => {
    setIndex((prev) => (prev + delta + frames.length) % frames.length)
  }, [frames.length])

  // Continuous auto-scroll through the couple video frames
  useEffect(() => {
    if (reduced || isPaused) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [reduced, isPaused, frames.length])

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
    if (Math.abs(diff) > 35) {
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
          <span>{isPaused ? 'Auto-scroll Paused' : 'Auto-scrolling Couple Moments'}</span>
        </div>
      </header>

      {/* Two frames from the couple video side-by-side with auto-scroll */}
      <div
        className="story-duo-stage"
        role="region"
        aria-label="Two frames from couple video"
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
        {/* Frame 1 */}
        <article className="story-frame-card story-frame-card--primary">
          <Corner className="card__corner card__corner--tl" />
          <Corner className="card__corner card__corner--tr" />
          <Corner className="card__corner card__corner--bl" />
          <Corner className="card__corner card__corner--br" />
          <div className="story-frame-card__img-wrap">
            <img
              src={`/media/frames/f-${String(frames[index].frame).padStart(3, '0')}.jpg`}
              alt={`T. Harrika & T. Manoj - ${frames[index].title}`}
              loading="lazy"
              className="story-frame-card__img"
            />
            <div className="story-frame-card__overlay">
              <span className="story-frame-card__badge">Frame #{frames[index].frame}</span>
              <h3 className="story-frame-card__title">{frames[index].title}</h3>
              <p className="story-frame-card__sub">{frames[index].subtitle}</p>
            </div>
          </div>
        </article>

        {/* Frame 2 */}
        <article className="story-frame-card story-frame-card--secondary">
          <Corner className="card__corner card__corner--tl" />
          <Corner className="card__corner card__corner--tr" />
          <Corner className="card__corner card__corner--bl" />
          <Corner className="card__corner card__corner--br" />
          <div className="story-frame-card__img-wrap">
            <img
              src={`/media/frames/f-${String(frames[nextIndex].frame).padStart(3, '0')}.jpg`}
              alt={`T. Harrika & T. Manoj - ${frames[nextIndex].title}`}
              loading="lazy"
              className="story-frame-card__img"
            />
            <div className="story-frame-card__overlay">
              <span className="story-frame-card__badge">Frame #{frames[nextIndex].frame}</span>
              <h3 className="story-frame-card__title">{frames[nextIndex].title}</h3>
              <p className="story-frame-card__sub">{frames[nextIndex].subtitle}</p>
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
          <strong>{frames[index].title} &amp; {frames[nextIndex].title}</strong>
          <span>Moment {index + 1} of {frames.length}</span>
          <div className="dots" role="tablist" aria-label="Choose moment">
            {frames.map((it, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Moment ${i + 1} (Frame #${it.frame})`}
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
          aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
          title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
        >
          {isPaused ? <Icon.Play /> : <Icon.Pause />}
        </button>
      </div>
    </section>
  )
}
