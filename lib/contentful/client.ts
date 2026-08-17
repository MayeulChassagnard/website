/**
 * Thin wrapper over the Contentful Content Delivery API using native `fetch`
 * (not the `contentful` SDK: it doesn't reliably route through Next's
 * patched fetch, which breaks the Full Route Cache and revalidateTag()).
 */

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master'

export interface CdaSysLink {
  sys: { type: 'Link'; linkType: 'Asset' | 'Entry'; id: string }
}

export interface CdaEntry<Fields = Record<string, unknown>> {
  sys: { id: string; contentType: { sys: { id: string } } }
  fields: Fields
}

export interface CdaAssetFields {
  title: string
  file: {
    url: string
    contentType: string
    details: { image?: { width: number; height: number } }
  }
}

export type CdaAsset = CdaEntry<CdaAssetFields>

export interface CdaResponse<Fields = Record<string, unknown>> {
  items: CdaEntry<Fields>[]
  includes?: { Entry?: CdaEntry[]; Asset?: CdaAsset[] }
}

export function isLink(value: unknown): value is CdaSysLink {
  return (
    typeof value === 'object' &&
    value !== null &&
    'sys' in value &&
    (value as CdaSysLink).sys?.type === 'Link'
  )
}

/** Fetches entries from the CDA. `contentType` is the Contentful content type API ID. */
export async function fetchEntries<Fields = Record<string, unknown>>(
  contentType: string,
  query: Record<string, string> = {},
  { tags, revalidate }: { tags?: string[]; revalidate?: number } = {}
): Promise<CdaResponse<Fields>> {
  if (!SPACE_ID || !DELIVERY_TOKEN) {
    throw new Error(
      'CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN are not set in the environment.'
    )
  }

  const params = new URLSearchParams({
    access_token: DELIVERY_TOKEN,
    content_type: contentType,
    ...query,
  })

  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?${params}`,
    { next: { tags: tags ?? [contentType], revalidate: revalidate ?? 3600 } }
  )

  if (!res.ok) {
    throw new Error(
      `Contentful CDA request failed (${contentType}): ${res.status} ${await res.text()}`
    )
  }

  return res.json()
}

/** Fetches assets directly (not via an entry's includes), used to build the visual pool. */
export async function fetchAssets({
  tags,
  revalidate,
}: { tags?: string[]; revalidate?: number } = {}): Promise<{ items: CdaAsset[] }> {
  if (!SPACE_ID || !DELIVERY_TOKEN) {
    throw new Error(
      'CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN are not set in the environment.'
    )
  }

  const params = new URLSearchParams({ access_token: DELIVERY_TOKEN, limit: '1000' })

  const res = await fetch(
    `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/assets?${params}`,
    { next: { tags: tags ?? ['assets'], revalidate: revalidate ?? 3600 } }
  )

  if (!res.ok) {
    throw new Error(`Contentful assets request failed: ${res.status} ${await res.text()}`)
  }

  return res.json()
}

function findAsset(id: string, includes?: CdaResponse['includes']): CdaAsset | undefined {
  return includes?.Asset?.find(asset => asset.sys.id === id)
}

function findEntry(id: string, includes?: CdaResponse['includes']): CdaEntry | undefined {
  return includes?.Entry?.find(entry => entry.sys.id === id)
}

export interface ResolvedAsset {
  title: string
  url: string
  width?: number
  height?: number
  contentType?: string
}

/** Resolves an asset Link field (already fetched into `includes` via `include=N`) to a usable object. */
export function resolveAsset(
  link: unknown,
  includes?: CdaResponse['includes']
): ResolvedAsset | undefined {
  if (!isLink(link) || link.sys.linkType !== 'Asset') return undefined
  const asset = findAsset(link.sys.id, includes)
  if (!asset) return undefined

  const { file, title } = asset.fields
  return {
    title,
    // CDA asset URLs are protocol-relative ("//images.ctfassets.net/...")
    url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
    width: file.details.image?.width,
    height: file.details.image?.height,
    contentType: file.contentType,
  }
}

/** Resolves an Entry Link field (e.g. a SubGallery referenced from an ExtendedGallery). */
export function resolveEntry<Fields = Record<string, unknown>>(
  link: unknown,
  includes?: CdaResponse['includes']
): CdaEntry<Fields> | undefined {
  if (!isLink(link) || link.sys.linkType !== 'Entry') return undefined
  return findEntry(link.sys.id, includes) as CdaEntry<Fields> | undefined
}

export function resolveEntryList<Fields = Record<string, unknown>>(
  links: unknown,
  includes?: CdaResponse['includes']
): CdaEntry<Fields>[] {
  if (!Array.isArray(links)) return []
  return links
    .map(link => resolveEntry<Fields>(link, includes))
    .filter((entry): entry is CdaEntry<Fields> => Boolean(entry))
}

export function resolveAssetList(
  links: unknown,
  includes?: CdaResponse['includes']
): ResolvedAsset[] {
  if (!Array.isArray(links)) return []
  return links
    .map(link => resolveAsset(link, includes))
    .filter((asset): asset is ResolvedAsset => Boolean(asset))
}
