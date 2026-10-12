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
    title: 'T. Haarika & B. Manoj Kumar · Wedding Invitation',
    shareMessage:
      'We cordially invite you to the wedding of T. Haarika & B. Manoj Kumar. Please open our digital invitation:',
    siteUrl: '', // leave empty to use the current page address
  },

  familyBanner: "Mekaboyina Family's Wedding Invitation",
  traditionalHeader: {
    left: 'Srimathu !',
    right: 'Subhamasthu !!',
  },

  couple: {
    bride: {
      name: 'T. Haarika',
      fullName: 'Chi. La. Sow. T. Haarika',
      degree: 'B.D.S.',
      relation: 'Eldest Daughter',
      parents: 'Smt. Lakshmi Devi & Sri T. Maddileti',
      address: 'H.No. 45/24-R-30-R-B, Srinagar Colony, KURNOOL.',
    },
    groom: {
      name: 'B. Manoj Kumar',
      fullName: 'Chi. B. Manoj Kumar',
      degree: 'B.Tech.',
      profession: 'Software Engineer',
      relation: 'Eldest Son',
      parents: 'Smt. B. Parimala & Sri B. Bhogesh',
      address: 'Guntakal, Ananthapur Dt.',
    },
  },

  familyMessage:
    'We solicit your gracious presence with family and friends on the auspicious occasion of the marriage of our eldest daughter',

  cordiallyInvitedBy: {
    parents: 'Smt. Lakshmi Devi, Sri T. Maddileti',
    address: 'H.No. 45/24-R-30-R-B, Srinagar Colony, KURNOOL.',
    phones: ['9332511111', '9052299991', '9703126351', '8309686719'],
    compliments: 'With best compliments from : Near & Dear.',
  },

  /** UTC offset of the wedding venue's local time. India: "+05:30". */
  utcOffset: '+05:30',

  /**
   * Events.
   * Exactly one event should have `main: true` — it drives the hero date, the invitation card and the countdown.
   * date: "YYYY-MM-DD"   time: "HH:MM" (24h, venue local time)
   */
  events: [
    {
      id: 'engagement',
      enabled: false,
      title: 'Engagement',
      teluguTitle: 'నిశ్చితార్థం',
      date: '',
      time: '',
      durationMinutes: 180,
      venue: '',
      address: '',
      mapsUrl: '',
      attire: '',
      note: '',
    },
    {
      id: 'haldi',
      enabled: false,
      title: 'Haldi Ceremony',
      teluguTitle: 'పసుపు వేడుక & మంగళస్నానం',
      date: '2026-10-29',
      time: '10:00',
      durationMinutes: 180,
      venue: 'Srinagar Colony Residence',
      address: 'Kurnool',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Srinagar+Colony+Kurnool',
      attire: 'Festive Yellow · Kurta & Traditional Pattu',
      note: 'Traditional yellow festive attire & Mangalasnanam',
    },
    {
      id: 'mehendi',
      enabled: false,
      title: 'Mehendi',
      teluguTitle: 'మెహందీ వేడుక',
      date: '',
      time: '',
      durationMinutes: 180,
      venue: '',
      address: '',
      mapsUrl: '',
      attire: '',
      note: '',
    },
    {
      id: 'muhurtham',
      enabled: true,
      main: true,
      title: 'Sumuhurtham',
      teluguTitle: 'కళ్యాణ సుముహూర్తం',
      date: '2026-10-30',
      time: '09:31',
      durationMinutes: 240,
      venue: 'Gayathri Function Hall',
      address: 'Alur Road, GUNTAKAL',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Gayathri+Function+Hall+Alur+Road+Guntakal',
      attire: 'Traditional Kanjeevaram Silk & Dhoti Kurta',
      note: 'Sumuhurtham: On Friday 30th October 2026 at 09:31 a.m.',
    },
    {
      id: 'reception',
      enabled: true,
      title: 'Grand Reception',
      teluguTitle: 'శుభ విందు & రిసెప్షన్',
      date: '2026-11-01',
      time: '11:45',
      durationMinutes: 240,
      venue: 'Imperial Convention',
      address: 'Near Maza Masjid, Sunkesula Road, KURNOOL',
      mapsUrl:
        'https://www.google.com/maps/search/?api=1&query=Imperial+Convention+Sunkesula+Road+Kurnool',
      attire: 'Royal Festive Silks & Grand Indo-Western',
      note: 'On Sunday 01-11-2026 at 11:45 a.m. onwards · Auspicious Lunch Feast',
    },
  ],

  /**
   * RSVP.
   */
  rsvp: {
    endpoint: '',
    whatsappNumber: '919332511111',
    deadline: '2026-10-25',
    contacts: [
      { name: 'Primary Cell / WhatsApp', phone: '9332511111' },
      { name: 'Sri T. Maddileti', phone: '9052299991' },
      { name: 'Family Contact', phone: '9703126351' },
      { name: 'Family Contact', phone: '8309686719' },
    ],
  },

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
        alt: 'T. Haarika & B. Manoj Celebration',
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
