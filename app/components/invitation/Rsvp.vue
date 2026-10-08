<script setup lang="ts">
import type { RsvpErrors, RsvpField, RsvpInput } from '~/utils/rsvp'
import { validateRsvp } from '~/utils/rsvp'
import { buildRsvpMessage, whatsappUrl } from '~/utils/whatsapp'
import { pasesLabel } from '~/utils/guest'

/**
 * Confirmación de asistencia. Valida en vivo con zod, guarda en `localStorage` (store Pinia),
 * muestra un agradecimiento animado y prepara el mensaje de WhatsApp para el anfitrión.
 */
const { config, guest } = useInvitation()
const store = useRsvpStore()
const motionOk = useMotionOk()

const maxPases = computed(() => guest.value.pases)
const mine = computed(() => store.mineFor(config.slug))
const editing = ref(false)
const showThanks = computed(() => !!mine.value && !editing.value)
const celebrate = ref(false)

const SUGERENCIAS = ['Vegetariano', 'Vegano', 'Sin gluten', 'Alergia a mariscos', 'Sin lácteos']

function initialForm(): RsvpInput {
  const m = mine.value
  return {
    nombre: m?.nombre ?? guest.value.invitado ?? '',
    asistencia: m?.asistencia ?? null,
    pases: m && m.pases > 0 ? Math.min(m.pases, maxPases.value) : maxPases.value,
    restricciones: m?.restricciones ?? '',
    mensaje: m?.mensaje ?? '',
  }
}

const form = reactive<RsvpInput>(initialForm())
const touched = reactive<Partial<Record<RsvpField, boolean>>>({})
const submitted = ref(false)
const errors = computed<RsvpErrors>(() => validateRsvp(form, maxPases.value).errors)

function errorFor(field: RsvpField) {
  return touched[field] || submitted.value ? errors.value[field] : undefined
}

// Si cambia la URL (otro invitado), se reinicia el formulario.
watch(() => guest.value, () => {
  if (!mine.value) Object.assign(form, initialForm())
})

function step(delta: number) {
  form.pases = Math.min(maxPases.value, Math.max(1, form.pases + delta))
  touched.pases = true
}

function addSuggestion(text: string) {
  const parts = form.restricciones.split(',').map(s => s.trim()).filter(Boolean)
  const i = parts.findIndex(p => p.toLowerCase() === text.toLowerCase())
  if (i >= 0) parts.splice(i, 1)
  else parts.push(text)
  form.restricciones = parts.join(', ')
}
const hasSuggestion = (text: string) => form.restricciones.toLowerCase().split(',').map(s => s.trim()).includes(text.toLowerCase())

const formEl = ref<HTMLFormElement>()

