<script setup lang="ts">
/** Contenedor de sección con encabezado ornamental consistente. */
defineProps<{
  id: string
  eyebrow?: string
  title?: string
  /** Fondo alterno para dar ritmo entre secciones. */
  alt?: boolean
  narrow?: boolean
}>()

const { config } = useInvitation()
</script>

<template>
  <section
    :id="id"
    class="relative scroll-mt-4 px-5 py-20 sm:px-8 sm:py-28"
    :class="alt ? 'bg-surface-alt/60' : ''"
    :aria-labelledby="title ? `${id}-title` : undefined"
  >
    <div class="mx-auto" :class="narrow ? 'max-w-xl' : 'max-w-5xl'">
      <div v-if="title || eyebrow" class="mb-12 text-center sm:mb-16">
        <p v-if="eyebrow" v-reveal class="eyebrow">
          {{ eyebrow }}
        </p>
        <h2 v-if="title" :id="`${id}-title`" v-reveal="80" class="section-title mt-3">
          {{ title }}
        </h2>
        <OrnamentsDivider v-reveal:fade="160" :kind="config.tema.ornamentos" class="mx-auto mt-5 w-40 text-accent" />
      </div>
      <slot />
    </div>
  </section>
</template>
