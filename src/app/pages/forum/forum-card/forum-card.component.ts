import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Topicos } from '../../../core/interfaces/forum.interface';

@Component({
  selector: 'app-forum-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './forum-card.component.html',
  styleUrl: './forum-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCardComponent {
  @Input({ required: true }) topic!: Topicos;

  formatDate(d: string | Date): string {
    return new Date(d).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  get readingTime(): string {
    const words = (this.topic.topicoResumen || '').split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 40))} min`;
  }

  get categoryClass(): string {
    const map: Record<string, string> = {
      Evento: 'cat--event',
      Noticia: 'cat--news',
      Educación: 'cat--edu',
    };
    return map[this.topic.topicoCategoria ?? ''] ?? 'cat--default';
  }
}
