import {
  Component, computed, DestroyRef, inject, OnInit, signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { switchMap } from 'rxjs/operators';

import { ForumService } from '../../../core/services/forum.service';
import { AuthService }  from '../../../core/services/auth.service';
import { UserService }  from '../../../core/services/user.service';
import { Topicos } from '../../../core/interfaces/forum.interface';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css',
})
export class TopicComponent implements OnInit {
  private destroyRef   = inject(DestroyRef);
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  private sanitizer    = inject(DomSanitizer);
  private forumService = inject(ForumService);
  private authService  = inject(AuthService);
  private userService  = inject(UserService);

  topic     = signal<Topicos | null>(null);
  isLoading = signal(true);
  hasError  = signal(false);

  isLoggedIn    = signal(false);
  yaInscrito    = signal(false);
  inscribiendose = signal(false);
  inscripcionMsg = signal('');

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
    this.authService.currentUser$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.isLoggedIn.set(!!user);
    });

    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.isLoading.set(true);
        this.hasError.set(false);
        this.yaInscrito.set(false);
        this.inscripcionMsg.set('');
        return this.forumService.getTopicoPorId(id);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.topic.set(data);
        this.isLoading.set(false);
        if (data.topicoFechaEvento && this.isLoggedIn()) {
          this.checkInscripcion(data.topicoId);
        }
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private async checkInscripcion(topicoId: number): Promise<void> {
    try {
      const inscrito = await this.userService.estaInscrito(topicoId);
      this.yaInscrito.set(inscrito);
    } catch {
      // Si falla (ej. no autenticado), ignorar
    }
  }

  async toggleInscripcion(): Promise<void> {
    const id = this.topic()?.topicoId;
    if (!id || this.inscribiendose()) return;

    this.inscribiendose.set(true);
    this.inscripcionMsg.set('');
    try {
      if (this.yaInscrito()) {
        await this.userService.desinscribirse(id);
        this.yaInscrito.set(false);
        this.inscripcionMsg.set('Te has desinscrito del evento.');
      } else {
        await this.userService.inscribirse(id);
        this.yaInscrito.set(true);
        this.inscripcionMsg.set('¡Inscripción confirmada! Puedes verla en tu perfil.');
      }
    } catch {
      this.inscripcionMsg.set('Ocurrió un error. Intenta de nuevo.');
    } finally {
      this.inscribiendose.set(false);
    }
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
      weekday: 'long', day: 'numeric', month: 'long'
    });
  }
}
