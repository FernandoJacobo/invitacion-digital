<script setup lang="ts">
import type { Imagen } from '~/events/types'
import { imageUrl } from '~/utils/images'

/**
 * Lightbox accesible: `role="dialog"`, foco atrapado, Escape para cerrar,
 * flechas del teclado y gestos de deslizar en móvil.
 */
const props = defineProps<{ images: Imagen[] }>()
const index = defineModel<number>('index', { required: true })
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLElement>()
const closeBtn = ref<HTMLButtonElement>()
const loaded = ref(false)
const failed = ref(false)
const direction = ref<1 | -1>(1)
const dragX = ref(0)
const motionOk = useMotionOk()

const image = computed(() => props.images[index.value]!)
const total = computed(() => props.images.length)

function go(step: 1 | -1) {
  direction.value = step
  index.value = (index.value + step + total.value) % total.value
}

watch(index, () => {
  loaded.value = false
  failed.value = false
  preloadNeighbors()
})

function preloadNeighbors() {
  for (const step of [1, -1]) {
    const next = props.images[(index.value + step + total.value) % total.value]
    if (next) new Image().src = imageUrl(next.src, 1600)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === 'Tab') trapFocus(e)
}

function trapFocus(e: KeyboardEvent) {
  const focusables = dialog.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')
  if (!focusables?.length) return
  const first = focusables[0]!
  const last = focusables[focusables.length - 1]!
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

// Gestos: deslizar horizontalmente cambia de foto; hacia abajo cierra.
let startX = 0
let startY = 0
let tracking = false
function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse') return
  tracking = true
  startX = e.clientX
  startY = e.clientY
}
function onPointerMove(e: PointerEvent) {
  if (!tracking) return
  const dx = e.clientX - startX
  if (Math.abs(dx) > Math.abs(e.clientY - startY)) dragX.value = dx
}
function onPointerUp(e: PointerEvent) {
  if (!tracking) return
  tracking = false
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  dragX.value = 0
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
  else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) emit('close')
}

onMounted(() => {
  document.documentElement.classList.add('no-scroll')
  closeBtn.value?.focus()
  preloadNeighbors()
})
onBeforeUnmount(() => document.documentElement.classList.remove('no-scroll'))
</script>

<template>
  <Teleport to="body">
    <div
      ref="dialog"
      class="lightbox fixed inset-0 z-[70] flex flex-col bg-[#0B0B0C]/95 text-white backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="`Galería, foto ${index + 1} de ${total}`"
      @keydown="onKeydown"
    >
      <div class="flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <p class="px-2 text-sm tabular-nums text-white/75" aria-live="polite">
          {{ index + 1 }} / {{ total }}
        </p>
        <button ref="closeBtn" type="button" class="grid size-12 place-items-center rounded-full hover:bg-white/10" aria-label="Cerrar galería" @click="emit('close')">
          <Icon name="lucide:x" class="size-6" />
        </button>
      </div>

      <div
        class="relative flex flex-1 touch-pan-y items-center justify-center overflow-hidden px-2 select-none"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click.self="emit('close')"
      >
        <Transition :name="motionOk ? (direction === 1 ? 'lb-next' : 'lb-prev') : ''" mode="out-in">
          <figure :key="index" class="flex max-h-full max-w-full flex-col items-center" :style="dragX ? { transform: `translate3d(${dragX}px,0,0)` } : undefined">
            <div v-if="!loaded && !failed" class="absolute size-10 animate-spin rounded-full border-2 border-white/20 border-t-white/80" aria-hidden="true" />
            <div v-if="failed" class="grid aspect-[4/3] w-[min(86vw,640px)] place-items-center rounded-xl bg-white/5">
              <span class="flex flex-col items-center gap-2 text-sm text-white/70">
                <Icon name="lucide:image-off" class="size-7" /> Imagen no disponible
              </span>
            </div>
            <img
              v-else
              :src="imageUrl(image.src, 1600)"
              :alt="image.alt"
              style="max-height: calc(100svh - 12rem)" class="max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300"
              :class="loaded ? 'opacity-100' : 'opacity-0'"
              draggable="false"
              @load="loaded = true"
              @error="failed = true"
            >
            <figcaption class="mt-3 max-w-xl px-4 text-center text-sm text-white/75">
              {{ image.alt }}
            </figcaption>
          </figure>
        </Transition>
      </div>

      <div class="flex items-center justify-center gap-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
        <button type="button" class="grid size-12 place-items-center rounded-full border border-white/20 hover:bg-white/10" aria-label="Foto anterior" @click="go(-1)">
          <Icon name="lucide:chevron-left" class="size-6" />
        </button>
        <button type="button" class="grid size-12 place-items-center rounded-full border border-white/20 hover:bg-white/10" aria-label="Foto siguiente" @click="go(1)">
          <Icon name="lucide:chevron-right" class="size-6" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  animation: lb-in 0.3s ease-out;
}
@keyframes lb-in {
  from { opacity: 0; }
}
.lb-next-enter-active,
.lb-next-leave-active,
.lb-prev-enter-active,
.lb-prev-leave-active {
  transition: opacity 0.22s ease, transform 0.22s var(--ease-out-soft);
}
.lb-next-enter-from,
.lb-prev-leave-to {
  opacity: 0;
  transform: translate3d(40px, 0, 0);
}
.lb-next-leave-to,
.lb-prev-enter-from {
  opacity: 0;
  transform: translate3d(-40px, 0, 0);
}
</style>
