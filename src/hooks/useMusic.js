import { useCallback, useEffect, useRef, useState } from 'react'
import config from '../config/wedding.config.js'

/**
 * useMusic
 * Background audio manager for wedding BGM (backgroundSong.wav).
 * - Loops continuously
 * - Volume set to a gentle, lowered level (0.28)
 * - Starts seamlessly when invitation is opened via user gesture
 * - Includes fallback listener for any first interaction
 * - Pauses politely when tab is hidden and resumes when visible
 */
export function useMusic(opened = false) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const targetVolume = typeof config.music?.volume === 'number' ? config.music?.volume : 0.32

  // Instantiate and preload audio immediately on mount
  useEffect(() => {
    if (!config.music?.src) return

    const audio = new Audio(config.music.src)
    audio.loop = true
    audio.volume = targetVolume
    audio.preload = 'auto'
    audioRef.current = audio

    // Attempt instant autoplay on mount (works if browser allows or user has visited)
    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      // Autoplay blocked until user gesture: listen for the very first interaction anywhere
      const unlockAudio = () => {
        audio.play().then(() => {
          setIsPlaying(true)
        }).catch(() => {})
      }

      window.addEventListener('pointerdown', unlockAudio, { once: true, capture: true })
      window.addEventListener('touchstart', unlockAudio, { once: true, capture: true })
      window.addEventListener('click', unlockAudio, { once: true, capture: true })
      window.addEventListener('keydown', unlockAudio, { once: true, capture: true })
    })

    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [targetVolume])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false
    try {
      audio.volume = targetVolume
      await audio.play()
      setIsPlaying(true)
      return true
    } catch {
      setIsPlaying(false)
      return false
    }
  }, [targetVolume])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  // When invitation is opened, make sure music is playing
  useEffect(() => {
    if (opened) {
      play()
    }
  }, [opened, play])

  // Pause when tab is minimized/hidden, resume when returned
  useEffect(() => {
    const onVisibility = () => {
      if (!audioRef.current) return
      if (document.hidden) {
        audioRef.current.pause()
      } else if (opened || isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [opened, isPlaying])

  return { isPlaying, play, stop }
}
