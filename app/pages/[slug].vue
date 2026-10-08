<script setup lang="ts">
import { getEvent } from '~/events'

/**
 * Motor de invitación: una sola página para todos los eventos registrados en `app/events/`.
 * Cada sección se muestra solo si su dato existe en la config.
 */
definePageMeta({ key: route => String(route.params.slug) })

const route = useRoute()
const found = getEvent(String(route.params.slug))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Invitación no encontrada', fatal: true })
const config = found

const guest = useGuestParams(config)
const opened = ref(false)
const envelope = ref(true)
const motionOk = useMotionOk()
const music = useMusic(config.slug, config.musica?.src)

provideInvitation({ config, guest, opened })

// La portada bloquea el scroll hasta abrirse.
watchEffect(() => {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('no-scroll', !opened.value)
})
onBeforeUnmount(() => document.documentElement.classList.remove('no-scroll'))

function onReveal() {
  window.scrollTo(0, 0)
  opened.value = true
}

useSeoMeta({
  title: config.seo.titulo,
  description: config.seo.descripcion,
  ogTitle: config.seo.titulo,
  ogDescription: config.seo.descripcion,
  ogImage: config.seo.imagen,
  twitterTitle: config.seo.titulo,
  twitterDescription: config.seo.descripcion,
  twitterImage: config.seo.imagen,
  themeColor: config.tema.themeColor,
})
// Los tokens del tema también van en <html> para que body, toasts y teleports los hereden.
const rootStyle = Object.entries(themeStyle(config)).map(([k, v]) => `${k}:${v}`).join(';')
useHead({
  htmlAttrs: { style: rootStyle },
  bodyAttrs: { style: `background:${config.tema.colores.fondo}` },
  link: [{ rel: 'preload', as: 'image', href: imageUrl(config.fotoPrincipal.src, 1200), imagesrcset: imageSrcset(config.fotoPrincipal.src), imagesizes: '100vw', fetchpriority: 'high' }],
})
</script>

<template>
  <div class="inv" :data-theme="config.tema.id" :data-scheme="config.tema.esquema" :style="themeStyle(config)">
    <InvitationEnvelope
      v-if="envelope"
      @open="music.start()"
      @reveal="onReveal"
      @done="envelope = false"
    />

    <LazyEffectsSparkles v-if="opened && motionOk && config.tema.efecto === 'destellos'" />
    <LazyEffectsPetals v-if="opened && motionOk && config.tema.efecto === 'petalos'" />

    <main class="relative z-10" :inert="!opened" :aria-hidden="!opened">
      <InvitationHero />
      <InvitationIntro />
      <InvitationCountdown />
      <InvitationStory v-if="config.historia" />
      <InvitationAboutMe v-if="config.sobreMi" />
      <InvitationEventCards />
      <InvitationItinerary v-if="config.itinerario?.length" />
      <InvitationCourt v-if="config.corte || config.padrinos?.length" />
      <InvitationGallery v-if="config.galeria?.length" />
      <InvitationDressCode v-if="config.vestimenta" />
      <InvitationRegistry v-if="config.regalos" />
      <InvitationRsvp />
      <InvitationFooter />
    </main>

    <InvitationMusicPlayer
      v-if="opened && config.musica"
      :available="music.available.value"
      :playing="music.playing.value"
      :title="config.musica.titulo"
      @toggle="music.toggle()"
    />
  </div>
</template>
