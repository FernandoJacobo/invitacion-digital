<script setup lang="ts">
/**
 * Rama botánica generada a partir de una curva: hojas distribuidas a lo largo del tallo,
 * alternando lados y disminuyendo de tamaño hacia la punta. SVG original y muy ligero.
 */
const props = withDefaults(defineProps<{ leaves?: number, berries?: boolean }>(), { leaves: 11, berries: true })

const P0 = { x: 8, y: 152 }
const P1 = { x: 40, y: 40 }
const P2 = { x: 152, y: 10 }
const LEAF = 'M0 0C5-8 17-9 24 0C17 9 5 8 0 0Z'

function point(t: number) {
  const a = (1 - t) ** 2
  const b = 2 * (1 - t) * t
  const c = t ** 2
  return { x: a * P0.x + b * P1.x + c * P2.x, y: a * P0.y + b * P1.y + c * P2.y }
}
function angle(t: number) {
  const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x)
  const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y)
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

const stem = `M${P0.x} ${P0.y}Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`

const leafTransforms = computed(() => {
  const out: string[] = []
  for (let i = 0; i < props.leaves; i++) {
    const t = 0.12 + (i / (props.leaves - 1)) * 0.84
    const p = point(t)
    const side = i % 2 === 0 ? -1 : 1
    const scale = 1.05 - t * 0.55
    out.push(`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${(angle(t) + side * 42).toFixed(1)}) scale(${scale.toFixed(2)})`)
  }
  // Hoja terminal en la punta.
  out.push(`translate(${P2.x} ${P2.y}) rotate(${angle(1).toFixed(1)}) scale(.5)`)
  return out
})

const berryPoints = computed(() => (props.berries ? [0.3, 0.55, 0.78].map(point) : []))
</script>

<template>
  <svg viewBox="0 0 170 170" fill="none" aria-hidden="true" class="block">
    <path :d="stem" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
    <path v-for="t in leafTransforms" :key="t" :d="LEAF" :transform="t" fill="currentColor" fill-opacity=".78" />
    <g v-for="(b, i) in berryPoints" :key="i">
      <circle :cx="b.x + 9" :cy="b.y + 6" r="2.2" fill="currentColor" />
      <circle :cx="b.x + 13" :cy="b.y + 1" r="1.6" fill="currentColor" fill-opacity=".8" />
    </g>
  </svg>
</template>
