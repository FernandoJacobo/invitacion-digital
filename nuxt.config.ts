import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { addTemplate } from 'nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
import { events } from './app/events'
import { injectSocialMeta } from './app/utils/social-meta'
import { staticCoverHtml } from './app/utils/cover'
import { imageSrcset, imageUrl } from './app/utils/images'

/** URL pública del sitio (para `og:url`). Cámbiala o define NUXT_PUBLIC_SITE_URL al desplegar. */
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://invitacion-digital-at0.pages.dev').replace(/\/+$/, '')

const home = {
  title: 'Invitaciones digitales para boda y XV años · Demo JacoboDev',
  description: 'Invitaciones digitales animadas con confirmación por WhatsApp, cuenta regresiva, galería y panel de invitados. Demo de boda y XV años.',
  image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=1200&h=630&q=70&fit=crop&auto=format',
}

// Incluye en el bundle todos los iconos Lucide referenciados en el código (también los dinámicos).
function collectIcons(dir: string, found = new Set<string>()): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) collectIcons(path, found)
    else if (/\.(vue|ts)$/.test(entry.name)) {
      for (const m of readFileSync(path, 'utf8').matchAll(/lucide:[a-z0-9-]+/g)) found.add(m[0])
    }
  }
  return [...found]
}

// Fuentes: solo las familias y pesos que declaran los temas de cada evento, más la del panel.
function collectFonts() {
  const families = new Map<string, { weights: Set<number>, italic: boolean }>()
  const add = (name: string, weights: number[], italic = false) => {
    const entry = families.get(name) ?? { weights: new Set<number>(), italic: false }
    weights.forEach(w => entry.weights.add(w))
    entry.italic ||= italic
    families.set(name, entry)
  }
  for (const { tema: { tipografia: t } } of events) {
    add(t.display, t.pesos.display, t.displayItalica)
    add(t.script, t.pesos.script)
    add(t.cuerpo, t.pesos.cuerpo)
  }
  add('Inter', [400, 500, 600])
  return [...families].map(([name, { weights, italic }]) => ({
    name,
    provider: 'google' as const,
    weights: [...weights].sort(),
    styles: (italic ? ['normal', 'italic'] : ['normal']) as ('normal' | 'italic')[],
    display: 'swap' as const,
  }))
}

/**
 * `<link rel="preload">` para los archivos woff2 (subconjunto latino) de las familias indicadas.
 * Lee las @font-face que @nuxt/fonts dejó en el CSS generado; si no las encuentra, no agrega nada.
 */
