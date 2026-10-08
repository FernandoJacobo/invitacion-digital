<script setup lang="ts">
import { imageSrcset, imageUrl } from '~/utils/images'

/**
 * Imagen con skeleton y "blur-up" mientras carga, `srcset` responsivo, carga diferida
 * y un placeholder elegante si la imagen falla.
 */
const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    /** Proporción ancho/alto del contenedor. Si se omite, el contenedor define el tamaño. */
    ratio?: number
    sizes?: string
    eager?: boolean
    imgClass?: string
  }>(),
  { sizes: '(min-width: 768px) 50vw, 100vw' },
)

const status = ref<'loading' | 'loaded' | 'error'>('loading')
const img = ref<HTMLImageElement>()

const placeholder = computed(() => imageUrl(props.src, 24))
const srcset = computed(() => imageSrcset(props.src))

watch(() => props.src, () => (status.value = 'loading'))

onMounted(() => {
  // Si la imagen ya estaba en caché, `load` pudo dispararse antes de hidratar.
  if (img.value?.complete && img.value.naturalWidth > 0) status.value = 'loaded'
})
</script>

<template>
  <div
    class="relative overflow-hidden bg-surface-alt"
    :style="ratio ? { aspectRatio: String(ratio) } : undefined"
  >
    <div
      v-if="status === 'loading'"
      class="shimmer absolute inset-0"
      aria-hidden="true"
    >
      <!-- Miniatura de 24 px estirada: el escalado del navegador ya la difumina (sin `filter: blur`, que es caro). -->
      <div
        class="absolute inset-0 bg-cover bg-center opacity-70"
        :style="{ backgroundImage: `url(${placeholder})` }"
      />
    </div>

    <div
      v-if="status === 'error'"
      class="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--c-acento)_22%,transparent),transparent_60%),linear-gradient(160deg,var(--c-superficie-alt),var(--c-superficie))]"
      role="img"
      :aria-label="alt"
    >
      <div class="flex flex-col items-center gap-2 px-4 text-center text-accent-ink">
        <Icon name="lucide:image-off" class="size-6 opacity-70" />
        <span class="text-xs tracking-wide text-muted">Imagen no disponible</span>
      </div>
    </div>

    <img
      v-else
      ref="img"
      :src="imageUrl(src, 1200)"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="size-full object-cover transition-opacity duration-700"
      :class="[status === 'loaded' ? 'opacity-100' : 'opacity-0', imgClass]"
      @load="status = 'loaded'"
      @error="status = 'error'"
    >
  </div>
</template>
