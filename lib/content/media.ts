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

export const photoById = (id: string) => PHOTOS.find(p => p.id === id)
export const videoById = (id: string) => VIDEOS.find(v => v.id === id)
