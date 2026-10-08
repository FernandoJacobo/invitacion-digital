<script setup lang="ts">
import { pad2 } from '~/utils/countdown'

/** Cuenta regresiva en vivo con dígitos que se deslizan al cambiar. */
const { config } = useInvitation()
const countdown = useCountdown(config.fecha)

const units = computed(() => [
  { label: countdown.value.days === 1 ? 'Día' : 'Días', value: String(countdown.value.days).padStart(2, '0') },
  { label: 'Horas', value: pad2(countdown.value.hours) },
  { label: 'Min', value: pad2(countdown.value.minutes) },
  { label: 'Seg', value: pad2(countdown.value.seconds) },
])

const longDate = capitalize(formatLongDate(config.fecha))
</script>

<template>
  <InvitationSection id="cuenta-regresiva" alt eyebrow="Falta muy poco" :title="countdown.done ? undefined : 'Cuenta regresiva'">
    <div v-if="!countdown.done" class="text-center">
      <div
        v-reveal
        class="mx-auto grid max-w-xl grid-cols-4 gap-2.5 sm:gap-4"
        role="timer"
        aria-live="off"
        :aria-label="`Faltan ${countdown.days} días, ${countdown.hours} horas y ${countdown.minutes} minutos`"
      >
        <div v-for="unit in units" :key="unit.label" class="card flex flex-col items-center px-1 py-4 sm:py-6">
          <span class="digits relative flex h-[1.1em] overflow-hidden font-display text-[clamp(2.1rem,10vw,3.6rem)] font-medium leading-none tabular-nums lining-nums text-ink">
            <span v-for="(digit, i) in unit.value.split('')" :key="i" class="relative inline-block w-[0.62em] text-center">
              <Transition name="digit">
                <span :key="digit" class="absolute inset-x-0 top-0">{{ digit }}</span>
              </Transition>
              <span class="invisible">0</span>
            </span>
          </span>
          <span class="mt-2 text-[0.7rem] font-medium tracking-[0.22em] text-muted uppercase">{{ unit.label }}</span>
        </div>
      </div>
      <p v-reveal="120" class="mt-8 text-muted">
        {{ longDate }} · {{ formatTime(config.fecha) }}
      </p>
    </div>

    <div v-else v-reveal class="mx-auto max-w-md text-center">
      <Icon name="lucide:heart" class="mx-auto size-8 text-accent-ink" />
      <p class="section-title mt-4">
        ¡Gracias por acompañarnos!
      </p>
      <p class="mt-4 text-muted">
        El gran día ya llegó. Gracias por ser parte de este momento tan especial.
      </p>
    </div>
  </InvitationSection>
</template>

<style scoped>
.digit-enter-active,
.digit-leave-active {
  transition: transform 0.5s var(--ease-out-soft), opacity 0.5s;
}
.digit-enter-from {
  transform: translate3d(0, -70%, 0);
  opacity: 0;
}
.digit-leave-to {
  transform: translate3d(0, 70%, 0);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .digit-enter-active,
  .digit-leave-active {
    transition: none;
  }
}
</style>
