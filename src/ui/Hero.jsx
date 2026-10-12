import { useRef } from 'react'
import config from '../config/wedding.config.js'
import { formatDate, formatTime, mainEvent } from '../lib/format.js'
import { Divider } from './Ornaments.jsx'

export default function Hero({ reduced, contentVisible }) {
  const ref = useRef(null)
  const { bride, groom } = config.couple
  const ev = mainEvent()
  const date = ev && formatDate(ev.date)
  const time = ev && formatTime(ev.time)

  const handleCueClick = (e) => {
    e.preventDefault()
    const target = document.getElementById('story')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isVisible = contentVisible || reduced

  return (
    <section id="hero" ref={ref} className="section hero" data-section aria-label="Welcome">
      <div className={`hero__text ${isVisible ? 'is-visible' : 'is-hidden'}`}>
        <p className="hero__deva" lang="sa">
          ॥ श्री गणेशाय नमः ॥ · ॥ శ్రీ సీతారామ కళ్యాణ వైభోగమే ॥
        </p>
        <p className="eyebrow">Mekaboyina Family Solicits Your Gracious Presence</p>
        <h2 className="hero__names">
          <span>{bride.name}</span>
          <i aria-hidden="true">&amp;</i>
          <span className="sr-only"> and </span>
          <span>{groom.name}</span>
        </h2>
        <Divider className="hero__divider" />
        <p className="hero__date">{date || '[Wedding date]'}</p>
        {time && <p className="hero__time">Muhurtham · {time}</p>}
        <button
          type="button"
          className="scroll-cue"
          onClick={handleCueClick}
          aria-label="Scroll to begin invitation story"
        >
          <span>Scroll to begin our story</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </section>
  )
}
