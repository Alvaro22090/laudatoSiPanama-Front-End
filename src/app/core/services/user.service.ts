import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationData } from '../interfaces/user-data.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http           = inject(HttpClient);
  private readonly applicationUrl = `${environment.apiUrl}/registros`;
  private readonly userUrl        = `${environment.apiUrl}/usuarios`;

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

  /** Perfil completo del usuario (requiere auth — interceptor añade el token) */
  async getUserById(usuarioId: string): Promise<ApplicationData> {
    return firstValueFrom(this.http.get<ApplicationData>(`${this.userUrl}/${usuarioId}`));
  }
}
