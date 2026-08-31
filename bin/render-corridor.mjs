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
 * With `--samples`, the frame is exposed rather than snapped: the corridor is
 * drawn at several progress values across a shutter and the results averaged,
 * which is how a camera makes motion blur. A still of a scroll piece is
 * otherwise mute about the one thing the piece is made of, movement.
 *
 * Node has no WebGL, so the drawing is done by headless Chrome and read back
 * with its built-in screenshot flag.
 *
 * Usage:
 *   node bin/render-corridor.mjs [--progress 0.62] [--width 1600] [--height 1200]
 *                                [--samples 1] [--shutter 0.012] [--headline]
 *                                [--out public/media/mosaique-corridor.png]
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// `--flag value` pairs, plus bare `--flag` switches for the booleans.
const args = new Map()
for (let i = 2; i < process.argv.length; i++) {
  if (!process.argv[i].startsWith('--')) continue
  const next = process.argv[i + 1]
  const value = next && !next.startsWith('--') ? next : 'true'
  args.set(process.argv[i].slice(2), value)
  if (value !== 'true') i++
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

/**
 * Shutter: how much scroll progress goes by while the frame is exposed, split
 * over `samples` renders centred on `progress`. One sample is an instant
 * shutter, which is the frozen still the work cover uses.
 */
const samples = Math.max(1, Math.round(Number(args.get('samples') ?? 1)))
const shutter = Number(args.get('shutter') ?? 0.012)

/** Lays the home page's own title treatment over the frame. */
const headline = args.get('headline') === 'true'

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
const { ARTIST, ROLES } = await import(pathToFileURL(path.join(ROOT, 'lib/content/site.ts')))

// A still can be looked at, so the panels are fed the larger source the live
// scene skips for the sake of load time.
const images = PHOTOS.map(photo => flickrSize(photo.url, 'b'))

// Same faces, sizes and colours as the hero the home page draws over the live
// corridor, so the card is the site's own opening rather than a caption
// invented for it. Sized off the frame height, since the card is far wider
// than it is tall and the site's viewport-relative type would tower over it.
const overlay = headline
  ? `
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400&family=Jost:wght@300&display=swap">
<style>
  .headline {
    position: fixed; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; text-align: center;
  }
  /* On the site the title has cleared before the corridor is this bright, so
     over a mid-flight frame the near-white panels swallow the thin strokes of
     the Bodoni. This sinks the middle of the frame just enough to carry them. */
  .headline::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(72% 46% at 50% 50%, rgba(0,0,0,0.9), rgba(0,0,0,0) 76%);
  }
  .headline h1, .headline p { position: relative; }
  .headline h1 {
    margin: 0; color: #ede9e3; font-weight: 400;
    font-family: 'Bodoni Moda', Didot, Georgia, serif;
    font-size: ${Math.round(height * 0.15)}px; line-height: 0.86; letter-spacing: -0.03em;
  }
  .headline p {
    margin: ${Math.round(height * 0.055)}px 0 0; color: #8a8681;
    font-family: 'Jost', system-ui, sans-serif; font-weight: 300;
    font-size: ${Math.round(height * 0.027)}px; letter-spacing: 0.26em; text-transform: uppercase;
  }
</style>
<div class="headline">
  <h1>${ARTIST}</h1>
  <p>${ROLES.join('&nbsp;&nbsp;/&nbsp;&nbsp;')}</p>
</div>`
  : ''

const page = `<!doctype html>
<meta charset="utf-8">
<style>html,body{margin:0;background:#000;overflow:hidden}canvas{display:block}</style>
${overlay}
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
const SAMPLES = ${samples}
const SHUTTER = ${shutter}
const WIDTH = ${width}
const HEIGHT = ${height}

// Mirrors what react-three-fiber sets up for the live canvas: same colour
// pipeline, same atmosphere, same camera.
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(1)
renderer.setSize(WIDTH, HEIGHT, false)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping

const scene = new THREE.Scene()
scene.background = new THREE.Color(BACKGROUND)
scene.fog = new THREE.Fog(BACKGROUND, FOG_NEAR, FOG_FAR)

const camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR)

const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')
const textures = await Promise.all(IMAGES.map(url => loader.loadAsync(url)))

// Built once and moved per sample: an exposure is the same corridor caught at
// several moments, not several corridors.
const panels = corridorSlots().map((slot, index) => {
  const texture = textures[index % textures.length]
  const [w, h] = panelSize(texture.image.width / texture.image.height)
  const material = new THREE.MeshBasicMaterial({
    map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0, toneMapped: false,
  })
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
  mesh.scale.set(w, h, 1)
  scene.add(mesh)
  return { slot, index, mesh, material }
})

// Time is pinned to zero so the same progress always bakes the same frame.
function renderAt(at) {
  for (const panel of panels) {
    panel.material.opacity =
      placePanel(panel.slot, panel.index, at, 0, panel.mesh.position, panel.mesh.rotation)
  }
  placeCamera(camera, at)
  renderer.render(scene, camera)
}

const canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
const ctx = canvas.getContext('2d', { willReadFrequently: true })
document.body.insertBefore(canvas, document.body.firstChild)

if (SAMPLES === 1) {
  renderAt(PROGRESS)
  ctx.drawImage(renderer.domElement, 0, 0)
} else {
  // The samples are averaged in linear light, the way a sensor integrates it.
  // Averaged as stored, the bright edge of a card swept across black would
  // come out a dull grey band instead of a streak of light.
  const toLinear = new Float32Array(256)
  for (let v = 0; v < 256; v++) {
    const c = v / 255
    toLinear[v] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }

  const accumulator = new Float32Array(WIDTH * HEIGHT * 3)

  for (let s = 0; s < SAMPLES; s++) {
    // Centred on PROGRESS: the moment asked for stays the middle of the
    // exposure, with the corridor arriving into it and leaving it.
    const at = PROGRESS + SHUTTER * (s / (SAMPLES - 1) - 0.5)
    renderAt(at)

    ctx.clearRect(0, 0, WIDTH, HEIGHT)
    ctx.drawImage(renderer.domElement, 0, 0)
    const { data } = ctx.getImageData(0, 0, WIDTH, HEIGHT)

    for (let p = 0, a = 0; p < data.length; p += 4, a += 3) {
      accumulator[a] += toLinear[data[p]]
      accumulator[a + 1] += toLinear[data[p + 1]]
      accumulator[a + 2] += toLinear[data[p + 2]]
    }
  }

  const encode = linear => {
    const c = linear <= 0.0031308 ? linear * 12.92 : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
    return Math.round(Math.min(1, Math.max(0, c)) * 255)
  }

  const exposed = ctx.createImageData(WIDTH, HEIGHT)
  for (let p = 0, a = 0; p < exposed.data.length; p += 4, a += 3) {
    exposed.data[p] = encode(accumulator[a] / SAMPLES)
    exposed.data[p + 1] = encode(accumulator[a + 1] / SAMPLES)
    exposed.data[p + 2] = encode(accumulator[a + 2] / SAMPLES)
    exposed.data[p + 3] = 255
  }

  ctx.putImageData(exposed, 0, 0)
}

renderer.dispose()
await document.fonts.ready
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

const exposure = samples === 1 ? 'instant' : `${samples} samples over ${shutter} of progress`
console.log(`wrote ${path.relative(ROOT, out)} (${width}x${height}, progress ${progress}, ${exposure})`)
