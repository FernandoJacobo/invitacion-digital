/**
 * Reproductor de música de fondo.
 * - Los navegadores bloquean el autoplay: la música arranca con el toque que abre el sobre.
 * - Si el archivo no existe (o el hosting responde con HTML), el reproductor se oculta.
 * - Recuerda si el invitado la pausó (`localStorage`) y se pausa sola al cambiar de pestaña.
 */
const DEFAULT_VOLUME = 0.35

export function useMusic(slug: string, src: string | undefined) {
  const available = ref<boolean | null>(src ? null : false)
  const playing = ref(false)
  const storageKey = `inv-music-${slug}`
  const preference = useLocalStorage<'on' | 'off'>(storageKey, 'on')

  let audio: HTMLAudioElement | null = null
  let resumeOnVisible = false
  let fadeFrame = 0

  function ensureAudio(): HTMLAudioElement | null {
    if (!src || available.value === false) return null
    if (audio) return audio
    audio = new Audio()
    audio.src = src
    audio.loop = true
    audio.preload = 'none'
    audio.volume = 0
    audio.addEventListener('play', () => (playing.value = true))
    audio.addEventListener('pause', () => (playing.value = false))
    audio.addEventListener('error', () => {
      available.value = false
      playing.value = false
    })
    audio.addEventListener('canplay', () => (available.value = true), { once: true })
    return audio
  }

  function fadeTo(target: number, ms = 1200) {
    if (!audio) return
    cancelAnimationFrame(fadeFrame)
    const el = audio
    const from = el.volume
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      el.volume = from + (target - from) * t
      if (t < 1) fadeFrame = requestAnimationFrame(step)
    }
    fadeFrame = requestAnimationFrame(step)
  }

  async function play() {
    const el = ensureAudio()
    if (!el) return
    try {
      await el.play()
      fadeTo(DEFAULT_VOLUME)
    }
    catch (error) {
      // NotAllowedError: el navegador exige otro gesto; NotSupportedError: el archivo no es audio.
      if ((error as DOMException)?.name !== 'NotAllowedError') available.value = false
    }
  }

  function pause() {
    audio?.pause()
  }

  /**
   * Comprueba si el archivo existe y es audio. Se hace al abrir el sobre (no al cargar la página)
   * para no generar peticiones ni errores 404 en consola antes de que el invitado interactúe.
   * Con `_redirects` un archivo faltante responde `index.html` (200, text/html): también se descarta.
   */
  async function probe() {
    if (!src || available.value !== null) return
    try {
      const res = await fetch(src, { method: 'HEAD', cache: 'no-store' })
      const type = res.headers.get('content-type') ?? ''
      const isAudio = res.ok && (!type || type.startsWith('audio/') || type.includes('octet-stream'))
      if (available.value === null) available.value = isAudio
    }
    catch {
      // Sin red: se decide al intentar reproducir.
    }
  }

  /** Llamar dentro del gesto del usuario (abrir el sobre). */
  function start() {
    if (preference.value === 'on') void play()
    else ensureAudio()
    void probe()
  }

  function toggle() {
    if (playing.value) {
      pause()
      preference.value = 'off'
    }
    else {
      preference.value = 'on'
      void play()
    }
  }

  const visibility = useDocumentVisibility()
  watch(visibility, (v) => {
    if (!audio) return
    if (v === 'hidden' && playing.value) {
      resumeOnVisible = true
      audio.pause()
    }
    else if (v === 'visible' && resumeOnVisible) {
      resumeOnVisible = false
      void play()
    }
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(fadeFrame)
    audio?.pause()
    audio = null
  })

  return { available, playing, start, toggle }
}
