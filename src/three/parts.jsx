import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mats, MARIGOLD_COLORS, JASMINE_COLORS } from './materials.js'
import { glowTexture } from './textures.js'
import { world } from '../lib/world.js'

/* ───────────── geometry helpers ───────────── */

export const lathe = (pts, seg = 24) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg)

export function roundedRect(shape, x, y, w, h, r) {
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

/** A picture-frame ring: outer rounded rect with a rounded hole, extruded and bevelled. */
export function frameGeometry(innerW, innerH, border, depth, bevel = 0.02) {
  const ow = innerW + border * 2
  const oh = innerH + border * 2
  const shape = roundedRect(new THREE.Shape(), -ow / 2, -oh / 2, ow, oh, Math.min(0.08, border * 0.6))
  const hole = new THREE.Path()
  roundedRect(hole, -innerW / 2, -innerH / 2, innerW, innerH, 0.025)
  shape.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 6,
  })
  return g
}

/**
 * Shows its children only while the scroll position is within [min, max].
 * Used to let the camera "walk through" the mandap into the story corridor without the
 * mandap backdrop or hero frame blocking the view.
 */
export function ShowBetween({ min = -Infinity, max = Infinity, children }) {
  const ref = useRef()
  useFrame(() => {
    if (!ref.current) return
    const v = world.sectionPos >= min && world.sectionPos <= max
    if (ref.current.visible !== v) ref.current.visible = v
  })
  return <group ref={ref}>{children}</group>
}

/* ───────────── shared glow ───────────── */

let glowTex
export const getGlow = () => (glowTex ||= glowTexture())
export const disposeGlow = () => {
  glowTex?.dispose()
  glowTex = null
}

/* ───────────── Flame ───────────── */

export function Flame({ scale = 1, seed = 0, glow = 1 }) {
  const ref = useRef()
  const core = useRef()
  const halo = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 7 + seed * 11
    const k = 1 + Math.sin(t) * 0.07 + Math.sin(t * 2.3) * 0.05
    if (ref.current) {
      ref.current.scale.set(1 - (k - 1) * 0.5, k, 1 - (k - 1) * 0.5)
      ref.current.rotation.z = Math.sin(t * 0.6) * 0.05
    }
    if (halo.current) halo.current.material.opacity = (0.5 + Math.sin(t * 1.3) * 0.08) * glow * (0.4 + world.light * 0.6)
    if (core.current) core.current.material.opacity = 0.95
  })
  return (
    <group scale={scale}>
      <group ref={ref}>
        <mesh ref={core} position={[0, 0.07, 0]}>
          <coneGeometry args={[0.035, 0.15, 12]} />
          <meshBasicMaterial color="#ffd27a" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.045, 0]}>
          <coneGeometry args={[0.018, 0.09, 10]} />
          <meshBasicMaterial color="#fff4d6" transparent opacity={0.95} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
      <sprite ref={halo} position={[0, 0.08, 0]} scale={[0.75, 0.75, 1]}>
        <spriteMaterial map={getGlow()} color="#ffb35c" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  )
}

/* ───────────── Standing brass lamp (kuthuvilakku) ───────────── */

const LAMP_PROFILE = [
  [0.0, 0], [0.24, 0], [0.26, 0.03], [0.22, 0.07], [0.12, 0.12], [0.07, 0.2], [0.05, 0.32], [0.09, 0.4], [0.05, 0.48],
  [0.045, 0.7], [0.1, 0.78], [0.05, 0.86], [0.045, 1.05], [0.12, 1.12], [0.2, 1.2], [0.26, 1.3], [0.22, 1.34], [0.0, 1.32],
]

export function StandingLamp({ position = [0, 0, 0], scale = 1, seed = 0, flame = true }) {
  const geo = useMemo(() => lathe(LAMP_PROFILE, 20), [])
  useEffect(() => () => geo.dispose(), [geo])
  const m = mats()
  return (
    <group position={position} scale={scale}>
      <mesh geometry={geo} material={m.brass} castShadow />
      {flame && (
        <group position={[0, 1.33, 0]}>
          <Flame scale={1.3} seed={seed} />
        </group>
      )}
    </group>
  )
}

