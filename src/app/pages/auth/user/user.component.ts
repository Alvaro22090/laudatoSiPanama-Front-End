import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationData } from '../../../core/interfaces/user-data.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private readonly userService  = inject(UserService);
  private readonly loginService = inject(AuthService);

  usuarioInformacion: ApplicationData = {
    usuarioNombre: '',
    usuarioId: '',
    usuarioEmail: '',
    usuarioContraseña: '',
    usuarioNacimiento: null,
    usuarioGenero: '',
    usuarioPerfil: null
  };

  ngOnInit(): void {
    // currentUser$ es BehaviorSubject — emite el valor actual de forma síncrona.
    // La llamada a getUserById va dentro del subscribe para evitar race conditions.
    this.loginService.currentUser$.subscribe(user => {
      if (user?.user) {
        this.userService.getUserById(user.user).then(info => {
          this.usuarioInformacion = info;
        });
      }
    });
  }

  getInitials(): string {
    const nombre = this.usuarioInformacion.usuarioNombre;
    if (!nombre) return '';
    const names = nombre.split(' ');
    return names.length === 1
      ? names[0].charAt(0).toUpperCase()
      : (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}
