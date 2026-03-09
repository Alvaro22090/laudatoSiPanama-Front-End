export const ROLES = {
  ADMIN:    'ROLE_ADMIN',
  ESCRITOR: 'ROLE_ESCRITOR',
  USUARIO:  'ROLE_USUARIO',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export interface User {
  role: Role;
  user: string;
  jwTtoken: string;
}

export interface LoginData {
  usuarioId: string;
  usuarioContrasena: string;
}
