/**
 * `v-reveal`: aparición suave al entrar en pantalla (solo `opacity` y `transform`).
 * Uso: `v-reveal`, `v-reveal="150"` (retraso en ms) o `v-reveal:left="80"`.
 * Con `prefers-reduced-motion` el CSS muestra todo de inmediato.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  function getObserver() {
    if (observer) return observer
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    return observer
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined, string>('reveal', {
    mounted(el, binding) {
      el.classList.add('reveal')
      if (binding.arg) el.dataset.reveal = binding.arg
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (typeof IntersectionObserver === 'undefined') {
        el.classList.add('is-visible')
        return
      }
      getObserver().observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  })
})
