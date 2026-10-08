import { getCountdown } from '~/utils/countdown'

/** Cuenta regresiva reactiva que se actualiza cada segundo y se detiene sola al llegar a cero. */
export function useCountdown(target: string) {
  const now = ref(Date.now())
  const state = computed(() => getCountdown(target, now.value))

  const { pause } = useIntervalFn(() => {
    now.value = Date.now()
    if (state.value.done) pause()
  }, 1000)

  return state
}
