import { useRef } from 'react'
import config from '../config/wedding.config.js'
import { formatDate, formatTime, mainEvent, enabledEvents } from '../lib/format.js'
import { directionsUrl } from '../lib/calendar.js'
import { useReveal } from '../hooks/useReveal.js'
import { Corner, Divider } from './Ornaments.jsx'

/** The ivory stationery card. Real HTML text over the 3D mount: crisp, selectable, accessible. */
export default function InvitationCard({ reduced }) {
  const ref = useRef(null)
  useReveal(ref, '[data-reveal]', { reduced })
  const { bride, groom } = config.couple
  const ev = mainEvent()
  const reception = enabledEvents().find((e) => e.id === 'reception' && e !== ev)
  const dir = ev && directionsUrl(ev)

  return (
    <section id="invitation" ref={ref} className="section invitation" data-section aria-labelledby="inv-title">
      <article className="card">
        <Corner className="card__corner card__corner--tl" />
        <Corner className="card__corner card__corner--tr" />
        <Corner className="card__corner card__corner--bl" />
        <Corner className="card__corner card__corner--br" />

        <p className="card__deva" lang="sa" data-reveal>॥ श्री गणेशाय नमः ॥ · ॥ श्री सीता राम कल्याणम् ॥</p>
        <p className="card__small" data-reveal>With the divine blessings of Sri Sita Rama &amp; our elders</p>

        <p className="card__family" data-reveal>{config.familyMessage}</p>

        <div className="card__parents" data-reveal>
          <div>
            <p className="label">Daughter of</p>
            <p>{bride.parents}</p>
          </div>
          <div>
            <p className="label">Son of</p>
            <p>{groom.parents}</p>
          </div>
        </div>

        <h2 id="inv-title" className="card__names" data-reveal>
          <span>{bride.name}</span>
          <i aria-hidden="true">&amp;</i>
          <span className="sr-only"> and </span>
          <span>{groom.name}</span>
        </h2>
        <Divider className="card__divider" />

        <dl className="card__facts" data-reveal>
          <div>
            <dt>Date</dt>
            <dd>{(ev && formatDate(ev.date)) || '[Wedding date]'}</dd>
          </div>
          <div>
            <dt>Muhurtham</dt>
            <dd>{(ev && formatTime(ev.time)) || '[Muhurtham time]'}</dd>
          </div>
          <div>
            <dt>Venue</dt>
            <dd>
              <strong>{(ev && ev.venue) || '[Venue name]'}</strong>
              <br />
              {(ev && ev.address) || '[Full venue address]'}
            </dd>
          </div>
          {reception && (
            <div>
              <dt>Reception</dt>
              <dd>
                {[formatDate(reception.date), formatTime(reception.time)].filter(Boolean).join(' · ') || '[Reception date & time]'}
                {reception.venue && (
                  <>
                    <br />
                    {reception.venue}
                  </>
                )}
              </dd>
            </div>
          )}
        </dl>

        {dir && (
          <a className="btn btn--maroon" href={dir} target="_blank" rel="noopener noreferrer" data-reveal>
            Get Directions
          </a>
        )}
        <p className="card__small card__small--end" data-reveal>Your presence will make our celebration complete.</p>
      </article>
    </section>
  )
}
