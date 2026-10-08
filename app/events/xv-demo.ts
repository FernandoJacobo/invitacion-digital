import type { InvitationConfig } from './types'

const u = (id: string) => `https://images.unsplash.com/photo-${id}`

/**
 * XV años de ejemplo. Todos los nombres, lugares, teléfonos y datos bancarios son ficticios.
 */
export const xvDemo: InvitationConfig = {
  slug: 'xv',
  tipo: 'xv',
  titulo: 'Mariana Sofía',
  festejada: { nombre: 'Mariana Sofía', apodo: 'Mar', edad: 15 },
  anfitriones: [
    { titulo: 'Mis papás', nombres: ['Claudia Herrera Gómez', 'Roberto Aguilar Méndez'] },
    { titulo: 'Mis padrinos', nombres: ['Lucía Herrera Gómez', 'Miguel Ángel Torres'] },
  ],

  tema: {
    id: 'xv',
    esquema: 'oscuro',
    colores: {
      fondo: '#0A1029',
      superficie: '#121A3E',
      superficieAlt: '#0E1533',
      tinta: '#F5EFF3',
      tenue: '#B9BEDB',
      primario: '#E8B4A8',
      sobrePrimario: '#1B1531',
      acento: '#D9A596',
      acentoTinta: '#F0C3B6',
      linea: '#29335E',
      sobre: '#16204D',
      sobreSombra: '#0B112D',
      sello: '#E0AE9F',
    },
    tipografia: {
      display: 'Cinzel',
      script: 'Great Vibes',
      cuerpo: 'Montserrat',
      pesos: { display: [400, 500, 600], script: [400], cuerpo: [300, 400, 500] },
    },
    ornamentos: 'estelar',
    sobre: 'nocturno',
    efecto: 'destellos',
    themeColor: '#0A1029',
  },

  frase: 'Hay momentos que se viven una sola vez. Quiero que estés en el mío.',
  fotoPrincipal: {
    src: u('1419242902214-272b3f66ee7a'),
    alt: 'Cielo nocturno lleno de estrellas sobre montañas con un resplandor rosado en el horizonte',
    ratio: 1.5,
  },

  fecha: '2027-02-20T18:00:00-06:00',
  zonaHoraria: 'America/Mexico_City',

  ceremonia: {
    titulo: 'Misa de acción de gracias',
    nombre: 'Parroquia de Nuestra Señora de la Luz',
    direccion: 'Av. de las Estrellas 1520, Col. Jardines del Cielo, Guadalajara, Jal.',
    inicio: '2027-02-20T18:00:00-06:00',
    duracionMin: 60,
    coordenadas: { lat: 20.6736, lng: -103.4054 },
    imagen: { src: u('1502635385003-ee1e6a1a742d'), alt: 'Mesa con candelabro de cristal, velas y arreglos florales', ratio: 0.67 },
  },
  recepcion: {
    titulo: 'Recepción',
    nombre: 'Salón Gran Aurora',
    direccion: 'Av. Constelación 3480, Col. Lomas de Andrómeda, Guadalajara, Jal.',
    inicio: '2027-02-20T20:30:00-06:00',
    duracionMin: 330,
    coordenadas: { lat: 20.6869, lng: -103.4198 },
    nota: 'Estacionamiento propio del salón.',
    imagen: { src: u('1519167758481-83f550bb49b3'), alt: 'Salón de fiestas con candelabros y mesas redondas vestidas en dorado', ratio: 1.5 },
  },

  itinerario: [
    { hora: '18:00', titulo: 'Misa de acción de gracias', icono: 'iglesia' },
    { hora: '20:30', titulo: 'Recepción', descripcion: 'Bienvenida y cóctel', icono: 'llegada' },
    { hora: '21:15', titulo: 'Entrada de la quinceañera', icono: 'corona' },
    { hora: '21:30', titulo: 'Vals', descripcion: 'Con papá y la corte de honor', icono: 'vals' },
    { hora: '22:00', titulo: 'Cena', icono: 'cena' },
    { hora: '23:00', titulo: 'Cambio de zapatilla y brindis', icono: 'zapatilla' },
    { hora: '23:30', titulo: 'Baile sorpresa y fiesta', descripcion: '¡Que no pare la música!', icono: 'fiesta' },
  ],

  sobreMi: {
    titulo: 'Sobre mí',
    texto: 'Me encanta bailar, dibujar y pasar tiempo con mis amigas. Llevo meses soñando con esta noche y no la imagino sin las personas que más quiero. ¡Prepárate para bailar conmigo!',
    datos: [
      { etiqueta: 'Mi color', valor: 'Oro rosado' },
      { etiqueta: 'Me apasiona', valor: 'La danza y el arte' },
      { etiqueta: 'Canción del vals', valor: 'Una sorpresa ✨' },
    ],
    foto: { src: u('1518895949257-7621c3c786d7'), alt: 'Rosa rosada en un florero de cristal con luz cálida de atardecer', ratio: 0.67 },
  },

  galeria: [
    { src: u('1467810563316-b5476525c0f9'), alt: 'Manos sosteniendo luces de bengala encendidas al anochecer', ratio: 1.5 },
    { src: u('1535254973040-607b474cb50d'), alt: 'Pastel de varios pisos decorado con rosas', ratio: 0.67 },
    { src: u('1549465220-1a8b9238cd48'), alt: 'Caja de regalo rosa con moño dorado y confeti', ratio: 1.5 },
    { src: u('1563241527-3004b7be0ffd'), alt: 'Arreglo de flores en tonos rosa y durazno', ratio: 0.67 },
    { src: u('1492684223066-81342ee5ff30'), alt: 'Lluvia de confeti iluminada en una pista de baile', ratio: 1.5 },
    { src: u('1511795409834-ef04bbd61622'), alt: 'Mesa de banquete con flores de colores y copas', ratio: 1.5 },
    { src: u('1475274047050-1d0c0975c63e'), alt: 'Cielo nocturno azul profundo lleno de estrellas', ratio: 1.5 },
    { src: u('1566737236500-c8ac43014a67'), alt: 'Pista de baile con luces rosas y azules', ratio: 1.5 },
  ],

  padrinos: [
    { rol: 'Padrinos de velación', nombres: 'Lucía Herrera y Miguel Ángel Torres' },
    { rol: 'Padrinos de anillo', nombres: 'Teresa y Jorge Delgado' },
    { rol: 'Madrina de última muñeca', nombres: 'Adriana Aguilar Méndez' },
    { rol: 'Padrino de zapatilla', nombres: 'Raúl Herrera Gómez' },
  ],

  corte: {
    chambelanPrincipal: 'Diego Alejandro Ruiz',
    damas: ['Valentina Ochoa', 'Regina Castañeda', 'Ximena Pacheco', 'Renata Lozano'],
    chambelanes: ['Emiliano Vargas', 'Sebastián Montes', 'Leonardo Fuentes', 'Matías Robles'],
    nota: 'Gracias por tantos ensayos, risas y desveladas.',
  },

  vestimenta: {
    codigo: 'Etiqueta rigurosa',
    descripcion: 'Una noche de gala bajo las estrellas.',
    notas: [
      'Caballeros: traje oscuro o smoking.',
      'Damas: vestido largo de noche.',
    ],
    sugeridos: [
      { nombre: 'Azul medianoche', hex: '#1E2A5A' },
      { nombre: 'Plata', hex: '#C9CCD6' },
      { nombre: 'Negro', hex: '#151515' },
      { nombre: 'Esmeralda', hex: '#1F5F4E' },
      { nombre: 'Vino', hex: '#6B2338' },
    ],
    reservados: [
      { nombre: 'Oro rosado', hex: '#E8B4A8', motivo: 'Reservado para la festejada' },
      { nombre: 'Rosa palo', hex: '#F2CFC8', motivo: 'Reservado para la corte de honor' },
    ],
  },

  regalos: {
    intro: 'Lo más importante es que me acompañes. Si quieres tener un detalle conmigo:',
    sobres: 'Habrá un buzón para lluvia de sobres en la recepción.',
    mesas: [
      { tienda: 'Liverpool', numero: '59876543', url: 'https://mesaderegalos.liverpool.com.mx/' },
    ],
    transferencia: {
      banco: 'Banco Ficticio de Occidente',
      titular: 'Claudia Herrera Gómez',
      clabe: '987654321098765432',
      concepto: 'XV Mariana Sofía',
    },
  },

  rsvp: {
    fechaLimite: '2027-01-31',
    whatsapp: '5213398765432',
    contacto: 'la familia Aguilar Herrera',
    pasesPorDefecto: 2,
    maxPases: 10,
    preguntarRestricciones: true,
    preguntarMensaje: true,
  },

  musica: {
    src: '/audio/xv.mp3',
    titulo: 'Mi vals',
  },

  hashtag: '#LosXVdeMar',
  redes: [
    { red: 'instagram', url: 'https://www.instagram.com/explore/tags/losxvdemar/', etiqueta: 'Etiquétame en Instagram' },
    { red: 'tiktok', url: 'https://www.tiktok.com/tag/losxvdemar', etiqueta: 'Sube tus videos a TikTok' },
  ],

  cierre: {
    mensaje: 'Gracias por acompañarme en una de las noches más especiales de mi vida.',
    firma: 'Mariana Sofía',
  },

  seo: {
    titulo: 'Mis XV años · Mariana Sofía',
    descripcion: 'Sábado 20 de febrero de 2027 · Salón Gran Aurora, Guadalajara. Confirma tu asistencia aquí.',
    imagen: `${u('1419242902214-272b3f66ee7a')}?w=1200&h=630&q=70&fit=crop&auto=format`,
  },
}
