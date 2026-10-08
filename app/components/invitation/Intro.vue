<script setup lang="ts">
/** Bienvenida con la bendición/anfitriones y saludo personalizado. */
const { config, guest } = useInvitation()
const isBoda = config.tipo === 'boda'
</script>

<template>
  <section id="inicio" class="relative px-6 pb-12 pt-16 text-center sm:pt-24">
    <div class="mx-auto max-w-2xl">
      <p v-if="guest.invitado" v-reveal class="font-script text-3xl text-accent-ink sm:text-4xl">
        {{ guest.invitado }},
      </p>
      <p v-reveal="60" class="mx-auto mt-4 max-w-lg text-balance font-display text-2xl leading-snug text-ink sm:text-3xl">
        <template v-if="isBoda">
          Con la bendición de Dios y de nuestros padres, tenemos el honor de invitarte a celebrar nuestro matrimonio.
        </template>
        <template v-else>
          Con la bendición de Dios y el amor de mis padres, te invito a celebrar conmigo mis quince años.
        </template>
      </p>

      <div v-if="config.anfitriones?.length" class="mt-12 grid gap-8 sm:grid-cols-2">
        <div v-for="(grupo, i) in config.anfitriones" :key="grupo.titulo" v-reveal="i * 120">
          <p class="eyebrow">
            {{ grupo.titulo }}
          </p>
          <ul class="mt-3 space-y-1 font-display text-xl text-ink">
            <li v-for="nombre in grupo.nombres" :key="nombre">
              {{ nombre }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
