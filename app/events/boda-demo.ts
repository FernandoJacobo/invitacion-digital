import type { InvitationConfig } from './types'

const u = (id: string) => `https://images.unsplash.com/photo-${id}`

/**
 * Boda de ejemplo. Todos los nombres, lugares, teléfonos y datos bancarios son ficticios.
 */
export const bodaDemo: InvitationConfig = {
  slug: 'boda',
  tipo: 'boda',
  titulo: 'Valeria & Santiago',
  novios: {
    ella: { nombre: 'Valeria', apodo: 'Vale' },
    el: { nombre: 'Santiago', apodo: 'Santi' },
  },
  anfitriones: [
    { titulo: 'Padres de la novia', nombres: ['Laura Medina Ríos', 'Arturo Salcedo Peña'] },
    { titulo: 'Padres del novio', nombres: ['Gabriela Ortega Luna', 'Fernando Ibarra Solís'] },
  ],

  tema: {
    id: 'boda',
    esquema: 'claro',
    colores: {
      fondo: '#FAF6EE',
      superficie: '#FFFDF8',
      superficieAlt: '#F3EEE3',
      tinta: '#29322B',
      tenue: '#59635A',
      primario: '#55684E',
      sobrePrimario: '#FFFDF8',
      acento: '#B8975A',
      acentoTinta: '#80632C',
      linea: '#E4DAC6',
      sobre: '#F1E9D9',
      sobreSombra: '#DCCDB0',
      sello: '#6B7D5C',
    },
    tipografia: {
      display: 'Cormorant Garamond',
      script: 'Pinyon Script',
      cuerpo: 'Jost',
      pesos: { display: [400, 500, 600], script: [400], cuerpo: [300, 400, 500] },
      displayItalica: true,
    },
    ornamentos: 'botanico',
    sobre: 'sello-cera',
    efecto: 'petalos',
    themeColor: '#FAF6EE',
  },

  frase: 'Y en medio de todo, nos encontramos. Hoy elegimos caminar juntos para siempre.',
  fotoPrincipal: {
    src: u('1532712938310-34cb3982ef74'),
    alt: 'Pareja de novios caminando de la mano por un campo al atardecer, vista a lo lejos',
    ratio: 1.5,
  },

  fecha: '2027-04-17T17:00:00-06:00',
  zonaHoraria: 'America/Mexico_City',

  ceremonia: {
    titulo: 'Ceremonia religiosa',
    nombre: 'Capilla de San Miguel · Hacienda Los Encinos',
    direccion: 'Camino Real a Cajititlán km 4.5, San Lucas Evangelista, Tlajomulco de Zúñiga, Jal.',
    inicio: '2027-04-17T17:00:00-06:00',
    duracionMin: 60,
    coordenadas: { lat: 20.4628, lng: -103.3369 },
    nota: 'Te sugerimos llegar 20 minutos antes.',
    imagen: { src: u('1469371670807-013ccf25f16a'), alt: 'Pasillo de ceremonia al aire libre decorado con arreglos de rosas', ratio: 1.5 },
  },
  recepcion: {
    titulo: 'Recepción',
    nombre: 'Jardín Los Encinos · Hacienda Los Encinos',
    direccion: 'Camino Real a Cajititlán km 4.5, San Lucas Evangelista, Tlajomulco de Zúñiga, Jal.',
    inicio: '2027-04-17T19:30:00-06:00',
    duracionMin: 360,
    coordenadas: { lat: 20.4631, lng: -103.3362 },
    nota: 'Estacionamiento con valet sin costo.',
    imagen: { src: u('1519225421980-715cb0215aed'), alt: 'Mesa larga de banquete con flores silvestres y copas de cristal', ratio: 1.5 },
  },

  itinerario: [
    { hora: '17:00', titulo: 'Ceremonia religiosa', descripcion: 'Capilla de San Miguel', icono: 'iglesia' },
    { hora: '18:15', titulo: 'Sesión de fotos', descripcion: 'Con familia y amigos en el jardín', icono: 'foto' },
    { hora: '19:30', titulo: 'Cóctel de bienvenida', descripcion: 'Mezcal, aguas frescas y bocadillos', icono: 'copas' },
    { hora: '20:30', titulo: 'Entrada de los novios y primer baile', icono: 'vals' },
    { hora: '21:00', titulo: 'Cena', descripcion: 'Menú de tres tiempos', icono: 'cena' },
    { hora: '22:30', titulo: 'Brindis y pastel', icono: 'pastel' },
    { hora: '23:00', titulo: '¡A bailar!', descripcion: 'Hasta que el cuerpo aguante', icono: 'baile' },
  ],

  historia: {
    titulo: 'Nuestra historia',
    intro: 'Un café que se enfrió, una plática que no terminaba y una pregunta que cambió todo.',
    hitos: [
      {
        fecha: 'Septiembre 2018',
        titulo: 'Nos conocimos',
        texto: 'En la boda de unos amigos, compartiendo mesa y sin saber que años después seríamos los anfitriones.',
        imagen: { src: u('1520854221256-17451cc331bf'), alt: 'Manos de una pareja entrelazadas sobre un fondo verde', ratio: 1.5 },
      },
      {
        fecha: 'Febrero 2019',
        titulo: 'Primera cita',
        texto: 'Tacos en Chapultepec y una caminata larga por la Avenida Vallarta. Ninguno quería que terminara.',
      },
      {
        fecha: 'Julio 2022',
        titulo: 'Nuestro primer hogar',
        texto: 'Un departamento pequeño, dos plantas que sobrevivieron y muchos domingos de películas.',
      },
      {
        fecha: 'Diciembre 2025',
        titulo: '¡Dijo que sí!',
        texto: 'Frente al lago de Chapala, al atardecer, con un anillo escondido en el bolsillo del abrigo.',
        imagen: { src: u('1606800052052-a08af7148866'), alt: 'Dos argollas de oro sobre un fondo claro', ratio: 1.5 },
      },
    ],
  },

  galeria: [
    { src: u('1515934751635-c81c6bc9a2d8'), alt: 'Argollas de matrimonio sobre un ramo de rosas rosas', ratio: 1.5 },
    { src: u('1525258946800-98cfd641d0de'), alt: 'Ramo de rosas color durazno sostenido frente a un vestido blanco', ratio: 0.67 },
    { src: u('1465495976277-4387d4b0b4c6'), alt: 'Manos de los novios con argollas sobre un ramo de flores', ratio: 1.5 },
    { src: u('1523438885200-e635ba2c371e'), alt: 'Kiosco blanco decorado con flores para una ceremonia en jardín', ratio: 0.67 },
    { src: u('1522673607200-164d1b6ce486'), alt: 'Dos sillas decoradas con flores sobre el pasto frente a un lago', ratio: 1.5 },
    { src: u('1507504031003-b417219a0fde'), alt: 'Letrero de madera con la frase Mr & Mrs colgado de un árbol', ratio: 1.5 },
    { src: u('1519741497674-611481863552'), alt: 'Ramo de novia con flores blancas en penumbra cálida', ratio: 1.5 },
    { src: u('1544078751-58fee2d8a03b'), alt: 'Pareja de novios en una playa de arena negra, vista a lo lejos', ratio: 1.5 },
  ],

  padrinos: [
    { rol: 'Padrinos de velación', nombres: 'Rosa Elena y Javier Cárdenas' },
    { rol: 'Padrinos de anillos', nombres: 'Daniela y Óscar Villaseñor' },
    { rol: 'Padrinos de lazo', nombres: 'Mónica y Ricardo Estrada' },
    { rol: 'Padrinos de arras', nombres: 'Patricia y Héctor Navarro' },
    { rol: 'Dama de honor', nombres: 'Andrea Salcedo Medina' },
    { rol: 'Testigo del novio', nombres: 'Emilio Ibarra Ortega' },
  ],

  vestimenta: {
    codigo: 'Formal de jardín',
    descripcion: 'Una noche al aire libre entre encinos: elegante, fresca y cómoda.',
    notas: [
      'Caballeros: traje completo, corbata opcional.',
      'Damas: vestido largo o midi. Sugerimos tacón grueso por el jardín.',
      'Por la noche refresca: trae un rebozo o saco ligero.',
    ],
    sugeridos: [
      { nombre: 'Salvia', hex: '#9CAF94' },
      { nombre: 'Terracota', hex: '#C47E5A' },
      { nombre: 'Lavanda', hex: '#B4A7C6' },
      { nombre: 'Azul polvo', hex: '#9FB4C7' },
      { nombre: 'Champaña', hex: '#E3CFA9' },
    ],
    reservados: [
      { nombre: 'Blanco', hex: '#FFFFFF', motivo: 'Reservado para la novia' },
      { nombre: 'Marfil', hex: '#F3EAD7', motivo: 'Reservado para la novia' },
    ],
  },

  regalos: {
    intro: 'Tu presencia es nuestro mejor regalo. Si deseas tener un detalle con nosotros, te dejamos estas opciones.',
    mesas: [
      { tienda: 'Liverpool', numero: '51234567', url: 'https://mesaderegalos.liverpool.com.mx/' },
      { tienda: 'Amazon', url: 'https://www.amazon.com.mx/wedding' },
    ],
    transferencia: {
      banco: 'Banco Ficticio del Bajío',
      titular: 'Valeria Salcedo Medina',
      clabe: '012345678901234567',
      cuenta: '0123456789',
      concepto: 'Boda Valeria y Santiago',
    },
  },

  rsvp: {
    fechaLimite: '2027-03-20',
    whatsapp: '5213312345678',
    contacto: 'Valeria y Santiago',
    pasesPorDefecto: 2,
    maxPases: 10,
    preguntarRestricciones: true,
    preguntarMensaje: true,
  },

  musica: {
    src: '/audio/boda.mp3',
    titulo: 'Nuestra canción',
  },

  hashtag: '#ValeYSantiSeCasan',
  redes: [
    { red: 'instagram', url: 'https://www.instagram.com/explore/tags/valeysantisecasan/', etiqueta: 'Comparte tus fotos en Instagram' },
  ],

  cierre: {
    mensaje: 'Gracias por ser parte de nuestra historia. Nos hace muy felices compartir este día contigo.',
    firma: 'Valeria & Santiago',
  },

  seo: {
    titulo: 'Valeria & Santiago · Nos casamos',
    descripcion: 'Sábado 17 de abril de 2027 · Hacienda Los Encinos, Tlajomulco, Jalisco. Confirma tu asistencia aquí.',
    imagen: `${u('1532712938310-34cb3982ef74')}?w=1200&h=630&q=70&fit=crop&auto=format`,
  },
}
