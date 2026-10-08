<script setup lang="ts">
import { pasesLabel } from '~/utils/guest'

/**
 * Portada tipo sobre. Al tocarla: el sello se desvanece, la solapa gira, la carta sube
 * y la portada se disuelve hacia la invitación. El mismo toque inicia la música.
 */
const emit = defineEmits<{
  /** Toque del invitado (dentro del gesto: aquí arranca la música). */
  open: []
  /** La portada empieza a disolverse: arrancan las animaciones del hero. */
  reveal: []
  /** Animación terminada: la portada se puede desmontar. */
  done: []
}>()

const { config, guest } = useInvitation()
const motionOk = useMotionOk()

const phase = ref<'closed' | 'opening' | 'leaving'>('closed')
const button = ref<HTMLButtonElement>()
const isXv = config.tema.sobre === 'nocturno'

const monogram = computed(() => {
  if (config.novios) return `${config.novios.ella.nombre[0]}${config.novios.el.nombre[0]}`
  if (config.festejada) return config.tipo === 'xv' ? 'XV' : config.festejada.nombre[0]
  return config.titulo[0]
})

const eyebrow = config.tipo === 'boda' ? 'Tienes una invitación a nuestra boda' : 'Tienes una invitación a mis XV años'

function open() {
  if (phase.value !== 'closed') return
  emit('open')
  if (!motionOk.value) {
    phase.value = 'leaving'
    emit('reveal')
    setTimeout(() => emit('done'), 250)
    return
  }
  phase.value = 'opening'
  setTimeout(() => {
    phase.value = 'leaving'
    emit('reveal')
  }, 1650)
  setTimeout(() => emit('done'), 2300)
}


