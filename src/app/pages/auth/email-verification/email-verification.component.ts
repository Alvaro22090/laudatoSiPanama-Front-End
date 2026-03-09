import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

type Estado = 'cargando' | 'exito' | 'error';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './email-verification.component.html',
  styleUrl: './email-verification.component.css'
})
export class EmailVerificationComponent implements OnInit {
  private readonly route       = inject(ActivatedRoute);
  private readonly userService = inject(UserService);

  estado: Estado = 'cargando';
  mensajeError: string = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.estado = 'error';
      this.mensajeError = 'El enlace de verificación no es válido o está incompleto.';
      return;
    }

    this.userService.verificarEmail(token)
      .then(() => {
        this.estado = 'exito';
      })
      .catch(() => {
        this.estado = 'error';
        this.mensajeError = 'El enlace de verificación es inválido o ya fue utilizado anteriormente.';
      });
  }
}
