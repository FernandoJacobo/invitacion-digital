import type { InvitationConfig } from '../events/types'
import { monogramFor, nightStars, starBurstPath, waxSealPath } from './ornaments'

/**
 * Portada estática del sobre cerrado para el HTML generado de cada invitación.
 *
 * Con `ssr: false` el navegador solo pinta algo útil cuando descarga y ejecuta la app. En un
 * celular de gama media con datos móviles eso tarda varios segundos; esta réplica en HTML/CSS puro
 * (mismas medidas que `Envelope.vue`) se pinta de inmediato y la app la reemplaza al montar.
 */

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function staticCoverHtml(config: InvitationConfig): string {
  const c = config.tema.colores
  const t = config.tema.tipografia
  const night = config.tema.sobre === 'nocturno'
  const eyebrow = config.tipo === 'boda' ? 'Tienes una invitación a nuestra boda' : 'Tienes una invitación a mis XV años'
  const monogram = esc(monogramFor(config))

  const background = night
    ? `radial-gradient(60% 45% at 50% 42%, color-mix(in oklab, ${c.acento} 22%, transparent), transparent 70%), radial-gradient(120% 90% at 50% 0%, #1A2559, transparent 65%), ${c.fondo}`
    : `radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, white 60%, transparent), transparent 60%), radial-gradient(90% 60% at 50% 110%, color-mix(in oklab, ${c.acento} 14%, transparent), transparent 70%), ${c.fondo}`

  const seal = night
    ? `<svg viewBox="0 0 100 100"><defs><radialGradient id="scg" cx="38%" cy="32%" r="75%"><stop offset="0%" stop-color="#FBE3DA"/><stop offset="55%" stop-color="#E2AE9F"/><stop offset="100%" stop-color="#A86F62"/></radialGradient></defs><circle cx="50" cy="50" r="46" fill="url(#scg)"/><path d="${starBurstPath()}" fill="rgb(255 248 244 / .9)"/><text x="50" y="51.5" text-anchor="middle" dominant-baseline="middle" fill="#9B5F52" style="font-family:'${t.display}',serif;font-size:13px;font-weight:600;letter-spacing:.5px">${monogram}</text></svg>`
    : `<svg viewBox="0 0 100 100"><defs><radialGradient id="scg" cx="38%" cy="32%" r="75%"><stop offset="0%" style="stop-color:color-mix(in oklab, ${c.sello} 62%, white)"/><stop offset="55%" stop-color="${c.sello}"/><stop offset="100%" style="stop-color:color-mix(in oklab, ${c.sello} 62%, black)"/></radialGradient></defs><path d="${waxSealPath()}" fill="url(#scg)"/><circle cx="50" cy="50" r="33" fill="none" stroke="rgb(255 255 255 / .28)" stroke-width="1.2"/><text x="50" y="51" text-anchor="middle" dominant-baseline="middle" fill="rgb(255 253 245 / .92)" style="font-family:'${t.script}',cursive;font-size:30px">${monogram}</text></svg>`

  const stars = night
    ? nightStars().map(s => `<i style="left:${s.left};top:${s.top};width:${s.size}px;height:${s.size}px;animation-delay:${s.delay}"></i>`).join('')
    : ''

  const nameStyle = night
    ? `font-family:'${t.display}',serif;letter-spacing:.06em;font-weight:400`
    : `font-family:'${t.display}',serif;font-style:italic;font-weight:500`

  return `<style>
.sc{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 24px;overflow:hidden;background:${background};color:${c.tinta};text-align:center}
.sc-in{display:flex;flex-direction:column;align-items:center;width:100%;max-width:420px;padding:16px 8px}
.sc-eb{display:block;max-width:18rem;margin-bottom:2rem;font:500 .75rem/1.65 '${t.cuerpo}',system-ui,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:${c.acentoTinta}}
.sc-env{position:relative;display:block;width:min(80vw,340px);aspect-ratio:100/69}
.sc-env>*{position:absolute}
.sc-back{inset:0;border-radius:6px;background:${c.sobreSombra};box-shadow:0 26px ${night ? '40px -6px rgb(0 0 0 / .55)' : `30px -6px color-mix(in oklab, ${c.tinta} 24%, transparent)`}}
.sc-pocket,.sc-flap{left:0;top:0;width:100%}
.sc-pocket{height:100%}
.sc-flap{height:61%}
.sc-seal{left:50%;top:61%;width:22%;aspect-ratio:1;transform:translate(-50%,-50%);filter:drop-shadow(0 4px 6px rgb(0 0 0 / .25))}
.sc-seal svg{display:block;width:100%;height:100%}
.sc-nm{display:block;visibility:hidden;margin-top:2.5rem;font-size:clamp(2.2rem,9vw,3rem);line-height:1;${nameStyle}}
.sc-chip{display:none;margin-top:1.25rem;padding:8px 16px;border:1px solid ${c.linea};border-radius:999px;font:400 .875rem/1.4 '${t.cuerpo}',system-ui,sans-serif}
.sc-chip span{color:${c.tenue}}
.sc-cue{margin-top:1.5rem;font:400 .875rem/1.4 '${t.cuerpo}',system-ui,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:${c.tenue}}
.sc-stars i{position:absolute;border-radius:50%;background:#fff;opacity:.25;animation:sc-tw 4s ease-in-out infinite}
@keyframes sc-tw{50%{opacity:.95}}
@media (prefers-reduced-motion:reduce){.sc-stars i{animation:none}}
</style>
<div class="sc" id="static-cover" aria-hidden="true">
<div class="sc-stars" aria-hidden="true">${stars}</div>
<div class="sc-in">
<span class="sc-eb">${esc(eyebrow)}</span>
<span class="sc-env" aria-hidden="true">
<span class="sc-back"></span>
<svg class="sc-pocket" viewBox="0 0 100 69" preserveAspectRatio="none"><polygon points="0,0 50,40 0,69" fill="${c.sobre}"/><polygon points="100,0 50,40 100,69" fill="${c.sobre}"/><polygon points="0,69 50,34 100,69" style="fill:color-mix(in oklab, ${c.sobre} 92%, ${c.sobreSombra})"/></svg>
<svg class="sc-flap" viewBox="0 0 100 42" preserveAspectRatio="none"><polygon points="0,0 100,0 50,42" style="fill:color-mix(in oklab, ${c.sobre} 94%, white)"/></svg>
<span class="sc-seal">${seal}</span>
</span>
<span class="sc-nm" id="sc-nm">${esc(config.titulo)}</span>
<span class="sc-chip" id="sc-chip"><span>Invitación para:</span> <strong id="sc-guest"></strong></span>
<span class="sc-cue">Toca para abrir</span>
</div>
</div>
<script>(function(){var nm=document.getElementById('sc-nm'),show=function(){nm.style.visibility='visible'};setTimeout(show,2500);try{document.fonts.load('${night ? '400' : 'italic 500'} 1em "${t.display}"').then(show,show)}catch(e){show()}})()</script>
<script>(function(){try{var q=new URLSearchParams(location.search),n=(q.get('invitado')||'').replace(/[\\u0000-\\u001F<>]/g,'').trim().slice(0,60),p=parseInt(q.get('pases')||'',10);if(n.length<2&&!(p>0))return;var g=document.getElementById('sc-guest');g.textContent=(n.length>=2?n:'ti')+' · '+(p=p>0?Math.min(p,${config.rsvp.maxPases}):${config.rsvp.pasesPorDefecto})+(p===1?' pase':' pases');document.getElementById('sc-chip').style.display='inline-block'}catch(e){}})()</script>`
}
