<script setup lang="ts">
/** Constelación decorativa (XV): estrellas de cuatro puntas unidas por líneas finas. */
const stars = [
  { x: 14, y: 132, r: 5 },
  { x: 46, y: 96, r: 3.5 },
  { x: 62, y: 58, r: 7 },
  { x: 104, y: 44, r: 3.5 },
  { x: 138, y: 18, r: 5.5 },
  { x: 120, y: 86, r: 3 },
]
const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]]

function star({ x, y, r }: { x: number, y: number, r: number }) {
  const k = r * 0.18
  return `M${x} ${y - r}C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y}C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r}C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y}C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`
}
</script>

<template>
  <svg viewBox="0 0 150 150" fill="none" aria-hidden="true" class="block">
    <path
      v-for="([a, b]) in links"
      :key="`${a}-${b}`"
      :d="`M${stars[a]!.x} ${stars[a]!.y}L${stars[b]!.x} ${stars[b]!.y}`"
      stroke="currentColor"
      stroke-width=".7"
      stroke-opacity=".45"
      stroke-dasharray="2 3"
    />
    <path v-for="(s, i) in stars" :key="i" :d="star(s)" fill="currentColor" />
    <circle cx="30" cy="40" r="1.1" fill="currentColor" fill-opacity=".7" />
    <circle cx="88" cy="120" r="1.3" fill="currentColor" fill-opacity=".7" />
    <circle cx="140" cy="62" r=".9" fill="currentColor" fill-opacity=".7" />
  </svg>
</template>