function submit() {
  submitted.value = true
  const result = validateRsvp(form, maxPases.value)
  if (!result.ok) {
    // Lleva el foco al primer campo con error.
    nextTick(() => formEl.value?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input')?.focus())
    return
  }
  store.submit(config.slug, result.data, { invitado: guest.value.invitado, pasesAsignados: maxPases.value })
  editing.value = false
  submitted.value = false
  celebrate.value = result.data.asistencia === 'si' && motionOk.value
  nextTick(() => document.getElementById('rsvp')?.scrollIntoView({ behavior: motionOk.value ? 'smooth' : 'auto', block: 'start' }))
}

function edit() {
  Object.assign(form, initialForm())
  for (const k of Object.keys(touched) as RsvpField[]) touched[k] = false
  celebrate.value = false
  editing.value = true
}

const waLink = computed(() => {
  const m = mine.value
  if (!m) return '#'
  return whatsappUrl(config.rsvp.whatsapp, buildRsvpMessage(config, m))
})

const deadline = formatDeadline(config.rsvp.fechaLimite)
const firstName = computed(() => mine.value?.nombre ?? '')

/** Entrada del agradecimiento con @vueuse/motion (sin movimiento si el usuario lo pidió). */
const thanksMotion = computed(() => motionOk.value
  ? { initial: { opacity: 0, y: 14, scale: 0.98 }, enter: { opacity: 1, y: 0, scale: 1, transition: { delay: 250, duration: 700 } } }
  : { initial: { opacity: 1 }, enter: { opacity: 1 } })
</script>

<template>
  <InvitationSection id="rsvp" alt eyebrow="R. S. V. P." title="Confirma tu asistencia" narrow>
    <p v-reveal class="-mt-4 mb-10 text-center text-muted">
      Te pedimos confirmar antes del <strong class="font-medium text-ink">{{ deadline }}</strong>.
    </p>

    <div v-reveal class="card relative overflow-hidden px-5 py-8 sm:px-10 sm:py-10">
      <Transition name="swap" mode="out-in">
        <!-- Agradecimiento -->
        <div v-if="showThanks && mine" key="thanks" class="text-center" aria-live="polite">
          <svg viewBox="0 0 64 64" class="check mx-auto size-16 text-accent-ink" aria-hidden="true">
            <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" stroke-width="2" class="check-circle" />
            <path d="M20 33l8 8 16-17" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-mark" />
          </svg>
          <h3 v-motion="thanksMotion" class="mt-5 text-balance font-display text-3xl font-medium text-ink">
            {{ mine.asistencia === 'si' ? `¡Gracias, ${firstName}!` : `Gracias por avisarnos, ${firstName}` }}
          </h3>
          <p class="mx-auto mt-3 max-w-sm text-muted">
            <template v-if="mine.asistencia === 'si'">
              Tu lugar está apartado. Nos hace mucha ilusión celebrar contigo.
            </template>
            <template v-else>
              Te vamos a extrañar. Gracias por tomarte el tiempo de responder.
            </template>
          </p>

          <dl class="mx-auto mt-6 max-w-sm divide-y divide-line rounded-2xl border border-line text-left text-sm">
            <div class="flex justify-between gap-4 px-4 py-3">
              <dt class="text-muted">
                Asistencia
              </dt>
              <dd class="font-medium">
                {{ mine.asistencia === 'si' ? `Sí · ${pasesLabel(mine.pases).replace('pase', 'persona')}` : 'No asistiré' }}
              </dd>
            </div>
            <div v-if="mine.restricciones" class="flex justify-between gap-4 px-4 py-3">
              <dt class="text-muted">
                Restricciones
              </dt>
              <dd class="text-right font-medium">
                {{ mine.restricciones }}
              </dd>
            </div>
            <div v-if="mine.mensaje" class="px-4 py-3">
              <dt class="text-muted">
                Tu mensaje
              </dt>
              <dd class="mt-1 italic">
                “{{ mine.mensaje }}”
              </dd>
            </div>
          </dl>

          <p class="mx-auto mt-6 max-w-sm text-sm text-muted">
            Último paso: envía tu confirmación por WhatsApp para que {{ config.rsvp.contacto }} la reciba.
          </p>
          <div class="mt-4 flex flex-col items-center gap-2">
            <a :href="waLink" target="_blank" rel="noopener" class="btn btn-wa w-full max-w-sm">
              <UiWhatsappIcon class="size-5" />
              Enviar confirmación por WhatsApp
            </a>
            <button type="button" class="btn btn-ghost btn-sm" @click="edit">
              <Icon name="lucide:pencil" class="size-4" />
              Modificar mi respuesta
            </button>
          </div>
        </div>

        <!-- Formulario -->
        <form v-else key="form" ref="formEl" novalidate class="space-y-7" @submit.prevent="submit">
          <p
            v-if="guest.personalizada"
            class="flex flex-wrap items-center justify-center gap-x-2 rounded-xl bg-surface-alt px-4 py-3 text-center text-sm"
          >
            <Icon name="lucide:users" class="size-4 text-accent-ink" />
            <span>Invitación para <strong class="font-medium">{{ guest.invitado ?? 'ti' }}</strong> · {{ pasesLabel(guest.pases) }}</span>
          </p>

          <div>
            <label for="rsvp-nombre" class="field-label">Nombre completo o familia</label>
            <input
              id="rsvp-nombre"
              v-model="form.nombre"
              type="text"
              class="field"
              autocomplete="name"
              placeholder="Ej. Familia Pérez"
              maxlength="80"
              :aria-invalid="!!errorFor('nombre')"
              :aria-describedby="errorFor('nombre') ? 'rsvp-nombre-err' : undefined"
              @blur="touched.nombre = true"
            >
            <p v-if="errorFor('nombre')" id="rsvp-nombre-err" class="field-error">
              {{ errorFor('nombre') }}
            </p>
          </div>

          <fieldset :data-invalid="!!errorFor('asistencia')" :aria-describedby="errorFor('asistencia') ? 'rsvp-asis-err' : undefined">
            <legend class="field-label">
              ¿Nos acompañas?
            </legend>
            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="opt in [{ v: 'si', t: 'Sí, ahí estaré', i: 'lucide:circle-check' }, { v: 'no', t: 'No podré ir', i: 'lucide:circle-x' }]"
                :key="opt.v"
                class="choice flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-3 py-3 text-center text-[0.95rem] transition"
                :class="form.asistencia === opt.v ? 'is-selected' : ''"
              >
                <input
                  v-model="form.asistencia"
                  type="radio"
                  name="asistencia"
                  :value="opt.v"
                  class="sr-only"
                  @change="touched.asistencia = true"
                >
                <Icon :name="opt.i" class="size-5" />
                <span class="font-medium">{{ opt.t }}</span>
              </label>
            </div>
            <p v-if="errorFor('asistencia')" id="rsvp-asis-err" class="field-error">
              {{ errorFor('asistencia') }}
            </p>
          </fieldset>

          <Transition name="expand">
            <div v-if="form.asistencia === 'si'" class="space-y-7">
              <div>
                <p id="rsvp-pases-label" class="field-label">
                  ¿Cuántas personas asistirán?
                </p>
                <div class="flex items-center gap-4">
                  <div class="flex items-center rounded-full border border-line bg-bg p-1" role="group" aria-labelledby="rsvp-pases-label">
                    <button type="button" class="grid size-11 place-items-center rounded-full hover:bg-surface-alt disabled:opacity-40" aria-label="Quitar una persona" :disabled="form.pases <= 1" @click="step(-1)">
                      <Icon name="lucide:minus" class="size-4" />
                    </button>
                    <output class="w-12 text-center font-display text-3xl tabular-nums" aria-live="polite">{{ form.pases }}</output>
                    <button type="button" class="grid size-11 place-items-center rounded-full hover:bg-surface-alt disabled:opacity-40" aria-label="Agregar una persona" :disabled="form.pases >= maxPases" @click="step(1)">
                      <Icon name="lucide:plus" class="size-4" />
                    </button>
                  </div>
                  <p class="text-sm text-muted">
                    de {{ pasesLabel(maxPases) }}<br>
                    <span class="text-xs">{{ guest.personalizada ? 'asignados a tu invitación' : 'disponibles' }}</span>
                  </p>
                </div>
                <p v-if="errorFor('pases')" class="field-error">
                  {{ errorFor('pases') }}
                </p>
              </div>

              <div v-if="config.rsvp.preguntarRestricciones">
                <label for="rsvp-restr" class="field-label">Restricciones alimenticias <span class="font-normal text-muted">(opcional)</span></label>
                <div class="mb-2.5 flex flex-wrap gap-2">
                  <button
                    v-for="s in SUGERENCIAS"
                    :key="s"
                    type="button"
                    class="min-h-9 rounded-full border px-3 text-sm transition"
                    :class="hasSuggestion(s) ? 'border-primary bg-primary text-on-primary' : 'border-line text-muted hover:border-accent'"
                    :aria-pressed="hasSuggestion(s)"
                    @click="addSuggestion(s)"
                  >
                    {{ s }}
                  </button>
                </div>
                <input
                  id="rsvp-restr"
                  v-model="form.restricciones"
                  type="text"
                  class="field"
                  maxlength="160"
                  placeholder="Ej. 1 vegetariano, alergia a nueces"
                  :aria-invalid="!!errorFor('restricciones')"
                  @blur="touched.restricciones = true"
                >
                <p v-if="errorFor('restricciones')" class="field-error">
                  {{ errorFor('restricciones') }}
                </p>
              </div>
            </div>
          </Transition>

          <div v-if="config.rsvp.preguntarMensaje">
            <label for="rsvp-msg" class="field-label">
              Mensaje para {{ config.tipo === 'boda' ? 'los novios' : config.festejada?.apodo ?? 'la festejada' }}
              <span class="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="rsvp-msg"
              v-model="form.mensaje"
              rows="3"
              class="field resize-none"
              maxlength="500"
              placeholder="Escribe unas palabras…"
              :aria-invalid="!!errorFor('mensaje')"
              @blur="touched.mensaje = true"
            />
            <p class="mt-1 text-right text-xs tabular-nums text-muted">
              {{ form.mensaje.length }}/500
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <button type="submit" class="btn btn-primary w-full">
              <Icon name="lucide:send" class="size-4" />
              {{ editing ? 'Guardar cambios' : 'Enviar confirmación' }}
            </button>
            <button v-if="editing" type="button" class="btn btn-ghost btn-sm" @click="editing = false">
              Cancelar
            </button>
            <p v-if="submitted && Object.keys(errors).length" class="text-center text-sm text-[#A83A33]" role="alert">
              Revisa los campos marcados.
            </p>
          </div>
        </form>
      </Transition>
    </div>

    <LazyEffectsConfetti v-if="celebrate" @done="celebrate = false" />
  </InvitationSection>
</template>

<style scoped>
.choice {
  border-color: var(--c-linea);
  background: var(--c-fondo);
  color: var(--c-tenue);
}
.choice:hover {
  border-color: var(--c-acento);
}
.choice:focus-within {
  outline: 2px solid var(--c-acento-tinta);
  outline-offset: 2px;
}
.choice.is-selected {
  border-color: var(--c-primario);
  background: color-mix(in oklab, var(--c-primario) 10%, var(--c-fondo));
  color: var(--c-tinta);
  box-shadow: 0 0 0 1px var(--c-primario) inset;
}
fieldset[data-invalid="true"] .choice {
  border-color: #C2625B;
}

.btn-wa {
  background: #1A7F45;
  color: #fff;
  box-shadow: 0 12px 24px -14px #1A7F45;
}
.btn-wa:hover {
  background: #156B3A;
}

.check-circle {
  stroke-dasharray: 190;
  stroke-dashoffset: 190;
  animation: draw 0.8s var(--ease-out-soft) forwards;
}
.check-mark {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: draw 0.45s var(--ease-out-soft) 0.55s forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s, transform 0.35s var(--ease-out-soft);
}
.swap-enter-from {
  opacity: 0;
  transform: translate3d(0, 12px, 0);
}
.swap-leave-to {
  opacity: 0;
  transform: translate3d(0, -8px, 0);
}

.expand-enter-active,
.expand-leave-active {
  transition: opacity 0.3s, transform 0.3s var(--ease-out-soft);
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translate3d(0, -6px, 0);
}

@media (prefers-reduced-motion: reduce) {
  .check-circle,
  .check-mark {
    animation: none;
    stroke-dashoffset: 0;
  }
  .swap-enter-active,
  .swap-leave-active,
  .expand-enter-active,
  .expand-leave-active {
    transition: none;
  }
}
</style>
