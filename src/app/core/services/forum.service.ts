import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl: string = environment.apiUrl;
  private applicationUrl: string = `${this.apiUrl}/topicos`;

  async getTopicos(): Promise<Topicos[]> {
    const data = await fetch(this.applicationUrl, {
      method: 'GET',
    });
    return (await data.json()) ?? [];
  }

  async getTopicosId(topicoId: number): Promise<Topicos> {
    const data = await fetch(`${this.applicationUrl}/${topicoId}`, {
      method: 'GET',
    });
    return (await data.json()) ?? {};
  }
  
  uploadContentImage(imageFile: File, token: string): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', imageFile, imageFile.name);

    const promise = fetch(`${this.applicationUrl}/contenido/upload-image`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Error en la subida de la imagen.');
      }
      return response.json();
    });

    return from(promise); // Convierte la Promise de fetch en un Observable
  }

  async submitApplication(topico: TopicData, token: string): Promise<void> {
    const formData = new FormData();
    const topicoData = { ...topico };
    const topicoImagen = topicoData.topicoImagen;
    delete topicoData.topicoImagen;

    formData.append('topicoData', new Blob([JSON.stringify(topicoData)], { type: 'application/json' }));
    
    if (topicoImagen) {
      formData.append('topicoImagen', topicoImagen);
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const response = await fetch(this.applicationUrl, {
      method: 'POST',
      body: formData,
      headers: headers
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error del servidor:", errorBody);
      throw new Error('Error al enviar el tópico');
    }

    console.log('Tópico enviado con éxito');
  }
  
  constructor() { }
}

export interface TopicData {
  topicoTitulo: string;
  topicoAutor: string;
  topicoResumen: string;
  topicoCategoria?: string; // Nuevo
  topicoFechaEvento?: string;
  topicoImagen?: File | null;
  topicoContenido: string;
}

export interface Topicos{
  topicoId: number;
  topicoTitulo: string;
  topicoAutor: string;
  topicoCategoria?: string;
  topicoFecha: Date;
  topicoFechaEvento?: Date;
  topicoResumen: string;
  topicoImagen: string;
  topicoContenido: string;
}
