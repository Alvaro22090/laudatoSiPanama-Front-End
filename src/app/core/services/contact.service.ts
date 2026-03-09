import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DatosContacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http     = inject(HttpClient);
  private readonly baseUrl  = `${environment.apiUrl}/contacto`;

  enviarMensaje(datos: DatosContacto): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.baseUrl, datos);
  }
}
