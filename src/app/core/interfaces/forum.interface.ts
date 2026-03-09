export interface TopicData {
  topicoTitulo: string;
  topicoAutor: string;
  topicoResumen: string;
  topicoCategoria?: string;
  topicoFechaEvento?: string | null;
  topicoImagen?: File | null;
  topicoContenido: string;
}

export interface Topicos {
  topicoId: number;
  topicoTitulo: string;
  topicoAutor: string;
  topicoCategoria?: string;
  topicoFecha: Date;
  topicoFechaEvento?: Date;
  topicoResumen: string;
  topicoImagen: string;
  topicoContenido: string;
  activo: boolean;
}

/** Contrato de respuesta paginada del backend */
export interface PaginaTopicoRespuesta {
  contenido: Topicos[];
  totalPaginas: number;
  totalElementos: number;
  esUltimaPagina: boolean;
}
