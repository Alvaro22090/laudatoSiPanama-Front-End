import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  applicationUrl: string = 'https://intelligent-flow-production.up.railway.app/usuarios';


  async submitApplication(usuario: ApplicationData): Promise<void> {

    const formData = new FormData();
    const usuarioData = {...usuario};
    const imagenPerfil = usuarioData.usuarioPerfil;
    console.log(imagenPerfil);
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
    console.log('Aplicación enviada con éxito: ', result);
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
  usuarioPerfil?: File | null;
}
