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
        // Solo XHR — el transporte websocket de SockJS falla en el browser
        // (handshake exitoso por curl pero falla desde el cliente, posiblemente
        // por el subprotocolo que sockjs-client negocia). XHR-streaming mantiene
        // long-polling persistente: latencia comparable y conexión estable.
        // Los iframe-* quedan excluidos por X-Frame-Options: DENY cross-origin.
        webSocketFactory: () => new SockJS(`${environment.wsUrl}`, null, {
          transports: ['xhr-streaming', 'xhr-polling'],
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
