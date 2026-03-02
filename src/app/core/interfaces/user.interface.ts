export interface User {
  role: string;
  user: string;
  jwTtoken: string;
}

export interface LoginData {
  usuarioId: string;
  usuarioContrasena: string;
}
