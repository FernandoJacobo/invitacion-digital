<script setup lang="ts">
import { starBurstPath, waxSealPath } from '~/utils/ornaments'

/**
 * Sello del sobre. `cera`: sello de cera con borde irregular y monograma (boda).
 * `broche`: broche de oro rosado con estrella de ocho puntas (XV).
 */
const props = defineProps<{ kind: 'sello-cera' | 'nocturno', monogram: string }>()
const id = `seal-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

const waxPath = waxSealPath()
const starPath = starBurstPath()

const isWax = computed(() => props.kind === 'sello-cera')
</script>

<template>
  <span class="seal relative block" aria-hidden="true">
  <svg viewBox="0 0 100 100" class="block size-full">
    <defs>
      <radialGradient :id="`${id}-g`" cx="38%" cy="32%" r="75%">
        <stop offset="0%" :style="{ stopColor: isWax ? 'color-mix(in oklab, var(--c-sello) 62%, white)' : '#FBE3DA' }" />
        <stop offset="55%" :style="{ stopColor: isWax ? 'var(--c-sello)' : '#E2AE9F' }" />
        <stop offset="100%" :style="{ stopColor: isWax ? 'color-mix(in oklab, var(--c-sello) 62%, black)' : '#A86F62' }" />
      </radialGradient>
    </defs>
    <template v-if="isWax">
      <path :d="waxPath" :fill="`url(#${id}-g)`" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="rgb(255 255 255 / .28)" stroke-width="1.2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(0 0 0 / .14)" stroke-width="1" />
    </template>
    <template v-else>
      <circle cx="50" cy="50" r="46" :fill="`url(#${id}-g)`" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(255 255 255 / .45)" stroke-width="1" stroke-dasharray="1.5 3" />
      <path :d="starPath" fill="rgb(255 248 244 / .9)" />
    </template>
  </svg>
  <!-- Monograma como contenido generado (::before): decorativo, escala con el sello vía container queries
       y no compite como candidato a LCP con la portada estática. -->
  <span
    class="absolute inset-0 grid place-items-center leading-none"
    :class="isWax ? 'font-script text-[rgb(255_253_245/.92)]' : 'pt-[1%] font-display font-semibold text-[#9B5F52]'"
    :style="{ fontSize: isWax ? '30cqw' : '13cqw', letterSpacing: isWax ? undefined : '0.5cqw' }"
    :data-mono="monogram"
  />
  </span>
</template>

<style scoped>
.seal {
  container-type: inline-size;
}
[data-mono]::before {
  content: attr(data-mono);
}
</style>
