#!/usr/bin/env node
/**
 * Bakes one frame of the Mosaïque corridor into a still image.
 *
 * The piece only exists as a WebGL scene driven by scroll, so the work index
 * had no honest way to show it. This renders a real frame of it instead: the
 * page below imports `lib/three/corridor.js`, the very module the live scene
 * runs on, and asks it for the corridor at a given scroll progress. Nothing
 * here reimplements the choreography, so the cover cannot drift away from the
 * work it stands for.
 *
 * Node has no WebGL, so the drawing is done by headless Chrome and read back
 * with its built-in screenshot flag.
 *
 * Usage:
 *   node bin/render-corridor.mjs [--progress 0.55] [--width 1600] [--height 1200]
 *                                [--out public/media/mosaique-corridor.png]
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const args = new Map()
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ''), process.argv[i + 1])
}

/**
 * Mid-flight: the corridor is gathered and the camera is inside it, near cards
 * running off the frame and the spiral still reaching away into the dark. The
 * default is the frame the committed still was baked from, so re-running this
 * reproduces the cover rather than quietly replacing it with another moment.
 */
const progress = Number(args.get('progress') ?? 0.62)
const width = Number(args.get('width') ?? 1600)
const height = Number(args.get('height') ?? 1200)
const out = path.resolve(ROOT, args.get('out') ?? 'public/media/mosaique-corridor.png')

/** Chrome ships the headless renderer and a screenshot flag, so nothing else is needed. */
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean)

  const found = candidates.find(candidate => existsSync(candidate))
  if (!found) throw new Error('Chrome not found. Set CHROME_PATH to its executable.')
  return found
}

const { PHOTOS, flickrSize } = await import(pathToFileURL(path.join(ROOT, 'lib/content/media.ts')))

// A still can be looked at, so the panels are fed the larger source the live
// scene skips for the sake of load time.
const images = PHOTOS.map(photo => flickrSize(photo.url, 'b'))

const page = `<!doctype html>
<meta charset="utf-8">
<style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style>
<script type="importmap">
${JSON.stringify({ imports: { three: pathToFileURL(path.join(ROOT, 'node_modules/three/build/three.module.js')).href } }, null, 2)}
</script>
<script type="module">
import * as THREE from 'three'
import {
  BACKGROUND, FAR, FOG_FAR, FOG_NEAR, FOV, NEAR,
  corridorSlots, panelSize, placeCamera, placePanel,
} from ${JSON.stringify(pathToFileURL(path.join(ROOT, 'lib/three/corridor.js')).href)}

const IMAGES = ${JSON.stringify(images)}
const PROGRESS = ${progress}
const WIDTH = ${width}
const HEIGHT = ${height}

// Mirrors what react-three-fiber sets up for the live canvas: same colour
// pipeline, same atmosphere, same camera.
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(WIDTH, HEIGHT, false)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(BACKGROUND)
scene.fog = new THREE.Fog(BACKGROUND, FOG_NEAR, FOG_FAR)

const camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR)

const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')
const textures = await Promise.all(IMAGES.map(url => loader.loadAsync(url)))

// Time is pinned to zero so the same progress always bakes the same frame.
for (const [i, slot] of corridorSlots().entries()) {
  const texture = textures[i % textures.length]
  const [w, h] = panelSize(texture.image.width / texture.image.height)
  const material = new THREE.MeshBasicMaterial({
    map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0, toneMapped: false,
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  mesh.scale.set(w, h, 1)
  material.opacity = placePanel(slot, i, PROGRESS, 0, mesh.position, mesh.rotation)
  scene.add(mesh)
}

placeCamera(camera, PROGRESS)
renderer.render(scene, camera)
document.title = 'corridor-ready'
</script>
`

const work = mkdtempSync(path.join(tmpdir(), 'corridor-'))
const html = path.join(work, 'corridor.html')
writeFileSync(html, page)
mkdirSync(path.dirname(out), { recursive: true })

const result = spawnSync(
  findChrome(),
  [
    '--headless=new',
    '--disable-gpu',
    // Software WebGL: there is no GPU to bind to in a headless run.
    '--enable-unsafe-swiftshader',
    '--no-sandbox',
    // ES modules over file:// are cross-origin without it, and the page imports
    // the corridor module straight from the repo.
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${path.join(work, 'profile')}`,
    `--window-size=${width},${height}`,
    // Lets the textures finish downloading before the frame is captured.
    '--virtual-time-budget=60000',
    `--screenshot=${out}`,
    pathToFileURL(html).href,
  ],
  { encoding: 'utf8' }
)

rmSync(work, { recursive: true, force: true })

if (!existsSync(out)) {
  console.error(result.stderr || result.stdout || 'Chrome wrote nothing.')
  process.exit(1)
}

console.log(`wrote ${path.relative(ROOT, out)} (${width}x${height}, progress ${progress})`)
