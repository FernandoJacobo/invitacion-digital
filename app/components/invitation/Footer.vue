<script setup lang="ts">
import { toast } from 'vue-sonner'
import { copyText } from '~/utils/browser'
import { events } from '~/events'

/** Cierre: agradecimiento, hashtag, redes y crédito de JacoboDev. */
const { config } = useInvitation()
const { resetDemo } = useDemo()

const otros = events.filter(e => e.slug !== config.slug)

const REDES = {
  instagram: 'lucide:instagram',
  facebook: 'lucide:facebook',
  tiktok: 'lucide:music',
} as const

async function copyHashtag() {
  if (!config.hashtag) return
  const ok = await copyText(config.hashtag)
  if (ok) toast.success('Hashtag copiado', { description: config.hashtag })
}

function reset() {
  resetDemo()
  toast.success('Demo restablecida', { description: 'Se borraron las confirmaciones guardadas en este navegador.' })
  setTimeout(() => window.location.replace(window.location.pathname + window.location.search), 700)
}
</script>

<template>
  <footer class="relative overflow-hidden px-6 pb-10 pt-24 text-center">
    <div class="pointer-events-none absolute inset-x-0 top-0 flex justify-between opacity-40" aria-hidden="true">
      <template v-if="config.tema.ornamentos === 'botanico'">
        <OrnamentsBranch class="-ml-10 w-40 rotate-[100deg] text-[#9CAF94]" />
        <OrnamentsBranch class="-mr-10 w-40 -scale-x-100 rotate-[-100deg] text-[#9CAF94]" />
      </template>
      <template v-else>
        <OrnamentsConstellation class="ml-2 w-28 text-accent" />
        <OrnamentsConstellation class="mr-2 w-24 -scale-x-100 text-accent" />
      </template>
    </div>

    <div class="mx-auto max-w-xl">
      <p v-reveal class="mx-auto max-w-md text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
        {{ config.cierre.mensaje }}
      </p>
      <p v-reveal="120" class="mt-6 font-script text-5xl text-accent-ink sm:text-6xl">
        {{ config.cierre.firma }}
      </p>

      <div v-if="config.hashtag" v-reveal class="mt-12">
        <p class="eyebrow">
          Comparte tus fotos con
        </p>
        <button
          type="button"
          class="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 font-display text-2xl text-ink transition hover:border-accent"
          :aria-label="`Copiar hashtag ${config.hashtag}`"
          @click="copyHashtag"
        >
          {{ config.hashtag }}
          <Icon name="lucide:copy" class="size-4 text-accent-ink" />
        </button>
      </div>

      <ul v-if="config.redes?.length" class="mt-6 flex flex-wrap justify-center gap-3">
        <li v-for="red in config.redes" :key="red.url">
          <a :href="red.url" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
            <Icon :name="REDES[red.red]" class="size-4" />
            {{ red.etiqueta }}
          </a>
        </li>
      </ul>

      <OrnamentsDivider :kind="config.tema.ornamentos" class="mx-auto mt-16 w-36 text-accent" />

      <div class="mt-10 space-y-3 text-sm text-muted">
        <p>
          Demo desarrollado por
          <a href="https://jacobodev.pages.dev" target="_blank" rel="noopener" class="font-medium text-ink underline decoration-accent underline-offset-4">JacoboDev</a>
          · jacobodev.pages.dev
        </p>
        <p class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <NuxtLink to="/" class="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            Ver todos los demos
          </NuxtLink>
          <NuxtLink v-for="e in otros" :key="e.slug" :to="`/${e.slug}`" class="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            Ver demo de {{ eventKind(e) }}
          </NuxtLink>
          <button type="button" class="inline-flex min-h-11 items-center gap-1.5 underline-offset-4 hover:underline" @click="reset">
            <Icon name="lucide:rotate-ccw" class="size-3.5" />
            Restablecer demo
          </button>
        </p>
      </div>
    </div>
  </footer>
</template>
