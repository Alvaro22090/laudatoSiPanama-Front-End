import { Component, ElementRef, HostListener, Input, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ZONAS_PASTORALES, ZonaPastoral } from '../../../core/data/parroquias.data';

function quitarAcentos(texto: string): string {
  const sinAcentos = texto
    .normalize('NFD')
    .split('')
    .filter(ch => {
      const codigo = ch.charCodeAt(0);
      const esDiacritico = codigo >= 768 && codigo <= 879; // rango de marcas diacriticas combinantes
      return !esDiacritico;
    })
    .join('');
  return sinAcentos.toLowerCase();
}

@Component({
  selector: 'app-parroquia-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parroquia-select.component.html',
  styleUrl: './parroquia-select.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ParroquiaSelectComponent),
      multi: true
    }
  ]
})
export class ParroquiaSelectComponent implements ControlValueAccessor {
  @Input() placeholder = 'Selecciona tu parroquia';

  readonly zonas: ZonaPastoral[] = ZONAS_PASTORALES;

  abierto = signal(false);
  busqueda = signal('');
  valorSeleccionado = signal<string | null>(null);
  deshabilitado = signal(false);

  zonasFiltradas = computed(() => {
    const termino = quitarAcentos(this.busqueda().trim());
    if (!termino) return this.zonas;

    return this.zonas
      .map(z => ({
        zona: z.zona,
        vicarias: z.vicarias
          .map(v => ({
            vicaria: v.vicaria,
            parroquias: v.parroquias.filter(p => quitarAcentos(p).includes(termino))
          }))
          .filter(v => v.parroquias.length > 0)
      }))
      .filter(z => z.vicarias.length > 0);
  });

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  writeValue(value: string | null): void {
    this.valorSeleccionado.set(value ?? null);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.deshabilitado.set(isDisabled);
  }

  abrir(): void {
    if (this.deshabilitado()) return;
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
    this.busqueda.set('');
    this.onTouched();
  }

  seleccionar(parroquia: string): void {
    this.valorSeleccionado.set(parroquia);
    this.onChange(parroquia);
    this.cerrar();
  }

  limpiar(event: Event): void {
    event.stopPropagation();
    this.valorSeleccionado.set(null);
    this.onChange(null);
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent): void {
    if (this.abierto() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.cerrar();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.abierto()) this.cerrar();
  }
}
