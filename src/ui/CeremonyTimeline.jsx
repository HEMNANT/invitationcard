import { useRef } from 'react'
import { enabledEvents, formatDate, formatTime, isValidDate } from '../lib/format.js'
import { canAddToCalendar, directionsUrl, downloadIcs, googleCalendarUrl } from '../lib/calendar.js'
import { useReveal } from '../hooks/useReveal.js'
import { Diya, Divider, Lotus } from './Ornaments.jsx'
import WeddingCountdown from './WeddingCountdown.jsx'

function EventCard({ ev }) {
  const date = formatDate(ev.date)
  const time = formatTime(ev.time)
  const dir = directionsUrl(ev)
  const calendar = canAddToCalendar(ev)
  const gcal = calendar ? googleCalendarUrl(ev) : null

  const isHaldi = ev.id === 'haldi'
  const isMuhurtham = ev.id === 'muhurtham' || ev.main
  const isReception = ev.id === 'reception'

  const ceremonyBadge = isHaldi
    ? 'Haldi & Mangalasnanam'
    : isMuhurtham
    ? 'Sumuhurtham · Sacred Wedding'
    : isReception
    ? 'Grand Reception & Feast'
    : 'Auspicious Ceremony'

  const eventModifier = isHaldi
    ? 'event--haldi'
    : isMuhurtham
    ? 'event--main event--muhurtham'
    : isReception
    ? 'event--reception'
    : ''

  return (
    <li className={`event ${eventModifier}`} data-reveal data-ceremony={ev.id}>
      <span className="event__dot" aria-hidden="true">{isMuhurtham ? <Diya /> : <Lotus />}</span>
      <div className="event__body">
        <div className="event__header-row">
          <span className="event__badge">{ceremonyBadge}</span>
          {ev.teluguTitle && <span className="event__telugu-badge">{ev.teluguTitle}</span>}
        </div>
        <h3>{ev.title}</h3>
        <p className="event__when">
          <span>{date || '[Date]'}</span>
          <span>{time || '[Time]'}</span>
        </p>
        <p className="event__where">
          <strong>{ev.venue || '[Venue]'}</strong>
          {ev.address ? <><br />{ev.address}</> : null}
        </p>
        {ev.attire && (
          <div className="event__attire">
            <span className="attire-pill">
              <span className="attire-icon">🥻</span>
              <strong className="attire-label">Attire Guide:</strong> {ev.attire}
            </span>
          </div>
        )}
        {ev.note && <p className="event__note">{ev.note}</p>}
        <div className="event__actions">
          {(ev.mapsUrl || dir) ? (
            <a className="btn btn--small btn--gold" href={ev.mapsUrl || dir} target="_blank" rel="noopener noreferrer">
              <span>🗺️ Venue Directions</span>
            </a>
          ) : (
            <button type="button" className="btn btn--small" disabled title="Venue not set yet">Directions</button>
          )}
          {gcal && (
            <a className="btn btn--small btn--ghost" href={gcal} target="_blank" rel="noopener noreferrer">
              <span>📅 Google Calendar</span>
            </a>
          )}
          {calendar && (
            <button type="button" className="btn btn--small btn--ghost" onClick={() => downloadIcs(ev)}>
              <span>🍏 Apple Calendar</span>
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default function CeremonyTimeline({ reduced }) {
  const ref = useRef(null)
  useReveal(ref, '[data-reveal]', { reduced })
  // dated events chronologically; undated stay in configured order after the dated ones
  const events = enabledEvents()
    .map((e, i) => ({ e, i }))
    .sort((a, b) => {
      const ad = isValidDate(a.e.date)
      const bd = isValidDate(b.e.date)
      if (ad && bd) return a.e.date.localeCompare(b.e.date) || a.i - b.i
      if (ad !== bd) return ad ? -1 : 1
      return a.i - b.i
    })
    .map((x) => x.e)

  return (
    <section id="ceremonies" ref={ref} className="section ceremonies" data-section aria-labelledby="cer-title">
      <div className="panel">
        <p className="eyebrow" data-reveal>The Celebrations</p>
        <h2 id="cer-title" data-reveal>Join Us In Every Ceremony</h2>
        <Divider className="panel__divider" />
        <div data-reveal><WeddingCountdown /></div>
        <div className="timeline-flow-header" data-reveal>
          <span className="flow-down-indicator">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span>Downflowing Auspicious Timeline · Oct 29 – Nov 01</span>
          </span>
        </div>
        <ol className="timeline">
          <div className="timeline__flow-line" aria-hidden="true">
            <div className="timeline__flow-pulse" />
          </div>
          {events.map((ev) => <EventCard key={ev.id} ev={ev} />)}
        </ol>
      </div>
    </section>
  )
}
