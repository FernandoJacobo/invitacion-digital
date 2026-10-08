import { expect, it } from 'vitest'
import { injectSocialMeta } from '~/utils/social-meta'

it('reemplaza título y metas existentes y agrega las faltantes', () => {
  const html = '<html><head><title>Inicio</title><meta name="description" content="x"><meta property="og:title" content="x"></head><body></body></html>'
  const out = injectSocialMeta(html, { title: 'Boda "V & S"', description: 'Desc', image: 'https://img/x.jpg', themeColor: '#fff' })
  expect(out).toContain('<title>Boda &quot;V &amp; S&quot;</title>')
  expect(out).toContain('<meta name="description" content="Desc">')
  expect(out).toContain('<meta property="og:title" content="Boda &quot;V &amp; S&quot;">')
  expect(out).toContain('<meta property="og:image" content="https://img/x.jpg">')
  expect(out).toContain('<meta name="theme-color" content="#fff">')
  expect(out.match(/og:title/g)).toHaveLength(1)
})
