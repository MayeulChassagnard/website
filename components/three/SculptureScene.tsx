'use client'

import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const MODEL_PATH = '/models/donutHalloweenMayeul.glb'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/**
 * The Blender export, presented as a sculpture whose viewing angle is driven
 * by the page.
 *
 * The file carries no camera and no animation, and its origin and scale are
 * whatever Blender left them, so the model is measured at runtime and
 * normalised: centred on its own bounding box, then scaled so its longest axis
 * matches what the camera is framed for. That keeps the framing correct for any
 * future export without hand-tuned numbers here.
 */
function Model({ progress }: { progress: RefObject<number> }) {
  const { scene } = useGLTF(MODEL_PATH)
  const pivot = useRef<THREE.Group>(null)

  // Clone so a remount never mutates the cached source scene.
  const model = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const largest = Math.max(size.x, size.y, size.z) || 1

    model.position.sub(center)
    model.scale.setScalar(2.6 / largest)
  }, [model])

  useFrame((state, delta) => {
    const group = pivot.current
    if (!group) return

    const p = clamp01(progress.current ?? 0)

    // Scroll owns the primary rotation: a full turn and a half across the pin,
    // so the object is read from every side on the way past.
    const target = p * Math.PI * 3
    group.rotation.y = lerp(group.rotation.y, target, 0.08)

    // Tips forward through the first half, then levels off.
    group.rotation.x = lerp(group.rotation.x, -0.35 + p * 0.5, 0.06)

    // Continuous slow drift so it is never completely static when the page is.
    group.rotation.z += delta * 0.02

    // The barest lean toward the pointer.
    const { x, y } = state.pointer
    group.position.x = lerp(group.position.x, x * 0.2, 0.04)
    group.position.y = lerp(group.position.y, y * 0.14, 0.04)
  })

  return (
    <group ref={pivot}>
      <primitive object={model} />
    </group>
  )
}

function Rig({ progress }: { progress: RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = clamp01(progress.current ?? 0)
    // Pull in as the section is scrolled, so the object grows without the
    // model itself being scaled.
    camera.position.z = lerp(6.4, 3.1, p)
    camera.position.y = lerp(0.9, 0.15, p)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function SculptureScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0.9, 6.4], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      className="h-full w-full"
    >
      <color attach="background" args={['#070707']} />

      {/* One dominant key with a cold rim: gallery lighting, not a product shot. */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4.5, 2.5]} intensity={2.4} />
      <directionalLight position={[-4, -1.5, -3]} intensity={0.6} color="#8fa2b8" />

      <Model progress={progress} />
      <Rig progress={progress} />
      <Environment preset="night" />
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
