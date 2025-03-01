import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApplicationData, UserServiceService } from '../../../core/services/user-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  selectedFile: File | null = null;
  registroUsuario: FormGroup;
  imagenPreview: string | null = null;

  componentService = inject(UserServiceService);
  registro = inject(FormBuilder);

  constructor() { 
    this.registroUsuario = this.registro.group({
      usuarioNombre: ['',[Validators.required, Validators.minLength(3)]],
      usuarioId: ['',[Validators.required, Validators.minLength(3)]],
      usuarioEmail: ['',[Validators.required, Validators.email]],
      usuarioContraseña: ['',[Validators.required, this.passwordValidator()]],
      usuarioConfirmar: '',
      usuarioNacimiento: null,
      usuarioGenero: null,
      usuarioPerfil: null,
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }); 
    this.registroUsuario.addValidators(this.getPasswordMatchValidator());
  }
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
  
      if (!value) {
        return null;
      }
  
      const hasNumber = /[0-9]/.test(value);
      const hasLetter = /[a-zA-Z]/.test(value);
      const isValid = value.length >= 8 && hasNumber && hasLetter;
  
      return isValid ? null : { passwordStrength: true };
    };
  }
  getPasswordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control as FormGroup;
      const password = form.get('usuarioContraseña')?.value;
      const confirmPassword = form.get('usuarioConfirmar')?.value;
      
      if (password === confirmPassword) {
        return null;
      }
      
      return { passwordMismatch: true };
    };
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const fileNameElement = document.querySelector('.file-name');
      if (fileNameElement) {
        fileNameElement.textContent = file.name;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  
  submitUsuario() {
    if (this.registroUsuario.invalid) {
      this.registroUsuario.markAllAsTouched();
      return;
    }
    const usuario: ApplicationData = {
      usuarioNombre: this.registroUsuario.value.usuarioNombre,
      usuarioId: this.registroUsuario.value.usuarioId,
      usuarioEmail: this.registroUsuario.value.usuarioEmail,
      usuarioContraseña: this.registroUsuario.value.usuarioContraseña,
      usuarioNacimiento: this.registroUsuario.value.usuarioNacimiento ?? null,
      usuarioGenero: this.registroUsuario.value.usuarioGenero ?? '',
      usuarioPerfil: this.selectedFile ?? null
    };

    this.componentService.submitApplication(usuario);
    console.log(this.registroUsuario.value);
    this.registroUsuario.reset();
    this.selectedFile = null;
    this.imagenPreview = null;
  }
}
