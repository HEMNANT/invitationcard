import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats } from './materials.js'
import { doorTexture } from './textures.js'
import { world } from '../lib/world.js'

const DOOR_W = 2.6
const DOOR_H = 6.2

/** Tiered gopuram-style tower: a temple silhouette that frames the invitation doors. */
export function GopuramTower({ position = [0, 0, 0], scale = 1, base = 10, tiers = 7 }) {
  const m = mats()
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: tiers }, (_, i) => {
        const w = base * (1 - i * 0.12)
        const h = 1.15 - i * 0.04
        const y = i * 1.25 + h / 2
        return (
          <group key={i} position={[0, y, 0]}>
            <mesh material={i % 2 ? m.maroonDeep : m.stone}>
              <boxGeometry args={[w, h, w * 0.5]} />
            </mesh>
            <mesh position={[0, h / 2 + 0.03, 0.02]} material={m.gold}>
              <boxGeometry args={[w + 0.12, 0.06, w * 0.5 + 0.12]} />
            </mesh>
            {/* little shrine niches */}
            {Array.from({ length: Math.max(2, Math.floor(w / 1.6)) }, (_, k, _a, n = Math.max(2, Math.floor(w / 1.6))) => {
              const x = (k - (n - 1) / 2) * 1.4
              return (
                <mesh key={k} position={[x, 0, w * 0.25 + 0.02]} material={m.antiqueGold}>
                  <boxGeometry args={[0.5, h * 0.5, 0.05]} />
                </mesh>
              )
            })}
          </group>
        )
      })}
      <group position={[0, tiers * 1.25 + 0.2, 0]}>
        <mesh material={m.maroonDeep}>
          <cylinderGeometry args={[base * 0.18, base * 0.3, 0.8, 6]} />
        </mesh>
        {[-0.7, 0, 0.7].map((x) => (
          <mesh key={x} position={[x, 0.7 - Math.abs(x) * 0.3, 0]} material={m.gold}>
            <coneGeometry args={[0.14, 0.7, 8]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** The carved double doors, set into a temple gateway. They swing inward when `world.doors` goes 0 → 1. */
export default function TempleGateway({ position = [0, 0, 10] }) {
  const m = mats()
  const left = useRef()
  const right = useRef()
  const texL = useMemo(() => doorTexture('left'), [])
  const texR = useMemo(() => doorTexture('right'), [])
  useEffect(() => () => { texL.dispose(); texR.dispose() }, [texL, texR])

  useFrame(() => {
    const a = THREE.MathUtils.smootherstep(world.doors, 0, 1) * 1.75
    if (left.current) left.current.rotation.y = a
    if (right.current) right.current.rotation.y = -a
  })

  const wallW = 7
  return (
    <group position={position}>
      {/* walls either side of the doors */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (DOOR_W + wallW / 2), DOOR_H / 2, 0]} material={m.stone}>
          <boxGeometry args={[wallW, DOOR_H, 1.2]} />
        </mesh>
      ))}
      {/* door jambs and lintel in gold-trimmed wood */}
      {[-1, 1].map((s) => (
        <mesh key={`j${s}`} position={[s * (DOOR_W + 0.12), DOOR_H / 2, 0.1]} material={m.wood}>
          <boxGeometry args={[0.3, DOOR_H, 1.3]} />
        </mesh>
      ))}
      <mesh position={[0, DOOR_H + 0.18, 0.1]} material={m.wood}>
        <boxGeometry args={[DOOR_W * 2 + 0.7, 0.4, 1.3]} />
      </mesh>
      <mesh position={[0, DOOR_H + 0.4, 0.1]} material={m.gold}>
        <boxGeometry args={[DOOR_W * 2 + 0.9, 0.06, 1.34]} />
      </mesh>
      <mesh position={[0, DOOR_H + 0.42, 0]} material={m.stone}>
        <boxGeometry args={[DOOR_W * 2 + 14, 0.5, 1.2]} />
      </mesh>

      <GopuramTower position={[0, DOOR_H + 0.66, 0]} scale={1} base={11} tiers={7} />

      {/* the doors */}
      <group ref={left} position={[-DOOR_W, 0, 0]}>
        <mesh position={[DOOR_W / 2, DOOR_H / 2, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.22]} />
          <meshStandardMaterial map={texL} roughness={0.55} metalness={0.15} />
        </mesh>
      </group>
      <group ref={right} position={[DOOR_W, 0, 0]}>
        <mesh position={[-DOOR_W / 2, DOOR_H / 2, 0]}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.22]} />
          <meshStandardMaterial map={texR} roughness={0.55} metalness={0.15} />
        </mesh>
      </group>
    </group>
  )
}

export const GATE = { z: 10, doorW: DOOR_W, doorH: DOOR_H }
