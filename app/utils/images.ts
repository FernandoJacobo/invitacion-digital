/** Anchos usados para `srcset`. */
const WIDTHS = [480, 800, 1200] as const

function isUnsplash(src: string) {
  return src.startsWith('https://images.unsplash.com/')
}

/** URL con tamaño, calidad y formato moderno (Unsplash entrega AVIF/WebP con `auto=format`). */
export function imageUrl(src: string, width = 1200, height?: number): string {
  if (!isUnsplash(src) || src.includes('?')) return src
  const params = new URLSearchParams({ w: String(width), q: '70', auto: 'format', fit: 'crop' })
  if (height) params.set('h', String(height))
  return `${src}?${params.toString()}`
}

export function imageSrcset(src: string, ratio?: number): string | undefined {
  if (!isUnsplash(src) || src.includes('?')) return undefined
  return WIDTHS.map(w => `${imageUrl(src, w, ratio ? Math.round(w / ratio) : undefined)} ${w}w`).join(', ')
}
