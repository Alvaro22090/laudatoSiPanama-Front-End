import {Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  private applicationUrl: string = 'http://localhost:8080/registros';

  async submitApplication(usuario: ApplicationData): Promise<void> {

    const formData = new FormData();
    const usuarioData = {...usuario};
    const imagenPerfil = usuarioData.usuarioPerfil;
    delete usuarioData.usuarioPerfil;
    formData.append('usuarioData', new Blob([JSON.stringify(usuarioData)], {type: 'application/json'}));
    if (imagenPerfil) {
      formData.append('usuarioPerfil', imagenPerfil);
    }
    console.log('Enviando aplicación: ', formData);
    const response = await fetch(this.applicationUrl, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Error al enviar la solicitud');
    }
    const result = await response.json();
    console.log('Aplicación enviada con éxito');
  }

  async getUsers(): Promise<string[]> {
    const data = await fetch(`${this.applicationUrl}/users`, {
      method: 'GET',
    });
    return (await data.json()) ?? [];
  }

  private userUrl: string = 'http://localhost:8080/usuarios'

  async getUserById(usuarioId: string, token: string): Promise<ApplicationData> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json', 
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const data = await fetch(`${this.userUrl}/${usuarioId}`, {
      method: 'GET',
      headers: headers
    });
    return (await data.json()) ?? {};
  }

  constructor() { }
}

export interface ApplicationData {
  usuarioNombre: string;
  usuarioId: string;
  usuarioEmail: string;
  usuarioContraseña: string;
  usuarioNacimiento: Date | null;
  usuarioGenero: string;
  usuarioPerfil?: File | null ;
}

