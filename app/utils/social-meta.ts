export interface SocialMeta {
  title: string
  description: string
  image: string
  url?: string
  themeColor?: string
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string): string {
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}">`
  const pattern = new RegExp(`<meta\\s+${attr}="${key.replace(/[.:]/g, '\\$&')}"\\s+content="[^"]*"\\s*/?>`, 'i')
  if (pattern.test(html)) return html.replace(pattern, tag)
  return html.replace('</head>', `${tag}</head>`)
}

/**
 * Reescribe título y metas sociales de un HTML estático. Se usa al generar el sitio para que
 * `/boda` y `/xv` tengan su propia vista previa en WhatsApp/Facebook (los crawlers no ejecutan JS).
 */
export function injectSocialMeta(html: string, meta: SocialMeta): string {
  let out = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttr(meta.title)}</title>`)
  out = setMeta(out, 'name', 'description', meta.description)
  out = setMeta(out, 'property', 'og:title', meta.title)
  out = setMeta(out, 'property', 'og:description', meta.description)
  out = setMeta(out, 'property', 'og:image', meta.image)
  out = setMeta(out, 'name', 'twitter:title', meta.title)
  out = setMeta(out, 'name', 'twitter:description', meta.description)
  out = setMeta(out, 'name', 'twitter:image', meta.image)
  if (meta.url) out = setMeta(out, 'property', 'og:url', meta.url)
  if (meta.themeColor) out = setMeta(out, 'name', 'theme-color', meta.themeColor)
  return out
}
