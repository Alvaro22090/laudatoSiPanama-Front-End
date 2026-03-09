import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {

  private readonly contactService = inject(ContactService);

  contactForm!: FormGroup;
  enviando: boolean = false;
  enviado: boolean = false;
  errorEnvio: string = '';

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      'name':    new FormControl(null, Validators.required),
      'email':   new FormControl(null, [Validators.required, Validators.email]),
      'subject': new FormControl(null, Validators.required),
      'message': new FormControl(null, [Validators.required, Validators.minLength(10)])
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.errorEnvio = '';

    try {
      await firstValueFrom(this.contactService.enviarMensaje({
        nombre:  this.contactForm.value.name,
        email:   this.contactForm.value.email,
        asunto:  this.contactForm.value.subject,
        mensaje: this.contactForm.value.message
      }));
      this.enviado = true;
      this.contactForm.reset();
    } catch {
      this.errorEnvio = 'No se pudo enviar el mensaje. Por favor inténtalo de nuevo más tarde.';
    } finally {
      this.enviando = false;
    }
  }

  nuevoMensaje(): void {
    this.enviado = false;
    this.errorEnvio = '';
  }
}
