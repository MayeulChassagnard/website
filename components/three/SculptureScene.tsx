'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const MODEL_PATH = '/models/donutHalloweenMayeul.glb'

/**
 * The Blender export, presented as a sculpture on a plinth.
 *
 * The file carries no camera and no animation, and its origin and scale are
 * whatever Blender left them as, so the model is measured at runtime and
 * normalised: centred on its own bounding box and scaled so its largest
 * dimension fills a fixed height. That way the framing holds for any future
 * export without hand-tuning numbers here.
 */
function Model() {
  const { scene } = useGLTF(MODEL_PATH)
  const pivot = useRef<THREE.Group>(null)

  // Clone so remounting never mutates the cached source scene.
  const model = useMemo(() => scene.clone(true), [scene])

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const largest = Math.max(size.x, size.y, size.z) || 1

    // Re-centre on the origin, then bring the longest axis to ~2.6 units,
    // which is what the camera below is framed for.
    model.position.sub(center)
    model.scale.setScalar(2.6 / largest)
  }, [model])

  useFrame((state, delta) => {
    const group = pivot.current
    if (!group) return

    // Plinth speed, not animation speed.
    group.rotation.y += delta * 0.16

    // The barest lean toward the pointer, eased so it never snaps.
    const { x, y } = state.pointer
    group.rotation.x += (y * 0.22 - group.rotation.x) * 0.03
    group.position.x += (x * 0.18 - group.position.x) * 0.03
  })

  return (
    <group ref={pivot}>
      <primitive object={model} />
    </group>
  )
}

useGLTF.preload(MODEL_PATH)

export default function SculptureScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      className="h-full w-full"
    >
      <color attach="background" args={['#070707']} />

      {/* Single dominant key light with a cold rim, gallery lighting rather
          than a product shot. */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4.5, 2.5]} intensity={2.4} />
      <directionalLight position={[-4, -1.5, -3]} intensity={0.6} color="#8fa2b8" />

      <Model />
      <Environment preset="night" />
    </Canvas>
  )
}
