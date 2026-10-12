import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { mats } from './materials.js'
import { frameGeometry } from './parts.jsx'
import { cardBackTexture } from './textures.js'
import { world } from '../lib/world.js'

export const CARD = { w: 2.5, h: 3.6 }

const smooth = (x, a, b) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * The stationery "mount" of the invitation: a velvet-and-gold card floating in the mandap.
 * The readable text lives in the HTML card layered on top of it (accessible, crisp, selectable).
 * It tilts gently with scroll position and the guest's pointer / phone movement.
 */
export default function InvitationCard3D({ position = [0, 2.2, 1.6] }) {
  const ref = useRef()
  const m = mats()
  const tex = useMemo(() => cardBackTexture(), [])
  const frame = useMemo(() => frameGeometry(CARD.w, CARD.h, 0.07, 0.07, 0.02), [])
  useEffect(() => () => { tex.dispose(); frame.dispose() }, [tex, frame])

  useFrame(({ clock }) => {
    const g = ref.current
    if (!g) return
    const sp = world.sectionPos
    const near = Math.max(0, 1 - Math.abs(sp - 1))
    // Keep the hero frame unobstructed: the card only grows into view as the camera glides to it,
    // and leaves again before the story corridor.
    const s = smooth(sp, 0.3, 0.85) * (1 - smooth(sp, 1.25, 1.6))
    g.scale.setScalar(Math.max(s, 0.0001))
    g.visible = world.doors > 0.5 && s > 0.01
    if (world.reduced) return
    g.rotation.y = world.px * 0.18 + Math.sin(clock.elapsedTime * 0.4) * 0.03
    g.rotation.x = -world.py * 0.1
    g.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6) * 0.04
    g.position.z = position[2] + near * 0.2
  })

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[CARD.w, CARD.h]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
      <mesh geometry={frame} material={m.gold} position={[0, 0, -0.03]} />
    </group>
  )
}
