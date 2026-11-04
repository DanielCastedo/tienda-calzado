/* ============================================================================
   DATOS GENERALES DEL SITIO
   Se usan en el header, el footer y el envío de pedidos por WhatsApp.
   ⚠️ Los datos de contacto son de EJEMPLO: reemplázalos por los reales.
   ============================================================================ */

export const sitio = {
  nombre: 'Calzados Andino',
  marca: 'ANDINO',
  lema: 'camina con identidad',

  // Texto del menú principal (las rutas no se cambian aquí).
  menu: {
    inicio: 'Inicio',
    nosotros: 'Nosotros',
    productos: 'Productos',
    pedidos: 'Pedidos',
    ingresar: 'Ingresar',
  },
  buscadorPlaceholder: 'Buscar Productos',

  // Indicador de la esquina inferior derecha del inicio.
  pais: 'BOL',
  idioma: 'ES',

  contacto: {
    // WhatsApp: solo números, con código de país (591 = Bolivia). Ej: '59171234567'
    whatsapp: '59177788862',
    telefono: '+591 77788862',
    email: 'ventas@calzadosandino.com',
    direccion: 'La Paz, Bolivia',
    horario: 'Lunes a sábado, 8:00 a 19:00',
  },

  // Deja la URL vacía ('') para ocultar una red social.
  redes: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    tiktok: '',
  },

  pieDePagina: 'Fabricamos calzado boliviano de calidad, hecho a mano por manos expertas.',
}
