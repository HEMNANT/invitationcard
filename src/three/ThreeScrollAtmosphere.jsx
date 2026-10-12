import { useEffect, useRef, memo } from 'react'
import * as THREE from 'three'

/**
 * ThreeScrollAtmosphere
 * Ultra-performant, 60 FPS Three.js scroll-driven 3D atmospheric experience:
 * - 3D Golden Sacred Akshata & Stardust points that drift and swirl with scroll depth
 * - 3D Velvet Crimson Rose & Temple Gold Petals tumbling in 3D perspective
 * - Sacred Golden Torus mandala ring twisting in the background
 * - Responsive inertia damping on scroll velocity
 * - Capped DPR for zero lag on low-end mobile devices
 */
export const ThreeScrollAtmosphere = memo(function ThreeScrollAtmosphere() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      stencil: false,
      depth: true,
    })

    // Cap DPR at 1.25 for buttery smooth 60fps on mobile
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25)
    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffd700, 2.0)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xff6b81, 2.2, 20)
    pointLight.position.set(-4, -2, 5)
    scene.add(pointLight)

    // 3. Sacred Gold Torus Mandala Ring
    const torusGeo = new THREE.TorusGeometry(3.6, 0.025, 16, 64)
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x553a05,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.45,
    })
    const torusMesh = new THREE.Mesh(torusGeo, torusMat)
    torusMesh.position.set(0, 0, -3)
    scene.add(torusMesh)

    // 4. Petal Geometry (Curved realistic 3D cup)
    const shape = new THREE.Shape()
    shape.moveTo(0, -0.6)
    shape.quadraticCurveTo(0.55, 0, 0, 0.7)
    shape.quadraticCurveTo(-0.55, 0, 0, -0.6)
    const petalGeo = new THREE.ShapeGeometry(shape, 5)
    const posAttr = petalGeo.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      posAttr.setZ(i, Math.abs(posAttr.getX(i)) * 0.28)
    }
    petalGeo.computeVertexNormals()

    const petalMat = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.25,
      shadowSide: THREE.DoubleSide,
    })

    const PETAL_COUNT = 48
    const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, PETAL_COUNT)
    petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

    const BOX = { x: 14, y: 18, z: 12 }
    const petalColors = [
      new THREE.Color(0xd4af37), // 24k Gold
      new THREE.Color(0xf5cb68), // Champaka Gold
      new THREE.Color(0xc41e3a), // Kumkuma Crimson
      new THREE.Color(0x801426), // Royal Maroon
      new THREE.Color(0xff4d6d), // Velvety Rose
      new THREE.Color(0xffd700), // Marigold Golden Yellow
    ]

    const dummy = new THREE.Object3D()
    const rnd = (min, max) => min + Math.random() * (max - min)

    const petals = Array.from({ length: PETAL_COUNT }, (_, i) => {
      const color = petalColors[i % petalColors.length]
      petalMesh.setColorAt(i, color)

      return {
        x: rnd(-BOX.x / 2, BOX.x / 2),
        y: rnd(-BOX.y / 2, BOX.y / 2),
        z: rnd(-BOX.z / 2, BOX.z / 2),
        vy: rnd(0.4, 0.9), // fall velocity
        vx: rnd(-0.15, 0.15),
        swaySpeed: rnd(0.8, 1.8),
        swayAmp: rnd(0.3, 0.7),
        rotX: rnd(0.2, 0.8),
        rotY: rnd(0.3, 1.0),
        rotZ: rnd(0.2, 0.6),
        phase: rnd(0, Math.PI * 2),
        scale: rnd(0.18, 0.38),
      }
    })

    if (petalMesh.instanceColor) petalMesh.instanceColor.needsUpdate = true
    scene.add(petalMesh)

    // 5. Shimmering 3D Stardust Points (THREE.Points)
    const DUST_COUNT = 110
    const dustPositions = new Float32Array(DUST_COUNT * 3)
    for (let i = 0; i < DUST_COUNT; i++) {
      dustPositions[i * 3] = rnd(-BOX.x / 2, BOX.x / 2)
      dustPositions[i * 3 + 1] = rnd(-BOX.y / 2, BOX.y / 2)
      dustPositions[i * 3 + 2] = rnd(-BOX.z / 2, BOX.z / 2)
    }

    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))

    // Procedural soft circle glow sprite
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(255, 235, 160, 1)')
    gradient.addColorStop(0.35, 'rgba(212, 175, 55, 0.7)')
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    const glowTex = new THREE.CanvasTexture(canvas)

    const dustMat = new THREE.PointsMaterial({
      map: glowTex,
      color: 0xffe89e,
      size: 0.35,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const dustPoints = new THREE.Points(dustGeo, dustMat)
    scene.add(dustPoints)

    // 6. Scroll & Motion Tracking
    let targetScroll = window.scrollY || 0
    let currentScroll = targetScroll
    let scrollVelocity = 0

    const onScroll = () => {
      targetScroll = window.scrollY || 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Mouse / Touch tilt for subtle 3D parallax
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const onMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.5
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // 7. Render Animation Loop
    let reqId
    const clock = new THREE.Clock()

    const animate = () => {
      reqId = requestAnimationFrame(animate)

      const dt = Math.min(clock.getDelta(), 0.1)
      const time = clock.getElapsedTime()

      // Smooth scroll interpolation (smooth dampening)
      scrollVelocity = (targetScroll - currentScroll) * 0.08
      currentScroll += scrollVelocity

      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      // Camera responds directly to scroll position and mouse
      camera.position.y = -currentScroll * 0.003 + mouseY * 0.3
      camera.position.x = mouseX * 0.4
      camera.lookAt(0, camera.position.y, 0)

      // Sacred Torus rotates smoothly with scroll and time
      torusMesh.position.y = camera.position.y - 0.5
      torusMesh.rotation.z = currentScroll * 0.0006 + time * 0.1
      torusMesh.rotation.x = Math.PI / 4 + Math.sin(time * 0.4) * 0.1

      // Update Petals
      const scrollWind = Math.abs(scrollVelocity) * 0.05
      for (let i = 0; i < PETAL_COUNT; i++) {
        const p = petals[i]
        p.y -= (p.vy + scrollWind) * dt * 2.5
        p.x += Math.sin(time * p.swaySpeed + p.phase) * p.swayAmp * dt
        p.z += Math.cos(time * 0.5 + p.phase) * 0.15 * dt

        // Wrap around relative to camera position
        const relY = p.y - camera.position.y
        if (relY < -BOX.y / 2) {
          p.y = camera.position.y + BOX.y / 2
          p.x = rnd(-BOX.x / 2, BOX.x / 2)
          p.z = rnd(-BOX.z / 2, BOX.z / 2)
        } else if (relY > BOX.y / 2) {
          p.y = camera.position.y - BOX.y / 2
        }

        dummy.position.set(p.x, p.y, p.z)
        dummy.rotation.set(
          time * p.rotX + p.phase + currentScroll * 0.001,
          time * p.rotY + p.phase,
          time * p.rotZ + p.phase
        )
        dummy.scale.setScalar(p.scale)
        dummy.updateMatrix()
        petalMesh.setMatrixAt(i, dummy.matrix)
      }
      petalMesh.instanceMatrix.needsUpdate = true

      // Update Stardust Points
      const pos = dustGeo.attributes.position.array
      for (let i = 0; i < DUST_COUNT; i++) {
        let y = pos[i * 3 + 1] - dt * (0.2 + scrollWind * 0.5)
        const relY = y - camera.position.y
        if (relY < -BOX.y / 2) {
          y = camera.position.y + BOX.y / 2
        } else if (relY > BOX.y / 2) {
          y = camera.position.y - BOX.y / 2
        }
        pos[i * 3 + 1] = y
      }
      dustGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)

      torusGeo.dispose()
      torusMat.dispose()
      petalGeo.dispose()
      petalMat.dispose()
      dustGeo.dispose()
      dustMat.dispose()
      glowTex.dispose()
      renderer.dispose()

      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="three-scroll-canvas"
      aria-hidden="true"
    />
  )
})

export default ThreeScrollAtmosphere