/* ───────────── Pillar ───────────── */

const COLUMN_PROFILE = [
  [0.34, 0], [0.34, 0.12], [0.27, 0.2], [0.25, 0.5], [0.3, 0.58], [0.25, 0.66], [0.235, 1.6], [0.25, 1.7], [0.235, 1.8],
  [0.225, 3.0], [0.27, 3.1], [0.3, 3.3], [0.36, 3.5],
]

export function Pillar({ position = [0, 0, 0], scale = 1, height = 1, castShadow = false }) {
  const col = useMemo(() => lathe(COLUMN_PROFILE, 22), [])
  useEffect(() => () => col.dispose(), [col])
  const m = mats()
  const bands = [0.62, 1.75, 3.05]
  return (
    <group position={position} scale={[scale, scale * height, scale]}>
      <mesh position={[0, 0.1, 0]} material={m.stone} castShadow={castShadow}>
        <boxGeometry args={[0.95, 0.2, 0.95]} />
      </mesh>
      <group position={[0, 0.2, 0]}>
        <mesh geometry={col} material={m.wood} castShadow={castShadow} />
        {bands.map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.gold}>
            <torusGeometry args={[y > 3 ? 0.265 : 0.255, 0.028, 8, 28]} />
          </mesh>
        ))}
        {/* capital: stacked temple brackets */}
        <mesh position={[0, 3.62, 0]} material={m.gold}>
          <boxGeometry args={[0.8, 0.1, 0.8]} />
        </mesh>
        <mesh position={[0, 3.74, 0]} material={m.wood}>
          <boxGeometry args={[1.05, 0.14, 1.05]} />
        </mesh>
        <mesh position={[0, 3.86, 0]} material={m.gold}>
          <boxGeometry args={[1.18, 0.07, 1.18]} />
        </mesh>
        <mesh position={[0, 3.96, 0]} material={m.maroon}>
          <boxGeometry args={[1.28, 0.13, 1.28]} />
        </mesh>
      </group>
    </group>
  )
}

/* ───────────── Garlands (marigold + jasmine), one instanced mesh for all ───────────── */

export function Garlands({ specs, beads = 30 }) {
  const mesh = useRef()
  const m = mats()
  const { count, matrices, colors, tubes } = useMemo(() => {
    const matrices = []
    const colors = []
    const tubes = []
    const dummy = new THREE.Object3D()
    const rand = (s) => {
      const x = Math.sin(s * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    specs.forEach((s, si) => {
      const a = new THREE.Vector3(...s.from)
      const b = new THREE.Vector3(...s.to)
      const pts = []
      const n = beads
      for (let i = 0; i <= n; i++) {
        const t = i / n
        const p = a.clone().lerp(b, t)
        p.y -= s.sag * 4 * t * (1 - t)
        pts.push(p)
      }
      tubes.push(new THREE.CatmullRomCurve3(pts))
      const palette = s.kind === 'jasmine' ? JASMINE_COLORS : MARIGOLD_COLORS
      for (let i = 0; i <= n; i++) {
        const p = pts[i]
        const r = s.kind === 'jasmine' ? 0.045 : 0.075
        dummy.position.copy(p)
        dummy.position.y -= r * 0.4
        dummy.rotation.set(rand(si * 91 + i) * 3, rand(si * 53 + i) * 3, 0)
        dummy.scale.set(r * (0.9 + rand(i + si) * 0.3), r * 0.8, r)
        dummy.updateMatrix()
        matrices.push(dummy.matrix.clone())
        colors.push(new THREE.Color(palette[Math.floor(rand(si * 17 + i) * palette.length)]))
      }
      // a hanging tassel of flowers at the lowest point
      if (s.tassel) {
        const mid = pts[Math.floor(n / 2)]
        for (let k = 1; k <= 3; k++) {
          dummy.position.set(mid.x, mid.y - k * 0.17, mid.z)
          const rr = 0.07 - k * 0.01
          dummy.scale.set(rr, rr, rr)
          dummy.rotation.set(0, 0, 0)
          dummy.updateMatrix()
          matrices.push(dummy.matrix.clone())
          colors.push(new THREE.Color(MARIGOLD_COLORS[k % MARIGOLD_COLORS.length]))
        }
      }
    })
    return { count: matrices.length, matrices, colors, tubes }
  }, [specs, beads])

  useEffect(() => {
    const im = mesh.current
    if (!im) return
    matrices.forEach((mt, i) => {
      im.setMatrixAt(i, mt)
      im.setColorAt(i, colors[i])
    })
    im.instanceMatrix.needsUpdate = true
    if (im.instanceColor) im.instanceColor.needsUpdate = true
  }, [matrices, colors])

  const tubeGeos = useMemo(() => tubes.map((c) => new THREE.TubeGeometry(c, 24, 0.012, 5, false)), [tubes])
  useEffect(() => () => tubeGeos.forEach((g) => g.dispose()), [tubeGeos])

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} material={m.marigold}>
        <sphereGeometry args={[1, 8, 6]} />
      </instancedMesh>
      {tubeGeos.map((g, i) => (
        <mesh key={i} geometry={g} material={m.stem} />
      ))}
    </group>
  )
}

