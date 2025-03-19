import { Component, inject, Input, OnInit } from '@angular/core';
import { ForumService, Respuestas, Topicos } from '../../../core/services/forum.service';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topic',
  imports: [CommonModule, FormsModule],
  templateUrl: './topic.component.html',
  styleUrl: './topic.component.css'
})
export class TopicComponent implements OnInit {
  topicoId: number = 1;
  topicoAutor: string = "alvaro220900";
  
  topico: Topicos | null = null;
  comentarios: Respuestas[] = [];
  nuevoComentario: string = '';
  isLoading = true;
  error: string | null = null;
  formularioComentario: FormGroup | undefined;
  private fb = inject(FormBuilder);
  
  private topicService = inject(ForumService);
  
  ngOnInit(): void {
    this.cargarTopico();
    this.cargarComentarios();
  }
  
  cargarTopico(): void {
    if (!this.topicoId) return;
    
    this.isLoading = true;
    this.topicService.getTopicosId(this.topicoId).then((topico) => {
      this.topico = topico;
      this.isLoading = false;
      })
      .catch((err) => {
        this.error = 'Error al cargar el tópico';
        this.isLoading = false;
        console.error(err);
      });
  }
  
  cargarComentarios(): void {
    if (!this.topicoId) return;
    
    this.topicService.getComentarios(this.topicoId).then(
      (comentarios) => {
        this.comentarios = comentarios;
      })
      .catch(
        (err) => {
          console.error('Error al cargar comentarios:', err);
    });
  }
  
  agregarComentario(): void {
    if (!this.nuevoComentario.trim() || !this.topicoId) return;
    
    const nuevoComentario: Respuestas = {
      respuestaAutor: this.topicoAutor,
      respuestaMensaje: this.nuevoComentario,
      respuestaFecha: new Date(),
      respuestaTopico: this.topicoId
    };
    
    this.topicService.agregarComentario(nuevoComentario)
      .then((comentarioGuardado) => {
        this.comentarios.push(comentarioGuardado || nuevoComentario);
      })
      .catch(error => {
        console.error('Error al agregar comentario:', error);
      });
  }
  
  formatFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
