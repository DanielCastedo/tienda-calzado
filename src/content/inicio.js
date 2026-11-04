/* ============================================================================
   PÁGINA DE INICIO
   Edita aquí los textos e imágenes del slider principal.

   Cada slide tiene:
     etiqueta    -> texto pequeño de arriba           ("Calzados Andino")
     titulo      -> primera palabra en blanco          ("Tienda")
     resaltado   -> texto en naranja junto al título  ("Suministro - Mayorista")
     subtitulo   -> segunda línea en blanco            ("de arreglos de Calzado")
     descripcion -> párrafo
     imagen      -> ruta dentro de /public. Ej: coloca el archivo en
                    public/images/mi-zapato.png y escribe '/images/mi-zapato.png'
     imagenAlt   -> descripción de la imagen (accesibilidad y SEO)

   Para agregar un slide copia un bloque { ... } completo; para quitarlo, bórralo.
   ============================================================================ */

export const inicio = {
  // Número del slide que se muestra al abrir la página (empieza en 1).
  slideInicial: 2,

  // Segundos entre cada cambio automático. Usa 0 para desactivarlo.
  segundosPorSlide: 7,

  textoBoton: 'PRODUCTOS',

  slides: [
    {
      etiqueta: 'Calzados Andino',
      titulo: 'Fábrica',
      resaltado: 'Hecho a mano',
      subtitulo: 'calzado boliviano',
      descripcion:
        'Cada par se fabrica en nuestro taller con cuero seleccionado y procesos artesanales que garantizan durabilidad y un acabado impecable.',
      imagen: '/images/zapato-hero.png',
      imagenAlt: 'Zapato de cuero marrón hecho a mano',
    },
    {
      etiqueta: 'Calzados Andino',
      titulo: 'Tienda',
      resaltado: 'Suministro - Mayorista',
      subtitulo: 'de arreglos de Calzado',
      descripcion:
        'Somos un negocio familiar boliviano dedicado a la fabricación y venta de calzado de calidad, combinando diseño, comodidad y resistencia. Trabajamos con materiales de primera y mano de obra especializada para ofrecer zapatos que se adaptan al estilo y necesidades de nuestros clientes.',
      imagen: '/images/zapato-hero.png',
      imagenAlt: 'Zapato formal de cuero marrón con cordones',
    },
    {
      etiqueta: 'Calzados Andino',
      titulo: 'Ventas',
      resaltado: 'Por mayor',
      subtitulo: 'para todo el país',
      descripcion:
        'Precios especiales para tiendas y distribuidores. Realizamos envíos a todos los departamentos de Bolivia con atención personalizada.',
      imagen: '/images/zapato-hero.png',
      imagenAlt: 'Par de zapatos de cuero para venta mayorista',
    },
    {
      etiqueta: 'Calzados Andino',
      titulo: 'Servicio',
      resaltado: 'Reparación',
      subtitulo: 'y arreglos de Calzado',
      descripcion:
        'Devolvemos la vida a tus zapatos: cambio de suelas, costuras, tapas y renovación de cuero con la misma calidad de fábrica.',
      imagen: '/images/zapato-hero.png',
      imagenAlt: 'Zapato de cuero restaurado',
    },
  ],
}
