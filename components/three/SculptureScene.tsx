'use client'

import { Suspense, useEffect, useMemo, useRef, type RefObject } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export const MODEL_PATH = '/models/donutHalloweenMayeul.glb'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/** Maps a value in [from, to] onto [0, 1], clamped outside that window. */
const range = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))

/**
 * The Blender export, revealed the way it was built: wireframe first, then
 * shaded clay, then the finished render under coloured light.
 *
 * Two clones of the scene share the same geometry (Object3D.clone does not
 * copy BufferGeometry), so the second pass costs almost nothing in memory.
 * Only the handful of unique materials get cloned, and opacity is driven on
 * those rather than per mesh: the file has 609 nodes but just five materials,
 * so touching the materials is two orders of magnitude cheaper per frame.
 */
interface Built {
  wireScene: THREE.Object3D
  solidScene: THREE.Object3D
}

/** Collects the distinct materials under an object, so per-frame work touches each once. */
function uniqueMaterials(root: THREE.Object3D): THREE.Material[] {
  const found = new Set<THREE.Material>()
  root.traverse(object => {
    const material = (object as THREE.Mesh).material
    if (!material) return
    if (Array.isArray(material)) material.forEach(m => found.add(m))
    else found.add(material)
  })
  return Array.from(found)
}

function build(scene: THREE.Object3D): Built {
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: '#ede9e3',
    wireframe: true,
    transparent: true,
    opacity: 1,
    depthWrite: false,
  })

  const wireScene = scene.clone(true)
  wireScene.traverse(object => {
    if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).material = wireMaterial
  })

  const solidScene = scene.clone(true)
  const seen = new Map<THREE.Material, THREE.Material>()
  solidScene.traverse(object => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return
    const source = mesh.material as THREE.Material
    let clone = seen.get(source)
    if (!clone) {
      clone = source.clone()
      clone.transparent = true
      clone.opacity = 0
      seen.set(source, clone)
    }
    mesh.material = clone
  })

  // Normalise: the export carries no camera and its origin and scale are
  // whatever Blender left them, so the model is measured here and centred.
  // This keeps the framing correct for any future export.
  const box = new THREE.Box3().setFromObject(solidScene)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const scaleFactor = 2.6 / (Math.max(size.x, size.y, size.z) || 1)
  const offset = center.clone().multiplyScalar(scaleFactor)

  for (const target of [wireScene, solidScene]) {
    target.scale.setScalar(scaleFactor)
    target.position.copy(offset).negate()
  }

  return { wireScene, solidScene }
}

function Model({ progress }: { progress: RefObject<number> }) {
  const { scene } = useGLTF(MODEL_PATH)
  const pivot = useRef<THREE.Group>(null)

  // Construction in a memo is fine; what the compiler forbids is treating a
  // memo's result as mutable state. So the scenes are only ever *read* here,
  // and every per-frame write goes through the refs attached below.
  const built = useMemo(() => build(scene), [scene])

  const wireRef = useRef<THREE.Object3D>(null)
  const solidRef = useRef<THREE.Object3D>(null)
  const materialsRef = useRef<{ wire: THREE.Material[]; solid: THREE.Material[] } | null>(null)

  // Cloned materials belong to this component and must be released. Collected
  // from the built scenes rather than from materialsRef: touching that ref
  // here would tie it to this effect, and it is written every frame.
  // Geometry is shared with the cached source scene, so it is not disposed.
  useEffect(() => {
    const { wireScene, solidScene } = built
    return () => {
      uniqueMaterials(wireScene).forEach(material => material.dispose())
      uniqueMaterials(solidScene).forEach(material => material.dispose())
    }
  }, [built])

  useFrame((state, delta) => {
    const group = pivot.current
    const wire = wireRef.current
    const solid = solidRef.current
    if (!group || !wire || !solid) return

    // Gather the distinct materials once, off the mounted objects, rather
    // than traversing 609 nodes on every frame.
    if (!materialsRef.current) {
      materialsRef.current = { wire: uniqueMaterials(wire), solid: uniqueMaterials(solid) }
    }
    const materials = materialsRef.current

    const p = clamp01(progress.current ?? 0)

    // Wireframe holds, then hands over to the shaded model.
    const wireOut = range(p, 0.26, 0.46)
    for (const material of materials.wire) material.opacity = 1 - wireOut
    wire.visible = wireOut < 1

    const solidIn = range(p, 0.3, 0.5)
    for (const material of materials.solid) material.opacity = solidIn
    solid.visible = solidIn > 0

    // Scroll owns the rotation: a turn and a half, so the object is read from
    // every side on the way past.
    group.rotation.y = lerp(group.rotation.y, p * Math.PI * 3, 0.08)
    group.rotation.x = lerp(group.rotation.x, -0.32 + p * 0.42, 0.06)
    group.rotation.z += delta * 0.015

    const { x, y } = state.pointer
    group.position.x = lerp(group.position.x, x * 0.2, 0.04)
    group.position.y = lerp(group.position.y, y * 0.14, 0.04)
  })

  return (
    <group ref={pivot}>
      <primitive ref={wireRef} object={built.wireScene} />
      <primitive ref={solidRef} object={built.solidScene} />
    </group>
  )
}

/**
 * Lighting ramps in only once the model is shaded, so the wireframe stage
 * reads as a construction view rather than an underlit render. The three
 * colours are the reference: magenta key, green rim from the left, warm
 * bounce from the lower right.
 */
function Lights({ progress }: { progress: RefObject<number> }) {
  const key = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.PointLight>(null)
  const bounce = useRef<THREE.PointLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const p = clamp01(progress.current ?? 0)
    const neon = range(p, 0.46, 0.8)
    const clay = range(p, 0.3, 0.5)

    if (fill.current) fill.current.intensity = clay * (1 - neon * 0.75) * 2.2
    if (key.current) key.current.intensity = neon * 42
    if (rim.current) rim.current.intensity = neon * 30
    if (bounce.current) bounce.current.intensity = neon * 26
  })

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight ref={fill} position={[2.5, 4, 3]} intensity={0} />
      <pointLight ref={key} position={[2.4, 2.2, 2.2]} color="#8b5cf6" intensity={0} distance={14} />
      <pointLight ref={rim} position={[-3.4, -0.4, 1.2]} color="#22c55e" intensity={0} distance={12} />
      <pointLight ref={bounce} position={[1.8, -2.6, 1.6]} color="#f97316" intensity={0} distance={12} />
    </>
  )
}

function Rig({ progress }: { progress: RefObject<number> }) {
  useFrame(({ camera }) => {
    const p = clamp01(progress.current ?? 0)
    camera.position.z = lerp(6.6, 3.3, p)
    camera.position.y = lerp(1.0, 0.2, p)
    camera.lookAt(0, 0, 0)
  })

  return null
}

export default function SculptureScene({ progress }: { progress: RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 6.6], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
      className="h-full w-full"
    >
      <color attach="background" args={['#070707']} />
      <Lights progress={progress} />
      <Rig progress={progress} />
      {/* useGLTF suspends. Without a boundary inside the Canvas the whole
          scene never renders, which is why the model appeared not to load. */}
      <Suspense fallback={null}>
        <Model progress={progress} />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload(MODEL_PATH)
