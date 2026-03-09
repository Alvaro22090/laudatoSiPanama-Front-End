import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DatosAdminUsuario, DatosCrearAdmin, RolBackend } from '../interfaces/admin.interface';
import { Topicos } from '../interfaces/forum.interface';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http     = inject(HttpClient);
  private readonly adminUrl = `${environment.apiUrl}/admin`;

  getUsuarios(): Observable<DatosAdminUsuario[]> {
    return this.http.get<DatosAdminUsuario[]>(`${this.adminUrl}/usuarios`);
  }

  cambiarRol(usuarioId: string, nuevoRol: RolBackend): Observable<void> {
    return this.http.put<void>(`${this.adminUrl}/usuarios/${usuarioId}/rol`, { nuevoRol });
  }

  rechazarSolicitud(usuarioId: string): Observable<void> {
    return this.http.post<void>(`${this.adminUrl}/usuarios/${usuarioId}/rechazar-escritor`, {});
  }

  eliminarUsuario(usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/usuarios/${usuarioId}`);
  }

  crearAdmin(datos: DatosCrearAdmin): Observable<DatosAdminUsuario> {
    return this.http.post<DatosAdminUsuario>(`${this.adminUrl}/usuarios/nuevo-admin`, datos);
  }

  toggleActivoUsuario(usuarioId: string): Observable<{ activo: boolean }> {
    return this.http.put<{ activo: boolean }>(`${this.adminUrl}/usuarios/${usuarioId}/toggle-activo`, {});
  }

  getTopicosAdmin(): Observable<Topicos[]> {
    return this.http.get<Topicos[]>(`${this.adminUrl}/topicos`);
  }

  toggleActivoTopico(topicoId: number): Observable<Topicos> {
    return this.http.put<Topicos>(`${this.adminUrl}/topicos/${topicoId}/toggle-activo`, {});
  }
}
