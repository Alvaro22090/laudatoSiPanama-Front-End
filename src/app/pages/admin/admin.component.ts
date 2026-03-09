import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { DatosAdminUsuario, DatosCrearAdmin, RolBackend } from '../../core/interfaces/admin.interface';
import { Topicos } from '../../core/interfaces/forum.interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  seccion     = signal<'usuarios' | 'topicos'>('usuarios');

  // ── Usuarios ───────────────────────────────────────────────────────────────
  usuarios    = signal<DatosAdminUsuario[]>([]);
  isLoading   = signal(true);
  hasError    = signal(false);
  filtro      = signal<'todos' | 'solicitudes' | 'inactivos'>('todos');
  feedback    = signal<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);

  // ── Tópicos ────────────────────────────────────────────────────────────────
  topicos           = signal<Topicos[]>([]);
  cargandoTopicos   = signal(false);
  errorTopicos      = signal(false);
  filtroTopicos     = signal<'todos' | 'activos' | 'inactivos'>('todos');

  /** IDs de operaciones en curso: formato `{usuarioId}:{accion}` */
  loadingOps  = signal<Set<string>>(new Set());

  /** Formulario de nuevo admin */
  mostrarFormAdmin   = signal(false);
  cargandoNuevoAdmin = signal(false);
  formAdmin: DatosCrearAdmin = { usuarioId: '', usuarioNombre: '', usuarioEmail: '', usuarioContrasena: '' };
  formError = signal<string | null>(null);

  usuariosFiltrados = computed(() => {
    const lista = this.usuarios();
    if (this.filtro() === 'solicitudes') return lista.filter(u => u.solicitudEscritor);
    if (this.filtro() === 'inactivos')   return lista.filter(u => !u.activo);
    return lista;
  });

  topicosFiltrados = computed(() => {
    const lista = this.topicos();
    if (this.filtroTopicos() === 'activos')   return lista.filter(t => t.activo);
    if (this.filtroTopicos() === 'inactivos') return lista.filter(t => !t.activo);
    return lista;
  });

  pendientes      = computed(() => this.usuarios().filter(u => u.solicitudEscritor).length);
  totalAdmins     = computed(() => this.usuarios().filter(u => u.usuarioRol === 'ADMIN').length);
  totalEscritores = computed(() => this.usuarios().filter(u => u.usuarioRol === 'ESCRITOR').length);
  totalInactivos  = computed(() => this.usuarios().filter(u => !u.activo).length);
  totalTopicosActivos   = computed(() => this.topicos().filter(t =>  t.activo).length);
  totalTopicosInactivos = computed(() => this.topicos().filter(t => !t.activo).length);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cambiarSeccion(s: 'usuarios' | 'topicos'): void {
    this.seccion.set(s);
    if (s === 'topicos' && this.topicos().length === 0) this.cargarTopicos();
  }

  cargarUsuarios(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.adminService.getUsuarios().subscribe({
      next:  usuarios => { this.usuarios.set(usuarios); this.isLoading.set(false); },
      error: ()       => { this.hasError.set(true);     this.isLoading.set(false); }
    });
  }

  // ── Loading helpers ───────────────────────────────────────────────────────

  isOp(usuarioId: string, accion: string): boolean {
    return this.loadingOps().has(`${usuarioId}:${accion}`);
  }

  isOpTopico(topicoId: number): boolean {
    return this.loadingOps().has(`topico-${topicoId}`);
  }

  private startOp(usuarioId: string, accion: string): void {
    this.loadingOps.update(s => { const n = new Set(s); n.add(`${usuarioId}:${accion}`); return n; });
  }

  private endOp(usuarioId: string, accion: string): void {
    this.loadingOps.update(s => { const n = new Set(s); n.delete(`${usuarioId}:${accion}`); return n; });
  }

  // ── Acciones de usuario ───────────────────────────────────────────────────

  async cambiarRol(usuarioId: string, nuevoRol: RolBackend): Promise<void> {
    const op = `rol-${nuevoRol}`;
    if (this.isOp(usuarioId, op)) return;
    this.startOp(usuarioId, op);
    try {
      await firstValueFrom(this.adminService.cambiarRol(usuarioId, nuevoRol));
      this.usuarios.update(lista =>
        lista.map(u => u.usuarioId === usuarioId
          ? { ...u, usuarioRol: nuevoRol, solicitudEscritor: false }
          : u)
      );
      this.mostrarFeedback('ok', `Rol de ${usuarioId} actualizado a ${nuevoRol}.`);
    } catch {
      this.mostrarFeedback('error', 'No se pudo cambiar el rol. Intenta de nuevo.');
    } finally {
      this.endOp(usuarioId, op);
    }
  }

  async rechazarSolicitud(usuarioId: string): Promise<void> {
    if (this.isOp(usuarioId, 'rechazar')) return;
    this.startOp(usuarioId, 'rechazar');
    try {
      await firstValueFrom(this.adminService.rechazarSolicitud(usuarioId));
      this.usuarios.update(lista =>
        lista.map(u => u.usuarioId === usuarioId ? { ...u, solicitudEscritor: false } : u)
      );
      this.mostrarFeedback('ok', `Solicitud de ${usuarioId} rechazada.`);
    } catch {
      this.mostrarFeedback('error', 'No se pudo rechazar la solicitud.');
    } finally {
      this.endOp(usuarioId, 'rechazar');
    }
  }

  async eliminarUsuario(usuarioId: string): Promise<void> {
    if (this.isOp(usuarioId, 'eliminar')) return;
    if (!confirm(`¿Eliminar al usuario "${usuarioId}"? Esta acción no se puede deshacer.`)) return;
    this.startOp(usuarioId, 'eliminar');
    try {
      await firstValueFrom(this.adminService.eliminarUsuario(usuarioId));
      this.usuarios.update(lista => lista.filter(u => u.usuarioId !== usuarioId));
      this.mostrarFeedback('ok', `Usuario ${usuarioId} eliminado.`);
    } catch {
      this.mostrarFeedback('error', 'No se pudo eliminar el usuario.');
    } finally {
      this.endOp(usuarioId, 'eliminar');
    }
  }

  // ── Crear admin ───────────────────────────────────────────────────────────

  toggleFormAdmin(): void {
    this.mostrarFormAdmin.update(v => !v);
    if (!this.mostrarFormAdmin()) this.resetFormAdmin();
  }

  private resetFormAdmin(): void {
    this.formAdmin = { usuarioId: '', usuarioNombre: '', usuarioEmail: '', usuarioContrasena: '' };
    this.formError.set(null);
  }

  async submitCrearAdmin(): Promise<void> {
    if (this.cargandoNuevoAdmin()) return;
    this.formError.set(null);

    if (!this.formAdmin.usuarioId.trim() || !this.formAdmin.usuarioNombre.trim() ||
        !this.formAdmin.usuarioEmail.trim() || !this.formAdmin.usuarioContrasena.trim()) {
      this.formError.set('Todos los campos son obligatorios.');
      return;
    }
    if (this.formAdmin.usuarioContrasena.length < 6) {
      this.formError.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.cargandoNuevoAdmin.set(true);
    try {
      const nuevo = await firstValueFrom(this.adminService.crearAdmin(this.formAdmin));
      this.usuarios.update(lista => [...lista, nuevo]);
      this.mostrarFeedback('ok', `Administrador "${nuevo.usuarioNombre}" creado exitosamente.`);
      this.mostrarFormAdmin.set(false);
      this.resetFormAdmin();
    } catch (err: any) {
      const msg = err?.error?.message ?? 'No se pudo crear el administrador.';
      this.formError.set(msg);
    } finally {
      this.cargandoNuevoAdmin.set(false);
    }
  }

  // ── Toggle activo usuario ─────────────────────────────────────────────────

  async toggleActivoUsuario(usuarioId: string): Promise<void> {
    if (this.isOp(usuarioId, 'toggle-activo')) return;
    this.startOp(usuarioId, 'toggle-activo');
    try {
      const { activo } = await firstValueFrom(this.adminService.toggleActivoUsuario(usuarioId));
      this.usuarios.update(lista =>
        lista.map(u => u.usuarioId === usuarioId ? { ...u, activo } : u)
      );
      this.mostrarFeedback('ok', `Usuario ${usuarioId} ${activo ? 'activado' : 'desactivado'}.`);
    } catch (e: any) {
      this.mostrarFeedback('error', e?.error?.message ?? 'No se pudo cambiar el estado.');
    } finally {
      this.endOp(usuarioId, 'toggle-activo');
    }
  }

  // ── Tópicos ────────────────────────────────────────────────────────────────

  cargarTopicos(): void {
    this.cargandoTopicos.set(true);
    this.errorTopicos.set(false);
    this.adminService.getTopicosAdmin().subscribe({
      next:  t  => { this.topicos.set(t);      this.cargandoTopicos.set(false); },
      error: () => { this.errorTopicos.set(true); this.cargandoTopicos.set(false); }
    });
  }

  async toggleActivoTopico(topicoId: number): Promise<void> {
    const op = `topico-${topicoId}`;
    if (this.loadingOps().has(op)) return;
    this.loadingOps.update(s => { const n = new Set(s); n.add(op); return n; });
    try {
      const actualizado = await firstValueFrom(this.adminService.toggleActivoTopico(topicoId));
      this.topicos.update(lista =>
        lista.map(t => t.topicoId === topicoId ? { ...t, activo: actualizado.activo } : t)
      );
      this.mostrarFeedback('ok', `Tópico "${actualizado.topicoTitulo}" ${actualizado.activo ? 'activado' : 'desactivado'}.`);
    } catch {
      this.mostrarFeedback('error', 'No se pudo cambiar el estado del tópico.');
    } finally {
      this.loadingOps.update(s => { const n = new Set(s); n.delete(op); return n; });
    }
  }

  // ── Filtro ────────────────────────────────────────────────────────────────

  setFiltro(f: 'todos' | 'solicitudes' | 'inactivos'): void {
    this.filtro.set(f);
  }

  private mostrarFeedback(tipo: 'ok' | 'error', mensaje: string): void {
    this.feedback.set({ tipo, mensaje });
    setTimeout(() => this.feedback.set(null), 4000);
  }
}
