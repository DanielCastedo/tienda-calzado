/* ============================================================================
   PÁGINA NOSOTROS
   ⚠️ Las cifras y los años de la historia son de EJEMPLO: cámbialos por los reales.
   ============================================================================ */

export const nosotros = {
  encabezado: {
    etiqueta: 'Nosotros',
    titulo: 'Somos',
    resaltado: 'Calzados Andino',
    descripcion:
      'Un negocio familiar boliviano que fabrica, vende y repara calzado de calidad. Unimos la tradición artesanal con diseños actuales para que cada paso tenga identidad.',
    imagen: '/images/zapato-hero.png',
    imagenAlt: 'Zapato de cuero fabricado por Calzados Andino',
  },

  // Números destacados (EJEMPLO).
  cifras: [
    { valor: '+20', etiqueta: 'años de experiencia' },
    { valor: '+5.000', etiqueta: 'pares al mes' },
    { valor: '9', etiqueta: 'departamentos atendidos' },
    { valor: '100%', etiqueta: 'hecho en Bolivia' },
  ],

  mision: {
    titulo: 'Misión',
    texto:
      'Fabricar y comercializar calzado cómodo, resistente y con diseño, ofreciendo precios justos a familias, tiendas y distribuidores de todo el país.',
  },
  vision: {
    titulo: 'Visión',
    texto:
      'Ser la marca boliviana de calzado de referencia por su calidad artesanal, llevando nuestra identidad andina a cada rincón del país y más allá.',
  },

  // Iconos disponibles: 'calidad', 'artesania', 'familia', 'cliente', 'envio', 'reparacion'
  valoresTitulo: 'Nuestros valores',
  valores: [
    { icono: 'calidad', titulo: 'Calidad', texto: 'Seleccionamos cuero y materiales de primera en cada par.' },
    { icono: 'artesania', titulo: 'Artesanía', texto: 'Mano de obra especializada con años de oficio.' },
    { icono: 'familia', titulo: 'Familia', texto: 'Un negocio familiar que trata a cada cliente como parte de la casa.' },
    { icono: 'cliente', titulo: 'Compromiso', texto: 'Cumplimos plazos y acompañamos a nuestros clientes mayoristas.' },
  ],

  // Historia (EJEMPLO).
  historiaTitulo: 'Nuestra historia',
  historia: [
    { anio: '2004', titulo: 'Los inicios', texto: 'Abrimos un pequeño taller familiar de reparación de calzado.' },
    { anio: '2010', titulo: 'Fábrica propia', texto: 'Empezamos a fabricar nuestros propios modelos de cuero.' },
    { anio: '2018', titulo: 'Venta mayorista', texto: 'Comenzamos a abastecer a tiendas de distintos departamentos.' },
    { anio: 'Hoy', titulo: 'Andino', texto: 'Seguimos creciendo con la misma pasión por el buen calzado.' },
  ],

  llamado: {
    titulo: '¿Quieres trabajar con nosotros?',
    texto: 'Arma tu pedido en línea y te contactamos por WhatsApp para confirmarlo.',
    boton: 'HACER UN PEDIDO',
  },
}
