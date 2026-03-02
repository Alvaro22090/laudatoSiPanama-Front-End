export interface ApplicationData {
  usuarioNombre: string;
  usuarioId: string;
  usuarioEmail: string;
  usuarioContraseña: string;
  usuarioNacimiento: Date | null;
  usuarioGenero: string;
  usuarioPerfil?: File | null;
}
