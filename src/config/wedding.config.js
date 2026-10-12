/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING INVITATION — THE ONLY FILE THE FAMILY NEEDS TO EDIT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything shown on the invitation comes from here. Values in [square
 *  brackets] are placeholders: replace them. Nothing here is real couple data.
 *
 *  Media: put the couple's real files in /public/media and reference them as
 *  "/media/file.jpg". Until a `src` is provided, a clearly-labelled placeholder
 *  frame is shown instead (never a stock couple or generated face).
 *
 *  A media `src` can be a string or a responsive object: { sm, md, lg }.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const config = {
  meta: {
    title: 'Wedding Invitation',
    shareMessage: 'You are warmly invited to our wedding. Please open the invitation:',
    siteUrl: '', // leave empty to use the current page address
  },

  couple: {
    bride: { name: 'T. Harrika', parents: 'Sri & Smt. T. Venkateshwarlu' },
    groom: { name: 'T. Manoj', parents: 'Sri & Smt. T. Ramalingam' },
  },

  familyMessage:
    'With the divine blessings of Sri Sita Rama and our elders, we cordially request the honor of your gracious presence to bless the wedding union of our children.',

  /** UTC offset of the wedding venue's local time. India: "+05:30". */
  utcOffset: '+05:30',

  /**
   * Events. Set `enabled: false` to hide one. Exactly one event should have
   * `main: true` — it drives the hero date, the invitation card and the countdown.
   * date: "YYYY-MM-DD"   time: "HH:MM" (24h, venue local time)
   */
  events: [
    { id: 'engagement', enabled: false, title: 'Engagement', date: '', time: '', durationMinutes: 180, venue: '', address: '', mapsUrl: '', note: '' },
    { id: 'haldi', enabled: true, title: 'Haldi Ceremony', date: '2026-10-29', time: '10:00', durationMinutes: 180, venue: 'Sri Kalyana Vedika', address: 'Hyderabad', mapsUrl: '', note: 'Traditional yellow festive attire & Mangalasnanam' },
    { id: 'mehendi', enabled: false, title: 'Mehendi', date: '', time: '', durationMinutes: 180, venue: '', address: '', mapsUrl: '', note: '' },
    { id: 'muhurtham', enabled: true, main: true, title: 'Wedding Muhurtham', date: '2026-10-30', time: '09:15', durationMinutes: 240, venue: 'Sri Kalyana Mandapam', address: 'Hyderabad', mapsUrl: '', note: 'Sumuhurtham: The sacred wedding ceremony' },
    { id: 'reception', enabled: true, title: 'Grand Reception', date: '2026-11-01', time: '19:00', durationMinutes: 240, venue: 'Grand Imperial Convention', address: 'Hyderabad', mapsUrl: '', note: 'Join us for evening feast, music & blessings' },
  ],

  /**
   * RSVP.
   *  endpoint:        URL that accepts a JSON POST (see server/rsvp-server.mjs, or any form backend).
   *  whatsappNumber:  digits only with country code, e.g. "919XXXXXXXXX". Used as a fallback
   *                   when no endpoint is configured.
   * If neither is set the form says RSVP is not enabled — it never fakes a success.
   */
  rsvp: { endpoint: '', whatsappNumber: '919876543210', deadline: '2026-10-25' },

  /**
   * Music is OFF until the guest taps the speaker button.
   * Leave `src` empty to use the built-in soft generated drone, or point it at a
   * licensed audio file such as "/media/nadaswaram.mp3".
   */
  music: { src: '/media/backgroundSong.mp3', volume: 0.32, label: 'Mangala Vaidyam' },

  media: {
    /** Main centrepiece frame in the mandap: Sri Sita Rama Kalyanam. */
    hero: {
      type: 'image',
      src: '/media/rama-sita-wedding.png',
      aspect: 0.776,
      alt: 'Sacred Sita Rama Kalyanam Altar',
      caption: 'Divine Blessings of Sri Sita Rama',
    },

    /** Story gallery, in order. Add or remove items freely. */
    gallery: [
      {
        type: 'image',
        src: '/media/rama-sita-devotional.png',
        aspect: 0.667,
        alt: 'Divine blessings of Sri Sita Rama',
        caption: 'Divine Blessings · Sri Sita Rama',
      },
      {
        type: 'video',
        src: '/media/couple-animation.mp4',
        poster: '/media/couple-poster.jpg',
        aspect: 0.5625,
        alt: 'T. Harrika & T. Manoj Celebration',
        caption: 'Our Beautiful Journey Together',
      },
      {
        type: 'image',
        src: '/media/rama-sita-wedding.png',
        aspect: 0.776,
        alt: 'Sacred Sita Rama Kalyanam',
        caption: 'Sacred Sita Rama Kalyanam',
      },
      {
        type: 'image',
        src: '/media/couple-poster.jpg',
        aspect: 0.5625,
        alt: 'Haldi & Mangalasnanam Ceremony',
        caption: 'Haldi Celebration · Oct 29',
      },
      {
        type: 'image',
        src: '/media/rama-sita-devotional.png',
        aspect: 0.667,
        alt: 'Grand Reception & Blessings',
        caption: 'Reception & Eternal Blessings',
      },
    ],
  },
}

export default config
