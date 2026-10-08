<script setup lang="ts">
/** Corte de honor (XV) y padrinos (boda/XV). */
const { config } = useInvitation()
const corte = config.corte
const padrinos = config.padrinos ?? []
const title = corte ? 'Corte de honor' : 'Padrinos'
</script>

<template>
  <InvitationSection id="corte" :eyebrow="corte ? 'Quienes me acompañan' : 'Nos acompañan'" :title="title">
    <template v-if="corte">
      <div v-if="corte.chambelanPrincipal" v-reveal class="card mx-auto mb-8 max-w-sm px-6 py-8 text-center">
        <Icon name="lucide:crown" class="mx-auto size-7 text-accent-ink" />
        <p class="eyebrow mt-3">
          Chambelán de honor
        </p>
        <p class="mt-2 font-display text-3xl text-ink">
          {{ corte.chambelanPrincipal }}
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2">
        <div v-reveal class="card px-6 py-7 text-center">
          <p class="eyebrow">
            Damas
          </p>
          <ul class="mt-4 space-y-2 font-display text-xl text-ink">
            <li v-for="n in corte.damas" :key="n">
              {{ n }}
            </li>
          </ul>
        </div>
        <div v-reveal="120" class="card px-6 py-7 text-center">
          <p class="eyebrow">
            Chambelanes
          </p>
          <ul class="mt-4 space-y-2 font-display text-xl text-ink">
            <li v-for="n in corte.chambelanes" :key="n">
              {{ n }}
            </li>
          </ul>
        </div>
      </div>
      <p v-if="corte.nota" v-reveal class="mt-8 text-center font-display text-lg italic text-muted">
        {{ corte.nota }}
      </p>
    </template>

    <div v-if="padrinos.length" :class="corte ? 'mt-16' : ''">
      <p v-if="corte" v-reveal class="eyebrow mb-6 text-center">
        Mis padrinos
      </p>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="(p, i) in padrinos"
          :key="p.rol"
          v-reveal="(i % 3) * 90"
          class="rounded-2xl border border-line px-5 py-5 text-center"
        >
          <p class="text-[0.7rem] font-medium tracking-[0.22em] text-accent-ink uppercase">
            {{ p.rol }}
          </p>
          <p class="mt-2 font-display text-xl leading-snug text-ink">
            {{ p.nombres }}
          </p>
        </li>
      </ul>
    </div>
  </InvitationSection>
</template>
