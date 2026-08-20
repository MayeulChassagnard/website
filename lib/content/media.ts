/**
 * Real media, harvested once and baked in.
 *
 * Photographs come from the public Flickr feed of 144524412@N07 (which also
 * mirrors the Instagram posts), videos from the YouTube playlist
 * PLF4JkPm1waWLrslI1A7uTNCuaKcGYhUIg. Resolved once via Flickr/YouTube
 * oEmbed and written here on purpose: both URL shapes are permanently
 * stable, so baking them keeps the site off any runtime scraping.
 *
 * Instagram is not fetched directly. Enumerating a profile needs the Meta
 * Graph API (app review, business account), and its CDN URLs are signed with
 * short expiries, so they cannot be baked. The Flickr mirror covers it.
 *
 * To refresh: re-run the harvest against the Flickr feed and playlist.
 */

export interface Photo {
  id: string
  url: string
  width: number
  height: number
}

export interface Video {
  id: string
  title: string
  /** youtube thumbnail, used as the poster frame */
  poster: string
}

/**
 * A short film held as a file rather than on a platform.
 *
 * Flickr hosts these too, but only behind a redirect whose target is signed
 * with a short expiry, so the URL cannot be baked the way the photographs are.
 * The file is served from public/ instead.
 */
export interface Clip {
  id: string
  title: string
  src: string
  poster: string
  width: number
  height: number
}

/** Flickr size suffixes are interchangeable: _c=800, _b=1024, _h=1600, _k=2048. */
export function flickrSize(url: string, size: 'c' | 'b' | 'h' | 'k'): string {
  return url.replace(/_[a-z]\.jpg$/, `_${size}.jpg`)
}

export function youtubePoster(id: string, quality: 'hq' | 'maxres' = 'maxres'): string {
  return `https://i.ytimg.com/vi/${id}/${quality}default.jpg`
}

export const PHOTOS: Photo[] = [
  { id: '51346544995', url: 'https://live.staticflickr.com/65535/51346544995_e4acf7224e_b.jpg', width: 819, height: 1024 },
  { id: '51238094784', url: 'https://live.staticflickr.com/65535/51238094784_bf939c5363_b.jpg', width: 819, height: 1024 },
  { id: '51210397281', url: 'https://live.staticflickr.com/65535/51210397281_528cf478dc_b.jpg', width: 819, height: 1024 },
  { id: '51180165802', url: 'https://live.staticflickr.com/65535/51180165802_e9970a7382_b.jpg', width: 819, height: 1024 },
  { id: '51012797360', url: 'https://live.staticflickr.com/65535/51012797360_b820c7ee49_b.jpg', width: 816, height: 1020 },
  { id: '51033667806', url: 'https://live.staticflickr.com/65535/51033667806_e36a34405f_b.jpg', width: 819, height: 1024 },
  { id: '51008535067', url: 'https://live.staticflickr.com/65535/51008535067_29f71fef4b_b.jpg', width: 1024, height: 682 },
  { id: '50924948962', url: 'https://live.staticflickr.com/65535/50924948962_79152421d6_b.jpg', width: 819, height: 1024 },
  { id: '50910016673', url: 'https://live.staticflickr.com/65535/50910016673_799f1465f1_b.jpg', width: 819, height: 1024 },
  { id: '50864936257', url: 'https://live.staticflickr.com/65535/50864936257_44fcc68c16_b.jpg', width: 819, height: 1024 },
  { id: '50794615336', url: 'https://live.staticflickr.com/65535/50794615336_3692ed3bea_c.jpg', width: 800, height: 800 },
  { id: '50764364957', url: 'https://live.staticflickr.com/65535/50764364957_483570f0d0_c.jpg', width: 639, height: 800 },
  { id: '50745494523', url: 'https://live.staticflickr.com/65535/50745494523_d44a9491e0_b.jpg', width: 815, height: 1019 },
  { id: '50734951218', url: 'https://live.staticflickr.com/65535/50734951218_f58d277cb5_c.jpg', width: 800, height: 800 },
  { id: '50705125122', url: 'https://live.staticflickr.com/65535/50705125122_a587419f8c_b.jpg', width: 819, height: 1024 },
  { id: '50694239621', url: 'https://live.staticflickr.com/65535/50694239621_737a8e0396_b.jpg', width: 819, height: 1024 },
  { id: '50646763938', url: 'https://live.staticflickr.com/65535/50646763938_75e6bd90be_c.jpg', width: 640, height: 800 },
  { id: '50611720178', url: 'https://live.staticflickr.com/65535/50611720178_c939618fd0_b.jpg', width: 820, height: 1024 },
  { id: '50596229077', url: 'https://live.staticflickr.com/65535/50596229077_de72444f36_b.jpg', width: 1024, height: 704 },
  { id: '50585949191', url: 'https://live.staticflickr.com/65535/50585949191_eccee1cbba_b.jpg', width: 816, height: 1020 },

  // Work stills, picked by hand rather than taken from the top of the feed.
  // Appended so the indexes above stay put.
  { id: '49744745428', url: 'https://live.staticflickr.com/65535/49744745428_79a9217aea_b.jpg', width: 819, height: 1024 },
  { id: '49745290406', url: 'https://live.staticflickr.com/65535/49745290406_16f468f957_b.jpg', width: 819, height: 1024 },

  // Lapland 2020, from album 72157713788947017. The film has its own set of
  // stills, and they are not in the feed window the list above was taken from.
  { id: '49744719848', url: 'https://live.staticflickr.com/65535/49744719848_20e590db05_b.jpg', width: 1024, height: 576 },
  { id: '49745258836', url: 'https://live.staticflickr.com/65535/49745258836_7cced767e5_b.jpg', width: 683, height: 1024 },
  { id: '49745263011', url: 'https://live.staticflickr.com/65535/49745263011_209e7734bc_b.jpg', width: 683, height: 1024 },
  { id: '49745264506', url: 'https://live.staticflickr.com/65535/49745264506_8e68caf5cb_b.jpg', width: 1024, height: 683 },

  // me
  { id: '49744746893', url: 'https://images.ctfassets.net/zfvbep08kr6e/6Ly3lzM3kzgsvEAA0bCPKA/b9dafe1bf7f3ca9ece91abdc59bd3a1e/drone_wedding.jpg', width: 534, height: 800 },
]

