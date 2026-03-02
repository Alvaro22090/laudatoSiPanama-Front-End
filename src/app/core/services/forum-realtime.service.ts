import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Topicos } from '../interfaces/forum.interface';

/**
 * Servicio de tiempo real para el foro vía WebSocket (STOMP sobre SockJS).
 * Usa imports dinámicos para evitar que @stomp/stompjs y sockjs-client
 * bloqueen la carga del chunk de Angular si el servidor no está disponible.
 */
@Injectable({ providedIn: 'root' })
export class ForumRealtimeService implements OnDestroy {
  /** Emite cada tópico nuevo recibido por WebSocket */
  readonly newTopic$ = new Subject<Topicos>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any = null;

  constructor() {
    this.connectAsync();
  }

  private async connectAsync(): Promise<void> {
    try {
      const { Client }  = await import('@stomp/stompjs');
      const SockJSMod   = await import('sockjs-client');
      // Compatibilidad con default export en distintos entornos de módulo
      const SockJS = (SockJSMod as any).default ?? SockJSMod;

      this.client = new Client({
        webSocketFactory: () => new SockJS(`${environment.wsUrl}`),
        reconnectDelay: 5000,
        onConnect: () => {
          this.client.subscribe('/topic/new-topic', (msg: { body: string }) => {
            try {
              const topic: Topicos = JSON.parse(msg.body);
              this.newTopic$.next(topic);
            } catch {
              console.warn('[ForumRealtime] No se pudo parsear el mensaje WS');
            }
          });
        },
        onStompError: (frame: unknown) =>
          console.error('[ForumRealtime] Error STOMP:', frame),
      });

      this.client.activate();
    } catch (err) {
      // Si el backend no soporta WS o la librería falla, el foro sigue funcionando
      console.warn('[ForumRealtime] WebSocket no disponible:', err);
    }
  }

  ngOnDestroy(): void {
    this.client?.deactivate?.();
    this.newTopic$.complete();
  }
}
