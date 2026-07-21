export interface CarruselImagen {
  src: string;
  alt: string;
  /** object-position CSS para la variante "fondo" del hero (por defecto 'center'). */
  posicion?: string;
}

/**
 * Imágenes del carrusel de la página de inicio.
 * Los archivos viven en /public/carrusel/ y se sirven como assets estáticos.
 * Para agregar/quitar fotos del carrusel, solo edita este arreglo.
 */
export const IMAGENES_CARRUSEL: CarruselImagen[] = [
  { src: 'carrusel/carrusel-01.jpg', alt: 'Capacitación de agentes pastorales, 2018', posicion: 'center' },
  { src: 'carrusel/carrusel-02.jpg', alt: 'Encuentro comunitario al aire libre', posicion: 'center' },
  { src: 'carrusel/carrusel-03.jpg', alt: 'Encuentro parroquial con la comunidad', posicion: 'center 65%' },
  { src: 'carrusel/carrusel-04.jpg', alt: "Stand informativo Laudato Si' en la USMA", posicion: 'center' },
  { src: 'carrusel/carrusel-05.jpg', alt: "Jornada masiva Laudato Si' Panamá", posicion: 'center' },
  { src: 'carrusel/carrusel-06.jpg', alt: "Equipo de Laudato Si' Panamá", posicion: 'center' },
  { src: 'carrusel/carrusel-07.jpg', alt: 'Marcha por el cuidado de la Casa Común', posicion: 'center' },
  { src: 'carrusel/carrusel-08.jpg', alt: "Stand de Laudato Si' Panamá en feria comunitaria", posicion: 'center' },
  { src: 'carrusel/carrusel-09.jpg', alt: 'Encuentro del Movimiento Panamá Vale Más Sin Minería', posicion: 'center' },
];
