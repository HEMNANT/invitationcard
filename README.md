# 3D Hindu Wedding Invitation

A mobile-first, cinematic South Indian wedding invitation: temple doors that open onto a mandap,
the couple's real photos and films in physical gold frames, a scroll-driven camera, and a normal
HTML/CSS layer for all text, buttons and forms.

Stack: React + Vite · Three.js · React Three Fiber · Drei · GSAP ScrollTrigger.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
```

## 1. Fill in the details — one file

Edit **`src/config/wedding.config.js`**: names, parents, family message, events (date, time, venue,
address, map link), RSVP and music. Nothing is hardcoded elsewhere. Empty fields show a visible
`[placeholder]`; events with no date disable their calendar button; the countdown waits for a date.

## 2. Add the couple's real media

Put files in `public/media/` and reference them in the config, e.g. `src: '/media/hero.mp4'`.
Until a `src` is set, each frame shows a clearly labelled "Couple photo/video here" placeholder
(no people, no stock images). Media keeps its own aspect ratio and is never tinted or distorted.

- Photos: ~1600px long edge, JPEG/WebP, under ~300 KB. Optional `{ sm, md, lg }` sizes.
- Videos: H.264 MP4, 720p, 8–15 s, under ~4 MB, plus a `poster` image. They play muted and inline.
- Videos load only for the focused gallery frame and its neighbours, never all at once.

## 3. RSVP

- **With a backend:** set `rsvp.endpoint`. `npm run rsvp` runs a small dependency-free server
  (`server/rsvp-server.mjs`) that appends replies to `server/rsvps.jsonl`. Locally use
  `endpoint: '/api/rsvp'` (Vite proxies it). In production host it and use its full URL,
  setting `ALLOW_ORIGIN` to your site.
- **Without one:** set `rsvp.whatsappNumber` to send the reply by WhatsApp.
- **Neither:** the form says RSVP isn't enabled. It never shows a false success; network or
  server failures show an error and keep what the guest typed.

## Performance and fallbacks

- three.js is code-split and downloaded only on devices that will use 3D.
- Device tiers (`high / mid / low / none`) in `src/lib/capabilities.js` scale petals, shadows,
  garland detail and pixel ratio. `none` (no WebGL, Data Saver, very low memory) renders the
  lightweight HTML invitation with the same real photos and videos.
- If WebGL fails at runtime, the app switches to the lightweight mode automatically.
- `prefers-reduced-motion` removes drifting, dolly and scroll reveals.
- Test a tier with `?tier=none|low|mid|high`.

## Music

Off until the guest taps the speaker. With no `music.src` it plays a soft generated tanpura-style
drone; set `music.src` to a licensed audio file to use your own.

## Structure

| Piece | File |
| --- | --- |
| `WeddingEnvironment`, camera rig, lights | `src/three/WeddingEnvironment.jsx` |
| `TempleMandap`, gateway and doors | `src/three/TempleMandap.jsx`, `TempleGateway.jsx` |
| `BrassDiya`, `FloatingPetals` | `src/three/BrassDiya.jsx`, `FloatingPetals.jsx` |
| `InvitationCard3D` / HTML card | `src/three/InvitationCard3D.jsx`, `src/ui/InvitationCard.jsx` |
| `CoupleVideoFrame` (video and photo textures) | `src/three/CoupleVideoFrame.jsx`, `useMediaTexture.js` |
| `WeddingPhotoGallery` / story UI | `src/three/WeddingPhotoGallery.jsx`, `src/ui/Story.jsx` |
| `CeremonyTimeline`, `WeddingCountdown` | `src/ui/CeremonyTimeline.jsx`, `WeddingCountdown.jsx` |

## Notes

- The 3D geometry (pillars, lamps, mandap, doors, garlands) is generated in code, so there are no
  model files to download. To use your own GLB models, load them with Drei's `useGLTF` inside
  `TempleMandap` and keep them compressed (Draco/meshopt).
- Add `?debug` to the URL to expose the camera state on `window.__cam`.
