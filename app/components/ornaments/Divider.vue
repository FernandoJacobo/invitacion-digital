<script setup lang="ts">
/** Separador ornamental: ramita botánica (boda) o estrella de cuatro puntas (XV). Hereda `currentColor`. */
defineProps<{ kind: 'botanico' | 'estelar' }>()

const LEAF = 'M0 0C3-4.5 9.5-5 13 0C9.5 5 3 4.5 0 0Z'
const leaves = [
  'translate(111 15.8) rotate(-148) scale(.8)',
  'translate(105 15.2) rotate(152) scale(.72)',
  'translate(99 14) rotate(-160) scale(.6)',
  'translate(129 15.8) rotate(-32) scale(.8)',
  'translate(135 15.2) rotate(28) scale(.72)',
  'translate(141 14) rotate(-20) scale(.6)',
]
</script>

<template>
  <svg viewBox="0 0 240 32" fill="none" aria-hidden="true" class="block h-auto">
    <path d="M6 16H88" stroke="currentColor" stroke-width=".8" stroke-opacity=".55" />
    <path d="M152 16H234" stroke="currentColor" stroke-width=".8" stroke-opacity=".55" />
    <template v-if="kind === 'botanico'">
      <path d="M117 16Q106 16 94 12.4M123 16Q134 16 146 12.4" stroke="currentColor" stroke-width=".9" stroke-linecap="round" />
      <path v-for="t in leaves" :key="t" :d="LEAF" :transform="t" fill="currentColor" fill-opacity=".85" />
      <circle cx="120" cy="16" r="2.4" fill="currentColor" />
    </template>
    <template v-else>
      <path d="M120 5.5C120.9 12.6 123.4 15.1 130.5 16C123.4 16.9 120.9 19.4 120 26.5C119.1 19.4 116.6 16.9 109.5 16C116.6 15.1 119.1 12.6 120 5.5Z" fill="currentColor" />
      <path d="M100 12.5C100.3 15 101 15.7 103.5 16C101 16.3 100.3 17 100 19.5C99.7 17 99 16.3 96.5 16C99 15.7 99.7 15 100 12.5Z" fill="currentColor" fill-opacity=".8" />
      <path d="M140 12.5C140.3 15 141 15.7 143.5 16C141 16.3 140.3 17 140 19.5C139.7 17 139 16.3 136.5 16C139 15.7 139.7 15 140 12.5Z" fill="currentColor" fill-opacity=".8" />
      <circle cx="91" cy="16" r="1" fill="currentColor" />
      <circle cx="149" cy="16" r="1" fill="currentColor" />
    </template>
  </svg>
</template>
