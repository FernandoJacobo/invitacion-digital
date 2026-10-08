<script setup lang="ts">
/**
 * Destellos (XV): canvas pequeño con ~36 estrellas que titilan y flotan despacio.
 * ~30 fps, resolución acotada, se detiene con la pestaña oculta y con `prefers-reduced-motion`.
 */
const canvas = ref<HTMLCanvasElement>()
const active = useEffectsActive()

interface Star { x: number, y: number, r: number, phase: number, speed: number, drift: number }

let stars: Star[] = []
let raf = 0
let last = 0
let width = 0
let height = 0
let ctx: CanvasRenderingContext2D | null = null

function resize() {
  const el = canvas.value
  if (!el) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  width = window.innerWidth
  height = window.innerHeight
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  ctx = el.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  const count = width < 640 ? 26 : 40
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 0.6 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.4,
    drift: 4 + Math.random() * 8,
  }))
}

function drawStar(c: CanvasRenderingContext2D, s: Star, alpha: number) {
  c.globalAlpha = alpha
  c.beginPath()
  c.arc(s.x, s.y, s.r, 0, Math.PI * 2)
  c.fill()
  if (s.r > 1.6 && alpha > 0.6) {
    // Estrellas grandes con destello en cruz.
    const l = s.r * 4 * alpha
    c.globalAlpha = alpha * 0.5
    c.fillRect(s.x - l, s.y - 0.4, l * 2, 0.8)
    c.fillRect(s.x - 0.4, s.y - l, 0.8, l * 2)
  }
}

function frame(t: number) {
  raf = requestAnimationFrame(frame)
  if (t - last < 33 || !ctx) return
  const dt = Math.min(0.1, (t - last) / 1000)
  last = t
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = '#FBE3DA'
  for (const s of stars) {
    s.phase += dt * s.speed
    s.y -= dt * s.drift
    if (s.y < -4) {
      s.y = height + 4
      s.x = Math.random() * width
    }
    drawStar(ctx, s, 0.25 + 0.75 * Math.abs(Math.sin(s.phase)))
  }
}

function start() {
  if (raf) return
  last = 0
  raf = requestAnimationFrame(frame)
}
function stop() {
  cancelAnimationFrame(raf)
  raf = 0
}

useEventListener('resize', useDebounceFn(resize, 200), { passive: true })

onMounted(() => {
  resize()
  watch(active, on => (on ? start() : stop()), { immediate: true })
})
onBeforeUnmount(stop)
</script>

<template>
  <canvas ref="canvas" class="pointer-events-none fixed inset-0 z-0 size-full motion-reduce:hidden" aria-hidden="true" />
</template>
