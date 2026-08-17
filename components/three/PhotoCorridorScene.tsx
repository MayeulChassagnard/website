'use client'

import { Suspense, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const COUNT = 30
const RADIUS_X = 4.6
const RADIUS_Y = 3.1
const DEPTH = 46
const CELL = 2.5

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Deterministic pseudo-random: the scatter must look arbitrary but stay identical across renders. */
function seeded(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

interface Slot {
  assembled: THREE.Vector3
  /** Rotation that makes the plane face the corridor axis. */
  assembledRotation: THREE.Euler
  scattered: THREE.Vector3
  scatteredRotation: THREE.Euler
  floatSeed: number
}

/**
 * Photographs arranged on the inside of an elliptical corridor, so the camera
 * can travel down its axis and pass between them. A flat grid can only be
 * approached; a corridor can be entered, which is what makes the movement feel
 * spatial rather than like a zoom.
 */
function useSlots(): Slot[] {
  return useMemo(() => {
    const slots: Slot[] = []

    for (let i = 0; i < COUNT; i++) {
      const s = i * 5.717
      // Golden-angle stepping avoids the seams a regular ring would show.
      const angle = i * 2.399963 + seeded(s) * 0.5
      const z = DEPTH / 2 - (i / COUNT) * DEPTH
      const radiusJitter = 0.82 + seeded(s + 1) * 0.35

      const assembled = new THREE.Vector3(
        Math.cos(angle) * RADIUS_X * radiusJitter,
        Math.sin(angle) * RADIUS_Y * radiusJitter,
        z
      )

      // Face inward: build the orientation from a matrix that looks at the
      // axis at this depth, then read it back as Euler angles.
      const look = new THREE.Matrix4().lookAt(
        assembled,
        new THREE.Vector3(0, 0, z),
        new THREE.Vector3(0, 1, 0)
      )
      const assembledRotation = new THREE.Euler().setFromRotationMatrix(look)

      slots.push({
        assembled,
        assembledRotation,
        scattered: new THREE.Vector3(
          (seeded(s + 2) - 0.5) * 34,
          (seeded(s + 3) - 0.5) * 26,
          z - 34 - seeded(s + 4) * 40
        ),
        scatteredRotation: new THREE.Euler(
          (seeded(s + 5) - 0.5) * Math.PI * 1.4,
          (seeded(s + 6) - 0.5) * Math.PI * 1.4,
          (seeded(s + 7) - 0.5) * Math.PI * 1.4
        ),
        floatSeed: seeded(s + 8) * Math.PI * 2,
      })
    }

    return slots
  }, [])
}

function Panel({
  slot,
  url,
  index,
  progress,
}: {
  slot: Slot
  url: string
  index: number
  progress: RefObject<number>
}) {
  const ref = useRef<THREE.Mesh>(null)
  const texture = useTexture(url)

  const image = texture.image as { width: number; height: number } | undefined
  const aspect = image ? image.width / image.height : 0.8
  const [w, h] = aspect >= 1 ? [CELL, CELL / aspect] : [CELL * aspect, CELL]

  useFrame(state => {
    const mesh = ref.current
    if (!mesh) return

    const p = progress.current ?? 0

    // Staggered assembly: each panel starts a little after the previous one,
    // so the wall gathers itself instead of snapping as one block.
    const stagger = (index / COUNT) * 0.3
    const local = easeOut(clamp01((p / 0.45 - stagger) / (1 - stagger || 1)))

    mesh.position.lerpVectors(slot.scattered, slot.assembled, local)
    mesh.rotation.set(
      lerp(slot.scatteredRotation.x, slot.assembledRotation.x, local),
      lerp(slot.scatteredRotation.y, slot.assembledRotation.y, local),
      lerp(slot.scatteredRotation.z, slot.assembledRotation.z, local)
    )

    // Once settled, breathe very slightly so the corridor never looks frozen.
    const t = state.clock.elapsedTime
    mesh.position.x += Math.sin(t * 0.28 + slot.floatSeed) * 0.055 * local
    mesh.position.y += Math.cos(t * 0.24 + slot.floatSeed) * 0.055 * local

    const material = mesh.material as THREE.MeshBasicMaterial
    material.opacity = local
  })

  return (
    <mesh ref={ref} scale={[w, h, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  )
}

function Rig({ progress }: { progress: RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progress.current ?? 0

    // Hold back while the corridor gathers, then travel its whole length.
    // The far end is DEPTH/2 past the origin, so the camera has to overshoot
    // it to actually clear the last panels rather than stopping among them.
    const travel = easeInOut(clamp01((p - 0.35) / 0.65))
    camera.position.z = lerp(DEPTH / 2 + 9, -DEPTH / 2 - 12, travel)

    // Slow drift keeps the flight from reading as a straight rail.
    camera.position.x = Math.sin(travel * Math.PI * 1.4) * 0.85
    camera.position.y = Math.cos(travel * Math.PI * 1.1) * 0.6
    camera.rotation.z = Math.sin(travel * Math.PI) * 0.045
    camera.lookAt(0, 0, camera.position.z - 6)
  })

  return null
}

export default function PhotoCorridorScene({
  images,
  progress,
}: {
  images: string[]
  progress: RefObject<number>
}) {
  const slots = useSlots()

  return (
    <Canvas
      camera={{ position: [0, 0, DEPTH / 2 + 9], fov: 62, near: 0.1, far: 200 }}
      dpr={[1, 1.6]}
      className="h-full w-full"
    >
      <color attach="background" args={['#000000']} />
      {/* Far plane sits beyond the corridor's full length, otherwise the last
          panels are already fogged out by the time they are reached. */}
      <fog attach="fog" args={['#000000', 22, 96]} />
      <Rig progress={progress} />
      <Suspense fallback={null}>
        {slots.map((slot, i) => (
          <Panel
            key={i}
            slot={slot}
            index={i}
            url={images[i % images.length]}
            progress={progress}
          />
        ))}
      </Suspense>
    </Canvas>
  )
}
