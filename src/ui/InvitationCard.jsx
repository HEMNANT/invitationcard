import { useRef } from 'react'
import config from '../config/wedding.config.js'
import { mainEvent, enabledEvents } from '../lib/format.js'
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
  const receptionDir = reception && directionsUrl(reception)

  return (
    <section id="invitation" ref={ref} className="section invitation" data-section aria-labelledby="inv-title">
      <article className="card">
        <Corner className="card__corner card__corner--tl" />
        <Corner className="card__corner card__corner--tr" />
        <Corner className="card__corner card__corner--bl" />
        <Corner className="card__corner card__corner--br" />

        <div className="card__top-blessing" data-reveal>
          <span className="blessing-mantra">Srimathu !</span>
          <p className="card__deva" lang="sa">॥ శ్రీ సీతారామ కళ్యాణ వైభోగమే ॥</p>
          <span className="blessing-mantra">Subhamasthu !!</span>
        </div>

        <h3 className="card__family-banner" data-reveal>
          {config.familyBanner || "Mekaboyina Family's Wedding Invitation"}
        </h3>

        <p className="card__family" data-reveal>{config.familyMessage}</p>

        <div className="card__couple-block" data-reveal>
          <div className="card__party card__party--bride">
            <span className="party-salutation">Chi. La. Sow.</span>
            <h2 id="inv-title" className="party-name">
              {bride.name} <span className="party-degree">{bride.degree}</span>
            </h2>
            <p className="party-details">Eldest Daughter of {bride.parents}</p>
          </div>

          <div className="card__with-connector">
            <span>with</span>
          </div>

          <div className="card__party card__party--groom">
            <span className="party-salutation">Chi.</span>
            <h2 className="party-name">
              {groom.name} <span className="party-degree">{groom.degree}</span>
            </h2>
            <p className="party-profession">{groom.profession}</p>
            <p className="party-details">[Eldest S/o. {groom.parents}, {groom.address}]</p>
          </div>
        </div>

        <Divider className="card__divider" />

        <dl className="card__facts" data-reveal>
          <div className="fact-item fact-item--main">
            <dt>Sumuhurtham</dt>
            <dd>
              <strong>On Friday 30th October 2026 at 09:31 a.m.</strong>
            </dd>
          </div>
          <div className="fact-item fact-item--venue">
            <dt>Venue</dt>
            <dd>
              <strong>Gayathri Function Hall</strong>
              <br />
              Alur Road, GUNTAKAL.
            </dd>
          </div>
          {reception && (
            <div className="fact-item fact-item--reception">
              <dt>Reception</dt>
              <dd>
                <strong>On Sunday 01-11-2026 at 11:45 a.m. onwards</strong>
                <br />
                at <strong>Imperial Convention</strong>,
                <br />
                Near Maza Masjid, Sunkesula Road, KURNOOL.
              </dd>
            </div>
          )}
        </dl>

        <div className="card__actions" data-reveal>
          {dir && (
            <a className="btn btn--gold btn--small" href={dir} target="_blank" rel="noopener noreferrer">
              🗺️ Muhurtham Venue (Guntakal)
            </a>
          )}
          {receptionDir && (
            <a className="btn btn--ghost btn--small" href={receptionDir} target="_blank" rel="noopener noreferrer">
              🗺️ Reception Venue (Kurnool)
            </a>
          )}
        </div>

        <div className="card__invited-by" data-reveal>
          <p className="invited-by__title">Cordially Invited by :</p>
          <p className="invited-by__names"><strong>Smt. Lakshmi Devi, Sri T. Maddileti</strong></p>
          <p className="invited-by__address">H.No. 45/24-R-30-R-B, Srinagar Colony, KURNOOL.</p>
          <p className="invited-by__phones">
            <span>Cell: </span>
            <a href="tel:9332511111">+91 93325 11111</a>,{' '}
            <a href="tel:9052299991">9052299991</a>,{' '}
            <a href="tel:9703126351">9703126351</a>
          </p>
          <p className="card__small card__small--compliments">With best compliments from : Near &amp; Dear.</p>
        </div>
      </article>
    </section>
  )
}
