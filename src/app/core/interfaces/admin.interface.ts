export type RolBackend = 'ADMIN' | 'ESCRITOR' | 'USUARIO';

export interface DatosAdminUsuario {
  usuarioNombre:     string;
  usuarioId:         string;
  usuarioEmail:      string;
  usuarioRol:        RolBackend;
  solicitudEscritor: boolean;
  activo:            boolean;
}

export interface DatosCrearAdmin {
  usuarioId:         string;
  usuarioNombre:     string;
  usuarioEmail:      string;
  usuarioContrasena: string;
}
