/**
 * The corridor: where the archive's photographs stand in space, and how they
 * gather out of the dark and then get flown through as progress runs 0 to 1.
 *
 * Framework-free on purpose, because two unrelated consumers need the exact
 * same maths: `PhotoCorridorScene` renders it live in the browser, and
 * `bin/render-corridor.mjs` bakes a single frame of it into the still used as
 * the project's cover. Sharing the choreography is what makes that still an
 * actual frame of the piece rather than a lookalike.
 */
import * as THREE from 'three'

export const COUNT = 30
export const RADIUS_X = 4.6
export const RADIUS_Y = 3.1
export const DEPTH = 46
export const CELL = 2.5

/** Camera and atmosphere, exported so a baked frame can match the live canvas. */
export const FOV = 62
export const NEAR = 0.1
export const FAR = 200
export const BACKGROUND = '#000000'
/** Far plane sits beyond the corridor's full length, otherwise the last
    panels are already fogged out by the time they are reached. */
export const FOG_NEAR = 22
export const FOG_FAR = 96

/** Camera z at rest, and past the far end: it has to overshoot to actually
    clear the last panels rather than stopping among them. */
export const CAMERA_Z_START = DEPTH / 2 + 9
export const CAMERA_Z_END = -DEPTH / 2 - 12

const clamp01 = (t) => Math.min(1, Math.max(0, t))
const lerp = (a, b, t) => a + (b - a) * t
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** Deterministic pseudo-random: the scatter must look arbitrary but stay identical across renders. */
export function seeded(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

/**
 * @typedef {object} Slot
 * @property {THREE.Vector3} assembled
 * @property {THREE.Euler} assembledRotation rotation that makes the plane face the corridor axis
 * @property {THREE.Vector3} scattered
 * @property {THREE.Euler} scatteredRotation
 * @property {number} floatSeed
 */

/**
 * Photographs arranged on the inside of an elliptical corridor, so the camera
 * can travel down its axis and pass between them. A flat grid can only be
 * approached; a corridor can be entered, which is what makes the movement feel
 * spatial rather than like a zoom.
 *
 * @returns {Slot[]}
 */
export function corridorSlots() {
  /** @type {Slot[]} */
  const slots = []

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
}

/** Plane dimensions for a photograph, fitted inside one cell. */
export function panelSize(aspect) {
  return aspect >= 1 ? [CELL, CELL / aspect] : [CELL * aspect, CELL]
}

/**
 * Move one panel to where it belongs at this progress, writing into the
 * caller's vectors so nothing is allocated per frame.
 *
 * @param {Slot} slot
 * @param {number} index
 * @param {number} progress scroll progress, 0 to 1
 * @param {number} time elapsed seconds, for the settled drift
 * @param {THREE.Vector3} position
 * @param {THREE.Euler} rotation
 * @returns {number} the panel's opacity
 */
export function placePanel(slot, index, progress, time, position, rotation) {
  // Staggered assembly: each panel starts a little after the previous one,
  // so the wall gathers itself instead of snapping as one block.
  const stagger = (index / COUNT) * 0.3
  const local = easeOut(clamp01((progress / 0.45 - stagger) / (1 - stagger || 1)))

  position.lerpVectors(slot.scattered, slot.assembled, local)
  rotation.set(
    lerp(slot.scatteredRotation.x, slot.assembledRotation.x, local),
    lerp(slot.scatteredRotation.y, slot.assembledRotation.y, local),
    lerp(slot.scatteredRotation.z, slot.assembledRotation.z, local)
  )

  // Once settled, breathe very slightly so the corridor never looks frozen.
  position.x += Math.sin(time * 0.28 + slot.floatSeed) * 0.055 * local
  position.y += Math.cos(time * 0.24 + slot.floatSeed) * 0.055 * local

  return local
}

/**
 * @param {THREE.Camera} camera
 * @param {number} progress scroll progress, 0 to 1
 */
export function placeCamera(camera, progress) {
  // Hold back while the corridor gathers, then travel its whole length.
  const travel = easeInOut(clamp01((progress - 0.35) / 0.65))
  camera.position.z = lerp(CAMERA_Z_START, CAMERA_Z_END, travel)

  // Slow drift keeps the flight from reading as a straight rail.
  camera.position.x = Math.sin(travel * Math.PI * 1.4) * 0.85
  camera.position.y = Math.cos(travel * Math.PI * 1.1) * 0.6
  camera.lookAt(0, 0, camera.position.z - 6)
}
