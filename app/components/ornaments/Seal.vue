<script setup lang="ts">
/**
 * Sello del sobre. `cera`: sello de cera con borde irregular y monograma (boda).
 * `broche`: broche de oro rosado con estrella de ocho puntas (XV).
 */
const props = defineProps<{ kind: 'sello-cera' | 'nocturno', monogram: string }>()
const id = `seal-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

// Borde irregular del sello de cera (perturbación senoidal de un círculo).
const waxPath = computed(() => {
  const pts: string[] = []
  const n = 72
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 45 + 2.2 * Math.sin(a * 7) + 1.4 * Math.sin(a * 13 + 1) + 0.8 * Math.sin(a * 23)
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})

const starPath = computed(() => {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? (i % 4 === 0 ? 30 : 20) : 7
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})

const isWax = computed(() => props.kind === 'sello-cera')
</script>

<template>
  <svg viewBox="0 0 100 100" aria-hidden="true" class="block">
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
      <text
        x="50"
        y="51"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="rgb(255 253 245 / .92)"
        style="font-family: var(--font-script); font-size: 30px"
      >{{ monogram }}</text>
    </template>
    <template v-else>
      <circle cx="50" cy="50" r="46" :fill="`url(#${id}-g)`" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="rgb(255 255 255 / .45)" stroke-width="1" stroke-dasharray="1.5 3" />
      <path :d="starPath" fill="rgb(255 248 244 / .9)" />
      <text
        x="50"
        y="51.5"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#9B5F52"
        style="font-family: var(--font-display); font-size: 13px; font-weight: 600; letter-spacing: .5px"
      >{{ monogram }}</text>
    </template>
  </svg>
</template>