// Estrellas del fondo nocturno (posiciones fijas para que no "salten" entre renders).
const stars = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37.3) % 100}%`,
  top: `${(i * 61.7 + 7) % 100}%`,
  size: 1 + ((i * 7) % 3),
  delay: `${(i * 0.37) % 4}s`,
}))
</script>

<template>
  <div
    class="env-stage fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6"
    :class="[`is-${phase}`, isXv ? 'env-night' : 'env-paper']"
    role="dialog"
    aria-modal="true"
    :aria-label="`Invitación de ${config.titulo}`"
  >
    <!-- Fondo decorativo -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <template v-if="isXv">
        <span
          v-for="(s, i) in stars"
          :key="i"
          class="env-star absolute rounded-full bg-white"
          :style="{ left: s.left, top: s.top, width: `${s.size}px`, height: `${s.size}px`, animationDelay: s.delay }"
        />
        <OrnamentsConstellation class="absolute -left-6 top-10 w-40 text-accent opacity-50 sm:w-56" />
        <OrnamentsConstellation class="absolute -right-8 bottom-12 w-36 rotate-180 text-accent opacity-40 sm:w-52" />
      </template>
      <template v-else>
        <OrnamentsBranch class="absolute -left-10 -top-6 w-48 rotate-[100deg] text-[#9CAF94] opacity-60 sm:w-64" />
        <OrnamentsBranch class="absolute -bottom-8 -right-10 w-52 -rotate-[80deg] text-[#9CAF94] opacity-60 sm:w-72" />
      </template>
    </div>

    <button
      ref="button"
      type="button"
      class="env-hit relative z-10 flex w-full max-w-[420px] flex-col items-center rounded-3xl px-2 py-4 text-center focus-visible:outline-offset-8"
      :aria-label="`Abrir invitación de ${config.titulo}`"
      :disabled="phase !== 'closed'"
      @click="open"
    >
      <span class="eyebrow env-fade mb-8 block max-w-[18rem]">{{ eyebrow }}</span>

      <!-- Sobre -->
      <span class="env" aria-hidden="true">
        <span class="env-back" />
        <span class="env-letter">
          <OrnamentsDivider :kind="config.tema.ornamentos" class="w-24 text-accent" />
          <span class="mt-1 block font-script text-[clamp(1.6rem,7vw,2.1rem)] leading-tight text-ink">{{ config.titulo }}</span>
          <span class="mt-1 block text-[0.65rem] tracking-[0.3em] text-muted">{{ formatDots(config.fecha) }}</span>
        </span>
        <svg class="env-pocket" viewBox="0 0 100 69" preserveAspectRatio="none">
          <polygon points="0,0 50,40 0,69" fill="var(--c-sobre)" />
          <polygon points="100,0 50,40 100,69" fill="var(--c-sobre)" />
          <polygon points="0,69 50,34 100,69" style="fill: color-mix(in oklab, var(--c-sobre) 92%, var(--c-sobre-sombra))" />
          <path d="M0 69L50 34L100 69" fill="none" stroke="rgb(0 0 0 / .07)" stroke-width=".4" vector-effect="non-scaling-stroke" />
        </svg>
        <span class="env-flap">
          <svg viewBox="0 0 100 42" preserveAspectRatio="none" class="size-full">
            <polygon points="0,0 100,0 50,42" style="fill: color-mix(in oklab, var(--c-sobre) 94%, white)" />
            <path d="M0 0L50 42L100 0" fill="none" stroke="rgb(0 0 0 / .08)" stroke-width=".4" vector-effect="non-scaling-stroke" />
          </svg>
        </span>
        <span class="env-seal">
          <OrnamentsSeal :kind="config.tema.sobre" :monogram="monogram" class="size-full" />
        </span>
      </span>

      <span class="env-fade mt-10 block">
        <span class="block font-display text-[clamp(2.2rem,9vw,3rem)] leading-none text-ink" :class="isXv ? 'tracking-[0.06em]' : 'font-medium italic'">
          {{ config.titulo }}
        </span>
        <span
          v-if="guest.invitado || guest.personalizada"
          class="mt-5 inline-flex flex-wrap items-center justify-center gap-x-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-sm text-ink backdrop-blur-sm"
        >
          <span class="text-muted">Invitación para:</span>
          <strong class="font-medium">{{ guest.invitado ?? 'ti' }}</strong>
          <span class="text-accent-ink" aria-hidden="true">·</span>
          <span>{{ pasesLabel(guest.pases) }}</span>
        </span>
        <span class="env-cue mt-6 flex items-center justify-center gap-2 text-sm tracking-[0.18em] text-muted uppercase">
          <Icon name="lucide:mail" class="size-4 text-accent-ink" />
          Toca para abrir
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.env-paper {
  background:
    radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, white 60%, transparent), transparent 60%),
    radial-gradient(90% 60% at 50% 110%, color-mix(in oklab, var(--c-acento) 14%, transparent), transparent 70%),
    var(--c-fondo);
}
.env-night {
  background:
    radial-gradient(60% 45% at 50% 42%, color-mix(in oklab, var(--c-acento) 22%, transparent), transparent 70%),
    radial-gradient(120% 90% at 50% 0%, #1A2559, transparent 65%),
    var(--c-fondo);
}

.env-star {
  opacity: 0.25;
  animation: twinkle 4s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 0.95; transform: scale(1.15); }
}

/* Geometría del sobre */
.env {
  position: relative;
  display: block;
  width: min(80vw, 340px);
  aspect-ratio: 100 / 69;
  perspective: 1100px;
  filter: drop-shadow(0 26px 30px color-mix(in oklab, var(--c-tinta) 22%, transparent));
  animation: float-y 5s ease-in-out infinite;
}
.env-night .env {
  filter: drop-shadow(0 26px 40px rgb(0 0 0 / 0.55));
}
.env > * {
  position: absolute;
}
.env-back {
  inset: 0;
  border-radius: 6px;
  background: linear-gradient(180deg, var(--c-sobre-sombra), color-mix(in oklab, var(--c-sobre-sombra) 85%, var(--c-sobre)));
}
.env-letter {
  left: 7%;
  right: 7%;
  top: 6%;
  height: 90%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 9%;
  border-radius: 4px;
  background: var(--c-superficie);
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.6) inset, 0 6px 16px -8px rgb(0 0 0 / 0.25);
  transition: transform 1s var(--ease-out-soft) 0.6s;
}
.env-night .env-letter {
  background: linear-gradient(180deg, #FFF8F4, #F6E6E0);
  --c-tinta: #2A2346;
  --c-tenue: #5C5675;
}
.env-pocket {
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  overflow: visible;
  border-radius: 6px;
}
.env-flap {
  left: 0;
  right: 0;
  top: 0;
  height: 61%;
  z-index: 4;
  transform-origin: 50% 0;
  transform: rotateX(0deg);
  transition: transform 0.75s var(--ease-in-out-soft) 0.2s, z-index 0s linear 0.55s;
}
.env-seal {
  left: 50%;
  top: 61%;
  width: 22%;
  aspect-ratio: 1;
  z-index: 5;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.25));
  transition: transform 0.35s var(--ease-out-soft), opacity 0.35s;
}

.env-cue {
  animation: soft-pulse 2.4s ease-in-out infinite;
}
.env-hit:hover .env-seal {
  transform: translate(-50%, -50%) scale(1.06);
}

/* Apertura */
.is-opening .env,
.is-leaving .env {
  animation: none;
}
.is-opening .env-seal,
.is-leaving .env-seal {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.6);
}
.is-opening .env-flap,
.is-leaving .env-flap {
  transform: rotateX(180deg);
  z-index: 1;
}
.is-opening .env-letter,
.is-leaving .env-letter {
  transform: translate3d(0, -58%, 0);
}
.is-opening .env-fade,
.is-leaving .env-fade {
  opacity: 0;
  transform: translate3d(0, 8px, 0);
}
.env-fade {
  transition: opacity 0.5s, transform 0.5s var(--ease-out-soft);
}

.env-stage {
  transition: opacity 0.65s var(--ease-in-out-soft), transform 0.65s var(--ease-in-out-soft);
}
.is-leaving {
  opacity: 0;
  transform: scale(1.06);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .env,
  .env-star,
  .env-cue {
    animation: none;
  }
  .env-stage {
    transition-duration: 0.25s;
  }
  .is-leaving {
    transform: none;
  }
}
</style>
