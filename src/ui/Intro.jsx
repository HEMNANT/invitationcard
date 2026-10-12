import { forwardRef } from 'react'
import config from '../config/wedding.config.js'

/** Opening scene text. The doors, emblem, diya and petals are rendered behind it in 3D. */
const Intro = forwardRef(function Intro({ onOpen, loading, hidden }, ref) {
  const { bride, groom } = config.couple
  return (
    <section ref={ref} className="intro" aria-label="Wedding invitation" aria-hidden={hidden || undefined} hidden={hidden}>
      <div className="intro__top" data-intro>
        <p className="intro__deva" lang="sa">॥ श्री गणेशाय नमः ॥ · ॥ श्री सीता राम कल्याणम् ॥</p>
        <p className="intro__blessing">With the divine blessings of Sri Sita Rama &amp; our elders</p>
        <p className="intro__invite">You are cordially invited to celebrate the wedding union of</p>
      </div>

      <div className="intro__bottom" data-intro>
        <h1 className="intro__names">
          <span>{bride.name}</span>
          <i>&amp;</i>
          <span>{groom.name}</span>
        </h1>
        <button type="button" className="btn btn--gold" onClick={onOpen}>
          <span>Open Wedding Invitation</span>
        </button>
        {loading && <p className="intro__loading" role="status">Preparing the celebration…</p>}
      </div>
    </section>
  )
})

export default Intro
