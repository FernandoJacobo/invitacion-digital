/** `true` si el usuario NO pidió reducir movimiento. */
export function useMotionOk() {
  const reduced = usePreferredReducedMotion()
  return computed(() => reduced.value !== 'reduce')
}

/** Pausa efectos cuando la pestaña no está visible o el usuario pide menos movimiento. */
export function useEffectsActive() {
  const visibility = useDocumentVisibility()
  const motionOk = useMotionOk()
  return computed(() => motionOk.value && visibility.value === 'visible')
}
