'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import { useScrollProgress } from '@/lib/motion/scrollProgress'

/**
 * Renders an exported Blender scene, driven by the shared scroll progress
 * store (same one the assembly hero uses).
 *
 * Blender's .blend format cannot be loaded by a browser. Export via
 * File > Export > glTF 2.0 (.glb), which packs meshes, materials and
 * textures into a single binary file, and drop it in public/models/.
 * Then set MODEL_PATH below and render <BlenderScene /> from a page.
 *
 * Keep the export lean for the web: decimate heavy meshes, bake lighting
 * where possible, and keep textures at or under 2k. A .glb over ~8MB will
 * hurt load time badly on mobile.
 */
export const MODEL_PATH = '/models/scene.glb'

function Model({ path }: { path: string }) {
  const { scene } = useGLTF(path)
  const ref = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!ref.current) return
    const progress = useScrollProgress.getState().progress
    // Full turn across the pinned scroll range, with a slight rise.
    ref.current.rotation.y = progress * Math.PI * 2
    ref.current.position.y = -0.5 + progress * 0.5
  })

  return <primitive ref={ref} object={scene} />
}

export default function BlenderScene({ path = MODEL_PATH }: { path?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]} className="h-full w-full">
      <Suspense fallback={null}>
        <Model path={path} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  )
}
