<script setup lang="ts">
/** Tarjeta de presentación de la festejada (XV). */
const { config } = useInvitation()
const sobreMi = config.sobreMi!
</script>

<template>
  <InvitationSection id="sobre-mi" eyebrow="Conóceme un poco" :title="sobreMi.titulo">
    <article class="card relative mx-auto grid max-w-4xl overflow-hidden md:grid-cols-[0.9fr_1.1fr]">
      <div v-reveal:zoom class="relative">
        <UiSmartImage :src="sobreMi.foto.src" :alt="sobreMi.foto.alt" sizes="(min-width: 768px) 400px, 100vw" class="aspect-[4/5] md:aspect-auto md:h-full" />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--c-superficie)] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[color-mix(in_oklab,var(--c-superficie)_30%,transparent)]" aria-hidden="true" />
      </div>
      <div class="relative px-6 pb-8 pt-2 sm:px-10 md:py-12">
        <OrnamentsConstellation class="absolute right-4 top-4 w-20 text-accent opacity-50" />
        <p v-reveal class="font-script text-5xl text-accent-ink">
          {{ config.festejada?.apodo ?? config.festejada?.nombre }}
        </p>
        <p v-reveal="80" class="mt-4 text-[1.0625rem] leading-relaxed text-ink/90">
          {{ sobreMi.texto }}
        </p>
        <dl class="mt-8 grid gap-4 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
          <div v-for="(dato, i) in sobreMi.datos" :key="dato.etiqueta" v-reveal="140 + i * 80" class="border-t border-line pt-3">
            <dt class="text-[0.7rem] font-medium tracking-[0.22em] text-muted uppercase">
              {{ dato.etiqueta }}
            </dt>
            <dd class="mt-1 font-display text-lg text-ink">
              {{ dato.valor }}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  </InvitationSection>
</template>
