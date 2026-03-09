import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilUsuario } from '../../../core/interfaces/perfil-usuario.interface';
import { ROLES } from '../../../core/interfaces/user.interface';
import { DatosActualizarPerfil, DatosCambiarContrasena, DatosDesactivarCuenta, InscripcionResumen } from '../../../core/interfaces/perfil.interface';
import { Topicos } from '../../../core/interfaces/forum.interface';

type Tab = 'perfil' | 'seguridad' | 'actividades' | 'topicos';

@Component({
  selector: 'app-user',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private readonly userService   = inject(UserService);
  protected readonly authService = inject(AuthService);
  protected readonly ROLES       = ROLES;

  // ── Estado general ──────────────────────────────────────────────────────────
  usuarioInformacion: PerfilUsuario = {
    usuarioNombre: '', usuarioId: '', usuarioEmail: '',
    usuarioNacimiento: null, usuarioGenero: '', usuarioPerfil: null
  };

  tabActiva = signal<Tab>('perfil');
  cargando  = signal(true);

  // ── Perfil editable ─────────────────────────────────────────────────────────
  modoEdicion      = signal(false);
  guardandoPerfil  = signal(false);
  perfilError      = signal('');
  perfilOk         = signal('');
  formPerfil: DatosActualizarPerfil = { usuarioNombre: '', usuarioEmail: '', usuarioGenero: '', usuarioNacimiento: null };

  // ── Solicitar escritor ──────────────────────────────────────────────────────
  solicitudEnviada = false;
  solicitudError   = '';
  solicitudLoading = false;

  // ── Cambiar contraseña ──────────────────────────────────────────────────────
  guardandoContrasena = signal(false);
  contrasenaError     = signal('');
  contrasenaOk        = signal('');
  formContrasena: DatosCambiarContrasena = { contrasenaActual: '', nuevaContrasena: '' };
  confirmarNueva = '';

  // ── Desactivar cuenta ──────────────────────────────────────────────────────
  mostrarConfirmDesactivar = signal(false);
  desactivandoCuenta       = signal(false);
  desactivarError          = signal('');
  formDesactivar: DatosDesactivarCuenta = { contrasena: '' };

  // ── Actividades ─────────────────────────────────────────────────────────────
  inscripciones     = signal<InscripcionResumen[]>([]);
  cargandoActividades = signal(false);

  // ── Mis tópicos ─────────────────────────────────────────────────────────────
  misTopicos          = signal<Topicos[]>([]);
  cargandoTopicos     = signal(false);

  // ── Init ────────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user?.user) {
        this.userService.getUserById(user.user).then(info => {
          this.usuarioInformacion = info;
          this.resetFormPerfil();
          this.cargando.set(false);
        });
      }
    });
  }

  // ── Navegación por pestañas ─────────────────────────────────────────────────
  cambiarTab(tab: Tab): void {
    this.tabActiva.set(tab);
    this.modoEdicion.set(false);
    this.perfilError.set('');
    this.perfilOk.set('');
    this.contrasenaError.set('');
    this.contrasenaOk.set('');
    this.mostrarConfirmDesactivar.set(false);
    if (tab === 'actividades' && this.inscripciones().length === 0) this.cargarActividades();
    if (tab === 'topicos'     && this.misTopicos().length === 0)     this.cargarMisTopicos();
  }

  // ── Perfil ──────────────────────────────────────────────────────────────────
  getInitials(): string {
    const nombre = this.usuarioInformacion.usuarioNombre;
    if (!nombre) return '';
    const parts = nombre.split(' ');
    return parts.length === 1
      ? parts[0].charAt(0).toUpperCase()
      : (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  activarEdicion(): void {
    this.resetFormPerfil();
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.perfilError.set('');
    this.perfilOk.set('');
  }

  private resetFormPerfil(): void {
    this.formPerfil = {
      usuarioNombre:    this.usuarioInformacion.usuarioNombre,
      usuarioEmail:     this.usuarioInformacion.usuarioEmail,
      usuarioGenero:    this.usuarioInformacion.usuarioGenero,
      usuarioNacimiento: this.usuarioInformacion.usuarioNacimiento
    };
  }

  async guardarPerfil(): Promise<void> {
    this.guardandoPerfil.set(true);
    this.perfilError.set('');
    this.perfilOk.set('');
    try {
      const actualizado = await this.userService.actualizarPerfil(this.formPerfil);
      this.usuarioInformacion = { ...this.usuarioInformacion, ...actualizado };
      this.modoEdicion.set(false);
      this.perfilOk.set('Perfil actualizado correctamente.');
      setTimeout(() => this.perfilOk.set(''), 4000);
    } catch (e: any) {
      this.perfilError.set(e?.error?.mensaje ?? 'Error al actualizar el perfil.');
    } finally {
      this.guardandoPerfil.set(false);
    }
  }

  async solicitarEscritor(): Promise<void> {
    this.solicitudLoading = true;
    this.solicitudError   = '';
    try {
      await this.userService.solicitarEscritor();
      this.solicitudEnviada = true;
    } catch (e: any) {
      this.solicitudError = e?.error?.mensaje ?? 'Error al enviar la solicitud. Intenta más tarde.';
    } finally {
      this.solicitudLoading = false;
    }
  }

  // ── Seguridad ───────────────────────────────────────────────────────────────
  async cambiarContrasena(): Promise<void> {
    this.contrasenaError.set('');
    this.contrasenaOk.set('');
    if (this.formContrasena.nuevaContrasena !== this.confirmarNueva) {
      this.contrasenaError.set('Las contraseñas nuevas no coinciden.');
      return;
    }
    this.guardandoContrasena.set(true);
    try {
      await this.userService.cambiarContrasena(this.formContrasena);
      this.contrasenaOk.set('Contraseña cambiada correctamente.');
      this.formContrasena = { contrasenaActual: '', nuevaContrasena: '' };
      this.confirmarNueva = '';
      setTimeout(() => this.contrasenaOk.set(''), 4000);
    } catch (e: any) {
      this.contrasenaError.set(e?.error?.mensaje ?? 'Error al cambiar la contraseña.');
    } finally {
      this.guardandoContrasena.set(false);
    }
  }

  async desactivarCuenta(): Promise<void> {
    this.desactivarError.set('');
    this.desactivandoCuenta.set(true);
    try {
      await this.userService.desactivarCuenta(this.formDesactivar);
      this.authService.logout();
    } catch (e: any) {
      this.desactivarError.set(e?.error?.mensaje ?? 'Error al desactivar la cuenta.');
    } finally {
      this.desactivandoCuenta.set(false);
    }
  }

  // ── Actividades ─────────────────────────────────────────────────────────────
  private async cargarActividades(): Promise<void> {
    this.cargandoActividades.set(true);
    try {
      this.inscripciones.set(await this.userService.getInscripciones());
    } catch { /* silencioso */ }
    finally { this.cargandoActividades.set(false); }
  }

  async desinscribirse(topicoId: number): Promise<void> {
    try {
      await this.userService.desinscribirse(topicoId);
      this.inscripciones.update(list => list.filter(i => i.topicoId !== topicoId));
    } catch { /* silencioso */ }
  }

  // ── Mis tópicos ─────────────────────────────────────────────────────────────
  private async cargarMisTopicos(): Promise<void> {
    this.cargandoTopicos.set(true);
    try {
      this.misTopicos.set(await this.userService.getMisTopicos());
    } catch { /* silencioso */ }
    finally { this.cargandoTopicos.set(false); }
  }
}
