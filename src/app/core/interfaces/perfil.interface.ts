export interface DatosActualizarPerfil {
  usuarioNombre?: string;
  usuarioEmail?:  string;
  usuarioGenero?: string;
  usuarioNacimiento?: string | null;
}

export interface DatosCambiarContrasena {
  contrasenaActual:  string;
  nuevaContrasena:   string;
}

export interface DatosDesactivarCuenta {
  contrasena: string;
}

export interface InscripcionResumen {
  inscripcionId:    number;
  topicoId:         number;
  topicoTitulo:     string;
  topicoResumen:    string;
  topicoImagen:     string | null;
  topicoCategoria:  string | null;
  topicoFechaEvento: string | null;
  topicoActivo:     boolean;
  fechaInscripcion: string;
}
