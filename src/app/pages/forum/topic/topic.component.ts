import {
  Component, computed, DestroyRef, inject, OnInit, signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';

import { ForumService } from '../../../core/services/forum.service';
import { Topicos } from '../../../core/interfaces/forum.interface';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
})
export class TopicComponent implements OnInit {
  private destroyRef   = inject(DestroyRef);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private sanitizer    = inject(DomSanitizer);
  private forumService = inject(ForumService);

  topic     = signal<Topicos | null>(null);
  isLoading = signal(true);
  hasError  = signal(false);

  safeContent = computed<SafeHtml>(() => {
    const c = this.topic()?.topicoContenido;
    return c ? this.sanitizer.bypassSecurityTrustHtml(c) : '';
  });

  isEvent = computed(() => !!this.topic()?.topicoFechaEvento);

  readingTime = computed(() => {
    const text  = this.topic()?.topicoContenido ?? '';
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min de lectura`;
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading.set(true);
        this.hasError.set(false);
        return this.forumService.getTopicoPorId(id);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.topic.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/foro']);
  }

  copiarEnlace(): void {
    const id = this.topic()?.topicoId;
    if (!id) return;
    navigator.clipboard
      .writeText(`${window.location.origin}/foro/${id}`)
      .then(() => alert('Enlace copiado'));
  }

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  formatEventDate(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
