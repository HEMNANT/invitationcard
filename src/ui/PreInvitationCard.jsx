import { forwardRef } from 'react'
import config from '../config/wedding.config.js'
import { Corner, Divider } from './Ornaments.jsx'

/**
 * PreInvitationCard
 * Clean, royal, high-luxury wedding pre-card displayed before tapping to open.
 * Tapping starts the auspicious background music immediately and triggers
 * the 300-frame temple door opening animation.
 */
const PreInvitationCard = forwardRef(function PreInvitationCard({ onOpen, hidden }, ref) {
  const { bride, groom } = config.couple

  const handleClick = (e) => {
    e.stopPropagation()
    onOpen?.()
  }

  return (
    <div
      ref={ref}
      className={`precard-overlay ${hidden ? 'is-hidden' : ''}`}
      onClick={handleClick}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation of T. Harrika and T. Manoj"
    >
      <article className="precard">
        <Corner className="card__corner card__corner--tl" />
        <Corner className="card__corner card__corner--tr" />
        <Corner className="card__corner card__corner--bl" />
        <Corner className="card__corner card__corner--br" />

        <p className="precard__deva" lang="sa">
          ॥ श्री गणेशाय नमः ॥ · ॥ श्री सीता राम कल्याणम् ॥
        </p>

        <p className="precard__blessing">
          With the divine blessings of Sri Sita Rama &amp; our elders
        </p>

        <p className="precard__invite">
          Together with their families, cordially invite you to celebrate
        </p>

        <h1 className="precard__names">
          <span>{bride.name}</span>
          <i aria-hidden="true">&amp;</i>
          <span>{groom.name}</span>
        </h1>

        <Divider className="precard__divider" />

        <div className="precard__dates">
          <div className="precard__date-pill">
            <span className="pill-title">Haldi</span>
            <span className="pill-val">29 Oct 2026</span>
          </div>
          <div className="precard__date-pill precard__date-pill--main">
            <span className="pill-title">Muhurtham</span>
            <span className="pill-val">30 Oct 2026</span>
          </div>
          <div className="precard__date-pill">
            <span className="pill-title">Reception</span>
            <span className="pill-val">01 Nov 2026</span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn--gold precard__btn"
          onClick={handleClick}
          aria-label="Tap to Open Invitation and play music"
        >
          <span>✨ Tap to Open Invitation ✨</span>
        </button>

        <p className="precard__hint">
          🎵 Plays auspicious wedding music
        </p>
      </article>
    </div>
  )
})

export default PreInvitationCard
