import {
  Component, computed, DestroyRef, inject, OnInit, signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import {
  catchError, debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { ForumService } from '../../core/services/forum.service';
import { ForumRealtimeService } from '../../core/services/forum-realtime.service';
import { Topicos } from '../../core/interfaces/forum.interface';
import { ForumCardComponent } from './forum-card/forum-card.component';
import { ForumPaginationComponent } from './forum-pagination/forum-pagination.component';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [RouterLink, ForumCardComponent, ForumPaginationComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.css',
})
export class ForumComponent implements OnInit {
  private destroyRef    = inject(DestroyRef);
  private forumService  = inject(ForumService);
  private authService   = inject(AuthService);
  private realtimeService = inject(ForumRealtimeService);

  // --- Estado UI ---
  isLoggedIn    = signal(false);
  isLoading     = signal(true);
  hasError      = signal(false);
  userRole      = signal<string | null>(null);

  canPublish = computed(() => {
    const r = this.userRole();
    return r === 'ROLE_ADMIN' || r === 'ROLE_ESCRITOR';
  });

  // --- Estado de datos ---
  topics        = signal<Topicos[]>([]);
  totalPaginas  = signal(0);
  totalElementos = signal(0);
  paginaActual  = signal(0);           // 0-indexed (Spring)

  // --- Filtros ---
  categoriaActiva = signal('todos');
  searchQuery     = signal('');

  // --- Buffer de nuevos tópicos vía WebSocket ---
  newTopicsBuffer = signal<Topicos[]>([]);

  // --- Constantes ---
  readonly PAGE_SIZE = 6;
  readonly CATEGORIAS = ['todos', 'Anuncio', 'Evento', 'Noticia', 'Educación'];

  // --- Streams privados ---
  private readonly searchInput$ = new Subject<string>();
  private readonly loadRequest$ = new Subject<{ query: string; page: number }>();

  // --- Estado derivado ---
  topicosVisibles = computed(() => {
    const cat = this.categoriaActiva();
    const all = this.topics();
    return cat === 'todos' ? all : all.filter(t => t.topicoCategoria === cat);
  });

  hasPendingNew = computed(() => this.newTopicsBuffer().length > 0);

  ngOnInit(): void {
    // 1. Sesión
    this.authService.currentUser$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(user => {
      this.isLoggedIn.set(!!user);
      this.userRole.set(user?.role ?? null);
    });

    // 2. Pipeline de carga unificado (soporta búsqueda y paginación)
    this.loadRequest$.pipe(
      switchMap(({ query, page }) => {
        this.isLoading.set(true);
        this.hasError.set(false);
        this.paginaActual.set(page);

        const source$ = query.trim()
          ? this.forumService.searchTopicos(query, page, this.PAGE_SIZE)
          : this.forumService.getTopicos(page, this.PAGE_SIZE);

        return source$.pipe(
          catchError(() => {
            this.hasError.set(true);
            this.isLoading.set(false);
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(resp => {
      this.topics.set(resp.contenido);
      this.totalPaginas.set(resp.totalPaginas);
      this.totalElementos.set(resp.totalElementos);
      this.isLoading.set(false);
    });

    // 3. Búsqueda con debounce → redirige al pipeline
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(q => {
      this.searchQuery.set(q);
      this.loadRequest$.next({ query: q, page: 0 });
    });

    // 4. WebSocket → buffer de nuevos tópicos
    this.realtimeService.newTopic$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(topic => this.newTopicsBuffer.update(p => [topic, ...p]));

    // 5. Carga inicial
    this.loadRequest$.next({ query: '', page: 0 });
  }

  // --- Acciones ---

  onSearch(e: Event): void {
    this.searchInput$.next((e.target as HTMLInputElement).value);
  }

  onCategoria(cat: string): void {
    this.categoriaActiva.set(cat);
  }

  onPageChange(page: number): void {
    this.loadRequest$.next({ query: this.searchQuery(), page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showNewTopics(): void {
    this.topics.update(prev => [...this.newTopicsBuffer(), ...prev]);
    this.newTopicsBuffer.set([]);
  }
}
