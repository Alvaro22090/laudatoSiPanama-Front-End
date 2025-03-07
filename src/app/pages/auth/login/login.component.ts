import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { LoginData, LoginServiceService } from '../../../core/services/login-service.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  nombreUsuario: string = '';
  mostrarModal: boolean = false;
  loginUsuario: FormGroup;
  login = inject(FormBuilder);
  router = inject(Router);
  loginService = inject(LoginServiceService);

  constructor() {
    this.loginUsuario = this.login.group({
      usuarioId: ['', Validators.required],
      usuarioContrasena: ['', Validators.required]
    });
  }

  submitLogin() {
    if (this.loginUsuario.invalid) {
      this.loginUsuario.markAllAsTouched();
      return;
    }
    const usuario: LoginData = {
      usuarioId: this.loginUsuario.value.usuarioId,
      usuarioContrasena: this.loginUsuario.value.usuarioContrasena
    }
    this.loginService.submitLogin(usuario).then(() => {
      this.mostrarModal = false;
      this.router.navigate(['']); // Redirige después de iniciar sesión
    }).catch((error) => {
      alert('Error en el inicio de sesión: ' + error.message);
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.mostrarModal = false;
      }
    });
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['']); // Redirige a la página principal
    }
  }

  cerrarSesion(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  cerrarModalExterno(event: MouseEvent): void {
    const modal = document.getElementById('login-modal');
    if (event.target === modal) {
      this.cerrarModal();
    }
  }
}

