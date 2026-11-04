/* ============================================================================
   PÁGINA PEDIDOS
   El cliente arma su pedido y lo envía por WhatsApp al número de sitio.js.
   ============================================================================ */

export const pedidos = {
  encabezado: {
    etiqueta: 'Pedidos',
    titulo: 'Arma tu',
    resaltado: 'Pedido',
    descripcion:
      'Agrega productos desde el catálogo, completa tus datos y envíanos el pedido por WhatsApp. Te confirmamos disponibilidad y costo de envío.',
  },

  // A partir de esta cantidad de pares se aplica el precio mayorista.
  minimoMayorista: 12,

  pasos: [
    { titulo: 'Elige', texto: 'Selecciona modelos y tallas en el catálogo.' },
    { titulo: 'Revisa', texto: 'Ajusta cantidades y completa tus datos.' },
    { titulo: 'Envía', texto: 'Mándanos el pedido por WhatsApp.' },
    { titulo: 'Recibe', texto: 'Coordinamos pago y entrega contigo.' },
  ],

  resumenTitulo: 'Tu pedido',
  vacioTitulo: 'Tu pedido está vacío',
  vacioTexto: 'Visita el catálogo y agrega los modelos que te interesan.',
  vacioBoton: 'VER PRODUCTOS',
  avisoMayorista: '¡Precio mayorista aplicado!',
  faltanParaMayorista: 'Agrega {n} pares más para obtener precio mayorista.',

  formularioTitulo: 'Tus datos',
  departamentos: ['La Paz', 'El Alto', 'Cochabamba', 'Santa Cruz', 'Oruro', 'Potosí', 'Chuquisaca', 'Tarija', 'Beni', 'Pando'],
  tiposEntrega: ['Recojo en tienda', 'Envío a domicilio', 'Envío por encomienda'],
  botonEnviar: 'ENVIAR POR WHATSAPP',
  enviadoTitulo: '¡Pedido listo!',
  enviadoTexto: 'Se abrió WhatsApp con el detalle de tu pedido. Si no se abrió, pulsa el botón otra vez.',

  // Primera línea del mensaje de WhatsApp.
  saludoWhatsapp: 'Hola Calzados Andino, quiero hacer el siguiente pedido:',

  informacion: [
    { titulo: 'Métodos de pago', texto: 'Transferencia bancaria, QR o efectivo al recoger.' },
    { titulo: 'Envíos', texto: 'Enviamos a todo el país por encomienda. El costo depende del destino.' },
    { titulo: 'Cambios', texto: 'Cambios de talla dentro de los 7 días con el producto sin uso.' },
  ],
}
