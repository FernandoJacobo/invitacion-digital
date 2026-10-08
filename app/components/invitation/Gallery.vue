<script setup lang="ts">
/** Galería tipo masonry; cada foto abre el lightbox. */
const { config } = useInvitation()
const images = config.galeria ?? []
const current = ref<number | null>(null)
let opener: HTMLElement | null = null

function open(i: number, event: MouseEvent) {
  opener = event.currentTarget as HTMLElement
  current.value = i
}

function close() {
  current.value = null
  // Devuelve el foco a la miniatura que abrió el lightbox.
  nextTick(() => opener?.focus())
}
</script>

<template>
  <InvitationSection id="galeria" eyebrow="Momentos" title="Galería">
    <ul class="columns-2 gap-3 sm:gap-4 md:columns-3">
      <li v-for="(img, i) in images" :key="img.src" v-reveal="(i % 3) * 80" class="mb-3 break-inside-avoid sm:mb-4">
        <button
          type="button"
          class="group relative block w-full overflow-hidden rounded-2xl"
          :aria-label="`Ver foto ${i + 1} de ${images.length}: ${img.alt}`"
          @click="open(i, $event)"
        >
          <UiSmartImage
            :src="img.src"
            :alt="img.alt"
            :ratio="img.ratio ?? 1"
            sizes="(min-width: 768px) 320px, 46vw"
            img-class="transition-transform duration-700 group-hover:scale-105"
          />
          <span class="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" aria-hidden="true" />
        </button>
      </li>
    </ul>
    <InvitationLightbox v-if="current !== null" v-model:index="current" :images="images" @close="close" />
  </InvitationSection>
</template>
