'use client'

import { Suspense, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import {
  BACKGROUND,
  FAR,
  FOG_FAR,
  FOG_NEAR,
  FOV,
  NEAR,
  CAMERA_Z_START,
  corridorSlots,
  panelSize,
  placeCamera,
  placePanel,
  type Slot,
} from '@/lib/three/corridor'

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
  const [w, h] = panelSize(image ? image.width / image.height : 0.8)

  useFrame(state => {
    const mesh = ref.current
    if (!mesh) return

    const opacity = placePanel(
      slot,
      index,
      progress.current ?? 0,
      state.clock.elapsedTime,
      mesh.position,
      mesh.rotation
    )

    const material = mesh.material as THREE.MeshBasicMaterial
    material.opacity = opacity
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
  useFrame(({ camera }) => placeCamera(camera, progress.current ?? 0))
  return null
}

export default function PhotoCorridorScene({
  images,
  progress,
}: {
  images: string[]
  progress: RefObject<number>
}) {
  const slots = useMemo(() => corridorSlots(), [])

  return (
    <Canvas
      camera={{ position: [0, 0, CAMERA_Z_START], fov: FOV, near: NEAR, far: FAR }}
      dpr={[1, 1.6]}
      className="h-full w-full"
    >
      <color attach="background" args={[BACKGROUND]} />
      <fog attach="fog" args={[BACKGROUND, FOG_NEAR, FOG_FAR]} />
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
