import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import config from '../config/wedding.config.js'
import { world } from '../lib/world.js'
import { BUDGET } from '../lib/capabilities.js'
import { mats } from './materials.js'
import { stoneTexture, kolamTexture } from './textures.js'
import { Garlands, Pillar, ShowBetween, StandingLamp } from './parts.jsx'
import TempleMandap from './TempleMandap.jsx'
import TempleGateway, { GopuramTower, GATE } from './TempleGateway.jsx'
import BrassDiya from './BrassDiya.jsx'
import FloatingPetals from './FloatingPetals.jsx'
import InvitationCard3D, { CARD } from './InvitationCard3D.jsx'
import CoupleVideoFrame from './CoupleVideoFrame.jsx'
import WeddingPhotoGallery, { galleryLayout } from './WeddingPhotoGallery.jsx'
import GoldEmblemLazy from './EmblemWrap.jsx'
import DivineBlessings from './DivineBlessings.jsx'

const DEBUG = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')
const HERO_POS = [0, 2.55, -0.9]
const { MathUtils } = THREE

/* camera framing helper: distance so a w×h object fits with margin */
const fitDist = (fov, w, h, aspect, margin) => {
  const t = Math.tan(MathUtils.degToRad(fov / 2))
  return Math.max(h / (2 * t), w / (2 * t * aspect)) * margin
}

/** Scroll-driven cinematic camera: intro at the doors → push-in → hero → card → story → events → RSVP. */
function CameraRig({ gallery, endZ }) {
  const { camera, size, scene } = useThree()
  const cur = useRef({ pos: new THREE.Vector3(), look: new THREE.Vector3(), init: false })
  const tmp = useMemo(
    () => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), la: new THREE.Vector3(), lb: new THREE.Vector3(), dir: new THREE.Vector3(), p: new THREE.Vector3(), l: new THREE.Vector3(), c: new THREE.Color(), c2: new THREE.Color() }),
    [],
  )
  const bg = useMemo(() => new THREE.Color('#FAF7F2'), [])

  useEffect(() => {
    scene.background = bg
    scene.fog = new THREE.FogExp2('#FAF7F2', 0.016)
    return () => {
      scene.fog = null
    }
  }, [scene, bg])

  useFrame(({ clock }, dt) => {
    const aspect = size.width / size.height
    const fov = camera.fov
    const t = clock.elapsedTime

    // pull back on tall phone screens so framed subjects still fit
    const back = MathUtils.clamp((1 / aspect - 1) * 2.2, 0, 5.5)

    const pose = (px, py, pz, lx, ly, lz, pull = true, out) => {
      out.p.set(px, py, pz)
      out.l.set(lx, ly, lz)
      if (pull) {
        tmp.dir.copy(out.p).sub(out.l).normalize()
        out.p.addScaledVector(tmp.dir, back)
      }
    }

    // ── anchors ────────────────────────────────────────────────
    const anchors = []
    // 0 hero
    {
      const hw = world.hero.w
      const hh = world.hero.h
      // leave the lower ~40% of a phone screen free for the names and date
      const tall = aspect < 0.8
      const d = fitDist(fov, hw, hh, aspect, tall ? 2.05 : 2.5)
      anchors.push({ p: [0, HERO_POS[1] - 0.15, HERO_POS[2] + d], l: [0, HERO_POS[1] - hh * 0.52, HERO_POS[2]] })
    }
    // 1 invitation card
    {
      const d = fitDist(fov, CARD.w, CARD.h, aspect, 1.3)
      anchors.push({ p: [0, 2.3, 1.7 + d], l: [0, 2.3, 1.7] })
    }
    // 2 story — focus the active frame
    {
      const i = Math.min(world.galleryIndex, gallery.length - 1)
      const L = gallery[i]
      const dims = world.frames[i] || { w: 2.4, h: 3.1 }
      const d = fitDist(fov, dims.w, dims.h, aspect, 1.55)
      const fx = L.position[0]
      const fz = L.position[2]
      anchors.push({ p: [fx * 0.35, L.position[1] - 0.1, fz + d], l: [fx, L.position[1] - dims.h * 0.16, fz] })
    }
    // 3 ceremonies
    anchors.push({ p: [0, 2.0, endZ + 2], l: [0, 2.3, endZ - 9] })
    // 4 couple invite finale
    anchors.push({ p: [0, 2.2, endZ - 4], l: [0, 3.0, endZ - 18] })

    const sp = MathUtils.clamp(world.sectionPos, 0, anchors.length - 1)
    const i0 = Math.floor(sp)
    const i1 = Math.min(i0 + 1, anchors.length - 1)
    const f = sp - i0
    const A = anchors[i0]
    const B = anchors[i1]
    tmp.a.set(...A.p)
    tmp.b.set(...B.p)
    tmp.la.set(...A.l)
    tmp.lb.set(...B.l)
    // apply the phone pull-back (anchors 0 and 1 already fit their subject, so only ceremonies / RSVP need it)
    const pullIdx = (idx, vec, look) => {
      if (idx >= 3) {
        tmp.dir.copy(vec).sub(look).normalize()
        vec.addScaledVector(tmp.dir, back * 0.5)
      }
    }
    pullIdx(i0, tmp.a, tmp.la)
    pullIdx(i1, tmp.b, tmp.lb)
    const scenePos = tmp.a.lerp(tmp.b, f)
    const sceneLook = tmp.la.lerp(tmp.lb, f)

    // slow dolly while resting on the hero
    if (!world.reduced) {
      const rest = 1 - MathUtils.smoothstep(world.sectionPos, 0, 0.6)
      scenePos.z -= (Math.sin(t * 0.18) * 0.5 + 0.5) * 0.28 * rest
      scenePos.x += Math.sin(t * 0.21) * 0.05
    }

    // intro pose: looking at the closed doors from the courtyard
    const introD = fitDist(fov, GATE.doorW * 2 + 1, GATE.doorH, aspect, 1.0) * 0.9
    const introPos = tmp.p.set(0, 2.7, GATE.z + introD)
    const introLook = tmp.l.set(0, 2.9, GATE.z)

    const k = MathUtils.clamp(world.intro, 0, 1)
    const targetPos = scenePos.clone().lerp(introPos, k)
    const targetLook = sceneLook.clone().lerp(introLook, k)

    // parallax from pointer / phone tilt
    targetPos.x += world.px * 0.28
    targetPos.y += world.py * -0.12

    const c = cur.current
    if (!c.init) {
      c.pos.copy(introPos)
      c.look.copy(introLook)
      c.init = true
    }
    const damp = world.reduced ? 1 : 1 - Math.exp(-dt * 2.0)
    c.pos.lerp(targetPos, damp)
    c.look.lerp(targetLook, damp)
    camera.position.copy(c.pos)
    camera.lookAt(c.look)
    if (DEBUG) window.__cam = { pos: c.pos.toArray(), look: c.look.toArray(), aspect, fov, intro: world.intro, sp: world.sectionPos, hero: world.hero, targetPos: targetPos.toArray() }

    // mood: pristine celestial white hall
    const L = world.light
    tmp.c.set('#FAF7F2').lerp(tmp.c2.set('#FFFFFF'), L)
    bg.copy(tmp.c)
    if (scene.fog) {
      scene.fog.color.copy(tmp.c)
      scene.fog.density = 0.016 - L * 0.005
    }
    scene.environmentIntensity = 0.8 + L * 0.6
  })
  return null
}

