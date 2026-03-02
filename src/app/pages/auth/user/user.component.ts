import {Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
export class UserComponent implements OnInit{
  route: ActivatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  loginService = inject(AuthService)
  userId: string | undefined;
  token: string | undefined;
  usuarioInformacion: ApplicationData = {
    usuarioNombre: '',
    usuarioId: '',
    usuarioEmail: '',
    usuarioContraseña: '',
    usuarioNacimiento: null,
    usuarioGenero: '',
    usuarioPerfil: null
  };
  constructor() {
  }
  ngOnInit(): void {
    this.loginService.currentUser$.subscribe((user) => {
      this.userId = user?.user;
      this.token = user?.jwTtoken;
    });
    if (this.userId && this.token){
      this.userService.getUserById(this.userId, this.token).then((usuarioInformacion) => {
        this.usuarioInformacion = usuarioInformacion;
    })
    }
  }
  getInitials(): string {
    if (!this.usuarioInformacion.usuarioNombre) return '';
    
    const names = this.usuarioInformacion.usuarioNombre.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
}
