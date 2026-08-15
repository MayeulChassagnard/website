export function readingTime(markdown: string, wordsPerMinute = 200): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wordsPerMinute))
}
