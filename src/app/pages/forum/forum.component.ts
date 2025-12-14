import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LoginServiceService, User } from '../../core/services/login-service.service';
import { RouterLink } from '@angular/router';
import { ForumService, Topicos } from '../../core/services/forum.service';
import { TopicComponent } from '../forum/topic/topic.component';


@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, RouterLink, TopicComponent], // Agregamos TopicComponent
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css'
})
export class ForumComponent implements OnInit {
  private loginService = inject(LoginServiceService);
  private forumService = inject(ForumService);

  isLoggedIn = signal(false);
  currentUser = signal<User | null>(null);
  
  // Lista de tópicos
  private topics = signal<Topicos[]>([]);
  
  // Tópico Seleccionado (Controla la vista)
  selectedTopic = signal<Topicos | null>(null);

  // Filtros y Paginación
  filtro = signal('');
  paginaActual = signal(1);
  readonly elementosPorPagina = 6;

  // Estado Derivado
  topicosFiltrados = computed(() => {
    const texto = this.filtro().toLowerCase();
    return this.topics().filter(t => t.topicoTitulo.toLowerCase().includes(texto));
  });
  
  numeroTotalDePaginas = computed(() => Math.ceil(this.topicosFiltrados().length / this.elementosPorPagina));
  
  topicosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.elementosPorPagina;
    return this.topicosFiltrados().slice(inicio, inicio + this.elementosPorPagina);
  });

  ngOnInit(): void {
    this.loginService.currentUser$.subscribe(user => {
      this.isLoggedIn.set(!!user);
      this.currentUser.set(user);
    });

    this.forumService.getTopicos().then(data => {
      // Ordenar por fecha (opcional)
      this.topics.set(data.reverse()); 
    });
  }

  // --- Lógica de Selección ---
  selectTopic(topic: Topicos) {
    this.selectedTopic.set(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearSelection() {
    this.selectedTopic.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Utilidades ---
  onFiltroChange(e: Event) {
    this.filtro.set((e.target as HTMLInputElement).value);
    this.paginaActual.set(1);
  }
  
  cambiarPagina(p: number) {
    if (p > 0 && p <= this.numeroTotalDePaginas()) this.paginaActual.set(p);
  }

  formatDate(dateStr: string | Date): string {
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}