/** Lights that travel with the camera so every scene is warmly lit without per-object lights. */
function Lights({ shadows }) {
  const key = useRef()
  const fill = useRef()
  const dir = useRef()
  const camera = useThree((s) => s.camera)
  useFrame(() => {
    const L = world.light
    if (key.current) {
      key.current.position.copy(camera.position).add(new THREE.Vector3(0.6, 0.8, -1.2).applyQuaternion(camera.quaternion))
      key.current.intensity = 12 + L * 18
    }
    if (fill.current) fill.current.intensity = 0.8 + L * 0.4
    if (dir.current) {
      dir.current.position.set(camera.position.x + 3, 9, camera.position.z + 4)
      dir.current.target.position.set(camera.position.x, 1, camera.position.z - 6)
      dir.current.target.updateMatrixWorld()
      dir.current.intensity = 1.0 + L * 0.8
    }
  })
  return (
    <>
      <hemisphereLight ref={fill} args={['#ffffff', '#f4ece1', 0.85]} />
      <pointLight ref={key} color="#fff1db" distance={25} decay={1.5} intensity={14} />
      <directionalLight ref={dir} color="#fff6e8" intensity={1.4} castShadow={shadows}>
        {shadows && <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 0.5, 40]} />}
      </directionalLight>
    </>
  )
}

function Floor({ endZ }) {
  const len = 30 - (endZ - 30)
  const cz = (30 + (endZ - 30)) / 2
  const tex = useMemo(() => stoneTexture([8, len / 2]), [len])
  const kolam = useMemo(() => kolamTexture(), [])
  useEffect(() => () => { tex.dispose(); kolam.dispose() }, [tex, kolam])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, cz]} receiveShadow>
        <planeGeometry args={[16, len]} />
        <meshStandardMaterial map={tex} roughness={0.55} metalness={0.15} envMapIntensity={0.5} />
      </mesh>
      {/* courtyard kolam just inside the doors */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, GATE.z - 4]}>
        <planeGeometry args={[5.2, 5.2]} />
        <meshBasicMaterial map={kolam} transparent opacity={0.55} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

