import config from '../config/wedding.config.js'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const TIME = /^\d{1,2}:\d{2}$/

export const isValidDate = (d) => typeof d === 'string' && ISO_DATE.test(d) && !Number.isNaN(Date.parse(d))
export const isValidTime = (t) => typeof t === 'string' && TIME.test(t)

export function enabledEvents() {
  return config.events.filter((e) => e.enabled !== false)
}

export function mainEvent() {
  const list = enabledEvents()
  return list.find((e) => e.main) || list[0] || null
}

/** "2027-02-14" -> "Sunday, 14 February 2027" (no timezone shifting). */
export function formatDate(date, opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!isValidDate(date)) return null
  return new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
}

/** "09:30" -> "9:30 AM" */
export function formatTime(time) {
  if (!isValidTime(time)) return null
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

export function startOf(ev) {
  if (!ev || !isValidDate(ev.date)) return null
  const [h, m] = isValidTime(ev.time) ? ev.time.split(':').map(Number) : [9, 0]
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  const d = new Date(`${ev.date}T${hh}:${mm}:00${config.utcOffset}`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function shareUrl() {
  return config.meta.siteUrl || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '')
}

export const brideName = () => config.couple.bride.name
export const groomName = () => config.couple.groom.name
