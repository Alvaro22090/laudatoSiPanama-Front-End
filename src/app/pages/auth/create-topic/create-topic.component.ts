import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginServiceService } from '../../../core/services/login-service.service';
import { ForumService, TopicData } from '../../../core/services/forum.service';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css'
})
export class CreateTopicComponent implements OnInit {
  
  registroTopico: FormGroup;
  selectedMainImageFile: File | null = null;
  mainImagePreview: string | null = null;
  
  userId: string | undefined;
  token: string | undefined;
  
  // Fecha actual para la vista previa (simula topicoFecha)
  creationDate: Date = new Date();

  private formBuilder = inject(FormBuilder);
  public router = inject(Router);
  public loginService = inject(LoginServiceService);
  private forumService = inject(ForumService);

  constructor() { 
    this.registroTopico = this.formBuilder.group({
      topicoTitulo: ['', [Validators.required]],
      topicoCategoria: ['Anuncio', [Validators.required]],
      topicoFechaEvento: [''], 
      topicoContenido: ['', [Validators.required, Validators.minLength(20)]],
      topicoImagen: [null, [Validators.required]]
    }); 
  }

  ngOnInit(): void {
    this.loginService.currentUser$.subscribe((user) => {
      this.userId = user?.user;
      this.token = user?.jwTtoken;
    });
  }

  onMainFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedMainImageFile = file;
      this.registroTopico.patchValue({ topicoImagen: file });
      const reader = new FileReader();
      reader.onload = () => { this.mainImagePreview = reader.result as string; };
      reader.readAsDataURL(file);
    }
  }

  // --- NUEVA LÓGICA EDITOR WYSIWYG ---
  
  // Aplica formato real (Negrita, H3, Lista) sin mostrar etiquetas
  formatDoc(command: string, value: string = ''): void {
    document.execCommand(command, false, value);
    // Es importante volver a poner el foco en el editor
    const editor = document.getElementById('richEditor');
    editor?.focus();
  }

  // Sincroniza el contenido visual del DIV con el FormControl de Angular
  onContentChange(event: Event): void {
    const htmlContent = (event.target as HTMLDivElement).innerHTML;
    this.registroTopico.patchValue({ topicoContenido: htmlContent });
  }

  // --- ENVÍO ---
  submitTopico(): void {
    if (this.registroTopico.invalid) {
      this.registroTopico.markAllAsTouched();
      return;
    }

    if (!this.userId || !this.token) {
      alert("Sesión no válida.");
      return;
    }

    const formData = this.registroTopico.value;

    const topicoData: TopicData = {
      topicoAutor: this.userId,
      topicoTitulo: formData.topicoTitulo,
      topicoCategoria: formData.topicoCategoria,
      topicoFechaEvento: formData.topicoFechaEvento || null,
      topicoResumen: this.stripHtml(formData.topicoContenido).substring(0, 150) + '...',
      topicoImagen: this.selectedMainImageFile,
      topicoContenido: formData.topicoContenido 
    };
    
    this.forumService.submitApplication(topicoData, this.token)
      .then(() => {
        alert('¡Tópico creado con éxito!');
        this.router.navigate(['/foro']);
      })
      .catch(err => {
        console.error(err);
        alert('Error al guardar.');
      });
  }

  // Utilidad para limpiar HTML y crear el resumen texto plano
  private stripHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }
}