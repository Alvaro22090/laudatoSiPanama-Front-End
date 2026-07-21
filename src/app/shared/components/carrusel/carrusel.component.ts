import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IMAGENES_CARRUSEL, CarruselImagen } from './carrusel.data';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent implements OnInit, OnDestroy {
  /** 'tarjeta': carrusel con flechas/dots/leyenda dentro de una tarjeta.
   *  'fondo': carrusel de fondo a pantalla completa, sin controles (para el hero). */
  @Input() variante: 'tarjeta' | 'fondo' = 'tarjeta';

  readonly imagenes: CarruselImagen[] = IMAGENES_CARRUSEL;
  indiceActual = signal(0);

  private intervalId?: ReturnType<typeof setInterval>;
  private readonly INTERVALO_MS = 5000;
  private touchStartX = 0;

  ngOnInit(): void {
    this.iniciarAutoplay();
  }

  ngOnDestroy(): void {
    this.detenerAutoplay();
  }

  iniciarAutoplay(): void {
    this.detenerAutoplay();
    if (this.imagenes.length > 1) {
      this.intervalId = setInterval(() => this.siguiente(), this.INTERVALO_MS);
    }
  }

  detenerAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  siguiente(): void {
    this.indiceActual.update(i => (i + 1) % this.imagenes.length);
  }

  anterior(): void {
    this.indiceActual.update(i => (i - 1 + this.imagenes.length) % this.imagenes.length);
  }

  irA(indice: number): void {
    this.indiceActual.set(indice);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const UMBRAL = 40;
    if (deltaX > UMBRAL) {
      this.anterior();
      this.iniciarAutoplay();
    } else if (deltaX < -UMBRAL) {
      this.siguiente();
      this.iniciarAutoplay();
    }
  }
}
