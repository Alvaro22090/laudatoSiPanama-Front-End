import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forum-pagination',
  standalone: true,
  imports: [],
  templateUrl: './forum-pagination.component.html',
  styleUrl: './forum-pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumPaginationComponent {
  @Input({ required: true }) paginaActual!: number;   // 0-indexed
  @Input({ required: true }) totalPaginas!: number;
  @Input() totalElementos = 0;
  @Output() paginaCambiada = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }

  goTo(page: number): void {
    if (page >= 0 && page < this.totalPaginas && page !== this.paginaActual) {
      this.paginaCambiada.emit(page);
    }
  }

  /** Devuelve un slice de páginas alrededor de la actual para no mostrar demasiadas */
  get visiblePages(): number[] {
    const delta = 2;
    const left  = Math.max(0, this.paginaActual - delta);
    const right = Math.min(this.totalPaginas - 1, this.paginaActual + delta);
    return Array.from({ length: right - left + 1 }, (_, i) => left + i);
  }
}
