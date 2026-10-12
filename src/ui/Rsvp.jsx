import { useRef, useState } from 'react'
import config from '../config/wedding.config.js'
import { shareUrl } from '../lib/format.js'
import { useReveal } from '../hooks/useReveal.js'
import { Divider } from './Ornaments.jsx'

const digits = (s) => String(s || '').replace(/\D/g, '')

export default function Rsvp({ reduced }) {
  const ref = useRef(null)
  useReveal(ref, '[data-reveal]', { reduced })
  const { endpoint, whatsappNumber, deadline } = config.rsvp
  const hasEndpoint = !!endpoint
  const wa = digits(whatsappNumber)

  const [form, setForm] = useState({ name: '', attending: 'yes', guests: 1, message: '' })
  const [status, setStatus] = useState({ state: 'idle', text: '' })
  const [copied, setCopied] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const summary = () =>
    `RSVP for ${config.couple.bride.name} & ${config.couple.groom.name}\nName: ${form.name}\n` +
    `${form.attending === 'yes' ? `Attending with ${form.guests} guest(s)` : 'Unable to attend'}` +
    (form.message ? `\nMessage: ${form.message}` : '')

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setStatus({ state: 'error', text: 'Please enter your name.' })
      return
    }
    if (!hasEndpoint) {
      if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(summary())}`, '_blank', 'noopener');
      return
    }
    setStatus({ state: 'sending', text: 'Sending your reply…' })
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), 15000)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, guests: Number(form.guests) || 1, sentAt: new Date().toISOString() }),
        signal: ctl.signal,
      })
      if (!res.ok) throw new Error(`Server replied ${res.status}`)
      setStatus({ state: 'success', text: 'Thank you! Your reply has been received.' })
      setForm({ name: '', attending: 'yes', guests: 1, message: '' })
    } catch (err) {
      const why = err.name === 'AbortError' ? 'The request timed out.' : 'We could not send your reply.'
      setStatus({ state: 'error', text: `${why} Please check your connection and try again.` })
    } finally {
      clearTimeout(timer)
    }
  }

  const text = `${config.meta.shareMessage} ${shareUrl()}`
  const share = () => window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      setCopied('Link copied')
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = shareUrl()
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        ta.remove()
        setCopied(ok ? 'Link copied' : 'Press and hold the address bar to copy')
      } catch {
        setCopied('Press and hold the address bar to copy')
      }
    }
    setTimeout(() => setCopied(null), 2500)
  }

  const disabled = status.state === 'sending' || (!hasEndpoint && !wa)

  return (
    <section id="rsvp" ref={ref} className="section rsvp" data-section aria-labelledby="rsvp-title">
      <div className="panel panel--narrow">
        <p className="eyebrow" data-reveal>Kindly Reply</p>
        <h2 id="rsvp-title" data-reveal>Will You Join Us?</h2>
        <Divider className="panel__divider" />
        {deadline && <p className="muted" data-reveal>Please reply by {deadline}.</p>}

        <form className="form" onSubmit={submit} noValidate data-reveal>
          <label>
            <span>Your name</span>
            <input value={form.name} onChange={set('name')} autoComplete="name" required maxLength={80} />
          </label>
          <fieldset>
            <legend>Will you attend?</legend>
            <label className="choice"><input type="radio" name="att" checked={form.attending === 'yes'} onChange={() => setForm((f) => ({ ...f, attending: 'yes' }))} /><span>Joyfully accept</span></label>
            <label className="choice"><input type="radio" name="att" checked={form.attending === 'no'} onChange={() => setForm((f) => ({ ...f, attending: 'no' }))} /><span>Regretfully decline</span></label>
          </fieldset>
          {form.attending === 'yes' && (
            <label>
              <span>Number of guests (including you)</span>
              <input type="number" inputMode="numeric" min="1" max="20" value={form.guests} onChange={set('guests')} />
            </label>
          )}
          <label>
            <span>Blessings or a message (optional)</span>
            <textarea rows="3" value={form.message} onChange={set('message')} maxLength={500} />
          </label>

          <button type="submit" className="btn btn--gold" disabled={disabled}>
            {status.state === 'sending' ? 'Sending…' : hasEndpoint ? 'Send RSVP' : wa ? 'Send RSVP on WhatsApp' : 'RSVP not enabled yet'}
          </button>
          {!hasEndpoint && !wa && (
            <p className="muted" role="status">Online RSVP hasn’t been switched on yet. Please contact the family directly.</p>
          )}
          {status.text && (
            <p className={`status status--${status.state}`} role={status.state === 'error' ? 'alert' : 'status'}>{status.text}</p>
          )}
        </form>

        <div className="rsvp-contact-box" data-reveal>
          <p className="rsvp-contact-title">Direct Family Contacts · Kurnool</p>
          <p className="rsvp-contact-host">Smt. Lakshmi Devi &amp; Sri T. Maddileti</p>
          <div className="rsvp-phone-pills">
            <a href="tel:9332511111" className="phone-pill phone-pill--primary">
              <span>📞 +91 93325 11111</span>
            </a>
            <a href="tel:9052299991" className="phone-pill">
              <span>📞 9052299991</span>
            </a>
            <a href="tel:9703126351" className="phone-pill">
              <span>📞 9703126351</span>
            </a>
          </div>
        </div>

        <div className="share" data-reveal>
          <p className="eyebrow">Share the invitation</p>
          <div className="share__row">
            <button type="button" className="btn btn--ghost" onClick={share}>Share on WhatsApp</button>
            <button type="button" className="btn btn--ghost" onClick={copy}>Copy Invitation Link</button>
          </div>
          <p className="muted" role="status" aria-live="polite">{copied || ' '}</p>
        </div>

        <p className="footer" data-reveal>
          With best compliments from Near &amp; Dear · {config.couple.bride.name} &amp; {config.couple.groom.name}
        </p>
      </div>
    </section>
  )
}