export const VIDEOS: Video[] = [
  { id: 'tOSGCcXhocA', title: 'Pasta fresca e basta', poster: youtubePoster('tOSGCcXhocA') },
  { id: 'F5iFeShjpSs', title: 'Lapland Twenty Twenty', poster: youtubePoster('F5iFeShjpSs') },
  { id: 'OnT7Wmx-vqs', title: 'Farwest France', poster: youtubePoster('OnT7Wmx-vqs') },
  { id: 'oxeIgAhvkm8', title: 'La Malaysia Por La Mama', poster: youtubePoster('oxeIgAhvkm8') },
  { id: 'zUGE2yBJfus', title: 'From Chambéry to Grenoble', poster: youtubePoster('zUGE2yBJfus') },
  { id: '7erL7cx2XKc', title: 'Quarantine Transformation', poster: youtubePoster('7erL7cx2XKc') },
  { id: 'GWQr1e8WlIw', title: 'Alexis & Jessica', poster: youtubePoster('GWQr1e8WlIw') },
]

export const CLIPS: Clip[] = [
  {
    id: 'cgi-coffee',
    title: 'CGI Coffee',
    src: '/media/cgi-coffee.mp4',
    poster: 'https://live.staticflickr.com/31337/49745606952_2e6ae22566_z.jpg',
    width: 640,
    height: 426,
  },
]

/**
 * One frame of the Mosaïque corridor, baked by `bin/render-corridor.mjs`.
 *
 * That work is a WebGL scene made of the archive itself, so no photograph in
 * PHOTOS can stand in for it: any of them would show a fragment instead of the
 * piece. This is the scene rendered mid-flight, and it serves both as the
 * project's cover and as what is shown when the canvas cannot run.
 *
 * Re-run the script after changing `lib/three/corridor.js`, otherwise the
 * still keeps showing the corridor as it used to be.
 */
export const CORRIDOR_STILL = {
  url: '/media/mosaique-corridor.png',
  width: 1600,
  height: 1200,
}

/**
 * Source plates: the state a finished image was assembled from.
 *
 * Kept out of PHOTOS on purpose. That array is swept whole into the
 * corridor, the stacks and the lightbox, and a breakdown sheet on white is
 * evidence about a work rather than a work, so it would read as a stray
 * file hung on the wall.
 */
export const PLATES: Photo[] = [
  { id: '49744746893', url: 'https://live.staticflickr.com/65535/49744746893_397b974a08_b.jpg', width: 819, height: 1024 },
]

export const photoById = (id: string) => PHOTOS.find(p => p.id === id)
export const videoById = (id: string) => VIDEOS.find(v => v.id === id)
export const clipById = (id: string) => CLIPS.find(c => c.id === id)
export const plateById = (id: string) => PLATES.find(p => p.id === id)

/**
 * Position of a photograph in PHOTOS.
 *
 * Projects address their images through this rather than by writing the
 * number, so a page says which photograph it means and nothing silently
 * re-points when the archive is added to or reordered.
 */
export function photoIndexOf(id: string): number {
  const index = PHOTOS.findIndex(photo => photo.id === id)
  if (index < 0) throw new Error(`Unknown photo id: ${id}`)
  return index
}
