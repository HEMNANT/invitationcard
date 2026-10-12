import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials.js'
import { frameGeometry, getGlow } from './parts.jsx'
import { fitFrame } from '../lib/media.js'
import { useMediaTexture } from './useMediaTexture.js'
import { world } from '../lib/world.js'

/**
 * A physical-looking gold portrait frame (bevelled, thick, reflective) that shows the couple's
 * real photo or video. The frame is sized from the media's own aspect ratio, so nothing is
 * stretched or cropped.
 */
export default function CoupleVideoFrame({
  item,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  maxW = 2.2,
  maxH = 2.9,
  load = true,
  play = false,
  float = 0.04,
  phase = 0,
  shadows = false,
  onDims,
}) {
  const { texture, aspect } = useMediaTexture(item, { load, play })
  const { w, h } = useMemo(() => fitFrame(aspect, maxW, maxH), [aspect, maxW, maxH])
  const m = mats()
  const border = 0.13
  const depth = 0.1

  const outer = useMemo(() => frameGeometry(w, h, border, depth, 0.03), [w, h])
  const lip = useMemo(() => frameGeometry(w - 0.01, h - 0.01, 0.03, depth + 0.05, 0.012), [w, h])
  useEffect(() => () => { outer.dispose(); lip.dispose() }, [outer, lip])

  useEffect(() => {
    onDims?.({ w: w + border * 2, h: h + border * 2 })
  }, [w, h, onDims])

  const inner = useRef()
  useFrame(({ clock }) => {
    if (!inner.current || world.reduced) return
    const t = clock.elapsedTime * 0.7 + phase
    inner.current.position.y = Math.sin(t) * float
    inner.current.rotation.z = Math.sin(t * 0.8) * float * 0.12
    inner.current.rotation.y = Math.sin(t * 0.5) * float * 0.5
  })

  return (
    <group position={position} rotation={rotation}>
      <group ref={inner}>
        {/* soft warm halo so the frame feels lit rather than pasted on */}
        <sprite position={[0, 0, -0.35]} scale={[w * 2.1, h * 1.7, 1]}>
          <spriteMaterial map={getGlow()} color="#ff9d4d" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </sprite>
        {/* dark wooden back */}
        <mesh position={[0, 0, -0.02]} material={m.temple} castShadow={shadows}>
          <boxGeometry args={[w + border * 2, h + border * 2, 0.04]} />
        </mesh>
        {/* the real media — toneMapped off so skin tones are shown exactly as shot */}
        <mesh position={[0, 0, 0.035]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh geometry={outer} material={m.gold} position={[0, 0, 0]} castShadow={shadows} />
        <mesh geometry={lip} material={m.antiqueGold} position={[0, 0, 0.02]} />
        {/* pointed finials */}
        {[[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => (
          <mesh key={`${sx}${sy}`} position={[sx * (w / 2 + border), sy * (h / 2 + border), depth + 0.03]} material={m.gold}>
            <sphereGeometry args={[0.055, 14, 10]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
