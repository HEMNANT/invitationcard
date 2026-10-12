import config from '../config/wedding.config.js'
import { startOf } from './format.js'

const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const esc = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

function details(ev) {
  const { bride, groom } = config.couple
  const title = `${ev.title} — ${bride.name} & ${groom.name}`
  const location = [ev.venue, ev.address].filter(Boolean).join(', ')
  const body = [ev.note, 'With the blessings of our families.'].filter(Boolean).join('\n')
  const start = startOf(ev)
  const end = start ? new Date(start.getTime() + (ev.durationMinutes || 180) * 60000) : null
  return { title, location, body, start, end }
}

export const canAddToCalendar = (ev) => !!startOf(ev)

export function googleCalendarUrl(ev) {
  const { title, location, body, start, end } = details(ev)
  if (!start) return null
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: body,
    location,
  })
  return `https://calendar.google.com/calendar/render?${q.toString()}`
}

export function downloadIcs(ev) {
  const { title, location, body, start, end } = details(ev)
  if (!start) return false
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${ev.id}-${stamp(start)}@wedding-invitation`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(body)}`,
    `LOCATION:${esc(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${ev.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
  return true
}

export function directionsUrl(ev) {
  if (ev.mapsUrl) return ev.mapsUrl
  const query = [ev.venue, ev.address].filter(Boolean).join(', ')
  if (!query) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
