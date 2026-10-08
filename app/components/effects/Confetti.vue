<script setup lang="ts">
/** Ráfaga de confeti al confirmar asistencia (canvas, ~2.8 s). Se carga bajo demanda. */
const emit = defineEmits<{ done: [] }>()
const canvas = ref<HTMLCanvasElement>()

interface Piece { x: number, y: number, vx: number, vy: number, w: number, h: number, rot: number, vr: number, color: string }

let raf = 0
onBeforeUnmount(() => cancelAnimationFrame(raf))

onMounted(() => {
  const el = canvas.value
  const ctx = el?.getContext('2d')
  if (!el || !ctx) return emit('done')

  const styles = getComputedStyle(el)
  const colors = [
    styles.getPropertyValue('--c-acento').trim() || '#B8975A',
    styles.getPropertyValue('--c-primario').trim() || '#55684E',
    '#F2D6CF',
    '#FFFFFF',
    '#E8C98E',
  ]

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const w = window.innerWidth
  const h = window.innerHeight
  el.width = w * dpr
  el.height = h * dpr
  ctx.scale(dpr, dpr)

  const pieces: Piece[] = Array.from({ length: w < 640 ? 90 : 140 }, (_, i) => {
    const fromLeft = i % 2 === 0
    const angle = (fromLeft ? -60 : -120) + (Math.random() - 0.5) * 40
    const speed = 9 + Math.random() * 8
    return {
      x: fromLeft ? -10 : w + 10,
      y: h * 0.75,
      vx: Math.cos((angle * Math.PI) / 180) * speed,
      vy: Math.sin((angle * Math.PI) / 180) * speed,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[i % colors.length]!,
    }
  })

  const start = performance.now()
  const tick = (now: number) => {
    const t = now - start
    ctx.clearRect(0, 0, w, h)
    ctx.globalAlpha = t > 2000 ? Math.max(0, 1 - (t - 2000) / 800) : 1
    for (const p of pieces) {
      p.vy += 0.28
      p.vx *= 0.99
      p.vy *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 2)))
      ctx.restore()
    }
    if (t < 2800 && document.visibilityState === 'visible') raf = requestAnimationFrame(tick)
    else emit('done')
  }
  raf = requestAnimationFrame(tick)
})
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 z-[65] size-full motion-reduce:hidden" aria-hidden="true" />
</template>
