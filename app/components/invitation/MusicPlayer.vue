<script setup lang="ts">
/** Botón flotante de música con ecualizador animado. Se oculta si el archivo de audio no existe. */
const props = defineProps<{ available: boolean | null, playing: boolean, title?: string }>()
defineEmits<{ toggle: [] }>()

const label = computed(() => (props.playing ? `Pausar música${props.title ? `: ${props.title}` : ''}` : `Reproducir música${props.title ? `: ${props.title}` : ''}`))
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-3 scale-90"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 scale-90"
  >
    <button
      v-if="available !== false"
      type="button"
      class="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-14 place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-lg backdrop-blur-md transition hover:scale-105"
      :aria-label="label"
      :aria-pressed="playing"
      :title="label"
      @click="$emit('toggle')"
    >
      <span class="eq flex h-5 items-end gap-[3px]" :class="playing ? 'is-playing' : ''" aria-hidden="true">
        <span v-for="i in 4" :key="i" class="eq-bar w-[3px] rounded-full bg-accent-ink" :style="{ animationDelay: `${i * -0.23}s` }" />
      </span>
    </button>
  </Transition>
</template>

<style scoped>
.eq-bar {
  height: 30%;
  transform-origin: bottom;
  transition: height 0.3s;
}
.eq-bar:nth-child(2) { height: 55%; }
.eq-bar:nth-child(3) { height: 40%; }
.eq-bar:nth-child(4) { height: 25%; }
.is-playing .eq-bar {
  height: 100%;
  animation: eq 0.9s ease-in-out infinite alternate;
}
@keyframes eq {
  0% { transform: scaleY(0.25); }
  50% { transform: scaleY(0.9); }
  100% { transform: scaleY(0.45); }
}
@media (prefers-reduced-motion: reduce) {
  .is-playing .eq-bar {
    animation: none;
    transform: scaleY(0.7);
  }
}
</style>
