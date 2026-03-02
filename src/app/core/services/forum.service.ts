import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginaTopicoRespuesta, TopicData, Topicos } from '../interfaces/forum.interface';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly baseUrl = `${environment.apiUrl}/topicos`;

  /** Lista paginada de tópicos */
  getTopicos(
    page = 0,
    size = 6,
    sort = 'topicoFecha,desc'
  ): Observable<PaginaTopicoRespuesta> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&sort=${encodeURIComponent(sort)}`;
    return from(
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Error ${res.status} al cargar tópicos`);
          return res.json() as Promise<PaginaTopicoRespuesta>;
        })
    );
  }

  /** Búsqueda full-text en el servidor con debounce aplicado en el componente */
  searchTopicos(query: string, page = 0, size = 6): Observable<PaginaTopicoRespuesta> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`;
    return from(
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Error ${res.status} en la búsqueda`);
          return res.json() as Promise<PaginaTopicoRespuesta>;
        })
    );
  }

  /** Detalle de un tópico por ID */
  getTopicoPorId(id: number): Observable<Topicos> {
    return from(
      fetch(`${this.baseUrl}/${id}`)
        .then(res => {
          if (!res.ok) throw new Error(`Tópico #${id} no encontrado`);
          return res.json() as Promise<Topicos>;
        })
    );
  }

  /** Subida de imagen para el contenido del editor */
  uploadContentImage(imageFile: File, token: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);
    return from(
      fetch(`${this.baseUrl}/contenido/upload-image`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error('Error al subir la imagen');
        return res.json() as Promise<{ imageUrl: string }>;
      })
    );
  }

  /** Publicación de un nuevo tópico */
  submitTopico(topico: TopicData, token: string): Observable<void> {
    const payload = { ...topico };
    const imagen = payload.topicoImagen;
    delete payload.topicoImagen;

    const formData = new FormData();
    formData.append('topicoData', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (imagen) formData.append('topicoImagen', imagen);

    return from(
      fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error('Error al publicar el tópico');
      })
    );
  }
}
