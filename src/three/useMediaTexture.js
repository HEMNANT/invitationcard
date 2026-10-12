import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { pickSrc } from '../lib/media.js'
import { placeholderTexture } from './placeholder.js'

/**
 * Turns a media item from the config into a texture:
 *   - no src            → clearly labelled placeholder (no people, no stock couple)
 *   - image             → the photo, loaded only when `load` is true
 *   - video             → poster image first; the <video> is only created when `load` is true,
 *                         and plays (muted, inline) only while `play` is true.
 * Textures keep their native colours: nothing here tints, filters or distorts the people.
 */
export function useMediaTexture(item, { load = true, play = false } = {}) {
  const gl = useThree((s) => s.gl)
  const [imgTex, setImgTex] = useState(null)
  const [video, setVideo] = useState(null) // { tex, el, ready }
  const [aspect, setAspect] = useState(item.aspect || 0.8)
  const videoEl = useRef(null)

  const isVideo = item.type === 'video'
  const src = pickSrc(item.src)
  const posterSrc = pickSrc(item.poster)
  const imageUrl = isVideo ? posterSrc : src
  const wantImage = !!imageUrl && (isVideo || load)

  const placeholder = useMemo(
    () => placeholderTexture(item.type, item.caption || item.alt, item.aspect || 0.8),
    [item.type, item.caption, item.alt, item.aspect],
  )
  useEffect(() => () => placeholder.dispose(), [placeholder])

  // photo / poster
  useEffect(() => {
    if (!wantImage) {
      setImgTex(null)
      return undefined
    }
    let dead = false
    let created = null
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      imageUrl,
      (t) => {
        if (dead) {
          t.dispose()
          return
        }
        created = t
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
        if (t.image?.width && t.image?.height) setAspect(t.image.width / t.image.height)
        setImgTex(t)
      },
      undefined,
      () => {
        /* keep the placeholder if the file is missing */
      },
    )
    return () => {
      dead = true
      created?.dispose()
      setImgTex(null)
    }
  }, [imageUrl, wantImage, gl])

  // video element — created lazily
  useEffect(() => {
    if (!isVideo || !src || !load) return undefined
    const el = document.createElement('video')
    el.crossOrigin = 'anonymous'
    el.muted = true
    el.defaultMuted = true
    el.loop = true
    el.playsInline = true
    el.setAttribute('playsinline', '')
    el.setAttribute('webkit-playsinline', '')
    el.preload = 'auto'
    el.src = src
    videoEl.current = el
    const tex = new THREE.VideoTexture(el)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.minFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    const onReady = () => {
      if (el.videoWidth && el.videoHeight) setAspect(el.videoWidth / el.videoHeight)
      setVideo({ tex, el, ready: true })
    }
    el.addEventListener('loadeddata', onReady)
    el.load()
    return () => {
      el.removeEventListener('loadeddata', onReady)
      el.pause()
      el.removeAttribute('src')
      el.load()
      tex.dispose()
      videoEl.current = null
      setVideo(null)
    }
  }, [isVideo, src, load])

  // play / pause
  useEffect(() => {
    const el = videoEl.current
    if (!el || !video?.ready) return
    if (play) el.play().catch(() => { /* autoplay refused: poster stays visible */ })
    else el.pause()
  }, [play, video])

  const texture = video?.ready ? video.tex : imgTex || placeholder
  const isPlaceholder = !(video?.ready || imgTex)
  return { texture, aspect, isPlaceholder }
}
