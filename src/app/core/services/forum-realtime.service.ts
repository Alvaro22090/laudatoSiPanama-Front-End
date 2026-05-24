import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../environments/environment';
import { Topicos } from '../interfaces/forum.interface';

/**
 * Servicio de tiempo real para el foro vía WebSocket (STOMP sobre SockJS).
 */
@Injectable({ providedIn: 'root' })
export class ForumRealtimeService implements OnDestroy {
  /** Emite cada tópico nuevo recibido por WebSocket */
  readonly newTopic$ = new Subject<Topicos>();

  private client: Client | null = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.client = new Client({
        // Excluimos iframe-* (los X-Frame-Options: DENY los bloquea cross-origin).
        // websocket es el preferido; si falla, xhr-streaming/xhr-polling sirven
        // de fallback sin generar errores ruidosos en consola.
        webSocketFactory: () => new SockJS(`${environment.wsUrl}`, null, {
          transports: ['websocket', 'xhr-streaming', 'xhr-polling'],
        }),
        reconnectDelay: 5000,
        onConnect: () => {
          this.client?.subscribe('/topic/new-topic', (msg: { body: string }) => {
            try {
              const topic: Topicos = JSON.parse(msg.body);
              this.newTopic$.next(topic);
            } catch {
              console.warn('[ForumRealtime] No se pudo parsear el mensaje WS');
            }
          });
        },
        onStompError: (frame) =>
          console.error('[ForumRealtime] Error STOMP:', frame),
      });

      this.client.activate();
    } catch (err) {
      console.warn('[ForumRealtime] WebSocket no disponible:', err);
    }
  }

  ngOnDestroy(): void {
    this.client?.deactivate?.();
    this.newTopic$.complete();
  }
}
