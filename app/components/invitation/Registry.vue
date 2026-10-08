<script setup lang="ts">
import { toast } from 'vue-sonner'
import { copyText } from '~/utils/browser'

/** Mesa de regalos, datos de transferencia (con copiar) y lluvia de sobres. */
const { config } = useInvitation()
const r = config.regalos!
const copied = ref<string | null>(null)

async function copy(value: string, label: string) {
  const ok = await copyText(value)
  if (ok) {
    copied.value = value
    toast.success(`${label} copiada`, { description: value })
    setTimeout(() => {
      if (copied.value === value) copied.value = null
    }, 2000)
  }
  else {
    toast.error('No se pudo copiar', { description: 'Mantén presionado el dato para copiarlo manualmente.' })
  }
}

const formatClabe = (clabe: string) => clabe.replace(/(\d{3})(\d{3})(\d{11})(\d)/, '$1 $2 $3 $4')
</script>

<template>
  <InvitationSection id="regalos" eyebrow="Mesa de regalos" title="Un detalle con amor">
    <p v-reveal class="mx-auto -mt-4 mb-12 max-w-lg text-balance text-center text-muted">
      {{ r.intro }}
    </p>

    <div class="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
      <article
        v-for="(mesa, i) in r.mesas"
        :key="mesa.tienda"
        v-reveal="i * 100"
        class="card flex flex-col items-center px-6 py-8 text-center"
        :class="r.mesas?.length === 1 ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-xl' : ''"
      >
        <span class="grid size-14 place-items-center rounded-full bg-surface-alt text-accent-ink">
          <Icon name="lucide:gift" class="size-6" />
        </span>
        <h3 class="mt-4 font-display text-2xl font-medium text-ink">
          {{ mesa.tienda }}
        </h3>
        <p v-if="mesa.numero" class="mt-1 text-sm text-muted">
          Evento <span class="font-medium tabular-nums text-ink">{{ mesa.numero }}</span>
        </p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <a :href="mesa.url" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            Ver mesa
            <Icon name="lucide:arrow-up-right" class="size-4" />
          </a>
          <button
            v-if="mesa.numero"
            type="button"
            class="btn btn-outline btn-sm"
            :aria-label="`Copiar número de evento ${mesa.numero}`"
            @click="copy(mesa.numero, 'Número de evento')"
          >
            <Icon :name="copied === mesa.numero ? 'lucide:check' : 'lucide:copy'" class="size-4" />
            Copiar número
          </button>
        </div>
      </article>

      <article v-if="r.transferencia" v-reveal="200" class="card px-6 py-8 md:col-span-2 md:mx-auto md:w-full md:max-w-xl">
        <div class="flex flex-col items-center text-center">
          <span class="grid size-14 place-items-center rounded-full bg-surface-alt text-accent-ink">
            <Icon name="lucide:landmark" class="size-6" />
          </span>
          <h3 class="mt-4 font-display text-2xl font-medium text-ink">
            Transferencia bancaria
          </h3>
        </div>
        <dl class="mt-6 divide-y divide-line rounded-2xl border border-line">
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <dt class="text-sm text-muted">
              Banco
            </dt>
            <dd class="text-right font-medium">
              {{ r.transferencia.banco }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3 px-4 py-3">
            <dt class="text-sm text-muted">
              Titular
            </dt>
            <dd class="text-right font-medium">
              {{ r.transferencia.titular }}
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3 py-2 pl-4 pr-2">
            <dt class="text-sm text-muted">
              CLABE
            </dt>
            <dd class="flex items-center gap-1">
              <span class="font-medium tabular-nums tracking-wide">{{ formatClabe(r.transferencia.clabe) }}</span>
              <button
                type="button"
                class="grid size-11 place-items-center rounded-full text-accent-ink hover:bg-surface-alt"
                aria-label="Copiar CLABE"
                @click="copy(r.transferencia.clabe, 'CLABE')"
              >
                <Icon :name="copied === r.transferencia.clabe ? 'lucide:check' : 'lucide:copy'" class="size-[18px]" />
              </button>
            </dd>
          </div>
          <div v-if="r.transferencia.cuenta" class="flex items-center justify-between gap-3 py-2 pl-4 pr-2">
            <dt class="text-sm text-muted">
              Cuenta
            </dt>
            <dd class="flex items-center gap-1">
              <span class="font-medium tabular-nums tracking-wide">{{ r.transferencia.cuenta }}</span>
              <button
                type="button"
                class="grid size-11 place-items-center rounded-full text-accent-ink hover:bg-surface-alt"
                aria-label="Copiar número de cuenta"
                @click="copy(r.transferencia.cuenta, 'Cuenta')"
              >
                <Icon :name="copied === r.transferencia.cuenta ? 'lucide:check' : 'lucide:copy'" class="size-[18px]" />
              </button>
            </dd>
          </div>
          <div v-if="r.transferencia.concepto" class="flex items-center justify-between gap-3 px-4 py-3">
            <dt class="text-sm text-muted">
              Concepto
            </dt>
            <dd class="text-right font-medium">
              {{ r.transferencia.concepto }}
            </dd>
          </div>
        </dl>
        <p class="mt-3 text-center text-xs text-muted">
          Datos bancarios ficticios de demostración.
        </p>
      </article>

      <article v-if="r.sobres" v-reveal class="flex items-center gap-4 rounded-2xl border border-dashed border-line px-6 py-5 md:col-span-2 md:mx-auto md:max-w-xl">
        <Icon name="lucide:mail" class="size-6 shrink-0 text-accent-ink" />
        <p class="text-ink">
          <span class="font-medium">Lluvia de sobres.</span> {{ r.sobres }}
        </p>
      </article>
    </div>
  </InvitationSection>
</template>
