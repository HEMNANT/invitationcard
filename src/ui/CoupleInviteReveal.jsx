import { useEffect, useRef, useState, useCallback } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import config from '../config/wedding.config.js'
import { formatDate } from '../lib/format.js'
import { Divider } from './Ornaments.jsx'

/**
 * CoupleInviteReveal
 * Grand finale personal wedding invitation featuring T. Haarika & B. Manoj (coupleImage).
 * As the guest scrolls into view, an elegant half-gradient covers strictly the bottom half (50%)
 * revealing: "We Are Cordially Inviting You!" with wedding dates and WhatsApp wishes.
 */
export default function CoupleInviteReveal({ reduced }) {
  const containerRef = useRef(null)
  const overlayRef = useRef(null)
  const [showInviteText, setShowInviteText] = useState(false)

  const { bride, groom } = config.couple
  const events = config.events.filter((e) => e.enabled)

  // Scroll-driven trigger to reveal bottom 50% invitation card
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (reduced) {
      setShowInviteText(true)
      if (overlayRef.current) overlayRef.current.classList.add('is-visible')
      return
    }

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      end: 'bottom 40%',
      onEnter: () => {
        setShowInviteText(true)
        if (overlayRef.current) overlayRef.current.classList.add('is-visible')
      },
      onLeaveBack: () => {
        setShowInviteText(false)
        if (overlayRef.current) overlayRef.current.classList.remove('is-visible')
      },
    })

    return () => {
      st.kill()
    }
  }, [reduced])

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

        {/* Real Couple Portrait Card */}
        <div className="couple-frame-box">
          <picture>
            <source type="image/webp" srcSet="/media/coupleImage.webp" />
            <img
              src="/media/coupleImage.jpg"
              alt={`${bride.name} & ${groom.name}`}
              className="couple-frame__img"
              loading="lazy"
            />
          </picture>

          {/* STRICTLY HALF GRADIENT OVERLAY (Bottom 50% only) */}
          <div
            ref={overlayRef}
            className={`couple-frame__half-gradient ${showInviteText ? 'is-visible' : ''}`}
          >
            <div className="couple-frame__content">
              <p className="couple-frame__deva" lang="sa">
                ॥ శ్రీ సీతారామ కళ్యాణ వైభోగమే ॥
              </p>
              <p className="couple-frame__eyebrow">Mekaboyina Family Solicits Your Presence</p>
              <h3 className="couple-frame__invite-text">We Are Cordially Inviting You!</h3>
              <p className="couple-frame__names">
                <span>{bride.name}</span>
                <i className="couple-frame__amp">&amp;</i>
                <span>{groom.name}</span>
              </p>

              {/* Ceremony dates */}
              <div className="couple-frame__dates">
                {events.map((ev) => (
                  <div key={ev.id} className="couple-frame__date-badge">
                    <span className="badge-title">{ev.title}</span>
                    <span className="badge-val">
                      {formatDate(ev.date, { weekday: 'short', day: 'numeric', month: 'short' })}
                      {ev.time ? ` · ${ev.time}` : ''}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick WhatsApp Wishes Preset Picker */}
              <div className="couple-frame__wishes-picker">
                <p className="wishes-picker__label">✨ Tap a blessing to send on WhatsApp:</p>
                <div className="wishes-picker__pills">
                  <a
                    href={`https://wa.me/${config.rsvp.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
                      `🪔 Sita Rama Kalyanam Vaibhogame! Heartiest congratulations to ${bride.name} & ${groom.name} on your wedding!`
                    )}`}
                    className="wish-pill"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>🪔 Sita Rama Kalyanam Vaibhogame!</span>
                  </a>
                  <a
                    href={`https://wa.me/${config.rsvp.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
                      `💖 Wishing a lifetime of love, joy and prosperity to ${bride.name} & ${groom.name}!`
                    )}`}
                    className="wish-pill"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>💖 Wishing you eternal joy &amp; love!</span>
                  </a>
                </div>
              </div>

              <div className="couple-frame__actions">
                <a
                  href={`https://wa.me/${config.rsvp.whatsappNumber || '919876543210'}?text=${encodeURIComponent(
                    `Warmest congratulations and best wishes to ${bride.name} & ${groom.name} on your wedding celebration!`
                  )}`}
                  className="btn btn--gold btn--small"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>💬 Custom Message on WhatsApp</span>
                </a>
                <a href="#ceremonies" className="btn btn--ghost btn--small">
                  <span>🗺️ Ceremony Details &amp; Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