export default function WeddingEnvironment({ tier, storyNear, storyVisible, heroPlaying, videosPlaying, galleryIndex, opened }) {
  const budget = BUDGET[tier] || BUDGET.mid
  const galleryItems = config.media.gallery
  const layout = useMemo(() => galleryLayout(galleryItems.length), [galleryItems.length])
  const lastZ = layout.length ? layout[layout.length - 1].position[2] : -8
  const endZ = lastZ - 5
  const m = mats()

  // corridor pillars + garlands + lamps
  const { pillarZs, specs } = useMemo(() => {
    const zs = []
    for (let z = -5.5; z > endZ - 17; z -= budget.pillarStep) zs.push(z)
    const X = 4.4
    const y = 3.9
    const specs = []
    zs.forEach((z, i) => {
      specs.push({ from: [-X, y, z], to: [X, y, z], sag: 0.6, kind: i % 2 ? 'jasmine' : 'marigold', tassel: i % 2 === 0 })
      if (i > 0) {
        const pz = zs[i - 1]
        specs.push({ from: [-X, y, pz], to: [-X, y, z], sag: 0.45, kind: 'marigold' })
        specs.push({ from: [X, y, pz], to: [X, y, z], sag: 0.45, kind: 'marigold' })
      }
    })
    return { pillarZs: zs, specs }
  }, [endZ, budget.pillarStep])

  const heroLoad = opened
  return (
    <>
      <CameraRig gallery={layout} endZ={endZ} />
      <Lights shadows={budget.shadows} />
      <Environment resolution={budget.envRes} frames={1} background={false}>
        <Lightformer form="rect" intensity={2.8} color="#ffffff" position={[0, 7, -4]} scale={[16, 4, 1]} />
        <Lightformer form="rect" intensity={2.0} color="#fffcf2" position={[-6, 3, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={2.0} color="#fffcf2" position={[6, 3, 3]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="ring" intensity={1.8} color="#ffe8b8" position={[0, 4, 8]} scale={5} />
      </Environment>

      <Floor endZ={endZ} />

      {/* opening scene with divine blessings */}
      <TempleGateway position={[0, 0, GATE.z]} />
      <DivineBlessings position={[0, 2.7, GATE.z + 1.6]} scale={0.72} portrait="/media/rama-sita-devotional.png" />
      <GoldEmblemLazy position={[0, 4.5, GATE.z + 1.8]} scale={0.65} />
      <BrassDiya position={[0, 0, GATE.z + 4.2]} scale={0.95} />

      {/* main hall */}
      <TempleMandap position={[0, 0, 0]} beads={budget.garlandBeads} shadows={budget.shadows} />
      <ShowBetween max={1.6}>
        {/* Divine presiding blessing sanctum behind couple */}
        <DivineBlessings position={[0, 4.25, -2.8]} scale={0.85} portrait="/media/rama-sita-wedding.png" />
        <CoupleVideoFrame
          item={config.media.hero}
          position={HERO_POS}
          maxW={2.5}
          maxH={3.2}
          load={heroLoad}
          play={heroPlayingFlag(heroPlaying, videosPlaying, opened)}
          float={0.05}
          shadows={budget.shadows}
          onDims={onHeroDims}
        />
      </ShowBetween>
      <InvitationCard3D position={[0, 2.3, 1.7]} />

      {/* corridor of pillars, garlands, brass lamps */}
      {pillarZs.map((z) => (
        <group key={z}>
          <Pillar position={[-4.4, 0, z]} height={1} scale={0.95} castShadow={budget.shadows} />
          <Pillar position={[4.4, 0, z]} height={1} scale={0.95} castShadow={budget.shadows} />
          <StandingLamp position={[-3.1, 0, z - budget.pillarStep / 2]} seed={z} />
          <StandingLamp position={[3.1, 0, z - budget.pillarStep / 2]} seed={z + 3} />
        </group>
      ))}
      <Garlands specs={specs} beads={budget.garlandBeads} />

      <WeddingPhotoGallery near={storyNear} visible={storyVisible} activeIndex={galleryIndex} playing={videosPlaying} shadows={budget.shadows} />

      {/* far gopuram closing the corridor */}
      <GopuramTower position={[0, 0, endZ - 20]} scale={1.5} base={11} tiers={7} />
      <pointLight position={[0, 4, endZ - 8]} color="#ffbd70" intensity={14} distance={20} decay={1.8} />

      <FloatingPetals petals={budget.petals} dust={budget.dust} animate />
    </>
  )
}

const onHeroDims = (d) => {
  world.hero = d
}

function heroPlayingFlag(heroPlaying, videosPlaying, opened) {
  return opened && videosPlaying && heroPlaying
}
