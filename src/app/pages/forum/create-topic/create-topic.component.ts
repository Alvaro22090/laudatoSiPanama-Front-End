import {
  AfterViewInit, Component, DestroyRef, ElementRef,
  inject, OnInit, ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Quill from 'quill';

import { AuthService }  from '../../../core/services/auth.service';
import { ForumService } from '../../../core/services/forum.service';
import { TopicData }    from '../../../core/interfaces/forum.interface';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-topic.component.html',
  styleUrl: './create-topic.component.css',
})
export class CreateTopicComponent implements OnInit, AfterViewInit {
  @ViewChild('quillContainer') quillContainer!: ElementRef<HTMLDivElement>;

  private destroyRef   = inject(DestroyRef);
  private fb           = inject(FormBuilder);
  readonly router      = inject(Router);
  readonly authService = inject(AuthService);
  private forumService = inject(ForumService);

  form!: FormGroup;
  userId?: string;
  token?: string;

  mainImagePreview: string | null = null;
  selectedImage: File | null = null;

  isSubmitting = false;
  submitError  = '';

  readonly today = new Date().toISOString().split('T')[0]; // min para fecha de evento
  readonly creationDate = new Date();

  private quill!: Quill;

  ngOnInit(): void {
    this.form = this.fb.group({
      topicoTitulo:     ['', [Validators.required, Validators.minLength(5)]],
      topicoCategoria:  ['Anuncio', Validators.required],
      topicoFechaEvento: [''],
      topicoContenido:  ['', [Validators.required, Validators.minLength(20)]],
      topicoImagen:     [null, Validators.required],
    });

    this.authService.currentUser$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.userId = user?.user;
      this.token  = user?.jwTtoken;
    });
  }

  ngAfterViewInit(): void {
    if (!this.quillContainer) return;

    this.quill = new Quill(this.quillContainer.nativeElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'link'],
          ['clean'],
        ],
      },
      placeholder: 'Escribe aquí los detalles del anuncio, noticia o evento…',
    });

    this.quill.on('text-change', () => {
      const html = this.quill.root.innerHTML;
      // Considera vacío si Quill sólo tiene el párrafo por defecto
      const value = html === '<p><br></p>' ? '' : html;
      this.form.patchValue({ topicoContenido: value });
      this.form.get('topicoContenido')?.markAsDirty();
    });
  }

  onImageSelected(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedImage = file;
    this.form.patchValue({ topicoImagen: file });

    const reader = new FileReader();
    reader.onload = () => { this.mainImagePreview = reader.result as string; };
    reader.readAsDataURL(file);
  }

  submit(): void {
    if (this.form.invalid || !this.userId || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError  = '';

    const v = this.form.value;
    const topicData: TopicData = {
      topicoAutor:      this.userId,
      topicoTitulo:     v.topicoTitulo,
      topicoCategoria:  v.topicoCategoria,
      topicoFechaEvento: v.topicoFechaEvento || null,
      topicoResumen:    this.stripHtml(v.topicoContenido).substring(0, 150) + '…',
      topicoImagen:     this.selectedImage,
      topicoContenido:  v.topicoContenido,
    };

    this.forumService.submitTopico(topicData).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => this.router.navigate(['/foro']),
      error: () => {
        this.submitError  = 'Hubo un error al publicar. Intenta de nuevo.';
        this.isSubmitting = false;
      }
    });
  }

  private stripHtml(html: string): string {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent ?? d.innerText ?? '';
  }

  // Helpers para el template
  ctrl(name: string) { return this.form.get(name)!; }
  invalid(name: string) {
    const c = this.ctrl(name);
    return c.invalid && (c.dirty || c.touched);
  }
}
