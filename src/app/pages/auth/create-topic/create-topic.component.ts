import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginServiceService } from '../../../core/services/login-service.service';
import { ForumService, TopicData } from '../../../core/services/forum.service';

@Component({
  selector: 'app-create-topic',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css'
})
export class CreateTopicComponent {
  selectedFile: File | null = null;
  registroTopico: FormGroup;
  imagenPreview: string | null = null;
  userId: string | undefined;
  token: string | undefined;

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  user = inject(LoginServiceService);
  topico = inject(ForumService);


  constructor() { 
    this.registroTopico = this.formBuilder.group({
      topicoTitulo: ['', [Validators.required]],
      topicoResumen: ['', [Validators.required]],
      topicoImagen: [null, [Validators.required]]
    }); 
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
  
  submitTopico() {
    if (this.registroTopico.invalid) {
      this.registroTopico.markAllAsTouched();
      return;
    }
    if (this.userId && this.token){
      const topico: TopicData = {
        topicoAutor: this.userId,
        topicoTitulo: this.registroTopico.value.topicoTitulo,
        topicoResumen: this.registroTopico.value.topicoResumen,
        topicoImagen: this.selectedFile
      };
  
      // Aquí normalmente habría un servicio para enviar los datos al backend
      this.topico.submitApplication(topico, this.token);
      console.log('Tópico enviado:', topico);
      
      // Reinicio del formulario
      this.registroTopico.reset();
      this.selectedFile = null;
      this.imagenPreview = null;
      
      // Navegación a la página principal o de tópicos
      this.router.navigate(['/foro']);
    }
    
  }

  ngOnInit(): void {
    this.user.currentUser$.subscribe((user) => {
      this.userId = user?.user;
      this.token = user?.jwTtoken;
    });
  }
}

