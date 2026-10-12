import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import config from '../config/wedding.config.js'
import { formatDate } from '../lib/format.js'
import { Divider } from './Ornaments.jsx'

const TOTAL_FRAMES = 113

/**
 * CoupleInviteReveal
 * Renders the 113 animation frames of T. Harrika & T. Manoj.
 * Frames progress ONLY when the user scrolls.
 * At the last frame, an elegant half-gradient covers strictly the bottom half (50%)
 * with the invitation message: "We Are Cordially Inviting You!"
 */
export default function CoupleInviteReveal({ reduced }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)
  const barRef = useRef(null)
  const imagesRef = useRef([])
  const currentFrameRef = useRef(1)
  const lastDrawnIndexRef = useRef(-1)
  const isRevealedRef = useRef(false)
  const [showInviteText, setShowInviteText] = useState(false)

  const { bride, groom } = config.couple
  const events = config.events.filter((e) => e.enabled)

  // Draw frame on canvas with maximum crispness and zero flicker
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = imagesRef.current[frameIdx - 1]

    // If target frame is not loaded yet, do not clear the canvas to prevent blank flashes
    if (!img || !img.complete || img.naturalWidth === 0) return

    const cw = canvas.width
    const ch = canvas.height
    if (cw === 0 || ch === 0) return

    ctx.clearRect(0, 0, cw, ch)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Cover fit
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const sw = iw * scale
    const sh = ih * scale
    const sx = (cw - sw) / 2
    const sy = (ch - sh) / 2

    ctx.drawImage(img, sx, sy, sw, sh)
    lastDrawnIndexRef.current = frameIdx
  }, [])

  // Preload and pre-decode all 113 high-quality frames into memory
  useEffect(() => {
    let active = true
    const imgs = []

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      const num = String(i).padStart(3, '0')
      img.src = `/media/frames/f-${num}.jpg`

      if (img.decode) {
        img.decode().then(() => {
          if (!active) return
          if (i === currentFrameRef.current) {
            drawFrame(i)
          }
        }).catch(() => {
          // If decode promise fails, fallback to onload
        })
      } else {
        img.onload = () => {
          if (!active) return
          if (i === currentFrameRef.current) {
            drawFrame(i)
          }
        }
      }
      imgs.push(img)
    }
    imagesRef.current = imgs

    return () => {
      active = false
    }
  }, [drawFrame])

  // Canvas high-DPI sizing on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || 360
      const h = rect.height || 640
      const nw = Math.round(w * dpr)
      const nh = Math.round(h * dpr)
      if (canvas.width !== nw || canvas.height !== nh) {
        canvas.width = nw
        canvas.height = nh
      }
      drawFrame(currentFrameRef.current)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [drawFrame])

  // Scrub frame directly without triggering React re-renders on every scroll tick
  const goToFrame = useCallback((frameNum) => {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameNum)))
    if (clamped === lastDrawnIndexRef.current) return
    currentFrameRef.current = clamped
    drawFrame(clamped)

    if (barRef.current) {
      barRef.current.style.width = `${(clamped / TOTAL_FRAMES) * 100}%`
    }
  }, [drawFrame])

  // Hysteresis latching: prevents flickering and repetition at the bottom of the scroll
  const updateOverlay = useCallback((progress, frame) => {
    const isEnd = progress >= 0.91 || frame >= 110
    const isFarUp = progress < 0.80 && frame < 105

    if (isEnd && !isRevealedRef.current) {
      isRevealedRef.current = true
      setShowInviteText(true)
      if (overlayRef.current) overlayRef.current.classList.add('is-visible')
    } else if (isFarUp && isRevealedRef.current) {
      isRevealedRef.current = false
      setShowInviteText(false)
      if (overlayRef.current) overlayRef.current.classList.remove('is-visible')
    }
  }, [])

  // ScrollTrigger: strictly scroll-driven, pinned in view
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (reduced) {
      goToFrame(TOTAL_FRAMES)
      isRevealedRef.current = true
      setShowInviteText(true)
      if (overlayRef.current) overlayRef.current.classList.add('is-visible')
      return
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=180%',
      pin: true,
      anticipatePin: 1,
      scrub: 0.1,
      fastScrollEnd: true,
      preventOverlaps: true,
      onUpdate: (self) => {
        // Clamp strictly to last frame at the end of progress to eliminate jitter
        let frame
        if (self.progress >= 0.98) {
          frame = TOTAL_FRAMES
        } else {
          frame = Math.round(1 + self.progress * (TOTAL_FRAMES - 1))
        }
        goToFrame(frame)
        updateOverlay(self.progress, frame)
      },
    })

    goToFrame(1)

    return () => {
      st.kill()
    }
  }, [goToFrame, updateOverlay, reduced])

  return (
    <section
      id="couple-invite"
      ref={containerRef}
      className="section couple-reveal-section"
      data-section
      aria-labelledby="invite-reveal-heading"
    >
      <div className="couple-reveal-wrap">
        <header className="couple-reveal__head">
          <p className="eyebrow">A Special Personal Invitation</p>
          <h2 id="invite-reveal-heading" className="couple-reveal__title">
            Step Into Our Celebration
          </h2>
          <Divider className="panel__divider" />
        </header>

        {/* 113-Frame Portrait Frame - strictly scroll-scrubbed */}
        <div className="couple-frame-box">
          <canvas
            ref={canvasRef}
            className="couple-frame__canvas"
            aria-label="Animation of T. Harrika and T. Manoj inviting guests"
          />

          <noscript>
            <img
              src="/media/frames/f-113.jpg"
              alt="T. Harrika & T. Manoj"
              className="couple-frame__fallback"
            />
          </noscript>

          {/* STRICTLY HALF GRADIENT OVERLAY (Bottom 50% only) */}
          <div
            ref={overlayRef}
            className={`couple-frame__half-gradient ${showInviteText ? 'is-visible' : ''}`}
          >
            <div className="couple-frame__content">
              <p className="couple-frame__deva" lang="sa">
                ॥ श्री सीता राम कल्याणम् ॥
              </p>
              <p className="couple-frame__eyebrow">Together With Our Families</p>
              <h3 className="couple-frame__invite-text">We Are Cordially Inviting You!</h3>
              <p className="couple-frame__names">
                <span>{bride.name}</span>
                <i>&amp;</i>
                <span>{groom.name}</span>
              </p>

              {/* Ceremony dates */}
              <div className="couple-frame__dates">
                {events.map((ev) => (
                  <div key={ev.id} className="couple-frame__date-badge">
                    <span className="badge-title">{ev.title}</span>
                    <span className="badge-val">{formatDate(ev.date)}</span>
                  </div>
                ))}
              </div>

              <div className="couple-frame__actions">
                <a
                  href={`https://wa.me/${config.rsvp.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
                    'Warmest congratulations and best wishes to T. Harrika & T. Manoj on your wedding celebration!'
                  )}`}
                  className="btn btn--gold btn--small"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Send Wishes on WhatsApp</span>
                </a>
                <a href="#ceremonies" className="btn btn--ghost btn--small">
                  <span>Ceremony Details</span>
                </a>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="couple-frame__bar" aria-hidden="true">
            <div
              ref={barRef}
              className="couple-frame__bar-fill"
              style={{ width: '1%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
