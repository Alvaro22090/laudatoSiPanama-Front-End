import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationData } from '../interfaces/user-data.interface';
import { PerfilUsuario } from '../interfaces/perfil-usuario.interface';
import { DatosActualizarPerfil, DatosCambiarContrasena, DatosDesactivarCuenta, InscripcionResumen } from '../interfaces/perfil.interface';
import { Topicos } from '../interfaces/forum.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http           = inject(HttpClient);
  private readonly applicationUrl = `${environment.apiUrl}/registros`;
  private readonly userUrl        = `${environment.apiUrl}/usuarios`;
  private readonly perfilUrl      = `${environment.apiUrl}/perfil`;

  /** Registro de nuevo usuario con imagen de perfil opcional (endpoint público) */
  async submitApplication(usuario: ApplicationData): Promise<void> {
    const formData    = new FormData();
    const usuarioData = { ...usuario };
    const imagen      = usuarioData.usuarioPerfil;
    delete usuarioData.usuarioPerfil;

    formData.append('usuarioData', new Blob([JSON.stringify(usuarioData)], { type: 'application/json' }));
    if (imagen) formData.append('usuarioPerfil', imagen);

    await firstValueFrom(this.http.post<void>(this.applicationUrl, formData));
  }

  /** Lista de IDs de usuario existentes, usada para validación async en registro (endpoint público) */
  async getUsers(): Promise<string[]> {
    return firstValueFrom(this.http.get<string[]>(`${this.applicationUrl}/users`));
  }

  /** Perfil público del usuario (requiere auth — interceptor añade el token) */
  async getUserById(usuarioId: string): Promise<PerfilUsuario> {
    return firstValueFrom(this.http.get<PerfilUsuario>(`${this.userUrl}/${usuarioId}`));
  }

  /** Verifica el email usando el token recibido por correo (endpoint público) */
  async verificarEmail(token: string): Promise<{ mensaje: string }> {
    return firstValueFrom(
      this.http.get<{ mensaje: string }>(`${this.applicationUrl}/verificar`, { params: { token } })
    );
  }

  /** Solicita al admin el rol de ESCRITOR (requiere auth) */
  async solicitarEscritor(): Promise<{ mensaje: string }> {
    return firstValueFrom(
      this.http.post<{ mensaje: string }>(`${this.userUrl}/solicitar-escritor`, {})
    );
  }

  /** Actualizar datos personales */
  async actualizarPerfil(datos: DatosActualizarPerfil): Promise<PerfilUsuario> {
    return firstValueFrom(this.http.put<PerfilUsuario>(this.perfilUrl, datos));
  }

  /** Cambiar contraseña */
  async cambiarContrasena(datos: DatosCambiarContrasena): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.perfilUrl}/contrasena`, datos));
  }

  /** Desactivar cuenta propia */
  async desactivarCuenta(datos: DatosDesactivarCuenta): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.perfilUrl}/desactivar`, datos));
  }

  /** Listar inscripciones del usuario autenticado */
  async getInscripciones(): Promise<InscripcionResumen[]> {
    return firstValueFrom(this.http.get<InscripcionResumen[]>(`${this.perfilUrl}/inscripciones`));
  }

  /** Inscribirse a un evento */
  async inscribirse(topicoId: number): Promise<InscripcionResumen> {
    return firstValueFrom(this.http.post<InscripcionResumen>(`${this.perfilUrl}/inscripciones/${topicoId}`, {}));
  }

  /** Desinscribirse de un evento */
  async desinscribirse(topicoId: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.perfilUrl}/inscripciones/${topicoId}`));
  }

  /** Estado de inscripción en un evento */
  async estaInscrito(topicoId: number): Promise<boolean> {
    const r = await firstValueFrom(this.http.get<{ inscrito: boolean }>(`${this.perfilUrl}/inscripciones/${topicoId}/estado`));
    return r.inscrito;
  }

  /** Tópicos creados por el usuario autenticado */
  async getMisTopicos(): Promise<Topicos[]> {
    return firstValueFrom(this.http.get<Topicos[]>(`${this.perfilUrl}/topicos`));
  }
}
