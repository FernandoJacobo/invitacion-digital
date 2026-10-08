<script setup lang="ts">
/** Portada de la invitación: foto con parallax sutil, nombres animados, fecha y frase. */
const { config, opened } = useInvitation()
const motionOk = useMotionOk()
const isBoda = config.tipo === 'boda'

const bg = ref<HTMLElement>()
let frame = 0

function onScroll() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const y = window.scrollY
    if (bg.value && y < window.innerHeight * 1.2) bg.value.style.transform = `translate3d(0, ${y * 0.28}px, 0) scale(1.08)`
  })
}

watchEffect((onCleanup) => {
  if (!motionOk.value) return
  window.addEventListener('scroll', onScroll, { passive: true })
  onCleanup(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(frame)
  })
})

function scrollNext() {
  document.getElementById('inicio')?.scrollIntoView({ behavior: motionOk.value ? 'smooth' : 'auto' })
}
</script>

<template>
  <header class="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-20 text-center">
    <!-- Fondo -->
    <div class="absolute inset-0 -z-10">
      <div ref="bg" class="absolute inset-0 scale-[1.08] will-change-transform">
        <UiSmartImage
          :src="config.fotoPrincipal.src"
          :alt="config.fotoPrincipal.alt"
          sizes="100vw"
          eager
          class="size-full"
          img-class="hero-img"
        />
      </div>
      <div class="hero-scrim absolute inset-0" />
    </div>

    <template v-if="opened">
      <p data-rise style="--d: 100ms; --y: 12px" class="hero-eyebrow eyebrow">
        {{ isBoda ? 'Nos casamos' : 'Mis XV años' }}
      </p>

      <h1 class="hero-names mt-6 text-white">
        <template v-if="config.novios">
          <span data-rise style="--d: 250ms; --y: 24px" class="block font-display text-[clamp(3.6rem,17vw,8rem)] font-medium italic leading-[0.9]">
            {{ config.novios.ella.nombre }}
          </span>
          <span data-rise style="--d: 450ms; --y: 8px" class="my-1 block font-display text-[clamp(2.8rem,12vw,5rem)] font-normal italic leading-none text-[#E8D4A6]" aria-label="y">&amp;</span>
          <span data-rise style="--d: 600ms; --y: 24px" class="block font-display text-[clamp(3.6rem,17vw,8rem)] font-medium italic leading-[0.9]">
            {{ config.novios.el.nombre }}
          </span>
        </template>
        <template v-else>
          <span data-rise style="--d: 250ms; --y: 10px" class="xv-mark block font-display text-[clamp(4.5rem,24vw,10rem)] leading-none tracking-[0.12em]" aria-hidden="true">XV</span>
          <span data-rise style="--d: 500ms; --y: 24px" class="-mt-[0.35em] block font-script text-[clamp(3.4rem,15vw,7rem)] leading-[1.05]">
            {{ config.titulo }}
          </span>
          <span class="sr-only">celebra sus XV años</span>
        </template>
      </h1>

      <div data-rise style="--d: 850ms; --y: 12px" class="mt-8 flex flex-col items-center gap-4">
        <OrnamentsDivider :kind="config.tema.ornamentos" class="w-44 text-[#E8D4A6]" />
        <p class="font-body text-sm tracking-[0.42em] text-white/90 uppercase">
          {{ formatDots(config.fecha) }}
        </p>
      </div>

      <p data-rise style="--d: 1050ms; --y: 12px" :class="isBoda ? 'font-display text-xl italic sm:text-2xl' : 'font-body text-base font-light tracking-wide sm:text-lg'" class="mx-auto mt-6 max-w-md text-balance leading-snug text-white/90">
        “{{ config.frase }}”
      </p>
    </template>

    <button
      type="button"
      class="absolute bottom-6 left-1/2 flex min-h-11 min-w-11 -translate-x-1/2 flex-col items-center gap-2 text-[0.7rem] tracking-[0.3em] text-white/80 uppercase"
      aria-label="Desplázate para ver la invitación"
      @click="scrollNext"
    >
      <span aria-hidden="true">Desliza</span>
      <span class="relative h-10 w-6 rounded-full border border-white/50" aria-hidden="true">
        <span class="scroll-dot absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-white" />
      </span>
    </button>
  </header>
</template>

<style scoped>
.hero-scrim {
  background:
    linear-gradient(180deg, rgb(20 22 18 / 0.55) 0%, rgb(20 22 18 / 0.42) 45%, rgb(20 22 18 / 0.5) 80%, var(--c-fondo) 100%);
}
[data-theme="xv"] .hero-scrim {
  background:
    radial-gradient(70% 50% at 50% 45%, rgb(10 16 41 / 0.15), rgb(10 16 41 / 0.6)),
    linear-gradient(180deg, rgb(10 16 41 / 0.35) 0%, rgb(10 16 41 / 0.2) 50%, var(--c-fondo) 100%);
}
.hero-eyebrow {
  color: #F3E6C4;
  text-shadow: 0 1px 12px rgb(0 0 0 / 0.35);
}
[data-theme="xv"] .hero-eyebrow {
  color: var(--c-acento-tinta);
}
.hero-names {
  text-shadow: 0 2px 30px rgb(0 0 0 / 0.35);
}
.xv-mark {
  background: linear-gradient(180deg, #FCE4DA 10%, #E3A898 55%, #B97C6E 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  opacity: 0.9;
  text-shadow: none;
}
/* Entrada escalonada al abrir el sobre (keyframes CSS: corren en el compositor). */
[data-rise] {
  opacity: 0;
  animation: rise 1.1s var(--ease-out-soft) var(--d, 0ms) forwards;
}
@keyframes rise {
  from { opacity: 0; transform: translate3d(0, var(--y, 24px), 0); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  [data-rise] {
    opacity: 1;
    animation: none;
  }
}
.scroll-dot {
  animation: scroll-cue 1.8s ease-in-out infinite;
}
</style>
