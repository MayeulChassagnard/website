export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso)
  )
}