function fontPreloadLinks(publicDir: string, families: { name: string, italic?: boolean }[]): string {
  let css: string
  try {
    const dir = join(publicDir, '_nuxt')
    css = readdirSync(dir).filter(f => f.endsWith('.css')).map(f => readFileSync(join(dir, f), 'utf8')).join('\n')
  }
  catch {
    return ''
  }
  const urls = new Set<string>()
  for (const face of css.match(/@font-face\{[^}]*\}/g) ?? []) {
    // Subconjunto latino (el minificador lo escribe como `U+??`).
    if (!/unicode-range:\s*U\+(?:0000-00FF|\?\?)[,;}]/i.test(face)) continue
    const family = /font-family:\s*"?([^";]+?)"?\s*;/.exec(face)?.[1]
    const italic = /font-style:\s*italic/.test(face)
    const url = /url\((?:\.\.)?(\/_fonts\/[^)]+\.woff2)\)/.exec(face)?.[1]
    if (url && families.some(f => f.name === family && !!f.italic === italic)) urls.add(url)
  }
  return [...urls].map(u => `<link rel="preload" as="font" type="font/woff2" href="${u}" crossorigin>`).join('')
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  ssr: false,
  devtools: { enabled: false },

  modules: [
    // @nuxt/fonts solo genera @font-face para familias que aparecen en el CSS. Como cada tema define
    // sus fuentes en `app/events/*.ts`, se genera una hoja que las menciona (el navegador solo descarga
    // las que una página realmente usa).
    (_options, nuxt) => {
      // Una regla por familia: @nuxt/fonts solo resuelve la primera familia de cada declaración.
      const rules = collectFonts().map((f, i) => `.event-font-${i} { font-family: '${f.name}'; }`).join('\n')
      const template = addTemplate({
        filename: 'event-fonts.css',
        getContents: () => `/* Generado desde app/events */\n${rules}\n`,
        write: true,
      })
      nuxt.options.css.push(template.dst)
    },
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['date-fns', 'date-fns/locale', 'zod', 'vue-sonner'],
    },
  },

  components: [{ path: '~/components', pathPrefix: true }],

  imports: { dirs: ['stores'] },

  runtimeConfig: {
    public: { siteUrl },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es-MX' },
      title: home.title,
      // Metas en el HTML estático: los crawlers de WhatsApp/Facebook no ejecutan JavaScript.
      // `/boda` y `/xv` reciben las suyas al generar el sitio (ver hook `prerender:generate`).
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#F7F3EC' },
        { name: 'description', content: home.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Invitaciones digitales · JacoboDev' },
        { property: 'og:locale', content: 'es_MX' },
        { property: 'og:title', content: home.title },
        { property: 'og:description', content: home.description },
        { property: 'og:url', content: siteUrl },
        { property: 'og:image', content: home.image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: home.title },
        { name: 'twitter:description', content: home.description },
        { name: 'twitter:image', content: home.image },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://images.unsplash.com', crossorigin: '' },
      ],
    },
  },

  spaLoadingTemplate: true,

  piniaPluginPersistedstate: { storage: 'localStorage' },

  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      icons: collectIcons(fileURLToPath(new URL('./app', import.meta.url))),
      sizeLimitKb: 256,
    },
  },

  fonts: {
    families: collectFonts(),
    defaults: { subsets: ['latin'] },
  },

  eslint: { config: { stylistic: false } },

  typescript: { strict: true, typeCheck: false },

  nitro: {
    preset: 'static',
    prerender: {
      // `/boda` → `boda.html`: Cloudflare Pages y `serve` lo sirven en `/boda` sin redirección.
      autoSubfolderIndex: false,
      routes: ['/', ...events.map(e => `/${e.slug}`)],
    },
  },

  hooks: {
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:generate', (route) => {
        if (typeof route.contents !== 'string' || !route.fileName?.endsWith('.html')) return
        const slug = route.route.replace(/^\/+|\/+$/g, '')
        const event = events.find(e => e.slug === slug)
        if (!event) return

        route.contents = injectSocialMeta(route.contents, {
          title: event.seo.titulo,
          description: event.seo.descripcion,
          image: event.seo.imagen,
          url: `${siteUrl}/${event.slug}`,
          themeColor: event.tema.themeColor,
        })
          // Fondo del tema desde el primer pintado (evita el destello claro en temas oscuros).
          .replace('</head>', `<style id="boot-bg">html,body{background:${event.tema.colores.fondo}!important}</style></head>`)
          // Portada estática del sobre en lugar del loader genérico: primer pintado útil sin esperar al JS.
          // Va fuera de #__nuxt para que Nuxt no la borre al montar; `Envelope.vue` la retira cuando ya
          // pintó su propio sobre (idéntico), así no hay parpadeo ni un segundo candidato a LCP.
          .replace(/<div class="inv-boot"[\s\S]*?<\/svg>\s*<\/div>/, '')
          .replace('</body>', () => `${staticCoverHtml(event)}</body>`)
      })

      // Precarga de fuentes críticas: se hace al terminar el build (`compiled`) porque el CSS con las @font-face
      // todavía no está en disco mientras se generan las rutas.
      nitro.hooks.hook('compiled', () => {
        const publicDir = nitro.options.output.publicDir
        const pages: [string, { name: string, italic?: boolean }[]][] = [
          ['index.html', [{ name: 'Cormorant Garamond' }, { name: 'Cormorant Garamond', italic: true }, { name: 'Jost' }]],
          ...events.map(e => [`${e.slug}.html`, [
            { name: e.tema.tipografia.display, italic: e.tipo === 'boda' && e.tema.tipografia.displayItalica },
            { name: e.tema.tipografia.cuerpo },
            { name: e.tema.tipografia.script },
          ]] as [string, { name: string, italic?: boolean }[]]),
        ]
        for (const [file, families] of pages) {
          const path = join(publicDir, file)
          try {
            const html = readFileSync(path, 'utf8')
            if (html.includes('as="font"')) continue
            let extra = fontPreloadLinks(publicDir, families)
            if (file === 'index.html' && events[0]) {
              // Selector: la foto de la primera tarjeta es el LCP en móvil; se descubre antes con preload.
              const src = events[0].fotoPrincipal.src
              extra += `<link rel="preload" as="image" href="${imageUrl(src, 800)}" imagesrcset="${imageSrcset(src)}" imagesizes="(min-width: 768px) 560px, 100vw" fetchpriority="high">`
            }
            writeFileSync(path, html.replace('</head>', `${extra}</head>`))
          }
          catch {
            // La ruta no se generó (p. ej. en `nuxt build`): nada que hacer.
          }
        }
      })
    },
  },
})
