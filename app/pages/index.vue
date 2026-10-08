<script setup lang="ts">
import { events } from '~/events'
import { buildGuestPath } from '~/utils/guest'

/** Selector de demos: la página que se enlaza desde el portafolio. */
const features = [
  { icon: 'lucide:mail', title: 'Sobre animado', text: 'Se abre con un toque y arranca la música.' },
  { icon: 'lucide:calendar-heart', title: 'Cuenta regresiva', text: 'En vivo, con fecha, hora y calendario.' },
  { icon: 'lucide:send', title: 'RSVP por WhatsApp', text: 'Confirmación con mensaje listo para enviar.' },
  { icon: 'lucide:link', title: 'Enlaces por invitado', text: 'Nombre y pases personalizados en la URL.' },
  { icon: 'lucide:image', title: 'Galería', text: 'Lightbox con gestos y teclado.' },
  { icon: 'lucide:users', title: 'Panel de invitados', text: 'Confirmaciones, KPIs y exportación a CSV.' },
]

const personalizada = buildGuestPath(events[0]!.slug, { invitado: 'Familia Perez', pases: 4 })

useSeoMeta({
  title: 'Invitaciones digitales para boda y XV años · Demo JacoboDev',
  description: 'Invitaciones digitales animadas con confirmación por WhatsApp, cuenta regresiva, galería y panel de invitados.',
  themeColor: '#F7F3EC',
})
</script>

<template>
  <div class="min-h-svh bg-bg text-ink">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--c-acento)_16%,transparent),transparent)]" aria-hidden="true" />

    <main class="relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
      <header class="mx-auto max-w-2xl text-center">
        <p class="eyebrow">
          Demo · Invitaciones digitales
        </p>
        <h1 class="mt-4 text-balance font-display text-[clamp(2.6rem,9vw,4.6rem)] font-medium leading-[1.02]">
          Invitaciones que se abren <em class="text-accent-ink">como un sobre</em>
        </h1>
        <p class="mx-auto mt-5 max-w-lg text-balance text-lg text-muted">
          Boda y XV años sobre el mismo motor: confirmación por WhatsApp, cuenta regresiva, galería y panel de invitados.
        </p>
      </header>

      <div class="mt-12 grid gap-5 sm:mt-16 md:grid-cols-2 md:gap-6">
        <NuxtLink
          v-for="e in events"
          :key="e.slug"
          :to="`/${e.slug}`"
          class="demo-card group relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] sm:min-h-[540px] sm:p-9"
          :style="themeStyle(e)"
          :data-theme="e.tema.id"
        >
          <UiSmartImage
            :src="e.fotoPrincipal.src"
            :alt="e.fotoPrincipal.alt"
            sizes="(min-width: 768px) 560px, 100vw"
            class="absolute inset-0 -z-10"
            img-class="transition-transform duration-[1.6s] ease-out group-hover:scale-105"
            :eager="true"
          />
          <div class="demo-scrim absolute inset-0 -z-10" aria-hidden="true" />

          <p class="text-xs font-medium tracking-[0.3em] text-white/85 uppercase">
            {{ eventKind(e) }}
          </p>
          <h2 class="mt-3 leading-none">
            <span v-if="e.tipo === 'boda'" class="block font-display text-[clamp(2.8rem,10vw,4rem)] font-medium italic">{{ e.titulo }}</span>
            <span v-else class="block font-script text-[clamp(3.2rem,12vw,4.6rem)]">{{ e.titulo }}</span>
          </h2>
          <p class="mt-3 text-sm tracking-[0.3em] text-white/85">
            {{ formatDots(e.fecha) }}
          </p>
          <OrnamentsDivider :kind="e.tema.ornamentos" class="mt-5 w-36 text-[#E8D4A6]" />
          <span class="mt-6 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white/95 px-6 text-[0.95rem] font-medium text-[#1D1B18] transition group-hover:gap-3">
            Ver invitación de {{ e.tipo === 'boda' ? 'boda' : 'XV años' }}
            <Icon name="lucide:arrow-right" class="size-4" />
          </span>
        </NuxtLink>
      </div>

      <section class="mt-10 grid gap-4 md:grid-cols-2" aria-label="Más pruebas">
        <NuxtLink :to="personalizada" class="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-accent">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-surface-alt text-accent-ink"><Icon name="lucide:wand-sparkles" class="size-5" /></span>
          <span>
            <span class="block font-medium">Invitación personalizada</span>
            <span class="block text-sm text-muted">“Familia Perez · 4 pases” desde la URL</span>
          </span>
          <Icon name="lucide:arrow-up-right" class="ml-auto size-5 shrink-0 text-muted" />
        </NuxtLink>
        <NuxtLink to="/admin" class="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition hover:border-accent">
          <span class="grid size-12 shrink-0 place-items-center rounded-full bg-surface-alt text-accent-ink"><Icon name="lucide:lock" class="size-5" /></span>
          <span>
            <span class="block font-medium">Panel de confirmaciones</span>
            <span class="block text-sm text-muted">Usuario <code class="font-medium text-ink">demo</code> · contraseña <code class="font-medium text-ink">demo123</code></span>
          </span>
          <Icon name="lucide:arrow-up-right" class="ml-auto size-5 shrink-0 text-muted" />
        </NuxtLink>
      </section>

      <section class="mt-20" aria-labelledby="features-title">
        <h2 id="features-title" class="text-center font-display text-3xl font-medium sm:text-4xl">
          Todo lo que incluye
        </h2>
        <ul class="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="f in features" :key="f.title" class="flex gap-4">
            <Icon :name="f.icon" class="mt-1 size-5 shrink-0 text-accent-ink" />
            <div>
              <p class="font-medium">
                {{ f.title }}
              </p>
              <p class="text-sm text-muted">
                {{ f.text }}
              </p>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <footer class="border-t border-line px-5 py-8 text-center text-sm text-muted">
      Demo desarrollado por
      <a href="https://jacobodev.pages.dev" target="_blank" rel="noopener" class="font-medium text-ink underline decoration-accent underline-offset-4">JacoboDev</a>
      · jacobodev.pages.dev
    </footer>
  </div>
</template>

<style scoped>
.demo-scrim {
  background: linear-gradient(180deg, rgb(20 22 18 / 0.08) 20%, rgb(20 22 18 / 0.72) 100%);
}
.demo-card[data-theme="xv"] .demo-scrim {
  background: linear-gradient(180deg, rgb(10 16 41 / 0.1) 10%, rgb(10 16 41 / 0.85) 100%);
}
</style>
