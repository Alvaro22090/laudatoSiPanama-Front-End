import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private applicationUrl: string = 'http://localhost:8080/topicos';
  private comentariosUrl: string = 'http://localhost:8080/respuestas';
  
  async submitApplication(topico: TopicData, token: string): Promise<void> {

    const formData = new FormData();
    const topicoData = {...topico};
    const topicoImagen = topicoData.topicoImagen;
    delete topicoData.topicoImagen;
    formData.append('topicoData', new Blob([JSON.stringify(topicoData)], {type: 'application/json'}));
    if (topicoImagen) {
      formData.append('topicoImagen', topicoImagen);
    }
    console.log('Enviando aplicación: ', formData.getAll);
    const headers = {
      'Authorization': `Bearer ${token}` // Encabezado de autorización
    };
    const response = await fetch(this.applicationUrl, {
      method: 'POST',
      body: formData,
      headers: headers
    });
    if (!response.ok) {
      throw new Error('Error al enviar la solicitud');
    }
    const result = await response.json();
    console.log('Aplicación enviada con éxito');
  }

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

  async getComentarios(topicoId: number): Promise<Respuestas[]> {
    const data = await fetch(`${this.comentariosUrl}/${topicoId}`, {
      method: 'GET',
    });
    return (await data.json()) ?? [];
  }
  
  async agregarComentario(comentario: Respuestas): Promise<Respuestas> {
    const response = await fetch(this.comentariosUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(comentario),
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar la solicitud');
    }
    
    // Asumiendo que el backend devuelve el comentario guardado con ID
    const comentarioGuardado = await response.json();
    console.log('Comentario enviado con éxito');
    
    // Devolver el comentario guardado para poder agregarlo a la lista
    return comentarioGuardado;
  }
  
  constructor() { }
}

export interface TopicData {
  topicoTitulo: string;
  topicoAutor: string;
  topicoResumen: string;
  topicoImagen?: File | null;
}

export interface Topicos{
  topicoId: number;
  topicoTitulo: string;
  topicoAutor: string;
  topicoFecha: Date;
  topicoResumen: string;
  topicoImagen: string;
}

export interface Respuestas{
  respuestaAutor: string;
  respuestaMensaje: string;
  respuestaFecha: Date;
  respuestaTopico: number;
}