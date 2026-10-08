<script setup lang="ts">
/**
 * Pétalos cayendo (boda). Solo CSS (`transform`/`opacity`), 10 elementos.
 * Se pausa con la pestaña oculta y no se monta con `prefers-reduced-motion`.
 */
const active = useEffectsActive()

const petals = Array.from({ length: 10 }, (_, i) => ({
  left: `${(i * 9.7 + 4) % 100}%`,
  size: 10 + ((i * 5) % 9),
  duration: `${13 + ((i * 3.3) % 9)}s`,
  delay: `${-((i * 2.9) % 16)}s`,
  sway: `${18 + ((i * 11) % 30)}px`,
  hue: i % 3,
}))
const COLORS = ['#EAD7C8', '#F1E4D6', '#D9C7A3']
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-30 overflow-hidden motion-reduce:hidden" :class="active ? '' : 'paused'" aria-hidden="true">
    <span
      v-for="(p, i) in petals"
      :key="i"
      class="petal absolute -top-8"
      :style="{ left: p.left, width: `${p.size}px`, height: `${p.size * 0.8}px`, animationDuration: p.duration, animationDelay: p.delay, '--sway': p.sway }"
    >
      <svg viewBox="0 0 20 16" class="petal-inner size-full" :style="{ animationDuration: `${3 + (i % 3)}s` }">
        <path d="M10 15C3 12 0 6 3 2c2.5-3 6-1 7 2 1-3 4.5-5 7-2 3 4 0 10-7 13Z" :fill="COLORS[p.hue]" fill-opacity=".85" />
      </svg>
    </span>
  </div>
</template>

<style scoped>
.petal {
  animation-name: fall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.petal-inner {
  animation: sway ease-in-out infinite alternate;
}
.paused .petal,
.paused .petal-inner {
  animation-play-state: paused;
}
@keyframes fall {
  from { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.9; }
  90% { opacity: 0.8; }
  to { transform: translate3d(0, 110svh, 0) rotate(300deg); opacity: 0; }
}
@keyframes sway {
  from { transform: translate3d(calc(var(--sway) * -1), 0, 0) rotate(-20deg); }
  to { transform: translate3d(var(--sway), 0, 0) rotate(25deg); }
}
</style>
