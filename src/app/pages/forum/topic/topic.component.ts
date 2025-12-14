import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Topicos } from '../../../core/services/forum.service';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent {
  private sanitizer = inject(DomSanitizer);

  topicSignal = signal<Topicos | null>(null);
  
  @Input({ required: true }) set topicData(value: Topicos | null) {
    this.topicSignal.set(value);
  }

  @Output() closeDetail = new EventEmitter<void>();

  // 1. Sanitización
  safeContent = computed<SafeHtml>(() => {
    const content = this.topicSignal()?.topicoContenido;
    return content ? this.sanitizer.bypassSecurityTrustHtml(content) : '';
  });

  // 2. NUEVO: Detectar si es un evento futuro
  isEvent = computed(() => {
    const fechaEvento = this.topicSignal()?.topicoFechaEvento;
    return !!fechaEvento; // Retorna true si existe fecha de evento
  });

  // 3. NUEVO: Calcular tiempo de lectura estimado basado en el contenido
  readingTime = computed(() => {
    const text = this.topicSignal()?.topicoContenido || '';
    const wordsPerMinute = 200;
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min de lectura`;
  });

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  // Formato específico para eventos (ej: Sábado, 12 de Agosto)
  formatEventDate(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
  }

  // 4. NUEVO: Acción para "Compartir" usando el ID
  shareTopic() {
    const id = this.topicSignal()?.topicoId;
    if(id) {
      // Aquí podrías copiar al portapapeles la URL actual + el ID
      const url = `${window.location.origin}/topic/${id}`; 
      navigator.clipboard.writeText(url).then(() => alert('Enlace copiado al portapapeles'));
    }
  }

  onClose() {
    this.closeDetail.emit();
  }
}