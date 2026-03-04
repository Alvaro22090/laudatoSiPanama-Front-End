import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginaTopicoRespuesta, TopicData, Topicos } from '../interfaces/forum.interface';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly http    = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/topicos`;

  /** Lista paginada de tópicos (endpoint público) */
  getTopicos(page = 0, size = 6, sort = 'topicoFecha,desc'): Observable<PaginaTopicoRespuesta> {
    return this.http.get<PaginaTopicoRespuesta>(this.baseUrl, {
      params: { page, size, sort }
    });
  }

  /** Búsqueda full-text con debounce aplicado en el componente (endpoint público) */
  searchTopicos(query: string, page = 0, size = 6): Observable<PaginaTopicoRespuesta> {
    return this.http.get<PaginaTopicoRespuesta>(`${this.baseUrl}/search`, {
      params: { q: query, page, size }
    });
  }

  /** Detalle de un tópico por ID (endpoint público) */
  getTopicoPorId(id: number): Observable<Topicos> {
    return this.http.get<Topicos>(`${this.baseUrl}/${id}`);
  }

  /** Subida de imagen para el contenido del editor (requiere auth — interceptor añade el token) */
  uploadContentImage(imageFile: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);
    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/contenido/upload-image`, formData);
  }

  /** Publicación de un nuevo tópico (requiere auth — interceptor añade el token) */
  submitTopico(topico: TopicData): Observable<Topicos> {
    const payload = { ...topico };
    const imagen  = payload.topicoImagen;
    delete payload.topicoImagen;

    const formData = new FormData();
    formData.append('topicoData', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (imagen) formData.append('topicoImagen', imagen);

    return this.http.post<Topicos>(this.baseUrl, formData);
  }
}
