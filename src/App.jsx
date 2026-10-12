import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import config from './config/wedding.config.js'
import { detect } from './lib/capabilities.js'
import { useMusic } from './hooks/useMusic.js'
import PreInvitationCard from './ui/PreInvitationCard.jsx'
import TempleDoorOpening from './ui/TempleDoorOpening.jsx'
import ThreeScrollAtmosphere from './three/ThreeScrollAtmosphere.jsx'
import Hero from './ui/Hero.jsx'
import Story from './ui/Story.jsx'
import InvitationCard from './ui/InvitationCard.jsx'
import CeremonyTimeline from './ui/CeremonyTimeline.jsx'
import CoupleInviteReveal from './ui/CoupleInviteReveal.jsx'
import Controls from './ui/Controls.jsx'

const hasVideo = config.media.hero.type === 'video' || config.media.gallery.some((m) => m.type === 'video')

export default function App() {
  const caps = useMemo(() => detect(), [])
  const reduced = caps.reduced

  const [opened, setOpened] = useState(false)
  const [videosPlaying, setVideosPlaying] = useState(!reduced)
  const [heroContentVisible, setHeroContentVisible] = useState(false)
  const [precardHidden, setPrecardHidden] = useState(false)
  const precardRef = useRef(null)
  const doorRef = useRef(null)
  const music = useMusic(opened)

  useEffect(() => {
    const { bride, groom } = config.couple
    document.title = `${bride.name} & ${groom.name} · ${config.meta.title}`
  }, [])

  // Lock scrolling while viewing the pre-card before opening
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !opened)
  }, [opened])

  // Tap pre-card: starts music and initiates temple door opening synchronously on direct user gesture
  const handleOpen = useCallback(() => {
    if (opened) return

    // 1. Immediately start music and door animation synchronously
    music.play()
    doorRef.current?.start()
    setOpened(true)

    // 2. Animate out the clean pre-card
    const el = precardRef.current
    if (el) {
      gsap.to(el, {
        opacity: 0,
        scale: 0.98,
        duration: 0.38,
        ease: 'power2.out',
        onComplete: () => {
          setPrecardHidden(true)
        },
      })
    } else {
      setPrecardHidden(true)
    }
  }, [opened, music])

  const handleFrame113 = useCallback(() => {
    setHeroContentVisible(true)
  }, [])

  return (
    <>
      {/* 3D Three.js Scroll-Driven Atmosphere (Golden Akshata, Rose Petals, Sacred Torus) */}
      {opened && <ThreeScrollAtmosphere />}

      {/* 300-Frame Temple Door Opening Backdrop (Single-time animation, NO LOOP) */}
      <div className="temple-bg-stage" aria-hidden="true">
        <TempleDoorOpening
          ref={doorRef}
          active={opened}
          onFrame113={handleFrame113}
        />
      </div>

      {/* Clean luxury pre-card before opening: tap here to start music & open doors */}
      {!precardHidden && (
        <PreInvitationCard
          ref={precardRef}
          onOpen={handleOpen}
        />
      )}

      {/* Controls */}
      <Controls
        videosPlaying={videosPlaying}
        onVideos={() => setVideosPlaying((p) => !p)}
        hasVideo={hasVideo}
      />

      {/* Main invitation content */}
      <main
        className="main"
        style={{
          opacity: opened ? 1 : 0,
          pointerEvents: opened ? 'auto' : 'none',
          transition: 'opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {/* Welcome Header */}
        <Hero
          reduced={reduced}
          contentVisible={heroContentVisible}
        />

        {/* First section when scrolling: Two Hearts. One Beautiful Beginning (all photos scroll through) */}
        <Story reduced={reduced} />

        {/* Sacred Invitation Card */}
        <InvitationCard reduced={reduced} />

        {/* Ceremony Timeline & Events */}
        <CeremonyTimeline reduced={reduced} />

        {/* Grand Finale & RSVP */}
        <CoupleInviteReveal reduced={reduced} />
      </main>
    </>
  )
}
