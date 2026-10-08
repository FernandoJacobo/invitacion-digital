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

// Rendimiento: mientras el sobre está cerrado solo se monta lo visible (hero e intro). El resto de las
// secciones (y sus chunks: galería, RSVP con zod, etc.) se monta al tocar el sobre: la animación de
// apertura es CSS en el compositor y dura ~2 s, tiempo de sobra para preparar la página sin bloquear la carga.
const showRest = ref(false)

function onOpen() {
  music.start()
  showRest.value = true
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
      @open="onOpen"
      @reveal="onReveal"
      @done="envelope = false"
    />

    <LazyEffectsSparkles v-if="opened && motionOk && config.tema.efecto === 'destellos'" />
    <LazyEffectsPetals v-if="opened && motionOk && config.tema.efecto === 'petalos'" />

    <main class="relative z-10" :inert="!opened" :aria-hidden="!opened">
      <InvitationHero />
      <InvitationIntro />
      <template v-if="showRest">
        <LazyInvitationCountdown />
        <LazyInvitationStory v-if="config.historia" />
        <LazyInvitationAboutMe v-if="config.sobreMi" />
        <LazyInvitationEventCards />
        <LazyInvitationItinerary v-if="config.itinerario?.length" />
        <LazyInvitationCourt v-if="config.corte || config.padrinos?.length" />
        <LazyInvitationGallery v-if="config.galeria?.length" />
        <LazyInvitationDressCode v-if="config.vestimenta" />
        <LazyInvitationRegistry v-if="config.regalos" />
        <LazyInvitationRsvp />
        <LazyInvitationFooter />
      </template>
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
