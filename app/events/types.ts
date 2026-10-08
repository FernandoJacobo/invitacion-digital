/**
 * Contrato de una invitación. Cada evento (boda, XV, bautizo…) es un archivo en `app/events/`
 * que exporta un objeto que cumple esta interfaz. Los componentes solo leen de aquí:
 * si un campo opcional no existe, su sección no se renderiza.
 *
 * Importante: estos archivos se leen también desde `nuxt.config.ts` (fuentes y metas sociales),
 * así que solo deben usar imports relativos y datos planos (sin auto-imports de Nuxt).
 */

export type TipoEvento = 'boda' | 'xv'

/** Fecha y hora ISO 8601 con desfase, p. ej. `2027-04-17T17:00:00-06:00`. */
export type ISODateTime = string

export interface Imagen {
  /** URL base (Unsplash u otra). Los parámetros de tamaño se agregan en `utils/images.ts`. */
  src: string
  alt: string
  /** Proporción ancho/alto aproximada para reservar espacio y evitar saltos de layout. */
  ratio?: number
}

export interface PaletaTema {
  /** Fondo principal de la página. */
  fondo: string
  /** Fondo de tarjetas y superficies elevadas. */
  superficie: string
  /** Fondo alterno para bandas/secciones. */
  superficieAlt: string
  /** Texto principal (contraste AA sobre `fondo` y `superficie`). */
  tinta: string
  /** Texto secundario (contraste AA sobre `fondo`). */
  tenue: string
  /** Color de botones principales. */
  primario: string
  /** Texto sobre `primario`. */
  sobrePrimario: string
  /** Acento decorativo (ornamentos, filetes). */
  acento: string
  /** Acento con contraste suficiente para usarse como texto. */
  acentoTinta: string
  /** Bordes y separadores. */
  linea: string
  /** Color del sobre de la portada. */
  sobre: string
  sobreSombra: string
  /** Color del sello / broche del sobre. */
  sello: string
}

export interface TipografiaTema {
  /** Familia para títulos y nombres (serif). */
  display: string
  /** Familia caligráfica para detalles (ampersand, firmas). */
  script: string
  /** Familia para el cuerpo de texto. */
  cuerpo: string
  /** Pesos a descargar por familia (solo los necesarios). */
  pesos: { display: number[], script: number[], cuerpo: number[] }
  /** Si la familia display necesita itálicas. */
  displayItalica?: boolean
}

export interface Tema {
  /** Identificador CSS (`data-theme`). */
  id: string
  /** Modo de color base (afecta scrollbars, controles nativos y toasts). */
  esquema: 'claro' | 'oscuro'
  colores: PaletaTema
  tipografia: TipografiaTema
  /** Ornamentos SVG de separadores y marcos. */
  ornamentos: 'botanico' | 'estelar'
  /** Estilo del sobre de la portada. */
  sobre: 'sello-cera' | 'nocturno'
  /** Efecto decorativo ambiental. */
  efecto: 'petalos' | 'destellos' | 'ninguno'
  /** Color de la barra del navegador móvil. */
  themeColor: string
}

export interface Persona {
  nombre: string
  apodo?: string
}

export interface Lugar {
  /** Etiqueta de la tarjeta: "Ceremonia religiosa", "Misa de acción de gracias"… */
  titulo: string
  nombre: string
  direccion: string
  inicio: ISODateTime
  /** Duración estimada en minutos (para el calendario). */
  duracionMin: number
  coordenadas: { lat: number, lng: number }
  /** Enlace directo de Google Maps. Si falta, se arma con las coordenadas. */
  mapsUrl?: string
  nota?: string
  imagen?: Imagen
}

export type IconoMomento =
  | 'iglesia' | 'anillos' | 'copas' | 'cena' | 'vals' | 'baile' | 'pastel'
  | 'foto' | 'musica' | 'corona' | 'zapatilla' | 'brindis' | 'fiesta' | 'luna' | 'llegada'

export interface Momento {
  hora: string // "17:00"
  titulo: string
  descripcion?: string
  icono: IconoMomento
}

export interface Hito {
  fecha: string // texto libre: "Marzo 2018"
  titulo: string
  texto: string
  imagen?: Imagen
}

export interface Padrino {
  rol: string
  nombres: string
}

export interface CorteDeHonor {
  chambelanPrincipal?: string
  damas: string[]
  chambelanes: string[]
  nota?: string
}

export interface MuestraColor {
  nombre: string
  hex: string
}

export interface Vestimenta {
  codigo: string
  descripcion: string
  notas: string[]
  sugeridos: MuestraColor[]
  reservados?: (MuestraColor & { motivo: string })[]
}

export interface MesaRegalos {
  tienda: string
  numero?: string
  url: string
}

export interface Transferencia {
  banco: string
  titular: string
  clabe: string
  cuenta?: string
  concepto?: string
}

export interface Regalos {
  intro: string
  mesas?: MesaRegalos[]
  transferencia?: Transferencia
  /** Texto para "lluvia de sobres". */
  sobres?: string
}

export interface ConfigRsvp {
  /** Fecha límite (YYYY-MM-DD). */
  fechaLimite: string
  /** WhatsApp del anfitrión en formato internacional sin "+" (52 + 10 dígitos). */
  whatsapp: string
  /** Nombre con el que se dirige el mensaje: "Valeria y Santiago". */
  contacto: string
  /** Pases si la URL no trae `pases`. */
  pasesPorDefecto: number
  /** Tope absoluto de pases que se aceptan por URL. */
  maxPases: number
  preguntarRestricciones: boolean
  preguntarMensaje: boolean
}

export interface Musica {
  /** Ruta dentro de `public/`, p. ej. `/audio/boda.mp3`. */
  src: string
  titulo: string
  artista?: string
}

export interface RedSocial {
  red: 'instagram' | 'facebook' | 'tiktok'
  url: string
  etiqueta: string
}

export interface SeoEvento {
  titulo: string
  descripcion: string
  /** URL absoluta de la imagen Open Graph (1200×630). */
  imagen: string
}

export interface InvitationConfig {
  /** Ruta pública: `/boda`, `/xv`. Solo minúsculas, números y guiones. */
  slug: string
  tipo: TipoEvento
  tema: Tema

  /** Nombre corto que se muestra en portada y título: "Valeria & Santiago". */
  titulo: string
  /** Boda: los novios. */
  novios?: { ella: Persona, el: Persona }
  /** XV: la festejada. */
  festejada?: Persona & { edad: number }
  /** Padres o anfitriones que invitan. */
  anfitriones?: { titulo: string, nombres: string[] }[]

  /** Frase principal del hero. */
  frase: string
  /** Autor de la frase (opcional). */
  fraseAutor?: string
  fotoPrincipal: Imagen

  /** Fecha y hora del evento principal (cuenta regresiva). */
  fecha: ISODateTime
  zonaHoraria: 'America/Mexico_City'

  ceremonia?: Lugar
  recepcion: Lugar
  itinerario?: Momento[]

  /** Boda: línea del tiempo de la pareja. */
  historia?: { titulo: string, intro?: string, hitos: Hito[] }
  /** XV: tarjeta de presentación de la festejada. */
  sobreMi?: { titulo: string, texto: string, datos: { etiqueta: string, valor: string }[], foto: Imagen }

  galeria?: Imagen[]
  padrinos?: Padrino[]
  corte?: CorteDeHonor
  vestimenta?: Vestimenta
  regalos?: Regalos
  rsvp: ConfigRsvp
  musica?: Musica
  hashtag?: string
  redes?: RedSocial[]
  cierre: { mensaje: string, firma: string }
  seo: SeoEvento
}