/* ───────────── Banana leaf cluster ───────────── */

export function BananaLeaves({ position = [0, 0, 0], rotationY = 0, count = 5 }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.55, 2.3, 4, 12)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i) + 1.15
      const bend = (y / 2.3) ** 2 * 0.75
      p.setZ(i, bend)
      p.setX(i, p.getX(i) * (1 - (y / 2.3) * 0.35))
    }
    g.computeVertexNormals()
    return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])
  const m = mats()
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / (count - 1) - 0.5) * 1.5
        return (
          <mesh key={i} geometry={geo} material={m.banana} position={[Math.sin(a) * 0.35, 1.15, 0]} rotation={[-0.12 - Math.abs(a) * 0.12, a, a * 0.25]} />
        )
      })}
    </group>
  )
}

/* ───────────── Gold lotus emblem ───────────── */

export function GoldEmblem({ position = [0, 0, 0], scale = 1 }) {
  const ref = useRef()
  const m = mats()
  const petal = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.quadraticCurveTo(0.2, 0.28, 0, 0.78)
    s.quadraticCurveTo(-0.2, 0.28, 0, 0)
    return new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 })
  }, [])
  const ring = useMemo(() => new THREE.TorusGeometry(0.98, 0.035, 10, 64), [])
  const ring2 = useMemo(() => new THREE.TorusGeometry(0.82, 0.018, 8, 64), [])
  useEffect(() => () => { petal.dispose(); ring.dispose(); ring2.dispose() }, [petal, ring, ring2])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const open = world.doors
    const s = scale * Math.max(0.0001, 1 - THREE.MathUtils.smoothstep(open, 0.05, 0.7))
    ref.current.scale.setScalar(s)
    ref.current.visible = s > 0.002
    if (!world.reduced) {
      ref.current.rotation.z = clock.elapsedTime * 0.15
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.06
    }
  })
  const N = 12
  return (
    <group ref={ref} position={position}>
      <mesh geometry={ring} material={m.gold} />
      <mesh geometry={ring2} material={m.antiqueGold} />
      {Array.from({ length: N }, (_, i) => (
        <group key={`o${i}`} rotation={[0, 0, (i / N) * Math.PI * 2]}>
          <mesh geometry={petal} material={m.gold} position={[0, 0.2, 0]} scale={[1, 0.95, 1]} />
        </group>
      ))}
      {Array.from({ length: N }, (_, i) => (
        <group key={`i${i}`} rotation={[0, 0, ((i + 0.5) / N) * Math.PI * 2]}>
          <mesh geometry={petal} material={m.brass} position={[0, 0.12, 0.05]} scale={[0.8, 0.6, 1]} />
        </group>
      ))}
      <mesh position={[0, 0, 0.08]} material={m.gold}>
        <sphereGeometry args={[0.13, 18, 14]} />
      </mesh>
    </group>
  )
}
